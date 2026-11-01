import type { Payload } from 'payload'

import { siteUrl } from '@/lib/email'

export const CONSENT_TEXT =
  "J'accepte de recevoir la newsletter d'Ayurveda Tahiti (ateliers, formations, voyages). Je peux me désinscrire à tout moment via le lien présent dans chaque e-mail."

/**
 * Newsletter sign-up with double opt-in through Brevo
 * (https://developers.brevo.com/reference/createdoicontact).
 * Requires BREVO_API_KEY, BREVO_LIST_ID and BREVO_DOI_TEMPLATE_ID; otherwise only stored locally.
 */
export async function subscribeToNewsletter(
  payload: Payload,
  input: { email: string; firstName?: string; source?: string; ip?: string },
) {
  const email = input.email.toLowerCase()
  const existing = await payload.find({ collection: 'subscribers', where: { email: { equals: email } }, limit: 1, overrideAccess: true })
  const data = {
    email,
    firstName: input.firstName,
    consentText: CONSENT_TEXT,
    consentIp: input.ip,
    source: input.source ?? 'site',
  }
  const doc = existing.docs[0]
    ? await payload.update({ collection: 'subscribers', id: existing.docs[0].id, data: { ...data, status: existing.docs[0].status === 'subscribed' ? 'subscribed' : 'pending' }, overrideAccess: true })
    : await payload.create({ collection: 'subscribers', data: { ...data, status: 'pending' }, overrideAccess: true })

  const key = process.env.BREVO_API_KEY
  const list = Number(process.env.BREVO_LIST_ID)
  const template = Number(process.env.BREVO_DOI_TEMPLATE_ID)
  if (!key || !list || !template) {
    payload.logger.info(`[newsletter:dev] ${email} enregistré (Brevo non configuré)`)
    return doc
  }
  const res = await fetch('https://api.brevo.com/v3/contacts/doubleOptinConfirmation', {
    method: 'POST',
    headers: { 'api-key': key, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      email,
      attributes: input.firstName ? { PRENOM: input.firstName, FIRSTNAME: input.firstName } : undefined,
      includeListIds: [list],
      templateId: template,
      redirectionUrl: `${siteUrl()}/newsletter/merci`,
    }),
  })
  if (res.ok || res.status === 204) {
    await payload.update({ collection: 'subscribers', id: doc.id, data: { syncedToBrevo: true }, overrideAccess: true })
  } else {
    payload.logger.error(`[newsletter] Brevo ${res.status}: ${await res.text()}`)
  }
  return doc
}
