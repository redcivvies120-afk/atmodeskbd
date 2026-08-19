import React from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { OrderRowClient } from './OrderRowClient'

export const revalidate = 0

interface OrdersPageProps {
  searchParams: Promise<{ status?: string }>
}

export default async function AdminOrdersPage({ searchParams }: OrdersPageProps) {
  const { status } = await searchParams

  const where: any = {}
  if (status && status !== 'ALL') {
    where.status = status
  }

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      items: true,
      address: true,
    },
  })

  const statusFilters = [
    { label: 'All Orders', val: 'ALL' },
    { label: 'Pending', val: 'PENDING' },
    { label: 'Confirmed', val: 'CONFIRMED' },
    { label: 'Processing', val: 'PROCESSING' },
    { label: 'Shipped', val: 'SHIPPED' },
    { label: 'Out for Delivery', val: 'OUT_FOR_DELIVERY' },
    { label: 'Delivered', val: 'DELIVERED' },
    { label: 'Cancelled', val: 'CANCELLED' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Orders Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track, update, and manage all customer purchases and deliveries.
          </p>
        </div>
      </div>

      {/* Status Filter Chips */}
      <div className="flex flex-wrap gap-1.5 text-xs">
        {statusFilters.map((s) => (
          <Link
            key={s.val}
            href={`/admin/orders?status=${s.val}`}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              (status || 'ALL') === s.val
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {s.label}
          </Link>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Order ID / Date</th>
                <th className="py-3.5 px-4">Customer / City</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Total (BDT)</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Courier Tracking</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    No orders match the selected filter.
                  </td>
                </tr>
              ) : (
                orders.map((o) => <OrderRowClient key={o.id} order={o} />)
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
