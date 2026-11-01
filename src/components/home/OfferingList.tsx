'use client'

import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import { EASE } from '@/components/motion/primitives'
import type { Img } from '@/lib/payload'

export type OfferingRow = {
  slug: string
  title: string
  kicker?: string | null
  price?: string | null
  meta?: string | null
  image?: Img | null
}

/** Editorial list; on desktop, the photo follows the cursor over the hovered row. */
export function OfferingList({ items }: { items: OfferingRow[] }) {
  const [active, setActive] = useState<number | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 160, damping: 22, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 160, damping: 22, mass: 0.6 })

  return (
    <div
      className="relative"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        x.set(e.clientX - r.left)
        y.set(e.clientY - r.top)
      }}
      onPointerLeave={() => setActive(null)}
    >
      <ul className="border-t border-plum-800/12">
        {items.map((o, i) => (
          <motion.li
            key={o.slug}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8%' }}
            transition={{ duration: 0.8, delay: i * 0.06, ease: EASE }}
            className="border-b border-plum-800/12"
            onPointerEnter={() => setActive(i)}
          >
            <Link href={`/offres/${o.slug}`} className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 py-7 md:grid-cols-[3.5rem_1.4fr_1fr_auto] md:gap-8 md:py-9">
              <span className="font-display hidden text-lg italic text-saffron-600 md:block">{String(i + 1).padStart(2, '0')}</span>
              {o.image && (
                <span className="relative h-16 w-16 overflow-hidden rounded-2xl md:hidden">
                  <Image src={o.image.url} alt="" fill sizes="64px" className="object-cover" />
                </span>
              )}
              <span>
                <span className="font-display block text-[clamp(1.6rem,3vw,2.6rem)] leading-tight text-plum-800 transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-3">
                  {o.title}
                </span>
                {o.kicker && <span className="mt-1 block text-sm text-ink-soft md:hidden">{o.kicker}</span>}
              </span>
              <span className="hidden text-sm leading-relaxed text-ink-soft md:block">
                {o.kicker}
                {o.meta && <span className="block text-xs uppercase tracking-[0.18em] text-sage-700">{o.meta}</span>}
              </span>
              <span className="flex items-center gap-4">
                {o.price && <span className="hidden whitespace-nowrap text-sm font-semibold text-plum-800 sm:block">{o.price}</span>}
                <span className="grid h-11 w-11 place-items-center rounded-full border border-plum-800/20 text-plum-800 transition-all duration-500 group-hover:rotate-45 group-hover:border-plum-800 group-hover:bg-plum-800 group-hover:text-sand-50">
                  <ArrowUpRight size={18} />
                </span>
              </span>
            </Link>
          </motion.li>
        ))}
      </ul>

      <motion.div aria-hidden style={{ x: sx, y: sy }} className="pointer-events-none absolute left-0 top-0 z-10 hidden md:block">
        <AnimatePresence>
          {active !== null && items[active]?.image && (
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.7, rotate: -6 }}
              animate={{ opacity: 1, scale: 1, rotate: -3 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="relative -translate-x-1/2 -translate-y-[60%] overflow-hidden rounded-[22px] shadow-[0_30px_60px_-25px_rgba(42,11,28,0.55)]"
              style={{ width: 260, height: 330 }}
            >
              <Image src={items[active]!.image!.url} alt="" fill sizes="260px" className="object-cover" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
