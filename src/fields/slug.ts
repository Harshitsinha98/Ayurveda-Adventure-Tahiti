import type { Field } from 'payload'

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
  label: 'Adresse de la page (URL)',
  type: 'text',
  index: true,
  unique: true,
  admin: {
    position: 'sidebar',
    description: 'Rempli automatiquement depuis le titre. À modifier seulement si nécessaire.',
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
  label: 'Référencement (Google)',
  type: 'group',
  admin: { description: 'Facultatif. Sinon, le titre et le résumé sont utilisés.' },
  fields: [
    { name: 'title', label: 'Titre pour Google', type: 'text', maxLength: 70 },
    { name: 'description', label: 'Description pour Google', type: 'textarea', maxLength: 170 },
    { name: 'image', label: 'Image de partage (réseaux sociaux)', type: 'upload', relationTo: 'media' },
  ],
}
