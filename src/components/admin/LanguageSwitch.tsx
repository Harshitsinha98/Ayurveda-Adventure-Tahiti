'use client'

import { useTranslation } from '@payloadcms/ui'

/**
 * FR / EN interface-language switch, shown in the admin header (top-right).
 *
 * This changes the admin UI language. Because every collection, global and
 * field label is now bilingual ({ fr, en }), switching here translates the
 * whole back office — not just Payload's built-in buttons.
 */
export function LanguageSwitch() {
  const { i18n, languageOptions, switchLanguage } = useTranslation()
  const current = i18n?.language ?? 'fr'

  // Keep it to FR / EN (the two languages this project supports).
  const options = (languageOptions ?? []).filter((o) => o.value === 'fr' || o.value === 'en')
  if (!switchLanguage || options.length < 2) return null

  return (
    <div className="at-lang" role="group" aria-label="Language">
      {options.map((o) => {
        const active = o.value === current
        return (
          <button
            key={o.value}
            type="button"
            className={`at-lang__btn${active ? ' at-lang__btn--active' : ''}`}
            aria-pressed={active}
            onClick={() => {
              if (!active) void switchLanguage(o.value)
            }}
          >
            {o.value.toUpperCase()}
          </button>
        )
      })}
    </div>
  )
}
