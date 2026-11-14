import { describe, expect, it } from 'vitest'
import { generateOrders, type Order } from './orders'
import { loadOrders } from './storage'
import { validateOrder } from './validate'

const valid: Order = generateOrders(1)[0]

describe('validateOrder', () => {
  it('accepts a generated order', () => {
    expect(validateOrder(valid)).toEqual({})
  })

  it('flags each bad field', () => {
    const e = validateOrder({ ...valid, customer: '  ', amount: 1.5, date: '2026-13-45', note: 'x'.repeat(201), status: 'lost' as Order['status'] })
    expect(Object.keys(e).sort()).toEqual(['amount', 'customer', 'date', 'note', 'status'])
  })

  it('checks amount bounds', () => {
    expect(validateOrder({ ...valid, amount: 0 }).amount).toBeDefined()
    expect(validateOrder({ ...valid, amount: 100000 }).amount).toBeUndefined()
    expect(validateOrder({ ...valid, amount: 100001 }).amount).toBeDefined()
  })
})

describe('loadOrders', () => {
  const store = (value: string | null) => ({ getItem: () => value })

  it('returns saved orders when they are valid', () => {
    const saved = [{ ...valid, customer: 'Edited Co' }]
    expect(loadOrders(store(JSON.stringify(saved)))).toEqual(saved)
  })

  it('falls back to demo data on missing, broken or invalid storage', () => {
    const fresh = generateOrders()
    expect(loadOrders(store(null))).toEqual(fresh)
    expect(loadOrders(store('{not json'))).toEqual(fresh)
    expect(loadOrders(store(JSON.stringify([{ ...valid, amount: -5 }])))).toEqual(fresh)
    expect(loadOrders({ getItem: () => { throw new Error('blocked') } })).toEqual(fresh)
  })
})
