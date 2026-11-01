export function BookingsSummary() {
  return (
    <div
      style={{
        margin: '0 0 18px',
        padding: '12px 16px',
        borderRadius: 12,
        background: 'var(--theme-elevation-50)',
        fontSize: 13,
        lineHeight: 1.6,
      }}
    >
      <strong>Astuce :</strong> filtrez par « Paiement » pour voir les réservations non payées ou partiellement payées. Ouvrez
      une réservation puis l’onglet « Paiement » pour enregistrer un paiement sur place, envoyer le lien du solde, ou
      annuler et rembourser.
    </div>
  )
}
