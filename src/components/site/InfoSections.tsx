import { Check } from 'lucide-react'

import { Reveal } from '@/components/motion/primitives'

type Section = { id?: string | null; title: string; text?: string | null; items?: { id?: string | null; text: string }[] | null }

/** Free content blocks Eliane adds in the dashboard ("Rubriques supplémentaires"): title, paragraphs, bullet list. */
export function InfoSections({ sections, tone = 'light', columns = 2 }: { sections?: Section[] | null; tone?: 'light' | 'sand'; columns?: 1 | 2 }) {
  if (!sections?.length) return null
  return (
    <div className={`grid gap-x-16 ${columns === 2 ? 'gap-y-14 md:grid-cols-2' : 'gap-y-6'}`}>
      {sections.map((s, i) => (
        <Reveal key={s.id ?? i} delay={(i % 2) * 0.08} className={tone === 'sand' ? 'rounded-[3px] bg-sand-50 p-8 lg:p-10' : ''}>
          <h3 className="font-display text-[clamp(1.8rem,3vw,2.6rem)] leading-tight text-plum-800">{s.title}</h3>
          {s.text
            ?.split(/\n\s*\n/)
            .map((p) => p.trim())
            .filter(Boolean)
            .map((p, k) => (
              <p key={k} className="mt-4 whitespace-pre-line leading-relaxed text-ink-soft">
                {p}
              </p>
            ))}
          {(s.items?.length ?? 0) > 0 && (
            <ul className="mt-6 space-y-3">
              {s.items!.map((x, k) => (
                <li key={x.id ?? k} className="flex gap-3 text-ink">
                  <Check size={18} className="mt-1 shrink-0 text-saffron-600" />
                  {x.text}
                </li>
              ))}
            </ul>
          )}
        </Reveal>
      ))}
    </div>
  )
}
