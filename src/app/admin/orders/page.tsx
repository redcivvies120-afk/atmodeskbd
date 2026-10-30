import { requireAdmin } from '@/lib/admin-guard'
import React from 'react'
import { prisma } from '@/lib/prisma'
import { OrderRowClient } from './OrderRowClient'
import Link from 'next/link'
import { ensureDatabaseTables } from '@/lib/init-db'
import {
  Package,
  Clock,
  Truck,
  CheckCircle2,
  RotateCcw,
  XCircle,
  Layers,
  Inbox,
} from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface OrdersPageProps {
  searchParams: Promise<{ status?: string }>
}

export default async function AdminOrdersPage({ searchParams }: OrdersPageProps) {
  await requireAdmin()
  const { status: rawStatus } = await searchParams
  const activeTab = (rawStatus || 'NEW').toUpperCase()

  let orders: any[] = []
  let counts = {
    all: 0,
    new: 0,
    prepared: 0,
    shipped: 0,
    delivered: 0,
    returns: 0,
    cancelled: 0,
  }

  try {
    await ensureDatabaseTables()

    // Query counts in parallel
    const [all, newO, prep, ship, deliv, rets, canc] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.count({ where: { status: { in: ['PROCESSING', 'CONFIRMED'] } } }),
      prisma.order.count({ where: { status: { in: ['SHIPPED', 'OUT_FOR_DELIVERY'] } } }),
      prisma.order.count({ where: { status: 'DELIVERED' } }),
      prisma.order.count({ where: { status: { in: ['RETURN_REQUESTED', 'RETURNED', 'REFUNDED'] } } }),
      prisma.order.count({ where: { status: 'CANCELLED' } }),
    ])

    counts = {
      all,
      new: newO,
      prepared: prep,
      shipped: ship,
      delivered: deliv,
      returns: rets,
      cancelled: canc,
    }

    // Build query filter based on the active stage tab
    const where: any = {}
    if (activeTab === 'NEW' || activeTab === 'PENDING') {
      where.status = 'PENDING'
    } else if (activeTab === 'PREPARED' || activeTab === 'PROCESSING') {
      where.status = { in: ['PROCESSING', 'CONFIRMED'] }
    } else if (activeTab === 'SHIPPED') {
      where.status = { in: ['SHIPPED', 'OUT_FOR_DELIVERY'] }
    } else if (activeTab === 'COMPLETED' || activeTab === 'DELIVERED') {
      where.status = 'DELIVERED'
    } else if (activeTab === 'RETURNS') {
      where.status = { in: ['RETURN_REQUESTED', 'RETURNED', 'REFUNDED'] }
    } else if (activeTab === 'CANCELLED') {
      where.status = 'CANCELLED'
    } // activeTab === 'ALL' leaves where empty

    orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        address: true,
      },
    })
  } catch (err) {
    console.error('AdminOrdersPage error:', err)
  }

  const stageTabs = [
    {
      key: 'NEW',
      label: 'New Orders',
      icon: Inbox,
      count: counts.new,
      desc: 'Newly placed orders waiting for phone verification & acceptance',
      badgeColor: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    },
    {
      key: 'PREPARED',
      label: 'Prepared in Warehouse',
      icon: Package,
      count: counts.prepared,
      desc: 'Orders packaged & ready in warehouse, waiting for courier rider pickup',
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
    },
    {
      key: 'SHIPPED',
      label: 'Shipped / In Transit',
      icon: Truck,
      count: counts.shipped,
      desc: 'Handed over to courier; on the road to customers',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    },
    {
      key: 'COMPLETED',
      label: 'Completed / Delivered',
      icon: CheckCircle2,
      count: counts.delivered,
      desc: 'Successfully delivered and Cash on Delivery collected',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      key: 'RETURNS',
      label: 'Returns & Refunds',
      icon: RotateCcw,
      count: counts.returns,
      desc: 'Customer replacement and refund requests under 7-day guarantee',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    },
    {
      key: 'CANCELLED',
      label: 'Cancelled',
      icon: XCircle,
      count: counts.cancelled,
      desc: 'Orders cancelled before leaving warehouse',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    },
    {
      key: 'ALL',
      label: 'All Orders',
      icon: Layers,
      count: counts.all,
      desc: 'Complete history across all order stages',
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
    },
  ]

  const currentTabInfo = stageTabs.find((t) => t.key === activeTab) || stageTabs[0]

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Order Fulfillment Center
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Sort and fulfill orders through each stage: New &rarr; Prepared &rarr; Shipped &rarr; Delivered.
          </p>
        </div>
      </div>

      {/* Stage Navigation Tabs with Live Counts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {stageTabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.key
          return (
            <Link
              key={tab.key}
              href={`/admin/orders?status=${tab.key}`}
              className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between gap-2 ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/10'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                <span
                  className={`text-xs font-black px-2 py-0.5 rounded-full border ${
                    isActive
                      ? 'bg-white/20 text-white border-white/30'
                      : tab.badgeColor
                  }`}
                >
                  {tab.count}
                </span>
              </div>
              <span className="text-xs font-bold leading-tight block">
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>

      {/* Stage Header Info Banner */}
      <div className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
          <strong className="text-slate-900 font-extrabold text-sm">
            {currentTabInfo.label} ({orders.length})
          </strong>
          <span className="text-slate-400 hidden sm:inline">·</span>
          <span className="text-slate-500">{currentTabInfo.desc}</span>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Order ID / Date</th>
                <th className="py-3.5 px-4">Customer / City</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Total (COD)</th>
                <th className="py-3.5 px-4">Status &amp; Stage</th>
                <th className="py-3.5 px-4">Quick Actions &amp; Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    <div className="space-y-1">
                      <p className="font-bold text-sm text-slate-700">No orders in this stage</p>
                      <p className="text-xs text-slate-400">
                        {activeTab === 'PREPARED'
                          ? 'When you prepare and pack orders, they will appear here ready for the courier.'
                          : activeTab === 'NEW'
                          ? 'All new customer orders have been accepted.'
                          : 'There are currently no orders under this filter.'}
                      </p>
                    </div>
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
