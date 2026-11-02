import type { GlobalConfig } from 'payload'

import { publicRead, staffOnly } from '@/access'
import { L } from '@/lib/admin-labels'

const days = [
  { label: L('Lundi', 'Monday'), value: 'lun' },
  { label: L('Mardi', 'Tuesday'), value: 'mar' },
  { label: L('Mercredi', 'Wednesday'), value: 'mer' },
  { label: L('Jeudi', 'Thursday'), value: 'jeu' },
  { label: L('Vendredi', 'Friday'), value: 'ven' },
  { label: L('Samedi', 'Saturday'), value: 'sam' },
  { label: L('Dimanche', 'Sunday'), value: 'dim' },
]

const hhmm = { validate: (v: unknown) => (typeof v === 'string' && /^\d{2}:\d{2}$/.test(v)) || 'Format HH:MM, ex. 09:00' }

export const SiteSettings: GlobalConfig = {
  slug: 'site',
  label: L('Coordonnées et réseaux', 'Contact & social'),
  admin: { group: L('Contenu', 'Content') },
  access: { read: publicRead, update: staffOnly },
  fields: [
    { name: 'phone', label: L('Téléphone', 'Phone'), type: 'text', defaultValue: '87 78 44 79' },
    { name: 'whatsapp', label: L('Numéro WhatsApp (format international, sans +)', 'WhatsApp number (international format, no +)'), type: 'text', defaultValue: '68987784479' },
    { name: 'email', label: L('E-mail', 'Email'), type: 'email', defaultValue: 'eliane@ayurveda-tahiti.com' },
    { name: 'address', label: L('Lieu', 'Location'), type: 'text', defaultValue: 'Punaauia, Tahiti – Polynésie française' },
    { name: 'instagram', label: L('Instagram (lien)', 'Instagram (link)'), type: 'text', defaultValue: 'https://www.instagram.com/ayurvedatahiti/' },
    { name: 'facebook', label: L('Facebook (lien)', 'Facebook (link)'), type: 'text' },
    {
      name: 'legal',
      label: L('Mentions légales', 'Legal notices'),
      type: 'group',
      fields: [
        { name: 'entity', label: L('Structure', 'Entity'), type: 'text', defaultValue: 'Association Ayurveda Adventure Tahiti' },
        { name: 'registration', label: L('Numéro TAHITI', 'TAHITI number'), type: 'text', defaultValue: 'F38758' },
        { name: 'representative', label: L('Responsable de la publication', 'Publication manager'), type: 'text', defaultValue: 'Eliane Poeauru Koller Valadier' },
        { name: 'host', label: L('Hébergeur', 'Host'), type: 'text', defaultValue: 'Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis' },
        { name: 'terms', label: L('Conditions générales de vente', 'Terms and conditions of sale'), type: 'richText' },
        { name: 'privacy', label: L('Politique de confidentialité', 'Privacy policy'), type: 'richText' },
      ],
    },
  ],
}

