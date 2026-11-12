import { describe, expect, it } from 'vitest'
import { generateOrders, REGIONS, STATUSES } from './orders'

describe('generateOrders', () => {
  const orders = generateOrders()

  it('creates 200 orders with unique ids', () => {
    expect(orders).toHaveLength(200)
    expect(new Set(orders.map(o => o.id)).size).toBe(200)
  })

  it('uses only allowed values', () => {
    for (const o of orders) {
      expect(STATUSES).toContain(o.status)
      expect(REGIONS).toContain(o.region)
      expect(o.amount).toBeGreaterThanOrEqual(50)
      expect(o.amount).toBeLessThan(5000)
      expect(o.date).toMatch(/^2026-\d\d-\d\d$/)
    }
  })

  it('is stable for the same seed', () => {
    expect(generateOrders()).toEqual(orders)
    expect(generateOrders(200, 7)).not.toEqual(orders)
  })
})
