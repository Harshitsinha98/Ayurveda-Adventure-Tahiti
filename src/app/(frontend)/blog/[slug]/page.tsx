import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ReadingProgress } from '@/components/blog/ReadingProgress'
import { ShareButtons } from '@/components/blog/ShareButtons'
import { Reveal } from '@/components/motion/primitives'
import { lexicalToText, RichText } from '@/components/site/RichText'
import { PostCard } from '@/components/site/ui'
import { img, payloadClient } from '@/lib/payload'
import { listPosts, postCardProps } from '@/lib/queries'
import type { Post } from '@/payload-types'

export const revalidate = 120
type P = { params: Promise<{ slug: string }> }

async function getPost(slug: string) {
  const payload = await payloadClient()
  const { isEnabled: draft } = await draftMode()
  const r = await payload.find({
    collection: 'posts',
    where: draft ? { slug: { equals: slug } } : { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
    draft,
    limit: 1,
    depth: 1,
  })
  return r.docs[0] as Post | undefined
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const p = await getPost((await params).slug)
  if (!p) return {}
  const og = img(p.seo?.image ?? p.cover, 'card')
  return {
    title: p.seo?.title || p.title,
    description: p.seo?.description || p.excerpt || lexicalToText(p.content),
    openGraph: { type: 'article', publishedTime: p.publishedAt ?? undefined, images: og ? [{ url: og.url }] : undefined },
    alternates: { canonical: `/blog/${p.slug}` },
  }
}

export default async function PostPage({ params }: P) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()
  const cover = img(post.cover, 'hero')
  const more = (await listPosts(4)).filter((p) => p.id !== post.id).slice(0, 3)
  const site = process.env.NEXT_PUBLIC_SITE_URL || ''
  const cat = (post.categories?.[0] as { title?: string } | undefined)?.title

  return (
    <article>
      <ReadingProgress />
      <header className="pb-12 pt-[140px] lg:pt-[170px]">
        <div className="container-x max-w-4xl text-center">
          <Reveal>
            <p className="eyebrow text-saffron-600">
              {cat}
              {post.publishedAt && ` · ${new Date(post.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`}
              {post.readingMinutes ? ` · ${post.readingMinutes} min de lecture` : ''}
            </p>
            <h1 className="mt-6 text-[clamp(2.6rem,6vw,5rem)] leading-[1] text-plum-800">{post.title}</h1>
            {post.excerpt && <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-soft">{post.excerpt}</p>}
          </Reveal>
        </div>
      </header>
      {cover && (
        <div className="container-x">
          <Reveal className="relative mx-auto aspect-[16/9] max-w-6xl overflow-hidden rounded-[32px]">
            <Image src={cover.url} alt={cover.alt} fill priority sizes="(min-width:1280px) 1200px, 100vw" className="object-cover" />
          </Reveal>
        </div>
      )}
      <div className="container-x grid max-w-6xl gap-12 py-16 lg:grid-cols-[1fr_minmax(0,680px)_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-32">
            <ShareButtons url={`${site}/blog/${post.slug}`} title={post.title} />
          </div>
        </aside>
        <div>
          <RichText data={post.content} />
          <div className="mt-14 border-t border-plum-800/10 pt-8 lg:hidden">
            <ShareButtons url={`${site}/blog/${post.slug}`} title={post.title} />
          </div>
          <div className="mt-14 rounded-[28px] bg-plum-800 p-8 text-sand-50">
            <p className="font-display text-3xl">Envie d’aller plus loin ?</p>
            <p className="mt-2 text-sand-200/80">Un premier échange offert de 20 minutes pour faire connaissance.</p>
            <Link href="/offres/consultation-decouverte" className="mt-6 inline-block rounded-full bg-saffron-500 px-6 py-3 text-sm font-semibold text-plum-950 hover:bg-saffron-300">Réserver</Link>
          </div>
        </div>
      </div>
      {more.length > 0 && (
        <section className="bg-sand-50 py-20">
          <div className="container-x">
            <p className="eyebrow mb-10 text-saffron-600">À lire aussi</p>
            <div className="grid gap-10 md:grid-cols-3">
              {more.map((p) => (
                <PostCard key={p.id} {...postCardProps(p)} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  )
}
