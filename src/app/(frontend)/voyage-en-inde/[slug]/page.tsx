import { differenceInCalendarDays } from 'date-fns'
import { Check, Minus } from 'lucide-react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { BookingWidget } from '@/components/booking/BookingWidget'
import { Reveal } from '@/components/motion/primitives'
import { RichText } from '@/components/site/RichText'
import { SectionHeading } from '@/components/site/ui'
import { Gallery, Itinerary, TripHero } from '@/components/trip/TripParts'
import { formatEUR, formatXPF } from '@/lib/money'
import { img, type Img } from '@/lib/payload'
import { offeringPhoto, photo, TRIP_GALLERY } from '@/lib/photos'
import { getT } from '@/i18n/server'
import { dateLocale } from '@/i18n/dictionary'
import { getOffering, seatsLeft, upcomingOccurrences } from '@/lib/queries'
import { fmtDateOnly } from '@/lib/time'

export const dynamic = 'force-dynamic'
type P = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { lang } = await getT()
  const o = await getOffering((await params).slug, lang)
  if (!o) return {}
  const og = img(o.seo?.image ?? o.image, 'card')
  return { title: o.seo?.title || o.title, description: o.seo?.description || o.summary, openGraph: og ? { images: [{ url: og.url }] } : undefined }
}

