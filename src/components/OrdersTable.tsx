import { useState } from 'react'
import type { Order, Status } from '../data/orders'
import { sortOrders, type Sort, type SortKey } from '../data/query'

const PAGE_SIZE = 20

const COLUMNS: { key: SortKey; label: string; align?: 'right' }[] = [
  { key: 'id', label: 'Order' },
  { key: 'date', label: 'Date' },
  { key: 'customer', label: 'Customer' },
  { key: 'product', label: 'Product' },
  { key: 'region', label: 'Region' },
  { key: 'status', label: 'Status' },
  { key: 'amount', label: 'Amount', align: 'right' },
]

export const STATUS_STYLES: Record<Status, string> = {
  new: 'bg-sky-100 text-sky-800',
  processing: 'bg-amber-100 text-amber-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-slate-200 text-slate-700',
}

export const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

export function OrdersTable({ orders }: { orders: Order[] }) {
  const [sort, setSort] = useState<Sort>({ key: 'date', dir: 'desc' })
  const [page, setPage] = useState(0)

  const pages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE))
  const current = Math.min(page, pages - 1)
  const rows = sortOrders(orders, sort).slice(current * PAGE_SIZE, (current + 1) * PAGE_SIZE)

  const toggle = (key: SortKey) =>
    setSort(s => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }))

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              {COLUMNS.map(c => (
                <th
                  key={c.key}
                  aria-sort={sort.key === c.key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}
                  className={`px-3 py-2 font-medium ${c.align === 'right' ? 'text-right' : ''}`}
                >
                  <button onClick={() => toggle(c.key)} className="inline-flex items-center gap-1 hover:text-slate-900">
                    {c.label}
                    <span aria-hidden className="w-3 text-xs">
                      {sort.key === c.key ? (sort.dir === 'asc' ? '▲' : '▼') : ''}
                    </span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map(o => (
              <tr key={o.id} className="hover:bg-slate-50">
                <td className="px-3 py-2 font-mono text-xs">{o.id}</td>
                <td className="px-3 py-2 whitespace-nowrap">{o.date}</td>
                <td className="px-3 py-2">{o.customer}</td>
                <td className="px-3 py-2">{o.product}</td>
                <td className="px-3 py-2">{o.region}</td>
                <td className="px-3 py-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[o.status]}`}>{o.status}</span>
                </td>
                <td className="px-3 py-2 text-right tabular-nums">{money.format(o.amount)}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className="px-3 py-8 text-center text-slate-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-slate-200 px-3 py-2 text-sm text-slate-600">
        <span>
          Page {current + 1} of {pages}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage(current - 1)}
            disabled={current === 0}
            className="rounded-md border border-slate-300 px-3 py-1 disabled:opacity-40"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(current + 1)}
            disabled={current >= pages - 1}
            className="rounded-md border border-slate-300 px-3 py-1 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
