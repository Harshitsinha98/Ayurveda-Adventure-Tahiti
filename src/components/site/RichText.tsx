import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'

export function RichText({ data, className = 'prose-at' }: { data?: unknown; className?: string }) {
  if (!data || typeof data !== 'object' || !(data as { root?: unknown }).root) return null
  return <LexicalRichText data={data as SerializedEditorState} className={className} />
}

/** Plain text of a lexical document (for meta descriptions). */
export function lexicalToText(data: unknown, max = 160) {
  const out: string[] = []
  const walk = (n: unknown) => {
    if (!n || typeof n !== 'object') return
    const node = n as { text?: string; children?: unknown[] }
    if (node.text) out.push(node.text)
    node.children?.forEach(walk)
  }
  walk((data as { root?: unknown })?.root)
  const s = out.join(' ').replace(/\s+/g, ' ').trim()
  return s.length > max ? `${s.slice(0, max).replace(/\s+\S*$/, '')}…` : s
}
