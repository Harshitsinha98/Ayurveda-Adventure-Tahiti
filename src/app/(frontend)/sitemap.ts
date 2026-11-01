import type { MetadataRoute } from 'next'

import { listOfferings, listPosts } from '@/lib/queries'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
  const [offerings, posts] = await Promise.all([listOfferings(), listPosts(500)])
  const fixed = ['', '/offres', '/voyage-en-inde', '/evenements', '/blog', '/a-propos', '/contact', '/mentions-legales', '/cgv', '/confidentialite']
  return [
    ...fixed.map((p) => ({ url: `${base}${p}`, changeFrequency: 'weekly' as const, priority: p === '' ? 1 : 0.7 })),
    ...offerings.map((o) => ({
      url: `${base}${o.kind === 'voyage' ? '/voyage-en-inde' : '/offres'}/${o.slug}`,
      lastModified: o.updatedAt,
      priority: 0.8,
    })),
    ...posts.map((p) => ({ url: `${base}/blog/${p.slug}`, lastModified: p.updatedAt, priority: 0.6 })),
  ]
}
