import Image from 'next/image'
import Link from 'next/link'

import { Reveal } from '@/components/motion/primitives'
import { DrawLine, ImageReveal, SplitWords } from '@/components/motion/scroll'
import { dateLocale, type Lang } from '@/i18n/dictionary'
import type { Img } from '@/lib/payload'

export function SectionHeading({
  eyebrow,
  title,
  accent,
  intro,
  align = 'left',
  id,
}: {
  eyebrow?: string
  title: string
  accent?: string
  intro?: string
  align?: 'left' | 'center'
  id?: string
}) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      {eyebrow && (
        <Reveal y={10}>
          <p className="eyebrow flex items-center gap-3 text-saffron-600">
            <span aria-hidden className="h-px w-8 bg-saffron-500" />
            {eyebrow}
          </p>
        </Reveal>
      )}
      <h2 id={id} className="mt-4 text-[clamp(2.4rem,5vw,4.2rem)] leading-[1.02] text-plum-800">
        <SplitWords text={title} /> {accent && <SplitWords text={accent} delay={0.15} wordClassName={'italic text-saffron-600'} />}
      </h2>
      {intro && (
        <Reveal delay={0.2}>
          <p className={`mt-6 text-lg leading-relaxed text-ink-soft ${align === 'center' ? 'mx-auto max-w-2xl' : 'max-w-2xl'}`}>{intro}</p>
        </Reveal>
      )}
    </div>
  )
}

/** Page header used on inner pages; each page passes its own image so headers never look identical. */
export function PageHero({
  eyebrow,
  title,
  accent,
  intro,
  image,
  tone = 'light',
}: {
  eyebrow?: string
  title: string
  accent?: string
  intro?: string | null
  image?: Img | null
  tone?: 'light' | 'plum'
}) {
  const plum = tone === 'plum'
  return (
    <section className={`grain relative overflow-hidden pb-16 pt-[140px] lg:pb-24 lg:pt-[170px] ${plum ? 'bg-plum-900 text-sand-50' : ''}`}>
      <div aria-hidden className={`pointer-events-none absolute -right-32 -top-32 h-[520px] w-[520px] rounded-full ${plum ? 'bg-[radial-gradient(circle,rgba(210,154,72,0.2),transparent_65%)]' : 'bg-[radial-gradient(circle,rgba(210,154,72,0.16),transparent_65%)]'}`} />
      <div className="container-x relative grid items-end gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          {eyebrow && (
            <Reveal y={10} delay={0.3}>
              <p className={`eyebrow flex items-center gap-3 ${plum ? 'text-saffron-300' : 'text-saffron-600'}`}>
                <span aria-hidden className="h-px w-8 bg-current" />
                {eyebrow}
              </p>
            </Reveal>
          )}
          <h1 className={`mt-5 text-[clamp(3rem,7.4vw,6.6rem)] leading-[0.95] ${plum ? 'text-sand-50' : 'text-plum-800'}`}>
            <SplitWords text={title} onLoad delay={0.35} stagger={0.07} />{' '}
            {accent && <SplitWords text={accent} onLoad delay={0.55} stagger={0.07} wordClassName={`italic ${plum ? 'text-saffron-300' : 'text-saffron-600'}`} />}
          </h1>
          {intro && (
            <Reveal delay={0.7}>
              <p className={`mt-7 max-w-2xl text-lg leading-relaxed ${plum ? 'text-sand-200/80' : 'text-ink-soft'}`}>{intro}</p>
            </Reveal>
          )}
        </div>
        {image && <ImageReveal image={image} priority delay={0.4} sizes="30vw" className="hidden aspect-[4/5] max-h-[460px] w-full rounded-[3px] lg:block" />}
      </div>
      <DrawLine className={`pointer-events-none mt-14 h-12 w-full ${plum ? 'text-saffron-300/40' : 'text-saffron-500/40'}`} d="M0 50 C 200 10, 400 90, 600 50 S 800 10, 800 50" />
    </section>
  )
}

export function PostCard({
  href,
  title,
  excerpt,
  image,
  date,
  category,
  large,
  lang = 'fr',
}: {
  lang?: Lang
  href: string
  title: string
  excerpt?: string | null
  image?: Img | null
  date?: string | null
  category?: string | null
  large?: boolean
}) {
  return (
    <Link href={href} className="group block" data-cursor={lang === 'en' ? 'Read' : 'Lire'}>
      <div className={`relative overflow-hidden rounded-[3px] bg-sand-200 ${large ? 'aspect-[4/3]' : 'aspect-[5/4]'}`}>
        {image && (
          <Image src={image.url} alt={image.alt} fill sizes={large ? '(min-width:1024px) 50vw, 100vw' : '(min-width:1024px) 25vw, 100vw'} className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]" />
        )}
        {category && <span className="absolute left-4 top-4 rounded-[2px] bg-sand-50/90 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-plum-800 backdrop-blur">{category}</span>}
      </div>
      <div className="mt-5">
        {date && <p className="text-xs uppercase tracking-[0.16em] text-ink-soft">{new Date(date).toLocaleDateString(dateLocale(lang), { day: 'numeric', month: 'long', year: 'numeric' })}</p>}
        <h3 className={`font-display mt-2 leading-tight text-plum-800 transition-colors group-hover:text-saffron-600 ${large ? 'text-[2.2rem]' : 'text-[1.6rem]'}`}>{title}</h3>
        {excerpt && <p className="mt-3 line-clamp-3 text-[0.97rem] leading-relaxed text-ink-soft">{excerpt}</p>}
      </div>
    </Link>
  )
}

export function Pill({ children, tone = 'sand' }: { children: React.ReactNode; tone?: 'sand' | 'sage' | 'saffron' | 'plum' }) {
  const t = {
    sand: 'bg-sand-200 text-ink-soft',
    sage: 'bg-sage-200 text-sage-700',
    saffron: 'bg-saffron-100 text-saffron-600',
    plum: 'bg-plum-100 text-plum-800',
  }[tone]
  return <span className={`inline-flex items-center rounded-[2px] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.12em] ${t}`}>{children}</span>
}
