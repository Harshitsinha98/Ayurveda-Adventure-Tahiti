import { differenceInCalendarDays } from 'date-fns'
import Link from 'next/link'

import { Breath } from '@/components/home/Breath'
import { Hero } from '@/components/home/Hero'
import { Doshas } from '@/components/home/Doshas'
import { FloatingPhotos } from '@/components/home/FloatingPhotos'
import { JourneyFeature } from '@/components/home/JourneyFeature'
import { OfferingStack } from '@/components/home/OfferingStack'
import { Ritual } from '@/components/home/Ritual'
import { Testimonials } from '@/components/home/Testimonials'
import { Magnetic, Reveal, ScrollWords } from '@/components/motion/primitives'
import { DrawLine, ScaleOnScroll, VelocityMarquee, ZoomParallax } from '@/components/motion/scroll'
import { PostCard, SectionHeading } from '@/components/site/ui'
import { formatXPF } from '@/lib/money'
import { img, payloadClient, type Img } from '@/lib/payload'
import { offeringPhoto, photo, TRIP_GALLERY } from '@/lib/photos'
import { getT } from '@/i18n/server'
import { durationLabel, kindLabel, listOfferings, listPosts, localeOpts, modeLabel, postCardProps, priceLabel, seatsLeft, upcomingOccurrences } from '@/lib/queries'

