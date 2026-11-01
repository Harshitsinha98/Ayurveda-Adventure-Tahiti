import { startOfMonth } from 'date-fns'
import Link from 'next/link'
import type { Payload } from 'payload'

import { formatXPF } from '@/lib/money'
import { fmtLong } from '@/lib/time'

type Doc = Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any

const card: React.CSSProperties = {
  background: 'var(--theme-elevation-50)',
  border: '1px solid var(--theme-elevation-100)',
  borderRadius: 14,
  padding: '18px 20px',
}

/** Overview shown at the top of the admin dashboard. */
export async function Dashboard({ payload }: { payload: Payload }) {
  const now = new Date()
  const monthStart = startOfMonth(now).toISOString()
  const [month, upcoming, unpaid, messages] = await Promise.all([
    payload.find({
      collection: 'bookings',
      where: { and: [{ createdAt: { greater_than_equal: monthStart } }, { status: { in: ['confirmed', 'completed'] } }] },
      limit: 500,
      depth: 0,
      select: { amountPaid: true, amountTotal: true },
    }),
    payload.find({
      collection: 'bookings',
      where: {
        and: [
          { status: { equals: 'confirmed' } },
          { or: [{ slotStart: { greater_than: now.toISOString() } }, { occurrence: { exists: true } }] },
        ],
      },
      sort: 'slotStart',
      limit: 8,
      depth: 1,
    }),
    payload.count({ collection: 'bookings', where: { and: [{ status: { equals: 'confirmed' } }, { paymentStatus: { in: ['unpaid', 'partial'] } }] } }),
    payload.count({ collection: 'messages', where: { handled: { equals: false } } }),
  ])
  const earned = (month.docs as Doc[]).reduce((s, b) => s + (b.amountPaid || 0), 0)

  const stats = [
    { label: 'Réservations ce mois-ci', value: String(month.totalDocs), href: '/admin/collections/bookings' },
    { label: 'Encaissé ce mois-ci', value: formatXPF(earned), href: '/admin/collections/bookings' },
    { label: 'Paiements en attente', value: String(unpaid.totalDocs), href: '/admin/collections/bookings?where[paymentStatus][in][0]=unpaid&where[paymentStatus][in][1]=partial' },
    { label: 'Messages à traiter', value: String(messages.totalDocs), href: '/admin/collections/messages?where[handled][equals]=false' },
  ]

  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, margin: '0 0 6px' }}>Namaste Eliane</h2>
      <p style={{ opacity: 0.7, margin: '0 0 20px' }}>Voici l’essentiel du moment.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14, marginBottom: 18 }}>
        {stats.map((s) => (
          <Link key={s.label} href={s.href} style={{ ...card, textDecoration: 'none', color: 'inherit' }}>
            <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '.12em', opacity: 0.6 }}>{s.label}</div>
            <div style={{ fontSize: 26, marginTop: 6, fontFamily: 'Georgia, serif' }}>{s.value}</div>
          </Link>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 14 }}>
        <div style={card}>
          <strong>Prochains rendez-vous</strong>
          <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0 0' }}>
            {(upcoming.docs as Doc[]).length === 0 && <li style={{ opacity: 0.6 }}>Aucun rendez-vous à venir.</li>}
            {(upcoming.docs as Doc[]).map((b) => (
              <li key={b.id} style={{ padding: '8px 0', borderTop: '1px solid var(--theme-elevation-100)' }}>
                <Link href={`/admin/collections/bookings/${b.id}`}>{b.customerName}</Link> · {b.offering?.title}
                <div style={{ fontSize: 12, opacity: 0.65 }}>
                  {b.slotStart ? fmtLong(b.slotStart) : b.occurrence?.startsAt ? fmtLong(b.occurrence.startsAt) : ''}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div style={card}>
          <strong>Actions rapides</strong>
          <ul style={{ padding: '0 0 0 18px', margin: '10px 0 0', lineHeight: 2 }}>
            <li><Link href="/admin/collections/bookings/create">Ajouter une réservation (téléphone, e-mail, sur place)</Link></li>
            <li><Link href="/admin/collections/occurrences/create">Créer une date (atelier, formation, voyage)</Link></li>
            <li><Link href="/admin/collections/posts/create">Écrire un article</Link></li>
            <li><Link href="/admin/globals/booking-settings">Modifier mes disponibilités et congés</Link></li>
            <li><a href="https://app.brevo.com/marketing-campaign/list" target="_blank" rel="noreferrer">Créer et envoyer une newsletter (Brevo)</a></li>
            <li><a href="https://app.mobupay.nc" target="_blank" rel="noreferrer">Espace Mobupay (paiements, virements)</a></li>
          </ul>
        </div>
      </div>
    </section>
  )
}
