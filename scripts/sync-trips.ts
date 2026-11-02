/**
 * Refreshes the text of the existing journeys (FR + EN) from scripts/seed-data.ts:
 * description, itinerary, included / not included, highlights and extra sections.
 * Prices, dates, photos, booking settings and seats are left untouched.
 *
 * One-off: anything Eliane has since edited in the dashboard for these fields is overwritten.
 * Usage: DATABASE_URI=… npm run sync:trips
 */
import { getPayload } from 'payload'

import config from '../src/payload.config'
import { i18nEn, trips } from './seed-data'

type Doc = Record<string, unknown>
const para = (text: string) => ({ type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0, children: [{ type: 'text', text, format: 0, style: '', mode: 'normal', detail: 0, version: 1 }] })
const richText = (ps: string[]) => ({ root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr', children: ps.map(para) } })
const content = (t: Doc) => ({
  title: t.title,
  kicker: t.kicker,
  summary: t.summary,
  tripRegion: t.tripRegion,
  guide: t.guide,
  priceNote: t.priceNote,
  description: richText((t.body as string[]) ?? []),
  highlights: ((t.highlights as string[]) ?? []).map((text) => ({ text })),
  itinerary: ((t.itinerary as string[][]) ?? []).map(([day, title, text]) => ({ day, title, text })),
  included: ((t.included as string[]) ?? []).map((text) => ({ text })),
  notIncluded: ((t.notIncluded as string[]) ?? []).map((text) => ({ text })),
  sections: ((t.sections as { title: string; text?: string; items?: string[] }[]) ?? []).map((x) => ({ title: x.title, text: x.text, items: (x.items ?? []).map((text) => ({ text })) })),
})

const payload = await getPayload({ config })
for (const t of trips as Doc[]) {
  const r = await payload.find({ collection: 'offerings', where: { slug: { equals: t.slug } }, limit: 1, depth: 0 })
  const doc = r.docs[0]
  if (!doc) {
    console.log('absent, ignoré :', t.slug)
    continue
  }
  await payload.update({ collection: 'offerings', id: doc.id, locale: 'fr', data: content(t) as never })
  const en = i18nEn.trips[t.slug as string] as Doc | undefined
  if (en) await payload.update({ collection: 'offerings', id: doc.id, locale: 'en', data: content({ ...t, ...en }) as never })
  console.log('mis à jour :', t.slug, `(${(t.itinerary as unknown[]).length} jours, ${((t.sections as unknown[]) ?? []).length} rubrique(s))`)
}
process.exit(0)
