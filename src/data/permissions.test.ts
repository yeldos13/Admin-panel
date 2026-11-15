import { describe, expect, it } from 'vitest'
import { generateOrders } from './orders'
import { applyEdit, can, type Action, type Role } from './permissions'

describe('applyEdit', () => {
  const original = generateOrders(1)[0]
  const draft = { ...original, id: 'HACK', customer: 'Changed', amount: 9999, status: 'cancelled' as const, note: 'changed note' }

  it('admin changes everything except id', () => {
    expect(applyEdit('admin', original, draft)).toEqual({ ...draft, id: original.id })
  })

  it('manager changes only status and note', () => {
    expect(applyEdit('manager', original, draft)).toEqual({ ...original, status: 'cancelled', note: 'changed note' })
  })

  it('viewer changes nothing', () => {
    expect(applyEdit('viewer', original, draft)).toEqual(original)
  })
})

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
