/**
 * Seeds the database with the content migrated from the Wix site.
 * Usage: npm run seed   (safe to run again: existing slugs are skipped)
 * Creates an admin user from SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD if set.
 * SEED_SKIP_MEDIA=1 skips image uploads (when the target has no Vercel Blob storage).
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import config from '@payload-config'
import { getPayload, type Payload } from 'payload'

import { about, categories, home, i18nEn, offerings, packages, postSlugs, testimonials, trips } from './seed-data'

type Doc = Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any

const dir = path.dirname(fileURLToPath(import.meta.url))
const IMG = path.resolve(dir, '../seed/images')

// ---------- Lexical helpers ----------
const text = (t: string) => ({ type: 'text', text: t, format: 0, detail: 0, mode: 'normal', style: '', version: 1 })
const para = (t: string) => ({ type: 'paragraph', children: [text(t)], direction: 'ltr', format: '', indent: 0, version: 1, textFormat: 0, textStyle: '' })
const heading = (t: string, tag = 'h2') => ({ type: 'heading', tag, children: [text(t)], direction: 'ltr', format: '', indent: 0, version: 1 })
const root = (children: unknown[]) => ({ root: { type: 'root', children, direction: 'ltr', format: '', indent: 0, version: 1 } })
const richText = (paragraphs: string[]) => root(paragraphs.map((p) => para(p)))

const listItem = (t: string, value: number) => ({ type: 'listitem', value, children: [text(t)], direction: 'ltr', format: '', indent: 0, version: 1 })
const list = (items: string[]) => ({ type: 'list', listType: 'bullet', tag: 'ul', start: 1, children: items.map((t, i) => listItem(t, i + 1)), direction: 'ltr', format: '', indent: 0, version: 1 })

/** Wix paragraphs → Lexical: numbered titles become headings, short lines after "… :" become a bullet list. */
function postToLexical(paras: string[]) {
  const out: unknown[] = []
  let pending: string[] | null = null
  const flush = () => {
    if (pending?.length) out.push(list(pending))
    pending = null
  }
  for (const raw of paras) {
    const p = raw.replace(/\u00a0/g, ' ').trim()
    if (!p || /^Dernière mise à jour/.test(p)) continue
    if (/^\d+\.\s+\S/.test(p) && p.length < 90) {
      flush()
      out.push(heading(p))
      continue
    }
    if (pending && p.length < 90 && !/[.!?]$/.test(p) && !/:/.test(p)) {
      pending.push(p)
      continue
    }
    flush()
    out.push(para(p))
    if (/:\s*$/.test(p) && p.length < 60) pending = []
  }
  flush()
  return root(out)
}

// ---------- Media ----------
const mediaCache = new Map<string, number | string>()
const SKIP_MEDIA = process.env.SEED_SKIP_MEDIA === '1'
async function media(payload: Payload, name: string, alt: string) {
  // Production without Vercel Blob: keep CMS images empty so the site uses its bundled photos.
  if (SKIP_MEDIA) return undefined
  if (mediaCache.has(name)) return mediaCache.get(name)!
  const filename = `${name}.jpg`
  const existing = await payload.find({ collection: 'media', where: { filename: { equals: filename } }, limit: 1 })
  if (existing.docs[0]) {
    mediaCache.set(name, existing.docs[0].id)
    return existing.docs[0].id
  }
  const filePath = path.join(IMG, filename)
  if (!fs.existsSync(filePath)) throw new Error(`Image manquante: ${filePath}`)
  const doc = await payload.create({ collection: 'media', data: { alt }, filePath })
  mediaCache.set(name, doc.id)
  return doc.id
}

