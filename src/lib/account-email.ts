import { emailLayout, escapeHtml as esc, siteUrl } from '@/lib/email'

/**
 * Branded emails for the customer account flow (email verification and
 * password reset), reusing the site's existing Brevo layout so they match the
 * confirmation/reminder emails. Bilingual-friendly but French-first, like the
 * rest of the public site.
 *
 * Payload generates the `token`; we build the link to our own frontend pages
 * (`/compte/verifier`, `/compte/reinitialiser`) which will call Payload's
 * verify / reset-password operations. Those pages are added in a later phase;
 * the links are stable regardless.
 */

const button = (href: string, label: string) =>
  `<p><a href="${esc(href)}" style="display:inline-block;background:#4A1838;color:#FFF7E8;padding:12px 22px;border-radius:999px;text-decoration:none">${esc(label)}</a></p>`

const hello = (firstName?: string) => `<p>Namaste ${esc(firstName || '')},</p>`

export const verifyAccountEmail = {
  subject: () => 'Confirmez votre adresse e-mail · Ayurveda Tahiti',
  html: (token: string, firstName?: string) => {
    const link = `${siteUrl()}/compte/verifier?token=${encodeURIComponent(token)}`
    const body = `${hello(firstName)}
<p>Bienvenue ! Pour activer votre compte et retrouver vos réservations, confirmez votre adresse e-mail en cliquant ci-dessous.</p>
${button(link, 'Confirmer mon adresse')}
<p style="font-size:13px;color:#7A6A63">Ce lien expire bientôt. Si vous n’êtes pas à l’origine de cette demande, ignorez simplement cet e-mail.</p>
<p>Om shanti,<br>Eliane</p>`
    return emailLayout('Confirmez votre adresse', body)
  },

  resetSubject: () => 'Réinitialiser votre mot de passe · Ayurveda Tahiti',
  resetHtml: (token: string, firstName?: string) => {
    const link = `${siteUrl()}/compte/reinitialiser?token=${encodeURIComponent(token)}`
    const body = `${hello(firstName)}
<p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez ci-dessous pour en choisir un nouveau.</p>
${button(link, 'Choisir un nouveau mot de passe')}
<p style="font-size:13px;color:#7A6A63">Ce lien expire dans une heure. Si vous n’êtes pas à l’origine de cette demande, ignorez cet e-mail : votre mot de passe reste inchangé.</p>
<p>Om shanti,<br>Eliane</p>`
    return emailLayout('Réinitialisation du mot de passe', body)
  },
}