export const HomePage: GlobalConfig = {
  slug: 'home',
  label: L('Page d’accueil', 'Home page'),
  admin: { group: L('Contenu', 'Content') },
  access: { read: publicRead, update: staffOnly },
  fields: [
    { name: 'eyebrow', localized: true, label: L('Petite ligne au-dessus du titre', 'Small line above the title'), type: 'text', defaultValue: 'Ayurveda · Méditation · Yoga · Sciences védiques' },
    {
      name: 'headline',
      localized: true,
      label: L('Titre (une ligne par phrase)', 'Title (one line per sentence)'),
      type: 'array',
      minRows: 1,
      maxRows: 4,
      fields: [{ name: 'line', type: 'text', required: true }],
    },
    { name: 'intro', localized: true, label: L('Texte d’introduction', 'Introduction text'), type: 'textarea' },
    { name: 'heroImage', label: L('Photo principale', 'Main photo'), type: 'upload', relationTo: 'media' },
    { name: 'manifesto', localized: true, label: L('Grand texte « La vie est belle »', 'Large “Life is beautiful” text'), type: 'textarea' },
    { name: 'manifestoAside', localized: true, label: L('Phrase finale du grand texte', 'Closing sentence of the large text'), type: 'text' },
    {
      name: 'ritual',
      localized: true,
      label: L('Bloc « Ta journée commence… »', '“Your day begins…” block'),
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'text', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'pillars',
      localized: true,
      label: L('Les 6 piliers', 'The 6 pillars'),
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
  label: L('Page « À propos »', '“About” page'),
  admin: { group: L('Contenu', 'Content') },
  access: { read: publicRead, update: staffOnly },
  fields: [
    { name: 'title', label: L('Nom affiché', 'Displayed name'), type: 'text', defaultValue: 'Eliane Poeauru Koller Valadier' },
    { name: 'lead', localized: true, label: L('Phrase d’ouverture', 'Opening sentence'), type: 'text' },
    { name: 'portrait', label: L('Portrait', 'Portrait'), type: 'upload', relationTo: 'media' },
    { name: 'body', localized: true, label: L('Texte', 'Text'), type: 'richText' },
    {
      name: 'chapters',
      label: L('Étapes du parcours', 'Journey milestones'),
      type: 'array',
      fields: [
        { name: 'place', localized: true, label: L('Lieu / période', 'Place / period'), type: 'text', required: true },
        { name: 'text', localized: true, type: 'textarea', required: true },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'credentials',
      label: L('Formations et certifications', 'Training & certifications'),
      type: 'array',
      fields: [
        { name: 'title', localized: true, type: 'text', required: true },
        { name: 'badge', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}

export const BookingSettings: GlobalConfig = {
  slug: 'booking-settings',
  label: L('Disponibilités et réservations', 'Availability & bookings'),
  admin: {
    group: L('Réservations', 'Bookings'),
    description: L(
      'Horaires des séances individuelles (heure de Tahiti), congés et règles de réservation.',
      'Individual session hours (Tahiti time), time off and booking rules.',
    ),
  },
  access: { read: publicRead, update: staffOnly },
  fields: [
    {
      name: 'weekly',
      label: L('Disponibilités de la semaine', 'Weekly availability'),
      type: 'array',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'day', label: L('Jour', 'Day'), type: 'select', options: days, required: true },
            { name: 'start', label: L('De', 'From'), type: 'text', required: true, defaultValue: '09:00', ...hhmm },
            { name: 'end', label: L('À', 'To'), type: 'text', required: true, defaultValue: '17:00', ...hhmm },
          ],
        },
      ],
    },
    {
      name: 'blocked',
      label: L('Indisponibilités (congés, voyages)', 'Unavailability (time off, travel)'),
      type: 'array',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'from', label: L('Du', 'From'), type: 'date', required: true, admin: { date: { pickerAppearance: 'dayOnly' } } },
            { name: 'to', label: L('Au', 'To'), type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
            { name: 'reason', label: L('Motif (interne)', 'Reason (internal)'), type: 'text' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'minNoticeHours', label: L('Délai minimum avant un rendez-vous (heures)', 'Minimum notice before an appointment (hours)'), type: 'number', defaultValue: 24, min: 0 },
        { name: 'horizonDays', label: L('Réservable jusqu’à (jours)', 'Bookable up to (days)'), type: 'number', defaultValue: 60, min: 7 },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'bufferMinutes', label: L('Pause entre deux rendez-vous (min)', 'Buffer between two appointments (min)'), type: 'number', defaultValue: 15, min: 0 },
        { name: 'stepMinutes', label: L('Intervalle des créneaux (min)', 'Slot interval (min)'), type: 'number', defaultValue: 30, min: 15 },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'holdMinutes', label: L('Place gardée pendant le paiement (min)', 'Seat held during payment (min)'), type: 'number', defaultValue: 20, min: 5, max: 60 },
        { name: 'reminderHours', label: L('Rappel envoyé avant (heures)', 'Reminder sent before (hours)'), type: 'number', defaultValue: 24, min: 1 },
        { name: 'cancelHours', label: L('Annulation possible jusqu’à (heures avant)', 'Cancellation allowed up to (hours before)'), type: 'number', defaultValue: 24, min: 0 },
      ],
    },
    { name: 'notifyEmail', label: L('E-mail qui reçoit les nouvelles réservations', 'Email that receives new bookings'), type: 'email', defaultValue: 'eliane@ayurveda-tahiti.com' },
  ],
}
