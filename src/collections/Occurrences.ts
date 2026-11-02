import type { CollectionConfig } from 'payload'

import { publicRead, staffOnly } from '@/access'
import { L } from '@/lib/admin-labels'

/**
 * Dated occurrences: a course start, a workshop, a conference or a journey departure.
 * Individual sessions (séances) use the weekly availability instead.
 * `seatsReserved` is maintained atomically by the booking engine (see lib/booking/capacity.ts).
 */
export const Occurrences: CollectionConfig = {
  slug: 'occurrences',
  labels: { singular: L('Date / session', 'Date / session'), plural: L('Dates et sessions', 'Dates & sessions') },
  admin: {
    group: L('Réservations', 'Bookings'),
    useAsTitle: 'label',
    defaultColumns: ['label', 'offering', 'startsAt', 'capacity', 'seatsReserved', 'status'],
    description: L(
      'Créer, modifier, dupliquer ou annuler une date. « Dupliquer » se trouve dans le menu ⋯ de la fiche.',
      'Create, edit, duplicate or cancel a date. “Duplicate” is in the ⋯ menu of the record.',
    ),
  },
  defaultSort: 'startsAt',
  access: { read: publicRead, create: staffOnly, update: staffOnly, delete: staffOnly },
  fields: [
    {
      name: 'offering',
      label: L('Offre', 'Offering'),
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
          label: L('Début', 'Start'),
          type: 'date',
          required: true,
          admin: { date: { pickerAppearance: 'dayAndTime', timeFormat: 'HH:mm', displayFormat: 'd MMM yyyy HH:mm' } },
        },
        {
          name: 'endsAt',
          label: L('Fin', 'End'),
          type: 'date',
          admin: { date: { pickerAppearance: 'dayAndTime', timeFormat: 'HH:mm', displayFormat: 'd MMM yyyy HH:mm' } },
        },
      ],
    },
    {
      name: 'schedule',
      label: L('Séances de la formation', 'Course sessions'),
      type: 'array',
      admin: { description: L('Facultatif : liste des dates si la formation se déroule sur plusieurs jours.', 'Optional: list of dates if the course runs over several days.') },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'startsAt', label: L('Début', 'Start'), type: 'date', required: true, admin: { date: { pickerAppearance: 'dayAndTime', timeFormat: 'HH:mm' } } },
            { name: 'endsAt', label: L('Fin', 'End'), type: 'date', admin: { date: { pickerAppearance: 'dayAndTime', timeFormat: 'HH:mm' } } },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'capacity', label: L('Places au total', 'Total seats'), type: 'number', required: true, min: 1, defaultValue: 12 },
        {
          name: 'seatsReserved',
          label: L('Places réservées', 'Seats reserved'),
          type: 'number',
          defaultValue: 0,
          min: 0,
          admin: { readOnly: true, description: L('Calculé automatiquement.', 'Calculated automatically.') },
          hooks: { beforeDuplicate: [() => 0] },
        },
      ],
    },
    { name: 'location', label: L('Lieu (si différent de l’offre)', 'Location (if different from the offering)'), type: 'text' },
    { name: 'priceOverride', label: L('Prix spécial pour cette date (XPF)', 'Special price for this date (XPF)'), type: 'number', min: 0 },
    {
      name: 'status',
      label: L('Statut', 'Status'),
      type: 'select',
      defaultValue: 'open',
      required: true,
      hooks: { beforeDuplicate: [() => 'open'] },
      options: [
        { label: L('Inscriptions ouvertes', 'Registration open'), value: 'open' },
        { label: L('Complet / inscriptions closes', 'Full / registration closed'), value: 'closed' },
        { label: L('Annulée', 'Cancelled'), value: 'cancelled' },
      ],
    },
    { name: 'notes', label: L('Note interne', 'Internal note'), type: 'textarea' },
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
