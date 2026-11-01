import type { Payload } from 'payload'

import { formatXPF } from '@/lib/money'
import { fmtLong } from '@/lib/time'

/**
 * Transactional e-mails through Brevo (https://developers.brevo.com/reference/sendtransacemail).
 * Without BREVO_API_KEY, e-mails are only logged (development).
 */
const SENDER = () => ({
  email: process.env.EMAIL_FROM || 'eliane@ayurveda-tahiti.com',
  name: process.env.EMAIL_FROM_NAME || 'Ayurveda Tahiti',
})

export const siteUrl = () => (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')

const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

export async function sendEmail(
  payload: Payload,
  msg: { to: string; toName?: string; subject: string; html: string; replyTo?: string },
) {
  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey) {
    payload.logger.info(`[email:dev] → ${msg.to} · ${msg.subject}`)
    return { ok: true, dev: true }
  }
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': apiKey, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      sender: SENDER(),
      to: [{ email: msg.to, name: msg.toName }],
      replyTo: msg.replyTo ? { email: msg.replyTo } : SENDER(),
      subject: msg.subject,
      htmlContent: msg.html,
    }),
  })
  if (!res.ok) {
    payload.logger.error(`[email] Brevo ${res.status}: ${await res.text()}`)
    return { ok: false }
  }
  return { ok: true }
}

const layout = (title: string, body: string) => `<!doctype html><html lang="fr"><body style="margin:0;background:#F4EEE3;font-family:Georgia,'Times New Roman',serif;color:#2A211F">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 12px"><tr><td align="center">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFCF7;border-radius:18px;overflow:hidden">
<tr><td style="background:#4A1838;padding:28px 32px;color:#F4E3C1;font-size:13px;letter-spacing:.24em;text-transform:uppercase">Ayurveda Tahiti</td></tr>
<tr><td style="padding:32px"><h1 style="margin:0 0 18px;font-weight:400;font-size:26px;line-height:1.25;color:#4A1838">${esc(title)}</h1>
<div style="font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.65;color:#3B302D">${body}</div></td></tr>
<tr><td style="padding:22px 32px;border-top:1px solid #EFE4D2;font-family:Helvetica,Arial,sans-serif;font-size:12px;color:#7A6A63">
Eliane · Ayurveda Tahiti · Punaauia, Polynésie française<br>Pour toute question, répondez simplement à cet e-mail.</td></tr>
</table></td></tr></table></body></html>`

type BookingLike = {
  code: string
  customerName?: string | null
  customerEmail?: string | null
  amountTotal?: number | null
  amountPaid?: number | null
  balance?: number | null
  balanceDueDate?: string | null
  slotStart?: string | null
  timezone?: string | null
  quantity?: number | null
  accessToken?: string | null
}
type OfferingLike = { title: string; meetingUrl?: string | null; location?: string | null; cancellationPolicy?: string | null; mode?: string | null }

const row = (k: string, v: string) =>
  `<tr><td style="padding:6px 0;color:#7A6A63;width:42%">${esc(k)}</td><td style="padding:6px 0">${v}</td></tr>`

function whenRows(b: BookingLike, startsAt?: string | null) {
  const d = b.slotStart || startsAt
  if (!d) return ''
  let html = row('Date (heure de Tahiti)', esc(fmtLong(d)))
  if (b.timezone && b.timezone !== 'Pacific/Tahiti') html += row('Chez vous', esc(fmtLong(d, b.timezone)))
  return html
}

