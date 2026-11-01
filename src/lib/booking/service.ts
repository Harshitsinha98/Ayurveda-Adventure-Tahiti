import { addDays, addMinutes, addMonths } from 'date-fns'
import type { Payload } from 'payload'
import { z } from 'zod'

import { isSlotFree } from '@/lib/booking/availability'
import { priceBooking } from '@/lib/booking/pricing'
import {
  cancellationEmail,
  confirmationEmail,
  ownerNotification,
  sendEmail,
  siteUrl,
} from '@/lib/email'
import { cancelPendingPayment, createCheckoutSession, mobupayConfigured, refundPayment, type MobupayEvent } from '@/lib/mobupay'

type Doc = Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any

export class BookingError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message)
  }
}

const idOf = (v: unknown) => (v && typeof v === 'object' ? (v as { id: string | number }).id : (v as string | number))

export const checkoutSchema = z.object({
  type: z.enum(['offering', 'package']).default('offering'),
  offering: z.string().max(120).optional(),
  package: z.string().max(120).optional(),
  occurrence: z.union([z.string(), z.number()]).optional(),
  slotStart: z.string().datetime().optional(),
  priceOption: z.number().int().min(0).nullable().optional(),
  extras: z.array(z.number().int().min(0)).max(10).optional(),
  quantity: z.number().int().min(1).max(20).default(1),
  participants: z.array(z.string().trim().min(1).max(120)).max(20).optional(),
  payment: z.enum(['card', 'transfer', 'credit', 'free']).default('card'),
  timezone: z.string().max(64).optional(),
  message: z.string().max(2000).optional(),
  acceptTerms: z.literal(true),
  newsletter: z.boolean().optional(),
  customer: z.object({
    firstName: z.string().trim().min(1).max(80),
    lastName: z.string().trim().min(1).max(80),
    email: z.string().trim().email().max(160),
    phone: z.string().trim().max(40).optional(),
    country: z.string().trim().max(60).optional(),
  }),
  idempotencyKey: z.string().uuid().optional(),
})

export type CheckoutInput = z.infer<typeof checkoutSchema>

async function upsertCustomer(payload: Payload, c: CheckoutInput['customer'], newsletter?: boolean) {
  const email = c.email.toLowerCase()
  const found = await payload.find({ collection: 'customers', where: { email: { equals: email } }, limit: 1, depth: 0 })
  const data: Doc = { firstName: c.firstName, lastName: c.lastName, phone: c.phone, country: c.country, email }
  if (newsletter) data.newsletter = true
  if (found.docs[0]) {
    const prev = found.docs[0] as Doc
    const groups = Array.from(new Set([...(prev.groups ?? []), 'clients']))
    return payload.update({ collection: 'customers', id: prev.id, data: { ...data, groups }, depth: 0 })
  }
  return payload.create({ collection: 'customers', data: { ...data, groups: ['clients'], source: 'site' } as never, depth: 0 })
}

async function findBySlugOrId(payload: Payload, collection: 'offerings' | 'packages', key: string) {
  const r = await payload.find({
    collection,
    where: { or: [{ slug: { equals: key } }, ...(/^\d+$/.test(key) ? [{ id: { equals: Number(key) } }] : [])] },
    limit: 1,
    depth: 0,
  })
  return r.docs[0] as Doc | undefined
}

