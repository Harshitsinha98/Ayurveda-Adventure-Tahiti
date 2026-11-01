'use client'

import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

import { EASE } from '@/components/motion/primitives'
import type { Img } from '@/lib/payload'

export function TripHero({ image, title, subtitle, kicker }: { image?: Img | null; title: string; subtitle?: string; kicker?: string | null }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.18])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  return (
    <section ref={ref} className="relative h-[92svh] min-h-[560px] overflow-hidden bg-plum-950 text-sand-50">
      {image && (
        <motion.div style={{ y, scale }} className="absolute inset-0">
          <Image src={image.url} alt={image.alt} fill priority sizes="100vw" className="object-cover opacity-85" />
        </motion.div>
      )}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-plum-950 via-plum-950/30 to-plum-950/10" />
      <motion.div style={{ opacity: fade }} className="container-x relative flex h-full flex-col justify-end pb-16 lg:pb-24">
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.9 }} className="eyebrow text-saffron-300">
          {kicker}
        </motion.p>
        <h1 className="mt-5 max-w-5xl text-[clamp(3.2rem,9vw,8.5rem)] leading-[0.92]">
          {title.split(' ').map((w, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.06em] align-bottom">
              <motion.span className="inline-block" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, delay: 0.25 + i * 0.08, ease: EASE }}>
                {w}&nbsp;
              </motion.span>
            </span>
          ))}
        </h1>
        {subtitle && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 1 }} className="font-display mt-4 text-[clamp(1.6rem,3vw,2.6rem)] italic text-saffron-300">
            {subtitle}
          </motion.p>
        )}
      </motion.div>
    </section>
  )
}

/** Day-by-day itinerary with a line that fills while scrolling. */
export function Itinerary({ days }: { days: { day: string; title: string; text?: string | null }[] }) {
  const ref = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })
  const h = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const [open, setOpen] = useState<number | null>(null)
  return (
    <ol ref={ref} className="relative ml-3 border-l border-plum-800/12 pl-10">
      <motion.span aria-hidden style={{ height: h }} className="absolute -left-px top-0 w-px bg-saffron-500" />
      {days.map((d, i) => {
        const expanded = open === i
        return (
          <motion.li
            key={i}
            className="relative pb-10 last:pb-0"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <span aria-hidden className="absolute -left-[2.95rem] top-1.5 grid h-5 w-5 place-items-center rounded-full border border-saffron-500 bg-sand-100">
              <span className="h-1.5 w-1.5 rounded-full bg-saffron-500" />
            </span>
            <p className="eyebrow text-[0.66rem] text-saffron-600">{d.day}</p>
            <h3 className="font-display mt-1 text-[1.8rem] leading-tight text-plum-800">{d.title}</h3>
            {d.text && (
              <>
                <p className={`mt-2 max-w-2xl leading-relaxed text-ink-soft ${expanded ? '' : 'line-clamp-2'}`}>{d.text}</p>
                {d.text.length > 140 && (
                  <button type="button" onClick={() => setOpen(expanded ? null : i)} className="mt-2 text-sm font-semibold text-plum-800 underline decoration-saffron-500 underline-offset-4" aria-expanded={expanded}>
                    {expanded ? 'Réduire' : 'Lire la suite'}
                  </button>
                )}
              </>
            )}
          </motion.li>
        )
      })}
    </ol>
  )
}

/** Masonry gallery with an accessible lightbox. */
export function Gallery({ images }: { images: Img[] }) {
  const [i, setI] = useState<number | null>(null)
  const n = images.length
  const go = useCallback((d: number) => setI((v) => (v == null ? v : (v + d + n) % n)), [n])
  useEffect(() => {
    if (i == null) return
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setI(null)
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', k)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', k)
      document.documentElement.style.overflow = ''
    }
  }, [i, go])

  return (
    <>
      <div className="columns-2 gap-4 md:columns-3 [&>*]:mb-4">
        {images.map((im, k) => (
          <motion.button
            type="button"
            key={im.url}
            onClick={() => setI(k)}
            className="group relative block w-full overflow-hidden rounded-[3px]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-5%' }}
            transition={{ duration: 0.8, delay: (k % 3) * 0.08, ease: EASE }}
            aria-label={`Agrandir : ${im.alt}`}
          >
            <Image src={im.url} alt={im.alt} width={im.width || 800} height={im.height || 600} sizes="(min-width:768px) 33vw, 50vw" className="h-auto w-full transition-transform duration-[1.2s] group-hover:scale-[1.05]" />
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {i != null && (
          <motion.div role="dialog" aria-modal="true" aria-label="Galerie" className="fixed inset-0 z-[80] grid place-items-center bg-plum-950/92 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setI(null)}>
            <motion.div key={i} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="relative h-[80vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
              <Image src={images[i].url} alt={images[i].alt} fill sizes="100vw" className="object-contain" />
            </motion.div>
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-sand-200">{images[i].alt} · {i + 1}/{n}</p>
            <button type="button" aria-label="Fermer" onClick={() => setI(null)} className="absolute right-5 top-5 grid h-12 w-12 place-items-center rounded-full bg-sand-50/10 text-sand-50"><X /></button>
            <button type="button" aria-label="Photo précédente" onClick={(e) => { e.stopPropagation(); go(-1) }} className="absolute left-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-sand-50/10 text-sand-50"><ChevronLeft /></button>
            <button type="button" aria-label="Photo suivante" onClick={(e) => { e.stopPropagation(); go(1) }} className="absolute right-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-sand-50/10 text-sand-50"><ChevronRight /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
