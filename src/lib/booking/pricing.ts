import { depositFor, toXpfInt } from '@/lib/money'

export type OfferingPricing = {
  title: string
  price?: number | null
  priceOptions?: Array<{ label: string; price: number }> | null
  extras?: Array<{ label: string; price: number }> | null
  depositPercent?: number | null
  maxPerBooking?: number | null
}

export type Line = { label: string; unitPrice: number; quantity: number }

/** Server-side price calculation. Never trust amounts sent by the browser. */
export function priceBooking(
  o: OfferingPricing,
  input: { quantity: number; priceOption?: number | null; extras?: number[] | null; priceOverride?: number | null },
) {
  const max = Math.max(1, o.maxPerBooking ?? 1)
  const quantity = Math.min(Math.max(1, Math.floor(input.quantity || 1)), max)
  const opt = input.priceOption != null ? o.priceOptions?.[input.priceOption] : undefined
  if (input.priceOption != null && !opt) throw new Error('Tarif inconnu')
  const unit = toXpfInt(opt ? opt.price : (input.priceOverride ?? o.price ?? 0))
  const lines: Line[] = [{ label: opt ? `${o.title} · ${opt.label}` : o.title, unitPrice: unit, quantity }]
  const extras = Array.from(new Set(input.extras ?? []))
  for (const i of extras) {
    const e = o.extras?.[i]
    if (!e) throw new Error('Option inconnue')
    lines.push({ label: e.label, unitPrice: toXpfInt(e.price), quantity })
  }
  const total = lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0)
  const dueNow = depositFor(total, o.depositPercent)
  return { quantity, lines, total, dueNow, isDeposit: dueNow < total }
}