/** Create a booking and, for card payments, a Mobupay checkout session. */
export async function createCheckout(payload: Payload, input: CheckoutInput) {
  const settings = (await payload.findGlobal({ slug: 'booking-settings', depth: 0 })) as Doc
  const holdMinutes = Number(settings.holdMinutes ?? 20)
  const customer = (await upsertCustomer(payload, input.customer, input.newsletter)) as Doc

  let offering: Doc | undefined
  let pkg: Doc | undefined
  let occurrence: Doc | undefined
  let slotEnd: string | undefined
  let quote: ReturnType<typeof priceBooking>

  if (input.type === 'package') {
    pkg = input.package ? await findBySlugOrId(payload, 'packages', input.package) : undefined
    if (!pkg || !pkg.published) throw new BookingError('Carnet introuvable', 404)
    const firstOffering = idOf(pkg.appliesTo?.[0])
    offering = firstOffering
      ? ((await payload.findByID({ collection: 'offerings', id: firstOffering, depth: 0 })) as Doc)
      : undefined
    if (!offering) throw new BookingError('Ce carnet n’est relié à aucune séance.', 400)
    quote = priceBooking({ title: pkg.title, price: pkg.price }, { quantity: 1 })
    if (input.payment !== 'card') throw new BookingError('Les carnets se règlent par carte.', 400)
  } else {
    offering = input.offering ? await findBySlugOrId(payload, 'offerings', input.offering) : undefined
    if (!offering || !offering.published) throw new BookingError('Offre introuvable', 404)
    if (offering.bookingMode === 'closed' || offering.bookingMode === 'request')
      throw new BookingError('Cette offre se réserve sur demande.', 400)

    if (offering.kind === 'seance') {
      if (!input.slotStart) throw new BookingError('Choisissez un créneau.', 400)
      const dur = Number(offering.durationMinutes ?? 60)
      if (!(await isSlotFree(payload, dur, input.slotStart))) throw new BookingError('Ce créneau vient d’être réservé. Choisissez-en un autre.', 409)
      slotEnd = addMinutes(new Date(input.slotStart), dur).toISOString()
    } else {
      if (!input.occurrence) throw new BookingError('Choisissez une date.', 400)
      occurrence = (await payload.findByID({ collection: 'occurrences', id: input.occurrence, depth: 0 }).catch(() => null)) as Doc
      if (!occurrence || idOf(occurrence.offering) !== offering.id) throw new BookingError('Date introuvable', 404)
      if (occurrence.status !== 'open' || new Date(occurrence.startsAt) < new Date())
        throw new BookingError('Les inscriptions pour cette date sont closes.', 409)
    }
    quote = priceBooking(offering as never, {
      quantity: input.quantity,
      priceOption: input.priceOption,
      extras: input.extras,
      priceOverride: occurrence?.priceOverride,
    })
  }

  // Payment method rules
  let payment = input.payment
  if (quote.total === 0 || offering.bookingMode === 'free') payment = 'free'
  if (payment === 'transfer' && offering.kind !== 'voyage') throw new BookingError('Le virement est réservé aux voyages.', 400)
  if (payment === 'card' && !mobupayConfigured()) throw new BookingError('Le paiement en ligne n’est pas encore activé.', 503)

  let usedPackage: Doc | undefined
  if (payment === 'credit') {
    if (!offering.creditEligible) throw new BookingError('Cette séance ne peut pas être réglée avec un carnet.', 400)
    const cps = await payload.find({
      collection: 'customer-packages',
      where: {
        and: [{ customer: { equals: customer.id } }, { status: { equals: 'active' } }, { expiresAt: { greater_than: new Date().toISOString() } }],
      },
      depth: 1,
      limit: 20,
    })
    usedPackage = (cps.docs as Doc[]).find(
      (cp) =>
        cp.creditsUsed < cp.creditsTotal &&
        (cp.package?.appliesTo ?? []).map(idOf).includes(offering!.id),
    )
    if (!usedPackage) throw new BookingError('Aucun carnet actif avec des séances restantes pour cet e-mail.', 400)
  }

  const balanceDueDate =
    quote.isDeposit && occurrence?.startsAt && offering.balanceDueDaysBefore != null
      ? addDays(new Date(occurrence.startsAt), -Number(offering.balanceDueDaysBefore)).toISOString()
      : undefined

  const status = payment === 'card' ? 'pending' : 'confirmed'
  const payments =
    payment === 'credit'
      ? [{ kind: 'payment', amount: quote.total, method: 'credit', date: new Date().toISOString(), providerRef: `credit:${usedPackage!.id}` }]
      : []

  const booking = (await payload.create({
    collection: 'bookings',
    depth: 0,
    data: {
      offering: offering.id,
      occurrence: occurrence?.id,
      slotStart: input.slotStart ? new Date(input.slotStart).toISOString() : undefined,
      slotEnd,
      status,
      quantity: quote.quantity,
      participants: (input.participants ?? []).map((name) => ({ name })),
      source: 'online',
      customer: customer.id,
      customerName: `${input.customer.firstName} ${input.customer.lastName}`,
      customerEmail: input.customer.email.toLowerCase(),
      customerPhone: input.customer.phone,
      customerMessage: input.message,
      timezone: input.timezone,
      amountTotal: quote.total,
      amountDueNow: payment === 'card' ? quote.dueNow : 0,
      balanceDueDate,
      lines: quote.lines,
      payments,
      holdExpiresAt: status === 'pending' ? addMinutes(new Date(), holdMinutes).toISOString() : undefined,
      usedPackage: usedPackage?.id,
      purchasedPackage: pkg?.id,
      notes: payment === 'transfer' ? 'Paiement par virement attendu.' : undefined,
    } as never,
  }).catch((err: Error & { status?: number }) => {
    if (/slot_key|slotKey|unique/i.test(err.message)) throw new BookingError('Ce créneau vient d’être réservé. Choisissez-en un autre.', 409)
    if (err.status === 409) throw new BookingError(err.message, 409)
    throw err
  })) as Doc

  if (usedPackage) {
    const used = Number(usedPackage.creditsUsed ?? 0) + 1
    await payload.update({
      collection: 'customer-packages',
      id: usedPackage.id,
      data: { creditsUsed: used, status: used >= usedPackage.creditsTotal ? 'used' : 'active' },
    })
  }

  if (payment !== 'card') {
    await sendConfirmation(payload, booking.id)
    return { booking, redirectUrl: `${siteUrl()}/reservation/${booking.accessToken}` }
  }

  try {
    const session = await createCheckoutSession({
      order: {
        reference: booking.code,
        amount: quote.dueNow,
        currency: 'XPF',
        items: quote.isDeposit
          ? [{ product: `Acompte · ${offering.title}`, unitPrice: quote.dueNow, quantity: 1 }]
          : quote.lines.map((l) => ({ product: l.label, unitPrice: l.unitPrice, quantity: l.quantity })),
        buyer: {
          email: input.customer.email,
          firstName: input.customer.firstName,
          lastName: input.customer.lastName,
          phone: input.customer.phone,
        },
      },
      email: input.customer.email,
      redirectUrl: `${siteUrl()}/reservation/${booking.accessToken}?retour=1`,
      notificationUrl: `${siteUrl()}/api/payments/mobupay/webhook`,
      privateData: { bookingId: String(booking.id), kind: pkg ? 'package' : 'booking' },
      idempotencyKey: input.idempotencyKey ?? `booking-${booking.id}`,
    })
    await payload.update({
      collection: 'bookings',
      id: booking.id,
      data: { mobupayPaymentId: session.paymentId, checkoutUrl: session.checkoutUrl },
      depth: 0,
    })
    return { booking, redirectUrl: session.checkoutUrl }
  } catch (err) {
    await payload.update({ collection: 'bookings', id: booking.id, data: { status: 'expired', notes: 'Échec de création du paiement.' } })
    payload.logger.error({ err, msg: 'Mobupay session failed' })
    throw new BookingError('Le paiement en ligne est momentanément indisponible. Réessayez dans quelques minutes.', 502)
  }
}

