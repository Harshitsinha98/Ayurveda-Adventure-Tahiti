import { draftMode, headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { isStaff } from '@/access'
import { payloadClient } from '@/lib/payload'

/** Enables draft preview for logged-in staff, then opens the article. */
export async function GET(req: Request) {
  const url = new URL(req.url)
  const path = url.searchParams.get('path') || '/'
  if (!path.startsWith('/') || path.startsWith('//')) return new Response('Bad path', { status: 400 })
  const payload = await payloadClient()
  const { user } = await payload.auth({ headers: await headers() })
  if (!isStaff(user as never)) return new Response('Non autorisé', { status: 401 })
  ;(await draftMode()).enable()
  redirect(path)
}
