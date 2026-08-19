import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { formatBDT, formatDate, getOrderStatusLabel, getOrderStatusColor } from '@/lib/utils'
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Phone,
  ArrowRight,
  Clock,
  ShoppingBag,
} from 'lucide-react'

interface OrderConfirmedProps {
  params: Promise<{ orderNumber: string }>
}

export default async function OrderConfirmedPage({ params }: OrderConfirmedProps) {
  const { orderNumber } = await params
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: true,
      address: true,
      user: true,
    },
  })

  if (!order) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 text-center shadow-xs space-y-4">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm shadow-emerald-500/20">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider">
          Order Placed Successfully!
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Thank you, {order.address?.fullName || order.user.name || 'Customer'}!
        </h1>

        <p className="text-sm text-slate-500 max-w-md mx-auto">
          We have received your order and our team is preparing it for shipment. We will send you SMS / call updates as it moves.
        </p>

        <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-xs font-mono text-slate-700">
          <span>Order Number:</span>
          <strong className="text-sky-600 text-sm font-bold">{order.orderNumber}</strong>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Delivery Details */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Truck className="w-5 h-5 text-sky-600" /> Delivery Information
          </h2>

          <div className="space-y-2.5 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">{order.address?.fullName}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{order.address?.phone}</span>
            </div>
            <div className="flex items-start gap-2 text-xs">
              <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
              <span>
                {order.address?.line1}
                {order.address?.area ? `, ${order.address.area}` : ''}, {order.address?.city}
                {order.address?.postalCode ? ` - ${order.address.postalCode}` : ''}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-400 block">Shipping Method:</span>
              <strong className="text-slate-800">{order.shippingMethod || 'Standard Delivery'}</strong>
            </div>
            {order.estimatedDelivery && (
              <div className="text-xs">
                <span className="text-slate-400 block">Estimated Arrival:</span>
                <strong className="text-emerald-700">{formatDate(order.estimatedDelivery)}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Payment & Status */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Package className="w-5 h-5 text-sky-600" /> Order &amp; Payment Status
          </h2>

          <div className="space-y-3 text-sm text-slate-600">
            <div className="flex justify-between items-center text-xs">
              <span>Order Status:</span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getOrderStatusColor(order.status)}`}>
                {getOrderStatusLabel(order.status)}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span>Payment Method:</span>
              <strong className="text-slate-900">
                {order.paymentMethod === 'COD'
                  ? 'Cash on Delivery'
                  : order.paymentMethod === 'BKASH'
                  ? 'bKash Mobile Payment'
                  : order.paymentMethod === 'NAGAD'
                  ? 'Nagad Wallet'
                  : 'Credit/Debit Card'}
              </strong>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span>Payment Status:</span>
              <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full text-[11px]">
                {order.paymentStatus}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
              <span className="font-bold text-slate-900">Total Payable:</span>
              <span className="text-xl font-extrabold text-sky-600">{formatBDT(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Purchased Items Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          Purchased Items ({order.items.length})
        </h2>

        <div className="divide-y divide-slate-100">
          {order.items.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-14 h-14 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200">
                  <img src={item.image || '/placeholder-product.jpg'} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{item.name}</p>
                  <p className="text-xs text-slate-500">Qty: {item.quantity} × {formatBDT(item.price)}</p>
                </div>
              </div>
              <span className="text-sm font-bold text-slate-900 flex-shrink-0">
                {formatBDT(item.total)}
              </span>
            </div>
          ))}
        </div>

        {/* Final Receipt Breakdown */}
        <div className="border-t border-slate-200 pt-4 space-y-1.5 text-xs text-slate-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-semibold text-slate-900">{formatBDT(order.subtotal)}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>Discount</span>
              <span>-{formatBDT(order.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="font-semibold text-slate-900">
              {order.shippingCost === 0 ? 'FREE' : formatBDT(order.shippingCost)}
            </span>
          </div>
          <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-100">
            <span>Grand Total</span>
            <span className="text-sky-600 text-base">{formatBDT(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Next Step Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          href={`/track-order?orderNumber=${order.orderNumber}`}
          className="w-full sm:w-auto px-8 py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-xl transition text-center shadow-md shadow-sky-600/20"
        >
          Track Order Status
        </Link>
        <Link
          href="/products"
          className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-sm rounded-xl transition text-center"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}
