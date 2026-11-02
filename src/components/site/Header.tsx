'use client'

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { ArrowUpRight, CalendarCheck, Mail, UserRound } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { EASE } from '@/components/motion/primitives'
import { LangToggle, useT } from '@/i18n/client'
import { NAV } from '@/lib/nav'


export function Header({ email, whatsapp }: { email?: string | null; whatsapp?: string | null }) {
  const pathname = usePathname()
  const t = useT()
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 24)
    setHidden(y > 480 && y > prev && !open)
  })

  const onDark = open || (!scrolled && pathname.startsWith('/voyage-en-inde'))

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
            open ? 'bg-plum-900' : scrolled ? 'bg-sand-50/80 shadow-[0_1px_0_rgba(89,23,60,0.08)] backdrop-blur-xl' : 'bg-transparent'
          }`}
        >
          <div className="container-x flex h-[76px] items-center justify-between gap-6">
            <Link href="/" className="group flex min-w-0 items-center gap-2.5 sm:gap-3" aria-label={t.header.home}>
              <Image src="/images/brand/emblem.png" alt="" width={44} height={44} priority className="h-10 w-10 shrink-0 rounded-full sm:h-11 sm:w-11" />
              <span className={`font-display whitespace-nowrap text-[1.2rem] leading-none transition-colors sm:text-[1.45rem] ${onDark ? 'text-sand-50' : 'text-plum-800'}`}>
                Ayurveda <em className="text-saffron-600">Tahiti</em>
              </span>
            </Link>

            <nav aria-label={t.header.mainNav} className="hidden items-center gap-1 lg:flex">
              {NAV.map((n) => {
                const active = pathname === n.href || pathname.startsWith(`${n.href}/`)
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    aria-current={active ? 'page' : undefined}
                    className={`group relative px-4 py-2 text-[0.92rem] transition-colors ${onDark ? 'text-sand-100 hover:text-saffron-300' : 'text-ink-soft hover:text-plum-800'}`}
                  >
                    {active && (
                      <motion.span layoutId="nav-line" className={`absolute inset-x-4 -bottom-0.5 h-px ${onDark ? 'bg-saffron-300' : 'bg-plum-800'}`} transition={{ duration: 0.5, ease: EASE }} />
                    )}
                    <span className="roll">
                      <span>{t.nav[n.key]}</span>
                      <span aria-hidden>{t.nav[n.key]}</span>
                    </span>
                  </Link>
                )
              })}
            </nav>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <LangToggle tone={onDark ? 'dark' : 'light'} />
              <Link
                href="/compte"
                aria-label={t.account.menu}
                title={t.account.menu}
                className={`hidden h-10 w-10 place-items-center rounded-[2px] border transition-colors sm:grid ${onDark ? 'border-sand-50/30 text-sand-50 hover:border-sand-50/60' : 'border-plum-800/20 text-plum-800 hover:border-plum-800/40'}`}
              >
                <UserRound size={18} strokeWidth={1.7} />
              </Link>
              <Link
                href="/offres"
                className={`btn-fill hidden rounded-[2px] px-5 py-2.5 text-sm font-semibold sm:inline-flex ${onDark ? 'btn-fill-light bg-saffron-500 text-plum-950' : 'bg-plum-800 text-sand-50'}`}
              >
                <span className="relative z-10">{t.header.book}</span>
              </Link>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="menu-mobile"
                aria-label={open ? t.header.closeMenu : t.header.openMenu}
                className={`relative grid h-10 w-10 place-items-center rounded-[2px] border lg:hidden ${onDark ? 'border-sand-50/30 [&>span]:bg-sand-50' : 'border-plum-800/15'}`}
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
            className="fixed inset-0 z-[45] flex flex-col bg-plum-900 pt-[84px] text-sand-50 lg:hidden"
            initial={{ clipPath: 'circle(0% at 92% 38px)' }}
            animate={{ clipPath: 'circle(150% at 92% 38px)' }}
            exit={{ clipPath: 'circle(0% at 92% 38px)' }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <nav aria-label={t.header.menu} className="container-x flex flex-1 flex-col justify-center gap-1 overflow-y-auto py-4">
              {[{ href: '/', key: 'home' as const }, ...NAV].map((n, i) => (
                <div key={n.href} className="overflow-hidden">
                  <motion.div initial={{ y: '110%' }} animate={{ y: '0%' }} transition={{ duration: 0.8, delay: 0.2 + i * 0.06, ease: EASE }}>
                    <Link href={n.href} className="font-display flex items-baseline gap-4 py-1 text-[clamp(1.9rem,8.4vw,3rem)] leading-[1.15] hover:text-saffron-300">
                      <span className="text-sm italic text-saffron-300/70">{String(i + 1).padStart(2, '0')}</span>
                      {t.nav[n.key]}
                    </Link>
                  </motion.div>
                </div>
              ))}
              <div className="overflow-hidden">
                <motion.div initial={{ y: '110%' }} animate={{ y: '0%' }} transition={{ duration: 0.8, delay: 0.2 + (NAV.length + 1) * 0.06, ease: EASE }}>
                  <Link href="/compte" className="font-display flex items-center gap-4 py-1 text-[clamp(1.9rem,8.4vw,3rem)] leading-[1.15] hover:text-saffron-300">
                    <UserRound size={22} strokeWidth={1.6} className="text-saffron-300/80" />
                    {t.account.menu}
                  </Link>
                </motion.div>
              </div>
            </nav>
            <div className="container-x pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              <p className="eyebrow mb-3 text-[0.6rem] text-sand-200/60">{t.header.quick}</p>
              <ul className="grid grid-cols-3 gap-2.5">
                {[
                  email && { href: `mailto:${email}`, label: t.header.tileEmail, icon: <Mail size={20} strokeWidth={1.6} />, tone: 'bg-sand-50/[0.07] text-sand-50 border border-sand-50/15' },
                  whatsapp && {
                    href: `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(t.wa.text)}`,
                    label: t.header.tileWhatsapp,
                    icon: <WhatsAppIcon />,
                    tone: 'bg-[#25d366] text-plum-950',
                    external: true,
                  },
                  { href: '/offres', label: t.header.tileBook, icon: <CalendarCheck size={20} strokeWidth={1.6} />, tone: 'bg-saffron-500 text-plum-950' },
                ]
                  .filter(Boolean)
                  .map((c, i) => {
                    const tile = c as { href: string; label: string; icon: React.ReactNode; tone: string; external?: boolean }
                    return (
                      <motion.li
                        key={tile.href}
                        initial={{ opacity: 0, y: 40, scale: 0.9 }}
                        animate={{ opacity: 1, y: [0, -5, 0], scale: 1 }}
                        transition={{
                          opacity: { duration: 0.5, delay: 0.45 + i * 0.08 },
                          scale: { duration: 0.6, delay: 0.45 + i * 0.08, ease: EASE },
                          y: { duration: 3.2, delay: 1 + i * 0.4, repeat: Infinity, ease: 'easeInOut' },
                        }}
                      >
                        <a
                          href={tile.href}
                          {...(tile.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                          className={`flex h-full min-h-[104px] flex-col justify-between rounded-[3px] p-3.5 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.6)] transition-transform active:scale-95 ${tile.tone}`}
                        >
                          <span className="flex items-start justify-between">
                            {tile.icon}
                            <ArrowUpRight size={14} className="opacity-60" />
                          </span>
                          <span className="text-[0.8rem] font-semibold leading-tight">{tile.label}</span>
                        </a>
                      </motion.li>
                    )
                  })}
              </ul>
              <p className="mt-4 text-xs text-sand-200/60">{t.header.menuFoot}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm4.5 12.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2l-.5-.2Z" />
    </svg>
  )
}
