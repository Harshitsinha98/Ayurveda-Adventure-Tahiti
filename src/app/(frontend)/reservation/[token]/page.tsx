import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { StatusWatcher } from '@/components/booking/StatusWatcher'
import { formatXPF } from '@/lib/money'
import { payloadClient } from '@/lib/payload'
import { fmtLong } from '@/lib/time'
import type { Occurrence, Offering } from '@/payload-types'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Ma réservation', robots: { index: false, follow: false } }

const STATUS: Record<string, { title: string; text: string }> = {
  pending: { title: 'Paiement en cours de confirmation…', text: 'Merci ! Nous attendons la confirmation de la banque. Cette page se met à jour automatiquement.' },
  confirmed: { title: 'Votre réservation est confirmée.', text: 'Un e-mail de confirmation vient de vous être envoyé. Je me réjouis de vous accompagner.' },
  completed: { title: 'Merci pour votre venue.', text: 'Au plaisir de vous retrouver.' },
  cancelled: { title: 'Cette réservation est annulée.', text: 'Si un remboursement est prévu, il apparaît sur votre carte sous quelques jours.' },
  expired: { title: 'Le paiement n’a pas abouti.', text: 'Aucun montant n’a été débité. Vous pouvez réserver à nouveau.' },
}

/** Customer view of a booking, reached through the private link sent by e-mail. */
export default async function BookingStatusPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  if (!/^[a-f0-9]{32}$/.test(token)) notFound()
  const payload = await payloadClient()
  const r = await payload.find({ collection: 'bookings', where: { accessToken: { equals: token } }, limit: 1, depth: 1, overrideAccess: true })
  const b = r.docs[0]
  if (!b) notFound()
  const o = b.offering as Offering
  const occ = b.occurrence as Occurrence | null
  const when = b.slotStart || occ?.startsAt
  const s = STATUS[b.status] ?? STATUS.pending
  const online = o.mode === 'en-ligne' || o.mode === 'hybride'

  return (
    <section className="pb-28 pt-[140px] lg:pt-[170px]">
      <div className="container-x max-w-3xl">
        <StatusWatcher token={token} status={b.status} />
        <p className="eyebrow text-saffron-600">Réservation {b.code}</p>
        <h1 className="mt-5 text-[clamp(2.6rem,6vw,4.4rem)] leading-[1] text-plum-800">{s.title}</h1>
        <p className="mt-5 text-lg text-ink-soft">{s.text}</p>

        <dl className="mt-12 divide-y divide-plum-800/10 rounded-[28px] bg-sand-50 px-7">
          <Row k="Offre" v={o.title} />
          {when && <Row k="Date (heure de Tahiti)" v={fmtLong(when)} />}
          {when && b.timezone && b.timezone !== 'Pacific/Tahiti' && <Row k="Chez vous" v={fmtLong(when, b.timezone)} />}
          {(b.quantity ?? 1) > 1 && <Row k="Participants" v={String(b.quantity)} />}
          <Row k="Montant" v={formatXPF(b.amountTotal)} />
          <Row k="Payé" v={formatXPF(b.amountPaid ?? 0)} />
          {(b.balance ?? 0) > 0 && b.status === 'confirmed' && (
            <Row k="Reste à régler" v={`${formatXPF(b.balance)}${b.balanceDueDate ? ` avant le ${new Date(b.balanceDueDate).toLocaleDateString('fr-FR')}` : ''}`} />
          )}
          {b.status === 'confirmed' && online && o.meetingUrl && <Row k="Lien de la séance" v={<a className="underline" href={o.meetingUrl}>{o.meetingUrl}</a>} />}
          {b.status === 'confirmed' && !online && o.location && <Row k="Lieu" v={o.location} />}
        </dl>

        <div className="mt-10 flex flex-wrap gap-4">
          {b.status === 'expired' && (
            <Link href={o.kind === 'voyage' ? `/voyage-en-inde/${o.slug}` : `/offres/${o.slug}`} className="rounded-full bg-plum-800 px-7 py-3.5 font-semibold text-sand-50 hover:bg-plum-700">Réserver à nouveau</Link>
          )}
          <Link href="/contact" className="rounded-full border border-plum-800/20 px-7 py-3.5 font-semibold text-plum-800">Modifier ou annuler : écrire à Eliane</Link>
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
