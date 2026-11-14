import { useMemo, useState } from 'react'
import { OrderFilters } from './components/OrderFilters'
import { OrdersTable } from './components/OrdersTable'
import { generateOrders } from './data/orders'
import { ROLES, type Role } from './data/permissions'
import { emptyFilters, filterOrders } from './data/query'

const TABS = ['Orders', 'Dashboard'] as const
type Tab = (typeof TABS)[number]

export default function App() {
  const [role, setRole] = useState<Role>('admin')
  const [tab, setTab] = useState<Tab>('Orders')
  const [orders] = useState(generateOrders)
  const [filters, setFilters] = useState(emptyFilters)
  const filtered = useMemo(() => filterOrders(orders, filters), [orders, filters])

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
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        {tab === 'Orders' ? (
          <>
            <OrderFilters value={filters} onChange={setFilters} count={filtered.length} />
            <OrdersTable orders={filtered} />
          </>
        ) : (
          <h2 className="text-xl font-semibold">Dashboard</h2>
        )}
      </main>
    </div>
  )
}
