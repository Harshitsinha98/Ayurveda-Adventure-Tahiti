import type { CollectionConfig } from 'payload'

import { adminOnly, hiddenForEditors, publicRead, publishedOrStaff, staffOnly } from '@/access'
import { seoGroup, slugField } from '@/fields/slug'
import { L } from '@/lib/admin-labels'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: L('Catégorie', 'Category'), plural: L('Catégories du blog', 'Blog categories') },
  admin: { group: L('Blog', 'Blog'), useAsTitle: 'title' },
  access: { read: publicRead, create: staffOnly, update: staffOnly, delete: staffOnly },
  fields: [{ name: 'title', localized: true, label: L('Nom', 'Name'), type: 'text', required: true }, slugField()],
}

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: L('Article', 'Article'), plural: L('Articles', 'Articles') },
  admin: {
    group: L('Blog', 'Blog'),
    useAsTitle: 'title',
    defaultColumns: ['title', 'categories', 'publishedAt', '_status'],
    description: L('Écrire, programmer et publier les articles du blog.', 'Write, schedule and publish blog articles.'),
    preview: (doc) => (doc?.slug ? `/preview?path=${encodeURIComponent(`/blog/${doc.slug}`)}` : null),
  },
  defaultSort: '-publishedAt',
  versions: { drafts: { autosave: { interval: 2000 }, schedulePublish: true }, maxPerDoc: 30 },
  access: { read: publishedOrStaff, create: staffOnly, update: staffOnly, delete: staffOnly },
  fields: [
    { name: 'title', localized: true, label: L('Titre', 'Title'), type: 'text', required: true },
    { name: 'excerpt', localized: true, label: L('Résumé (affiché dans la liste)', 'Summary (shown in the list)'), type: 'textarea' },
    { name: 'cover', label: L('Image de couverture', 'Cover image'), type: 'upload', relationTo: 'media' },
    { name: 'content', localized: true, label: L('Contenu', 'Content'), type: 'richText', required: true },
    seoGroup,
    slugField(),
    {
      name: 'publishedAt',
      label: L('Date de publication', 'Publication date'),
      type: 'date',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
      hooks: {
        beforeChange: [({ value, siblingData }) => value ?? (siblingData?._status === 'published' ? new Date().toISOString() : value)],
      },
    },
    {
      name: 'categories',
      label: L('Catégories', 'Categories'),
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
  labels: { singular: L('Témoignage', 'Testimonial'), plural: L('Témoignages', 'Testimonials') },
  admin: { group: L('Contenu', 'Content'), useAsTitle: 'name', defaultColumns: ['name', 'published', 'order'] },
  defaultSort: 'order',
  access: { read: publicRead, create: staffOnly, update: staffOnly, delete: staffOnly },
  fields: [
    { name: 'quote', localized: true, label: L('Témoignage', 'Testimonial'), type: 'textarea', required: true },
    { name: 'highlight', localized: true, label: L('Phrase mise en avant', 'Highlighted sentence'), type: 'text', admin: { description: L('Courte citation en grand.', 'Short quote shown large.') } },
    { name: 'name', label: L('Prénom et initiale', 'First name and initial'), type: 'text', required: true },
    { name: 'context', localized: true, label: L('Contexte', 'Context'), type: 'text', admin: { description: L('Ex. « Formation Ayurveda Santé »', 'E.g. “Ayurveda Health training”') } },
    { name: 'published', label: L('Visible', 'Visible'), type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
    { name: 'order', label: L('Ordre', 'Order'), type: 'number', defaultValue: 10, admin: { position: 'sidebar' } },
  ],
}

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  labels: { singular: L('Abonné', 'Subscriber'), plural: L('Abonnés newsletter', 'Newsletter subscribers') },
  admin: {
    group: L('Clients et newsletter', 'Clients & newsletter'),
    useAsTitle: 'email',
    defaultColumns: ['email', 'firstName', 'status', 'createdAt'],
    description: L(
      'Inscriptions depuis le site. Les newsletters se créent et s’envoient dans Brevo (lien dans le tableau de bord).',
      'Sign-ups from the website. Newsletters are created and sent in Brevo (link on the dashboard).',
    ),
  },
  access: { read: staffOnly, create: staffOnly, update: staffOnly, delete: staffOnly },
  fields: [
    { name: 'email', type: 'email', required: true, unique: true, index: true },
    { name: 'firstName', label: L('Prénom', 'First name'), type: 'text' },
    {
      name: 'status',
      label: L('Statut', 'Status'),
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: L('Confirmation demandée (double opt-in)', 'Confirmation requested (double opt-in)'), value: 'pending' },
        { label: L('Inscrit', 'Subscribed'), value: 'subscribed' },
        { label: L('Désinscrit', 'Unsubscribed'), value: 'unsubscribed' },
      ],
    },
    { name: 'consentText', label: L('Texte de consentement accepté', 'Accepted consent text'), type: 'textarea', admin: { readOnly: true } },
    { name: 'consentIp', type: 'text', admin: { readOnly: true, condition: (_d, _s, { user }) => (user as { role?: string })?.role === 'admin' } },
    { name: 'source', label: L('Origine', 'Source'), type: 'text', admin: { readOnly: true } },
    { name: 'syncedToBrevo', label: L('Envoyé à Brevo', 'Sent to Brevo'), type: 'checkbox', admin: { readOnly: true } },
  ],
}

export const Messages: CollectionConfig = {
  slug: 'messages',
  labels: { singular: L('Message', 'Message'), plural: L('Messages reçus', 'Received messages') },
  admin: { group: L('Clients et newsletter', 'Clients & newsletter'), useAsTitle: 'subject', defaultColumns: ['subject', 'name', 'email', 'createdAt', 'handled'] },
  defaultSort: '-createdAt',
  access: { read: staffOnly, create: staffOnly, update: staffOnly, delete: staffOnly },
  fields: [
    { name: 'name', label: L('Nom', 'Name'), type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', label: L('Téléphone', 'Phone'), type: 'text' },
    { name: 'subject', label: L('Sujet', 'Subject'), type: 'text' },
    { name: 'message', label: L('Message', 'Message'), type: 'textarea', required: true },
    { name: 'offering', label: L('Offre concernée', 'Related offering'), type: 'relationship', relationTo: 'offerings' },
    { name: 'handled', label: L('Traité', 'Handled'), type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
  ],
}

/** Idempotency log for payment webhooks (technical). */
export const WebhookEvents: CollectionConfig = {
  slug: 'webhook-events',
  labels: { singular: L('Événement de paiement', 'Payment event'), plural: L('Journal des paiements', 'Payment log') },
  admin: { group: L('Administration', 'Administration'), useAsTitle: 'eventId', hidden: hiddenForEditors, defaultColumns: ['eventId', 'type', 'paymentId', 'createdAt', 'result'] },
  access: { read: adminOnly, create: adminOnly, update: adminOnly, delete: adminOnly },
  fields: [
    { name: 'eventId', type: 'text', required: true, unique: true, index: true },
    { name: 'type', type: 'text' },
    { name: 'paymentId', type: 'text', index: true },
    { name: 'result', type: 'text' },
    { name: 'payload', type: 'json' },
  ],
}
