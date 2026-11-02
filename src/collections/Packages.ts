import type { CollectionConfig } from 'payload'

import { publicRead, staffOnly } from '@/access'
import { slugField } from '@/fields/slug'

/** Session packages sold on the site (carnets de séances). */
export const Packages: CollectionConfig = {
  slug: 'packages',
  labels: { singular: 'Carnet', plural: 'Carnets de séances' },
  admin: {
    group: 'Réservations',
    useAsTitle: 'title',
    defaultColumns: ['title', 'sessionsCount', 'price', 'validityMonths', 'published'],
  },
  defaultSort: 'order',
  access: { read: publicRead, create: staffOnly, update: staffOnly, delete: staffOnly },
  fields: [
    { name: 'title', localized: true, label: 'Nom', type: 'text', required: true },
    { name: 'summary', localized: true, label: 'Description', type: 'textarea' },
    {
      type: 'row',
      fields: [
        { name: 'sessionsCount', label: 'Nombre de séances', type: 'number', required: true, min: 1 },
        { name: 'price', label: 'Prix (XPF)', type: 'number', required: true, min: 0 },
        { name: 'validityMonths', label: 'Validité (mois)', type: 'number', required: true, defaultValue: 12, min: 1 },
      ],
    },
    {
      name: 'appliesTo',
      label: 'Utilisable pour',
      type: 'relationship',
      relationTo: 'offerings',
      hasMany: true,
      filterOptions: { kind: { equals: 'seance' } },
      admin: { description: 'Séances qui peuvent être réservées avec ce carnet.' },
    },
    slugField(),
    { name: 'published', label: 'Visible sur le site', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
    { name: 'order', label: 'Ordre', type: 'number', defaultValue: 10, admin: { position: 'sidebar' } },
  ],
}

/** Packages owned by customers, with remaining credits. */
export const CustomerPackages: CollectionConfig = {
  slug: 'customer-packages',
  labels: { singular: 'Carnet client', plural: 'Carnets des clients' },
  admin: {
    group: 'Réservations',
    useAsTitle: 'label',
    defaultColumns: ['label', 'customer', 'creditsUsed', 'creditsTotal', 'expiresAt', 'status'],
    description: 'Crédits restants de chaque client. Vous pouvez ajouter ou retirer des crédits à la main.',
  },
  access: { read: staffOnly, create: staffOnly, update: staffOnly, delete: staffOnly },
  fields: [
    { name: 'customer', label: 'Client', type: 'relationship', relationTo: 'customers', required: true },
    { name: 'package', label: 'Carnet', type: 'relationship', relationTo: 'packages', required: true },
    {
      type: 'row',
      fields: [
        { name: 'creditsTotal', label: 'Séances au total', type: 'number', required: true, min: 0 },
        { name: 'creditsUsed', label: 'Séances utilisées', type: 'number', defaultValue: 0, min: 0 },
        { name: 'expiresAt', label: 'Valable jusqu’au', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
      ],
    },
    {
      name: 'status',
      label: 'Statut',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'En attente de paiement', value: 'pending' },
        { label: 'Actif', value: 'active' },
        { label: 'Épuisé', value: 'used' },
        { label: 'Expiré', value: 'expired' },
        { label: 'Annulé', value: 'cancelled' },
      ],
    },
    { name: 'purchaseBooking', label: 'Achat', type: 'relationship', relationTo: 'bookings', admin: { readOnly: true } },
    { name: 'notes', label: 'Note', type: 'textarea' },
    {
      name: 'label',
      type: 'text',
      admin: { hidden: true },
      hooks: {
        beforeChange: [
          async ({ data, req }) => {
            const cid = typeof data?.customer === 'object' ? data?.customer?.id : data?.customer
            const pid = typeof data?.package === 'object' ? data?.package?.id : data?.package
            const [c, p] = await Promise.all([
              cid ? req.payload.findByID({ collection: 'customers', id: cid, depth: 0, req }).catch(() => null) : null,
              pid ? req.payload.findByID({ collection: 'packages', id: pid, depth: 0, req }).catch(() => null) : null,
            ])
            return [p?.title, c ? `${c.firstName ?? ''} ${c.lastName ?? ''}`.trim() || c.email : null]
              .filter(Boolean)
              .join(' · ')
          },
        ],
      },
    },
  ],
}
