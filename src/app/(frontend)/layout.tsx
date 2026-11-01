import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Manrope } from 'next/font/google'

import { MotionProvider } from '@/components/motion/primitives'
import { Footer } from '@/components/site/Footer'
import { Header } from '@/components/site/Header'
import { WhatsAppButton } from '@/components/site/WhatsAppButton'
import { getSite } from '@/lib/payload'

import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' })

const url = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: { default: 'Ayurveda Tahiti · Ayurveda, méditation et voyages spirituels', template: '%s · Ayurveda Tahiti' },
  description:
    'Ayurveda, méditation Primordial Sound, séances individuelles et formations à Punaauia et en ligne. Voyages spirituels en Inde avec Eliane.',
  openGraph: { type: 'website', locale: 'fr_FR', siteName: 'Ayurveda Tahiti' },
  icons: { icon: '/images/brand/emblem.png', apple: '/images/brand/emblem.png' },
}

export const viewport: Viewport = { themeColor: '#f7f1e8', width: 'device-width', initialScale: 1 }

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const site = await getSite()
  return (
    <html lang="fr" className={`${cormorant.variable} ${manrope.variable}`}>
      <body>
        <a href="#contenu" className="sr-only z-[60] rounded-full bg-plum-800 px-4 py-2 text-sand-50 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          Aller au contenu
        </a>
        <MotionProvider>
          <Header />
          <main id="contenu">{children}</main>
          <Footer />
          <WhatsAppButton number={site.whatsapp} />
        </MotionProvider>
      </body>
    </html>
  )
}
