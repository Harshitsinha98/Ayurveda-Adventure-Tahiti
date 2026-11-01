import { APIError, type CollectionBeforeChangeHook, type CollectionConfig } from 'payload'

import { staffOnly } from '@/access'
import { HOLDING, releaseSeats, reserveSeats } from '@/lib/booking/capacity'
import { bookingEndpoints } from '@/endpoints/bookingAdmin'

const idOf = (v: unknown) => (v && typeof v === 'object' ? (v as { id: string | number }).id : (v as string | number))

export const newBookingCode = () => {
  const d = new Date()
  const yymm = `${String(d.getUTCFullYear()).slice(2)}${String(d.getUTCMonth() + 1).padStart(2, '0')}`
  const rnd = Array.from(crypto.getRandomValues(new Uint8Array(4)))
    .map((b) => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[b % 32])
    .join('')
  return `AT-${yymm}-${rnd}`
}

type Payment = { amount?: number; kind?: string }

export const derivePaymentStatus = (total: number, payments: Payment[] = []) => {
  const paid = payments.filter((p) => p.kind !== 'refund').reduce((s, p) => s + (p.amount || 0), 0)
  const refunded = payments.filter((p) => p.kind === 'refund').reduce((s, p) => s + (p.amount || 0), 0)
  const net = paid - refunded
  let status: 'unpaid' | 'partial' | 'paid' | 'refunded' | 'free' = 'unpaid'
  if (total === 0) status = 'free'
  else if (refunded > 0 && net <= 0) status = 'refunded'
  else if (net >= total) status = 'paid'
  else if (net > 0) status = 'partial'
  return { amountPaid: Math.max(net, 0), status }
}

/**
 * Keeps seats and time slots consistent with the booking status,
 * for online bookings and for bookings typed in by Eliane.
 */
