import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { Parallax, Reveal } from '@/components/motion/primitives'
import { RichText } from '@/components/site/RichText'
import { img, payloadClient } from '@/lib/payload'

export const revalidate = 300
export const metadata: Metadata = {
  title: 'À propos · Eliane Poeauru Koller Valadier',
  description: 'Ethnologue, enseignante de méditation Primordial Sound et d’Ayurveda (Chopra Global), à Tahiti depuis 22 ans. Un pont entre les mondes.',
}

export default async function AboutPage() {
  const payload = await payloadClient()
  const a = await payload.findGlobal({ slug: 'about', depth: 1 })
  const portrait = img(a.portrait, 'hero')

  return (
    <>
      <section className="pb-20 pt-[130px] lg:pt-[160px]">
        <div className="container-x grid items-end gap-14 lg:grid-cols-[0.85fr_1.15fr]">
          {portrait && (
            <Reveal className="relative">
              <div className="arch relative aspect-[4/5] overflow-hidden">
                <Image src={portrait.url} alt={portrait.alt} fill priority sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
              </div>
              <p className="font-display absolute -bottom-6 left-6 rounded-full bg-saffron-500 px-6 py-3 text-xl italic text-plum-950">À Tahiti depuis 22 ans</p>
            </Reveal>
          )}
          <Reveal delay={0.1}>
            <p className="eyebrow text-saffron-600">À propos</p>
            <h1 className="mt-5 text-[clamp(2.8rem,6vw,5.4rem)] leading-[0.95] text-plum-800">{a.title}</h1>
            {a.lead && <p className="font-display mt-6 text-[clamp(1.6rem,3vw,2.4rem)] italic leading-snug text-saffron-600">{a.lead}</p>}
          </Reveal>
        </div>
      </section>

      <section className="py-16">
        <div className="container-x grid gap-14 lg:grid-cols-[0.35fr_0.65fr]">
          <div />
          <Reveal>
            <RichText data={a.body} className="prose-at text-[1.15rem]" />
          </Reveal>
        </div>
      </section>

      {(a.chapters?.length ?? 0) > 0 && (
        <section className="py-24 lg:py-32" aria-label="Parcours">
          <div className="container-x">
            <p className="eyebrow text-saffron-600">Un parcours</p>
            <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
              {a.chapters!.map((c, i) => {
                const im = img(c.image, 'card')
                return (
                  <Reveal key={c.id} delay={i * 0.08} className={i % 2 ? 'lg:mt-24' : ''}>
                    {im ? (
                      <Parallax className={`relative aspect-[3/4] ${i % 2 ? 'rounded-[28px]' : 'arch'}`} amount={30}>
                        <Image src={im.url} alt={im.alt} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover" />
                      </Parallax>
                    ) : (
                      <div aria-hidden className={`relative grid aspect-[3/4] place-items-center overflow-hidden ${i % 2 ? 'rounded-[28px] bg-sage-200' : 'arch bg-plum-800'}`}>
                        <span className={`font-display text-[9rem] leading-none ${i % 2 ? 'text-sage-500/50' : 'text-saffron-300/40'}`}>{c.place.charAt(0)}</span>
                        <span className={`absolute inset-6 rounded-[inherit] border ${i % 2 ? 'border-sage-500/30' : 'border-saffron-300/25'}`} />
                      </div>
                    )}
                    <p className="font-display mt-6 text-sm italic text-saffron-600">{String(i + 1).padStart(2, '0')}</p>
                    <h2 className="font-display mt-1 text-2xl text-plum-800">{c.place}</h2>
                    <p className="mt-2 leading-relaxed text-ink-soft">{c.text}</p>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {(a.credentials?.length ?? 0) > 0 && (
        <section className="bg-sand-50 py-20">
          <div className="container-x flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <p className="font-display max-w-sm text-3xl text-plum-800">Formations et <em className="text-saffron-600">certifications</em></p>
            <ul className="flex flex-wrap items-center gap-6">
              {a.credentials!.map((c) => {
                const b = img(c.badge, 'thumb')
                return (
                  <li key={c.id} className="flex items-center gap-4 rounded-full bg-sand-100 py-2 pl-2 pr-6">
                    {b ? <Image src={b.url} alt="" width={52} height={52} className="rounded-full" /> : <span className="grid h-[52px] w-[52px] place-items-center rounded-full bg-plum-800 font-display text-xl text-saffron-300">ॐ</span>}
                    <span className="text-sm font-semibold text-plum-800">{c.title}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
      )}

      <section className="py-24 text-center">
        <div className="container-x">
          <p className="font-display mx-auto max-w-3xl text-[clamp(2rem,4vw,3.4rem)] leading-tight text-plum-800">
            Bienvenue dans cet espace où les traditions se rencontrent, <em className="text-saffron-600">où le corps est écouté.</em>
          </p>
          <Link href="/offres/consultation-decouverte" className="mt-10 inline-block rounded-full bg-plum-800 px-8 py-4 font-semibold text-sand-50 hover:bg-plum-700">Faire connaissance</Link>
        </div>
      </section>
    </>
  )
}
