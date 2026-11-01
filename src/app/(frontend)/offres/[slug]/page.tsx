import { Clock, MapPin, Users } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

import { BookingWidget } from '@/components/booking/BookingWidget'
import { ContactForm } from '@/components/booking/ContactForm'
import { Reveal } from '@/components/motion/primitives'
import { RichText } from '@/components/site/RichText'
import { Pill } from '@/components/site/ui'
import { formatEUR } from '@/lib/money'
import { img } from '@/lib/payload'
import { durationLabel, getOffering, KIND_LABEL, listOfferings, MODE_LABEL, priceLabel, seatsLeft, upcomingOccurrences } from '@/lib/queries'

export const revalidate = 60

type P = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const o = await getOffering((await params).slug)
  if (!o) return {}
  const og = img(o.seo?.image ?? o.image, 'card')
  return {
    title: o.seo?.title || o.title,
    description: o.seo?.description || o.summary,
    openGraph: og ? { images: [{ url: og.url }] } : undefined,
    alternates: { canonical: `/offres/${o.slug}` },
  }
}

export default async function OfferingPage({ params }: P) {
  const { slug } = await params
  const o = await getOffering(slug)
  if (!o) notFound()
  if (o.kind === 'voyage') redirect(`/voyage-en-inde/${o.slug}`)

  const [occ, others] = await Promise.all([o.kind !== 'seance' ? upcomingOccurrences(o.id) : Promise.resolve([]), listOfferings({ and: [{ kind: { not_equals: 'voyage' } }, { id: { not_equals: o.id } }] })])
  const hero = img(o.image, 'hero')
  const facts = [
    durationLabel(o.durationMinutes) && { icon: <Clock size={16} />, label: durationLabel(o.durationMinutes) },
    o.mode && { icon: <MapPin size={16} />, label: o.location || MODE_LABEL[o.mode] },
    (o.maxPerBooking ?? 1) > 1 && { icon: <Users size={16} />, label: `Jusqu’à ${o.maxPerBooking} personnes par réservation` },
  ].filter(Boolean) as { icon: React.ReactNode; label: string }[]

  return (
    <>
      <section className="pb-10 pt-[120px] lg:pt-[150px]">
        <div className="container-x">
          <nav aria-label="Fil d’Ariane" className="text-sm text-ink-soft">
            <Link href="/offres" className="hover:text-plum-800">Offres</Link> <span aria-hidden>/</span> <span>{o.title}</span>
          </nav>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-x grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)]">
          <div>
            <Reveal>
              <div className="flex flex-wrap gap-2">
                <Pill tone="plum">{KIND_LABEL[o.kind]}</Pill>
                {o.mode && <Pill tone="sage">{MODE_LABEL[o.mode]}</Pill>}
              </div>
              <h1 className="mt-6 text-[clamp(2.8rem,6vw,5rem)] leading-[0.98] text-plum-800">{o.title}</h1>
              {o.kicker && <p className="font-display mt-4 text-2xl italic text-saffron-600">{o.kicker}</p>}
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">{o.summary}</p>
            </Reveal>

            {hero && (
              <Reveal delay={0.1} className="relative mt-10 aspect-[16/10] overflow-hidden rounded-[30px]">
                <Image src={hero.url} alt={hero.alt} fill priority sizes="(min-width:1024px) 55vw, 100vw" className="object-cover" />
              </Reveal>
            )}

            {facts.length > 0 && (
              <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-ink-soft">
                {facts.map((f) => (
                  <li key={f.label} className="flex items-center gap-2 text-plum-800">{f.icon}{f.label}</li>
                ))}
              </ul>
            )}

            <div className="mt-12 max-w-2xl">
              <RichText data={o.description} />
              {(o.highlights?.length ?? 0) > 0 && (
                <ul className="mt-10 grid gap-3 sm:grid-cols-2">
                  {o.highlights!.map((h) => (
                    <li key={h.id} className="rounded-2xl bg-sand-50 px-5 py-4 text-[0.97rem] text-ink-soft">{h.text}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start" aria-label="Réservation">
            <div className="mb-5 flex items-end justify-between">
              <p className="font-display text-4xl text-plum-800">{priceLabel(o)}</p>
              {o.price ? <p className="text-sm text-ink-soft">{formatEUR(o.price)}{o.priceNote ? ` · ${o.priceNote}` : ''}</p> : null}
            </div>
            {o.bookingMode === 'request' ? (
              <div className="rounded-[28px] border border-plum-800/10 bg-sand-50 p-7">
                <p className="font-display text-2xl text-plum-800">Organiser une conférence</p>
                <p className="mb-6 mt-2 text-sm text-ink-soft">Indiquez la date souhaitée, le lieu et le nombre de participants.</p>
                <ContactForm offering={o.slug!} subject={o.title} />
              </div>
            ) : o.bookingMode === 'closed' ? (
              <div className="rounded-[28px] bg-sand-50 p-7 text-ink-soft">Les réservations sont fermées pour le moment. <Link href="/contact" className="underline">Écrivez-moi</Link> pour être prévenu·e.</div>
            ) : (
              <BookingWidget
                offering={{
                  slug: o.slug!,
                  kind: o.kind,
                  title: o.title,
                  price: o.price,
                  priceOptions: o.priceOptions?.map((p) => ({ label: p.label, price: p.price })),
                  extras: o.extras?.map((x) => ({ label: x.label, price: x.price, description: x.description })),
                  maxPerBooking: o.maxPerBooking,
                  depositPercent: o.depositPercent,
                  bookingMode: o.bookingMode,
                  creditEligible: o.creditEligible,
                  durationMinutes: o.durationMinutes,
                  cancellationPolicy: o.cancellationPolicy,
                }}
                occurrences={occ.map((x) => ({
                  id: x.id,
                  startsAt: x.startsAt,
                  endsAt: x.endsAt,
                  seatsLeft: x.status === 'open' ? seatsLeft(x) : 0,
                  priceOverride: x.priceOverride,
                  location: x.location,
                  scheduleCount: x.schedule?.length || undefined,
                }))}
              />
            )}
          </aside>
        </div>
      </section>

      {others.length > 0 && (
        <section className="border-t border-plum-800/10 py-20">
          <div className="container-x">
            <p className="eyebrow text-saffron-600">À découvrir aussi</p>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {others.slice(0, 3).map((x) => (
                <Link key={x.id} href={`/offres/${x.slug}`} className="group rounded-[24px] bg-sand-50 p-6 transition hover:bg-plum-800 hover:text-sand-50">
                  <p className="text-xs uppercase tracking-[0.16em] text-saffron-600">{KIND_LABEL[x.kind]}</p>
                  <p className="font-display mt-2 text-2xl text-plum-800 group-hover:text-sand-50">{x.title}</p>
                  <p className="mt-2 text-sm text-ink-soft group-hover:text-sand-200">{priceLabel(x)}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
