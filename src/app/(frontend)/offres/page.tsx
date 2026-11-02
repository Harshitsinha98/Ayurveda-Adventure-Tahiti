import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { PackageCard } from '@/components/booking/PackageCard'
import { Reveal } from '@/components/motion/primitives'
import { PageHero, Pill, SectionHeading } from '@/components/site/ui'
import { img } from '@/lib/payload'
import { offeringPhoto, photo } from '@/lib/photos'
import { getT } from '@/i18n/server'
import { durationLabel, kindLabel, listOfferings, listPackages, modeLabel, priceLabel } from '@/lib/queries'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT()
  return { title: t.offers.metaTitle, description: t.offers.metaDesc }
}

export default async function OffresPage() {
  const { lang, t } = await getT()
  const [offerings, packages] = await Promise.all([listOfferings({ kind: { not_equals: 'voyage' } }, lang), listPackages(lang)])
  const groups = [
    { key: 'seance', title: t.offers.groups.seance[0], accent: t.offers.groups.seance[1], kinds: ['seance'] },
    { key: 'formation', title: t.offers.groups.formation[0], accent: t.offers.groups.formation[1], kinds: ['formation', 'atelier'] },
    { key: 'conference', title: t.offers.groups.conference[0], accent: t.offers.groups.conference[1], kinds: ['conference'] },
  ]

  return (
    <>
      <PageHero
        eyebrow={t.offers.eyebrow}
        title={t.offers.title}
        accent={t.offers.accent}
        intro={t.offers.intro}
        image={img(offerings.find((o) => o.kind === 'formation')?.image, 'card') ?? photo('meditation-groupe')}
      />

      {groups.map((g, gi) => {
        const items = offerings.filter((o) => g.kinds.includes(o.kind))
        if (!items.length) return null
        return (
          <section key={g.key} id={g.key} className={`py-20 lg:py-28 ${gi % 2 ? 'bg-sand-50' : ''}`}>
            <div className="container-x">
              <SectionHeading title={g.title} accent={g.accent} />
              <div className={`mt-14 grid gap-8 ${items.length > 2 ? 'md:grid-cols-2 xl:grid-cols-4' : items.length === 2 ? 'md:grid-cols-2' : ''}`}>
                {items.map((o, i) => {
                  const image = img(o.image, 'card') ?? offeringPhoto(o.slug)
                  const wide = items.length === 1
                  return (
                    <Reveal key={o.id} delay={i * 0.07}>
                      <Link href={`/offres/${o.slug}`} className={`group flex h-full flex-col ${wide ? 'md:grid md:grid-cols-[0.9fr_1.1fr] md:items-center md:gap-14' : ''}`}>
                        <div className={`relative overflow-hidden bg-sand-200 ${wide ? 'aspect-[16/10] rounded-[3px]' : i % 2 === 0 ? 'arch aspect-[3/4]' : 'aspect-[3/4] rounded-[3px]'}`}>
                          {image && <Image src={image.url} alt={image.alt} fill sizes="(min-width:1280px) 25vw, (min-width:768px) 50vw, 100vw" className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]" />}
                          <div className="absolute inset-x-4 bottom-4 flex flex-wrap gap-2">
                            <Pill tone="sand">{modeLabel(o.mode, lang) ?? kindLabel(o.kind, lang)}</Pill>
                            {durationLabel(o.durationMinutes) && <Pill tone="sand">{durationLabel(o.durationMinutes)}</Pill>}
                          </div>
                        </div>
                        <div className="mt-5 flex flex-1 flex-col">
                          {o.kicker && <p className="text-xs uppercase tracking-[0.16em] text-saffron-600">{o.kicker}</p>}
                          <h3 className={`font-display mt-2 leading-tight text-plum-800 ${wide ? 'text-[2.8rem]' : 'text-[1.9rem]'}`}>{o.title}</h3>
                          <p className={`mt-3 flex-1 ${wide ? 'text-lg' : 'line-clamp-3'} text-[0.97rem] leading-relaxed text-ink-soft`}>{o.summary}</p>
                          <p className="mt-5 flex items-center justify-between border-t border-plum-800/10 pt-4 text-sm">
                            <span className="font-semibold text-plum-800">{priceLabel(o, lang)}</span>
                            <span className="text-plum-800 underline decoration-saffron-500 underline-offset-4 transition group-hover:text-saffron-600">
                              {o.bookingMode === 'request' ? t.offers.ask : t.offers.book}
                            </span>
                          </p>
                        </div>
                      </Link>
                    </Reveal>
                  )
                })}
              </div>
            </div>
          </section>
        )
      })}

      {packages.length > 0 && (
        <section id="carnets" className="relative overflow-hidden bg-sand-200/60 py-24 lg:py-32">
          <div className="container-x grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <SectionHeading
              eyebrow={t.offers.packsEyebrow}
              title={t.offers.packsTitle}
              accent={t.offers.packsAccent}
              intro={t.offers.packsIntro}
            />
            <div className="grid gap-6 sm:grid-cols-2">
              {packages.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.1}>
                  <PackageCard slug={p.slug!} title={p.title} summary={p.summary} sessions={p.sessionsCount} price={p.price} months={p.validityMonths} featured={i === packages.length - 1} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
      <section className="py-24 lg:py-32" aria-labelledby="faq-title">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading id="faq-title" eyebrow={t.offers.faqEyebrow} title={t.offers.faqTitle} />
          <div className="divide-y divide-plum-800/10 border-y border-plum-800/10">
            {t.offers.faq.map(([q, a]) => (
              <details key={q} className="group py-6">
                <summary className="font-display flex cursor-pointer list-none items-center justify-between gap-6 text-2xl text-plum-800 [&::-webkit-details-marker]:hidden">
                  {q}
                  <span aria-hidden className="text-3xl leading-none text-saffron-600 transition-transform duration-500 group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
