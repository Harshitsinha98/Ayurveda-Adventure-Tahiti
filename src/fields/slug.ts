import type { Field } from 'payload'

import { L } from '@/lib/admin-labels'

export const slugify = (input: string) =>
  input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)

/** URL slug, filled automatically from `fromField` when left empty. */
export const slugField = (fromField = 'title'): Field => ({
  name: 'slug',
  label: L('Adresse de la page (URL)', 'Page address (URL)'),
  type: 'text',
  index: true,
  unique: true,
  admin: {
    position: 'sidebar',
    description: L('Rempli automatiquement depuis le titre. À modifier seulement si nécessaire.', 'Filled automatically from the title. Only change if needed.'),
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (typeof value === 'string' && value.trim()) return slugify(value)
        const src = data?.[fromField]
        return typeof src === 'string' ? slugify(src) : value
      },
    ],
  },
})

export const seoGroup: Field = {
  name: 'seo',
  label: L('Référencement (Google)', 'SEO (Google)'),
  type: 'group',
  admin: { description: L('Facultatif. Sinon, le titre et le résumé sont utilisés.', 'Optional. Otherwise the title and summary are used.') },
  fields: [
    { name: 'title', localized: true, label: L('Titre pour Google', 'Title for Google'), type: 'text', maxLength: 70 },
    { name: 'description', localized: true, label: L('Description pour Google', 'Description for Google'), type: 'textarea', maxLength: 170 },
    { name: 'image', label: L('Image de partage (réseaux sociaux)', 'Share image (social media)'), type: 'upload', relationTo: 'media' },
  ],
}
