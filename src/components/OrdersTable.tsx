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

export function OrdersTable({ orders, resetPageOn, onEdit }: { orders: Order[]; resetPageOn: unknown; onEdit: (o: Order) => void }) {
  const [sort, setSort] = useState<Sort>({ key: 'date', dir: 'desc' })
  const [page, setPage] = useState(0)
  const [seen, setSeen] = useState(resetPageOn)
  if (seen !== resetPageOn) {
    // back to page 1 when filters change, but not after an edit
    setSeen(resetPageOn)
    setPage(0)
  }

  const pages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE))
  const current = Math.min(page, pages - 1)
  const rows = sortOrders(orders, sort).slice(current * PAGE_SIZE, (current + 1) * PAGE_SIZE)

  const toggle = (key: SortKey) =>
    setSort(s => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }))

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="flex gap-2 border-b border-slate-200 p-3 sm:hidden">
        <select
          value={sort.key}
          onChange={e => setSort(s => ({ ...s, key: e.target.value as SortKey }))}
          aria-label="Sort by"
          className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          {COLUMNS.map(c => (
            <option key={c.key} value={c.key}>
              Sort by {c.label.toLowerCase()}
            </option>
          ))}
        </select>
        <button
          onClick={() => setSort(s => ({ ...s, dir: s.dir === 'asc' ? 'desc' : 'asc' }))}
          aria-label={sort.dir === 'asc' ? 'Ascending, switch to descending' : 'Descending, switch to ascending'}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          {sort.dir === 'asc' ? '▲' : '▼'}
        </button>
      </div>
      <ul className="divide-y divide-slate-100 sm:hidden">
        {rows.map(o => (
          <li key={o.id}>
            <button onClick={() => onEdit(o)} aria-label={`Edit ${o.id}`} className="block w-full p-3 text-left text-sm hover:bg-slate-50">
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium">{o.customer}</span>
              <span className="tabular-nums font-medium">{money.format(o.amount)}</span>
            </div>
            <div className="mt-1 flex items-center justify-between gap-2 text-slate-500">
              <span>
                <span className="font-mono text-xs">{o.id}</span> · {o.date}
              </span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[o.status]}`}>{o.status}</span>
            </div>
            <div className="mt-1 text-slate-500">
              {o.product} · {o.region}
            </div>
            </button>
          </li>
        ))}
        {rows.length === 0 && <li className="p-8 text-center text-slate-500">No orders found.</li>}
      </ul>
      <div className="hidden overflow-x-auto sm:block">
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
                <td className="px-3 py-2">
                  <button onClick={() => onEdit(o)} aria-label={`Edit ${o.id}`} className="font-mono text-xs text-sky-700 underline hover:text-sky-900">
                    {o.id}
                  </button>
                </td>
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
