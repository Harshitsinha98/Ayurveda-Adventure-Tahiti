import type { GlobalConfig } from 'payload'

import { publicRead, staffOnly } from '@/access'

const days = [
  { label: 'Lundi', value: 'lun' },
  { label: 'Mardi', value: 'mar' },
  { label: 'Mercredi', value: 'mer' },
  { label: 'Jeudi', value: 'jeu' },
  { label: 'Vendredi', value: 'ven' },
  { label: 'Samedi', value: 'sam' },
  { label: 'Dimanche', value: 'dim' },
]

const hhmm = { validate: (v: unknown) => (typeof v === 'string' && /^\d{2}:\d{2}$/.test(v)) || 'Format HH:MM, ex. 09:00' }

export const SiteSettings: GlobalConfig = {
  slug: 'site',
  label: 'Coordonnées et réseaux',
  admin: { group: 'Contenu' },
  access: { read: publicRead, update: staffOnly },
  fields: [
    { name: 'phone', label: 'Téléphone', type: 'text', defaultValue: '87 78 44 79' },
    { name: 'whatsapp', label: 'Numéro WhatsApp (format international, sans +)', type: 'text', defaultValue: '68987784479' },
    { name: 'email', label: 'E-mail', type: 'email', defaultValue: 'eliane@ayurveda-tahiti.com' },
    { name: 'address', label: 'Lieu', type: 'text', defaultValue: 'Punaauia, Tahiti – Polynésie française' },
    { name: 'instagram', label: 'Instagram (lien)', type: 'text', defaultValue: 'https://www.instagram.com/ayurvedatahiti/' },
    { name: 'facebook', label: 'Facebook (lien)', type: 'text' },
    {
      name: 'legal',
      label: 'Mentions légales',
      type: 'group',
      fields: [
        { name: 'entity', label: 'Structure', type: 'text', defaultValue: 'Association Ayurveda Adventure Tahiti' },
        { name: 'registration', label: 'Numéro TAHITI', type: 'text', defaultValue: 'F38758' },
        { name: 'representative', label: 'Responsable de la publication', type: 'text', defaultValue: 'Eliane Poeauru Koller Valadier' },
        { name: 'host', label: 'Hébergeur', type: 'text', defaultValue: 'Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis' },
        { name: 'terms', label: 'Conditions générales de vente', type: 'richText' },
        { name: 'privacy', label: 'Politique de confidentialité', type: 'richText' },
      ],
    },
  ],
}

export const HomePage: GlobalConfig = {
  slug: 'home',
  label: 'Page d’accueil',
  admin: { group: 'Contenu' },
  access: { read: publicRead, update: staffOnly },
  fields: [
    { name: 'eyebrow', label: 'Petite ligne au-dessus du titre', type: 'text', defaultValue: 'Ayurveda · Méditation · Yoga · Sciences védiques' },
    {
      name: 'headline',
      label: 'Titre (une ligne par phrase)',
      type: 'array',
      minRows: 1,
      maxRows: 4,
      fields: [{ name: 'line', type: 'text', required: true }],
    },
    { name: 'intro', label: 'Texte d’introduction', type: 'textarea' },
    { name: 'heroImage', label: 'Photo principale', type: 'upload', relationTo: 'media' },
    { name: 'manifesto', label: 'Grand texte « La vie est belle »', type: 'textarea' },
    { name: 'manifestoAside', label: 'Phrase finale du grand texte', type: 'text' },
    {
      name: 'ritual',
      label: 'Bloc « Ta journée commence… »',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'text', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'pillars',
      label: 'Les 6 piliers',
      type: 'array',
      maxRows: 6,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'text', type: 'text' },
      ],
    },
  ],
}

export const AboutPage: GlobalConfig = {
  slug: 'about',
  label: 'Page « À propos »',
  admin: { group: 'Contenu' },
  access: { read: publicRead, update: staffOnly },
  fields: [
    { name: 'title', label: 'Nom affiché', type: 'text', defaultValue: 'Eliane Poeauru Koller Valadier' },
    { name: 'lead', label: 'Phrase d’ouverture', type: 'text' },
    { name: 'portrait', label: 'Portrait', type: 'upload', relationTo: 'media' },
    { name: 'body', label: 'Texte', type: 'richText' },
    {
      name: 'chapters',
      label: 'Étapes du parcours',
      type: 'array',
      fields: [
        { name: 'place', label: 'Lieu / période', type: 'text', required: true },
        { name: 'text', type: 'textarea', required: true },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'credentials',
      label: 'Formations et certifications',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'badge', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}

export const BookingSettings: GlobalConfig = {
  slug: 'booking-settings',
  label: 'Disponibilités et réservations',
  admin: {
    group: 'Réservations',
    description: 'Horaires des séances individuelles (heure de Tahiti), congés et règles de réservation.',
  },
  access: { read: publicRead, update: staffOnly },
  fields: [
    {
      name: 'weekly',
      label: 'Disponibilités de la semaine',
      type: 'array',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'day', label: 'Jour', type: 'select', options: days, required: true },
            { name: 'start', label: 'De', type: 'text', required: true, defaultValue: '09:00', ...hhmm },
            { name: 'end', label: 'À', type: 'text', required: true, defaultValue: '17:00', ...hhmm },
          ],
        },
      ],
    },
    {
      name: 'blocked',
      label: 'Indisponibilités (congés, voyages)',
      type: 'array',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'from', label: 'Du', type: 'date', required: true, admin: { date: { pickerAppearance: 'dayOnly' } } },
            { name: 'to', label: 'Au', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
            { name: 'reason', label: 'Motif (interne)', type: 'text' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'minNoticeHours', label: 'Délai minimum avant un rendez-vous (heures)', type: 'number', defaultValue: 24, min: 0 },
        { name: 'horizonDays', label: 'Réservable jusqu’à (jours)', type: 'number', defaultValue: 60, min: 7 },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'bufferMinutes', label: 'Pause entre deux rendez-vous (min)', type: 'number', defaultValue: 15, min: 0 },
        { name: 'stepMinutes', label: 'Intervalle des créneaux (min)', type: 'number', defaultValue: 30, min: 15 },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'holdMinutes', label: 'Place gardée pendant le paiement (min)', type: 'number', defaultValue: 20, min: 5, max: 60 },
        { name: 'reminderHours', label: 'Rappel envoyé avant (heures)', type: 'number', defaultValue: 24, min: 1 },
        { name: 'cancelHours', label: 'Annulation possible jusqu’à (heures avant)', type: 'number', defaultValue: 24, min: 0 },
      ],
    },
    { name: 'notifyEmail', label: 'E-mail qui reçoit les nouvelles réservations', type: 'email', defaultValue: 'eliane@ayurveda-tahiti.com' },
  ],
}
