import 'server-only'

import { headers as nextHeaders } from 'next/headers'

import { payloadClient } from '@/lib/payload'

type Doc = Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any

/**
 * Current logged-in customer (public website account), resolved from the
 * Payload session cookie. Returns null for guests or for staff sessions
 * (a staff `users` token is not a customer).
 */
export async function getCustomer(): Promise<Doc | null> {
  const payload = await payloadClient()
  const { user } = await payload.auth({ headers: await nextHeaders() })
  if (!user || (user as Doc).collection !== 'customers') return null
  return user as Doc
}

/** A customer's bookings, newest first, for the account page. */
export async function getCustomerBookings(customerId: string | number): Promise<Doc[]> {
  const payload = await payloadClient()
  const r = await payload.find({
    collection: 'bookings',
    where: { customer: { equals: customerId } },
    sort: '-createdAt',
    depth: 1,
    limit: 50,
    overrideAccess: true, // we've already resolved the owning customer
  })
  return r.docs as Doc[]
}
