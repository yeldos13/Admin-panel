import { useEffect, useRef, useState, type ReactNode } from 'react'
import { PRODUCTS, REGIONS, STATUSES, type Order } from '../data/orders'
import { can, type Role } from '../data/permissions'
import { validateOrder, type Errors } from '../data/validate'

const input = 'mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm disabled:bg-slate-100 disabled:text-slate-500'

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      {children}
      {error && <span className="mt-1 block text-xs font-normal text-red-600">{error}</span>}
    </label>
  )
}

interface Props {
  order: Order
  role: Role
  onSave: (o: Order) => void
  onDelete: (o: Order) => void
  onClose: () => void
}

export function EditOrderDialog({ order, role, onSave, onDelete, onClose }: Props) {
  const lockDetails = !can(role, 'editDetails')
  const lockStatus = !can(role, 'editStatus')
  const ref = useRef<HTMLDialogElement>(null)
  const [draft, setDraft] = useState({ ...order, amount: String(order.amount) })
  const [errors, setErrors] = useState<Errors>({})

  useEffect(() => ref.current?.showModal(), [])

  const set = (patch: Partial<typeof draft>) => setDraft(d => ({ ...d, ...patch }))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const next: Order = { ...draft, customer: draft.customer.trim(), amount: Number(draft.amount) }
    const errs = validateOrder(next)
    setErrors(errs)
    if (Object.keys(errs).length === 0) onSave(next)
  }

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby="edit-title"
      className="m-auto w-full max-w-lg rounded-lg p-0 shadow-xl backdrop:bg-slate-900/40"
    >
      <form onSubmit={submit} noValidate className="space-y-4 p-5">
        <h2 id="edit-title" className="text-lg font-semibold">
          {lockStatus ? 'Order' : 'Edit'} {order.id}
        </h2>
        <Field label="Customer" error={errors.customer}>
          <input className={input} disabled={lockDetails} value={draft.customer} onChange={e => set({ customer: e.target.value })} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Product" error={errors.product}>
            <select className={input} disabled={lockDetails} value={draft.product} onChange={e => set({ product: e.target.value })}>
              {PRODUCTS.map(p => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </Field>
          <Field label="Region" error={errors.region}>
            <select className={input} disabled={lockDetails} value={draft.region} onChange={e => set({ region: e.target.value as Order['region'] })}>
              {REGIONS.map(r => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </Field>
          <Field label="Status" error={errors.status}>
            <select className={input} disabled={lockStatus} value={draft.status} onChange={e => set({ status: e.target.value as Order['status'] })}>
              {STATUSES.map(s => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field label="Amount, USD" error={errors.amount}>
            <input className={input} disabled={lockDetails} inputMode="numeric" value={draft.amount} onChange={e => set({ amount: e.target.value })} />
          </Field>
          <Field label="Date" error={errors.date}>
            <input className={input} disabled={lockDetails} type="date" value={draft.date} onChange={e => set({ date: e.target.value })} />
          </Field>
        </div>
        <Field label="Note" error={errors.note}>
          <textarea className={input} disabled={lockStatus} rows={2} value={draft.note} onChange={e => set({ note: e.target.value })} />
        </Field>
        {lockStatus && <p className="text-sm text-slate-500">Your role can view this order but not change it.</p>}
        <div className="flex gap-2 pt-2">
          {can(role, 'delete') && (
            <button
              type="button"
              onClick={() => confirm(`Delete ${order.id}?`) && onDelete(order)}
              className="rounded-md px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
            >
              Delete
            </button>
          )}
          <button type="button" onClick={() => ref.current?.close()} className="ml-auto rounded-md border border-slate-300 px-4 py-2 text-sm">
            {lockStatus ? 'Close' : 'Cancel'}
          </button>
          {!lockStatus && (
            <button type="submit" className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white">
              Save
            </button>
          )}
        </div>
      </form>
    </dialog>
  )
}
