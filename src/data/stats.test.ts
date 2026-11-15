import { describe, expect, it } from 'vitest'
import { generateOrders, type Order } from './orders'
import { kpis, ordersByStatus, revenueByMonth, revenueByRegion } from './stats'

const base: Order = generateOrders(1)[0]
const orders: Order[] = [
  { ...base, id: 'A', amount: 100, status: 'delivered', region: 'North', date: '2026-02-10' },
  { ...base, id: 'B', amount: 300, status: 'new', region: 'South', date: '2026-01-05' },
  { ...base, id: 'C', amount: 999, status: 'cancelled', region: 'North', date: '2026-01-20' },
  { ...base, id: 'D', amount: 200, status: 'shipped', region: 'North', date: '2026-02-01' },
]

describe('stats', () => {
  it('computes KPIs without cancelled revenue', () => {
    expect(kpis(orders)).toEqual({ revenue: 600, orders: 4, average: 200, cancelledRate: 0.25 })
  })

  it('handles an empty list', () => {
    expect(kpis([])).toEqual({ revenue: 0, orders: 0, average: 0, cancelledRate: 0 })
    expect(revenueByMonth([])).toEqual([])
  })

  it('groups revenue by month in date order', () => {
    expect(revenueByMonth(orders)).toEqual([
      { month: 'Jan', revenue: 300 },
      { month: 'Feb', revenue: 300 },
    ])
  })

  it('counts every status and sums revenue per region', () => {
    expect(ordersByStatus(orders).find(s => s.status === 'cancelled')?.count).toBe(1)
    expect(ordersByStatus(orders).reduce((s, x) => s + x.count, 0)).toBe(4)
    expect(revenueByRegion(orders)).toEqual([
      { region: 'North', revenue: 300 },
      { region: 'South', revenue: 300 },
      { region: 'East', revenue: 0 },
      { region: 'West', revenue: 0 },
    ])
  })
})
