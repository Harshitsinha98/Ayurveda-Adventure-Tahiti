import type { CollectionConfig } from 'payload'

import { adminOnly, hiddenForEditors, publicRead, publishedOrStaff, staffOnly } from '@/access'
import { seoGroup, slugField } from '@/fields/slug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Catégorie', plural: 'Catégories du blog' },
  admin: { group: 'Blog', useAsTitle: 'title' },
  access: { read: publicRead, create: staffOnly, update: staffOnly, delete: staffOnly },
  fields: [{ name: 'title', localized: true, label: 'Nom', type: 'text', required: true }, slugField()],
}

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Article', plural: 'Articles' },
  admin: {
    group: 'Blog',
    useAsTitle: 'title',
    defaultColumns: ['title', 'categories', 'publishedAt', '_status'],
    description: 'Écrire, programmer et publier les articles du blog.',
    preview: (doc) => (doc?.slug ? `/preview?path=${encodeURIComponent(`/blog/${doc.slug}`)}` : null),
  },
  defaultSort: '-publishedAt',
  versions: { drafts: { autosave: { interval: 2000 }, schedulePublish: true }, maxPerDoc: 30 },
  access: { read: publishedOrStaff, create: staffOnly, update: staffOnly, delete: staffOnly },
  fields: [
    { name: 'title', localized: true, label: 'Titre', type: 'text', required: true },
    { name: 'excerpt', localized: true, label: 'Résumé (affiché dans la liste)', type: 'textarea' },
    { name: 'cover', label: 'Image de couverture', type: 'upload', relationTo: 'media' },
    { name: 'content', localized: true, label: 'Contenu', type: 'richText', required: true },
    seoGroup,
    slugField(),
    {
      name: 'publishedAt',
      label: 'Date de publication',
      type: 'date',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
      hooks: {
        beforeChange: [({ value, siblingData }) => value ?? (siblingData?._status === 'published' ? new Date().toISOString() : value)],
      },
    },
    {
      name: 'categories',
      label: 'Catégories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'readingMinutes',
      type: 'number',
      admin: { hidden: true },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            const text = JSON.stringify(siblingData?.content ?? '').replace(/"[a-zA-Z]+":/g, ' ')
            const words = text.split(/\s+/).length
            return Math.max(1, Math.round(words / 220))
          },
        ],
      },
    },
  ],
}

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Témoignage', plural: 'Témoignages' },
  admin: { group: 'Contenu', useAsTitle: 'name', defaultColumns: ['name', 'published', 'order'] },
  defaultSort: 'order',
  access: { read: publicRead, create: staffOnly, update: staffOnly, delete: staffOnly },
  fields: [
    { name: 'quote', localized: true, label: 'Témoignage', type: 'textarea', required: true },
    { name: 'highlight', localized: true, label: 'Phrase mise en avant', type: 'text', admin: { description: 'Courte citation en grand.' } },
    { name: 'name', label: 'Prénom et initiale', type: 'text', required: true },
    { name: 'context', localized: true, label: 'Contexte', type: 'text', admin: { description: 'Ex. « Formation Ayurveda Santé »' } },
    { name: 'published', label: 'Visible', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
    { name: 'order', label: 'Ordre', type: 'number', defaultValue: 10, admin: { position: 'sidebar' } },
  ],
}

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  labels: { singular: 'Abonné', plural: 'Abonnés newsletter' },
  admin: {
    group: 'Clients et newsletter',
    useAsTitle: 'email',
    defaultColumns: ['email', 'firstName', 'status', 'createdAt'],
    description:
      'Inscriptions depuis le site. Les newsletters se créent et s’envoient dans Brevo (lien dans le tableau de bord).',
  },
  access: { read: staffOnly, create: staffOnly, update: staffOnly, delete: staffOnly },
  fields: [
    { name: 'email', type: 'email', required: true, unique: true, index: true },
    { name: 'firstName', label: 'Prénom', type: 'text' },
    {
      name: 'status',
      label: 'Statut',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Confirmation demandée (double opt-in)', value: 'pending' },
        { label: 'Inscrit', value: 'subscribed' },
        { label: 'Désinscrit', value: 'unsubscribed' },
      ],
    },
    { name: 'consentText', label: 'Texte de consentement accepté', type: 'textarea', admin: { readOnly: true } },
    { name: 'consentIp', type: 'text', admin: { readOnly: true, condition: (_d, _s, { user }) => (user as { role?: string })?.role === 'admin' } },
    { name: 'source', label: 'Origine', type: 'text', admin: { readOnly: true } },
    { name: 'syncedToBrevo', label: 'Envoyé à Brevo', type: 'checkbox', admin: { readOnly: true } },
  ],
}

export const Messages: CollectionConfig = {
  slug: 'messages',
  labels: { singular: 'Message', plural: 'Messages reçus' },
  admin: { group: 'Clients et newsletter', useAsTitle: 'subject', defaultColumns: ['subject', 'name', 'email', 'createdAt', 'handled'] },
  defaultSort: '-createdAt',
  access: { read: staffOnly, create: staffOnly, update: staffOnly, delete: staffOnly },
  fields: [
    { name: 'name', label: 'Nom', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', label: 'Téléphone', type: 'text' },
    { name: 'subject', label: 'Sujet', type: 'text' },
    { name: 'message', label: 'Message', type: 'textarea', required: true },
    { name: 'offering', label: 'Offre concernée', type: 'relationship', relationTo: 'offerings' },
    { name: 'handled', label: 'Traité', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
  ],
}

/** Idempotency log for payment webhooks (technical). */
export const WebhookEvents: CollectionConfig = {
  slug: 'webhook-events',
  labels: { singular: 'Événement de paiement', plural: 'Journal des paiements' },
  admin: { group: 'Administration', useAsTitle: 'eventId', hidden: hiddenForEditors, defaultColumns: ['eventId', 'type', 'paymentId', 'createdAt', 'result'] },
  access: { read: adminOnly, create: adminOnly, update: adminOnly, delete: adminOnly },
  fields: [
    { name: 'eventId', type: 'text', required: true, unique: true, index: true },
    { name: 'type', type: 'text' },
    { name: 'paymentId', type: 'text', index: true },
    { name: 'result', type: 'text' },
    { name: 'payload', type: 'json' },
  ],
}
