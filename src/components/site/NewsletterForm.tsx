'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

import { useT } from '@/i18n/client'

export function NewsletterForm({ tone = 'dark', source = 'footer' }: { tone?: 'dark' | 'light'; source?: string }) {
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')
  const dark = tone === 'dark'
  const t = useT().nl

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    setState('loading')
    const res = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: f.get('email'), firstName: f.get('firstName') || undefined, consent: f.get('consent') === 'on', source }),
    }).catch(() => null)
    if (res?.ok) setState('done')
    else {
      setError((await res?.json().catch(() => null))?.error || t.error)
      setState('error')
    }
  }

  return (
    <AnimatePresence mode="wait">
      {state === 'done' ? (
        <motion.p key="ok" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`font-display text-2xl ${dark ? 'text-saffron-300' : 'text-plum-800'}`} role="status">
          {t.done}
        </motion.p>
      ) : (
        <motion.form key="form" onSubmit={onSubmit} exit={{ opacity: 0 }} className="space-y-3" noValidate>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor={`nl-name-${source}`}>{t.firstName}</label>
            <input id={`nl-name-${source}`} name="firstName" autoComplete="given-name" placeholder={t.firstName} className={`h-12 rounded-[2px] px-5 text-base sm:w-40 ${dark ? 'border border-sand-50/20 bg-sand-50/5 text-sand-50 placeholder:text-sand-200/60' : 'field'}`} />
            <label className="sr-only" htmlFor={`nl-email-${source}`}>{t.email}</label>
            <input id={`nl-email-${source}`} name="email" type="email" required autoComplete="email" placeholder={t.email} className={`h-12 flex-1 rounded-[2px] px-5 text-base ${dark ? 'border border-sand-50/20 bg-sand-50/5 text-sand-50 placeholder:text-sand-200/60' : 'field'}`} />
            <button disabled={state === 'loading'} className={`h-12 rounded-[2px] px-6 text-sm font-semibold transition ${dark ? 'bg-saffron-500 text-plum-950 hover:bg-saffron-300' : 'bg-plum-800 text-sand-50 hover:bg-plum-700'} disabled:opacity-60`}>
              {state === 'loading' ? t.sending : t.submit}
            </button>
          </div>
          <label className={`flex items-start gap-2 text-xs leading-relaxed ${dark ? 'text-sand-200/70' : 'text-ink-soft'}`}>
            <input type="checkbox" name="consent" required className="mt-0.5 accent-saffron-500" />
            <span>{t.consent} <a className="underline" href="/confidentialite">{t.privacy}</a></span>
          </label>
          {state === 'error' && <p role="alert" className="text-sm text-saffron-300">{error}</p>}
        </motion.form>
      )}
    </AnimatePresence>
  )
}
