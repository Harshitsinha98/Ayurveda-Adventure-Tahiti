'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { useEffect, useState } from 'react'

import { EASE } from '@/components/motion/primitives'

type T = { id: string | number; quote: string; highlight?: string | null; name: string; context?: string | null }

/** Accessible quote carousel: pauses on hover/focus, has controls, respects reduced motion. */
export function Testimonials({ items }: { items: T[] }) {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const [dir, setDir] = useState(1)
  const n = items.length

  useEffect(() => {
    if (paused || n < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setTimeout(() => {
      setDir(1)
      setI((v) => (v + 1) % n)
    }, 9000)
    return () => clearTimeout(t)
  }, [i, paused, n])

  if (!n) return null
  const t = items[i]
  const go = (d: number) => {
    setDir(d)
    setI((v) => (v + d + n) % n)
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      aria-roledescription="carrousel"
      aria-label="Témoignages"
    >
      <div className="min-h-[340px] md:min-h-[300px]" aria-live="polite">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.figure
            key={t.id}
            custom={dir}
            initial={{ opacity: 0, x: 40 * dir, filter: 'blur(6px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -40 * dir, filter: 'blur(6px)' }}
            transition={{ duration: 0.7, ease: EASE }}
            aria-label={`Témoignage ${i + 1} sur ${n}`}
          >
            <blockquote>
              <p className="font-display text-[clamp(1.9rem,3.6vw,3.1rem)] leading-[1.15] text-plum-800">
                <span aria-hidden className="mr-1 text-saffron-500">“</span>
                {t.highlight || t.quote}
                <span aria-hidden className="text-saffron-500">”</span>
              </p>
              {t.highlight && <p className="mt-6 max-w-2xl text-[0.98rem] leading-relaxed text-ink-soft">{t.quote}</p>}
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-4">
              <span aria-hidden className="h-px w-10 bg-saffron-500" />
              <span>
                <span className="block font-semibold text-plum-800">{t.name}</span>
                {t.context && <span className="text-sm text-ink-soft">{t.context}</span>}
              </span>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>
      {n > 1 && (
        <div className="mt-10 flex items-center gap-3">
          <button type="button" onClick={() => go(-1)} aria-label="Témoignage précédent" className="grid h-12 w-12 place-items-center rounded-full border border-plum-800/20 text-plum-800 transition hover:bg-plum-800 hover:text-sand-50">
            <ChevronLeft size={18} />
          </button>
          <button type="button" onClick={() => go(1)} aria-label="Témoignage suivant" className="grid h-12 w-12 place-items-center rounded-full border border-plum-800/20 text-plum-800 transition hover:bg-plum-800 hover:text-sand-50">
            <ChevronRight size={18} />
          </button>
          <button type="button" onClick={() => setPaused((p) => !p)} aria-label={paused ? 'Reprendre le défilement' : 'Mettre en pause'} className="grid h-12 w-12 place-items-center rounded-full text-plum-800/70 transition hover:text-plum-800">
            {paused ? <Play size={16} /> : <Pause size={16} />}
          </button>
          <div className="ml-4 flex gap-2" aria-hidden>
            {items.map((x, k) => (
              <span key={x.id} className={`h-1 rounded-full transition-all duration-700 ${k === i ? 'w-10 bg-saffron-500' : 'w-4 bg-plum-800/15'}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