export default async function TripPage({ params }: P) {
  const { lang, t } = await getT()
  const dl = dateLocale(lang)
  const o = await getOffering((await params).slug, lang)
  if (!o || o.kind !== 'voyage') notFound()
  const occ = await upcomingOccurrences(o.id, lang)
  const [title, subtitle] = o.title.split(' · ')
  const days = o.tripStart && o.tripEnd ? differenceInCalendarDays(new Date(o.tripEnd), new Date(o.tripStart)) + 1 : null
  const nextOcc = occ[0]
  const past = o.tripEnd ? new Date(o.tripEnd) < new Date() : false
  const cmsGallery = (o.gallery ?? []).map((g) => img(g.image, 'card')).filter(Boolean) as Img[]
  const gallery = cmsGallery.length ? cmsGallery : ((TRIP_GALLERY[o.slug!] ?? []).map((n) => photo(n, undefined, lang)).filter(Boolean) as Img[])

  const facts = [
    o.tripStart && { k: t.trip.dates, v: `${fmtDateOnly(o.tripStart, dl)} – ${o.tripEnd ? fmtDateOnly(o.tripEnd, dl) : ''}` },
    days && { k: t.trip.duration, v: t.trip.days(days) },
    nextOcc && { k: t.trip.group, v: t.trip.groupValue(nextOcc.capacity ?? 0, seatsLeft(nextOcc)) },
    o.price && { k: t.trip.price, v: formatXPF(o.price) },
  ].filter(Boolean) as { k: string; v: string }[]

  return (
    <>
      <TripHero image={img(o.image, 'hero') ?? offeringPhoto(o.slug, lang)} title={title} subtitle={subtitle} kicker={o.kicker} />

      <section className="relative z-10 -mt-px bg-plum-950 pb-16 text-sand-50">
        <div className="container-x">
          <dl className="grid grid-cols-2 gap-6 border-t border-sand-50/15 pt-8 md:grid-cols-4">
            {facts.map((f) => (
              <div key={f.k}>
                <dt className="eyebrow text-[0.64rem] text-saffron-300">{f.k}</dt>
                <dd className="font-display mt-2 text-xl leading-snug sm:text-2xl">{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="py-24 lg:py-32">
        <div className="container-x grid gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
          <div>
            <Reveal>
              {o.guide && <p className="eyebrow text-saffron-600">{o.guide}</p>}
              <p className="font-display mt-6 text-[clamp(1.9rem,3.4vw,2.9rem)] leading-[1.2] text-plum-800">{o.summary}</p>
            </Reveal>
            <div className="mt-10 max-w-2xl">
              <RichText data={o.description} />
            </div>
            {(o.highlights?.length ?? 0) > 0 && (
              <ul className="mt-12 space-y-4">
                {o.highlights!.map((h, i) => (
                  <Reveal as="li" key={h.id} delay={i * 0.05} className="flex items-start gap-5 border-b border-plum-800/10 pb-4">
                    <span className="font-display text-2xl italic text-saffron-600">{String(i + 1).padStart(2, '0')}</span>
                    <span className="pt-1.5 text-lg text-ink">{h.text}</span>
                  </Reveal>
                ))}
              </ul>
            )}
          </div>
          <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start" id="reserver" aria-label={t.trip.reserve}>
            <div className="mb-5">
              <p className="font-display text-4xl text-plum-800">{o.price ? formatXPF(o.price) : ''}</p>
              <p className="text-sm text-ink-soft">{o.price ? formatEUR(o.price, lang) : ''}{o.priceNote ? ` · ${o.priceNote}` : ''}</p>
              {o.depositPercent ? <p className="mt-2 text-sm text-sage-700">{t.trip.deposit(o.depositPercent, o.balanceDueDaysBefore)}</p> : null}
            </div>
            {o.bookingMode === 'closed' || past ? (
              <div className="rounded-[3px] bg-sand-50 p-7">
                <p className="font-display text-2xl text-plum-800">{past ? t.trip.pastTitle : t.trip.closedTitle}</p>
                <p className="mt-2 text-ink-soft">{t.trip.closedText}</p>
              </div>
            ) : (
              <BookingWidget
                offering={{
                  slug: o.slug!,
                  kind: o.kind,
                  title: title,
                  price: o.price,
                  priceOptions: o.priceOptions?.map((p) => ({ label: p.label, price: p.price })),
                  extras: o.extras?.map((x) => ({ label: x.label, price: x.price, description: x.description })),
                  maxPerBooking: o.maxPerBooking,
                  depositPercent: o.depositPercent,
                  bookingMode: o.bookingMode,
                  cancellationPolicy: o.cancellationPolicy,
                }}
                occurrences={occ.map((x) => ({ id: x.id, startsAt: x.startsAt, endsAt: x.endsAt, seatsLeft: x.status === 'open' ? seatsLeft(x) : 0, priceOverride: x.priceOverride }))}
              />
            )}
          </aside>
        </div>
      </section>

      {(o.itinerary?.length ?? 0) > 0 && (
        <section className="bg-sand-50 py-24 lg:py-32" aria-labelledby="itin">
          <div className="container-x grid gap-16 lg:grid-cols-[0.6fr_1fr]">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SectionHeading id="itin" eyebrow={t.trip.itinEyebrow} title={t.trip.itinTitle} accent={t.trip.itinAccent} intro={t.trip.itinIntro} />
            </div>
            <Itinerary days={o.itinerary!.map((d) => ({ day: d.day, title: d.title, text: d.text }))} />
          </div>
        </section>
      )}

      {gallery.length > 0 && (
        <section className="py-24 lg:py-32" aria-label="Photos">
          <div className="container-x">
            <SectionHeading eyebrow={t.trip.galleryEyebrow} title={t.trip.galleryTitle} accent={t.trip.galleryAccent} />
            <div className="mt-12">
              <Gallery images={gallery} />
            </div>
          </div>
        </section>
      )}

      {o.presentationUrl && (
        <section className="pb-24">
          <div className="container-x">
            <p className="eyebrow mb-6 text-saffron-600">{t.trip.presentation}</p>
            <div className="relative aspect-video overflow-hidden rounded-[3px] bg-sand-200">
              <iframe src={o.presentationUrl} title={`${t.trip.presentation} · ${o.title}`} loading="lazy" allowFullScreen className="absolute inset-0 h-full w-full" />
            </div>
          </div>
        </section>
      )}

      <section className="bg-plum-900 py-24 text-sand-50 lg:py-28">
        <div className="container-x grid gap-12 md:grid-cols-2">
          {(o.included?.length ?? 0) > 0 && (
            <div>
              <h2 className="text-4xl">{t.trip.included[0]} <em className="text-saffron-300">{t.trip.included[1]}</em></h2>
              <ul className="mt-8 space-y-3">
                {o.included!.map((x) => (
                  <li key={x.id} className="flex gap-3 text-sand-200/90"><Check size={18} className="mt-1 shrink-0 text-saffron-300" />{x.text}</li>
                ))}
              </ul>
            </div>
          )}
          {(o.notIncluded?.length ?? 0) > 0 && (
            <div>
              <h2 className="text-4xl">{t.trip.notIncluded[0]} <em className="text-saffron-300">{t.trip.notIncluded[1]}</em></h2>
              <ul className="mt-8 space-y-3">
                {o.notIncluded!.map((x) => (
                  <li key={x.id} className="flex gap-3 text-sand-200/75"><Minus size={18} className="mt-1 shrink-0 text-sand-200/50" />{x.text}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
