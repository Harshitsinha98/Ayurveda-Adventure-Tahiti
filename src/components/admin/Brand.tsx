'use client'

/* eslint-disable @next/next/no-img-element */
import { useTranslation } from '@payloadcms/ui'

import { tr } from '@/lib/admin-labels'

export function Logo() {
  // On the login screen the translation provider is available; default to FR.
  let lang = 'fr'
  try {
    lang = useTranslation()?.i18n?.language ?? 'fr'
  } catch {
    lang = 'fr'
  }
  const tagline = tr(lang, { fr: 'Espace de gestion', en: 'Management area' })

  return (
    <div className="at-brand">
      <img src="/images/brand/emblem.png" alt="" width={56} height={56} className="at-brand__mark" />
      <div className="at-brand__text">
        <div className="at-brand__name">Ayurveda Tahiti</div>
        <div className="at-brand__tagline">{tagline}</div>
      </div>
    </div>
  )
}

export function Icon() {
  return <img src="/images/brand/emblem.png" alt="Ayurveda Tahiti" width={28} height={28} className="at-brand__icon" />
}
