import 'server-only'

import type { Where } from 'payload'

import { formatXPF } from '@/lib/money'
import { img, payloadClient } from '@/lib/payload'
import { postPhoto } from '@/lib/photos'
import type { Occurrence, Offering, Package, Post } from '@/payload-types'

export const KIND_LABEL: Record<string, string> = {
  seance: 'Séance individuelle',
  formation: 'Formation',
  atelier: 'Atelier',
  conference: 'Conférence',
  voyage: 'Voyage',
}
export const MODE_LABEL: Record<string, string> = {
  presentiel: 'À Punaauia',
  'en-ligne': 'En ligne',
  hybride: 'En ligne ou à Punaauia',
  etranger: 'En Inde',
}

export function priceLabel(o: Pick<Offering, 'price' | 'bookingMode' | 'priceOptions'>) {
  if (o.price === 0) return 'Offert'
  if (o.price == null) return o.bookingMode === 'request' ? 'Sur devis' : null
  const min = Math.min(o.price, ...(o.priceOptions ?? []).map((p) => p.price))
  return `${o.priceOptions?.length ? 'dès ' : ''}${formatXPF(min)}`
}

export const durationLabel = (m?: number | null) => {
  if (!m) return null
  const h = Math.floor(m / 60)
  const r = m % 60
  return h ? `${h} h${r ? ` ${String(r).padStart(2, '0')}` : ''}` : `${r} min`
}

export async function listOfferings(where: Where = {}) {
  const payload = await payloadClient()
  const r = await payload.find({
    collection: 'offerings',
    where: { and: [{ published: { equals: true } }, where] },
    sort: 'order',
    limit: 100,
    depth: 1,
  })
  return r.docs as Offering[]
}

export async function getOffering(slug: string) {
  const payload = await payloadClient()
  const r = await payload.find({ collection: 'offerings', where: { and: [{ slug: { equals: slug } }, { published: { equals: true } }] }, limit: 1, depth: 2 })
  return r.docs[0] as Offering | undefined
}

export async function upcomingOccurrences(offeringId?: number | string) {
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
  })
  return (r.docs as Occurrence[]).filter((o) => typeof o.offering === 'object' && (o.offering as Offering).published)
}

export async function listPackages() {
  const payload = await payloadClient()
  const r = await payload.find({ collection: 'packages', where: { published: { equals: true } }, sort: 'order', depth: 0 })
  return r.docs as Package[]
}

export async function listPosts(limit = 24, category?: string) {
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

export const seatsLeft = (o: Occurrence) => Math.max(0, (o.capacity ?? 0) - (o.seatsReserved ?? 0))
