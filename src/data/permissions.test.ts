import { describe, expect, it } from 'vitest'
import { can, type Action, type Role } from './permissions'

const expected: Record<Action, Record<Role, boolean>> = {
  view: { admin: true, manager: true, viewer: true },
  export: { admin: true, manager: true, viewer: false },
  editStatus: { admin: true, manager: true, viewer: false },
  editDetails: { admin: true, manager: false, viewer: false },
  delete: { admin: true, manager: false, viewer: false },
  reset: { admin: true, manager: false, viewer: false },
}

describe('can', () => {
  for (const [action, roles] of Object.entries(expected)) {
    for (const [role, allowed] of Object.entries(roles)) {
      it(`${role} ${allowed ? 'can' : 'cannot'} ${action}`, () => {
        expect(can(role as Role, action as Action)).toBe(allowed)
      })
    }
  }
})
