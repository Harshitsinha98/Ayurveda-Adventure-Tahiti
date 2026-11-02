import type { Metadata } from 'next'
import Link from 'next/link'

import { Reveal } from '@/components/motion/primitives'
import { PageHero, PostCard } from '@/components/site/ui'
import { payloadClient } from '@/lib/payload'
import { getT } from '@/i18n/server'
import { listPosts, localeOpts, postCardProps } from '@/lib/queries'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT()
  return { title: t.blog.metaTitle, description: t.blog.metaDesc, alternates: { canonical: '/blog' } }
}

type P = { searchParams: Promise<{ categorie?: string }> }

export default async function BlogPage({ searchParams }: P) {
  const { categorie } = await searchParams
  const { lang, t } = await getT()
  const payload = await payloadClient()
  const [posts, cats] = await Promise.all([listPosts(60, categorie, lang), payload.find({ collection: 'categories', limit: 50, sort: 'title', ...localeOpts(lang) })])
  const [first, ...rest] = posts

  return (
    <>
      <PageHero eyebrow={t.blog.eyebrow} title={t.blog.title} accent={t.blog.accent} intro={t.blog.intro} />
      <section className="pb-28">
        <div className="container-x">
          <nav aria-label={t.blog.categories} className="mb-12 flex flex-wrap gap-2">
            <Link href="/blog" className={`rounded-[2px] px-4 py-2 text-sm font-semibold transition ${!categorie ? 'bg-plum-800 text-sand-50' : 'bg-sand-50 text-plum-800 hover:bg-plum-100'}`}>{t.blog.all}</Link>
            {cats.docs.map((c) => (
              <Link key={c.id} href={`/blog?categorie=${c.slug}`} className={`rounded-[2px] px-4 py-2 text-sm font-semibold transition ${categorie === c.slug ? 'bg-plum-800 text-sand-50' : 'bg-sand-50 text-plum-800 hover:bg-plum-100'}`}>
                {c.title}
              </Link>
            ))}
          </nav>
          {!first && <p className="text-ink-soft">{t.blog.none}</p>}
          {first && (
            <Reveal className="mb-20">
              <PostCard {...postCardProps(first)} lang={lang} large />
            </Reveal>
          )}
          <div className="grid gap-x-10 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 0.08}>
                <PostCard {...postCardProps(p)} lang={lang} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
