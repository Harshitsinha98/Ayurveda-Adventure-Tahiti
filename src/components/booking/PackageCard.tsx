'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { EASE } from '@/components/motion/primitives'
import { useT } from '@/i18n/client'

const nf = new Intl.NumberFormat('fr-FR')

export function PackageCard({
  slug,
  title,
  summary,
  sessions,
  price,
  months,
  featured,
}: {
  slug: string
  title: string
  summary?: string | null
  sessions: number
  price: number
  months: number
  featured?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const dialog = useRef<HTMLDivElement>(null)
  const T = useT()
  const t = T.pack

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    dialog.current?.querySelector<HTMLInputElement>('input')?.focus()
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  async function buy(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    setBusy(true)
    setErr(null)
    const res = await fetch('/api/booking/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'package',
        package: slug,
        payment: 'card',
        acceptTerms: f.get('terms') === 'on',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        customer: { firstName: f.get('firstName'), lastName: f.get('lastName'), email: f.get('email'), phone: f.get('phone') || undefined },
      }),
    }).catch(() => null)
    const data = await res?.json().catch(() => null)
    if (res?.ok && data?.redirectUrl) return window.location.assign(data.redirectUrl)
    setErr(data?.error || t.error)
    setBusy(false)
  }

  const per = Math.round(price / sessions)

  return (
    <>
      <div className={`relative flex h-full flex-col rounded-[3px] p-8 transition ${featured ? 'bg-plum-800 text-sand-50' : 'border border-plum-800/12 bg-sand-50 text-ink'}`}>
        {featured && <span className="absolute -top-3 right-6 rounded-[2px] bg-saffron-500 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-plum-950">{t.mostComplete}</span>}
        <p className={`eyebrow ${featured ? 'text-saffron-300' : 'text-saffron-600'}`}>{t.validity(months)}</p>
        <h3 className={`mt-4 text-[2.4rem] leading-none ${featured ? 'text-sand-50' : 'text-plum-800'}`}>{title}</h3>
        <p className="font-display mt-6 text-5xl">{nf.format(price)} <span className="text-xl">XPF</span></p>
        <p className={`mt-1 text-sm ${featured ? 'text-sand-200/75' : 'text-ink-soft'}`}>{t.perSession(nf.format(per))}</p>
        {summary && <p className={`mt-6 flex-1 leading-relaxed ${featured ? 'text-sand-200/85' : 'text-ink-soft'}`}>{summary}</p>}
        <button type="button" onClick={() => setOpen(true)} className={`mt-8 rounded-[2px] px-6 py-3.5 text-sm font-semibold transition ${featured ? 'bg-saffron-500 text-plum-950 hover:bg-saffron-300' : 'bg-plum-800 text-sand-50 hover:bg-plum-700'}`}>
          {t.buy}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[70] grid place-items-center bg-plum-950/50 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
            <motion.div
              ref={dialog}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`pk-${slug}`}
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="w-full max-w-lg rounded-[3px] bg-sand-50 p-7 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow text-saffron-600">{t.purchase}</p>
                  <h3 id={`pk-${slug}`} className="mt-2 text-3xl text-plum-800">{title}</h3>
                  <p className="mt-1 text-sm text-ink-soft">{t.summary(nf.format(price), sessions, months)}</p>
                </div>
                <button type="button" onClick={() => setOpen(false)} aria-label={T.trip.close} className="grid h-10 w-10 place-items-center rounded-full hover:bg-sand-200"><X size={18} /></button>
              </div>
              <form onSubmit={buy} className="mt-6 grid gap-3 sm:grid-cols-2">
                <input name="firstName" required placeholder={T.bw.firstName} aria-label={T.bw.firstName} autoComplete="given-name" className="field" />
                <input name="lastName" required placeholder={T.bw.lastName} aria-label={T.bw.lastName} autoComplete="family-name" className="field" />
                <input name="email" type="email" required placeholder={T.bw.email} aria-label={T.bw.email} autoComplete="email" className="field sm:col-span-2" />
                <input name="phone" type="tel" placeholder={t.phoneOpt} aria-label={T.bw.phone} autoComplete="tel" className="field sm:col-span-2" />
                <label className="flex items-start gap-3 text-sm text-ink-soft sm:col-span-2">
                  <input type="checkbox" name="terms" required className="mt-1 accent-plum-800" />
                  <span>{T.bw.terms1} <a href="/cgv" target="_blank" className="underline">{T.bw.terms2}</a>. {t.terms}</span>
                </label>
                {err && <p role="alert" className="text-sm text-plum-700 sm:col-span-2">{err}</p>}
                <button disabled={busy} className="mt-2 inline-flex items-center justify-center gap-2 rounded-[2px] bg-plum-800 px-6 py-3.5 text-sm font-semibold text-sand-50 hover:bg-plum-700 disabled:opacity-60 sm:col-span-2">
                  {busy && <Loader2 size={16} className="animate-spin" />} {t.pay(nf.format(price))}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
