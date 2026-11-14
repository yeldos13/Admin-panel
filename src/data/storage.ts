import { generateOrders, type Order } from './orders'
import { isValid } from './validate'

const KEY = 'admin-demo-orders-v1'

// localStorage can be blocked or hold edited junk, so fall back to fresh demo data
export function loadOrders(storage: Pick<Storage, 'getItem'> | undefined = globalThis.localStorage): Order[] {
  try {
    const parsed: unknown = JSON.parse(storage?.getItem(KEY) ?? 'null')
    if (Array.isArray(parsed) && parsed.length > 0 && parsed.every(o => o && typeof o.id === 'string' && isValid(o))) return parsed
  } catch {
    // ignore and use defaults
  }
  return generateOrders()
}

export function saveOrders(orders: Order[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(orders))
  } catch {
    // private mode or quota: edits just won't survive a reload
  }
}

export function clearOrders() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // nothing to clear
  }
}
