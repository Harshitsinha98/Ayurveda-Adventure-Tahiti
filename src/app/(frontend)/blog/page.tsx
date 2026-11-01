import type { Metadata } from 'next'
import Link from 'next/link'

import { Reveal } from '@/components/motion/primitives'
import { PageHero, PostCard } from '@/components/site/ui'
import { payloadClient } from '@/lib/payload'
import { listPosts, postCardProps } from '@/lib/queries'

export const revalidate = 120
export const metadata: Metadata = {
  title: 'Blog · carnets d’Inde et sagesse du quotidien',
  description: 'Articles d’Eliane sur l’Ayurveda, la méditation, la sagesse védique et ses carnets de voyage en Inde.',
}

type P = { searchParams: Promise<{ categorie?: string }> }

export default async function BlogPage({ searchParams }: P) {
  const { categorie } = await searchParams
  const payload = await payloadClient()
  const [posts, cats] = await Promise.all([listPosts(60, categorie), payload.find({ collection: 'categories', limit: 50, sort: 'title' })])
  const [first, ...rest] = posts

  return (
    <>
      <PageHero eyebrow="Le blog" title="Histoires," accent="pratiques et chemins d’Inde" intro="Des carnets écrits au fil des voyages, des clés d’Ayurveda pour le quotidien, et la sagesse des grandes traditions." />
      <section className="pb-28">
        <div className="container-x">
          <nav aria-label="Catégories" className="mb-12 flex flex-wrap gap-2">
            <Link href="/blog" className={`rounded-full px-4 py-2 text-sm font-semibold transition ${!categorie ? 'bg-plum-800 text-sand-50' : 'bg-sand-50 text-plum-800 hover:bg-plum-100'}`}>Tous</Link>
            {cats.docs.map((c) => (
              <Link key={c.id} href={`/blog?categorie=${c.slug}`} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${categorie === c.slug ? 'bg-plum-800 text-sand-50' : 'bg-sand-50 text-plum-800 hover:bg-plum-100'}`}>
                {c.title}
              </Link>
            ))}
          </nav>
          {!first && <p className="text-ink-soft">Aucun article dans cette catégorie pour le moment.</p>}
          {first && (
            <Reveal className="mb-20">
              <PostCard {...postCardProps(first)} large />
            </Reveal>
          )}
          <div className="grid gap-x-10 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 0.08}>
                <PostCard {...postCardProps(p)} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
