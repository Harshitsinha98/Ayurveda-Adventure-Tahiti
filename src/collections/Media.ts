import type { CollectionConfig } from 'payload'

import { publicRead, staffOnly } from '@/access'
import { L } from '@/lib/admin-labels'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: L('Image', 'Image'), plural: L('Médiathèque', 'Media library') },
  admin: { group: L('Contenu', 'Content'), description: L('Photos et images du site.', 'Website photos and images.') },
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
      label: L('Description de l’image (accessibilité et référencement)', 'Image description (accessibility and SEO)'),
      type: 'text',
      required: true,
    },
    { name: 'credit', label: L('Crédit photo', 'Photo credit'), type: 'text' },
  ],
}
