/* eslint-disable @next/next/no-img-element */
export function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <img src="/images/brand/emblem.png" alt="" width={56} height={56} style={{ borderRadius: '50%' }} />
      <div style={{ fontFamily: 'Georgia, serif', lineHeight: 1.1 }}>
        <div style={{ fontSize: 26, color: 'var(--theme-text)' }}>Ayurveda Tahiti</div>
        <div style={{ fontSize: 12, letterSpacing: '.22em', textTransform: 'uppercase', opacity: 0.6 }}>Espace de gestion</div>
      </div>
    </div>
  )
}

export function Icon() {
  return <img src="/images/brand/emblem.png" alt="Ayurveda Tahiti" width={28} height={28} style={{ borderRadius: '50%' }} />
}
