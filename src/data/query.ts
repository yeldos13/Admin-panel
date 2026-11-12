import type { Order, Region, Status } from './orders'

export interface Filters {
  search: string
  status: Status | 'all'
  region: Region | 'all'
}

export type SortKey = 'id' | 'customer' | 'product' | 'region' | 'status' | 'amount' | 'date'
export interface Sort {
  key: SortKey
  dir: 'asc' | 'desc'
}

export const emptyFilters: Filters = { search: '', status: 'all', region: 'all' }

export function filterOrders(orders: Order[], f: Filters): Order[] {
  const q = f.search.trim().toLowerCase()
  return orders.filter(
    o =>
      (f.status === 'all' || o.status === f.status) &&
      (f.region === 'all' || o.region === f.region) &&
      (!q || [o.id, o.customer, o.product, o.note].some(v => v.toLowerCase().includes(q))),
  )
}

export function sortOrders(orders: Order[], s: Sort): Order[] {
  const sign = s.dir === 'asc' ? 1 : -1
  // toSorted is stable, so equal values keep their previous order
  return orders.toSorted((a, b) => {
    const x = a[s.key]
    const y = b[s.key]
    return sign * (typeof x === 'number' ? x - (y as number) : String(x).localeCompare(String(y)))
  })
}
