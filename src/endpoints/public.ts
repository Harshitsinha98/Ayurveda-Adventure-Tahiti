import { addHours } from 'date-fns'
import type { Endpoint, PayloadRequest } from 'payload'
import { z } from 'zod'

import { getSlots } from '@/lib/booking/availability'
import { applyPaymentEvent, BookingError, checkoutSchema, createCheckout, releaseExpiredHolds } from '@/lib/booking/service'
import { escapeHtml, reminderEmail, sendEmail } from '@/lib/email'
import { verifyWebhook, type MobupayEvent } from '@/lib/mobupay'
import { subscribeToNewsletter } from '@/lib/newsletter'

type Doc = Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any

const json = (body: unknown, status = 200, headers?: HeadersInit) => Response.json(body, { status, headers })

// Small in-memory rate limiter (per instance). Protects forms against bursts.
const hits = new Map<string, { n: number; t: number }>()
function limited(req: PayloadRequest, key: string, max = 10, windowMs = 60_000) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local'
  const k = `${key}:${ip}`
  const now = Date.now()
  const h = hits.get(k)
  if (!h || now - h.t > windowMs) {
    hits.set(k, { n: 1, t: now })
    return false
  }
  h.n++
  return h.n > max
}

async function readJson(req: PayloadRequest) {
  try {
    return await req.json!()
  } catch {
    return null
  }
}

