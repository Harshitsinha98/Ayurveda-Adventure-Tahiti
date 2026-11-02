import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { StatusWatcher } from '@/components/booking/StatusWatcher'
import { formatXPF } from '@/lib/money'
import { payloadClient } from '@/lib/payload'
import { dateLocale } from '@/i18n/dictionary'
import { getT } from '@/i18n/server'
import { localeOpts } from '@/lib/queries'
import { fmtLong } from '@/lib/time'
import type { Occurrence, Offering } from '@/payload-types'

export const dynamic = 'force-dynamic'
export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT()
  return { title: t.booking.title, robots: { index: false, follow: false } }
}

/** Customer view of a booking, reached through the private link sent by e-mail. */
export default async function BookingStatusPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  if (!/^[a-f0-9]{32}$/.test(token)) notFound()
  const { lang, t } = await getT()
  const dl = dateLocale(lang)
  const payload = await payloadClient()
  const r = await payload.find({ collection: 'bookings', where: { accessToken: { equals: token } }, limit: 1, depth: 1, overrideAccess: true, ...localeOpts(lang) })
  const b = r.docs[0]
  if (!b) notFound()
  const o = b.offering as Offering
  const occ = b.occurrence as Occurrence | null
  const when = b.slotStart || occ?.startsAt
  const [title, text] = t.booking.status[b.status] ?? t.booking.status.pending
  const s = { title, text }
  const online = o.mode === 'en-ligne' || o.mode === 'hybride'

  return (
    <section className="pb-28 pt-[140px] lg:pt-[170px]">
      <div className="container-x max-w-3xl">
        <StatusWatcher token={token} status={b.status} />
        <p className="eyebrow text-saffron-600">{t.booking.ref} {b.code}</p>
        <h1 className="mt-5 text-[clamp(2.6rem,6vw,4.4rem)] leading-[1] text-plum-800">{s.title}</h1>
        <p className="mt-5 text-lg text-ink-soft">{s.text}</p>

        <dl className="mt-12 divide-y divide-plum-800/10 rounded-[3px] bg-sand-50 px-7">
          <Row k={t.booking.offer} v={o.title} />
          {when && <Row k={t.booking.date} v={fmtLong(when, undefined, dl)} />}
          {when && b.timezone && b.timezone !== 'Pacific/Tahiti' && <Row k={t.booking.atHome} v={fmtLong(when, b.timezone, dl)} />}
          {(b.quantity ?? 1) > 1 && <Row k={t.booking.participants} v={String(b.quantity)} />}
          <Row k={t.booking.amount} v={formatXPF(b.amountTotal)} />
          <Row k={t.booking.paid} v={formatXPF(b.amountPaid ?? 0)} />
          {(b.balance ?? 0) > 0 && b.status === 'confirmed' && (
            <Row k={t.booking.balance} v={`${formatXPF(b.balance)}${b.balanceDueDate ? ` ${t.booking.before} ${new Date(b.balanceDueDate).toLocaleDateString(dl)}` : ''}`} />
          )}
          {b.status === 'confirmed' && online && o.meetingUrl && <Row k={t.booking.link} v={<a className="underline" href={o.meetingUrl}>{o.meetingUrl}</a>} />}
          {b.status === 'confirmed' && !online && o.location && <Row k={t.booking.place} v={o.location} />}
        </dl>

        <div className="mt-10 flex flex-wrap gap-4">
          {b.status === 'expired' && (
            <Link href={o.kind === 'voyage' ? `/voyage-en-inde/${o.slug}` : `/offres/${o.slug}`} className="rounded-[2px] bg-plum-800 px-7 py-3.5 font-semibold text-sand-50 hover:bg-plum-700">{t.booking.again}</Link>
          )}
          <Link href="/contact" className="rounded-[2px] border border-plum-800/20 px-7 py-3.5 font-semibold text-plum-800">{t.booking.change}</Link>
        </div>
        {o.cancellationPolicy && <p className="mt-6 text-sm text-ink-soft">{o.cancellationPolicy}</p>}
      </div>
    </section>
  )
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="grid gap-1 py-4 sm:grid-cols-[0.45fr_0.55fr]">
      <dt className="text-sm text-ink-soft">{k}</dt>
      <dd className="font-semibold text-plum-800">{v}</dd>
    </div>
  )
}
