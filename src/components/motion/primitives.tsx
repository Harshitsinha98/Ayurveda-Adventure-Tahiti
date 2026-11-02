'use client'

import {
  motion,
  MotionConfig,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type HTMLMotionProps,
} from 'framer-motion'
import { useEffect, useRef, type ReactNode } from 'react'

export const EASE = [0.22, 1, 0.36, 1] as const

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ ease: EASE, duration: 0.8 }}>
      {children}
    </MotionConfig>
  )
}

/** Fade and rise into view once. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = 'div',
  ...rest
}: { children: ReactNode; delay?: number; y?: number; className?: string; as?: 'div' | 'li' | 'section' | 'article' } & HTMLMotionProps<'div'>) {
  const C = motion[as] as typeof motion.div
  return (
    <C
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1.1, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </C>
  )
}

/** Each line slides up from behind a mask, like ink appearing. */
export function MaskLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.12,
  as = 'h1',
}: {
  lines: string[]
  className?: string
  lineClassName?: (i: number) => string
  delay?: number
  stagger?: number
  as?: 'h1' | 'h2' | 'p'
}) {
  const Tag = as
  return (
    <Tag className={className}>
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className={`block ${lineClassName?.(i) ?? ''}`}
            initial={{ y: '110%', rotate: 2 }}
            animate={{ y: '0%', rotate: 0 }}
            transition={{ duration: 1.1, delay: delay + i * stagger, ease: EASE }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

/** Words brighten one by one as the paragraph scrolls through the viewport. */
export function ScrollWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 45%'] })
  const words = text.split(/\s+/)
  return (
    <p ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </Word>
      ))}
    </p>
  )
}

function Word({
  children,
  progress,
  range,
}: {
  children: string
  progress: ReturnType<typeof useScroll>['scrollYProgress']
  range: [number, number]
}) {
  const opacity = useTransform(progress, range, [0.16, 1])
  return (
    <motion.span aria-hidden style={{ opacity }} className="inline-block whitespace-pre">
      {children}{' '}
    </motion.span>
  )
}

/** Gentle vertical parallax for images. */
export function Parallax({ children, amount = 60, className }: { children: ReactNode; amount?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-amount, amount])
  return (
    <div ref={ref} className={`overflow-hidden ${className ?? ''}`}>
      <motion.div style={{ y, scale: 1.12 }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  )
}

/** Buttons that lean slightly toward the cursor. */
export function Magnetic({ children, strength = 0.25, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18 })
  const sy = useSpring(y, { stiffness: 220, damping: 18 })
  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className ?? ''}`}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse') return
        const r = ref.current!.getBoundingClientRect()
        x.set((e.clientX - r.left - r.width / 2) * strength)
        y.set((e.clientY - r.top - r.height / 2) * strength)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}

/** Animated count-up, triggered on view. */
export function CountUp({ to, className }: { to: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const mv = useMotionValue(0)
  const spring = useSpring(mv, { stiffness: 40, damping: 18 })
  const rounded = useTransform(spring, (v) => Math.round(v).toLocaleString('fr-FR'))
  useEffect(() => {
    if (inView) mv.set(to)
  }, [inView, mv, to])
  return (
    <motion.span ref={ref} className={className}>
      {rounded}
    </motion.span>
  )
}

export { motion }