export async function loadBookingContext(payload: Payload, id: string | number) {
  const b = (await payload.findByID({ collection: 'bookings', id, depth: 1, overrideAccess: true })) as Doc
  const o = (b.offering ?? {}) as Doc
  const occ = (b.occurrence ?? null) as Doc | null
  return { b, o, startsAt: occ?.startsAt as string | undefined }
}

export async function sendConfirmation(payload: Payload, id: string | number, force = false) {
  const { b, o, startsAt } = await loadBookingContext(payload, id)
  if (b.confirmationSentAt && !force) return
  if (b.customerEmail) {
    const m = confirmationEmail(b as never, o as never, startsAt)
    await sendEmail(payload, { to: b.customerEmail, toName: b.customerName, ...m })
  }
  const settings = (await payload.findGlobal({ slug: 'booking-settings', depth: 0 })) as Doc
  if (settings.notifyEmail && !force) {
    const m = ownerNotification(b as never, o as never, startsAt)
    await sendEmail(payload, { to: settings.notifyEmail, ...m, replyTo: b.customerEmail })
  }
  await payload.update({ collection: 'bookings', id, data: { confirmationSentAt: new Date().toISOString() }, depth: 0 })
}

const amountOf = (e: MobupayEvent) =>
  e.data.originalCurrency === 'XPF' && typeof e.data.grossAmount === 'number'
    ? e.data.grossAmount
    : e.data.currency === 'XPF' && typeof e.data.amount === 'number'
      ? e.data.amount
      : typeof e.data.grossAmount === 'number'
        ? e.data.grossAmount
        : 0

