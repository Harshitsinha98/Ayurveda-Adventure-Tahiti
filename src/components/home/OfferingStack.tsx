'use client'

import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { StackCards } from '@/components/motion/scroll'
import { useT } from '@/i18n/client'

import type { OfferingRow } from './OfferingList'

const TONES = [
  { card: 'bg-plum-900 text-sand-50', kicker: 'text-saffron-300', meta: 'text-sand-200/70', btn: 'bg-saffron-500 text-plum-950', dark: true },
  { card: 'bg-sand-50 text-plum-800', kicker: 'text-saffron-600', meta: 'text-ink-soft', btn: 'bg-plum-800 text-sand-50', dark: false },
  { card: 'bg-sage-700 text-sand-50', kicker: 'text-saffron-300', meta: 'text-sand-100/75', btn: 'bg-sand-50 text-plum-900', dark: true },
  { card: 'bg-saffron-100 text-plum-800', kicker: 'text-saffron-600', meta: 'text-ink-soft', btn: 'bg-plum-800 text-sand-50', dark: false },
]

/** Offerings as full-screen cards that stack on top of each other while scrolling. */
export function OfferingStack({ items }: { items: OfferingRow[] }) {
  const t = useT().home
  return (
    <StackCards className="container-x pb-[10vh]">
      {items.map((o, i) => {
        const tone = TONES[i % TONES.length]
        return (
          <Link
            key={o.slug}
            href={`/offres/${o.slug}`}
            data-cursor={t.discover}
            {...(tone.dark ? { 'data-cursor-dark': '' } : {})}
            className={`group grid min-h-[68svh] overflow-hidden rounded-[3px] shadow-[0_50px_100px_-50px_rgba(42,11,28,0.55)] lg:h-[72vh] lg:min-h-0 lg:grid-cols-[1.1fr_1fr] ${tone.card}`}
          >
            <div className="relative order-2 h-[34svh] overflow-hidden lg:order-1 lg:h-auto">
              {o.image && (
                <Image src={o.image.url} alt={o.image.alt} fill sizes="(min-width:1024px) 55vw, 100vw" className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]" />
              )}
            </div>
            <div className="order-1 flex flex-col justify-between gap-8 p-7 sm:p-10 lg:order-2 lg:p-14">
              <div className="flex items-start justify-between gap-6">
                <span className="font-display text-[clamp(3rem,7vw,6rem)] leading-none opacity-25">{String(i + 1).padStart(2, '0')}</span>
                {o.meta && <span className={`eyebrow max-w-[14rem] text-right text-[0.62rem] leading-relaxed ${tone.meta}`}>{o.meta}</span>}
              </div>
              <div>
                <h3 className="font-display text-[clamp(2.2rem,4.6vw,4.4rem)] leading-[0.98]">{o.title}</h3>
                {o.kicker && <p className={`font-display mt-4 text-xl italic sm:text-2xl ${tone.kicker}`}>{o.kicker}</p>}
              </div>
              <div className="flex items-center justify-between gap-6">
                {o.price && <span className="font-display text-3xl">{o.price}</span>}
                <span className={`ml-auto grid h-14 w-14 place-items-center rounded-full transition-transform duration-500 group-hover:rotate-45 ${tone.btn}`}>
                  <ArrowUpRight size={20} />
                </span>
              </div>
            </div>
          </Link>
        )
      })}
    </StackCards>
  )
}
