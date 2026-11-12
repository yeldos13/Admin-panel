export const ROLES = ['admin', 'manager', 'viewer'] as const
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
