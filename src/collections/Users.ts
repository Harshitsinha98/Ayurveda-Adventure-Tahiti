import type { CollectionConfig } from 'payload'

import { adminFieldOnly, adminOnly, hiddenForEditors, isAdmin, isStaff } from '@/access'
import { L } from '@/lib/admin-labels'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: L('Utilisateur', 'User'), plural: L('Utilisateurs', 'Users') },
  admin: {
    useAsTitle: 'email',
    group: L('Administration', 'Administration'),
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
    { name: 'name', label: L('Nom', 'Name'), type: 'text' },
    {
      name: 'role',
      label: L('Rôle', 'Role'),
      type: 'select',
      required: true,
      defaultValue: 'editeur',
      saveToJWT: true,
      access: { update: adminFieldOnly, create: adminFieldOnly },
      options: [
        { label: L('Administrateur (technique)', 'Administrator (technical)'), value: 'admin' },
        { label: L('Éditrice (gestion du site)', 'Editor (site management)'), value: 'editeur' },
      ],
    },
  ],
}
