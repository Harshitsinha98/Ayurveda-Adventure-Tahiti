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
import { home as homeDefaults } from '../../../scripts/seed-data'
import { durationLabel, KIND_LABEL, listOfferings, listPosts, MODE_LABEL, postCardProps, priceLabel, seatsLeft, upcomingOccurrences } from '@/lib/queries'
import type { Offering } from '@/payload-types'

export const revalidate = 120

export default async function HomePage() {
  const payload = await payloadClient()
  const [home, offerings, posts, testimonials, occurrences] = await Promise.all([
    payload.findGlobal({ slug: 'home', depth: 1 }),
    listOfferings(),
    listPosts(3),
    payload.find({ collection: 'testimonials', where: { published: { equals: true } }, sort: 'order', limit: 12 }),
    upcomingOccurrences(),
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
      <section className="py-28 lg:py-40" aria-label="Manifeste">
        <div className="container-x grid gap-12 lg:grid-cols-[0.3fr_1fr]">
          <Reveal>
            <p className="eyebrow text-saffron-600">La vie est maintenant</p>
            <p className="font-display mt-4 text-2xl italic text-sage-700">Comment veux-tu la vivre ?</p>
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
                <p className="mt-1 max-w-[11rem] text-sm text-sand-200/85">minutes après le réveil qui changent toute la journée</p>
              </div>
            </Reveal>
          )}
          <div>
            <SectionHeading id="ritual-title" eyebrow="L’art de vivre ayurvédique" title={ritual.title} intro={ritual.text} />
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

      {/* Offerings */}
      <section className="pb-28 lg:pb-36" aria-labelledby="offres-title">
        <div className="container-x">
          <div className="mb-14 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionHeading id="offres-title" eyebrow="Accompagnements" title="Chaque chemin de retour à soi" accent="est unique." />
            <Reveal>
              <Link href="/offres" className="text-sm font-semibold text-plum-800 underline decoration-saffron-500 underline-offset-[6px]">
                Toutes les offres et les carnets
              </Link>
            </Reveal>
          </div>
          <OfferingList
            items={services.map((o) => ({
              slug: o.slug!,
              title: o.title,
              kicker: o.kicker,
              price: priceLabel(o),
              meta: [KIND_LABEL[o.kind], MODE_LABEL[o.mode ?? ''], durationLabel(o.durationMinutes)].filter(Boolean).join(' · '),
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

      {/* Testimonials */}
      <section className="py-28 lg:py-36" aria-labelledby="temoignages-title">
        <div className="container-x grid gap-14 lg:grid-cols-[0.35fr_1fr]">
          <Reveal>
            <p className="eyebrow text-saffron-600">Témoignages</p>
            <h2 id="temoignages-title" className="mt-4 text-4xl text-plum-800">Ce qu’ils ont <em className="text-saffron-600">ressenti</em></h2>
          </Reveal>
          <Testimonials items={testimonials.docs.map((t) => ({ id: t.id, quote: t.quote, highlight: t.highlight, name: t.name, context: t.context }))} />
        </div>
      </section>

      {/* Blog */}
      {posts.length > 0 && (
        <section className="bg-sand-50 py-28 lg:py-36" aria-labelledby="blog-title">
          <div className="container-x">
            <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <SectionHeading id="blog-title" eyebrow="Le blog" title="Carnets d’Inde" accent="et sagesse du quotidien" />
              <Link href="/blog" className="text-sm font-semibold text-plum-800 underline decoration-saffron-500 underline-offset-[6px]">Lire tous les articles</Link>
            </div>
            <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr_1fr]">
              {posts.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.08}>
                  <PostCard {...postCardProps(p)} large={i === 0} />
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
            <p className="eyebrow text-saffron-600">Tu es au bon endroit</p>
            <h2 className="mx-auto mt-6 max-w-4xl text-[clamp(2.6rem,6vw,5.2rem)] leading-[1] text-plum-800">
              On ne peut pas toujours changer ce qui arrive. <em className="text-saffron-600">On peut changer la manière d’y répondre.</em>
            </h2>
            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <Link href="/offres/consultation-decouverte" className="rounded-[2px] bg-plum-800 px-8 py-4 font-semibold text-sand-50 transition hover:bg-plum-700">Réserver un premier échange</Link>
              <Link href="/contact" className="rounded-[2px] border border-plum-800/25 px-8 py-4 font-semibold text-plum-800 transition hover:border-plum-800">Écrire à Eliane</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
