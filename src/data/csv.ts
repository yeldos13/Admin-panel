import type { Order } from './orders'

const COLUMNS: (keyof Order)[] = ['id', 'date', 'customer', 'product', 'region', 'status', 'amount', 'note']

function cell(value: string | number): string {
  let s = String(value)
  // stop spreadsheets from running user text as a formula
  if (typeof value === 'string' && /^[=+\-@\t\r]/.test(s)) s = `'${s}`
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export function toCsv(orders: Order[]): string {
  return [COLUMNS.join(','), ...orders.map(o => COLUMNS.map(c => cell(o[c])).join(','))].join('\r\n')
}

export function downloadCsv(orders: Order[], filename = 'orders.csv') {
  // BOM so Excel opens UTF-8 correctly
  const url = URL.createObjectURL(new Blob(['﻿' + toCsv(orders)], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000) // some browsers start the download async
}
