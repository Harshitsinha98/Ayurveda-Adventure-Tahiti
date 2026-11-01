import type { Metadata } from 'next'

import { getSite } from '@/lib/payload'

export const metadata: Metadata = { title: 'Mentions légales' }
export const revalidate = 600

export default async function MentionsPage() {
  const s = await getSite()
  const l = s.legal ?? {}
  return (
    <section className="pb-28 pt-[140px] lg:pt-[170px]">
      <div className="container-x max-w-3xl">
        <h1 className="text-[clamp(2.6rem,6vw,4.4rem)] text-plum-800">Mentions légales</h1>
        <div className="prose-at mt-10">
          <h2>Éditeur du site</h2>
          <p>
            {l.entity}
            {l.registration ? ` · Numéro TAHITI ${l.registration}` : ''}
            <br />
            {s.address}
            <br />
            {s.email} · {s.phone}
          </p>
          <p>Responsable de la publication : {l.representative}</p>
          <h2>Hébergement</h2>
          <p>{l.host}</p>
          <h2>Paiements</h2>
          <p>Les paiements par carte sont traités par Mobupay, agent de paiement d’eZyness (filiale de La Banque Postale), sur une page sécurisée. Aucune donnée de carte n’est conservée sur ce site.</p>
          <h2>Propriété intellectuelle</h2>
          <p>Les textes et photographies de ce site sont la propriété d’Eliane Poeauru Koller Valadier, sauf mention contraire. Toute reproduction sans autorisation est interdite.</p>
          <h2>Données personnelles</h2>
          <p>Voir la <a href="/confidentialite">politique de confidentialité</a>.</p>
        </div>
      </div>
    </section>
  )
}