const ALT: Record<string, string> = {
  'moorea-coucher-soleil': 'Coucher de soleil sur le lagon de Moorea, cocotiers en ombre chinoise',
  'eliane-gange': 'Eliane au bord du Gange, dans l’Himalaya',
  'bouddha-bougie': 'Statue de Bouddha et bougie allumée',
  'puja-gange': 'Offrandes de fleurs lors d’une puja au bord du Gange',
  'puja-rituel': 'Rituel védique au bord du fleuve',
  'eliane-portrait': 'Portrait d’Eliane, mala de rudraksha',
  'himalaya-marche': 'Marche sur un sentier de l’Himalaya',
  'eliane-rishikesh': 'Eliane dans un ashram de Rishikesh',
  'eliane-himalaya': 'Eliane devant les sommets enneigés de l’Himalaya',
  autel: 'Petit autel avec Ganesh et portraits de maîtres',
  'salle-punaauia': 'L’espace de pratique à Punaauia',
  'formation-groupe': 'Formation Ayurveda en petit groupe',
  anatomie: 'Présentation projetée pendant une conférence',
  'meditation-groupe': 'Méditation en groupe sur tapis',
  notes: 'Prise de notes pendant un suivi personnalisé',
  epices: 'Sacs d’épices et de plantes ayurvédiques au marché',
  'kumbh-bain': 'Bain sacré dans le Gange pendant la Kumbha Mela',
  'kumbh-sadhus': 'Sadhus à la Kumbha Mela',
  'kumbh-foule': 'Procession à la Kumbha Mela',
  'kumbh-carte': 'Carte de l’itinéraire du voyage Kumbha Mela',
  'sadhu-benediction': 'Un sadhu donne sa bénédiction',
  'ladakh-monastere': 'Moines dans la cour d’un monastère du Ladakh',
  'ladakh-village': 'Monastère de Key perché dans la vallée',
  'ladakh-dunes': 'Dunes de la vallée de la Nubra au pied de l’Himalaya',
  'ladakh-montagnes': 'Routes en lacets dans les montagnes du Ladakh',
  'ladakh-enfants': 'Enfants ladakhis souriants',
  'ladakh-bouddha': 'Statue dorée dans un monastère bouddhiste',
  'ladakh-ancienne': 'Une ancienne du Ladakh avec un moulin à prières',
  'taj-mahal': 'Eliane devant le Taj Mahal',
  'badge-chopra': 'Certification Chopra Ayurvedic Health Instructor',
}

async function upsert(payload: Payload, collection: 'offerings' | 'packages' | 'posts' | 'categories', slug: string, data: Doc) {
  const r = await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1, depth: 0, draft: true } as never)
  if ((r as { docs: Doc[] }).docs[0]) return (r as { docs: Doc[] }).docs[0]
  return payload.create({ collection, data: { ...data, slug } as never })
}

const tripSections = (t: Doc) =>
  ((t.sections ?? []) as { title: string; text?: string; items?: string[] }[]).map((x) => ({ title: x.title, text: x.text, items: (x.items ?? []).map((text) => ({ text })) }))

