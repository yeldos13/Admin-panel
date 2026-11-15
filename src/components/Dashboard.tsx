import type { ReactNode } from 'react'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { Order } from '../data/orders'
import { kpis, ordersByStatus, revenueByMonth, revenueByRegion } from '../data/stats'
import { money } from './OrdersTable'

const INK = '#4f46e5' // one hue: every chart here is a single series
const AXIS = { fontSize: 12, fill: '#64748b' }
const short = (v: number) => (v >= 1000 ? `$${Math.round(v / 1000)}k` : `$${v}`)
const tooltip = { cursor: { fill: '#f1f5f9' }, contentStyle: { borderRadius: 8, borderColor: '#e2e8f0', fontSize: 13 } }

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold tabular-nums">{value}</div>
    </div>
  )
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <figure className="rounded-lg border border-slate-200 bg-white p-4">
      <figcaption className="mb-3 text-sm font-medium text-slate-700">{title}</figcaption>
      <div className="h-60" role="img" aria-label={title}>
        <ResponsiveContainer>{children as React.ReactElement}</ResponsiveContainer>
      </div>
    </figure>
  )
}

export default function Dashboard({ orders }: { orders: Order[] }) {
  const k = kpis(orders)
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Tile label="Revenue" value={money.format(k.revenue)} />
        <Tile label="Orders" value={String(k.orders)} />
        <Tile label="Average order" value={money.format(k.average)} />
        <Tile label="Cancelled" value={`${Math.round(k.cancelledRate * 100)}%`} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Revenue by month">
          <LineChart data={revenueByMonth(orders)} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="month" tick={AXIS} tickLine={false} axisLine={false} />
            <YAxis tickFormatter={short} tick={AXIS} tickLine={false} axisLine={false} width={48} />
            <Tooltip {...tooltip} cursor={{ stroke: '#cbd5e1' }} formatter={v => [money.format(Number(v)), 'Revenue']} />
            <Line dataKey="revenue" stroke={INK} strokeWidth={2} dot={{ r: 4, fill: INK }} activeDot={{ r: 6 }} />
          </LineChart>
        </Card>
        <Card title="Revenue by region">
          <BarChart data={revenueByRegion(orders)} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="region" tick={AXIS} tickLine={false} axisLine={false} />
            <YAxis tickFormatter={short} tick={AXIS} tickLine={false} axisLine={false} width={48} />
            <Tooltip {...tooltip} formatter={v => [money.format(Number(v)), 'Revenue']} />
            <Bar dataKey="revenue" fill={INK} radius={[4, 4, 0, 0]} maxBarSize={48} />
          </BarChart>
        </Card>
        <Card title="Orders by status">
          <BarChart data={ordersByStatus(orders)} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
            <CartesianGrid horizontal={false} stroke="#e2e8f0" />
            <XAxis type="number" allowDecimals={false} tick={AXIS} tickLine={false} axisLine={false} />
            <YAxis type="category" dataKey="status" tick={AXIS} tickLine={false} axisLine={false} width={80} />
            <Tooltip {...tooltip} formatter={v => [v, 'Orders']} />
            <Bar dataKey="count" fill={INK} radius={[0, 4, 4, 0]} maxBarSize={28} />
          </BarChart>
        </Card>
      </div>
    </div>
  )
}
