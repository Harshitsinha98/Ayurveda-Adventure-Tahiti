'use client'

import { AnimatePresence, motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import { EASE } from '@/components/motion/primitives'
import { SplitWords } from '@/components/motion/scroll'
import type { Img } from '@/lib/payload'

type Pillar = { title: string; text?: string | null }

/**
 * Morning ritual. On large screens the photo column stays in place while the pillars scroll by;
 * the photo changes with the pillar in the middle of the screen.
 */
export function Ritual({ eyebrow, title, text, badge, pillars, images }: { eyebrow: string; title: string; text: string; badge: string; pillars: Pillar[]; images: Img[] }) {
  const [active, setActive] = useState(0)
  const im = images[active % images.length]
  return (
    <section className="relative bg-sand-100" aria-labelledby="ritual-title">
      <div className="container-x grid gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="relative hidden lg:block">
          <div className="sticky top-0 flex h-screen items-center">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[3px] bg-plum-900" data-cursor-dark>
              <AnimatePresence initial={false} mode="popLayout">
                {im && (
                  <motion.div
                    key={im.url}
                    className="absolute inset-0"
                    initial={{ clipPath: 'inset(100% 0% 0% 0%)', scale: 1.15 }}
                    animate={{ clipPath: 'inset(0% 0% 0% 0%)', scale: 1 }}
                    exit={{ opacity: 0.4 }}
                    transition={{ duration: 1.1, ease: [0.77, 0, 0.18, 1] }}
                  >
                    <Image src={im.url} alt={im.alt} fill sizes="45vw" className="object-cover" />
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="absolute bottom-6 left-6 z-10 flex items-end gap-4 rounded-[2px] bg-plum-950/80 px-6 py-5 text-sand-50 backdrop-blur-md">
                <span className="font-display text-6xl leading-none text-saffron-300">20</span>
                <span className="max-w-[11rem] pb-1 text-sm leading-snug text-sand-200/85">{badge}</span>
              </div>
              <div className="absolute right-6 top-6 z-10 font-display text-sm tabular-nums text-sand-50/80">
                {String(active + 1).padStart(2, '0')} / {String(pillars.length).padStart(2, '0')}
              </div>
            </div>
          </div>
        </div>

        <div className="py-24 lg:py-[22vh]">
          <p className="eyebrow text-saffron-600">{eyebrow}</p>
          <SplitWords as="h2" text={title} className="mt-4 block text-[clamp(2.4rem,5vw,4.4rem)] leading-[1.02] text-plum-800" />
          <motion.p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, ease: EASE }}>
            {text}
          </motion.p>
          <ol className="mt-16 lg:mt-24">
            {pillars.map((p, i) => (
              <PillarRow key={i} i={i} p={p} active={active === i} onActive={setActive} image={images[i % images.length]} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

function PillarRow({ i, p, active, onActive, image }: { i: number; p: Pillar; active: boolean; onActive: (i: number) => void; image?: Img }) {
  const ref = useRef<HTMLLIElement>(null)
  const inMiddle = useInView(ref, { margin: '-45% 0px -45% 0px' })
  useEffect(() => {
    if (inMiddle) onActive(i)
  }, [inMiddle, i, onActive])
  return (
    <li ref={ref} className="border-t border-plum-800/12 py-8 lg:flex lg:min-h-[38vh] lg:items-center lg:py-0">
      <div className={`flex gap-6 transition-opacity duration-700 lg:gap-10 ${active ? 'lg:opacity-100' : 'lg:opacity-30'}`}>
        <span className="font-display pt-2 text-lg italic text-saffron-600">{String(i + 1).padStart(2, '0')}</span>
        <div>
          <p className="font-display text-[clamp(2rem,4vw,3.4rem)] leading-none text-plum-800">{p.title}</p>
          {p.text && <p className="mt-3 max-w-md leading-relaxed text-ink-soft">{p.text}</p>}
          {image && (
            <div className="relative mt-6 aspect-[16/10] w-full overflow-hidden rounded-[2px] lg:hidden">
              <Image src={image.url} alt={image.alt} fill sizes="90vw" className="object-cover" />
            </div>
          )}
        </div>
      </div>
    </li>
  )
}
