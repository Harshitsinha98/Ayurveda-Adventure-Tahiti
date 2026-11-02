import type { CollectionConfig } from 'payload'

import { publicRead, staffOnly } from '@/access'
import { slugField } from '@/fields/slug'
import { L } from '@/lib/admin-labels'

/** Session packages sold on the site (carnets de séances). */
export const Packages: CollectionConfig = {
  slug: 'packages',
  labels: { singular: L('Carnet', 'Package'), plural: L('Carnets de séances', 'Session packages') },
  admin: {
    group: L('Réservations', 'Bookings'),
    useAsTitle: 'title',
    defaultColumns: ['title', 'sessionsCount', 'price', 'validityMonths', 'published'],
  },
  defaultSort: 'order',
  access: { read: publicRead, create: staffOnly, update: staffOnly, delete: staffOnly },
  fields: [
    { name: 'title', localized: true, label: L('Nom', 'Name'), type: 'text', required: true },
    { name: 'summary', localized: true, label: L('Description', 'Description'), type: 'textarea' },
    {
      type: 'row',
      fields: [
        { name: 'sessionsCount', label: L('Nombre de séances', 'Number of sessions'), type: 'number', required: true, min: 1 },
        { name: 'price', label: L('Prix (XPF)', 'Price (XPF)'), type: 'number', required: true, min: 0 },
        { name: 'validityMonths', label: L('Validité (mois)', 'Validity (months)'), type: 'number', required: true, defaultValue: 12, min: 1 },
      ],
    },
    {
      name: 'appliesTo',
      label: L('Utilisable pour', 'Usable for'),
      type: 'relationship',
      relationTo: 'offerings',
      hasMany: true,
      filterOptions: { kind: { equals: 'seance' } },
      admin: { description: L('Séances qui peuvent être réservées avec ce carnet.', 'Sessions that can be booked with this package.') },
    },
    slugField(),
    { name: 'published', label: L('Visible sur le site', 'Visible on the site'), type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
    { name: 'order', label: L('Ordre', 'Order'), type: 'number', defaultValue: 10, admin: { position: 'sidebar' } },
  ],
}

/** Packages owned by customers, with remaining credits. */
export const CustomerPackages: CollectionConfig = {
  slug: 'customer-packages',
  labels: { singular: L('Carnet client', 'Client package'), plural: L('Carnets des clients', 'Client packages') },
  admin: {
    group: L('Réservations', 'Bookings'),
    useAsTitle: 'label',
    defaultColumns: ['label', 'customer', 'creditsUsed', 'creditsTotal', 'expiresAt', 'status'],
    description: L(
      'Crédits restants de chaque client. Vous pouvez ajouter ou retirer des crédits à la main.',
      'Remaining credits for each client. You can add or remove credits by hand.',
    ),
  },
  access: { read: staffOnly, create: staffOnly, update: staffOnly, delete: staffOnly },
  fields: [
    { name: 'customer', label: L('Client', 'Client'), type: 'relationship', relationTo: 'customers', required: true },
    { name: 'package', label: L('Carnet', 'Package'), type: 'relationship', relationTo: 'packages', required: true },
    {
      type: 'row',
      fields: [
        { name: 'creditsTotal', label: L('Séances au total', 'Total sessions'), type: 'number', required: true, min: 0 },
        { name: 'creditsUsed', label: L('Séances utilisées', 'Sessions used'), type: 'number', defaultValue: 0, min: 0 },
        { name: 'expiresAt', label: L('Valable jusqu’au', 'Valid until'), type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
      ],
    },
    {
      name: 'status',
      label: L('Statut', 'Status'),
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: L('En attente de paiement', 'Awaiting payment'), value: 'pending' },
        { label: L('Actif', 'Active'), value: 'active' },
        { label: L('Épuisé', 'Used up'), value: 'used' },
        { label: L('Expiré', 'Expired'), value: 'expired' },
        { label: L('Annulé', 'Cancelled'), value: 'cancelled' },
      ],
    },
    { name: 'purchaseBooking', label: L('Achat', 'Purchase'), type: 'relationship', relationTo: 'bookings', admin: { readOnly: true } },
    { name: 'notes', label: L('Note', 'Note'), type: 'textarea' },
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
