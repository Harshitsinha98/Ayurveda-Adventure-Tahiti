/**
 * XPF has no minor unit (ISO 4217 exponent 0): 8 700 XPF is stored and sent as 8700.
 * Never multiply XPF amounts by 100.
 */
export const EUR_PER_XPF = 1 / 119.33

export const toXpfInt = (n: unknown): number => {
  const v = Math.round(Number(n))
  if (!Number.isFinite(v) || v < 0) throw new Error(`Montant invalide: ${String(n)}`)
  return v
}

const nf = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 })

export const formatXPF = (n?: number | null) => (n == null ? '' : `${nf.format(n)} XPF`)

export const formatEUR = (xpf?: number | null, lang: 'fr' | 'en' = 'fr') =>
  xpf == null ? '' : `${lang === 'en' ? 'approx.' : 'env.'} ${new Intl.NumberFormat(lang === 'en' ? 'en-GB' : 'fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(xpf * EUR_PER_XPF)}`

export const depositFor = (total: number, percent?: number | null) =>
  percent && percent > 0 && percent < 100 ? Math.round((total * percent) / 100) : total
