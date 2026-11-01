'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'

import { Reveal } from '@/components/motion/primitives'
import type { Img } from '@/lib/payload'

/** Featured journey: a drifting photo collage and a countdown to departure. */
export function JourneyFeature({
  slug,
  title,
  kicker,
  summary,
  region,
  price,
  daysLeft,
  seatsLeft,
  images,
}: {
  slug: string
  title: string
  kicker?: string | null
  summary: string
  region?: string | null
  price?: string | null
  daysLeft?: number | null
  seatsLeft?: number | null
  images: Img[]
}) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const a = useTransform(scrollYProgress, [0, 1], [80, -80])
  const b = useTransform(scrollYProgress, [0, 1], [-40, 60])
  const c = useTransform(scrollYProgress, [0, 1], [120, -120])
  const [main, second, third] = images
  const [titleMain, titleSub] = title.split(' · ')

  return (
    <section ref={ref} className="relative overflow-hidden bg-sand-200/60 py-28 lg:py-40" aria-labelledby="journey-title">
      <div className="container-x grid items-center gap-16 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative order-2 h-[560px] lg:order-1 lg:h-[680px]">
          {main && (
            <motion.div style={{ y: a }} className="arch absolute left-[8%] top-0 h-[78%] w-[62%] overflow-hidden shadow-[0_40px_80px_-35px_rgba(42,11,28,0.6)]">
              <Image src={main.url} alt={main.alt} fill sizes="(min-width:1024px) 30vw, 60vw" className="object-cover" />
            </motion.div>
          )}
          {second && (
            <motion.div style={{ y: b }} className="absolute bottom-[4%] right-0 h-[46%] w-[46%] overflow-hidden rounded-[26px] border-[6px] border-sand-100 shadow-[0_30px_60px_-30px_rgba(42,11,28,0.5)]">
              <Image src={second.url} alt={second.alt} fill sizes="(min-width:1024px) 22vw, 45vw" className="object-cover" />
            </motion.div>
          )}
          {third && (
            <motion.div style={{ y: c }} className="absolute bottom-[18%] left-0 h-32 w-32 overflow-hidden rounded-full border-[6px] border-sand-100">
              <Image src={third.url} alt={third.alt} fill sizes="128px" className="object-cover" />
            </motion.div>
          )}
        </div>

        <div className="order-1 lg:order-2">
          <Reveal>
            <p className="eyebrow text-saffron-600">Prochain voyage · {kicker}</p>
            <h2 id="journey-title" className="mt-5 text-[clamp(2.8rem,6vw,5.4rem)] leading-[0.95] text-plum-800">
              {titleMain}
              {titleSub && <em className="mt-2 block text-[0.55em] leading-tight text-saffron-600">{titleSub}</em>}
            </h2>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-soft">{summary}</p>
            {region && <p className="mt-4 text-sm uppercase tracking-[0.18em] text-sage-700">{region}</p>}
          </Reveal>
          <Reveal delay={0.12}>
            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-y border-plum-800/12 py-6">
              {daysLeft != null && daysLeft > 0 && (
                <div>
                  <dt className="text-xs uppercase tracking-[0.16em] text-ink-soft">Départ dans</dt>
                  <dd className="font-display mt-1 text-4xl text-plum-800">{daysLeft} <span className="text-lg">jours</span></dd>
                </div>
              )}
              {seatsLeft != null && (
                <div>
                  <dt className="text-xs uppercase tracking-[0.16em] text-ink-soft">Places</dt>
                  <dd className="font-display mt-1 text-4xl text-plum-800">{seatsLeft} <span className="text-lg">restantes</span></dd>
                </div>
              )}
              {price && (
                <div>
                  <dt className="text-xs uppercase tracking-[0.16em] text-ink-soft">À partir de</dt>
                  <dd className="font-display mt-1 text-3xl text-plum-800">{price}</dd>
                </div>
              )}
            </dl>
            <Link href={`/voyage-en-inde/${slug}`} className="group mt-10 inline-flex items-center gap-3 rounded-full bg-plum-800 py-4 pl-7 pr-5 font-semibold text-sand-50 transition hover:bg-plum-700">
              Découvrir le voyage
              <span className="grid h-8 w-8 place-items-center rounded-full bg-sand-50/15 transition-transform duration-500 group-hover:translate-x-1">
                <ArrowRight size={16} />
              </span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
