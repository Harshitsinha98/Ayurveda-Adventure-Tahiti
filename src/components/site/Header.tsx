'use client'

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { EASE } from '@/components/motion/primitives'
import { NAV } from '@/lib/nav'


export function Header() {
  const pathname = usePathname()
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 24)
    setHidden(y > 480 && y > prev && !open)
  })

  const onDark = !scrolled && !open && pathname.startsWith('/voyage-en-inde')

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <>
      <motion.header
        animate={{ y: hidden ? '-110%' : '0%' }}
        transition={{ duration: 0.5, ease: EASE }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={`transition-[background,box-shadow,backdrop-filter] duration-500 ${
            scrolled || open ? 'bg-sand-50/80 shadow-[0_1px_0_rgba(89,23,60,0.08)] backdrop-blur-xl' : 'bg-transparent'
          }`}
        >
          <div className="container-x flex h-[76px] items-center justify-between gap-6">
            <Link href="/" className="group flex items-center gap-3" aria-label="Ayurveda Tahiti, accueil">
              <Image src="/images/brand/emblem.png" alt="" width={44} height={44} priority className="rounded-full" />
              <span className={`font-display text-[1.45rem] leading-none transition-colors ${onDark ? 'text-sand-50' : 'text-plum-800'}`}>
                Ayurveda <em className="text-saffron-600">Tahiti</em>
              </span>
            </Link>

            <nav aria-label="Navigation principale" className="hidden items-center gap-1 lg:flex">
              {NAV.map((n) => {
                const active = pathname === n.href || pathname.startsWith(`${n.href}/`)
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    aria-current={active ? 'page' : undefined}
                    className={`relative px-4 py-2 text-[0.92rem] transition-colors ${onDark ? 'text-sand-100 hover:text-saffron-300' : 'text-ink-soft hover:text-plum-800'}`}
                  >
                    {active && (
                      <motion.span layoutId="nav-line" className={`absolute inset-x-4 -bottom-0.5 h-px ${onDark ? 'bg-saffron-300' : 'bg-plum-800'}`} transition={{ duration: 0.5, ease: EASE }} />
                    )}
                    {n.label}
                  </Link>
                )
              })}
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/offres"
                className={`hidden rounded-[2px] px-5 py-2.5 text-sm font-semibold transition sm:inline-flex ${onDark ? 'bg-saffron-500 text-plum-950 hover:bg-saffron-300' : 'bg-plum-800 text-sand-50 hover:bg-plum-700'}`}
              >
                Réserver
              </Link>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="menu-mobile"
                aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
                className={`relative grid h-11 w-11 place-items-center rounded-full border lg:hidden ${onDark ? 'border-sand-50/30 [&>span]:bg-sand-50' : 'border-plum-800/15'}`}
              >
                <span className={`absolute h-px w-5 bg-plum-800 transition-transform duration-500 ${open ? 'rotate-45' : '-translate-y-[4px]'}`} />
                <span className={`absolute h-px w-5 bg-plum-800 transition-transform duration-500 ${open ? '-rotate-45' : 'translate-y-[4px]'}`} />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-mobile"
            className="fixed inset-0 z-40 flex flex-col bg-plum-900 pt-[96px] text-sand-50 lg:hidden"
            initial={{ clipPath: 'circle(0% at 92% 38px)' }}
            animate={{ clipPath: 'circle(150% at 92% 38px)' }}
            exit={{ clipPath: 'circle(0% at 92% 38px)' }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <nav aria-label="Menu" className="container-x flex flex-1 flex-col justify-center gap-2">
              {[{ href: '/', label: 'Accueil' }, ...NAV].map((n, i) => (
                <motion.div key={n.href} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }}>
                  <Link href={n.href} className="font-display block py-1 text-[2.6rem] leading-tight hover:text-saffron-300">
                    {n.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="container-x pb-10 text-sm text-sand-200/80">Punaauia · Tahiti · en ligne partout dans le monde</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