const manageCapacity: CollectionBeforeChangeHook = async ({ data, originalDoc, req, operation }) => {
  const prevHolding = operation === 'update' && HOLDING.has(originalDoc?.status)
  const nextStatus = data.status ?? originalDoc?.status
  const nextHolding = HOLDING.has(nextStatus)
  const occ = idOf(data.occurrence ?? originalDoc?.occurrence)
  const prevOcc = idOf(originalDoc?.occurrence)
  const qty = Number(data.quantity ?? originalDoc?.quantity ?? 1)
  const prevQty = Number(originalDoc?.quantity ?? 1)

  if (prevHolding && prevOcc && (!nextHolding || prevOcc !== occ || prevQty !== qty)) {
    await releaseSeats(req.payload, prevOcc, prevQty, req)
  }
  if (nextHolding && occ && (!prevHolding || prevOcc !== occ || prevQty !== qty)) {
    const ok = await reserveSeats(req.payload, occ, qty, req)
    if (!ok) {
      if (prevHolding && prevOcc) await reserveSeats(req.payload, prevOcc, prevQty, req)
      throw new APIError('Il ne reste pas assez de places pour cette date.', 409, null, true)
    }
  }

  // Appointment slot: unique `slotKey` while the booking holds the slot.
  const slotStart = data.slotStart ?? originalDoc?.slotStart
  data.slotKey = nextHolding && slotStart ? `slot:${new Date(slotStart).toISOString()}` : null

  const total = Number(data.amountTotal ?? originalDoc?.amountTotal ?? 0)
  const pays = (data.payments ?? originalDoc?.payments ?? []) as Payment[]
  const d = derivePaymentStatus(total, pays)
  data.amountPaid = d.amountPaid
  data.paymentStatus = d.status
  data.balance = Math.max(total - d.amountPaid, 0)
  if (!data.code && !originalDoc?.code) data.code = newBookingCode()
  if (!data.accessToken && !originalDoc?.accessToken) data.accessToken = crypto.randomUUID().replace(/-/g, '')

  const cust = idOf(data.customer ?? originalDoc?.customer)
  if (cust && (!(data.customerName ?? originalDoc?.customerName) || !(data.customerEmail ?? originalDoc?.customerEmail))) {
    const c = await req.payload.findByID({ collection: 'customers', id: cust, depth: 0, req }).catch(() => null)
    if (c) {
      data.customerName ||= `${c.firstName ?? ''} ${c.lastName ?? ''}`.trim() || c.email
      data.customerEmail ||= c.email
      data.customerPhone ||= c.phone
    }
  }
  if (data.amountDueNow == null && originalDoc?.amountDueNow == null) data.amountDueNow = total
  return data
}

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  labels: { singular: 'Réservation', plural: 'Réservations' },
  admin: {
    group: 'Réservations',
    useAsTitle: 'code',
    defaultColumns: ['code', 'customerName', 'offering', 'when', 'status', 'paymentStatus', 'amountTotal'],
    listSearchableFields: ['code', 'customerName', 'customerEmail'],
    description:
      'Toutes les réservations. Pour une réservation reçue par téléphone ou en personne : « Créer nouveau ».',
    components: { beforeList: ['/components/admin/BookingsSummary#BookingsSummary'] },
  },
  defaultSort: '-createdAt',
  access: { read: staffOnly, create: staffOnly, update: staffOnly, delete: staffOnly },
  endpoints: bookingEndpoints,
  hooks: { beforeChange: [manageCapacity] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Réservation',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'offering', label: 'Offre', type: 'relationship', relationTo: 'offerings', required: true },
                {
                  name: 'occurrence',
                  label: 'Date',
                  type: 'relationship',
                  relationTo: 'occurrences',
                  filterOptions: ({ data }) =>
                    data?.offering ? { offering: { equals: idOf(data.offering) } } : true,
                  admin: { condition: (d) => !d?.slotStart },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'slotStart',
                  label: 'Rendez-vous : début',
                  type: 'date',
                  admin: {
                    date: { pickerAppearance: 'dayAndTime', timeFormat: 'HH:mm', displayFormat: 'd MMM yyyy HH:mm' },
                    condition: (d) => !d?.occurrence,
                  },
                },
                {
                  name: 'slotEnd',
                  label: 'Rendez-vous : fin',
                  type: 'date',
                  admin: {
                    date: { pickerAppearance: 'dayAndTime', timeFormat: 'HH:mm', displayFormat: 'd MMM yyyy HH:mm' },
                    condition: (d) => !d?.occurrence,
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'status',
                  label: 'Statut',
                  type: 'select',
                  required: true,
                  defaultValue: 'confirmed',
                  options: [
                    { label: 'En attente de paiement', value: 'pending' },
                    { label: 'Confirmée', value: 'confirmed' },
                    { label: 'Annulée', value: 'cancelled' },
                    { label: 'Expirée (non payée)', value: 'expired' },
                    { label: 'Terminée', value: 'completed' },
                  ],
                },
                { name: 'quantity', label: 'Participants', type: 'number', defaultValue: 1, min: 1, required: true },
              ],
            },
            {
              name: 'participants',
              label: 'Noms des participants',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'name', label: 'Nom', type: 'text', required: true },
                    { name: 'email', label: 'E-mail', type: 'email' },
                  ],
                },
              ],
            },
            {
              name: 'source',
              label: 'Origine',
              type: 'select',
              defaultValue: 'manual',
              options: [
                { label: 'Site internet', value: 'online' },
                { label: 'Téléphone', value: 'phone' },
                { label: 'E-mail', value: 'email' },
                { label: 'En personne', value: 'in-person' },
                { label: 'Saisie manuelle', value: 'manual' },
              ],
            },
            { name: 'notes', label: 'Notes', type: 'textarea' },
            { name: 'customerMessage', label: 'Message du client', type: 'textarea', admin: { readOnly: true } },
          ],
        },
        {
          label: 'Client',
          fields: [
            { name: 'customer', label: 'Fiche client', type: 'relationship', relationTo: 'customers', required: true },
            {
              type: 'row',
              fields: [
                { name: 'customerName', label: 'Nom', type: 'text' },
                { name: 'customerEmail', label: 'E-mail', type: 'email' },
                { name: 'customerPhone', label: 'Téléphone', type: 'text' },
              ],
            },
            {
              name: 'timezone',
              label: 'Fuseau horaire du client',
              type: 'text',
              admin: { readOnly: true, description: 'Utilisé pour afficher l’heure locale dans les e-mails.' },
            },
          ],
        },
        {
          label: 'Paiement',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'amountTotal', label: 'Montant total (XPF)', type: 'number', required: true, min: 0, defaultValue: 0 },
                { name: 'amountDueNow', label: 'À payer à la réservation (XPF)', type: 'number', min: 0 },
                { name: 'balanceDueDate', label: 'Solde à régler avant le', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'amountPaid', label: 'Déjà payé (XPF)', type: 'number', admin: { readOnly: true } },
                { name: 'balance', label: 'Reste à payer (XPF)', type: 'number', admin: { readOnly: true } },
                {
                  name: 'paymentStatus',
                  label: 'Paiement',
                  type: 'select',
                  admin: { readOnly: true },
                  options: [
                    { label: 'Non payé', value: 'unpaid' },
                    { label: 'Partiellement payé', value: 'partial' },
                    { label: 'Payé', value: 'paid' },
                    { label: 'Remboursé', value: 'refunded' },
                    { label: 'Gratuit', value: 'free' },
                  ],
                },
              ],
            },
            {
              name: 'lines',
              label: 'Détail',
              type: 'array',
              admin: { readOnly: true },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', type: 'text' },
                    { name: 'unitPrice', type: 'number' },
                    { name: 'quantity', type: 'number' },
                  ],
                },
              ],
            },
            {
              name: 'payments',
              label: 'Paiements et remboursements',
              type: 'array',
              admin: {
                description:
                  'Les paiements en ligne s’ajoutent automatiquement. Ajoutez ici un paiement en espèces, virement ou carte sur place.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'kind',
                      label: 'Type',
                      type: 'select',
                      defaultValue: 'payment',
                      options: [
                        { label: 'Paiement', value: 'payment' },
                        { label: 'Remboursement', value: 'refund' },
                      ],
                    },
                    { name: 'amount', label: 'Montant (XPF)', type: 'number', required: true, min: 0 },
                    {
                      name: 'method',
                      label: 'Moyen',
                      type: 'select',
                      defaultValue: 'cash',
                      options: [
                        { label: 'Carte en ligne (Mobupay)', value: 'online' },
                        { label: 'Espèces', value: 'cash' },
                        { label: 'Virement', value: 'transfer' },
                        { label: 'Carte sur place', value: 'card' },
                        { label: 'Carnet de séances', value: 'credit' },
                        { label: 'Autre', value: 'other' },
                      ],
                    },
                    { name: 'date', label: 'Date', type: 'date', defaultValue: () => new Date().toISOString() },
                  ],
                },
                { name: 'providerRef', label: 'Référence', type: 'text', admin: { readOnly: true } },
              ],
            },
            {
              name: 'refundAction',
              type: 'ui',
              admin: { components: { Field: '/components/admin/BookingActions#BookingActions' } },
            },
          ],
        },
        {
          label: 'Technique',
          admin: { condition: (_d, _s, { user }) => (user as { role?: string })?.role === 'admin' },
          fields: [
            { name: 'mobupayPaymentId', type: 'text', index: true, admin: { readOnly: true } },
            { name: 'checkoutUrl', type: 'text', admin: { readOnly: true } },
            { name: 'holdExpiresAt', type: 'date', index: true, admin: { readOnly: true } },
            { name: 'slotKey', type: 'text', unique: true, admin: { readOnly: true } },
            { name: 'accessToken', type: 'text', index: true, admin: { readOnly: true } },
            { name: 'confirmationSentAt', type: 'date', admin: { readOnly: true } },
            { name: 'reminderSentAt', type: 'date', admin: { readOnly: true } },
            { name: 'balanceLinkSentAt', type: 'date', admin: { readOnly: true } },
            { name: 'usedPackage', type: 'relationship', relationTo: 'customer-packages', admin: { readOnly: true } },
            { name: 'purchasedPackage', type: 'relationship', relationTo: 'packages', admin: { readOnly: true } },
          ],
        },
      ],
    },
    {
      name: 'code',
      label: 'Numéro',
      type: 'text',
      unique: true,
      index: true,
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'when',
      label: 'Date',
      type: 'text',
      admin: { position: 'sidebar', readOnly: true },
      hooks: {
        beforeChange: [
          async ({ data, req }) => {
            if (data?.slotStart) {
              return new Date(data.slotStart).toLocaleString('fr-FR', {
                dateStyle: 'medium',
                timeStyle: 'short',
                timeZone: 'Pacific/Tahiti',
              })
            }
            const occ = idOf(data?.occurrence)
            if (occ) {
              const o = await req.payload.findByID({ collection: 'occurrences', id: occ, depth: 0, req }).catch(() => null)
              if (o?.startsAt)
                return new Date(o.startsAt).toLocaleDateString('fr-FR', { dateStyle: 'medium', timeZone: 'Pacific/Tahiti' })
            }
            return data?.when ?? ''
          },
        ],
      },
    },
  ],
}
