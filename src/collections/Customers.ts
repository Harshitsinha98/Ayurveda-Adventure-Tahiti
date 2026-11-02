import type { Access, CollectionConfig } from 'payload'

import { isStaff, staffOnly } from '@/access'
import { L } from '@/lib/admin-labels'
import { verifyAccountEmail } from '@/lib/account-email'

/** Staff see every customer; a logged-in customer may only read/update their own record. */
const ownRecordOrStaff: Access = ({ req }) => {
  const user = req.user as { id?: string | number; collection?: string } | undefined
  if (isStaff(req.user as never)) return true
  if (user?.collection === 'customers' && user.id != null) return { id: { equals: user.id } }
  return false
}

export const customerGroups = [
  { label: L('Clients', 'Clients'), value: 'clients' },
  { label: L('Méditation', 'Meditation'), value: 'meditation' },
  { label: L('Ayurveda', 'Ayurveda'), value: 'ayurveda' },
  { label: L('Voyages', 'Journeys'), value: 'voyages' },
  { label: L('Newsletter', 'Newsletter'), value: 'newsletter' },
  { label: L('Importé de Wix', 'Imported from Wix'), value: 'wix' },
]

/**
 * Customer database (CRM) — also the public-website account.
 *
 * `auth` is enabled so customers can create an account, verify their email and
 * log in on the site to find their bookings again. This is a SEPARATE login
 * from the staff back office (`users` collection): customers can never reach
 * `/admin` (see `admin.hidden` is false for staff CRM use, but `access.admin`
 * denies customers). Staff keep full CRM access; a customer can only ever
 * read/update their own record.
 */
export const Customers: CollectionConfig = {
  slug: 'customers',
  labels: { singular: L('Client', 'Client'), plural: L('Clients', 'Clients') },
  auth: {
    tokenExpiration: 60 * 60 * 24 * 30, // stay logged in for 30 days
    maxLoginAttempts: 10,
    lockTime: 10 * 60 * 1000,
    // Require email verification before a password account can log in.
    // Google sign-in (added later) provides an already-verified email.
    verify: {
      generateEmailSubject: () => verifyAccountEmail.subject(),
      generateEmailHTML: ({ token, user }) =>
        verifyAccountEmail.html(token as string, (user as { firstName?: string })?.firstName),
    },
    forgotPassword: {
      generateEmailSubject: () => verifyAccountEmail.resetSubject(),
      generateEmailHTML: (args) =>
        verifyAccountEmail.resetHtml(
          (args?.token as string) ?? '',
          (args?.user as { firstName?: string } | undefined)?.firstName,
        ),
    },
  },
  admin: {
    group: L('Clients et newsletter', 'Clients & newsletter'),
    useAsTitle: 'displayName',
    defaultColumns: ['displayName', 'email', 'phone', 'groups', 'newsletter'],
    listSearchableFields: ['email', 'firstName', 'lastName', 'phone'],
    description: L('Liste des clients. Export CSV : cochez les fiches puis « Exporter ».', 'Client list. CSV export: tick the records then “Export”.'),
  },
  access: {
    // Staff: full CRM. Customer: only their own record.
    read: ownRecordOrStaff,
    update: ownRecordOrStaff,
    // Creation stays server-side (booking flow / controlled register endpoint) and admin.
    create: staffOnly,
    delete: staffOnly,
    // Customers must never access the admin panel; only staff can.
    admin: ({ req }) => isStaff(req.user as never),
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'firstName', label: L('Prénom', 'First name'), type: 'text' },
        { name: 'lastName', label: L('Nom', 'Last name'), type: 'text' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'email', label: L('E-mail', 'Email'), type: 'email', required: true, unique: true, index: true },
        { name: 'phone', label: L('Téléphone', 'Phone'), type: 'text' },
      ],
    },
    { name: 'country', label: L('Pays', 'Country'), type: 'text' },
    { name: 'groups', label: L('Groupes', 'Groups'), type: 'select', hasMany: true, options: customerGroups },
    {
      name: 'newsletter',
      label: L('Accepte la newsletter', 'Accepts the newsletter'),
      type: 'checkbox',
      defaultValue: false,
      admin: { description: L('Uniquement avec le consentement de la personne.', 'Only with the person’s consent.') },
    },
    { name: 'consentAt', label: L('Consentement donné le', 'Consent given on'), type: 'date', admin: { readOnly: true } },
    { name: 'notes', label: L('Notes', 'Notes'), type: 'textarea' },
    {
      name: 'source',
      label: L('Origine', 'Source'),
      type: 'select',
      defaultValue: 'site',
      options: [
        { label: L('Site internet', 'Website'), value: 'site' },
        { label: L('Ajout manuel', 'Manual entry'), value: 'manuel' },
        { label: L('Import Wix', 'Wix import'), value: 'wix' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'displayName',
      type: 'text',
      admin: { hidden: true },
      hooks: {
        beforeChange: [({ data }) => `${data?.firstName ?? ''} ${data?.lastName ?? ''}`.trim() || data?.email],
      },
    },
    {
      name: 'bookings',
      label: L('Réservations', 'Bookings'),
      type: 'join',
      collection: 'bookings',
      on: 'customer',
      admin: { defaultColumns: ['code', 'offering', 'status', 'paymentStatus'] },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        if (data?.email) data.email = String(data.email).trim().toLowerCase()
        if (data?.newsletter && !originalDoc?.newsletter && !data.consentAt) data.consentAt = new Date().toISOString()
        return data
      },
    ],
  },
}
