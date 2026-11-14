import { PRODUCTS, REGIONS, STATUSES, type Order } from './orders'

export type Errors = Partial<Record<keyof Order, string>>

export function validateOrder(o: Order): Errors {
  const e: Errors = {}
  const customer = typeof o.customer === 'string' ? o.customer.trim() : ''
  if (!customer) e.customer = 'Customer is required'
  else if (customer.length > 60) e.customer = 'Max 60 characters'
  if (!(PRODUCTS as readonly string[]).includes(o.product)) e.product = 'Pick a product'
  if (!REGIONS.includes(o.region)) e.region = 'Pick a region'
  if (!STATUSES.includes(o.status)) e.status = 'Pick a status'
  if (!Number.isInteger(o.amount) || o.amount < 1 || o.amount > 100000) e.amount = 'Whole number from 1 to 100000'
  if (typeof o.date !== 'string' || !/^\d{4}-\d\d-\d\d$/.test(o.date) || isNaN(Date.parse(o.date))) e.date = 'Valid date required'
  if (typeof o.note !== 'string' || o.note.length > 200) e.note = 'Max 200 characters'
  return e
}

export const isValid = (o: Order) => Object.keys(validateOrder(o)).length === 0
