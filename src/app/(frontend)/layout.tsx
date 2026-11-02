import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Manrope } from 'next/font/google'

import { Cursor, Preloader, SmoothScroll } from '@/components/motion/experience'
import { introScript } from '@/components/motion/intro'
import { MotionProvider } from '@/components/motion/primitives'
import { Footer } from '@/components/site/Footer'
import { Header } from '@/components/site/Header'
import { WhatsAppButton } from '@/components/site/WhatsAppButton'
import { LangProvider } from '@/i18n/client'
import { dictionaries } from '@/i18n/dictionary'
import { getLang } from '@/i18n/server'
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

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang()
  return {
  metadataBase: new URL(url),
  title: { default: 'Ayurveda Tahiti · Ayurveda, méditation et voyages spirituels', template: '%s · Ayurveda Tahiti' },
  description:
    'Ayurveda, méditation Primordial Sound, séances individuelles et formations à Punaauia et en ligne. Voyages spirituels en Inde avec Eliane.',
  openGraph: { type: 'website', locale: 'fr_FR', siteName: 'Ayurveda Tahiti' },
  icons: { icon: '/images/brand/emblem.png', apple: '/images/brand/emblem.png' },
  ...(lang === 'en'
    ? {
        title: { default: 'Ayurveda Tahiti · Ayurveda, meditation and spiritual journeys', template: '%s · Ayurveda Tahiti' },
        description: 'Ayurveda, Primordial Sound Meditation, individual sessions and courses in Punaauia (Tahiti) and online. Spiritual journeys to India with Eliane.',
        openGraph: { type: 'website', locale: 'en_GB', siteName: 'Ayurveda Tahiti' },
      }
    : {}),
  }
}

export const viewport: Viewport = { themeColor: '#f7f1e8', width: 'device-width', initialScale: 1 }

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const [site, lang] = await Promise.all([getSite(), getLang()])
  const t = dictionaries[lang]
  return (
    <html lang={lang} className={`${cormorant.variable} ${manrope.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
        <noscript>
          <style>{'.preloader{display:none}'}</style>
        </noscript>
      </head>
      <body>
        <a href="#contenu" className="sr-only z-[60] rounded-[2px] bg-plum-800 px-4 py-2 text-sand-50 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          {t.header.skip}
        </a>
        <LangProvider lang={lang}>
        <MotionProvider>
          <SmoothScroll>
            <Preloader />
            <Header />
            <main id="contenu" className="relative z-[1] bg-sand-100">{children}</main>
            <Footer />
            <WhatsAppButton number={site.whatsapp} />
            <Cursor />
          </SmoothScroll>
        </MotionProvider>
        </LangProvider>
      </body>
    </html>
  )
}
