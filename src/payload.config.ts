import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { importExportPlugin } from '@payloadcms/plugin-import-export'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { en } from '@payloadcms/translations/languages/en'
import { fr } from '@payloadcms/translations/languages/fr'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Bookings } from './collections/Bookings'
import { Categories, Messages, Posts, Subscribers, Testimonials, WebhookEvents } from './collections/Content'
import { Customers } from './collections/Customers'
import { Media } from './collections/Media'
import { Occurrences } from './collections/Occurrences'
import { Offerings } from './collections/Offerings'
import { CustomerPackages, Packages } from './collections/Packages'
import { Users } from './collections/Users'
import { accountEndpoints } from './endpoints/account'
import { publicEndpoints } from './endpoints/public'
import { AboutPage, BookingSettings, HomePage, SiteSettings } from './globals'
import { brevoAdapter } from './lib/payload-email'
import { migrations } from './migrations'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const dbUri = process.env.DATABASE_URI || 'file:./ayurveda.db'

// PostgreSQL in production (e.g. Neon), SQLite file for local development.
const db = dbUri.startsWith('postgres')
  ? postgresAdapter({
      pool: { connectionString: dbUri },
      push: process.env.PAYLOAD_DB_PUSH === 'true',
      migrationDir: path.resolve(dirname, 'migrations'),
      prodMigrations: migrations,
    })
  : sqliteAdapter({ client: { url: dbUri } })

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || '',
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: ' · Ayurveda Tahiti',
      icons: [{ rel: 'icon', url: '/images/brand/emblem.png' }],
      // Discourage automatic browser translation of the admin (see NoTranslate).
      other: { google: 'notranslate' },
    },
    components: {
      graphics: {
        Logo: '/components/admin/Brand#Logo',
        Icon: '/components/admin/Brand#Icon',
      },
      actions: ['/components/admin/LanguageSwitch#LanguageSwitch'],
      providers: ['/components/admin/NoTranslate#NoTranslate'],
      beforeDashboard: ['/components/admin/Dashboard#Dashboard'],
    },
    dateFormat: 'd MMMM yyyy',
  },
  i18n: { supportedLanguages: { fr, en }, fallbackLanguage: 'fr' },
  localization: {
    locales: [
      { label: 'Français', code: 'fr' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'fr',
    fallback: true,
  },
  collections: [
    Bookings,
    Offerings,
    Occurrences,
    Packages,
    CustomerPackages,
    Customers,
    Subscribers,
    Messages,
    Posts,
    Categories,
    Testimonials,
    Media,
    Users,
    WebhookEvents,
  ],
  globals: [BookingSettings, HomePage, AboutPage, SiteSettings],
  endpoints: [...publicEndpoints, ...accountEndpoints],
  editor: lexicalEditor(),
  // Account verification / password-reset emails go through Brevo (same as the site's transactional emails).
  email: brevoAdapter,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db,
  sharp,
  upload: { limits: { fileSize: 15_000_000 } },
  plugins: [
    // Images are stored in Vercel Blob in production (the Vercel filesystem is temporary).
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
    importExportPlugin({
      collections: [{ slug: 'customers' }, { slug: 'bookings' }, { slug: 'subscribers' }],
    }),
  ],
  cors: [process.env.NEXT_PUBLIC_SITE_URL || ''].filter(Boolean),
  csrf: [process.env.NEXT_PUBLIC_SITE_URL || ''].filter(Boolean),
})
