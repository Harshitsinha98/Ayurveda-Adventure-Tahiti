'use client'

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { ReactLenis, useLenis } from 'lenis/react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState, type ReactNode } from 'react'

import { INTRO_KEY, INTRO_SECONDS } from './intro'
import { EASE } from './primitives'

/** Inertia scrolling on wheel/trackpad; touch keeps native scrolling. Off under reduced motion. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.085, wheelMultiplier: 0.95, anchors: { offset: -90 }, stopInertiaOnNavigate: true }}>
      <LenisBridge />
      {children}
    </ReactLenis>
  )
}

/** Stops smooth scrolling while a dialog/menu locks the page (they set html overflow: hidden), and resets on navigation. */
function LenisBridge() {
  const lenis = useLenis()
  const pathname = usePathname()
  useEffect(() => {
    if (!lenis) return
    const html = document.documentElement
    const sync = () => (html.style.overflow === 'hidden' ? lenis.stop() : lenis.start())
    const mo = new MutationObserver(sync)
    mo.observe(html, { attributes: true, attributeFilter: ['style'] })
    return () => mo.disconnect()
  }, [lenis])
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (!window.location.hash) lenis?.scrollTo(0, { immediate: true, force: true })
  }, [pathname, lenis])
  return null
}

/** First-visit intro: emblem, name and a count to 100, then the curtain lifts with a soft curve. */
export function Preloader() {
  const [done, setDone] = useState(false)
  const [n, setN] = useState(0)
  useEffect(() => {
    if (document.documentElement.classList.contains('intro-seen')) {
      setDone(true)
      return
    }
    document.documentElement.style.overflow = 'hidden'
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / ((INTRO_SECONDS - 0.5) * 1000))
      setN(Math.round(100 * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
      else {
        try {
          sessionStorage.setItem(INTRO_KEY, '1')
        } catch {}
        setDone(true)
        document.documentElement.style.overflow = ''
      }
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      document.documentElement.style.overflow = ''
    }
  }, [])

  return (
    <AnimatePresence onExitComplete={() => document.documentElement.classList.add('intro-seen')}>
      {!done && (
        <motion.div
          aria-hidden
          className="preloader fixed inset-0 z-[200] flex flex-col items-center justify-center bg-plum-950 text-sand-50"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div initial={{ scale: 0.6, opacity: 0, rotate: -20 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} transition={{ duration: 1.1, ease: EASE }}>
            <Image src="/images/brand/emblem.png" alt="" width={84} height={84} priority className="rounded-full" />
          </motion.div>
          <p className="font-display mt-7 flex overflow-hidden text-[clamp(2rem,5vw,3.2rem)] leading-none">
            {'Ayurveda Tahiti'.split('').map((c, i) => (
              <motion.span
                key={i}
                className={`inline-block whitespace-pre ${i > 8 ? 'italic text-saffron-300' : ''}`}
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.9, delay: 0.25 + i * 0.035, ease: EASE }}
              >
                {c}
              </motion.span>
            ))}
          </p>
          <div className="absolute inset-x-[clamp(1.25rem,4vw,3rem)] bottom-10 flex items-end justify-between">
            <p className="eyebrow text-[0.62rem] text-sand-200/60">Punaauia · Tahiti</p>
            <p className="font-display text-[clamp(3rem,8vw,6rem)] leading-none tabular-nums text-saffron-300">{String(n).padStart(3, '0')}</p>
          </div>
          <motion.span className="absolute bottom-0 left-0 h-[2px] bg-saffron-500" style={{ width: `${n}%` }} />
          {/* Curved lower edge that trails the curtain as it lifts. */}
          <svg className="pointer-events-none absolute left-0 top-full h-[12vh] w-full fill-plum-950" viewBox="0 0 100 10" preserveAspectRatio="none">
            <path d="M0 0 Q50 10 100 0 Z" />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Small follower ring on precise pointers; grows over links and shows a label over [data-cursor]. */
export function Cursor() {
  const reduce = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [state, setState] = useState<{ hover: boolean; label: string | null; dark: boolean; down: boolean }>({ hover: false, label: null, dark: false, down: false })
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 })

  useEffect(() => {
    if (reduce || !matchMedia('(pointer: fine)').matches) return
    setEnabled(true)
    const move = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>('a,button,[data-cursor],input,textarea,select,label')
      const tagged = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-cursor]')
      const dark = Boolean((e.target as HTMLElement | null)?.closest('[data-cursor-dark]'))
      const field = el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)
      setState((s) => {
        const next = { ...s, hover: Boolean(el) && !field, label: tagged?.dataset.cursor || null, dark }
        return next.hover === s.hover && next.label === s.label && next.dark === s.dark ? s : next
      })
    }
    const down = () => setState((s) => ({ ...s, down: true }))
    const up = () => setState((s) => ({ ...s, down: false }))
    const leave = () => {
      x.set(-100)
      y.set(-100)
    }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [reduce, x, y])

  if (!enabled) return null
  const size = state.label ? 96 : state.hover ? 54 : 14
  return (
    <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[150]" style={{ x: sx, y: sy }}>
      <motion.div
        className={`flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${
          state.label ? 'bg-saffron-500 text-plum-950' : state.hover ? `border ${state.dark ? 'border-sand-50/70' : 'border-plum-800/50'} bg-transparent` : state.dark ? 'bg-sand-50' : 'bg-plum-800'
        }`}
        animate={{ width: size, height: size, scale: state.down ? 0.85 : 1 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      >
        <AnimatePresence>
          {state.label && (
            <motion.span initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              {state.label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
