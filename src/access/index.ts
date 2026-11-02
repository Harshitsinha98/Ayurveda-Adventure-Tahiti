import type { Access, FieldAccess } from 'payload'

/** Roles: `admin` = technical maintainer, `editeur` = Eliane (daily management). */
export type Role = 'admin' | 'editeur'

/**
 * Two kinds of authenticated principals exist:
 *  - staff: a document from the `users` collection (role admin/editeur) → back office
 *  - customer: a document from the `customers` collection → public website account
 * `req.user.collection` tells them apart.
 */
type U = { role?: Role | null; collection?: string } | null | undefined

export const isAdmin = (user: U) => user?.collection === 'users' && user?.role === 'admin'
export const isStaff = (user: U) =>
  user?.collection === 'users' && (user?.role === 'admin' || user?.role === 'editeur')
/** A logged-in customer (public website account), not a staff member. */
export const isCustomer = (user: U) => user?.collection === 'customers'

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
