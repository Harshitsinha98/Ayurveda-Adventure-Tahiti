import { AtSign, Mail, MapPin, Phone } from 'lucide-react'
import type { Metadata } from 'next'

import { ContactForm } from '@/components/booking/ContactForm'
import { Reveal } from '@/components/motion/primitives'
import { getSite } from '@/lib/payload'

export const revalidate = 300
export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contacter Eliane, Ayurveda Tahiti à Punaauia : téléphone, e-mail, WhatsApp ou formulaire.',
}

export default async function ContactPage() {
  const site = await getSite()
  const items = [
    site.phone && { icon: <Phone size={18} />, label: 'Téléphone', value: site.phone, href: `tel:+689${site.phone.replace(/\D/g, '')}` },
    site.email && { icon: <Mail size={18} />, label: 'E-mail', value: site.email, href: `mailto:${site.email}` },
    site.address && { icon: <MapPin size={18} />, label: 'Lieu', value: site.address, href: 'https://www.google.com/maps/search/?api=1&query=Punaauia%2C+Tahiti' },
    site.instagram && { icon: <AtSign size={18} />, label: 'Instagram', value: '@AyurvedaTahiti', href: site.instagram },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string; href: string }[]

  return (
    <section className="pb-28 pt-[140px] lg:pt-[170px]">
      <div className="container-x grid gap-16 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <p className="eyebrow text-saffron-600">Contact</p>
          <h1 className="mt-5 text-[clamp(3rem,7vw,5.6rem)] leading-[0.95] text-plum-800">
            Parlons de <em className="text-saffron-600">ton chemin.</em>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
            Ayurveda Tahiti est situé dans un cadre paisible à Punaauia, un sanctuaire pour la guérison et le bien-être. Une question sur une offre, une formation ou un voyage ? Écris-moi.
          </p>
          <ul className="mt-12 space-y-3">
            {items.map((i) => (
              <li key={i.label}>
                <a href={i.href} target={i.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="group flex items-center gap-5 rounded-[3px] border border-plum-800/10 px-5 py-4 transition hover:border-plum-800/30 hover:bg-sand-50">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-plum-100 text-plum-800">{i.icon}</span>
                  <span>
                    <span className="block text-xs uppercase tracking-[0.16em] text-ink-soft">{i.label}</span>
                    <span className="font-display text-xl text-plum-800">{i.value}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.1} className="rounded-[3px] bg-sand-50 p-7 shadow-[0_40px_80px_-60px_rgba(42,11,28,0.5)] sm:p-10">
          <p className="font-display mb-6 text-3xl text-plum-800">Envoyer un message</p>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  )
}
