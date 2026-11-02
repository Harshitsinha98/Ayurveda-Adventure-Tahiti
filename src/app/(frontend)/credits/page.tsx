import type { Metadata } from 'next'
import Image from 'next/image'

import { getT } from '@/i18n/server'
import { photo } from '@/lib/photos'

import credits from '../../../../seed/commons-credits.json'

export const dynamic = 'force-dynamic'

const licenseUrl = (l: string) => {
  const m = l.match(/^CC (BY(?:-SA)?) ([\d.]+)$/)
  return m ? `https://creativecommons.org/licenses/${m[1].toLowerCase()}/${m[2]}/` : null
}

type Credit = { altFr: string; altEn: string; author: string; license: string; source: string; title: string }

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT()
  return { title: t.misc.creditsTitle, alternates: { canonical: '/credits' } }
}

export default async function CreditsPage() {
  const { lang, t } = await getT()
  const items = Object.entries(credits as Record<string, Credit>)
  return (
    <section className="pb-28 pt-[140px] lg:pt-[170px]">
      <div className="container-x max-w-4xl">
        <h1 className="text-[clamp(2.6rem,6vw,4.4rem)] text-plum-800">{t.misc.creditsTitle}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">{t.misc.creditsIntro}</p>
        <ul className="mt-12 divide-y divide-plum-800/10 border-y border-plum-800/10">
          {items.map(([name, c]) => {
            const p = photo(name)
            return (
              <li key={name} className="grid grid-cols-[5rem_1fr] items-center gap-5 py-5 sm:grid-cols-[6rem_1fr]">
                <div className="relative aspect-square overflow-hidden rounded-[2px] bg-sand-200">
                  {p && <Image src={p.url} alt="" fill sizes="96px" className="object-cover" />}
                </div>
                <div className="min-w-0 text-sm">
                  <p className="font-display text-xl text-plum-800">{lang === 'en' ? c.altEn : c.altFr}</p>
                  <p className="mt-1 text-ink-soft">
                    {c.author} ·{' '}
                    {licenseUrl(c.license) ? (
                      <a href={licenseUrl(c.license)!} target="_blank" rel="noreferrer" className="underline underline-offset-4">{c.license}</a>
                    ) : (
                      c.license
                    )}{' '}
                    ·{' '}
                    <a href={c.source} target="_blank" rel="noreferrer" className="break-all underline decoration-saffron-500 underline-offset-4">
                      Wikimedia Commons
                    </a>
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
