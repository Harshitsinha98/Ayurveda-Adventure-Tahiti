import type { Metadata } from 'next'

import { getSite } from '@/lib/payload'

import { LegalPage } from '../LegalPage'

export const metadata: Metadata = { title: 'Conditions générales de vente' }
export const revalidate = 600

export default async function CgvPage() {
  const s = await getSite()
  return (
    <LegalPage
      title="Conditions générales de vente"
      data={s.legal?.terms}
      fallback={
        <>
          <p><em>Version provisoire, à compléter et valider par Eliane dans « Coordonnées et réseaux » du tableau de bord.</em></p>
          <h2>Prix et paiement</h2>
          <p>Les prix sont indiqués en francs pacifiques (XPF), toutes taxes comprises. Le paiement en ligne se fait par carte bancaire sur une page sécurisée (3-D Secure). Pour les voyages, un acompte peut être demandé à la réservation, le solde étant dû à la date indiquée.</p>
          <h2>Séances individuelles</h2>
          <p>Pour annuler ou reprogrammer une séance, merci de prévenir au moins 24 heures à l’avance. Au-delà, la séance est due.</p>
          <h2>Formations et ateliers</h2>
          <p>En cas d’annulation de votre part plus de 7 jours avant le début, la somme versée est remboursée. Si une session est annulée par Ayurveda Tahiti, elle est intégralement remboursée ou reportée.</p>
          <h2>Voyages</h2>
          <p>Les conditions d’annulation, de remboursement de l’acompte et du solde sont précisées pour chaque voyage. Une assurance voyage et annulation est fortement recommandée.</p>
          <h2>Carnets de séances</h2>
          <p>Les carnets sont nominatifs et valables pendant la durée indiquée à compter de l’achat.</p>
        </>
      }
    />
  )
}
