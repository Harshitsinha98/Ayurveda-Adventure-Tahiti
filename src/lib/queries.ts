import 'server-only'

import type { Where } from 'payload'

import { dictionaries, type Lang } from '@/i18n/dictionary'
import { formatXPF } from '@/lib/money'
import { img, payloadClient } from '@/lib/payload'
import { postPhoto } from '@/lib/photos'
import type { Occurrence, Offering, Package, Post } from '@/payload-types'

export const KIND_LABEL = dictionaries.fr.labels.kind
export const MODE_LABEL = dictionaries.fr.labels.mode
export const kindLabel = (k: string, lang: Lang = 'fr') => dictionaries[lang].labels.kind[k] ?? k
export const modeLabel = (m: string | null | undefined, lang: Lang = 'fr') => (m ? dictionaries[lang].labels.mode[m] : undefined)
const L = (lang: Lang) => ({ locale: lang, fallbackLocale: 'fr' as const })

export function priceLabel(o: Pick<Offering, 'price' | 'bookingMode' | 'priceOptions'>, lang: Lang = 'fr') {
  const d = dictionaries[lang].labels
  if (o.price === 0) return d.free
  if (o.price == null) return o.bookingMode === 'request' ? d.onQuote : null
  const min = Math.min(o.price, ...(o.priceOptions ?? []).map((p) => p.price))
  return `${o.priceOptions?.length ? `${d.from} ` : ''}${formatXPF(min)}`
}

export const durationLabel = (m?: number | null) => {
  if (!m) return null
  const h = Math.floor(m / 60)
  const r = m % 60
  return h ? `${h} h${r ? ` ${String(r).padStart(2, '0')}` : ''}` : `${r} min`
}

export async function listOfferings(where: Where = {}, lang: Lang = 'fr') {
  const payload = await payloadClient()
  const r = await payload.find({
    collection: 'offerings',
    where: { and: [{ published: { equals: true } }, where] },
    sort: 'order',
    limit: 100,
    depth: 1,
    ...L(lang),
  })
  return r.docs as Offering[]
}

export async function getOffering(slug: string, lang: Lang = 'fr') {
  const payload = await payloadClient()
  const r = await payload.find({ collection: 'offerings', where: { and: [{ slug: { equals: slug } }, { published: { equals: true } }] }, limit: 1, depth: 2, ...L(lang) })
  return r.docs[0] as Offering | undefined
}

export async function upcomingOccurrences(offeringId?: number | string, lang: Lang = 'fr') {
  const payload = await payloadClient()
  const r = await payload.find({
    collection: 'occurrences',
    where: {
      and: [
        { startsAt: { greater_than: new Date().toISOString() } },
        { status: { not_equals: 'cancelled' } },
        ...(offeringId ? [{ offering: { equals: offeringId } }] : []),
      ],
    },
    sort: 'startsAt',
    limit: 100,
    depth: 2,
    ...L(lang),
  })
  return (r.docs as Occurrence[]).filter((o) => typeof o.offering === 'object' && (o.offering as Offering).published)
}

export async function listPackages(lang: Lang = 'fr') {
  const payload = await payloadClient()
  const r = await payload.find({ collection: 'packages', where: { published: { equals: true } }, sort: 'order', depth: 0, ...L(lang) })
  return r.docs as Package[]
}

export async function listPosts(limit = 24, category?: string, lang: Lang = 'fr') {
  const payload = await payloadClient()
  const r = await payload.find({
    collection: 'posts',
    where: {
      and: [
        { _status: { equals: 'published' } },
        { publishedAt: { less_than_equal: new Date().toISOString() } },
        ...(category ? [{ 'categories.slug': { equals: category } }] : []),
      ],
    },
    sort: '-publishedAt',
    limit,
    depth: 1,
    ...L(lang),
  })
  return r.docs as Post[]
}

export const postCardProps = (p: Post) => ({
  href: `/blog/${p.slug}`,
  title: p.title,
  excerpt: p.excerpt,
  image: img(p.cover, 'card') ?? postPhoto(p.slug),
  date: p.publishedAt,
  category: (p.categories?.[0] as { title?: string } | undefined)?.title ?? null,
})

export { L as localeOpts }

export const seatsLeft = (o: Occurrence) => Math.max(0, (o.capacity ?? 0) - (o.seatsReserved ?? 0))
