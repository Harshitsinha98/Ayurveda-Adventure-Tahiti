'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { CountUp } from '@/components/motion/primitives'
import { HorizontalScroll, SplitWords } from '@/components/motion/scroll'
import { useT } from '@/i18n/client'
import type { Img } from '@/lib/payload'

/** Featured journey: the page scrolls sideways through the trip's photos, with the countdown up front. */
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
  const T = useT()
  const t = T.journey
  const [titleMain, titleSub] = title.split(' · ')
  const shapes = ['h-[62vh] w-[44vh]', 'h-[46vh] w-[60vh] self-end', 'h-[56vh] w-[40vh] self-start', 'h-[50vh] w-[66vh]', 'h-[60vh] w-[42vh] self-end']

  return (
    <HorizontalScroll
      className="bg-plum-950 py-20 text-sand-50 lg:py-0"
      head={
        <div className="container-x mb-10 flex items-end justify-between gap-6 lg:mb-12">
          <p className="eyebrow text-saffron-300">{t.next} · {kicker}</p>
          <p className="eyebrow hidden text-[0.62rem] text-sand-200/60 lg:block">{T.home.journeyScroll} →</p>
        </div>
      }
    >
      <div className="flex w-[86vw] shrink-0 snap-start flex-col justify-center sm:w-[70vw] lg:w-[46vw] lg:pr-10">
        <SplitWords as="h2" text={titleMain} className="block text-[clamp(3rem,7vw,7rem)] leading-[0.92]" />
        {titleSub && <p className="font-display mt-3 text-[clamp(1.6rem,3vw,2.8rem)] italic text-saffron-300">{titleSub}</p>}
        <p className="mt-8 max-w-lg text-lg leading-relaxed text-sand-200/80">{summary}</p>
        {region && <p className="mt-4 text-sm uppercase tracking-[0.18em] text-saffron-300/80">{region}</p>}
        <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-y border-sand-50/15 py-6">
          {daysLeft != null && daysLeft > 0 && (
            <div>
              <dt className="text-[0.66rem] uppercase tracking-[0.16em] text-sand-200/60">{t.departsIn}</dt>
              <dd className="font-display mt-1 text-4xl"><CountUp to={daysLeft} /> <span className="text-lg">{t.days}</span></dd>
            </div>
          )}
          {seatsLeft != null && (
            <div>
              <dt className="text-[0.66rem] uppercase tracking-[0.16em] text-sand-200/60">{t.seats}</dt>
              <dd className="font-display mt-1 text-4xl"><CountUp to={seatsLeft} /> <span className="text-lg">{t.left}</span></dd>
            </div>
          )}
          {price && (
            <div>
              <dt className="text-[0.66rem] uppercase tracking-[0.16em] text-sand-200/60">{t.from}</dt>
              <dd className="font-display mt-1 text-2xl sm:text-3xl">{price}</dd>
            </div>
          )}
        </dl>
        <Link href={`/voyage-en-inde/${slug}`} className="btn-fill btn-fill-light group mt-10 inline-flex w-fit items-center gap-3 rounded-[2px] bg-saffron-500 px-8 py-4 font-semibold text-plum-950">
          <span className="relative z-10">{t.discover}</span>
          <ArrowRight size={16} strokeWidth={1.5} className="relative z-10 transition-transform duration-500 group-hover:translate-x-1" />
        </Link>
      </div>

      {images.map((im, i) => (
        <motion.figure
          key={im.url}
          className={`relative shrink-0 snap-center overflow-hidden rounded-[2px] max-lg:h-[52svh] max-lg:w-[78vw] ${shapes[i % shapes.length]}`}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          data-cursor={T.home.view}
        >
          <Link href={`/voyage-en-inde/${slug}`} className="group block h-full w-full" tabIndex={-1} aria-hidden>
            <Image src={im.url} alt={im.alt} fill sizes="(min-width:1024px) 40vw, 80vw" className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.07]" />
          </Link>
          <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-plum-950/80 to-transparent px-5 pb-4 pt-12 text-sm text-sand-100/90">{im.alt}</figcaption>
        </motion.figure>
      ))}
      <div className="w-[8vw] shrink-0" aria-hidden />
    </HorizontalScroll>
  )
}