async function run() {
  const payload = await getPayload({ config })
  const m = (n: string) => media(payload, n, ALT[n] || n)

  if (process.env.SEED_ADMIN_EMAIL && process.env.SEED_ADMIN_PASSWORD) {
    const u = await payload.find({ collection: 'users', where: { email: { equals: process.env.SEED_ADMIN_EMAIL } }, limit: 1 })
    if (!u.docs[0])
      await payload.create({
        collection: 'users',
        data: { email: process.env.SEED_ADMIN_EMAIL, password: process.env.SEED_ADMIN_PASSWORD, name: 'Administrateur', role: 'admin' },
      })
  }

  // Globals
  await payload.updateGlobal({
    slug: 'home',
    data: {
      eyebrow: home.eyebrow,
      headline: home.headline.map((line) => ({ line })),
      intro: home.intro,
      heroImage: await m('moorea-coucher-soleil'),
      manifesto: home.manifesto,
      manifestoAside: home.manifestoAside,
      ritual: { ...home.ritual, image: await m('puja-gange') },
      pillars: home.pillars,
    } as never,
  })
  await payload.updateGlobal({
    slug: 'about',
    data: {
      title: about.title,
      lead: about.lead,
      portrait: await m('eliane-portrait'),
      body: richText(about.paragraphs),
      chapters: await Promise.all(about.chapters.map(async (c) => ({ place: c.place, text: c.text, image: 'image' in c && c.image ? await m(c.image) : undefined }))),
      credentials: [
        { title: 'Chopra Ayurvedic Health Instructor', badge: await m('badge-chopra') },
        { title: 'Chopra Meditation Instructor (Primordial Sound)' },
        { title: 'Master 1 · Langues, Cultures et Sociétés Océaniennes' },
      ],
    } as never,
  })
  const settings = (await payload.findGlobal({ slug: 'booking-settings' })) as Doc
  if (!settings.weekly?.length) {
    // TODO(Eliane): horaires réels à confirmer
    await payload.updateGlobal({
      slug: 'booking-settings',
      data: {
        weekly: ['lun', 'mar', 'mer', 'jeu', 'ven'].flatMap((day) => [
          { day, start: '08:00', end: '12:00' },
          { day, start: '14:00', end: '18:00' },
        ]).concat([{ day: 'sam', start: '08:00', end: '12:00' }]),
        minNoticeHours: 24,
        horizonDays: 60,
        bufferMinutes: 15,
        stepMinutes: 30,
        holdMinutes: 20,
        reminderHours: 24,
        cancelHours: 24,
      } as never,
    })
  }

  // Testimonials
  for (const [i, t] of testimonials.entries()) {
    const r = await payload.find({ collection: 'testimonials', where: { name: { equals: t.name } }, limit: 1 })
    if (!r.docs[0]) await payload.create({ collection: 'testimonials', data: { ...t, order: i } })
  }

  // Offerings
  const offeringIds: Record<string, number | string> = {}
  for (const o of offerings) {
    const { body, image, gallery, ...rest } = o as Doc
    const doc = await upsert(payload, 'offerings', o.slug, {
      ...rest,
      description: richText(body ?? []),
      image: image ? await m(image) : undefined,
      gallery: gallery && !SKIP_MEDIA ? await Promise.all((gallery as string[]).map(async (g) => ({ image: await m(g) }))) : undefined,
      published: true,
    })
    offeringIds[o.slug] = doc.id
  }
  for (const t of trips) {
    const { body, image, gallery, itinerary, included, notIncluded, highlights, capacity, sections: _s, ...rest } = t as Doc
    const doc = await upsert(payload, 'offerings', t.slug, {
      ...rest,
      kind: 'voyage',
      mode: 'etranger',
      description: richText(body ?? []),
      image: await m(image),
      gallery: SKIP_MEDIA ? [] : await Promise.all((gallery as string[]).map(async (g) => ({ image: await m(g) }))),
      itinerary: (itinerary as string[][]).map(([day, title, text]) => ({ day, title, text })),
      included: (included as string[]).map((text) => ({ text })),
      notIncluded: (notIncluded as string[]).map((text) => ({ text })),
      highlights: (highlights as string[]).map((text) => ({ text })),
      sections: tripSections(t as Doc),
      cancellationPolicy:
        'Conditions d’annulation du voyage : voir les conditions générales de vente. Merci de souscrire une assurance voyage.',
      published: true,
    })
    offeringIds[t.slug] = doc.id
    if (capacity) {
      const occ = await payload.find({ collection: 'occurrences', where: { offering: { equals: doc.id } }, limit: 1 })
      if (!occ.docs[0])
        await payload.create({
          collection: 'occurrences',
          data: {
            offering: doc.id,
            startsAt: new Date(`${t.tripStart}T08:00:00-10:00`).toISOString(),
            endsAt: new Date(`${t.tripEnd}T18:00:00-10:00`).toISOString(),
            capacity,
            status: 'open',
          } as never,
        })
    }
  }

  // Packages
  const seanceIds = ['seance-individuelle-en-ligne', 'seance-individuelle-presentiel', 'suivi-personnalise'].map((s) => offeringIds[s])
  for (const p of packages) await upsert(payload, 'packages', p.slug, { ...p, appliesTo: seanceIds, published: true })

  // Blog
  const catIds: Record<string, number | string> = {}
  for (const c of categories) {
    const d = await upsert(payload, 'categories', c.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '-'), { title: c })
    catIds[c] = d.id
  }
  const posts = JSON.parse(fs.readFileSync(path.resolve(dir, '../seed/posts.json'), 'utf8')) as Record<string, Doc>
  for (const [oldPath, p] of Object.entries(posts)) {
    const meta = postSlugs[oldPath]
    if (!meta) continue
    const coverName = String(p.cover).replace(/\.jpg$/, '')
    const paras: string[] = p.paras
    const title = String(p.title).replace(/\s*\|.*$/, '').trim()
    const excerpt = paras.find((x: string) => x.length > 90 && !/^Dernière/.test(x))?.slice(0, 220)
    await upsert(payload, 'posts', meta.slug, {
      title,
      excerpt: excerpt ? `${excerpt.replace(/\s+\S*$/, '')}…` : undefined,
      cover: await media(payload, coverName, `Illustration · ${title}`),
      content: postToLexical(paras.filter((x: string) => x.trim() !== title)),
      publishedAt: p.date,
      categories: [catIds[meta.category]],
      _status: 'published',
    })
  }

  // ---------- English locale ----------
  const EN = { locale: 'en' as const }
  const homeFr = (await payload.findGlobal({ slug: 'home', depth: 0 })) as Doc
  await payload.updateGlobal({
    slug: 'home',
    ...EN,
    data: {
      eyebrow: i18nEn.home.eyebrow,
      headline: i18nEn.home.headline.map((line) => ({ line })),
      intro: i18nEn.home.intro,
      manifesto: i18nEn.home.manifesto,
      manifestoAside: i18nEn.home.manifestoAside,
      ritual: { ...i18nEn.home.ritual, image: homeFr.ritual?.image },
      pillars: i18nEn.home.pillars,
    } as never,
  })
  const aboutFr = (await payload.findGlobal({ slug: 'about', depth: 0 })) as Doc
  await payload.updateGlobal({
    slug: 'about',
    ...EN,
    data: {
      lead: i18nEn.about.lead,
      body: richText(i18nEn.about.paragraphs),
      chapters: (aboutFr.chapters ?? []).map((c: Doc, i: number) => ({ ...c, ...i18nEn.about.chapters[i] })),
      credentials: (aboutFr.credentials ?? []).map((c: Doc, i: number) => ({ ...c, title: i18nEn.about.credentials[i] ?? c.title })),
    } as never,
  })
  for (const tt of i18nEn.testimonials) {
    const r = await payload.find({ collection: 'testimonials', where: { name: { equals: tt.name } }, limit: 1 })
    if (r.docs[0]) await payload.update({ collection: 'testimonials', id: r.docs[0].id, ...EN, data: tt as never })
  }
  for (const [slug, o] of Object.entries(i18nEn.offerings)) {
    const id = offeringIds[slug]
    if (!id) continue
    const { body, ...rest } = o
    await payload.update({ collection: 'offerings', id, ...EN, data: { ...rest, description: richText(body) } as never })
  }
  for (const [slug, o] of Object.entries(i18nEn.trips)) {
    const id = offeringIds[slug]
    if (!id) continue
    const fr = (await payload.findByID({ collection: 'offerings', id, depth: 0 })) as Doc
    const { body, itinerary, included, notIncluded, highlights, extras, sections, ...rest } = o as Doc
    await payload.update({
      collection: 'offerings',
      id,
      ...EN,
      data: {
        ...rest,
        description: richText(body ?? []),
        itinerary: (itinerary as string[][]).map(([day, title, text]) => ({ day, title, text })),
        included: (included as string[]).map((text) => ({ text })),
        notIncluded: (notIncluded as string[]).map((text) => ({ text })),
        highlights: (highlights as string[]).map((text) => ({ text })),
        sections: tripSections({ sections }),
        ...(extras ? { extras: (fr.extras ?? []).map((x: Doc, i: number) => ({ ...x, label: (extras as string[])[i] ?? x.label })) } : {}),
      } as never,
    })
  }
  for (const [slug, p] of Object.entries(i18nEn.packages)) {
    const r = await payload.find({ collection: 'packages', where: { slug: { equals: slug } }, limit: 1 })
    if (r.docs[0]) await payload.update({ collection: 'packages', id: r.docs[0].id, ...EN, data: p as never })
  }
  for (const [fr, enTitle] of Object.entries(i18nEn.categories)) {
    if (catIds[fr]) await payload.update({ collection: 'categories', id: catIds[fr], ...EN, data: { title: enTitle } })
  }
  for (const [slug, p] of Object.entries(i18nEn.posts)) {
    const r = await payload.find({ collection: 'posts', where: { slug: { equals: slug } }, limit: 1, draft: true })
    if (r.docs[0]) await payload.update({ collection: 'posts', id: r.docs[0].id, ...EN, data: { ...p, content: (r.docs[0] as Doc).content, _status: 'published' } as never })
  }

  payload.logger.info('Seed terminé ✓')
  process.exit(0)
}

try {
  await run()
} catch (e) {
  console.error(e)
  process.exit(1)
}
