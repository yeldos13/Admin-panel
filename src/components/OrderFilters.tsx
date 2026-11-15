import { REGIONS, STATUSES } from '../data/orders'
import { emptyFilters, type Filters } from '../data/query'

const field = 'rounded-md border border-slate-300 bg-white px-3 py-2 text-sm'

interface Props {
  value: Filters
  onChange: (f: Filters) => void
  count: number
  onExport?: () => void // hidden when the role cannot export
}

export function OrderFilters({ value, onChange, count, onExport }: Props) {
  const set = (patch: Partial<Filters>) => onChange({ ...value, ...patch })
  const dirty = JSON.stringify(value) !== JSON.stringify(emptyFilters)

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <input
        type="search"
        value={value.search}
        onChange={e => set({ search: e.target.value })}
        placeholder="Search order, customer, product, note"
        aria-label="Search orders"
        className={`${field} w-full sm:w-72`}
      />
      <select value={value.status} onChange={e => set({ status: e.target.value as Filters['status'] })} aria-label="Status" className={field}>
        <option value="all">All statuses</option>
        {STATUSES.map(s => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <select value={value.region} onChange={e => set({ region: e.target.value as Filters['region'] })} aria-label="Region" className={field}>
        <option value="all">All regions</option>
        {REGIONS.map(r => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
      {dirty && (
        <button onClick={() => onChange(emptyFilters)} className="px-2 py-2 text-sm text-slate-600 underline hover:text-slate-900">
          Clear
        </button>
      )}
      <span className="ml-auto text-sm text-slate-500" aria-live="polite">
        {count} {count === 1 ? 'order' : 'orders'}
      </span>
      {onExport && (
        <button
          onClick={onExport}
          disabled={count === 0}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-100 disabled:opacity-40"
        >
          Export CSV
        </button>
      )}
    </div>
  )
}
