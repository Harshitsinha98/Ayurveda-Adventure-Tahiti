import type { CollectionConfig, Condition } from 'payload'

import { publicRead, staffOnly } from '@/access'
import { seoGroup, slugField } from '@/fields/slug'

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
  labels: { singular: 'Offre', plural: 'Offres et voyages' },
  admin: {
    group: 'Réservations',
    useAsTitle: 'title',
    defaultColumns: ['title', 'kind', 'price', 'published', 'order'],
    description:
      'Séances, formations, ateliers, conférences et voyages. Les dates se gèrent dans « Dates et sessions ».',
    listSearchableFields: ['title', 'summary'],
  },
  defaultSort: 'order',
  access: { read: publicRead, create: staffOnly, update: staffOnly, delete: staffOnly },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Présentation',
          fields: [
            { name: 'title', localized: true, label: 'Titre', type: 'text', required: true },
            {
              type: 'row',
              fields: [
                {
                  name: 'kind',
                  label: 'Type',
                  type: 'select',
                  required: true,
                  defaultValue: 'seance',
                  options: [
                    { label: 'Séance individuelle (créneaux)', value: 'seance' },
                    { label: 'Formation (plusieurs dates)', value: 'formation' },
                    { label: 'Atelier / cours / événement', value: 'atelier' },
                    { label: 'Conférence (sur demande)', value: 'conference' },
                    { label: 'Voyage / retraite', value: 'voyage' },
                  ],
                },
                {
                  name: 'mode',
                  label: 'Lieu',
                  type: 'select',
                  defaultValue: 'presentiel',
                  options: [
                    { label: 'En présentiel', value: 'presentiel' },
                    { label: 'En ligne', value: 'en-ligne' },
                    { label: 'En ligne ou en présentiel', value: 'hybride' },
                    { label: 'À l’étranger', value: 'etranger' },
                  ],
                },
              ],
            },
            { name: 'kicker', localized: true, label: 'Accroche courte', type: 'text', admin: { description: 'Ex. « Un premier échange »' } },
            { name: 'summary', localized: true, label: 'Résumé', type: 'textarea', required: true },
            { name: 'description', localized: true, label: 'Description complète', type: 'richText' },
            { name: 'image', label: 'Image principale', type: 'upload', relationTo: 'media' },
            {
              name: 'gallery',
              label: 'Galerie photos',
              type: 'array',
              admin: { condition: is('voyage', 'formation', 'atelier') },
              fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
            },
            {
              name: 'highlights', localized: true,
              label: 'Points forts',
              type: 'array',
              fields: [{ name: 'text', label: 'Point fort', type: 'text', required: true }],
            },
            {
              name: 'sections',
              localized: true,
              label: 'Rubriques supplémentaires',
              labels: { singular: 'Rubrique', plural: 'Rubriques' },
              type: 'array',
              admin: {
                initCollapsed: true,
                description:
                  'Blocs libres affichés sur la page, par ex. « Hébergement au cœur de la Kumbha Mela » ou « Bon à savoir » : un titre, un texte et, si besoin, une liste à puces.',
              },
              fields: [
                { name: 'title', label: 'Titre', type: 'text', required: true },
                { name: 'text', label: 'Texte', type: 'textarea', admin: { description: 'Laisser une ligne vide entre deux paragraphes.' } },
                { name: 'items', label: 'Liste à puces', labels: { singular: 'Ligne', plural: 'Lignes' }, type: 'array', fields: [{ name: 'text', label: 'Texte', type: 'text', required: true }] },
              ],
            },
          ],
        },
        {
          label: 'Prix et réservation',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'price',
                  label: 'Prix (XPF)',
                  type: 'number',
                  min: 0,
                  admin: { description: '0 = gratuit. Laisser vide si prix sur demande.', step: 100 },
                },
                {
                  name: 'durationMinutes',
                  label: 'Durée (minutes)',
                  type: 'number',
                  min: 5,
                  admin: { condition: is('seance', 'atelier', 'conference') },
                },
              ],
            },
            { name: 'priceNote', localized: true, label: 'Précision sur le prix', type: 'text', admin: { description: 'Ex. « hors vols Papeete – Delhi »' } },
            {
              name: 'bookingMode',
              label: 'Réservation en ligne',
              type: 'select',
              required: true,
              defaultValue: 'online',
              options: [
                { label: 'Réservation et paiement en ligne', value: 'online' },
                { label: 'Réservation sans paiement (gratuit / à régler sur place)', value: 'free' },
                { label: 'Sur demande (formulaire de contact)', value: 'request' },
                { label: 'Fermée', value: 'closed' },
              ],
            },
            {
              name: 'priceOptions',
              label: 'Tarifs différents',
              type: 'array',
              admin: { description: 'Ex. tarif réduit, tarif membre. Le client choisit au moment de réserver.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', localized: true, label: 'Nom du tarif', type: 'text', required: true },
                    { name: 'price', label: 'Prix (XPF)', type: 'number', required: true, min: 0 },
                  ],
                },
              ],
            },
            {
              name: 'extras',
              label: 'Options et suppléments',
              type: 'array',
              admin: { description: 'Ex. extension Agra, chambre individuelle.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', localized: true, label: 'Option', type: 'text', required: true },
                    { name: 'price', label: 'Prix (XPF)', type: 'number', required: true, min: 0 },
                  ],
                },
                { name: 'description', localized: true, label: 'Précision', type: 'text' },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'maxPerBooking',
                  label: 'Participants max. par réservation',
                  type: 'number',
                  defaultValue: 1,
                  min: 1,
                  admin: { description: 'Au-delà de 1, le client peut réserver pour un groupe.' },
                },
                {
                  name: 'depositPercent',
                  label: 'Acompte à la réservation (%)',
                  type: 'number',
                  min: 0,
                  max: 100,
                  admin: { description: 'Vide ou 0 = paiement total. Ex. 30 pour un acompte de 30 %.' },
                },
              ],
            },
            {
              name: 'balanceDueDaysBefore',
              label: 'Solde à régler (jours avant le départ)',
              type: 'number',
              min: 0,
              admin: { condition: (d) => Number(d?.depositPercent) > 0 },
            },
            {
              name: 'creditEligible',
              label: 'Réservable avec un carnet de séances',
              type: 'checkbox',
              defaultValue: false,
              admin: { condition: is('seance') },
            },
            { name: 'cancellationPolicy', localized: true, label: 'Conditions d’annulation', type: 'textarea' },
            {
              name: 'location',
              label: 'Adresse / lieu',
              type: 'text',
              admin: { description: 'Ex. Punaauia. Pour une séance en ligne : lien envoyé après réservation.' },
            },
            {
              name: 'meetingUrl',
              label: 'Lien de visioconférence (séances en ligne)',
              type: 'text',
              admin: {
                condition: (d) => d?.mode === 'en-ligne' || d?.mode === 'hybride',
                description: 'Envoyé uniquement dans l’e-mail de confirmation.',
              },
            },
          ],
        },
        {
          label: 'Voyage',
          admin: { condition: is('voyage') },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'tripStart', label: 'Départ', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
                { name: 'tripEnd', label: 'Retour', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
              ],
            },
            { name: 'tripRegion', localized: true, label: 'Région', type: 'text', admin: { description: 'Ex. Himalaya · Uttarakhand' } },
            { name: 'guide', localized: true, label: 'Accompagnement', type: 'text' },
            {
              name: 'itinerary', localized: true,
              label: 'Itinéraire jour par jour',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'day', label: 'Jour', type: 'text', required: true, admin: { width: '25%', description: 'Ex. « Jour 1 · 26.02 »' } },
                    { name: 'title', localized: true, label: 'Étape', type: 'text', required: true },
                  ],
                },
                { name: 'text', label: 'Description', type: 'textarea' },
              ],
            },
            {
              name: 'included', localized: true,
              label: 'Le prix comprend',
              type: 'array',
              fields: [{ name: 'text', type: 'text', required: true }],
            },
            {
              name: 'notIncluded', localized: true,
              label: 'Le prix ne comprend pas',
              type: 'array',
              fields: [{ name: 'text', type: 'text', required: true }],
            },
            {
              name: 'presentationUrl',
              label: 'Présentation interactive (lien Canva, Genially…)',
              type: 'text',
              admin: { description: 'Affichée sur la page du voyage si renseignée.' },
            },
          ],
        },
        { label: 'Référencement', fields: [seoGroup] },
      ],
    },
    slugField(),
    {
      name: 'published',
      label: 'Visible sur le site',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      label: 'Mise en avant sur l’accueil',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    { name: 'order', label: 'Ordre d’affichage', type: 'number', defaultValue: 10, admin: { position: 'sidebar' } },
  ],
}