async function findBookingForEvent(payload: Payload, e: MobupayEvent) {
  const pid = e.data.paymentId
  if (pid) {
    const r = await payload.find({ collection: 'bookings', where: { mobupayPaymentId: { equals: pid } }, limit: 1, depth: 0 })
    if (r.docs[0]) return r.docs[0] as Doc
  }
  const priv = (e.data.privateData ?? {}) as { bookingId?: string }
  if (priv.bookingId) {
    const b = await payload.findByID({ collection: 'bookings', id: priv.bookingId, depth: 0 }).catch(() => null)
    if (b) return b as Doc
  }
  const ref = String(e.data.orderReference || e.data.reference || '').replace(/-S\d*$/, '')
  if (ref) {
    const r = await payload.find({ collection: 'bookings', where: { code: { equals: ref } }, limit: 1, depth: 0 })
    if (r.docs[0]) return r.docs[0] as Doc
  }
  return undefined
}

/** Apply a verified Mobupay event. Safe to call several times for the same event. */
export async function applyPaymentEvent(payload: Payload, e: MobupayEvent): Promise<string> {
  const booking = await findBookingForEvent(payload, e)
  if (!booking) return 'no-booking'
  const payments = (booking.payments ?? []) as Doc[]
  const pid = e.data.paymentId

  switch (e.type) {
    case 'payment.captured': {
      if (payments.some((p) => p.providerRef === pid && p.kind === 'payment')) return 'duplicate'
      const amount = amountOf(e)
      const nextPayments = [
        ...payments,
        { kind: 'payment', amount, method: 'online', date: e.createdAt || new Date().toISOString(), providerRef: pid },
      ]
      const wasReleased = booking.status === 'expired' || booking.status === 'cancelled'
      try {
        await payload.update({
          collection: 'bookings',
          id: booking.id,
          data: { payments: nextPayments, status: booking.status === 'completed' ? 'completed' : 'confirmed', holdExpiresAt: null },
          depth: 0,
        })
      } catch (err) {
        if (wasReleased && pid) {
          // Paid after the hold expired and the place is gone: refund automatically.
          await refundPayment(pid, undefined, 'Place non disponible après expiration du délai de paiement', `auto-refund-${pid}`)
          await payload.update({
            collection: 'bookings',
            id: booking.id,
            data: { payments: nextPayments, notes: `${booking.notes ?? ''}\nPayé après expiration : plus de place, remboursement automatique.`.trim() },
          })
          return 'late-payment-refunded'
        }
        throw err
      }
      if (booking.purchasedPackage) {
        const pkg = (await payload.findByID({ collection: 'packages', id: idOf(booking.purchasedPackage), depth: 0 })) as Doc
        const exists = await payload.find({ collection: 'customer-packages', where: { purchaseBooking: { equals: booking.id } }, limit: 1 })
        if (!exists.docs[0])
          await payload.create({
            collection: 'customer-packages',
            data: {
              customer: idOf(booking.customer) as number,
              package: pkg.id,
              creditsTotal: pkg.sessionsCount,
              creditsUsed: 0,
              expiresAt: addMonths(new Date(), Number(pkg.validityMonths ?? 12)).toISOString(),
              status: 'active',
              purchaseBooking: booking.id,
            },
          })
      }
      await sendConfirmation(payload, booking.id)
      return 'paid'
    }
    case 'payment.failed':
    case 'payment.cancelled':
    case 'payment.expired': {
      if (booking.status === 'pending' && booking.mobupayPaymentId === pid) {
        await payload.update({ collection: 'bookings', id: booking.id, data: { status: 'expired', holdExpiresAt: null } })
        return 'released'
      }
      return 'ignored'
    }
    case 'payment.refunded':
    case 'payment.partially_refunded': {
      const ref = e.data.refundId ? `refund:${e.data.refundId}` : `refund:${e.id}`
      if (payments.some((p) => p.providerRef === ref)) return 'duplicate'
      const amount = Number(e.data.refundOriginalAmount ?? 0)
      await payload.update({
        collection: 'bookings',
        id: booking.id,
        data: { payments: [...payments, { kind: 'refund', amount, method: 'online', date: new Date().toISOString(), providerRef: ref }] },
      })
      return 'refund-recorded'
    }
    default:
      return 'ignored'
  }
}