import { home as homeFr, i18nEn } from '../../../scripts/seed-data'
import type { Offering } from '@/payload-types'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payload = await payloadClient()
  const { lang, t } = await getT()
  const homeDefaults = lang === 'en' ? i18nEn.home : homeFr
  const [home, offerings, posts, testimonials, occurrences] = await Promise.all([
    payload.findGlobal({ slug: 'home', depth: 1, ...localeOpts(lang) }),
    listOfferings({}, lang),
    listPosts(3, undefined, lang),
    payload.find({ collection: 'testimonials', where: { published: { equals: true } }, sort: 'order', limit: 12, ...localeOpts(lang) }),
    upcomingOccurrences(undefined, lang),
  ])

  const services = offerings.filter((o) => o.kind !== 'voyage')
  const trip = offerings.find((o) => o.kind === 'voyage' && o.featured && o.bookingMode !== 'closed')
  const tripOcc = trip ? occurrences.find((o) => (o.offering as Offering).id === trip.id) : undefined
  const accent = services.find((s) => s.slug === 'seance-individuelle-en-ligne')

  const pillars = home.pillars?.length ? home.pillars : homeDefaults.pillars
  const ritualImage = img(home.ritual?.image, 'hero') ?? photo('puja-gange')
  const ritual = { title: home.ritual?.title || homeDefaults.ritual.title, text: home.ritual?.text || homeDefaults.ritual.text }

  const ritualImages = [ritualImage, ...['epices', 'meditation-groupe', 'himalaya-marche', 'autel', 'notes'].map((n) => photo(n, undefined, lang))].filter(Boolean) as Img[]
  const journeyImages = [
    img(trip?.image, 'card') ?? offeringPhoto(trip?.slug, lang),
    ...((trip?.gallery ?? []).length ? (trip?.gallery ?? []).map((g) => img(g.image, 'card')) : (TRIP_GALLERY[trip?.slug ?? ''] ?? []).map((n) => photo(n, undefined, lang))),
  ]
    .filter(Boolean)
    .slice(0, 6) as Img[]
  const tahitiImages = ['tahiti-vue-moorea', 'punaauia-plage', 'salle-punaauia', 'moorea-coucher-soleil', 'eliane-portrait', 'meditation-groupe', 'autel']
    .map((n) => photo(n, undefined, lang))
    .filter(Boolean) as Img[]

  return (
    <>
      <Hero
        eyebrow={home.eyebrow || homeDefaults.eyebrow}
        lines={home.headline?.length ? home.headline.map((h) => h.line) : homeDefaults.headline}
        intro={home.intro || homeDefaults.intro}
        image={img(home.heroImage, 'hero') ?? photo('eliane-gange', undefined, lang)}
        accent={img(accent?.image, 'thumb') ?? photo('bouddha-bougie', undefined, lang)}
      />

      <div className="border-y border-plum-800/10 bg-sand-50 py-6 lg:py-8">
        <VelocityMarquee items={t.home.marquee} className="font-display text-[clamp(2.4rem,6vw,5.4rem)] leading-none text-plum-800" />
      </div>

      {/* Manifesto */}
      <section className="relative overflow-hidden py-28 lg:py-44" aria-label={t.home.manifestoEyebrow}>
        <FloatingPhotos images={[photo('puja-rituel', undefined, lang), photo('kumbh-sadhus', undefined, lang), photo('ladakh-monastere', undefined, lang)]} />
        <div className="container-x relative">
          <div className="mx-auto max-w-5xl text-center">
            <p className="eyebrow text-saffron-600">{t.home.manifestoEyebrow}</p>
            {(home.manifesto || homeDefaults.manifesto) && <ScrollWords text={home.manifesto || homeDefaults.manifesto} className="font-display mt-8 text-[clamp(2rem,4.4vw,4rem)] leading-[1.18] text-plum-800" />}
            {(home.manifestoAside || homeDefaults.manifestoAside) && (
              <Reveal delay={0.1}>
                <p className="mx-auto mt-14 flex max-w-xl items-center justify-center gap-5 text-lg text-ink-soft">
                  <span aria-hidden className="h-px w-12 shrink-0 bg-saffron-500" />
                  {home.manifestoAside || homeDefaults.manifestoAside}
                  <span aria-hidden className="h-px w-12 shrink-0 bg-saffron-500" />
                </p>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      <Breath />

      <Ritual eyebrow={t.home.ritualEyebrow} title={ritual.title} text={ritual.text} badge={t.home.ritualBadge} pillars={pillars.map((x) => ({ title: x.title, text: x.text }))} images={ritualImages} />

      <Doshas eyebrow={t.home.doshaEyebrow} title={t.home.doshaTitle} accent={t.home.doshaAccent} intro={t.home.doshaIntro} items={t.home.doshas} />

      {/* Offerings */}
      <section className="pt-28 lg:pt-40" aria-labelledby="offres-title">
        <div className="container-x mb-6 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading id="offres-title" eyebrow={t.home.offersEyebrow} title={t.home.offersTitle} accent={t.home.offersAccent} />
          <Reveal>
            <Link href="/offres" className="link-line text-sm font-semibold text-plum-800">
              {t.home.offersAll}
            </Link>
          </Reveal>
        </div>
        <OfferingStack
          items={services.map((o) => ({
            slug: o.slug!,
            title: o.title,
            kicker: o.kicker,
            price: priceLabel(o, lang),
            meta: [kindLabel(o.kind, lang), modeLabel(o.mode, lang), durationLabel(o.durationMinutes)].filter(Boolean).join(' · '),
            image: img(o.image, 'card') ?? offeringPhoto(o.slug, lang),
          }))}
        />
      </section>

      {trip && (
        <JourneyFeature
          slug={trip.slug!}
          title={trip.title}
          kicker={trip.kicker}
          summary={trip.summary}
          region={trip.tripRegion}
          price={trip.price ? formatXPF(trip.price) : null}
          daysLeft={trip.tripStart ? differenceInCalendarDays(new Date(trip.tripStart), new Date()) : null}
          seatsLeft={tripOcc ? seatsLeft(tripOcc) : null}
          images={journeyImages}
        />
      )}

      {/* Tahiti: where Eliane receives */}
      <section className="bg-plum-950 text-sand-50" aria-labelledby="tahiti-title" data-cursor-dark>
        <ZoomParallax images={tahitiImages}>
          <div className="container-x pb-16 lg:pb-24">
            <p className="eyebrow text-saffron-300">{t.home.tahitiEyebrow}</p>
            <h2 id="tahiti-title" className="mt-5 max-w-3xl text-[clamp(2.6rem,6vw,5.6rem)] leading-[0.98]">
              {t.home.tahitiTitle} <em className="text-saffron-300">{t.home.tahitiAccent}</em>
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-sand-100/90">{t.home.tahitiText}</p>
          </div>
        </ZoomParallax>
      </section>

      {/* Testimonials */}
      <section className="py-28 lg:py-36" aria-labelledby="temoignages-title">
        <div className="container-x grid gap-14 lg:grid-cols-[0.35fr_1fr]">
          <Reveal>
            <p className="eyebrow text-saffron-600">{t.home.testimonialsEyebrow}</p>
            <h2 id="temoignages-title" className="mt-4 text-4xl text-plum-800">{t.home.testimonialsTitle} <em className="text-saffron-600">{t.home.testimonialsAccent}</em></h2>
          </Reveal>
          <Testimonials items={testimonials.docs.map((x) => ({ id: x.id, quote: x.quote, highlight: x.highlight, name: x.name, context: x.context }))} />
        </div>
      </section>

      {/* Blog */}
      {posts.length > 0 && (
        <section className="bg-sand-50 py-28 lg:py-36" aria-labelledby="blog-title">
          <div className="container-x">
            <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <SectionHeading id="blog-title" eyebrow={t.home.blogEyebrow} title={t.home.blogTitle} accent={t.home.blogAccent} />
              <Link href="/blog" className="link-line text-sm font-semibold text-plum-800">{t.home.blogAll}</Link>
            </div>
            <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr_1fr]">
              {posts.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.1} y={60} data-cursor={t.home.read}>
                  <PostCard {...postCardProps(p)} lang={lang} large={i === 0} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Closing invitation */}
      <section className="relative overflow-hidden py-32 text-center lg:py-48">
        <DrawLine className="pointer-events-none absolute inset-x-0 top-16 h-24 w-full text-saffron-500/50" />
        <div className="container-x relative">
          <p className="eyebrow text-saffron-600">{t.home.closingEyebrow}</p>
          <ScaleOnScroll className="mx-auto mt-8 max-w-5xl">
            <h2 className="text-[clamp(2.8rem,7.4vw,7rem)] leading-[0.95] text-plum-800">
              {t.home.closing1} <em className="text-saffron-600">{t.home.closing2}</em>
            </h2>
          </ScaleOnScroll>
          <Reveal className="mt-14 flex flex-wrap justify-center gap-4">
            <Magnetic>
              <Link href="/offres/consultation-decouverte" className="btn-fill inline-flex rounded-[2px] bg-plum-800 px-9 py-5 font-semibold text-sand-50">
                <span className="relative z-10">{t.home.closingBook}</span>
              </Link>
            </Magnetic>
            <Magnetic>
              <Link href="/contact" className="btn-outline inline-flex rounded-[2px] border border-plum-800/25 px-9 py-5 font-semibold text-plum-800">
                <span className="relative z-10">{t.home.closingWrite}</span>
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </section>
    </>
  )
}
