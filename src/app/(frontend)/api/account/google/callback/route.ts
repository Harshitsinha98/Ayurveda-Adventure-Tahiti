import crypto from 'crypto'
import { cookies, headers as nextHeaders } from 'next/headers'
import { NextResponse } from 'next/server'

import { payloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

type Doc = Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any

/**
 * Google OAuth callback.
 *
 * Exchanges the authorization code for Google's profile (verified email), then
 * finds or creates the matching customer and logs them in. Because Google has
 * already verified the email, the account is marked verified. To obtain a
 * Payload session cookie through the fully supported login operation (Google
 * users have no password), we set a fresh random password and immediately log
 * in with it — no Payload internals touched.
 */
export async function GET(req: Request) {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
  const fail = (reason: string) => NextResponse.redirect(`${base}/compte/connexion?google=${reason}`)

  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  if (!clientId || !clientSecret) return fail('unavailable')

  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')

  const jar = await cookies()
  const savedState = jar.get('g_state')?.value
  const redirectTo = jar.get('g_redirect')?.value || '/compte'
  jar.delete('g_state')
  jar.delete('g_redirect')

  if (!code || !state || !savedState || state !== savedState) return fail('state')

  // 1) Exchange the code for tokens
  let profile: { email?: string; email_verified?: boolean; given_name?: string; family_name?: string }
  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: `${base}/api/account/google/callback`,
        grant_type: 'authorization_code',
      }),
    })
    if (!tokenRes.ok) return fail('token')
    const token = (await tokenRes.json()) as { access_token?: string }
    if (!token.access_token) return fail('token')

    const infoRes = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: { Authorization: `Bearer ${token.access_token}` },
    })
    if (!infoRes.ok) return fail('profile')
    profile = await infoRes.json()
  } catch {
    return fail('network')
  }

  const email = profile.email?.toLowerCase()
  if (!email || profile.email_verified === false) return fail('email')

  const payload = await payloadClient()
  const password = crypto.randomBytes(24).toString('base64url')

  // 2) Find or create the customer, verified, with the fresh password.
  const existing = await payload.find({
    collection: 'customers',
    where: { email: { equals: email } },
    limit: 1,
    depth: 0,
    showHiddenFields: true,
  })
  const prev = existing.docs[0] as Doc | undefined

  try {
    if (prev) {
      await payload.update({
        collection: 'customers',
        id: prev.id,
        data: {
          password,
          _verified: true,
          firstName: prev.firstName || profile.given_name,
          lastName: prev.lastName || profile.family_name,
          groups: Array.from(new Set([...(prev.groups ?? []), 'clients'])),
        } as never,
        overrideAccess: true,
      })
    } else {
      await payload.create({
        collection: 'customers',
        data: {
          email,
          password,
          firstName: profile.given_name,
          lastName: profile.family_name,
          source: 'site',
          groups: ['clients'],
          _verified: true,
        } as never,
        overrideAccess: true,
        disableVerificationEmail: true,
      })
    }
  } catch {
    return fail('account')
  }

  // 3) Standard login → sets the Payload session cookie on the response.
  try {
    const result = await payload.login({
      collection: 'customers',
      data: { email, password },
      req: { headers: await nextHeaders() } as never,
    })
    const res = NextResponse.redirect(`${base}${redirectTo.startsWith('/') ? redirectTo : '/compte'}`)
    if (result.token) {
      const secure = base.startsWith('https')
      res.cookies.set('payload-token', result.token, {
        httpOnly: true,
        sameSite: 'lax',
        secure,
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
      })
    }
    return res
  } catch {
    return fail('login')
  }
}
