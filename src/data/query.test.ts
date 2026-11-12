import { describe, expect, it } from 'vitest'
import type { Order } from './orders'
import { emptyFilters, filterOrders, sortOrders } from './query'

const base: Order = { id: '', customer: '', product: 'Team plan', region: 'North', status: 'new', amount: 0, date: '2026-01-01', note: '' }
const orders: Order[] = [
  { ...base, id: 'ORD-1', customer: 'Nova Labs', amount: 300, status: 'new', region: 'North', date: '2026-03-01' },
  { ...base, id: 'ORD-2', customer: 'Cedar Foods', amount: 100, status: 'shipped', region: 'South', note: 'Priority client', date: '2026-01-15' },
  { ...base, id: 'ORD-3', customer: 'nova media', amount: 200, status: 'shipped', region: 'North', date: '2026-02-10' },
]
const ids = (list: Order[]) => list.map(o => o.id)

describe('filterOrders', () => {
  it('returns everything with empty filters', () => {
    expect(filterOrders(orders, emptyFilters)).toEqual(orders)
  })

  it('searches id, customer and note, ignoring case and spaces', () => {
    expect(ids(filterOrders(orders, { ...emptyFilters, search: '  NOVA ' }))).toEqual(['ORD-1', 'ORD-3'])
    expect(ids(filterOrders(orders, { ...emptyFilters, search: 'priority' }))).toEqual(['ORD-2'])
    expect(ids(filterOrders(orders, { ...emptyFilters, search: 'ord-3' }))).toEqual(['ORD-3'])
  })

  it('combines status, region and search', () => {
    expect(ids(filterOrders(orders, { search: 'nova', status: 'shipped', region: 'North' }))).toEqual(['ORD-3'])
  })

  it('returns an empty list when nothing matches', () => {
    expect(filterOrders(orders, { ...emptyFilters, status: 'cancelled' })).toEqual([])
  })
})

describe('sortOrders', () => {
  it('sorts numbers and dates both ways', () => {
    expect(ids(sortOrders(orders, { key: 'amount', dir: 'asc' }))).toEqual(['ORD-2', 'ORD-3', 'ORD-1'])
    expect(ids(sortOrders(orders, { key: 'date', dir: 'desc' }))).toEqual(['ORD-1', 'ORD-3', 'ORD-2'])
  })

  it('keeps original order for equal values and does not mutate input', () => {
    const before = ids(orders)
    expect(ids(sortOrders(orders, { key: 'status', dir: 'asc' }))).toEqual(['ORD-1', 'ORD-2', 'ORD-3'])
    expect(ids(orders)).toEqual(before)
  })
})
