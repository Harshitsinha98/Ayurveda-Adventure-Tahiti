/**
 * Shared frame for the account pages (login, register, forgot, reset, verify).
 * Server component — gives a consistent, site-styled centered card under the
 * fixed header, matching the rest of the public site (plum / sand palette,
 * Cormorant display font via .font-display).
 */
export function AccountShell({
  eyebrow,
  title,
  subtitle,
  children,
  wide,
}: {
  eyebrow: string
  title: string
  subtitle?: string
  children: React.ReactNode
  wide?: boolean
}) {
  return (
    <section className="container-x min-h-[80vh] pt-[128px] pb-24">
      <div className={`mx-auto ${wide ? 'max-w-3xl' : 'max-w-md'}`}>
        <p className="eyebrow mb-3 text-plum-700/70">{eyebrow}</p>
        <h1 className="font-display text-[clamp(2.2rem,5vw,3.2rem)] leading-[1.05] text-plum-900">{title}</h1>
        {subtitle && <p className="mt-3 text-ink-soft">{subtitle}</p>}
        <div className="mt-8">{children}</div>
      </div>
    </section>
  )
}
