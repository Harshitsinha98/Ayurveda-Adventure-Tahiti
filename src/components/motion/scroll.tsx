'use client'

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from 'framer-motion'
import Image from 'next/image'
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'

import type { Img } from '@/lib/payload'

import { EASE } from './primitives'

const useIsoLayout = typeof window === 'undefined' ? useEffect : useLayoutEffect

/** Words rise from behind a mask when the heading enters the viewport. Text stays in the DOM for SEO. */
export function SplitWords({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.045,
  as: Tag = 'span',
  onLoad = false,
}: {
  text: string
  className?: string
  wordClassName?: string
  delay?: number
  stagger?: number
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p'
  /** Animate on mount instead of on scroll into view. */
  onLoad?: boolean
}) {
  const words = text.split(/\s+/).filter(Boolean)
  const M = motion[Tag] as typeof motion.span
  // One observer on the whole heading: words start clipped by their masks, so they cannot be observed themselves.
  const trigger = onLoad ? { animate: 'show' } : { whileInView: 'show', viewport: { once: true, margin: '0px 0px -10% 0px' } }
  return (
    <M className={className} initial="hidden" {...trigger}>
      <span className="sr-only">{text}</span>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.12em] align-bottom leading-[inherit]">
          <motion.span
            className={`inline-block ${wordClassName ?? ''}`}
            variants={{ hidden: { y: '115%', rotate: 4 }, show: { y: '0%', rotate: 0, transition: { duration: 1, delay: delay + i * stagger, ease: EASE } } }}
          >
            {w}
            {i < words.length - 1 ? '\u00a0' : ''}
          </motion.span>
        </span>
      ))}
    </M>
  )
}

/** Photo uncovered by a rising curtain, then gently counter-scrolled. */
export function ImageReveal({
  image,
  className = '',
  sizes,
  priority,
  parallax = 40,
  delay = 0,
  position,
}: {
  image: Img
  className?: string
  sizes: string
  priority?: boolean
  parallax?: number
  delay?: number
  position?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-parallax, parallax])
  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 1.3, delay, ease: [0.77, 0, 0.18, 1] }}
    >
      <motion.div
        className="absolute inset-[-8%]"
        style={{ y }}
        initial={{ scale: 1.3 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, delay, ease: EASE }}
      >
        <Image src={image.url} alt={image.alt} fill priority={priority} sizes={sizes} className="object-cover" style={position ? { objectPosition: position } : undefined} />
      </motion.div>
    </motion.div>
  )
}

/** Endless band of words; scrolling speeds it up and flips its direction. */
export function VelocityMarquee({ items, className = '', baseSpeed = 2.2 }: { items: string[]; className?: string; baseSpeed?: number }) {
  const reduce = useReducedMotion()
  const base = useMotionValue(0)
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const smooth = useSpring(velocity, { damping: 50, stiffness: 300 })
  const factor = useTransform(smooth, [-1000, 0, 1000], [-4, 0, 4], { clamp: false })
  const skew = useTransform(smooth, [-2000, 0, 2000], [6, 0, -6])
  const dir = useRef(1)
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`)

  useAnimationFrame((_, delta) => {
    if (reduce) return
    let move = dir.current * baseSpeed * (delta / 1000)
    const f = factor.get()
    if (f < 0) dir.current = -1
    else if (f > 0) dir.current = 1
    move += dir.current * move * Math.abs(f)
    base.set(base.get() + move)
  })

  const row = (
    <span className="flex shrink-0 items-center">
      {items.map((w, i) => (
        <span key={i} className="flex items-center">
          <span className={i % 2 ? 'italic text-saffron-500' : ''}>{w}</span>
          <svg aria-hidden viewBox="0 0 24 24" className="mx-[0.45em] h-[0.42em] w-[0.42em] shrink-0 fill-current opacity-60">
            <path d="M12 0c.8 6.6 5.4 11.2 12 12-6.6.8-11.2 5.4-12 12-.8-6.6-5.4-11.2-12-12C6.6 11.2 11.2 6.6 12 0Z" />
          </svg>
        </span>
      ))}
    </span>
  )
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`} aria-label={items.join(', ')} role="marquee">
      <motion.div aria-hidden className="flex w-max" style={{ x, skewX: reduce ? 0 : skew }}>
        {row}
        {row}
      </motion.div>
    </div>
  )
}

const wrap = (min: number, max: number, v: number) => {
  const r = max - min
  return ((((v - min) % r) + r) % r) + min
}

