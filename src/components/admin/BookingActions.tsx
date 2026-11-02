'use client'

import { useDocumentInfo, useTranslation } from '@payloadcms/ui'
import { useState } from 'react'

import { tr, type Bilingual } from '@/lib/admin-labels'

/** Buttons in the "Paiement" tab: resend confirmation, balance link, cancel and refund. Bilingual (FR/EN). */
export function BookingActions() {
  const { id } = useDocumentInfo()
  const { i18n } = useTranslation()
  const lang = i18n?.language ?? 'fr'
  const t = (pair: Bilingual) => tr(lang, pair)

  const [busy, setBusy] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)

  if (!id) return null

  const run = async (action: 'resend' | 'balance-link' | 'refund', confirmText?: string) => {
    if (confirmText && !window.confirm(confirmText)) return
    setBusy(action)
    setMsg(null)
    try {
      const res = await fetch(`/api/bookings/${id}/${action}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || t({ fr: 'Erreur', en: 'Error' }))
      setMsg(
        action === 'refund'
          ? `${t({ fr: 'Réservation annulée.', en: 'Booking cancelled.' })}${
              data.refunded
                ? ` ${t({ fr: 'Remboursement lancé', en: 'Refund started' })} : ${data.refunded} XPF.`
                : ''
            } ${t({ fr: 'Rechargez la page.', en: 'Reload the page.' })}`
          : action === 'balance-link'
            ? t({ fr: 'Lien de paiement du solde envoyé au client.', en: 'Balance payment link sent to the client.' })
            : t({ fr: 'E-mail de confirmation renvoyé.', en: 'Confirmation email resent.' }),
      )
    } catch (e) {
      setMsg(`⚠ ${(e as Error).message}`)
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="at-booking-actions">
      <div className="at-booking-actions__title">{t({ fr: 'Actions', en: 'Actions' })}</div>
      <div className="at-booking-actions__row">
        <button type="button" className="at-btn" disabled={!!busy} onClick={() => run('resend')}>
          {busy === 'resend' ? '…' : t({ fr: 'Renvoyer la confirmation', en: 'Resend confirmation' })}
        </button>
        <button type="button" className="at-btn" disabled={!!busy} onClick={() => run('balance-link')}>
          {busy === 'balance-link' ? '…' : t({ fr: 'Envoyer le lien de paiement du solde', en: 'Send balance payment link' })}
        </button>
        <button
          type="button"
          className="at-btn at-btn--danger"
          disabled={!!busy}
          onClick={() =>
            run(
              'refund',
              t({
                fr: 'Annuler cette réservation ? Les paiements par carte en ligne seront remboursés intégralement et le client recevra un e-mail.',
                en: 'Cancel this booking? Online card payments will be fully refunded and the client will receive an email.',
              }),
            )
          }
        >
          {busy === 'refund' ? '…' : t({ fr: 'Annuler et rembourser', en: 'Cancel and refund' })}
        </button>
      </div>
      {msg && <p className="at-booking-actions__msg">{msg}</p>}
      <p className="at-booking-actions__note">
        {t({
          fr: 'Un remboursement partiel se fait aussi depuis votre espace Mobupay ; il s’ajoute ici automatiquement.',
          en: 'A partial refund can also be done from your Mobupay area; it is added here automatically.',
        })}
      </p>
    </div>
  )
}
