import crypto from 'crypto'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * Start of the "Sign in with Google" flow.
 *
 * Redirects the visitor to Google's consent screen. A random `state` is stored
 * in an httpOnly cookie and checked on the callback (CSRF protection). Google
 * sign-in only works once GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET are set in the
 * environment; without them this returns a friendly message instead of 500.
 */
export async function GET(req: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')

  if (!clientId || !process.env.GOOGLE_CLIENT_SECRET) {
    return NextResponse.redirect(`${base}/compte/connexion?google=unavailable`)
  }

  const url = new URL(req.url)
  const redirectTo = url.searchParams.get('redirect') || '/compte'
  const state = crypto.randomBytes(16).toString('hex')

  const jar = await cookies()
  const secure = base.startsWith('https')
  jar.set('g_state', state, { httpOnly: true, sameSite: 'lax', secure, path: '/', maxAge: 600 })
  jar.set('g_redirect', redirectTo, { httpOnly: true, sameSite: 'lax', secure, path: '/', maxAge: 600 })

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${base}/api/account/google/callback`,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    prompt: 'select_account',
    access_type: 'online',
  })
  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`)
}
