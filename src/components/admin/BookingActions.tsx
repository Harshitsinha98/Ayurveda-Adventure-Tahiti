'use client'

import { useDocumentInfo } from '@payloadcms/ui'
import { useState } from 'react'

const btn: React.CSSProperties = {
  padding: '9px 16px',
  borderRadius: 999,
  border: '1px solid var(--theme-elevation-200)',
  background: 'var(--theme-elevation-0)',
  cursor: 'pointer',
  fontSize: 13,
}

/** Buttons in the "Paiement" tab: resend confirmation, balance link, cancel and refund. */
export function BookingActions() {
  const { id } = useDocumentInfo()
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
      if (!res.ok) throw new Error(data.error || 'Erreur')
      setMsg(
        action === 'refund'
          ? `Réservation annulée.${data.refunded ? ` Remboursement lancé : ${data.refunded} XPF.` : ''} Rechargez la page.`
          : action === 'balance-link'
            ? 'Lien de paiement du solde envoyé au client.'
            : 'E-mail de confirmation renvoyé.',
      )
    } catch (e) {
      setMsg(`⚠ ${(e as Error).message}`)
    } finally {
      setBusy(null)
    }
  }

  return (
    <div style={{ margin: '24px 0', padding: 18, borderRadius: 14, background: 'var(--theme-elevation-50)' }}>
      <div style={{ fontWeight: 600, marginBottom: 10 }}>Actions</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        <button type="button" style={btn} disabled={!!busy} onClick={() => run('resend')}>
          {busy === 'resend' ? '…' : 'Renvoyer la confirmation'}
        </button>
        <button type="button" style={btn} disabled={!!busy} onClick={() => run('balance-link')}>
          {busy === 'balance-link' ? '…' : 'Envoyer le lien de paiement du solde'}
        </button>
        <button
          type="button"
          style={{ ...btn, borderColor: '#b54848', color: '#b54848' }}
          disabled={!!busy}
          onClick={() =>
            run(
              'refund',
              'Annuler cette réservation ? Les paiements par carte en ligne seront remboursés intégralement et le client recevra un e-mail.',
            )
          }
        >
          {busy === 'refund' ? '…' : 'Annuler et rembourser'}
        </button>
      </div>
      {msg && <p style={{ marginTop: 12, fontSize: 13 }}>{msg}</p>}
      <p style={{ marginTop: 12, fontSize: 12, opacity: 0.65 }}>
        Un remboursement partiel se fait aussi depuis votre espace Mobupay ; il s’ajoute ici automatiquement.
      </p>
    </div>
  )
}
