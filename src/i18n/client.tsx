'use client'

import { useRouter } from 'next/navigation'
import { createContext, useContext, useTransition } from 'react'

import { dictionaries, LANG_COOKIE, type Lang } from './dictionary'

const Ctx = createContext<Lang>('fr')

export function LangProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return <Ctx.Provider value={lang}>{children}</Ctx.Provider>
}

export const useLang = () => useContext(Ctx)
export const useT = () => dictionaries[useContext(Ctx)]

/** FR | EN switch. Stores the choice in a cookie and re-renders the current page in that language. */
export function LangToggle({ tone = 'light', className = '' }: { tone?: 'light' | 'dark'; className?: string }) {
  const lang = useLang()
  const router = useRouter()
  const [pending, start] = useTransition()
  const t = dictionaries[lang]
  const set = (l: Lang) => {
    if (l === lang) return
    document.cookie = `${LANG_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`
    document.documentElement.lang = l
    start(() => router.refresh())
  }
  const dark = tone === 'dark'
  return (
    <div
      role="group"
      aria-label={t.header.lang}
      className={`relative flex h-10 items-center rounded-[2px] border p-0.5 text-[0.72rem] font-semibold tracking-[0.12em] transition-opacity ${
        dark ? 'border-sand-50/30' : 'border-plum-800/20'
      } ${pending ? 'opacity-60' : ''} ${className}`}
    >
      {(['fr', 'en'] as const).map((l) => {
        const on = l === lang
        return (
          <button
            key={l}
            type="button"
            lang={l}
            aria-pressed={on}
            aria-label={l === 'fr' ? 'Français' : 'English'}
            onClick={() => set(l)}
            className={`h-full min-w-[2.6rem] rounded-[1px] px-2.5 uppercase transition-colors ${
              on
                ? dark
                  ? 'bg-sand-50 text-plum-900'
                  : 'bg-plum-800 text-sand-50'
                : dark
                  ? 'text-sand-50/80 hover:text-sand-50'
                  : 'text-plum-800/70 hover:text-plum-800'
            }`}
          >
            {l}
          </button>
        )
      })}
    </div>
  )
}