/** Sticky full-height cards that stack; each card shrinks a little as the next one slides over it. */
export function StackCards({ children, className = '' }: { children: ReactNode[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const n = children.length
  return (
    <div ref={ref} className={className}>
      {children.map((c, i) => (
        <StackCard key={i} i={i} n={n} progress={scrollYProgress}>
          {c}
        </StackCard>
      ))}
    </div>
  )
}

function StackCard({ i, n, progress, children }: { i: number; n: number; progress: MotionValue<number>; children: ReactNode }) {
  const reduce = useReducedMotion()
  const target = 1 - (n - i) * 0.035
  const scale = useTransform(progress, [i / n, 1], reduce ? [1, 1] : [1, target])
  const dim = useTransform(progress, [i / n, Math.min(1, (i + 1) / n)], reduce ? [0, 0] : [0, i === n - 1 ? 0 : 0.35])
  return (
    <div className="sticky top-0 flex h-[100svh] items-center justify-center" style={{ paddingTop: `calc(84px + ${i * 14}px)` }}>
      <motion.div style={{ scale }} className="relative w-full origin-top will-change-transform">
        {children}
        <motion.div aria-hidden style={{ opacity: dim }} className="pointer-events-none absolute inset-0 rounded-[3px] bg-plum-950" />
      </motion.div>
    </div>
  )
}

/** Vertical scroll drives a horizontal track while the section is pinned (desktop). Mobile gets native swipe. */
export function HorizontalScroll({ children, head, className = '' }: { children: ReactNode; head?: ReactNode; className?: string }) {
  const outer = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const [dist, setDist] = useState(0)
  const [pin, setPin] = useState(false)

  useIsoLayout(() => {
    const measure = () => {
      const desktop = matchMedia('(min-width: 1024px)').matches && !reduce
      setPin(desktop)
      if (track.current) setDist(Math.max(0, track.current.scrollWidth - window.innerWidth))
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (track.current) ro.observe(track.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [reduce])

  const { scrollYProgress } = useScroll({ target: outer, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist])
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  if (!pin) {
    return (
      <section ref={outer} className={className}>
        {head}
        <div ref={track} className="flex snap-x snap-mandatory scroll-px-[clamp(1.25rem,4vw,3rem)] gap-5 overflow-x-auto px-[clamp(1.25rem,4vw,3rem)] pb-6 [scrollbar-width:none]">
          {children}
        </div>
      </section>
    )
  }
  return (
    <section ref={outer} className={`relative ${className}`} style={{ height: `calc(100vh + ${dist}px)` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        {head}
        <motion.div ref={track} style={{ x }} className="flex w-max gap-8 px-[clamp(1.25rem,4vw,3rem)] will-change-transform">
          {children}
        </motion.div>
        <div className="container-x mt-10">
          <div className="h-px w-full bg-current/15">
            <motion.div className="h-px bg-saffron-500" style={{ width: bar }} />
          </div>
        </div>
      </div>
    </section>
  )
}

/** Cinematic zoom: a cluster of photos grows at different speeds until the centre one fills the screen. */
export function ZoomParallax({ images, children }: { images: Img[]; children?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const scales = [4, 5, 6, 5, 6, 8, 9]
  const slots = [
    'h-[25vh] w-[25vw]',
    '-top-[30vh] left-[5vw] h-[30vh] w-[35vw]',
    '-top-[12vh] -left-[27vw] h-[45vh] w-[20vw]',
    'left-[27.5vw] h-[25vh] w-[25vw]',
    'top-[27.5vh] left-[5vw] h-[25vh] w-[20vw]',
    'top-[27.5vh] -left-[22.5vw] h-[25vh] w-[30vw]',
    'top-[22.5vh] left-[25vw] h-[15vh] w-[15vw]',
  ]
  const textOpacity = useTransform(scrollYProgress, [0.72, 0.9], [0, 1])
  const textY = useTransform(scrollYProgress, [0.72, 0.95], [60, 0])

  if (reduce) {
    return (
      <div className="relative">
        {images[0] && (
          <div className="relative h-[80vh]">
            <Image src={images[0].url} alt={images[0].alt} fill sizes="100vw" className="object-cover" />
          </div>
        )}
        {children && <div className="absolute inset-0 flex items-end">{children}</div>}
      </div>
    )
  }
  return (
    <div ref={ref} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {images.slice(0, 7).map((im, i) => (
          <ZoomTile key={im.url} progress={scrollYProgress} scale={scales[i]} slot={slots[i]} image={im} />
        ))}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-plum-950/80 via-plum-950/10 to-transparent" />
        {children && (
          <motion.div style={{ opacity: textOpacity, y: textY }} className="absolute inset-0 flex items-end">
            {children}
          </motion.div>
        )}
      </div>
    </div>
  )
}

function ZoomTile({ progress, scale, slot, image }: { progress: MotionValue<number>; scale: number; slot: string; image: Img }) {
  const s = useTransform(progress, [0, 0.85], [1, scale])
  return (
    <motion.div style={{ scale: s }} className="absolute top-0 flex h-full w-full items-center justify-center">
      <div className={`relative overflow-hidden rounded-[2px] ${slot}`}>
        <Image src={image.url} alt={image.alt} fill sizes="50vw" className="object-cover" />
      </div>
    </motion.div>
  )
}

/** Big text that grows from small and pale to full size as it crosses the viewport. */
export function ScaleOnScroll({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0.72, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.8], reduce ? [1, 1] : [0.15, 1])
  return (
    <motion.div ref={ref} style={{ scale, opacity }} className={className}>
      {children}
    </motion.div>
  )
}

/** Card that tilts toward the pointer in 3D (desktop only). */
export function Tilt({ children, className = '', max = 7 }: { children: ReactNode; className?: string; max?: number }) {
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 180, damping: 18 })
  const sry = useSpring(ry, { stiffness: 180, damping: 18 })
  return (
    <motion.div
      className={className}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse') return
        const r = e.currentTarget.getBoundingClientRect()
        ry.set(((e.clientX - r.left) / r.width - 0.5) * max * 2)
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * max * 2)
      }}
      onPointerLeave={() => {
        rx.set(0)
        ry.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}

/** Thin SVG line that draws itself as the section scrolls past. */
export function DrawLine({ className = '', d = 'M2 50 C 150 -20, 250 120, 400 50 S 650 -20, 798 50' }: { className?: string; d?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 90%', 'end 30%'] })
  const len = useSpring(scrollYProgress, { stiffness: 80, damping: 25 })
  return (
    <div ref={ref} aria-hidden className={className}>
      <svg viewBox="0 0 800 100" fill="none" className="h-full w-full" preserveAspectRatio="none">
        <motion.path d={d} stroke="currentColor" strokeWidth="1.2" style={{ pathLength: len }} />
      </svg>
    </div>
  )
}
