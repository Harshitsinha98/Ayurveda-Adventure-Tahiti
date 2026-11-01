import type { Metadata } from 'next'

import { getSite } from '@/lib/payload'

import { LegalPage } from '../LegalPage'

export const metadata: Metadata = { title: 'Politique de confidentialité' }
export const revalidate = 600

export default async function PrivacyPage() {
  const s = await getSite()
  return (
    <LegalPage
      title="Politique de confidentialité"
      data={s.legal?.privacy}
      fallback={
        <>
          <p><em>Version provisoire, à valider par Eliane.</em></p>
          <h2>Responsable du traitement</h2>
          <p>{s.legal?.entity}, {s.address}. Contact : {s.email}.</p>
          <h2>Données collectées</h2>
          <p>Nom, prénom, e-mail, téléphone, pays et informations nécessaires à votre réservation (date, participants, paiement). Pour les voyages : informations de voyage demandées séparément. Les données de carte bancaire sont traitées uniquement par notre prestataire de paiement et ne sont jamais conservées sur ce site.</p>
          <h2>Finalités</h2>
          <ul>
            <li>Gérer vos réservations, paiements, confirmations et rappels.</li>
            <li>Répondre à vos messages.</li>
            <li>Vous envoyer la newsletter, uniquement si vous l’avez demandé (double confirmation).</li>
          </ul>
          <h2>Destinataires</h2>
          <p>Hébergement (Vercel, base de données en Union européenne), paiement (Mobupay / eZyness), e-mails et newsletter (Brevo, France). Vos données ne sont jamais vendues.</p>
          <h2>Durée de conservation</h2>
          <p>Données de réservation : durée nécessaire aux obligations comptables. Newsletter : jusqu’à votre désinscription.</p>
          <h2>Vos droits</h2>
          <p>Vous pouvez demander l’accès, la rectification, l’effacement ou la portabilité de vos données, et vous désinscrire à tout moment via le lien présent dans chaque e-mail, en écrivant à {s.email}.</p>
          <h2>Cookies</h2>
          <p>Ce site n’utilise que des cookies techniques nécessaires à son fonctionnement (aucun cookie publicitaire ni de mesure d’audience).</p>
        </>
      }
    />
  )
}
