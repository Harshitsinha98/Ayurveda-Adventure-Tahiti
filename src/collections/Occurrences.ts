import type { CollectionConfig } from 'payload'

import { publicRead, staffOnly } from '@/access'

/**
 * Dated occurrences: a course start, a workshop, a conference or a journey departure.
 * Individual sessions (séances) use the weekly availability instead.
 * `seatsReserved` is maintained atomically by the booking engine (see lib/booking/capacity.ts).
 */
export const Occurrences: CollectionConfig = {
  slug: 'occurrences',
  labels: { singular: 'Date / session', plural: 'Dates et sessions' },
  admin: {
    group: 'Réservations',
    useAsTitle: 'label',
    defaultColumns: ['label', 'offering', 'startsAt', 'capacity', 'seatsReserved', 'status'],
    description: 'Créer, modifier, dupliquer ou annuler une date. « Dupliquer » se trouve dans le menu ⋯ de la fiche.',
  },
  defaultSort: 'startsAt',
  access: { read: publicRead, create: staffOnly, update: staffOnly, delete: staffOnly },
  fields: [
    {
      name: 'offering',
      label: 'Offre',
      type: 'relationship',
      relationTo: 'offerings',
      required: true,
      filterOptions: { kind: { not_equals: 'seance' } },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startsAt',
          label: 'Début',
          type: 'date',
          required: true,
          admin: { date: { pickerAppearance: 'dayAndTime', timeFormat: 'HH:mm', displayFormat: 'd MMM yyyy HH:mm' } },
        },
        {
          name: 'endsAt',
          label: 'Fin',
          type: 'date',
          admin: { date: { pickerAppearance: 'dayAndTime', timeFormat: 'HH:mm', displayFormat: 'd MMM yyyy HH:mm' } },
        },
      ],
    },
    {
      name: 'schedule',
      label: 'Séances de la formation',
      type: 'array',
      admin: { description: 'Facultatif : liste des dates si la formation se déroule sur plusieurs jours.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'startsAt', label: 'Début', type: 'date', required: true, admin: { date: { pickerAppearance: 'dayAndTime', timeFormat: 'HH:mm' } } },
            { name: 'endsAt', label: 'Fin', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime', timeFormat: 'HH:mm' } } },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'capacity', label: 'Places au total', type: 'number', required: true, min: 1, defaultValue: 12 },
        {
          name: 'seatsReserved',
          label: 'Places réservées',
          type: 'number',
          defaultValue: 0,
          min: 0,
          admin: { readOnly: true, description: 'Calculé automatiquement.' },
          hooks: { beforeDuplicate: [() => 0] },
        },
      ],
    },
    { name: 'location', label: 'Lieu (si différent de l’offre)', type: 'text' },
    { name: 'priceOverride', label: 'Prix spécial pour cette date (XPF)', type: 'number', min: 0 },
    {
      name: 'status',
      label: 'Statut',
      type: 'select',
      defaultValue: 'open',
      required: true,
      hooks: { beforeDuplicate: [() => 'open'] },
      options: [
        { label: 'Inscriptions ouvertes', value: 'open' },
        { label: 'Complet / inscriptions closes', value: 'closed' },
        { label: 'Annulée', value: 'cancelled' },
      ],
    },
    { name: 'notes', label: 'Note interne', type: 'textarea' },
    {
      name: 'label',
      type: 'text',
      admin: { hidden: true },
      hooks: {
        beforeChange: [
          async ({ data, req }) => {
            if (!data) return undefined
            let title = ''
            const id = typeof data.offering === 'object' ? data.offering?.id : data.offering
            if (id) {
              const o = await req.payload
                .findByID({ collection: 'offerings', id, depth: 0, req })
                .catch(() => null)
              title = o?.title ?? ''
            }
            const d = data.startsAt ? new Date(data.startsAt) : null
            const date = d
              ? d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Pacific/Tahiti' })
              : ''
            return [title, date].filter(Boolean).join(' · ')
          },
        ],
      },
    },
  ],
}
