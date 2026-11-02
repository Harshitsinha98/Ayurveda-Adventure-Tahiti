import type { I18nClient } from '@payloadcms/translations'

import { tr } from '@/lib/admin-labels'

/** Tip shown above the bookings list. Bilingual (FR/EN). */
export function BookingsSummary({ i18n }: { i18n?: I18nClient }) {
  const lang = i18n?.language ?? 'fr'
  const text = tr(lang, {
    fr: 'Filtrez par « Paiement » pour voir les réservations non payées ou partiellement payées. Ouvrez une réservation puis l’onglet « Paiement » pour enregistrer un paiement sur place, envoyer le lien du solde, ou annuler et rembourser.',
    en: 'Filter by “Payment” to see unpaid or partially paid bookings. Open a booking then the “Payment” tab to record an on-site payment, send the balance link, or cancel and refund.',
  })
  const tip = tr(lang, { fr: 'Astuce', en: 'Tip' })

  return (
    <div className="at-tip">
      <strong>{tip} :</strong> {text}
    </div>
  )
}
