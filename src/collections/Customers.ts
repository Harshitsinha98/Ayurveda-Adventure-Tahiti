import type { CollectionConfig } from 'payload'

import { staffOnly } from '@/access'
import { L } from '@/lib/admin-labels'

export const customerGroups = [
  { label: L('Clients', 'Clients'), value: 'clients' },
  { label: L('Méditation', 'Meditation'), value: 'meditation' },
  { label: L('Ayurveda', 'Ayurveda'), value: 'ayurveda' },
  { label: L('Voyages', 'Journeys'), value: 'voyages' },
  { label: L('Newsletter', 'Newsletter'), value: 'newsletter' },
  { label: L('Importé de Wix', 'Imported from Wix'), value: 'wix' },
]

/** Customer database (CRM). Contacts are synchronised to Brevo for newsletters. */
export const Customers: CollectionConfig = {
  slug: 'customers',
  labels: { singular: L('Client', 'Client'), plural: L('Clients', 'Clients') },
  admin: {
    group: L('Clients et newsletter', 'Clients & newsletter'),
    useAsTitle: 'displayName',
    defaultColumns: ['displayName', 'email', 'phone', 'groups', 'newsletter'],
    listSearchableFields: ['email', 'firstName', 'lastName', 'phone'],
    description: L('Liste des clients. Export CSV : cochez les fiches puis « Exporter ».', 'Client list. CSV export: tick the records then “Export”.'),
  },
  access: { read: staffOnly, create: staffOnly, update: staffOnly, delete: staffOnly },
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
