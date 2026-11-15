import { lazy, Suspense, useMemo, useState } from 'react'
import { OrderFilters } from './components/OrderFilters'
import { EditOrderDialog } from './components/EditOrderDialog'
import { OrdersTable } from './components/OrdersTable'
import { downloadCsv } from './data/csv'
import type { Order } from './data/orders'
import { applyEdit, can, ROLE_HINTS, ROLES, type Role } from './data/permissions'
import { emptyFilters, filterOrders } from './data/query'
import { clearOrders, loadOrders, saveOrders } from './data/storage'

// charts library loads only when the Dashboard tab opens
const Dashboard = lazy(() => import('./components/Dashboard'))

const TABS = ['Orders', 'Dashboard'] as const
type Tab = (typeof TABS)[number]

export default function App() {
  const [role, setRole] = useState<Role>('admin')
  const [tab, setTab] = useState<Tab>('Orders')
  const [orders, setOrders] = useState(loadOrders)
  const [editing, setEditing] = useState<Order | null>(null)
  const [filters, setFilters] = useState(emptyFilters)
  const filtered = useMemo(() => filterOrders(orders, filters), [orders, filters])

  const update = (next: Order[]) => {
    setOrders(next)
    saveOrders(next)
  }
  const save = (o: Order) => {
    update(orders.map(x => (x.id === o.id ? applyEdit(role, x, o) : x)))
    setEditing(null)
  }
  const remove = (o: Order) => {
    if (!can(role, 'delete')) return
    update(orders.filter(x => x.id !== o.id))
    setEditing(null)
  }
  const reset = () => {
    if (!can(role, 'reset') || !confirm('Reset all orders to the original demo data?')) return
    clearOrders()
    setOrders(loadOrders())
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <p className="bg-amber-100 px-4 py-2 text-center text-sm text-amber-900">
        Demo app with fictional data. Changes stay in your browser.
      </p>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
          <h1 className="text-lg font-semibold">Orders Admin</h1>
          <nav className="flex gap-1" aria-label="Sections">
            {TABS.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                aria-current={tab === t ? 'page' : undefined}
                className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                  tab === t ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {t}
              </button>
            ))}
          </nav>
          <label className="ml-auto flex items-center gap-2 text-sm text-slate-600">
            Role
            <select
              value={role}
              onChange={e => setRole(e.target.value as Role)}
              className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-slate-900"
            >
              {ROLES.map(r => (
                <option key={r} value={r}>
                  {r[0].toUpperCase() + r.slice(1)}
                </option>
              ))}
            </select>
          </label>
          {can(role, 'reset') && (
            <button onClick={reset} className="text-sm text-slate-600 underline hover:text-slate-900">
              Reset data
            </button>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <p className="mb-4 text-sm text-slate-500">{ROLE_HINTS[role]}</p>
        {tab === 'Orders' ? (
          <>
            <OrderFilters
              value={filters}
              onChange={setFilters}
              count={filtered.length}
              onExport={can(role, 'export') ? () => downloadCsv(filtered) : undefined}
            />
            <OrdersTable orders={filtered} resetPageOn={filters} onEdit={setEditing} />
          </>
        ) : (
          <Suspense fallback={<p className="text-sm text-slate-500">Loading charts…</p>}>
            <Dashboard orders={orders} />
          </Suspense>
        )}
      </main>
      {editing && <EditOrderDialog key={editing.id} order={editing} role={role} onSave={save} onDelete={remove} onClose={() => setEditing(null)} />}
    </div>
  )
}
