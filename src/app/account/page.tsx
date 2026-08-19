import React from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatBDT, formatDate, getOrderStatusLabel, getOrderStatusColor } from '@/lib/utils'
import {
  User,
  Package,
  Heart,
  MapPin,
  Clock,
  ArrowRight,
  Shield,
} from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AccountPage() {
  let orders: any[] = []
  try {
    orders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    })
  } catch (err) {
    console.error('Error fetching orders:', err)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center text-xl font-black">
            AD
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Atmodesk Member</h1>
            <p className="text-xs text-slate-500 mt-0.5">+880 1318-043562 · New Eskaton, Dhaka</p>
            <span className="inline-block mt-2 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-full uppercase tracking-wider">
              Verified Customer
            </span>
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <Link
            href="/track-order"
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs"
          >
            <Package className="w-3.5 h-3.5" /> Track Orders
          </Link>
          <Link
            href="/wishlist"
            className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
          >
            <Heart className="w-3.5 h-3.5" /> Wishlist
          </Link>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-sky-600" /> Recent Orders
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">View your past order history and tracking status.</p>
          </div>
          <Link
            href="/track-order"
            className="text-xs font-bold text-sky-600 hover:underline"
          >
            Track Order →
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-10 space-y-3">
            <p className="text-sm text-slate-500">You have not placed any orders yet.</p>
            <Link
              href="/products"
              className="inline-block px-5 py-2.5 bg-sky-600 text-white font-bold text-xs rounded-xl hover:bg-sky-700 transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {orders.map((o) => (
              <div key={o.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-slate-900">{o.orderNumber}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getOrderStatusColor(o.status)}`}>
                      {getOrderStatusLabel(o.status)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Placed on {formatDate(o.createdAt)} · {o.items.length} items · Payment: {o.paymentMethod}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Total</span>
                    <strong className="text-base font-extrabold text-slate-900">{formatBDT(o.total)}</strong>
                  </div>
                  <Link
                    href={`/order-confirmed/${o.orderNumber}`}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition"
                  >
                    View Order
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
