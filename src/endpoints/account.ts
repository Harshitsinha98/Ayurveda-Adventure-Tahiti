import crypto from 'crypto'
import type { Endpoint, PayloadRequest } from 'payload'
import { z } from 'zod'

import { verifyAccountEmail } from '@/lib/account-email'

type Doc = Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any

const json = (body: unknown, status = 200) => Response.json(body, { status })

// Small in-memory rate limiter (per instance) to slow down abuse of the register endpoint.
const hits = new Map<string, { n: number; t: number }>()
function limited(req: PayloadRequest, key: string, max = 8, windowMs = 60_000) {
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

const registerSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(160),
  password: z.string().min(8).max(200),
  newsletter: z.boolean().optional(),
})

/**
 * Account endpoints for the public website (separate from the staff back office).
 *
 * Registration is intentionally server-controlled: the `customers` collection's
 * `create` access is staffOnly, so visitors cannot POST /api/customers directly.
 * This endpoint uses the Local API (overrideAccess) to create the account.
 *
 * - Brand-new email → `payload.create`, which (collection has `verify: true`)
 *   auto-sends the branded verification email.
 * - Existing CRM record with no login yet (e.g. created by a past booking) →
 *   attach a password, keep their booking history, set a verification token and
 *   send the verification email ourselves.
 *
 * Login / logout / forgot-password / reset-password / verify all use Payload's
 * built-in /api/customers/* operations from the client.
 */
export const accountEndpoints: Endpoint[] = [
  {
    path: '/account/register',
    method: 'post',
    handler: async (req) => {
      if (limited(req, 'register')) return json({ error: 'Trop de tentatives. Réessayez dans une minute.' }, 429)

      const parsed = registerSchema.safeParse(await readJson(req))
      if (!parsed.success) return json({ error: 'Champs invalides.' }, 400)
      const { firstName, lastName, email: rawEmail, password, newsletter } = parsed.data
      const email = rawEmail.toLowerCase()

      const existing = await req.payload.find({
        collection: 'customers',
        where: { email: { equals: email } },
        limit: 1,
        depth: 0,
        showHiddenFields: true,
      })
      const prev = existing.docs[0] as Doc | undefined

      // Already a usable / verified account: don't overwrite, ask them to log in.
      if (prev?.password || prev?.salt || prev?._verified) {
        return json({ error: 'exists' }, 409)
      }

      const groups = Array.from(new Set([...(prev?.groups ?? []), 'clients', ...(newsletter ? ['newsletter'] : [])]))

      try {
        if (prev) {
          // CRM record without a login → attach credentials + send verification ourselves.
          const token = crypto.randomBytes(20).toString('hex')
          await req.payload.update({
            collection: 'customers',
            id: prev.id,
            data: {
              firstName,
              lastName,
              password,
              groups,
              _verified: false,
              _verificationToken: token,
              ...(newsletter ? { newsletter: true } : {}),
            } as never,
          })
          await req.payload.sendEmail({
            to: email,
            subject: verifyAccountEmail.subject(),
            html: verifyAccountEmail.html(token, firstName),
          })
        } else {
          // Brand-new account → create() auto-sends the verification email.
          await req.payload.create({
            collection: 'customers',
            data: {
              firstName,
              lastName,
              email,
              password,
              source: 'site',
              groups,
              ...(newsletter ? { newsletter: true } : {}),
            } as never,
          })
        }
      } catch (e) {
        req.payload.logger.error(`[account/register] ${(e as Error).message}`)
        return json({ error: 'generic' }, 500)
      }

      return json({ ok: true })
    },
  },
]
