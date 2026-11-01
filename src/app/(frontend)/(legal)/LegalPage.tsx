import { RichText } from '@/components/site/RichText'

export function LegalPage({ title, data, fallback }: { title: string; data?: unknown; fallback: React.ReactNode }) {
  const hasContent = Boolean(data && (data as { root?: { children?: unknown[] } }).root?.children?.length)
  return (
    <section className="pb-28 pt-[140px] lg:pt-[170px]">
      <div className="container-x max-w-3xl">
        <h1 className="text-[clamp(2.6rem,6vw,4.4rem)] text-plum-800">{title}</h1>
        <div className="prose-at mt-10">{hasContent ? <RichText data={data} className="" /> : fallback}</div>
      </div>
    </section>
  )
}
