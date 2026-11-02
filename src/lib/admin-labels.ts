import type { I18nClient } from '@payloadcms/translations'

/**
 * Bilingual admin label helper.
 *
 * Payload's `StaticLabel` type accepts `Record<string, string>`, where the key
 * is the admin UI language code. Returning `{ fr, en }` lets Payload pick the
 * right string automatically when the user switches the interface language
 * (top-right of the admin header). Used for collection/global labels, field
 * labels, descriptions, group names and select-option labels.
 */
export const L = (fr: string, en: string): Record<string, string> => ({ fr, en })

/** A bilingual string pair, as produced by {@link L}. */
export type Bilingual = Record<string, string>

/**
 * Resolve a bilingual pair for the current admin language inside server
 * components (e.g. the dashboard), which receive an `i18n` prop rather than
 * letting Payload resolve the label for them.
 */
export const tr = (lang: string | undefined, pair: Bilingual): string =>
  pair[lang ?? 'fr'] ?? pair.fr ?? pair.en ?? ''

/** Convenience: read the active language from an `i18n` client prop. */
export const langOf = (i18n: Pick<I18nClient, 'language'> | undefined): string => i18n?.language ?? 'fr'
