'use client'

import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import { Pause, Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Reveal } from '@/components/motion/primitives'

/**
 * A guided breathing circle (4 s in · 4 s hold · 6 s out).
 * A small moment of practice inside the website, in the spirit of Eliane's teaching.
 */
const PHASES = [
  { label: 'Inspire', hint: 'par le nez, lentement', seconds: 4, to: 1 },
  { label: 'Retiens', hint: 'sans effort', seconds: 4, to: 1 },
  { label: 'Expire', hint: 'longuement, en relâchant', seconds: 6, to: 0 },
] as const

export function Breath() {
  const reduce = useReducedMotion()
  const [running, setRunning] = useState(false)
  const [phase, setPhase] = useState(0)
  const [cycles, setCycles] = useState(0)
  const progress = useMotionValue(0)
  const scale = useTransform(progress, [0, 1], [0.72, 1])
  const glow = useTransform(progress, [0, 1], [0.25, 0.75])
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!running) {
      if (timer.current) clearTimeout(timer.current)
      animate(progress, 0, { duration: 1.2 })
      return
    }
    const p = PHASES[phase]
    const controls = animate(progress, p.to, { duration: reduce ? 0 : p.seconds, ease: 'easeInOut' })
    timer.current = setTimeout(() => {
      const next = (phase + 1) % PHASES.length
      if (next === 0) setCycles((c) => c + 1)
      setPhase(next)
    }, p.seconds * 1000)
    return () => {
      controls.stop()
      if (timer.current) clearTimeout(timer.current)
    }
  }, [running, phase, progress, reduce])

  const current = PHASES[phase]

  return (
    <section className="relative overflow-hidden bg-plum-900 py-28 text-sand-50 lg:py-36" aria-labelledby="breath-title">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(210,154,72,0.16),transparent_60%)]" />
      <div className="container-x relative grid items-center gap-16 lg:grid-cols-2">
        <div>
          <Reveal>
            <p className="eyebrow text-saffron-300">Une minute pour toi</p>
            <h2 id="breath-title" className="mt-5 text-[clamp(2.6rem,5vw,4.4rem)]">
              Avant de lire plus loin, <em className="text-saffron-300">respire avec moi.</em>
            </h2>
            <p className="mt-6 max-w-md text-lg text-sand-200/80">
              Trois respirations suffisent pour sentir le mental ralentir. C’est ainsi que commence chacun de mes cours :
              par un retour au souffle.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-10 flex items-center gap-5">
              <button
                type="button"
                onClick={() => {
                  setRunning((r) => !r)
                  setPhase(0)
                }}
                className="inline-flex items-center gap-3 rounded-full bg-saffron-500 px-6 py-3.5 text-sm font-semibold text-plum-950 transition hover:bg-saffron-300"
              >
                {running ? <Pause size={16} /> : <Play size={16} />}
                {running ? 'Faire une pause' : 'Commencer'}
              </button>
              <span className="text-sm text-sand-200/70" aria-live="polite">
                {cycles > 0 ? `${cycles} respiration${cycles > 1 ? 's' : ''}` : 'Cycle 4 · 4 · 6'}
              </span>
            </div>
          </Reveal>
        </div>

        <div className="relative mx-auto grid aspect-square w-full max-w-[460px] place-items-center">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              aria-hidden
              className="absolute inset-0 rounded-full border border-saffron-300/25"
              animate={{ scale: [1, 1.08 + i * 0.05, 1], opacity: [0.35, 0.1, 0.35] }}
              transition={{ duration: 7 + i * 2, repeat: Infinity, ease: 'easeInOut', delay: i }}
            />
          ))}
          <motion.div
            style={{ scale }}
            className="relative grid aspect-square w-[78%] place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#f2d9a8,#d29a48_45%,#8a4a6b_100%)]"
          >
            <motion.div aria-hidden style={{ opacity: glow }} className="absolute inset-[-18%] -z-10 rounded-full bg-saffron-500/40 blur-3xl" />
          </motion.div>
          <div className="absolute text-center" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div key={running ? current.label : 'idle'} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.5 }}>
                <p className="font-display text-5xl text-plum-950">{running ? current.label : 'Prêt·e ?'}</p>
                <p className="mt-1 text-sm text-plum-900/80">{running ? current.hint : 'Installe-toi confortablement'}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
