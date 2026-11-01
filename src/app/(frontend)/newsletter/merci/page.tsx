import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Inscription confirmée', robots: { index: false } }

export default function NewsletterThanks() {
  return (
    <section className="grid min-h-[80svh] place-items-center pt-[100px] text-center">
      <div className="container-x max-w-2xl">
        <p className="eyebrow text-saffron-600">Newsletter</p>
        <h1 className="mt-5 text-[clamp(2.6rem,6vw,4.6rem)] text-plum-800">Bienvenue, <em className="text-saffron-600">namaste.</em></h1>
        <p className="mt-5 text-lg text-ink-soft">Ton inscription est confirmée. Tu recevras les annonces d’ateliers, de formations et de voyages.</p>
        <Link href="/" className="mt-10 inline-block rounded-[2px] bg-plum-800 px-7 py-3.5 font-semibold text-sand-50">Retour à l’accueil</Link>
      </div>
    </section>
  )
}
