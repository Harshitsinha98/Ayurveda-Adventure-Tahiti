'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'

import { EASE, Magnetic, MaskLines } from '@/components/motion/primitives'
import type { Img } from '@/lib/payload'

/** Rotating text ring around the small image. */
function Ring({ text }: { text: string }) {
  return (
    <motion.svg
      viewBox="0 0 200 200"
      className="absolute -inset-6 h-[calc(100%+3rem)] w-[calc(100%+3rem)] text-plum-800"
      animate={{ rotate: 360 }}
      transition={{ duration: 38, repeat: Infinity, ease: 'linear' }}
      aria-hidden
    >
      <defs>
        <path id="ring" d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0" />
      </defs>
      <text className="fill-current text-[11.5px] uppercase tracking-[0.42em]" style={{ fontFamily: 'var(--font-manrope)' }}>
        <textPath href="#ring">{text}</textPath>
      </text>
    </motion.svg>
  )
}

export function Hero({
  eyebrow,
  lines,
  intro,
  image,
  accent,
}: {
  eyebrow?: string | null
  lines: string[]
  intro?: string | null
  image?: Img | null
  accent?: Img | null
}) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 140])
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12])
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60])
  const accentY = useTransform(scrollYProgress, [0, 1], [0, -90])

  return (
    <section ref={ref} className="grain relative overflow-hidden pb-20 pt-[120px] lg:min-h-[100svh] lg:pb-0">
      {/* Soft sun behind the arch */}
      <div aria-hidden className="pointer-events-none absolute right-[-10%] top-[8%] h-[70vmin] w-[70vmin] rounded-full bg-[radial-gradient(circle,rgba(232,198,140,0.55),rgba(247,241,232,0)_70%)]" />
      <div className="container-x relative grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.div style={{ y: textY }} className="relative z-10">
          <motion.p
            className="eyebrow text-saffron-600"
            initial={{ opacity: 0, letterSpacing: '0.6em' }}
            animate={{ opacity: 1, letterSpacing: '0.28em' }}
            transition={{ duration: 1.4, ease: EASE }}
          >
            {eyebrow}
          </motion.p>
          <MaskLines
            lines={lines}
            delay={0.2}
            className="mt-6 text-[clamp(2.35rem,9.6vw,4.6rem)] leading-[1.02] text-plum-800 sm:whitespace-nowrap lg:text-[clamp(3rem,5.2vw,5.6rem)]"
            lineClassName={(i) => (i === 1 ? 'italic text-saffron-600 sm:pl-[0.6em]' : i === 2 ? 'sm:pl-[0.2em]' : '')}
          />
          <motion.p
            className="mt-8 max-w-[34rem] text-lg leading-relaxed text-ink-soft"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.75, ease: EASE }}
          >
            {intro}
          </motion.p>
          <motion.div
            className="mt-10 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9, ease: EASE }}
          >
            <Magnetic>
              <Link
                href="/offres/consultation-decouverte"
                className="group inline-flex items-center gap-3 rounded-full bg-plum-800 py-4 pl-7 pr-5 text-[0.95rem] font-semibold text-sand-50 shadow-[0_20px_40px_-18px_rgba(74,24,56,0.7)] transition hover:bg-plum-700"
              >
                Un premier échange offert
                <span className="grid h-8 w-8 place-items-center rounded-full bg-sand-50/15 transition-transform duration-500 group-hover:translate-x-1">
                  <ArrowRight size={16} />
                </span>
              </Link>
            </Magnetic>
            <Link href="/voyage-en-inde" className="group inline-flex items-center gap-2 px-2 py-3 text-[0.95rem] font-semibold text-plum-800">
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
                Voyages spirituels en Inde
              </span>
            </Link>
          </motion.div>
        </motion.div>

        <div className="relative mx-auto w-full max-w-[520px] lg:mr-0">
          <motion.div
            className="arch relative aspect-[4/5.3] overflow-hidden shadow-[0_50px_100px_-40px_rgba(42,11,28,0.55)]"
            initial={{ clipPath: 'inset(100% 0% 0% 0% round 999px 999px 28px 28px)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0% round 999px 999px 28px 28px)' }}
            transition={{ duration: 1.6, delay: 0.1, ease: EASE }}
          >
            {image && (
              <motion.div style={{ y: imgY, scale: imgScale }} className="absolute inset-[-6%]">
                <Image src={image.url} alt={image.alt} fill priority sizes="(min-width: 1024px) 520px, 90vw" className="object-cover" style={{ objectPosition: '45% 40%' }} />
              </motion.div>
            )}
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-plum-950/35 via-transparent to-transparent" />
          </motion.div>

          {accent && (
            <motion.div
              style={{ y: accentY }}
              className="absolute -bottom-8 -left-6 h-36 w-36 sm:-left-16 sm:h-44 sm:w-44"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 1, ease: EASE }}
            >
              <Ring text="Ayurveda · Méditation · Yoga · Tahiti · " />
              <div className="relative h-full w-full overflow-hidden rounded-full border-[6px] border-sand-100">
                <Image src={accent.url} alt={accent.alt} fill sizes="180px" className="object-cover" />
              </div>
            </motion.div>
          )}

          <motion.div
            className="absolute -right-2 top-10 rounded-2xl bg-sand-50/90 px-5 py-4 shadow-[0_20px_50px_-24px_rgba(42,11,28,0.4)] backdrop-blur sm:-right-8"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 1.3, ease: EASE }}
          >
            <p className="eyebrow text-[0.62rem] text-sage-700">À Punaauia & en ligne</p>
            <p className="font-display mt-1 text-xl italic text-plum-800">La vie est maintenant</p>
          </motion.div>
        </div>
      </div>

      <motion.div
        aria-hidden
        className="absolute bottom-8 left-[44%] hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.62rem] uppercase tracking-[0.3em] text-ink-soft lg:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        Défiler
        <motion.span className="block h-10 w-px origin-top bg-plum-800/40" animate={{ scaleY: [0, 1, 0], y: [0, 0, 20] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }} />
      </motion.div>
    </section>
  )
}
