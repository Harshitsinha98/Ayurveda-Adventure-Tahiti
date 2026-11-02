import type { CollectionConfig, Condition } from 'payload'

import { publicRead, staffOnly } from '@/access'
import { seoGroup, slugField } from '@/fields/slug'
import { L } from '@/lib/admin-labels'

const is =
  (...kinds: string[]): Condition =>
  (data) =>
    kinds.includes(data?.kind)

/**
 * Everything Eliane sells: individual sessions, courses, workshops,
 * conferences and journeys. The `kind` decides how booking works.
 */
export const Offerings: CollectionConfig = {
  slug: 'offerings',
  labels: { singular: L('Offre', 'Offering'), plural: L('Offres et voyages', 'Offerings & journeys') },
  admin: {
    group: L('Réservations', 'Bookings'),
    useAsTitle: 'title',
    defaultColumns: ['title', 'kind', 'price', 'published', 'order'],
    description: L(
      'Séances, formations, ateliers, conférences et voyages. Les dates se gèrent dans « Dates et sessions ».',
      'Sessions, courses, workshops, talks and journeys. Dates are managed in “Dates & sessions”.',
    ),
    listSearchableFields: ['title', 'summary'],
  },
  defaultSort: 'order',
  access: { read: publicRead, create: staffOnly, update: staffOnly, delete: staffOnly },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: L('Présentation', 'Presentation'),
          fields: [
            { name: 'title', localized: true, label: L('Titre', 'Title'), type: 'text', required: true },
            {
              type: 'row',
              fields: [
                {
                  name: 'kind',
                  label: L('Type', 'Type'),
                  type: 'select',
                  required: true,
                  defaultValue: 'seance',
                  options: [
                    { label: L('Séance individuelle (créneaux)', 'Individual session (time slots)'), value: 'seance' },
                    { label: L('Formation (plusieurs dates)', 'Course (several dates)'), value: 'formation' },
                    { label: L('Atelier / cours / événement', 'Workshop / class / event'), value: 'atelier' },
                    { label: L('Conférence (sur demande)', 'Talk (on request)'), value: 'conference' },
                    { label: L('Voyage / retraite', 'Journey / retreat'), value: 'voyage' },
                  ],
                },
                {
                  name: 'mode',
                  label: L('Lieu', 'Location'),
                  type: 'select',
                  defaultValue: 'presentiel',
                  options: [
                    { label: L('En présentiel', 'In person'), value: 'presentiel' },
                    { label: L('En ligne', 'Online'), value: 'en-ligne' },
                    { label: L('En ligne ou en présentiel', 'Online or in person'), value: 'hybride' },
                    { label: L('À l’étranger', 'Abroad'), value: 'etranger' },
                  ],
                },
              ],
            },
            { name: 'kicker', localized: true, label: L('Accroche courte', 'Short tagline'), type: 'text', admin: { description: L('Ex. « Un premier échange »', 'E.g. “A first conversation”') } },
            { name: 'summary', localized: true, label: L('Résumé', 'Summary'), type: 'textarea', required: true },
            { name: 'description', localized: true, label: L('Description complète', 'Full description'), type: 'richText' },
            { name: 'image', label: L('Image principale', 'Main image'), type: 'upload', relationTo: 'media' },
            {
              name: 'gallery',
              label: L('Galerie photos', 'Photo gallery'),
              type: 'array',
              admin: { condition: is('voyage', 'formation', 'atelier') },
              fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
            },
            {
              name: 'highlights', localized: true,
              label: L('Points forts', 'Highlights'),
              type: 'array',
              fields: [{ name: 'text', label: L('Point fort', 'Highlight'), type: 'text', required: true }],
            },
            {
              name: 'sections',
              localized: true,
              label: L('Rubriques supplémentaires', 'Additional sections'),
              labels: { singular: L('Rubrique', 'Section'), plural: L('Rubriques', 'Sections') },
              type: 'array',
              admin: {
                initCollapsed: true,
                description: L(
                  'Blocs libres affichés sur la page, par ex. « Hébergement au cœur de la Kumbha Mela » ou « Bon à savoir » : un titre, un texte et, si besoin, une liste à puces.',
                  'Free-form blocks shown on the page, e.g. “Accommodation at the heart of the Kumbha Mela” or “Good to know”: a title, some text and, if needed, a bullet list.',
                ),
              },
              fields: [
                { name: 'title', label: L('Titre', 'Title'), type: 'text', required: true },
                { name: 'text', label: L('Texte', 'Text'), type: 'textarea', admin: { description: L('Laisser une ligne vide entre deux paragraphes.', 'Leave a blank line between two paragraphs.') } },
                { name: 'items', label: L('Liste à puces', 'Bullet list'), labels: { singular: L('Ligne', 'Line'), plural: L('Lignes', 'Lines') }, type: 'array', fields: [{ name: 'text', label: L('Texte', 'Text'), type: 'text', required: true }] },
              ],
            },
          ],
        },
        {
          label: L('Prix et réservation', 'Pricing & booking'),
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'price',
                  label: L('Prix (XPF)', 'Price (XPF)'),
                  type: 'number',
                  min: 0,
                  admin: { description: L('0 = gratuit. Laisser vide si prix sur demande.', '0 = free. Leave empty if price on request.'), step: 100 },
                },
                {
                  name: 'durationMinutes',
                  label: L('Durée (minutes)', 'Duration (minutes)'),
                  type: 'number',
                  min: 5,
                  admin: { condition: is('seance', 'atelier', 'conference') },
                },
              ],
            },
            { name: 'priceNote', localized: true, label: L('Précision sur le prix', 'Price note'), type: 'text', admin: { description: L('Ex. « hors vols Papeete – Delhi »', 'E.g. “excluding Papeete – Delhi flights”') } },
            {
              name: 'bookingMode',
              label: L('Réservation en ligne', 'Online booking'),
              type: 'select',
              required: true,
              defaultValue: 'online',
              options: [
                { label: L('Réservation et paiement en ligne', 'Online booking and payment'), value: 'online' },
                { label: L('Réservation sans paiement (gratuit / à régler sur place)', 'Booking without payment (free / pay on site)'), value: 'free' },
                { label: L('Sur demande (formulaire de contact)', 'On request (contact form)'), value: 'request' },
                { label: L('Fermée', 'Closed'), value: 'closed' },
              ],
            },
            {
              name: 'priceOptions',
              label: L('Tarifs différents', 'Alternative rates'),
              type: 'array',
              admin: { description: L('Ex. tarif réduit, tarif membre. Le client choisit au moment de réserver.', 'E.g. reduced rate, member rate. The client chooses when booking.') },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', localized: true, label: L('Nom du tarif', 'Rate name'), type: 'text', required: true },
                    { name: 'price', label: L('Prix (XPF)', 'Price (XPF)'), type: 'number', required: true, min: 0 },
                  ],
                },
              ],
            },
            {
              name: 'extras',
              label: L('Options et suppléments', 'Options & add-ons'),
              type: 'array',
              admin: { description: L('Ex. extension Agra, chambre individuelle.', 'E.g. Agra extension, single room.') },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', localized: true, label: L('Option', 'Option'), type: 'text', required: true },
                    { name: 'price', label: L('Prix (XPF)', 'Price (XPF)'), type: 'number', required: true, min: 0 },
                  ],
                },
                { name: 'description', localized: true, label: L('Précision', 'Detail'), type: 'text' },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'maxPerBooking',
                  label: L('Participants max. par réservation', 'Max participants per booking'),
                  type: 'number',
                  defaultValue: 1,
                  min: 1,
                  admin: { description: L('Au-delà de 1, le client peut réserver pour un groupe.', 'Above 1, the client can book for a group.') },
                },
                {
                  name: 'depositPercent',
                  label: L('Acompte à la réservation (%)', 'Deposit at booking (%)'),
                  type: 'number',
                  min: 0,
                  max: 100,
                  admin: { description: L('Vide ou 0 = paiement total. Ex. 30 pour un acompte de 30 %.', 'Empty or 0 = full payment. E.g. 30 for a 30% deposit.') },
                },
              ],
            },
            {
              name: 'balanceDueDaysBefore',
              label: L('Solde à régler (jours avant le départ)', 'Balance due (days before departure)'),
              type: 'number',
              min: 0,
              admin: { condition: (d) => Number(d?.depositPercent) > 0 },
            },
            {
              name: 'creditEligible',
              label: L('Réservable avec un carnet de séances', 'Bookable with a session package'),
              type: 'checkbox',
              defaultValue: false,
              admin: { condition: is('seance') },
            },
            { name: 'cancellationPolicy', localized: true, label: L('Conditions d’annulation', 'Cancellation policy'), type: 'textarea' },
            {
              name: 'location',
              label: L('Adresse / lieu', 'Address / location'),
              type: 'text',
              admin: { description: L('Ex. Punaauia. Pour une séance en ligne : lien envoyé après réservation.', 'E.g. Punaauia. For an online session: link sent after booking.') },
            },
            {
              name: 'meetingUrl',
              label: L('Lien de visioconférence (séances en ligne)', 'Video call link (online sessions)'),
              type: 'text',
              admin: {
                condition: (d) => d?.mode === 'en-ligne' || d?.mode === 'hybride',
                description: L('Envoyé uniquement dans l’e-mail de confirmation.', 'Sent only in the confirmation email.'),
              },
            },
          ],
        },
        {
          label: L('Voyage', 'Journey'),
          admin: { condition: is('voyage') },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'tripStart', label: L('Départ', 'Departure'), type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
                { name: 'tripEnd', label: L('Retour', 'Return'), type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
              ],
            },
            { name: 'tripRegion', localized: true, label: L('Région', 'Region'), type: 'text', admin: { description: L('Ex. Himalaya · Uttarakhand', 'E.g. Himalaya · Uttarakhand') } },
            { name: 'guide', localized: true, label: L('Accompagnement', 'Guiding'), type: 'text' },
            {
              name: 'itinerary', localized: true,
              label: L('Itinéraire jour par jour', 'Day-by-day itinerary'),
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'day', label: L('Jour', 'Day'), type: 'text', required: true, admin: { width: '25%', description: L('Ex. « Jour 1 · 26.02 »', 'E.g. “Day 1 · 26.02”') } },
                    { name: 'title', localized: true, label: L('Étape', 'Stage'), type: 'text', required: true },
                  ],
                },
                { name: 'text', label: L('Description', 'Description'), type: 'textarea' },
              ],
            },
            {
              name: 'included', localized: true,
              label: L('Le prix comprend', 'The price includes'),
              type: 'array',
              fields: [{ name: 'text', type: 'text', required: true }],
            },
            {
              name: 'notIncluded', localized: true,
              label: L('Le prix ne comprend pas', 'The price does not include'),
              type: 'array',
              fields: [{ name: 'text', type: 'text', required: true }],
            },
            {
              name: 'presentationUrl',
              label: L('Présentation interactive (lien Canva, Genially…)', 'Interactive presentation (Canva, Genially link…)'),
              type: 'text',
              admin: { description: L('Affichée sur la page du voyage si renseignée.', 'Shown on the journey page if provided.') },
            },
          ],
        },
        { label: L('Référencement', 'SEO'), fields: [seoGroup] },
      ],
    },
    slugField(),
    {
      name: 'published',
      label: L('Visible sur le site', 'Visible on the site'),
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      label: L('Mise en avant sur l’accueil', 'Featured on the homepage'),
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    { name: 'order', label: L('Ordre d’affichage', 'Display order'), type: 'number', defaultValue: 10, admin: { position: 'sidebar' } },
  ],
}
