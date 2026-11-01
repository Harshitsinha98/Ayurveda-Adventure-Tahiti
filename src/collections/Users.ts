import type { CollectionConfig } from 'payload'

import { adminFieldOnly, adminOnly, hiddenForEditors, isAdmin, isStaff } from '@/access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Utilisateur', plural: 'Utilisateurs' },
  admin: {
    useAsTitle: 'email',
    group: 'Administration',
    hidden: hiddenForEditors,
    defaultColumns: ['name', 'email', 'role'],
  },
  auth: { tokenExpiration: 60 * 60 * 8, maxLoginAttempts: 8, lockTime: 15 * 60 * 1000 },
  access: {
    read: ({ req }) => (isAdmin(req.user as never) ? true : { id: { equals: req.user?.id } }),
    create: adminOnly,
    update: ({ req }) => (isAdmin(req.user as never) ? true : { id: { equals: req.user?.id } }),
    delete: adminOnly,
    admin: ({ req }) => isStaff(req.user as never),
  },
  fields: [
    { name: 'name', label: 'Nom', type: 'text' },
    {
      name: 'role',
      label: 'Rôle',
      type: 'select',
      required: true,
      defaultValue: 'editeur',
      saveToJWT: true,
      access: { update: adminFieldOnly, create: adminFieldOnly },
      options: [
        { label: 'Administrateur (technique)', value: 'admin' },
        { label: 'Éditrice (gestion du site)', value: 'editeur' },
      ],
    },
  ],
}
