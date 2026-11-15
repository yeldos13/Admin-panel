import { describe, expect, it } from 'vitest'
import { toCsv } from './csv'
import { generateOrders, type Order } from './orders'

const base: Order = generateOrders(1)[0]
const line = (o: Partial<Order>) => toCsv([{ ...base, ...o }]).split('\r\n')[1]

describe('toCsv', () => {
  it('writes a header and one row per order', () => {
    const rows = toCsv(generateOrders(3)).split('\r\n')
    expect(rows[0]).toBe('id,date,customer,product,region,status,amount,note')
    expect(rows).toHaveLength(4)
  })

  it('quotes commas, quotes and line breaks', () => {
    expect(line({ note: 'a, b' })).toMatch(/,"a, b"$/)
    expect(line({ note: 'say "hi"' })).toMatch(/,"say ""hi"""$/)
    expect(line({ note: 'one\ntwo' })).toMatch(/,"one\ntwo"$/)
  })

  it('neutralises formula-like text but keeps numbers', () => {
    expect(line({ customer: '=HYPERLINK("x")', note: '@cmd' })).toContain(`"'=HYPERLINK(""x"")"`)
    expect(line({ note: '@cmd' })).toMatch(/,'@cmd$/)
    expect(line({ amount: 120 })).toContain(',120,')
  })

  it('returns only the header for an empty list', () => {
    expect(toCsv([])).toBe('id,date,customer,product,region,status,amount,note')
  })
})
