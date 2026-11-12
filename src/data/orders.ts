export const STATUSES = ['new', 'processing', 'shipped', 'delivered', 'cancelled'] as const
export const REGIONS = ['North', 'South', 'East', 'West'] as const
export const PRODUCTS = ['Starter plan', 'Team plan', 'Business plan', 'Onboarding', 'Support pack', 'Custom report'] as const

export type Status = (typeof STATUSES)[number]
export type Region = (typeof REGIONS)[number]

export interface Order {
  id: string
  customer: string
  product: string
  region: Region
  status: Status
  amount: number // whole dollars
  date: string // YYYY-MM-DD
  note: string
}

const PREFIXES = ['Blue', 'Maple', 'Nova', 'Atlas', 'Cedar', 'Pixel', 'Harbor', 'Summit', 'Lumen', 'Orbit']
const SUFFIXES = ['Labs', 'Studio', 'Foods', 'Logistics', 'Clinic', 'Media', 'Works', 'Retail']
const NOTES = ['', '', '', 'Call before delivery', 'Invoice by email', 'Priority client', 'Waiting for payment']

// mulberry32: tiny seeded PRNG so the demo data is the same on every load
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function generateOrders(count = 200, seed = 42): Order[] {
  const r = rng(seed)
  const pick = <T,>(list: readonly T[]) => list[Math.floor(r() * list.length)]
  const start = Date.UTC(2026, 0, 1)
  return Array.from({ length: count }, (_, i) => ({
    id: `ORD-${String(1001 + i)}`,
    customer: `${pick(PREFIXES)} ${pick(SUFFIXES)}`,
    product: pick(PRODUCTS),
    region: pick(REGIONS),
    status: pick(STATUSES),
    amount: 50 + Math.floor(r() * 4950),
    date: new Date(start + Math.floor(r() * 300) * 86400000).toISOString().slice(0, 10),
    note: pick(NOTES),
  }))
}
