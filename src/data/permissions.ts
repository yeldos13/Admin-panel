import type { Order } from './orders'

export const ROLES =['admin', 'manager', 'viewer'] as const
export type Role = (typeof ROLES)[number]

export type Action =
  | 'view'
  | 'export'
  | 'editStatus' // status and note
  | 'editDetails' // customer, product, region, amount, date
  | 'delete'
  | 'reset'

// shortcut: checked in the browser only, fine for a static demo; a real app enforces this on the server
const RULES: Record<Role, readonly Action[]> = {
  admin: ['view', 'export', 'editStatus', 'editDetails', 'delete', 'reset'],
  manager: ['view', 'export', 'editStatus'],
  viewer: ['view'],
}

export const can = (role: Role, action: Action) => RULES[role].includes(action)

export const ROLE_HINTS: Record<Role, string> = {
  admin: 'Admin: full access, can delete orders and reset data.',
  manager: 'Manager: can change status and notes, and export.',
  viewer: 'Viewer: read only.',
}

// keeps fields the role may not change, whatever the form sent
export function applyEdit(role: Role, original: Order, draft: Order): Order {
  const status = can(role, 'editStatus') ? { status: draft.status, note: draft.note } : {}
  return can(role, 'editDetails') ? { ...draft, id: original.id } : { ...original, ...status }
}
