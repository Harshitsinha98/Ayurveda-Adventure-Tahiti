import type { EmailAdapter, SendEmailOptions } from 'payload'

/**
 * Payload email adapter backed by Brevo (same provider the site already uses for
 * transactional emails in src/lib/email.ts).
 *
 * Payload's built-in auth features — email verification and forgot-password —
 * send their emails through the configured email adapter. Without an adapter,
 * Payload only logs ("No email adapter provided"). This wires those emails to
 * Brevo so account verification / password-reset links actually get delivered,
 * using the same sender identity as the rest of the site.
 *
 * In development (no BREVO_API_KEY) emails are logged instead of sent, so the
 * verification/reset link is still visible in the server logs.
 */
export const brevoAdapter: EmailAdapter = ({ payload }) => {
  const defaultFromAddress = process.env.EMAIL_FROM || 'eliane@ayurveda-tahiti.com'
  const defaultFromName = process.env.EMAIL_FROM_NAME || 'Ayurveda Tahiti'

  return {
    name: 'brevo',
    defaultFromAddress,
    defaultFromName,
    sendEmail: async (message: SendEmailOptions) => {
      const apiKey = process.env.BREVO_API_KEY
      const to = normalizeTo(message.to)
      const subject = message.subject ?? ''

      if (!apiKey) {
        payload.logger.info(`[email:dev] → ${to.map((t) => t.email).join(', ')} · ${subject}`)
        if (message.html) payload.logger.info(`[email:dev] html: ${String(message.html).slice(0, 2000)}`)
        return
      }

      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'api-key': apiKey, 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          sender: { email: defaultFromAddress, name: defaultFromName },
          to,
          subject,
          htmlContent: message.html ? String(message.html) : undefined,
          textContent: message.text ? String(message.text) : undefined,
        }),
      })

      if (!res.ok) {
        payload.logger.error(`[email] Brevo ${res.status}: ${await res.text()}`)
      }
    },
  }
}

/** Accept Payload's various `to` shapes (string, "Name <email>", array) → Brevo recipients. */
function normalizeTo(to: SendEmailOptions['to']): { email: string; name?: string }[] {
  const items = Array.isArray(to) ? to : [to]
  return items
    .map((entry) => {
      if (!entry) return null
      if (typeof entry === 'string') {
        const m = entry.match(/^\s*(.*?)\s*<\s*([^>]+)\s*>\s*$/)
        if (m) return { name: m[1] || undefined, email: m[2] }
        return { email: entry.trim() }
      }
      const email = (entry as { address?: string }).address
      return email ? { email, name: (entry as { name?: string }).name } : null
    })
    .filter((x): x is { email: string; name?: string } => Boolean(x))
}
