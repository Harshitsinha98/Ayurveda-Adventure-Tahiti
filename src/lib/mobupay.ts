import crypto from 'node:crypto'

/**
 * Minimal Mobupay client (https://docs.mobupay.nc).
 * - Auth: `Authorization: Bearer sk_test_…` / `sk_live_…` (server side only).
 * - Amounts: integer in the order currency. For XPF, francs (no ×100).
 * - Webhooks: HMAC-SHA256, header X-Mobupay-Signature-V2 = hmac(`${timestamp}.${rawBody}`).
 */
const API = process.env.MOBUPAY_API_URL || 'https://api.mobupay.nc'

export class MobupayError extends Error {
  constructor(
    message: string,
    public status: number,
    public body: unknown,
  ) {
    super(message)
  }
}

const key = () => {
  const k = process.env.MOBUPAY_SECRET_KEY
  if (!k) throw new MobupayError('MOBUPAY_SECRET_KEY manquante', 500, null)
  return k
}

export const mobupayConfigured = () => Boolean(process.env.MOBUPAY_SECRET_KEY)
export const mobupayIsTest = () => (process.env.MOBUPAY_SECRET_KEY || '').startsWith('sk_test_')

async function call<T>(method: 'GET' | 'POST', path: string, body?: unknown, idempotencyKey?: string): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${key()}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  })
  const text = await res.text()
  let json: unknown = null
  try {
    json = text ? JSON.parse(text) : null
  } catch {
    json = text
  }
  if (!res.ok) {
    const msg = (json as { message?: string; error?: { message?: string } })?.message ||
      (json as { error?: { message?: string } })?.error?.message || `Mobupay ${res.status}`
    throw new MobupayError(msg, res.status, json)
  }
  return json as T
}

export type MobupayOrder = {
  reference: string
  amount: number
  currency: 'XPF' | 'EUR'
  items?: Array<{ product: string; unitPrice: number; quantity: number; description?: string }>
  buyer?: { email?: string; firstName?: string; lastName?: string; phone?: string }
}

export type CheckoutSession = {
  paymentId: string
  sessionId: string
  checkoutUrl: string
  expiresAt?: string
}

export function createCheckoutSession(input: {
  order: MobupayOrder
  redirectUrl: string
  notificationUrl: string
  email?: string
  privateData?: Record<string, unknown>
  idempotencyKey: string
}) {
  return call<CheckoutSession>(
    'POST',
    '/api/v1/payments/sessions',
    {
      order: input.order,
      redirectUrl: input.redirectUrl,
      notificationUrl: input.notificationUrl,
      email: input.email,
      languageCode: 'fr',
      captureMode: 'AUTO',
      successPageMode: 'redirect',
      failurePageMode: 'show',
      isInclTaxAmount: true,
      privateData: input.privateData,
    },
    input.idempotencyKey,
  )
}

export function createPaymentLink(input: {
  order: MobupayOrder
  redirectUrl: string
  notificationUrl: string
  expiresInSeconds?: number
  privateData?: Record<string, unknown>
  idempotencyKey: string
}) {
  return call<{ paymentId: string; linkId: string; linkUrl: string; expiresAt?: string }>(
    'POST',
    '/api/v1/payments/links',
    {
      order: input.order,
      redirectUrl: input.redirectUrl,
      notificationUrl: input.notificationUrl,
      languageCode: 'fr',
      type: 'single',
      expiresIn: input.expiresInSeconds ?? 7 * 24 * 3600,
      privateData: input.privateData,
    },
    input.idempotencyKey,
  )
}

export function getPayment(id: string) {
  return call<{ id: string; status: string; amountCents: number; currency: string; refundableAmount?: number }>(
    'GET',
    `/api/v1/payments/${encodeURIComponent(id)}`,
  )
}

/** Full refund when `amount` is omitted. Amount in the payment's original currency (XPF francs). */
export function refundPayment(id: string, amount: number | undefined, reason: string, idempotencyKey: string) {
  return call<{ totalRefundedAmount?: number; remainingAmount?: number }>(
    'POST',
    `/api/v1/payments/${encodeURIComponent(id)}/refund`,
    { ...(amount ? { amountCents: amount } : {}), reason },
    idempotencyKey,
  )
}

export function cancelPendingPayment(id: string, idempotencyKey: string) {
  return call<unknown>('POST', `/api/v1/payments/${encodeURIComponent(id)}/cancel`, {}, idempotencyKey)
}

export function getSigningSecret() {
  return call<{ webhookSecret?: string; secret?: string; signingSecret?: string }>('GET', '/api/v1/webhooks/signing-secret')
}

/** Verify a webhook delivery. Prefers V2 (timestamped, anti-replay); falls back to V1. */
export function verifyWebhook(rawBody: string, headers: Headers, secret: string, toleranceSec = 300): boolean {
  const safeEqual = (a: string, b: string) => {
    const A = Buffer.from(a)
    const B = Buffer.from(b)
    return A.length === B.length && crypto.timingSafeEqual(A, B)
  }
  const ts = headers.get('x-mobupay-timestamp')
  const v2 = headers.get('x-mobupay-signature-v2')
  if (ts && v2) {
    if (Math.abs(Date.now() / 1000 - Number(ts)) > toleranceSec) return false
    const expected = crypto.createHmac('sha256', secret).update(`${ts}.${rawBody}`).digest('hex')
    return safeEqual(expected, v2)
  }
  const v1 = headers.get('x-mobupay-signature')
  if (!v1) return false
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
  return safeEqual(expected, v1)
}

export type MobupayEvent = {
  id: string
  type: string
  createdAt: string
  data: {
    paymentId?: string
    reference?: string
    orderReference?: string
    externalId?: string
    amount?: number
    currency?: string
    grossAmount?: number
    originalCurrency?: string
    status?: string
    refundId?: string
    refundOriginalAmount?: number
    totalRefundedOriginalAmount?: number
    remainingOriginalAmount?: number
    cardBrand?: string
    cardLast4?: string
    linkId?: string
    [k: string]: unknown
  }
}
