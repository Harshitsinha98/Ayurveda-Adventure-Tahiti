/**
 * Thin client-side helpers around Payload's built-in /api/customers auth
 * operations plus our custom register endpoint. Used by the account pages.
 * All calls are same-origin and rely on Payload's httpOnly session cookie.
 */

type Result = { ok: boolean; error?: string; status: number; data?: unknown }

async function call(path: string, body?: unknown): Promise<Result> {
  try {
    const res = await fetch(path, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : '{}',
    })
    let data: unknown = null
    try {
      data = await res.json()
    } catch {
      /* no body */
    }
    const error = (data as { errors?: { message?: string }[] })?.errors?.[0]?.message
    return { ok: res.ok, status: res.status, error, data }
  } catch {
    return { ok: false, status: 0 }
  }
}

export const account = {
  login: (email: string, password: string) =>
    call('/api/customers/login', { email: email.trim().toLowerCase(), password }),

  logout: () => call('/api/customers/logout'),

  register: (data: { firstName: string; lastName: string; email: string; password: string; newsletter?: boolean }) =>
    call('/api/account/register', data),

  forgotPassword: (email: string) =>
    call('/api/customers/forgot-password', { email: email.trim().toLowerCase() }),

  resetPassword: (token: string, password: string) =>
    call('/api/customers/reset-password', { token, password }),

  verifyEmail: (token: string) =>
    call(`/api/customers/verify/${encodeURIComponent(token)}`),
}
