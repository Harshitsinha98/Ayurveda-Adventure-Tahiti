import { ArrowUpRight } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { Parallax, Reveal } from '@/components/motion/primitives'
import { PageHero } from '@/components/site/ui'
import { formatXPF } from '@/lib/money'
import { img } from '@/lib/payload'
import { listOfferings } from '@/lib/queries'

export const revalidate = 120
export const metadata: Metadata = {
  title: 'Voyages spirituels en Inde',
  description:
    'Voyages en petit groupe avec Eliane et Sanjeev Mehta : Kumbha Mela, Rishikesh, Varanasi, Ladakh. Yoga, méditation, cercles sacrés et rencontres authentiques.',
}

export default async function VoyagesPage() {
  const trips = (await listOfferings({ kind: { equals: 'voyage' } })).sort(
    (a, b) => Number(new Date(a.tripEnd || 0) < new Date()) - Number(new Date(b.tripEnd || 0) < new Date()),
  )
  return (
    <>
      <PageHero
        tone="plum"
        eyebrow="Voyages en Inde"
        title="Vivre l’Inde"
        accent="autrement."
        intro="Avec l’association Ayurveda Adventure Tahiti, je vous emmène en petit groupe dans les lieux qui m’ont transformée. Avec Sanjeev Mehta, guide de longue date, nous entrons dans une tradition vivante : yoga, méditation, cercles sacrés et rencontres."
      />
      <section className="py-20 lg:py-28">
        <div className="container-x space-y-24 lg:space-y-32">
          {trips.map((t, i) => {
            const image = img(t.image, 'hero')
            const past = t.tripEnd ? new Date(t.tripEnd) < new Date() : false
            const [title, subtitle] = t.title.split(' · ')
            return (
              <article key={t.id} className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${i % 2 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                <Reveal>
                  <Link href={`/voyage-en-inde/${t.slug}`} className="group block">
                    <Parallax className={`relative aspect-[5/4] ${i % 2 ? 'rounded-[32px]' : 'arch'}`} amount={40}>
                      {image && <Image src={image.url} alt={image.alt} fill sizes="(min-width:1024px) 50vw, 100vw" className={`object-cover ${past ? 'grayscale-[35%]' : ''}`} />}
                    </Parallax>
                  </Link>
                </Reveal>
                <Reveal delay={0.1}>
                  <p className="eyebrow text-saffron-600">{past ? 'Voyage passé' : 'Inscriptions ouvertes'} · {t.kicker}</p>
                  <h2 className="mt-5 text-[clamp(2.6rem,5vw,4.6rem)] leading-[0.95] text-plum-800">
                    {title}
                    {subtitle && <em className="mt-2 block text-[0.55em] text-saffron-600">{subtitle}</em>}
                  </h2>
                  <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">{t.summary}</p>
                  {t.tripRegion && <p className="mt-4 text-sm uppercase tracking-[0.16em] text-sage-700">{t.tripRegion}</p>}
                  <div className="mt-8 flex flex-wrap items-center gap-6">
                    <Link href={`/voyage-en-inde/${t.slug}`} className="group inline-flex items-center gap-3 rounded-full bg-plum-800 py-3.5 pl-6 pr-4 font-semibold text-sand-50 transition hover:bg-plum-700">
                      {past ? 'Revivre le voyage' : 'Programme et réservation'}
                      <ArrowUpRight size={18} className="transition-transform duration-500 group-hover:rotate-45" />
                    </Link>
                    {t.price && <span className="font-display text-2xl text-plum-800">{formatXPF(t.price)}</span>}
                  </div>
                </Reveal>
              </article>
            )
          })}
        </div>
      </section>
    </>
  )
}
