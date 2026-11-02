'use client'

import { Check, Link2, Mail } from 'lucide-react'
import { useState } from 'react'

import { useT } from '@/i18n/client'

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false)
  const d = useT().blog
  const u = encodeURIComponent(url)
  const t = encodeURIComponent(title)
  const cls = 'grid h-11 w-11 place-items-center rounded-full border border-plum-800/15 text-plum-800 transition hover:bg-plum-800 hover:text-sand-50'
  return (
    <div className="flex items-center gap-3 lg:flex-col lg:items-start">
      <span className="eyebrow text-[0.62rem] text-ink-soft">{d.share}</span>
      <a className={cls} href={`https://www.facebook.com/sharer/sharer.php?u=${u}`} target="_blank" rel="noreferrer" aria-label={d.shareOn('Facebook')}>
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden><path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.5 1.6-1.5h1.7V4.4c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.2v2.3H7.4V14h2.8v8h3.3Z" /></svg>
      </a>
      <a className={cls} href={`https://wa.me/?text=${t}%20${u}`} target="_blank" rel="noreferrer" aria-label={d.shareOn('WhatsApp')}>
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm4.5 12.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2l-.5-.2Z" /></svg>
      </a>
      <a className={cls} href={`mailto:?subject=${t}&body=${u}`} aria-label={d.byEmail}><Mail size={16} /></a>
      <button
        type="button"
        className={cls}
        aria-label={d.copy}
        onClick={async () => {
          await navigator.clipboard?.writeText(url)
          setCopied(true)
          setTimeout(() => setCopied(false), 1800)
        }}
      >
        {copied ? <Check size={16} /> : <Link2 size={16} />}
      </button>
    </div>
  )
}
