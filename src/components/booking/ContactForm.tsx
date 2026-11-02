'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, Send } from 'lucide-react'
import { useState } from 'react'

import { useT } from '@/i18n/client'

export function ContactForm({ offering, subject }: { offering?: string; subject?: string }) {
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [err, setErr] = useState('')
  const t = useT().cf

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>
    setState('sending')
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...f, offering, phone: f.phone || undefined, subject: f.subject || subject || undefined }),
    }).catch(() => null)
    if (res?.ok) setState('done')
    else {
      setErr((await res?.json().catch(() => null))?.error || t.error)
      setState('error')
    }
  }

  return (
    <AnimatePresence mode="wait">
      {state === 'done' ? (
        <motion.div key="ok" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-[3px] bg-sage-200/60 p-8" role="status">
          <p className="font-display text-3xl text-plum-800">{t.done}</p>
          <p className="mt-2 text-ink-soft">{t.doneText}</p>
        </motion.div>
      ) : (
        <motion.form key="f" onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2" exit={{ opacity: 0 }}>
          <div>
            <label className="label" htmlFor="cf-name">{t.name} *</label>
            <input id="cf-name" name="name" required minLength={2} autoComplete="name" className="field" />
          </div>
          <div>
            <label className="label" htmlFor="cf-email">{t.email} *</label>
            <input id="cf-email" name="email" type="email" required autoComplete="email" className="field" />
          </div>
          <div>
            <label className="label" htmlFor="cf-phone">{t.phone}</label>
            <input id="cf-phone" name="phone" type="tel" autoComplete="tel" className="field" />
          </div>
          <div>
            <label className="label" htmlFor="cf-subject">{t.subject}</label>
            <input id="cf-subject" name="subject" defaultValue={subject} className="field" />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="cf-msg">{t.message} *</label>
            <textarea id="cf-msg" name="message" required minLength={5} rows={5} className="field" />
          </div>
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
          <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
            <button disabled={state === 'sending'} className="inline-flex items-center gap-2 rounded-[2px] bg-plum-800 px-7 py-3.5 text-sm font-semibold text-sand-50 transition hover:bg-plum-700 disabled:opacity-60">
              {state === 'sending' ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              {t.send}
            </button>
            <p className="text-xs text-ink-soft">{t.note}</p>
          </div>
          {state === 'error' && <p role="alert" className="text-sm text-plum-700 sm:col-span-2">{err}</p>}
        </motion.form>
      )}
    </AnimatePresence>
  )
}
