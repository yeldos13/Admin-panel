import { REGIONS, STATUSES, type Order } from './orders'

// cancelled orders count toward totals of orders, not toward revenue
const paid = (orders: Order[]) => orders.filter(o => o.status !== 'cancelled')
const sum = (orders: Order[]) => orders.reduce((s, o) => s + o.amount, 0)

export function kpis(orders: Order[]) {
  const p = paid(orders)
  const revenue = sum(p)
  return {
    revenue,
    orders: orders.length,
    average: p.length ? Math.round(revenue / p.length) : 0,
    cancelledRate: orders.length ? (orders.length - p.length) / orders.length : 0,
  }
}

export function revenueByMonth(orders: Order[]) {
  const totals = new Map<string, number>()
  for (const o of paid(orders)) totals.set(o.date.slice(0, 7), (totals.get(o.date.slice(0, 7)) ?? 0) + o.amount)
  return [...totals.keys()].sort().map(key => ({
    month: new Date(`${key}-01T00:00:00Z`).toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }),
    revenue: totals.get(key)!,
  }))
}

export const ordersByStatus = (orders: Order[]) =>
  STATUSES.map(status => ({ status, count: orders.filter(o => o.status === status).length }))

export const revenueByRegion = (orders: Order[]) =>
  REGIONS.map(region => ({ region, revenue: sum(paid(orders).filter(o => o.region === region)) }))
