import type { CollectionConfig } from 'payload'

import { publicRead, staffOnly } from '@/access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Image', plural: 'Médiathèque' },
  admin: { group: 'Contenu', description: 'Photos et images du site.' },
  access: { read: publicRead, create: staffOnly, update: staffOnly, delete: staffOnly },
  upload: {
    mimeTypes: ['image/*'],
    focalPoint: true,
    imageSizes: [
      { name: 'thumb', width: 480 },
      { name: 'card', width: 960 },
      { name: 'hero', width: 2000 },
    ],
    adminThumbnail: 'thumb',
  },
  fields: [
    {
      name: 'alt',
      label: 'Description de l’image (accessibilité et référencement)',
      type: 'text',
      required: true,
    },
    { name: 'credit', label: 'Crédit photo', type: 'text' },
  ],
}
