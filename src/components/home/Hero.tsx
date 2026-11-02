'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'

import { EASE, MaskLines } from '@/components/motion/primitives'
import { useT } from '@/i18n/client'
import type { Img } from '@/lib/payload'

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
  const t = useT().hero
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 140])
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12])
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60])
  const accentY = useTransform(scrollYProgress, [0, 1], [0, -90])

  return (
    <section ref={ref} className="grain relative overflow-hidden pb-20 pt-[120px] lg:min-h-[100svh] lg:pb-0">
      {/* Soft sun behind the arch */}
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
                          <Link
                href="/offres/consultation-decouverte"
                className="group inline-flex items-center gap-3 rounded-[2px] bg-plum-800 px-8 py-4 text-[0.95rem] font-semibold text-sand-50 shadow-[0_20px_40px_-18px_rgba(74,24,56,0.7)] transition hover:bg-plum-700"
              >
                {t.cta}
                <ArrowRight size={16} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
            <Link href="/voyage-en-inde" className="group inline-flex items-center gap-2 px-2 py-3 text-[0.95rem] font-semibold text-plum-800">
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
                {t.trips}
              </span>
            </Link>
          </motion.div>
        </motion.div>

        <div className="relative mx-auto w-full max-w-[520px] lg:mr-0">
          <motion.div
            className="arch relative aspect-[4/5.3] overflow-hidden shadow-[0_50px_100px_-40px_rgba(42,11,28,0.55)]"
            initial={{ clipPath: 'inset(100% 0% 0% 0% round 2px)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0% round 2px)' }}
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
              className="absolute -bottom-10 -left-6 hidden w-44 sm:block lg:-left-20 lg:w-52"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 1, ease: EASE }}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] shadow-[0_30px_60px_-30px_rgba(42,11,28,0.5)] outline outline-1 outline-offset-[10px] outline-plum-800/15">
                <Image src={accent.url} alt={accent.alt} fill sizes="210px" className="object-cover" />
              </div>
            </motion.div>
          )}

          <motion.div
            className="absolute -right-2 top-10 border-l-2 border-saffron-500 bg-sand-50/95 px-5 py-4 shadow-[0_20px_50px_-24px_rgba(42,11,28,0.35)] backdrop-blur sm:-right-8"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 1.3, ease: EASE }}
          >
            <p className="eyebrow text-[0.62rem] text-sage-700">{t.badgeTop}</p>
            <p className="font-display mt-1 text-xl italic text-plum-800">{t.badge}</p>
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
        {t.scroll}
        <motion.span className="block h-10 w-px origin-top bg-plum-800/40" animate={{ scaleY: [0, 1, 0], y: [0, 0, 20] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }} />
      </motion.div>
    </section>
  )
}