export const publicEndpoints: Endpoint[] = [
  {
    path: '/booking/slots',
    method: 'get',
    handler: async (req) => {
      const slug = String(req.searchParams.get('offering') || '')
      const r = await req.payload.find({ collection: 'offerings', where: { slug: { equals: slug } }, limit: 1, depth: 0 })
      const o = r.docs[0] as Doc | undefined
      if (!o || o.kind !== 'seance' || !o.published) return json({ error: 'Offre introuvable' }, 404)
      await releaseExpiredHolds(req.payload).catch(() => 0)
      const slots = await getSlots(req.payload, Number(o.durationMinutes ?? 60))
      return json({ slots }, 200, { 'Cache-Control': 'no-store' })
    },
  },
  {
    path: '/booking/checkout',
    method: 'post',
    handler: async (req) => {
      if (limited(req, 'checkout', 8)) return json({ error: 'Trop de tentatives. Patientez une minute.' }, 429)
      const parsed = checkoutSchema.safeParse(await readJson(req))
      if (!parsed.success) return json({ error: 'Merci de vérifier le formulaire.', issues: parsed.error.flatten() }, 400)
      try {
        await releaseExpiredHolds(req.payload).catch(() => 0)
        const r = await createCheckout(req.payload, parsed.data)
        return json({ ok: true, redirectUrl: r.redirectUrl, code: r.booking.code })
      } catch (e) {
        if (e instanceof BookingError) return json({ error: e.message }, e.status)
        req.payload.logger.error({ err: e, msg: 'checkout failed' })
        return json({ error: 'Une erreur est survenue. Réessayez ou contactez Eliane.' }, 500)
      }
    },
  },
  {
    path: '/booking/status/:token',
    method: 'get',
    handler: async (req) => {
      const token = String(req.routeParams?.token || '')
      if (!/^[a-f0-9]{32}$/.test(token)) return json({ error: 'Introuvable' }, 404)
      const r = await req.payload.find({ collection: 'bookings', where: { accessToken: { equals: token } }, limit: 1, depth: 0 })
      const b = r.docs[0] as Doc | undefined
      if (!b) return json({ error: 'Introuvable' }, 404)
      return json({ status: b.status, paymentStatus: b.paymentStatus }, 200, { 'Cache-Control': 'no-store' })
    },
  },
  {
    path: '/payments/mobupay/webhook',
    method: 'post',
    handler: async (req) => {
      const raw = await req.text!()
      const secret = process.env.MOBUPAY_WEBHOOK_SECRET
      if (!secret) {
        req.payload.logger.error('MOBUPAY_WEBHOOK_SECRET manquant')
        return json({ error: 'not configured' }, 500)
      }
      if (!verifyWebhook(raw, req.headers, secret)) return json({ error: 'invalid signature' }, 401)
      const event = JSON.parse(raw) as MobupayEvent
      const deliveryId = event.id || req.headers.get('x-mobupay-delivery-id') || ''
      // Idempotency: the unique eventId makes a second delivery a no-op.
      try {
        await req.payload.create({
          collection: 'webhook-events',
          data: { eventId: deliveryId, type: event.type, paymentId: event.data?.paymentId, payload: event as never, result: 'received' },
          overrideAccess: true,
        })
      } catch {
        const prev = await req.payload.find({ collection: 'webhook-events', where: { eventId: { equals: deliveryId } }, limit: 1, overrideAccess: true })
        if ((prev.docs[0] as Doc | undefined)?.result !== 'error') return json({ ok: true, duplicate: true })
      }
      try {
        const result = await applyPaymentEvent(req.payload, event)
        await req.payload.update({ collection: 'webhook-events', where: { eventId: { equals: deliveryId } }, data: { result }, overrideAccess: true })
        return json({ ok: true, result })
      } catch (e) {
        req.payload.logger.error({ err: e, msg: 'webhook processing failed' })
        await req.payload.update({ collection: 'webhook-events', where: { eventId: { equals: deliveryId } }, data: { result: 'error' }, overrideAccess: true })
        return json({ error: 'processing failed' }, 500) // Mobupay will retry
      }
    },
  },
  {
    path: '/newsletter',
    method: 'post',
    handler: async (req) => {
      if (limited(req, 'newsletter', 5)) return json({ error: 'Trop de tentatives.' }, 429)
      const p = z
        .object({ email: z.string().trim().email().max(160), firstName: z.string().trim().max(80).optional(), consent: z.literal(true), source: z.string().max(60).optional() })
        .safeParse(await readJson(req))
      if (!p.success) return json({ error: 'Adresse e-mail invalide ou consentement manquant.' }, 400)
      const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      await subscribeToNewsletter(req.payload, { ...p.data, ip })
      return json({ ok: true })
    },
  },
  {
    path: '/contact',
    method: 'post',
    handler: async (req) => {
      if (limited(req, 'contact', 4)) return json({ error: 'Trop de messages. Réessayez plus tard.' }, 429)
      const p = z
        .object({
          name: z.string().trim().min(2).max(120),
          email: z.string().trim().email().max(160),
          phone: z.string().trim().max(40).optional(),
          subject: z.string().trim().max(160).optional(),
          message: z.string().trim().min(5).max(4000),
          offering: z.string().max(120).optional(),
          website: z.string().max(0).optional(), // honeypot
        })
        .safeParse(await readJson(req))
      if (!p.success) return json({ error: 'Merci de compléter le formulaire.' }, 400)
      const { website: _hp, offering, ...data } = p.data
      let offeringId: number | undefined
      if (offering) {
        const r = await req.payload.find({ collection: 'offerings', where: { slug: { equals: offering } }, limit: 1, depth: 0 })
        offeringId = r.docs[0]?.id as number | undefined
      }
      await req.payload.create({ collection: 'messages', data: { ...data, offering: offeringId }, overrideAccess: true })
      const settings = (await req.payload.findGlobal({ slug: 'booking-settings', depth: 0 })) as Doc
      if (settings.notifyEmail)
        await sendEmail(req.payload, {
          to: settings.notifyEmail,
          replyTo: data.email,
          subject: `Message du site · ${data.subject || data.name}`,
          html: `<p><strong>${escapeHtml(data.name)}</strong> (${escapeHtml(data.email)} ${escapeHtml(data.phone || '')})</p><p style="white-space:pre-wrap">${escapeHtml(data.message)}</p>`,
        })
      return json({ ok: true })
    },
  },
  {
    // Called by Vercel Cron (vercel.json) with Authorization: Bearer CRON_SECRET.
    path: '/cron/bookings',
    method: 'get',
    handler: async (req) => {
      if (!process.env.CRON_SECRET || req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`)
        return json({ error: 'unauthorized' }, 401)
      const payload = req.payload
      const released = await releaseExpiredHolds(payload)
      const settings = (await payload.findGlobal({ slug: 'booking-settings', depth: 0 })) as Doc
      // The cron runs once a day on Vercel Hobby (CRON_INTERVAL_HOURS=24), every 30 min on Pro (0.5).
      // Looking ahead by "reminder hours + interval" makes sure no booking is missed between two runs.
      const interval = Number(process.env.CRON_INTERVAL_HOURS ?? 24)
      const until = addHours(new Date(), Number(settings.reminderHours ?? 24) + interval).toISOString()
      const now = new Date().toISOString()
      let reminders = 0
      const due = await payload.find({
        collection: 'bookings',
        where: { and: [{ status: { equals: 'confirmed' } }, { reminderSentAt: { exists: false } }] },
        depth: 1,
        limit: 200,
      })
      for (const b of due.docs as Doc[]) {
        const start: string | undefined = b.slotStart || b.occurrence?.startsAt
        if (!start || start < now || start > until || !b.customerEmail) continue
        const m = reminderEmail(b as never, b.offering as never, b.occurrence?.startsAt)
        await sendEmail(payload, { to: b.customerEmail, ...m })
        await payload.update({ collection: 'bookings', id: b.id, data: { reminderSentAt: now }, depth: 0 })
        reminders++
      }
      return json({ ok: true, released, reminders })
    },
  },
]
