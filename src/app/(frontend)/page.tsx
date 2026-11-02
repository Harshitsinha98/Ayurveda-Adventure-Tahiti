import { differenceInCalendarDays } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'

import { Breath } from '@/components/home/Breath'
import { Hero } from '@/components/home/Hero'
import { JourneyFeature } from '@/components/home/JourneyFeature'
import { OfferingList } from '@/components/home/OfferingList'
import { Testimonials } from '@/components/home/Testimonials'
import { Parallax, Reveal, ScrollWords } from '@/components/motion/primitives'
import { PostCard, SectionHeading } from '@/components/site/ui'
import { formatXPF } from '@/lib/money'
import { img, payloadClient } from '@/lib/payload'
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

  return (
    <>
      <Hero
        eyebrow={home.eyebrow || homeDefaults.eyebrow}
        lines={home.headline?.length ? home.headline.map((h) => h.line) : homeDefaults.headline}
        intro={home.intro || homeDefaults.intro}
        image={img(home.heroImage, 'hero') ?? photo('eliane-gange')}
        accent={img(accent?.image, 'thumb') ?? photo('bouddha-bougie')}
      />

      {/* Manifesto */}
      <section className="py-28 lg:py-40" aria-label={t.home.manifestoEyebrow}>
        <div className="container-x grid gap-12 lg:grid-cols-[0.3fr_1fr]">
          <Reveal>
            <p className="eyebrow text-saffron-600">{t.home.manifestoEyebrow}</p>
            <p className="font-display mt-4 text-2xl italic text-sage-700">{t.home.manifestoQ}</p>
          </Reveal>
          <div>
            {(home.manifesto || homeDefaults.manifesto) && <ScrollWords text={home.manifesto || homeDefaults.manifesto} className="font-display text-[clamp(1.9rem,3.6vw,3.3rem)] leading-[1.22] text-plum-800" />}
            {(home.manifestoAside || homeDefaults.manifestoAside) && (
              <Reveal delay={0.1}>
                <p className="mt-12 flex items-center gap-5 text-lg text-ink-soft">
                  <span aria-hidden className="h-px w-16 bg-saffron-500" />
                  {home.manifestoAside || homeDefaults.manifestoAside}
                </p>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      <Breath />

      {/* Morning ritual + six pillars */}
      <section className="py-28 lg:py-36" aria-labelledby="ritual-title">
        <div className="container-x grid items-center gap-16 lg:grid-cols-2">
          {ritualImage && (
            <Reveal className="relative">
              <Parallax className="aspect-[4/5] rounded-[3px]" amount={50}>
                <Image src={ritualImage.url} alt={ritualImage.alt} fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
              </Parallax>
              <div className="absolute -bottom-8 right-6 rounded-[3px] bg-plum-800 px-7 py-6 text-sand-50 shadow-xl sm:right-[-2rem]">
                <p className="font-display text-5xl leading-none text-saffron-300">20</p>
                <p className="mt-1 max-w-[11rem] text-sm text-sand-200/85">{t.home.ritualBadge}</p>
              </div>
            </Reveal>
          )}
          <div>
            <SectionHeading id="ritual-title" eyebrow={t.home.ritualEyebrow} title={ritual.title} intro={ritual.text} />
            <ol className="mt-12 grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-3">
              {pillars.map((p, i) => (
                <Reveal as="li" key={('id' in p && p.id) || i} delay={i * 0.06} className="group border-t border-plum-800/12 py-5">
                  <span className="font-display text-sm italic text-saffron-600">{String(i + 1).padStart(2, '0')}</span>
                  <p className="font-display mt-1 text-2xl text-plum-800 transition-transform duration-500 group-hover:translate-x-1">{p.title}</p>
                  {p.text && <p className="mt-1 text-sm leading-snug text-ink-soft">{p.text}</p>}
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Ayurveda in brief: the three doshas */}
      <section className="bg-sand-50 py-24 lg:py-32" aria-labelledby="dosha-title">
        <div className="container-x">
          <SectionHeading id="dosha-title" eyebrow={t.home.doshaEyebrow} title={t.home.doshaTitle} accent={t.home.doshaAccent} intro={t.home.doshaIntro} />
          <ol className="mt-14 grid gap-px overflow-hidden border border-plum-800/10 bg-plum-800/10 md:grid-cols-3">
            {t.home.doshas.map((d, i) => (
              <Reveal as="li" key={d.name} delay={i * 0.08} className="bg-sand-50 p-8 lg:p-10">
                <p className="eyebrow text-[0.66rem] text-sage-700">{d.el}</p>
                <p className="font-display mt-3 text-5xl text-plum-800">{d.name}</p>
                <p className="mt-4 leading-relaxed text-ink-soft">{d.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Offerings */}
      <section className="pb-28 lg:pb-36" aria-labelledby="offres-title">
        <div className="container-x">
          <div className="mb-14 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionHeading id="offres-title" eyebrow={t.home.offersEyebrow} title={t.home.offersTitle} accent={t.home.offersAccent} />
            <Reveal>
              <Link href="/offres" className="text-sm font-semibold text-plum-800 underline decoration-saffron-500 underline-offset-[6px]">
                {t.home.offersAll}
              </Link>
            </Reveal>
          </div>
          <OfferingList
            items={services.map((o) => ({
              slug: o.slug!,
              title: o.title,
              kicker: o.kicker,
              price: priceLabel(o, lang),
              meta: [kindLabel(o.kind, lang), modeLabel(o.mode, lang), durationLabel(o.durationMinutes)].filter(Boolean).join(' · '),
              image: img(o.image, 'card') ?? offeringPhoto(o.slug),
            }))}
          />
        </div>
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
          images={[img(trip.image, 'card') ?? offeringPhoto(trip.slug), ...((trip.gallery ?? []).length ? (trip.gallery ?? []).slice(0, 2).map((g) => img(g.image, 'card')) : (TRIP_GALLERY[trip.slug!] ?? []).slice(0, 2).map((n) => photo(n)))].filter(Boolean) as never}
        />
      )}

      {/* Tahiti: where Eliane receives */}
      <section className="relative overflow-hidden bg-plum-950 text-sand-50" aria-labelledby="tahiti-title">
        <div className="absolute inset-0">
          <Parallax className="h-full w-full" amount={60}>
            <Image src="/images/photos/tahiti-vue-moorea.jpg" alt={lang === 'en' ? 'Moorea seen from the hills of Tahiti' : 'Vue de Moorea depuis les hauteurs de Tahiti'} fill sizes="100vw" className="object-cover opacity-55" />
          </Parallax>
        </div>
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-plum-950 via-plum-950/70 to-transparent" />
        <div className="container-x relative grid gap-12 py-28 lg:grid-cols-[1fr_0.8fr] lg:py-40">
          <Reveal>
            <p className="eyebrow text-saffron-300">{t.home.tahitiEyebrow}</p>
            <h2 id="tahiti-title" className="mt-5 max-w-2xl text-[clamp(2.4rem,5vw,4.4rem)] leading-[1]">
              {t.home.tahitiTitle} <em className="text-saffron-300">{t.home.tahitiAccent}</em>
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-sand-200/85">{t.home.tahitiText}</p>
          </Reveal>
          <Reveal delay={0.15} className="relative hidden aspect-[4/5] max-w-sm justify-self-end overflow-hidden rounded-[2px] lg:block">
            <Image src="/images/photos/punaauia-plage.jpg" alt={lang === 'en' ? 'The Punaauia lagoon at sunset' : 'Le lagon de Punaauia au coucher du soleil'} fill sizes="30vw" className="object-cover" />
          </Reveal>
        </div>
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
              <Link href="/blog" className="text-sm font-semibold text-plum-800 underline decoration-saffron-500 underline-offset-[6px]">{t.home.blogAll}</Link>
            </div>
            <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr_1fr]">
              {posts.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.08}>
                  <PostCard {...postCardProps(p)} lang={lang} large={i === 0} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Closing invitation */}
      <section className="relative overflow-hidden py-28 text-center lg:py-40">
        <div className="container-x relative">
          <Reveal>
            <p className="eyebrow text-saffron-600">{t.home.closingEyebrow}</p>
            <h2 className="mx-auto mt-6 max-w-4xl text-[clamp(2.6rem,6vw,5.2rem)] leading-[1] text-plum-800">
              {t.home.closing1} <em className="text-saffron-600">{t.home.closing2}</em>
            </h2>
            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <Link href="/offres/consultation-decouverte" className="rounded-[2px] bg-plum-800 px-8 py-4 font-semibold text-sand-50 transition hover:bg-plum-700">{t.home.closingBook}</Link>
              <Link href="/contact" className="rounded-[2px] border border-plum-800/25 px-8 py-4 font-semibold text-plum-800 transition hover:border-plum-800">{t.home.closingWrite}</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
