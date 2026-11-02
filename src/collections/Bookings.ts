import { APIError, type CollectionBeforeChangeHook, type CollectionConfig } from 'payload'

import { staffOnly } from '@/access'
import { HOLDING, releaseSeats, reserveSeats } from '@/lib/booking/capacity'
import { bookingEndpoints } from '@/endpoints/bookingAdmin'
import { L } from '@/lib/admin-labels'

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
  labels: { singular: L('Réservation', 'Booking'), plural: L('Réservations', 'Bookings') },
  admin: {
    group: L('Réservations', 'Bookings'),
    useAsTitle: 'code',
    defaultColumns: ['code', 'customerName', 'offering', 'when', 'status', 'paymentStatus', 'amountTotal'],
    listSearchableFields: ['code', 'customerName', 'customerEmail'],
    description: L(
      'Toutes les réservations. Pour une réservation reçue par téléphone ou en personne : « Créer nouveau ».',
      'All bookings. For a booking taken by phone or in person: use “Create new”.',
    ),
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
          label: L('Réservation', 'Booking'),
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'offering', label: L('Offre', 'Offering'), type: 'relationship', relationTo: 'offerings', required: true },
                {
                  name: 'occurrence',
                  label: L('Date', 'Date'),
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
                  label: L('Rendez-vous : début', 'Appointment: start'),
                  type: 'date',
                  admin: {
                    date: { pickerAppearance: 'dayAndTime', timeFormat: 'HH:mm', displayFormat: 'd MMM yyyy HH:mm' },
                    condition: (d) => !d?.occurrence,
                  },
                },
                {
                  name: 'slotEnd',
                  label: L('Rendez-vous : fin', 'Appointment: end'),
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
                  label: L('Statut', 'Status'),
                  type: 'select',
                  required: true,
                  defaultValue: 'confirmed',
                  options: [
                    { label: L('En attente de paiement', 'Awaiting payment'), value: 'pending' },
                    { label: L('Confirmée', 'Confirmed'), value: 'confirmed' },
                    { label: L('Annulée', 'Cancelled'), value: 'cancelled' },
                    { label: L('Expirée (non payée)', 'Expired (unpaid)'), value: 'expired' },
                    { label: L('Terminée', 'Completed'), value: 'completed' },
                  ],
                },
                { name: 'quantity', label: L('Participants', 'Participants'), type: 'number', defaultValue: 1, min: 1, required: true },
              ],
            },
            {
              name: 'participants',
              label: L('Noms des participants', 'Participant names'),
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'name', label: L('Nom', 'Name'), type: 'text', required: true },
                    { name: 'email', label: L('E-mail', 'Email'), type: 'email' },
                  ],
                },
              ],
            },
            {
              name: 'source',
              label: L('Origine', 'Source'),
              type: 'select',
              defaultValue: 'manual',
              options: [
                { label: L('Site internet', 'Website'), value: 'online' },
                { label: L('Téléphone', 'Phone'), value: 'phone' },
                { label: L('E-mail', 'Email'), value: 'email' },
                { label: L('En personne', 'In person'), value: 'in-person' },
                { label: L('Saisie manuelle', 'Manual entry'), value: 'manual' },
              ],
            },
            { name: 'notes', label: L('Notes', 'Notes'), type: 'textarea' },
            { name: 'customerMessage', label: L('Message du client', 'Customer message'), type: 'textarea', admin: { readOnly: true } },
          ],
        },
        {
          label: L('Client', 'Customer'),
          fields: [
            { name: 'customer', label: L('Fiche client', 'Customer record'), type: 'relationship', relationTo: 'customers', required: true },
            {
              type: 'row',
              fields: [
                { name: 'customerName', label: L('Nom', 'Name'), type: 'text' },
                { name: 'customerEmail', label: L('E-mail', 'Email'), type: 'email' },
                { name: 'customerPhone', label: L('Téléphone', 'Phone'), type: 'text' },
              ],
            },
            {
              name: 'timezone',
              label: L('Fuseau horaire du client', 'Customer time zone'),
              type: 'text',
              admin: { readOnly: true, description: L('Utilisé pour afficher l’heure locale dans les e-mails.', 'Used to display the local time in emails.') },
            },
          ],
        },
        {
          label: L('Paiement', 'Payment'),
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'amountTotal', label: L('Montant total (XPF)', 'Total amount (XPF)'), type: 'number', required: true, min: 0, defaultValue: 0 },
                { name: 'amountDueNow', label: L('À payer à la réservation (XPF)', 'Due at booking (XPF)'), type: 'number', min: 0 },
                { name: 'balanceDueDate', label: L('Solde à régler avant le', 'Balance due by'), type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'amountPaid', label: L('Déjà payé (XPF)', 'Already paid (XPF)'), type: 'number', admin: { readOnly: true } },
                { name: 'balance', label: L('Reste à payer (XPF)', 'Balance due (XPF)'), type: 'number', admin: { readOnly: true } },
                {
                  name: 'paymentStatus',
                  label: L('Paiement', 'Payment'),
                  type: 'select',
                  admin: { readOnly: true },
                  options: [
                    { label: L('Non payé', 'Unpaid'), value: 'unpaid' },
                    { label: L('Partiellement payé', 'Partially paid'), value: 'partial' },
                    { label: L('Payé', 'Paid'), value: 'paid' },
                    { label: L('Remboursé', 'Refunded'), value: 'refunded' },
                    { label: L('Gratuit', 'Free'), value: 'free' },
                  ],
                },
              ],
            },
            {
              name: 'lines',
              label: L('Détail', 'Breakdown'),
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
              label: L('Paiements et remboursements', 'Payments and refunds'),
              type: 'array',
              admin: {
                description: L(
                  'Les paiements en ligne s’ajoutent automatiquement. Ajoutez ici un paiement en espèces, virement ou carte sur place.',
                  'Online payments are added automatically. Add a cash, bank transfer or on-site card payment here.',
                ),
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'kind',
                      label: L('Type', 'Type'),
                      type: 'select',
                      defaultValue: 'payment',
                      options: [
                        { label: L('Paiement', 'Payment'), value: 'payment' },
                        { label: L('Remboursement', 'Refund'), value: 'refund' },
                      ],
                    },
                    { name: 'amount', label: L('Montant (XPF)', 'Amount (XPF)'), type: 'number', required: true, min: 0 },
                    {
                      name: 'method',
                      label: L('Moyen', 'Method'),
                      type: 'select',
                      defaultValue: 'cash',
                      options: [
                        { label: L('Carte en ligne (Mobupay)', 'Online card (Mobupay)'), value: 'online' },
                        { label: L('Espèces', 'Cash'), value: 'cash' },
                        { label: L('Virement', 'Bank transfer'), value: 'transfer' },
                        { label: L('Carte sur place', 'On-site card'), value: 'card' },
                        { label: L('Carnet de séances', 'Session package'), value: 'credit' },
                        { label: L('Autre', 'Other'), value: 'other' },
                      ],
                    },
                    { name: 'date', label: L('Date', 'Date'), type: 'date', defaultValue: () => new Date().toISOString() },
                  ],
                },
                { name: 'providerRef', label: L('Référence', 'Reference'), type: 'text', admin: { readOnly: true } },
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
          label: L('Technique', 'Technical'),
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
      label: L('Numéro', 'Reference'),
      type: 'text',
      unique: true,
      index: true,
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'when',
      label: L('Date', 'Date'),
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
