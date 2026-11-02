import Link from 'next/link'

import { getT } from '@/i18n/server'

export default async function NotFound() {
  const { t } = await getT()
  return (
    <section className="grid min-h-[80svh] place-items-center pt-[100px] text-center">
      <div className="container-x max-w-2xl">
        <p className="font-display text-[8rem] leading-none text-saffron-500/60">404</p>
        <h1 className="mt-2 text-[clamp(2.2rem,5vw,3.6rem)] text-plum-800">{t.misc.notFoundTitle} <em className="text-saffron-600">{t.misc.notFoundAccent}</em></h1>
        <p className="mt-4 text-ink-soft">{t.misc.notFoundText}</p>
        <div className="mt-10 flex justify-center gap-4">
          <Link href="/" className="rounded-[2px] bg-plum-800 px-7 py-3.5 font-semibold text-sand-50">{t.nav.home}</Link>
          <Link href="/offres" className="rounded-[2px] border border-plum-800/20 px-7 py-3.5 font-semibold text-plum-800">{t.misc.offers}</Link>
        </div>
      </div>
    </section>
  )
}
