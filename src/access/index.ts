import type { Access, FieldAccess } from 'payload'

/** Roles: `admin` = technical maintainer, `editeur` = Eliane (daily management). */
export type Role = 'admin' | 'editeur'

type U = { role?: Role | null } | null | undefined

export const isAdmin = (user: U) => user?.role === 'admin'
export const isStaff = (user: U) => user?.role === 'admin' || user?.role === 'editeur'

export const adminOnly: Access = ({ req }) => isAdmin(req.user as U)
export const staffOnly: Access = ({ req }) => isStaff(req.user as U)
export const publicRead: Access = () => true

/** Published content for everyone, drafts only for staff. */
export const publishedOrStaff: Access = ({ req }) => {
  if (isStaff(req.user as U)) return true
  return { _status: { equals: 'published' } }
}

export const adminFieldOnly: FieldAccess = ({ req }) => isAdmin(req.user as U)

/** Hide technical collections from the editor's sidebar. */
export const hiddenForEditors = ({ user }: { user: unknown }) => !isAdmin(user as U)
