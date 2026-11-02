'use client'

import { motion } from 'framer-motion'

import { EASE } from '@/components/motion/primitives'
import { SplitWords, Tilt } from '@/components/motion/scroll'

type Dosha = { name: string; el: string; text: string }

/** Line drawings for each dosha: air (spiral), fire (flame), earth (mountain), drawn as the cards appear. */
const GLYPHS = [
  'M50 50 m-4 0 a4 4 0 1 1 8 0 a10 10 0 1 1 -20 0 a16 16 0 1 1 32 0 a22 22 0 1 1 -44 0 a28 28 0 1 1 56 0',
  'M50 12 C 62 32, 76 44, 70 64 C 66 78, 56 86, 50 86 C 44 86, 30 80, 30 62 C 30 50, 40 44, 42 34 C 48 44, 50 50, 56 52 C 56 40, 54 26, 50 12 Z',
  'M8 82 L 36 40 L 50 58 L 64 30 L 92 82 Z M 22 82 L 50 70 L 78 82',
]

export function Doshas({ eyebrow, title, accent, intro, items }: { eyebrow: string; title: string; accent: string; intro: string; items: Dosha[] }) {
  return (
    <section className="relative overflow-hidden bg-plum-950 py-28 text-sand-50 lg:py-40" aria-labelledby="dosha-title" data-cursor-dark>
      <div aria-hidden className="pointer-events-none absolute -left-40 top-1/3 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(210,154,72,0.16),transparent_65%)]" />
      <div className="container-x relative">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <p className="eyebrow text-saffron-300">{eyebrow}</p>
            <h2 id="dosha-title" className="mt-5 text-[clamp(2.6rem,5.6vw,5rem)] leading-[1]">
              <SplitWords text={title} />{' '}
              <SplitWords text={accent} delay={0.2} wordClassName={'italic text-saffron-300'} />
            </h2>
          </div>
          <motion.p className="max-w-xl text-lg leading-relaxed text-sand-200/80" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, ease: EASE }}>
            {intro}
          </motion.p>
        </div>
        <ol className="mt-16 grid gap-6 md:grid-cols-3 lg:mt-24">
          {items.map((d, i) => (
            <motion.li key={d.name} initial={{ opacity: 0, y: 80 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-10%' }} transition={{ duration: 1.1, delay: i * 0.12, ease: EASE }} className={i === 1 ? 'md:mt-16' : ''}>
              <Tilt className="group relative h-full overflow-hidden rounded-[3px] border border-sand-50/12 bg-sand-50/[0.04] p-8 backdrop-blur-sm transition-colors duration-700 hover:border-saffron-300/40 lg:p-10">
                <svg viewBox="0 0 100 100" aria-hidden className="h-24 w-24 text-saffron-300">
                  <motion.path d={GLYPHS[i % GLYPHS.length]} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2.2, delay: 0.3 + i * 0.2, ease: 'easeInOut' }} />
                </svg>
                <p className="eyebrow mt-8 text-[0.64rem] text-saffron-300/80">{d.el}</p>
                <p className="font-display mt-3 text-6xl">{d.name}</p>
                <p className="mt-5 leading-relaxed text-sand-200/80">{d.text}</p>
                <span aria-hidden className="absolute -right-6 -top-10 font-display text-[11rem] leading-none text-sand-50/[0.04] transition-transform duration-1000 group-hover:-translate-y-3">{d.name.charAt(0)}</span>
              </Tilt>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
