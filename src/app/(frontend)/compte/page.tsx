import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { LogoutButton } from '@/components/account/LogoutButton'
import { getT } from '@/i18n/server'
import type { Lang } from '@/i18n/dictionary'
import { getCustomer, getCustomerBookings } from '@/lib/account'
import { formatXPF } from '@/lib/money'

export const dynamic = 'force-dynamic'

type Doc = Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT()
  return { title: t.account.homeTitle, robots: { index: false, follow: false } }
}

const STATUS: Record<string, { fr: string; en: string }> = {
  pending: { fr: 'En attente de paiement', en: 'Awaiting payment' },
  confirmed: { fr: 'Confirmée', en: 'Confirmed' },
  cancelled: { fr: 'Annulée', en: 'Cancelled' },
  expired: { fr: 'Expirée', en: 'Expired' },
  completed: { fr: 'Terminée', en: 'Completed' },
}
const PAYMENT: Record<string, { fr: string; en: string }> = {
  unpaid: { fr: 'Non payé', en: 'Unpaid' },
  partial: { fr: 'Partiellement payé', en: 'Partially paid' },
  paid: { fr: 'Payé', en: 'Paid' },
  refunded: { fr: 'Remboursé', en: 'Refunded' },
  free: { fr: 'Gratuit', en: 'Free' },
}
const pick = (map: Record<string, { fr: string; en: string }>, key: string, lang: Lang) => map[key]?.[lang] ?? key

export default async function AccountHome() {
  const customer = await getCustomer()
  if (!customer) redirect('/compte/connexion?redirect=/compte')

  const { t, lang } = await getT()
  const a = t.account
  const bookings = (await getCustomerBookings(customer.id)) as Doc[]
  const firstName = customer.firstName || customer.displayName || ''

  return (
    <section className="container-x min-h-[80vh] pt-[128px] pb-24">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow mb-3 text-plum-700/70">{a.eyebrow}</p>
            <h1 className="font-display text-[clamp(2.2rem,5vw,3.2rem)] leading-[1.05] text-plum-900">
              {a.homeHello(firstName)}
            </h1>
            <p className="mt-2 text-ink-soft">{a.homeTitle}</p>
          </div>
          <LogoutButton />
        </div>

        <div className="mt-10 grid gap-4">
          {bookings.length === 0 && (
            <div className="rounded-[3px] bg-sand-50 p-8 ring-1 ring-plum-800/10">
              <p className="text-ink-soft">{a.noBookings}</p>
              <Link href="/offres" className="mt-3 inline-block font-semibold text-plum-800 underline">
                {a.seeOffers}
              </Link>
            </div>
          )}

          {bookings.map((b) => {
            const offeringTitle = typeof b.offering === 'object' ? b.offering?.title : undefined
            return (
              <article key={b.id} className="rounded-[3px] bg-sand-50 p-6 ring-1 ring-plum-800/10">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="font-display text-2xl text-plum-900">{offeringTitle || b.code}</h2>
                  <span className="text-sm text-ink-soft">
                    {a.bookingRef} · {b.code}
                  </span>
                </div>
                <dl className="mt-4 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
                  {b.when && (
                    <div className="flex justify-between gap-4 sm:block">
                      <dt className="text-ink-soft">{a.bookingWhen}</dt>
                      <dd className="font-medium text-plum-900">{b.when}</dd>
                    </div>
                  )}
                  <div className="flex justify-between gap-4 sm:block">
                    <dt className="text-ink-soft">{a.bookingStatus}</dt>
                    <dd className="font-medium text-plum-900">{pick(STATUS, b.status, lang)}</dd>
                  </div>
                  <div className="flex justify-between gap-4 sm:block">
                    <dt className="text-ink-soft">{a.bookingPayment}</dt>
                    <dd className="font-medium text-plum-900">
                      {pick(PAYMENT, b.paymentStatus, lang)}
                      {b.amountTotal ? ` · ${formatXPF(b.amountPaid)} / ${formatXPF(b.amountTotal)}` : ''}
                    </dd>
                  </div>
                </dl>
                {b.accessToken && (
                  <Link
                    href={`/reservation/${b.accessToken}`}
                    className="mt-4 inline-block text-sm font-semibold text-plum-800 underline"
                  >
                    {a.viewBooking}
                  </Link>
                )}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
