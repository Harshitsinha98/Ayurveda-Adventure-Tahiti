import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { Reveal } from '@/components/motion/primitives'
import { NewsletterForm } from '@/components/site/NewsletterForm'
import { PageHero, Pill } from '@/components/site/ui'
import { formatXPF } from '@/lib/money'
import { img } from '@/lib/payload'
import { offeringPhoto } from '@/lib/photos'
import { KIND_LABEL, seatsLeft, upcomingOccurrences } from '@/lib/queries'
import type { Offering } from '@/payload-types'

export const revalidate = 60
export const metadata: Metadata = {
  title: 'Événements · ateliers, formations et voyages à venir',
  description: 'Toutes les prochaines dates : formations, ateliers, conférences et départs de voyages avec Ayurveda Tahiti.',
}

export default async function EventsPage() {
  const occ = await upcomingOccurrences()
  const byMonth = new Map<string, typeof occ>()
  for (const o of occ) {
    const k = new Date(o.startsAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric', timeZone: 'Pacific/Tahiti' })
    byMonth.set(k, [...(byMonth.get(k) ?? []), o])
  }

  return (
    <>
      <PageHero eyebrow="Agenda" title="Prochains" accent="rendez-vous" intro="Formations, ateliers et voyages : les dates à venir. Les séances individuelles se réservent à tout moment depuis leur page." />
      <section className="pb-28">
        <div className="container-x">
          {occ.length === 0 && (
            <div className="grid gap-10 rounded-[3px] bg-sand-50 p-10 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="font-display text-4xl text-plum-800">Les prochaines dates arrivent bientôt.</p>
                <p className="mt-3 text-ink-soft">Inscris-toi à la newsletter pour être prévenu·e en premier.</p>
              </div>
              <NewsletterForm tone="light" source="evenements" />
            </div>
          )}
          {[...byMonth.entries()].map(([month, items]) => (
            <div key={month} className="mb-16">
              <h2 className="font-display mb-6 text-3xl capitalize text-saffron-600">{month}</h2>
              <ul className="divide-y divide-plum-800/10 border-y border-plum-800/10">
                {items.map((o, i) => {
                  const off = o.offering as Offering
                  const d = new Date(o.startsAt)
                  const left = seatsLeft(o)
                  const href = off.kind === 'voyage' ? `/voyage-en-inde/${off.slug}` : `/offres/${off.slug}`
                  const image = img(off.image, 'thumb') ?? offeringPhoto(off.slug)
                  return (
                    <Reveal as="li" key={o.id} delay={i * 0.05}>
                      <Link href={href} className="group grid grid-cols-[4.5rem_1fr] items-center gap-6 py-6 sm:grid-cols-[5.5rem_5rem_1fr_auto]">
                        <div className="text-center">
                          <p className="font-display text-5xl leading-none text-plum-800">{d.toLocaleDateString('fr-FR', { day: 'numeric', timeZone: 'Pacific/Tahiti' })}</p>
                          <p className="text-xs uppercase tracking-[0.16em] text-ink-soft">{d.toLocaleDateString('fr-FR', { weekday: 'short', timeZone: 'Pacific/Tahiti' })}</p>
                        </div>
                        <div className="relative hidden h-20 w-20 overflow-hidden rounded-[3px] sm:block">{image && <Image src={image.url} alt="" fill sizes="80px" className="object-cover" />}</div>
                        <div>
                          <Pill tone={off.kind === 'voyage' ? 'saffron' : 'sage'}>{KIND_LABEL[off.kind]}</Pill>
                          <p className="font-display mt-2 text-2xl text-plum-800 transition group-hover:text-saffron-600">{off.title}</p>
                          <p className="text-sm text-ink-soft">{o.location || off.location}</p>
                        </div>
                        <div className="col-span-2 flex items-center justify-between gap-6 sm:col-span-1 sm:block sm:text-right">
                          <p className="font-semibold text-plum-800">{formatXPF(o.priceOverride ?? off.price)}</p>
                          <p className={`text-sm ${left === 0 || o.status !== 'open' ? 'text-ink-soft' : left <= 3 ? 'text-saffron-600' : 'text-sage-700'}`}>
                            {o.status !== 'open' || left === 0 ? 'Complet' : `${left} place${left > 1 ? 's' : ''}`}
                          </p>
                        </div>
                      </Link>
                    </Reveal>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
