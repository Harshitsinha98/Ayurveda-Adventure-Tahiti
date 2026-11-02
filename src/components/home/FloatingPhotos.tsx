'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { useRef } from 'react'

import type { Img } from '@/lib/payload'

const SPOTS = [
  { cls: 'left-[3%] top-[12%] w-36 aspect-[3/4] rotate-[-4deg]', speed: 220 },
  { cls: 'right-[4%] top-[8%] w-44 aspect-[4/5] rotate-[3deg]', speed: -160 },
  { cls: 'right-[12%] bottom-[2%] w-32 aspect-square rotate-[-2deg]', speed: 300 },
]

/** Decorative photos drifting at different speeds around a centred block of text (large screens only). */
export function FloatingPhotos({ images }: { images: (Img | null)[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 hidden xl:block">
      {images.map((im, i) => (im ? <Float key={im.url} im={im} spot={SPOTS[i % SPOTS.length]} progress={scrollYProgress} reduce={!!reduce} /> : null))}
    </div>
  )
}

function Float({ im, spot, progress, reduce }: { im: Img; spot: (typeof SPOTS)[number]; progress: ReturnType<typeof useScroll>['scrollYProgress']; reduce: boolean }) {
  const y = useTransform(progress, [0, 1], reduce ? [0, 0] : [spot.speed, -spot.speed])
  return (
    <motion.div style={{ y }} className={`absolute overflow-hidden rounded-[2px] opacity-90 shadow-[0_30px_60px_-30px_rgba(42,11,28,0.5)] ${spot.cls}`}>
      <Image src={im.url} alt="" fill sizes="180px" className="object-cover" />
    </motion.div>
  )
}
