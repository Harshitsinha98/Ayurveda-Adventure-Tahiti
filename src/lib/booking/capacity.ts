import { sql } from '@payloadcms/db-postgres/drizzle'
import type { Payload, PayloadRequest } from 'payload'

/**
 * Atomic seat reservation on an occurrence.
 * A single conditional UPDATE guarantees that two concurrent bookings can never
 * take the last place twice (works on PostgreSQL and SQLite).
 */
type AnyDb = {
  execute?: (q: unknown) => Promise<{ rowCount?: number | null; rowsAffected?: number }>
  run?: (q: unknown) => Promise<{ rowsAffected?: number; changes?: number }>
}

async function dbFor(payload: Payload, req?: PayloadRequest): Promise<AnyDb> {
  const adapter = payload.db as unknown as { drizzle: AnyDb; sessions?: Record<string, { db: AnyDb }> }
  const tid = req?.transactionID ? await req.transactionID : undefined
  if (tid && adapter.sessions?.[String(tid)]?.db) return adapter.sessions[String(tid)].db
  return adapter.drizzle
}

async function exec(db: AnyDb, q: unknown): Promise<number> {
  if (typeof db.run === 'function') {
    const r = await db.run(q)
    return Number(r?.rowsAffected ?? r?.changes ?? 0)
  }
  const r = await db.execute!(q)
  return Number(r?.rowCount ?? r?.rowsAffected ?? 0)
}

/** Returns true if `qty` seats were taken. */
export async function reserveSeats(payload: Payload, occurrenceId: string | number, qty: number, req?: PayloadRequest) {
  if (qty <= 0) return true
  const db = await dbFor(payload, req)
  const n = await exec(
    db,
    sql`UPDATE occurrences
        SET seats_reserved = COALESCE(seats_reserved, 0) + ${qty}
        WHERE id = ${occurrenceId}
          AND status = 'open'
          AND COALESCE(seats_reserved, 0) + ${qty} <= capacity`,
  )
  return n > 0
}

export async function releaseSeats(payload: Payload, occurrenceId: string | number, qty: number, req?: PayloadRequest) {
  if (qty <= 0) return
  const db = await dbFor(payload, req)
  await exec(
    db,
    sql`UPDATE occurrences
        SET seats_reserved = CASE WHEN COALESCE(seats_reserved, 0) - ${qty} < 0 THEN 0 ELSE COALESCE(seats_reserved, 0) - ${qty} END
        WHERE id = ${occurrenceId}`,
  )
}

/** Booking statuses that hold seats / a time slot. */
export const HOLDING = new Set(['pending', 'confirmed'])
