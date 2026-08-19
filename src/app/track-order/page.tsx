import React from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatBDT, formatDate, getOrderStatusLabel, getOrderStatusColor } from '@/lib/utils'
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  AlertCircle,
} from 'lucide-react'

interface TrackOrderProps {
  searchParams: Promise<{ orderNumber?: string; phone?: string }>
}

export default async function TrackOrderPage({ searchParams }: TrackOrderProps) {
  const { orderNumber, phone } = await searchParams

  let order: any = null
  let searched = false

  if (orderNumber || phone) {
    searched = true
    order = await prisma.order.findFirst({
      where: {
        OR: [
          ...(orderNumber ? [{ orderNumber: orderNumber.trim() }] : []),
          ...(phone ? [{ address: { phone: phone.trim() } }] : []),
        ],
      },
      include: {
        items: true,
        address: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  // Pipeline order steps
  const steps = [
    { key: 'PENDING', label: 'Order Placed' },
    { key: 'CONFIRMED', label: 'Confirmed' },
    { key: 'PROCESSING', label: 'Processing' },
    { key: 'SHIPPED', label: 'Shipped' },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
    { key: 'DELIVERED', label: 'Delivered' },
  ]

  const getStepIndex = (status: string) => {
    const idx = steps.findIndex((s) => s.key === status)
    return idx >= 0 ? idx : 0
  }

  const currentStepIndex = order ? getStepIndex(order.status) : 0

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Search Input Box */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-4 shadow-xs">
        <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center mx-auto">
          <Package className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Track Your Order
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Enter your Order Number (e.g. ATD-XXXX-XXXX) or registered 11-digit phone number to track live delivery status.
        </p>

        <form action="/track-order" method="GET" className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto pt-2">
          <input
            type="text"
            name="orderNumber"
            defaultValue={orderNumber || ''}
            placeholder="Order Number (e.g. ATD-...)"
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-sky-500 uppercase font-mono"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-sm shadow-sky-600/20"
          >
            <Search className="w-4 h-4" /> Track
          </button>
        </form>
      </div>

      {/* Result Display */}
      {order ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-8 shadow-xs">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Order Tracking
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 font-mono mt-0.5">
                {order.orderNumber}
              </h2>
              <p className="text-xs text-slate-500 mt-1">Placed on {formatDate(order.createdAt)}</p>
            </div>

            <div className="text-left sm:text-right">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getOrderStatusColor(order.status)}`}>
                {getOrderStatusLabel(order.status)}
              </span>
              {order.trackingNumber && (
                <p className="text-xs text-slate-600 font-mono mt-1">
                  Courier Tracking: <strong>{order.trackingNumber}</strong>
                </p>
              )}
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Delivery Progress
            </h3>

            <div className="relative">
              {/* Progress Line */}
              <div className="hidden sm:block absolute top-5 left-6 right-6 h-1 bg-slate-100 rounded-full">
                <div
                  className="h-full bg-sky-600 rounded-full transition-all duration-500"
                  style={{
                    width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
                  }}
                />
              </div>

              {/* Steps Icons */}
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 relative z-10">
                {steps.map((s, idx) => {
                  const isDone = idx <= currentStepIndex
                  const isCurrent = idx === currentStepIndex
                  return (
                    <div key={s.key} className="flex flex-col items-center text-center space-y-2">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition ${
                          isDone
                            ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                            : 'bg-white border-2 border-slate-200 text-slate-400'
                        } ${isCurrent ? 'ring-4 ring-sky-100' : ''}`}
                      >
                        {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </div>
                      <span
                        className={`text-xs font-semibold ${
                          isDone ? 'text-slate-900' : 'text-slate-400'
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Delivery & Items Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
            <div className="space-y-2 text-xs text-slate-600">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-sky-600" /> Destination
              </h4>
              <p><strong>Recipient:</strong> {order.address?.fullName}</p>
              <p><strong>Phone:</strong> {order.address?.phone}</p>
              <p>
                <strong>Address:</strong> {order.address?.line1}, {order.address?.city}
              </p>
              {order.estimatedDelivery && (
                <p className="text-emerald-700 font-bold pt-1">
                  Estimated Delivery: {formatDate(order.estimatedDelivery)}
                </p>
              )}
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-sky-600" /> Payment &amp; Total
              </h4>
              <p><strong>Method:</strong> {order.paymentMethod === 'COD' ? 'Cash on Delivery' : order.paymentMethod}</p>
              <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
              <p className="text-base font-extrabold text-slate-900 pt-1">
                Payable Amount: <span className="text-sky-600">{formatBDT(order.total)}</span>
              </p>
            </div>
          </div>
        </div>
      ) : searched ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No order found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Please verify the order number (e.g. ATD-XXXX-XXXX) or phone number you entered and try again.
          </p>
        </div>
      ) : null}
    </div>
  )
}
