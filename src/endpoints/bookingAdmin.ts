import type { Endpoint, PayloadRequest } from 'payload'

import { isStaff } from '@/access'
import { cancelAndRefund, loadBookingContext, sendConfirmation } from '@/lib/booking/service'
import { balanceEmail, sendEmail, siteUrl } from '@/lib/email'
import { createPaymentLink } from '@/lib/mobupay'

const json = (body: unknown, status = 200) => Response.json(body, { status })

const guard = (req: PayloadRequest) => (isStaff(req.user as never) ? null : json({ error: 'Non autorisé' }, 401))

async function body(req: PayloadRequest) {
  try {
    return (await req.json?.()) ?? {}
  } catch {
    return {}
  }
}

/** Actions available from a booking in the admin dashboard. */
export const bookingEndpoints: Endpoint[] = [
  {
    path: '/:id/refund',
    method: 'post',
    handler: async (req) => {
      const denied = guard(req)
      if (denied) return denied
      const { amount } = (await body(req)) as { amount?: number }
      try {
        const r = await cancelAndRefund(req.payload, String(req.routeParams?.id), amount ? Math.round(amount) : undefined)
        return json({ ok: true, ...r })
      } catch (e) {
        return json({ error: (e as Error).message }, 400)
      }
    },
  },
  {
    path: '/:id/balance-link',
    method: 'post',
    handler: async (req) => {
      const denied = guard(req)
      if (denied) return denied
      const { b, o } = await loadBookingContext(req.payload, String(req.routeParams?.id))
      if (!b.balance) return json({ error: 'Aucun solde à régler.' }, 400)
      try {
        const n = (b.payments?.length ?? 0) + 1
        const link = await createPaymentLink({
          order: { reference: `${b.code}-S${n}`, amount: b.balance, currency: 'XPF', items: [{ product: `Solde · ${o.title}`, unitPrice: b.balance, quantity: 1 }] },
          redirectUrl: `${siteUrl()}/reservation/${b.accessToken}?retour=1`,
          notificationUrl: `${siteUrl()}/api/payments/mobupay/webhook`,
          privateData: { bookingId: String(b.id), kind: 'balance' },
          idempotencyKey: `balance-${b.id}-${n}-${b.balance}`,
        })
        if (b.customerEmail) await sendEmail(req.payload, { to: b.customerEmail, ...balanceEmail(b as never, o as never, link.linkUrl) })
        await req.payload.update({ collection: 'bookings', id: b.id, data: { balanceLinkSentAt: new Date().toISOString() } as never })
        return json({ ok: true, linkUrl: link.linkUrl })
      } catch (e) {
        return json({ error: (e as Error).message }, 502)
      }
    },
  },
  {
    path: '/:id/resend',
    method: 'post',
    handler: async (req) => {
      const denied = guard(req)
      if (denied) return denied
      await sendConfirmation(req.payload, String(req.routeParams?.id), true)
      return json({ ok: true })
    },
  },
]
