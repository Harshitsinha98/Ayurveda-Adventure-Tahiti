import Image from 'next/image'
import Link from 'next/link'

import { NewsletterForm } from '@/components/site/NewsletterForm'
import { NAV } from '@/lib/nav'
import { getSite } from '@/lib/payload'

export async function Footer() {
  const site = await getSite()
  return (
    <footer className="relative overflow-hidden bg-plum-950 text-sand-100">
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(210,154,72,0.18),transparent_65%)]" />
      <div className="container-x relative grid gap-14 py-20 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="eyebrow text-saffron-300">Newsletter</p>
          <h2 className="mt-4 max-w-xl text-[clamp(2.2rem,4vw,3.4rem)] text-sand-50">
            Ateliers, formations et voyages, <em className="text-saffron-300">au rythme des saisons.</em>
          </h2>
          <div className="mt-8 max-w-xl">
            <NewsletterForm />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-10 text-sm">
          <div>
            <p className="eyebrow mb-4 text-sand-200/60">Explorer</p>
            <ul className="space-y-2.5">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-sand-100/85 transition hover:text-saffron-300">{n.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-4 text-sand-200/60">Contact</p>
            <ul className="space-y-2.5 text-sand-100/85">
              {site.phone && <li><a className="hover:text-saffron-300" href={`tel:+689${site.phone.replace(/\D/g, '')}`}>{site.phone}</a></li>}
              {site.email && <li><a className="break-all hover:text-saffron-300" href={`mailto:${site.email}`}>{site.email}</a></li>}
              {site.address && <li>{site.address}</li>}
              {site.instagram && <li><a className="hover:text-saffron-300" href={site.instagram} target="_blank" rel="noreferrer">Instagram @AyurvedaTahiti</a></li>}
              {site.facebook && <li><a className="hover:text-saffron-300" href={site.facebook} target="_blank" rel="noreferrer">Facebook</a></li>}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-sand-50/10">
        <div className="container-x flex flex-col items-start justify-between gap-6 py-8 text-xs text-sand-200/60 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <Image src="/images/brand/emblem.png" alt="" width={30} height={30} className="rounded-full" />
            <span>© {new Date().getFullYear()} {site.legal?.entity || 'Ayurveda Tahiti'} · Om namah shivaya</span>
          </div>
          <nav aria-label="Informations légales" className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/mentions-legales" className="hover:text-saffron-300">Mentions légales</Link>
            <Link href="/cgv" className="hover:text-saffron-300">Conditions de vente</Link>
            <Link href="/confidentialite" className="hover:text-saffron-300">Confidentialité</Link>
            <Link href="/admin" className="hover:text-saffron-300">Espace Eliane</Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
