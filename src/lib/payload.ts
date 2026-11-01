import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import type { Media } from '@/payload-types'

export const payloadClient = cache(() => getPayload({ config }))

export type Img = { url: string; alt: string; width?: number; height?: number; focalX?: number; focalY?: number }

/** Normalise an upload field into what <Image> needs. */
export function img(m: unknown, size?: 'thumb' | 'card' | 'hero'): Img | null {
  if (!m || typeof m !== 'object') return null
  const media = m as Media
  const s = size ? media.sizes?.[size] : undefined
  const raw = s?.url || media.url
  if (!raw) return null
  // Payload returns absolute URLs for local files; keep them relative so next/image treats them as local.
  const url = raw.replace(/^https?:\/\/[^/]+(?=\/api\/media\/)/, '')
  return {
    url,
    alt: media.alt || '',
    width: s?.width || media.width || undefined,
    height: s?.height || media.height || undefined,
    focalX: media.focalX ?? undefined,
    focalY: media.focalY ?? undefined,
  }
}

export const objectPosition = (i?: Img | null) =>
  i?.focalX != null && i?.focalY != null ? `${i.focalX}% ${i.focalY}%` : '50% 50%'

export async function getSite() {
  const payload = await payloadClient()
  return payload.findGlobal({ slug: 'site', depth: 0 })
}
