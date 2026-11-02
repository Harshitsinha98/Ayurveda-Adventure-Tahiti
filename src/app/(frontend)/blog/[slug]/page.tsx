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
import { postPhoto } from '@/lib/photos'
import { dateLocale, type Lang } from '@/i18n/dictionary'
import { getT } from '@/i18n/server'
import { listPosts, localeOpts, postCardProps } from '@/lib/queries'
import type { Post } from '@/payload-types'

export const dynamic = 'force-dynamic'
type P = { params: Promise<{ slug: string }> }

async function getPost(slug: string, lang: Lang | 'fr' = 'fr') {
  const payload = await payloadClient()
  const { isEnabled: draft } = await draftMode()
  const r = await payload.find({
    collection: 'posts',
    where: draft ? { slug: { equals: slug } } : { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
    draft,
    limit: 1,
    depth: 1,
    ...localeOpts(lang),
  })
  return r.docs[0] as Post | undefined
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { lang } = await getT()
  const p = await getPost((await params).slug, lang)
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
  const { lang, t } = await getT()
  const post = await getPost(slug, lang)
  if (!post) notFound()
  const cover = img(post.cover, 'hero') ?? postPhoto(post.slug)
  // English body still identical to the French one: tell the reader the article is in French.
  const frOnly = lang === 'en' && JSON.stringify((await getPost(slug, 'fr'))?.content) === JSON.stringify(post.content)
  const more = (await listPosts(4, undefined, lang)).filter((p) => p.id !== post.id).slice(0, 3)
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
              {post.publishedAt && ` · ${new Date(post.publishedAt).toLocaleDateString(dateLocale(lang), { day: 'numeric', month: 'long', year: 'numeric' })}`}
              {post.readingMinutes ? ` · ${t.blog.minutes(post.readingMinutes)}` : ''}
            </p>
            <h1 className="mt-6 text-[clamp(2.6rem,6vw,5rem)] leading-[1] text-plum-800">{post.title}</h1>
            {post.excerpt && <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-soft">{post.excerpt}</p>}
          </Reveal>
        </div>
      </header>
      {cover && (
        <div className="container-x">
          <Reveal className="relative mx-auto aspect-[16/9] max-w-6xl overflow-hidden rounded-[3px]">
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
        <div lang={frOnly ? 'fr' : undefined}>
          {frOnly && <p lang="en" className="mb-8 border-l-2 border-saffron-500/60 pl-4 text-sm italic text-ink-soft">{t.blog.frenchOnly}</p>}
          <RichText data={post.content} />
          <div className="mt-14 border-t border-plum-800/10 pt-8 lg:hidden">
            <ShareButtons url={`${site}/blog/${post.slug}`} title={post.title} />
          </div>
          <div className="mt-14 rounded-[3px] bg-plum-800 p-8 text-sand-50">
            <p className="font-display text-3xl">{t.blog.more}</p>
            <p className="mt-2 text-sand-200/80">{t.blog.moreText}</p>
            <Link href="/offres/consultation-decouverte" className="mt-6 inline-block rounded-[2px] bg-saffron-500 px-6 py-3 text-sm font-semibold text-plum-950 hover:bg-saffron-300">{t.blog.moreCta}</Link>
          </div>
        </div>
      </div>
      {more.length > 0 && (
        <section className="bg-sand-50 py-20">
          <div className="container-x">
            <p className="eyebrow mb-10 text-saffron-600">{t.blog.alsoRead}</p>
            <div className="grid gap-10 md:grid-cols-3">
              {more.map((p) => (
                <PostCard key={p.id} {...postCardProps(p)} lang={lang} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  )
}
