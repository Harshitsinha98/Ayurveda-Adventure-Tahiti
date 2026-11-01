import { addDays, addMinutes } from 'date-fns'
import type { Payload } from 'payload'

import { atTahiti, tahitiDateKey, tahitiWeekday } from '@/lib/time'

export type WeeklyRule = { day: string; start: string; end: string }
export type BlockedRange = { from: string; to?: string | null; reason?: string | null }
export type BookingSettings = {
  weekly?: WeeklyRule[] | null
  blocked?: BlockedRange[] | null
  minNoticeHours?: number | null
  horizonDays?: number | null
  bufferMinutes?: number | null
  stepMinutes?: number | null
}

export type Slot = { start: string; end: string }

type Busy = { start: number; end: number }

const DAY_INDEX: Record<string, number> = { dim: 0, lun: 1, mar: 2, mer: 3, jeu: 4, ven: 5, sam: 6 }

/** Pure function: compute free slots from rules and busy intervals (unit-tested). */
export function computeSlots(opts: {
  settings: BookingSettings
  durationMinutes: number
  busy: Busy[]
  now: Date
  fromDateKey?: string
  days?: number
}): Record<string, Slot[]> {
  const { settings, durationMinutes, busy, now } = opts
  const buffer = settings.bufferMinutes ?? 15
  const step = settings.stepMinutes ?? 30
  const earliest = now.getTime() + (settings.minNoticeHours ?? 24) * 3600_000
  const horizon = opts.days ?? settings.horizonDays ?? 60
  const startKey = opts.fromDateKey ?? tahitiDateKey(now)
  const out: Record<string, Slot[]> = {}

  const blocked = (settings.blocked ?? []).map((b) => ({
    from: b.from.slice(0, 10),
    to: (b.to || b.from).slice(0, 10),
  }))

  for (let i = 0; i < horizon; i++) {
    const dayDate = addDays(atTahiti(startKey, '12:00'), i)
    const key = tahitiDateKey(dayDate)
    if (blocked.some((b) => key >= b.from && key <= b.to)) continue
    const wd = tahitiWeekday(dayDate)
    const rules = (settings.weekly ?? []).filter((r) => DAY_INDEX[r.day] === wd)
    const daySlots: Slot[] = []
    for (const r of rules) {
      let s = atTahiti(key, r.start)
      const end = atTahiti(key, r.end)
      while (addMinutes(s, durationMinutes).getTime() <= end.getTime()) {
        const e = addMinutes(s, durationMinutes)
        const sMs = s.getTime()
        const eMs = e.getTime()
        const clash = busy.some((b) => sMs < b.end + buffer * 60_000 && eMs + buffer * 60_000 > b.start)
        if (sMs >= earliest && !clash) daySlots.push({ start: s.toISOString(), end: e.toISOString() })
        s = addMinutes(s, step)
      }
    }
    if (daySlots.length) out[key] = daySlots
  }
  return out
}

/** Busy intervals: active appointment bookings + dated occurrences (Eliane cannot be in two places). */
export async function loadBusy(payload: Payload, fromISO: string, toISO: string): Promise<Busy[]> {
  const [bookings, occ] = await Promise.all([
    payload.find({
      collection: 'bookings',
      depth: 0,
      limit: 1000,
      pagination: false,
      where: {
        and: [
          { status: { in: ['pending', 'confirmed'] } },
          { slotStart: { exists: true } },
          { slotStart: { less_than: toISO } },
          { slotEnd: { greater_than: fromISO } },
        ],
      },
      select: { slotStart: true, slotEnd: true },
    }),
    payload.find({
      collection: 'occurrences',
      depth: 0,
      limit: 500,
      pagination: false,
      where: {
        and: [{ status: { not_equals: 'cancelled' } }, { startsAt: { less_than: toISO } }, { startsAt: { greater_than: fromISO } }],
      },
      select: { startsAt: true, endsAt: true },
    }),
  ])
  const busy: Busy[] = []
  for (const b of bookings.docs as Array<{ slotStart?: string; slotEnd?: string }>) {
    if (b.slotStart && b.slotEnd) busy.push({ start: Date.parse(b.slotStart), end: Date.parse(b.slotEnd) })
  }
  for (const o of occ.docs as Array<{ startsAt: string; endsAt?: string }>) {
    const s = Date.parse(o.startsAt)
    const e = o.endsAt ? Date.parse(o.endsAt) : s + 2 * 3600_000
    // Multi-day journeys block nothing in Tahiti-based slots beyond their first day logic is not needed:
    // Eliane blocks travel periods in « Indisponibilités ».
    if (e - s <= 12 * 3600_000) busy.push({ start: s, end: e })
  }
  return busy
}

export async function getSlots(payload: Payload, durationMinutes: number, now = new Date()) {
  const settings = (await payload.findGlobal({ slug: 'booking-settings', depth: 0 })) as BookingSettings
  const horizon = settings.horizonDays ?? 60
  const busy = await loadBusy(payload, now.toISOString(), addDays(now, horizon + 1).toISOString())
  return computeSlots({ settings, durationMinutes, busy, now })
}

/** Re-check one slot just before booking (inside the checkout). */
export async function isSlotFree(payload: Payload, durationMinutes: number, startISO: string, now = new Date()) {
  const slots = await getSlots(payload, durationMinutes, now)
  const key = tahitiDateKey(new Date(startISO))
  return Boolean(slots[key]?.some((s) => s.start === new Date(startISO).toISOString()))
}
