import React from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatBDT, formatDate, getOrderStatusLabel, getOrderStatusColor } from '@/lib/utils'
import {
  Banknote,
  Package,
  ShoppingBag,
  Users,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
} from 'lucide-react'
import { ensureDatabaseTables } from '@/lib/init-db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminDashboardPage() {
  let totalProducts = 0
  let totalOrders = 0
  let orders: any[] = []
  let lowStockProducts: any[] = []
  let totalCustomers = 0
  let categoriesCount = 0
  let totalRevenue = 0
  let allOrders: any[] = []

  try {
    await ensureDatabaseTables()
    const [
      tp,
      to,
      ord,
      low,
      cust,
      cats,
    ] = await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.order.findMany({
        take: 8,
        orderBy: { createdAt: 'desc' },
        include: { items: true, address: true },
      }),
      prisma.product.findMany({
        where: { stock: { lte: 10 }, isActive: true },
        take: 5,
      }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.category.count(),
    ])

    totalProducts = tp
    totalOrders = to
    orders = ord
    lowStockProducts = low
    totalCustomers = cust
    categoriesCount = cats

    allOrders = await prisma.order.findMany({
      select: { total: true, status: true, createdAt: true },
    })
    totalRevenue = allOrders.reduce((sum, o) => sum + (o.status !== 'CANCELLED' ? o.total : 0), 0)
  } catch (err) {
    console.error('Admin Dashboard query error:', err)
  }

  // Orders status count
  const pendingCount = allOrders.filter((o) => o.status === 'PENDING').length
  const confirmedCount = allOrders.filter((o) => o.status === 'CONFIRMED' || o.status === 'PROCESSING').length
  const shippedCount = allOrders.filter((o) => o.status === 'SHIPPED' || o.status === 'OUT_FOR_DELIVERY').length
  const deliveredCount = allOrders.filter((o) => o.status === 'DELIVERED').length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Admin Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time analytics and store management for Atmodeskbd.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition shadow-xs"
          >
            + Add New Product
          </Link>
          <Link
            href="/admin/orders"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
          >
            Manage Orders
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Sales</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Banknote className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {formatBDT(totalRevenue)}
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> All successful orders
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {totalOrders}
          </div>
          <p className="text-[11px] text-slate-500">
            {pendingCount} Pending · {deliveredCount} Delivered
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Products</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {totalProducts}
          </div>
          <p className="text-[11px] text-slate-500">
            Across {categoriesCount} categories
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Customers</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {totalCustomers}
          </div>
          <p className="text-[11px] text-slate-500">
            Bangladesh registered buyers
          </p>
        </div>
      </div>

      {/* Orders Status Pipeline */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
          Order Pipeline Status
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80">
            <span className="text-xs font-bold text-amber-800 uppercase block">Pending</span>
            <strong className="text-2xl font-black text-amber-900">{pendingCount}</strong>
          </div>
          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200/80">
            <span className="text-xs font-bold text-sky-800 uppercase block">Processing</span>
            <strong className="text-2xl font-black text-sky-900">{confirmedCount}</strong>
          </div>
          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200/80">
            <span className="text-xs font-bold text-purple-800 uppercase block">In Transit</span>
            <strong className="text-2xl font-black text-purple-900">{shippedCount}</strong>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80">
            <span className="text-xs font-bold text-emerald-800 uppercase block">Completed</span>
            <strong className="text-2xl font-black text-emerald-900">{deliveredCount}</strong>
          </div>
        </div>
      </div>

      {/* Two Columns: Recent Orders & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs font-bold text-sky-600 hover:underline">
              View All Orders →
            </Link>
          </div>

          {orders.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No orders yet.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {orders.map((o) => (
                <div key={o.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{o.orderNumber}</span>
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${getOrderStatusColor(o.status)}`}>
                        {getOrderStatusLabel(o.status)}
                      </span>
                    </div>
                    <p className="text-slate-500 mt-0.5">
                      {o.address?.fullName || 'Customer'} ({o.address?.city}) · {o.items.length} items
                    </p>
                  </div>
                  <div className="text-right">
                    <strong className="text-sm font-bold text-slate-900 block">{formatBDT(o.total)}</strong>
                    <span className="text-[11px] text-slate-400">{o.paymentMethod}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Low Stock Items
            </h2>
          </div>

          {lowStockProducts.length === 0 ? (
            <p className="text-xs text-emerald-600 py-4 text-center font-medium">
              All inventory levels are healthy!
            </p>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map((p) => (
                <div key={p.id} className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 flex items-center justify-between text-xs">
                  <div className="min-w-0 pr-2">
                    <p className="font-bold text-slate-900 truncate">{p.name}</p>
                    <span className="text-slate-500">{formatBDT(p.price)}</span>
                  </div>
                  <span className="bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-md flex-shrink-0 text-[11px]">
                    {p.stock} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
