import type { CollectionConfig } from 'payload'

import { staffOnly } from '@/access'

export const customerGroups = [
  { label: 'Clients', value: 'clients' },
  { label: 'Méditation', value: 'meditation' },
  { label: 'Ayurveda', value: 'ayurveda' },
  { label: 'Voyages', value: 'voyages' },
  { label: 'Newsletter', value: 'newsletter' },
  { label: 'Importé de Wix', value: 'wix' },
]

/** Customer database (CRM). Contacts are synchronised to Brevo for newsletters. */
export const Customers: CollectionConfig = {
  slug: 'customers',
  labels: { singular: 'Client', plural: 'Clients' },
  admin: {
    group: 'Clients et newsletter',
    useAsTitle: 'displayName',
    defaultColumns: ['displayName', 'email', 'phone', 'groups', 'newsletter'],
    listSearchableFields: ['email', 'firstName', 'lastName', 'phone'],
    description: 'Liste des clients. Export CSV : cochez les fiches puis « Exporter ».',
  },
  access: { read: staffOnly, create: staffOnly, update: staffOnly, delete: staffOnly },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'firstName', label: 'Prénom', type: 'text' },
        { name: 'lastName', label: 'Nom', type: 'text' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'email', label: 'E-mail', type: 'email', required: true, unique: true, index: true },
        { name: 'phone', label: 'Téléphone', type: 'text' },
      ],
    },
    { name: 'country', label: 'Pays', type: 'text' },
    { name: 'groups', label: 'Groupes', type: 'select', hasMany: true, options: customerGroups },
    {
      name: 'newsletter',
      label: 'Accepte la newsletter',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Uniquement avec le consentement de la personne.' },
    },
    { name: 'consentAt', label: 'Consentement donné le', type: 'date', admin: { readOnly: true } },
    { name: 'notes', label: 'Notes', type: 'textarea' },
    {
      name: 'source',
      label: 'Origine',
      type: 'select',
      defaultValue: 'site',
      options: [
        { label: 'Site internet', value: 'site' },
        { label: 'Ajout manuel', value: 'manuel' },
        { label: 'Import Wix', value: 'wix' },
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
      label: 'Réservations',
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
