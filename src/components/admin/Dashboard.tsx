import { startOfMonth } from 'date-fns'
import Link from 'next/link'
import type { Payload } from 'payload'
import type { I18nClient } from '@payloadcms/translations'

import { tr, type Bilingual } from '@/lib/admin-labels'
import { formatXPF } from '@/lib/money'
import { fmtLong } from '@/lib/time'

type Doc = Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any

type StatTone = 'bookings' | 'revenue' | 'pending' | 'messages'

const ICONS: Record<StatTone, string> = {
  // Lucide-style single-path icons, rendered inline.
  bookings:
    'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  revenue: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
  pending: 'M12 6v6l4 2M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z',
  messages: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
}

function StatIcon({ tone }: { tone: StatTone }) {
  return (
    <svg className="at-stat__icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={ICONS[tone]} />
    </svg>
  )
}

/** Modern overview shown at the top of the admin dashboard. Bilingual (FR/EN). */
export async function Dashboard({ payload, i18n }: { payload: Payload; i18n?: I18nClient }) {
  const lang = i18n?.language ?? 'fr'
  const t = (pair: Bilingual) => tr(lang, pair)

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

  const stats: { tone: StatTone; label: Bilingual; value: string; href: string }[] = [
    { tone: 'bookings', label: { fr: 'Réservations ce mois-ci', en: 'Bookings this month' }, value: String(month.totalDocs), href: '/admin/collections/bookings' },
    { tone: 'revenue', label: { fr: 'Encaissé ce mois-ci', en: 'Collected this month' }, value: formatXPF(earned), href: '/admin/collections/bookings' },
    { tone: 'pending', label: { fr: 'Paiements en attente', en: 'Pending payments' }, value: String(unpaid.totalDocs), href: '/admin/collections/bookings?where[paymentStatus][in][0]=unpaid&where[paymentStatus][in][1]=partial' },
    { tone: 'messages', label: { fr: 'Messages à traiter', en: 'Messages to handle' }, value: String(messages.totalDocs), href: '/admin/collections/messages?where[handled][equals]=false' },
  ]

  const actions: { href: string; external?: boolean; label: Bilingual }[] = [
    { href: '/admin/collections/bookings/create', label: { fr: 'Ajouter une réservation (téléphone, e-mail, sur place)', en: 'Add a booking (phone, email, on site)' } },
    { href: '/admin/collections/occurrences/create', label: { fr: 'Créer une date (atelier, formation, voyage)', en: 'Create a date (workshop, course, journey)' } },
    { href: '/admin/collections/posts/create', label: { fr: 'Écrire un article', en: 'Write an article' } },
    { href: '/admin/globals/booking-settings', label: { fr: 'Modifier mes disponibilités et congés', en: 'Edit my availability and time off' } },
    { href: 'https://app.brevo.com/marketing-campaign/list', external: true, label: { fr: 'Créer et envoyer une newsletter (Brevo)', en: 'Create and send a newsletter (Brevo)' } },
    { href: 'https://app.mobupay.nc', external: true, label: { fr: 'Espace Mobupay (paiements, virements)', en: 'Mobupay area (payments, transfers)' } },
  ]

  return (
    <section className="at-dash">
      <header className="at-dash__head">
        <h2 className="at-dash__title">{t({ fr: 'Namaste Eliane', en: 'Namaste Eliane' })}</h2>
        <p className="at-dash__subtitle">{t({ fr: 'Voici l’essentiel du moment.', en: 'Here’s what matters right now.' })}</p>
      </header>

      <div className="at-stats">
        {stats.map((s) => (
          <Link key={s.tone} href={s.href} className="at-stat">
            <span className={`at-stat__badge at-stat__badge--${s.tone}`}>
              <StatIcon tone={s.tone} />
            </span>
            <span className="at-stat__label">{t(s.label)}</span>
            <span className="at-stat__value">{s.value}</span>
          </Link>
        ))}
      </div>

      <div className="at-panels">
        <div className="at-panel">
          <div className="at-panel__head">{t({ fr: 'Prochains rendez-vous', en: 'Upcoming appointments' })}</div>
          <ul className="at-list">
            {(upcoming.docs as Doc[]).length === 0 && (
              <li className="at-list__empty">{t({ fr: 'Aucun rendez-vous à venir.', en: 'No upcoming appointments.' })}</li>
            )}
            {(upcoming.docs as Doc[]).map((b) => (
              <li key={b.id} className="at-list__item">
                <Link href={`/admin/collections/bookings/${b.id}`} className="at-list__primary">
                  {b.customerName}
                </Link>
                {b.offering?.title ? <span className="at-list__meta"> · {b.offering.title}</span> : null}
                <div className="at-list__sub">
                  {b.slotStart ? fmtLong(b.slotStart) : b.occurrence?.startsAt ? fmtLong(b.occurrence.startsAt) : ''}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="at-panel">
          <div className="at-panel__head">{t({ fr: 'Actions rapides', en: 'Quick actions' })}</div>
          <div className="at-actions">
            {actions.map((a) =>
              a.external ? (
                <a key={a.href} href={a.href} target="_blank" rel="noreferrer" className="at-action">
                  <span>{t(a.label)}</span>
                  <span className="at-action__arrow" aria-hidden="true">↗</span>
                </a>
              ) : (
                <Link key={a.href} href={a.href} className="at-action">
                  <span>{t(a.label)}</span>
                  <span className="at-action__arrow" aria-hidden="true">→</span>
                </Link>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