export function confirmationEmail(b: BookingLike, o: OfferingLike, startsAt?: string | null) {
  const online = o.mode === 'en-ligne' || o.mode === 'hybride'
  const body = `<p>Namaste ${esc(b.customerName?.split(' ')[0] || '')},</p>
<p>Votre réservation est confirmée. Je me réjouis de vous accompagner.</p>
<table role="presentation" width="100%" style="border-collapse:collapse;margin:18px 0">
${row('Réservation', `<strong>${esc(b.code)}</strong>`)}
${row('Offre', esc(o.title))}
${whenRows(b, startsAt)}
${b.quantity && b.quantity > 1 ? row('Participants', String(b.quantity)) : ''}
${row('Montant', esc(formatXPF(b.amountTotal)))}
${row('Payé', esc(formatXPF(b.amountPaid)))}
${b.balance ? row('Reste à régler', `${esc(formatXPF(b.balance))}${b.balanceDueDate ? ` avant le ${esc(new Date(b.balanceDueDate).toLocaleDateString('fr-FR'))}` : ''}`) : ''}
${online && o.meetingUrl ? row('Lien de la séance', `<a href="${esc(o.meetingUrl)}" style="color:#4A1838">${esc(o.meetingUrl)}</a>`) : ''}
${!online && o.location ? row('Lieu', esc(o.location)) : ''}
</table>
${o.cancellationPolicy ? `<p style="font-size:13px;color:#7A6A63">${esc(o.cancellationPolicy)}</p>` : ''}
<p><a href="${siteUrl()}/reservation/${esc(b.accessToken)}" style="display:inline-block;background:#4A1838;color:#FFF7E8;padding:12px 22px;border-radius:999px;text-decoration:none">Voir ma réservation</a></p>
<p>Om shanti,<br>Eliane</p>`
  return { subject: `Réservation confirmée · ${o.title}`, html: layout('Votre réservation est confirmée', body) }
}

export function reminderEmail(b: BookingLike, o: OfferingLike, startsAt?: string | null) {
  const body = `<p>Namaste ${esc(b.customerName?.split(' ')[0] || '')},</p>
<p>Petit rappel de notre rendez-vous :</p>
<table role="presentation" width="100%" style="border-collapse:collapse;margin:18px 0">${row('Offre', esc(o.title))}${whenRows(b, startsAt)}
${o.meetingUrl ? row('Lien', `<a href="${esc(o.meetingUrl)}">${esc(o.meetingUrl)}</a>`) : o.location ? row('Lieu', esc(o.location)) : ''}</table>
<p>Prévoyez quelques minutes de calme avant de commencer.</p><p>À très bientôt,<br>Eliane</p>`
  return { subject: `Rappel · ${o.title}`, html: layout('À très bientôt', body) }
}

export function balanceEmail(b: BookingLike, o: OfferingLike, linkUrl: string) {
  const body = `<p>Namaste ${esc(b.customerName?.split(' ')[0] || '')},</p>
<p>Voici le lien sécurisé pour régler le solde de votre réservation <strong>${esc(b.code)}</strong> (${esc(o.title)}).</p>
<table role="presentation" width="100%" style="border-collapse:collapse;margin:18px 0">${row('Reste à régler', esc(formatXPF(b.balance)))}
${b.balanceDueDate ? row('À régler avant le', esc(new Date(b.balanceDueDate).toLocaleDateString('fr-FR'))) : ''}</table>
<p><a href="${esc(linkUrl)}" style="display:inline-block;background:#4A1838;color:#FFF7E8;padding:12px 22px;border-radius:999px;text-decoration:none">Payer le solde</a></p>
<p>Merci,<br>Eliane</p>`
  return { subject: `Solde à régler · ${o.title}`, html: layout('Règlement du solde', body) }
}

export function cancellationEmail(b: BookingLike, o: OfferingLike, refunded?: number) {
  const body = `<p>Namaste ${esc(b.customerName?.split(' ')[0] || '')},</p>
<p>Votre réservation <strong>${esc(b.code)}</strong> (${esc(o.title)}) est annulée.</p>
${refunded ? `<p>Un remboursement de <strong>${esc(formatXPF(refunded))}</strong> a été lancé sur votre carte. Il apparaît généralement sous quelques jours.</p>` : ''}
<p>Au plaisir de vous retrouver,<br>Eliane</p>`
  return { subject: `Réservation annulée · ${o.title}`, html: layout('Réservation annulée', body) }
}

export function ownerNotification(b: BookingLike, o: OfferingLike, startsAt?: string | null) {
  const body = `<table role="presentation" width="100%" style="border-collapse:collapse">
${row('Réservation', esc(b.code))}${row('Client', esc(b.customerName))}${row('E-mail', esc(b.customerEmail))}
${row('Offre', esc(o.title))}${whenRows(b, startsAt)}${row('Payé', `${esc(formatXPF(b.amountPaid))} / ${esc(formatXPF(b.amountTotal))}`)}</table>
<p><a href="${siteUrl()}/admin/collections/bookings">Ouvrir le tableau de bord</a></p>`
  return { subject: `Nouvelle réservation · ${o.title}`, html: layout('Nouvelle réservation', body) }
}

export { layout as emailLayout, esc as escapeHtml }
