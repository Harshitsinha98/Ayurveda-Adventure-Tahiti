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
  const scale = useTransform(progress, [0, 1], [0.6, 1])
  const glow = useTransform(progress, [0, 1], [0.3, 1])
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
                className="inline-flex items-center gap-3 rounded-[2px] border border-saffron-300/60 px-6 py-3.5 text-sm font-semibold text-saffron-300 transition hover:bg-saffron-300 hover:text-plum-950"
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

        <div className="relative mx-auto grid aspect-square w-full max-w-[440px] place-items-center">
          <span aria-hidden className="absolute inset-0 rounded-full border border-sand-50/10" />
          <span aria-hidden className="absolute inset-[12%] rounded-full border border-sand-50/10" />
          <motion.span aria-hidden style={{ scale }} className="absolute inset-[4%] rounded-full border border-saffron-300/70" />
          <motion.span aria-hidden style={{ scale, opacity: glow }} className="absolute inset-[4%] rounded-full bg-[radial-gradient(circle,rgba(232,198,140,0.22),rgba(232,198,140,0)_70%)]" />
          <div className="relative text-center" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div key={running ? current.label : 'idle'} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.6 }}>
                <p className="font-display text-5xl text-sand-50">{running ? current.label : 'Prêt·e ?'}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.24em] text-saffron-300/80">{running ? current.hint : 'Installe-toi confortablement'}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