/** Expire unpaid holds and close their checkout. Run by the cron and opportunistically. */
export async function releaseExpiredHolds(payload: Payload) {
  const r = await payload.find({
    collection: 'bookings',
    where: { and: [{ status: { equals: 'pending' } }, { holdExpiresAt: { less_than: new Date().toISOString() } }] },
    limit: 100,
    depth: 0,
  })
  for (const b of r.docs as Doc[]) {
    if (b.mobupayPaymentId) {
      await cancelPendingPayment(b.mobupayPaymentId, `hold-expired-${b.id}`).catch(() => undefined)
    }
    await payload.update({ collection: 'bookings', id: b.id, data: { status: 'expired', holdExpiresAt: null } })
  }
  return r.docs.length
}

export async function cancelAndRefund(payload: Payload, id: string | number, amount?: number) {
  const { b, o } = await loadBookingContext(payload, id)
  const online = ((b.payments ?? []) as Doc[]).filter((p) => p.method === 'online' && p.kind === 'payment' && p.providerRef)
  let refunded = 0
  if (online.length) {
    const target = amount ?? b.amountPaid
    let left = target
    for (const p of online) {
      if (left <= 0) break
      const part = Math.min(left, p.amount)
      await refundPayment(p.providerRef, part === p.amount ? undefined : part, `Annulation ${b.code}`, `refund-${b.id}-${p.providerRef}-${part}`)
      refunded += part
      left -= part
    }
  }
  if (b.usedPackage) {
    const cp = (await payload.findByID({ collection: 'customer-packages', id: idOf(b.usedPackage), depth: 0 })) as Doc
    await payload.update({
      collection: 'customer-packages',
      id: cp.id,
      data: { creditsUsed: Math.max(0, Number(cp.creditsUsed) - 1), status: 'active' },
    })
  }
  await payload.update({ collection: 'bookings', id, data: { status: 'cancelled' } })
  if (b.customerEmail) {
    const m = cancellationEmail(b as never, o as never, refunded)
    await sendEmail(payload, { to: b.customerEmail, ...m })
  }
  return { refunded }
}
