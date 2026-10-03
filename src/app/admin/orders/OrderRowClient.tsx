'use client'

import React, { useState } from 'react'
import { formatBDT, formatDate, getOrderStatusColor, getOrderStatusLabel } from '@/lib/utils'
import { useToast } from '@/components/shared/Providers'
import {
  ChevronDown,
  ChevronUp,
  Phone,
  MapPin,
  Package,
  MessageCircle,
  Printer,
  ExternalLink,
} from 'lucide-react'

export function OrderRowClient({ order }: { order: any }) {
  const { toast } = useToast()
  const [status, setStatus] = useState(order.status)
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '')
  const [isUpdating, setIsUpdating] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus)
    setIsUpdating(true)
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error('Failed to update status')
      toast(`Order ${order.orderNumber} -> ${getOrderStatusLabel(newStatus)}`)
    } catch (err: any) {
      toast(err.message || 'Error updating order', 'error')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleSaveTracking = async () => {
    setIsUpdating(true)
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingNumber }),
      })
      if (!res.ok) throw new Error('Failed to save tracking number')
      toast(`Tracking updated for ${order.orderNumber}`)
    } catch (err: any) {
      toast(err.message || 'Error saving tracking', 'error')
    } finally {
      setIsUpdating(false)
    }
  }

  const addr = order.address
  const phone = addr?.phone || ''
  const waPhone = phone.startsWith('0') ? '88' + phone : phone.replace('+', '')

  // Build full address string
  const fullAddress = [
    addr?.line1,
    addr?.line2,
    addr?.area,
    addr?.city,
    addr?.district,
    addr?.postalCode,
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <>
      {/* Main Row */}
      <tr
        className={`hover:bg-slate-50/70 transition text-xs cursor-pointer ${
          showDetails ? 'bg-sky-50/40' : ''
        }`}
        onClick={() => setShowDetails(!showDetails)}
      >
        {/* Order ID / Date */}
        <td className="py-3.5 px-4">
          <span className="font-mono font-bold text-slate-900 block">{order.orderNumber}</span>
          <span className="text-[11px] text-slate-400">{formatDate(order.createdAt)}</span>
        </td>

        {/* Customer / City */}
        <td className="py-3.5 px-4">
          <strong className="text-slate-900 block">{addr?.fullName || 'Customer'}</strong>
          <a
            href={`tel:${phone}`}
            onClick={(e) => e.stopPropagation()}
            className="text-sky-600 font-mono hover:underline block"
          >
            {phone}
          </a>
          <span className="text-[11px] text-slate-400">
            {addr?.city}
            {addr?.district ? `, ${addr.district}` : ''}
          </span>
        </td>

        {/* Items */}
        <td className="py-3.5 px-4">
          <span className="text-slate-700 font-semibold">
            {order.items.length} item{order.items.length > 1 ? 's' : ''}
          </span>
          <span className="text-[11px] text-sky-600 flex items-center gap-0.5 mt-0.5 font-medium">
            {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {showDetails ? 'Hide details' : 'View details'}
          </span>
        </td>

        {/* Total (BDT) */}
        <td className="py-3.5 px-4 font-bold text-slate-900">
          {formatBDT(order.total)}
          <span className="text-[10px] text-slate-400 block font-normal">
            {order.paymentMethod}
          </span>
        </td>

        {/* Status Dropdown */}
        <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={isUpdating}
            className={`px-2.5 py-1 rounded-full font-bold text-[11px] outline-none border cursor-pointer ${getOrderStatusColor(
              status
            )}`}
          >
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </td>

        {/* Printable Invoice & Tracking Actions */}
        <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2">
            {/* Direct Printable Invoice Button */}
            <a
              href={`/admin/orders/${order.id}/invoice`}
              target="_blank"
              rel="noopener noreferrer"
              title="Open Printable A4 Invoice & Packing Slip"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition"
            >
              <Printer className="w-3.5 h-3.5 text-sky-400" />
              Invoice
            </a>

            {/* Manual Tracking Save */}
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Tracking ID..."
                className="w-24 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[10px] outline-none font-mono"
              />
              <button
                onClick={handleSaveTracking}
                disabled={isUpdating}
                className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 text-[10px] font-bold rounded-lg transition"
              >
                Save
              </button>
            </div>
          </div>
        </td>
      </tr>

      {/* Expanded Details Row */}
      {showDetails && (
        <tr className="bg-sky-50/30 border-t border-sky-100">
          <td colSpan={6} className="px-6 py-5">
            <div className="space-y-5">
              {/* Top Row: Customer info, Address, Items */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                {/* Customer Info */}
                <div className="space-y-2 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-100 pb-1">
                    Customer Information
                  </h4>
                  <div className="space-y-1.5 text-slate-600">
                    <p className="font-bold text-slate-900 text-sm">{addr?.fullName || '—'}</p>
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-sky-500 flex-shrink-0" />
                      <a href={`tel:${phone}`} className="text-sky-600 hover:underline font-mono">
                        {phone || '—'}
                      </a>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <a
                        href={`https://wa.me/${waPhone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 font-semibold hover:underline"
                      >
                        WhatsApp Customer
                      </a>
                    </p>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="space-y-2 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-100 pb-1">
                    Delivery Address
                  </h4>
                  <div className="space-y-1.5 text-slate-600">
                    <p className="flex gap-1.5 leading-relaxed">
                      <MapPin className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                      <span>{fullAddress || 'No address provided'}</span>
                    </p>
                    {order.notes && (
                      <p className="text-amber-700 bg-amber-50 p-2 rounded-lg text-[11px]">
                        <strong>Note:</strong> {order.notes}
                      </p>
                    )}
                    <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold">
                      Zone: {order.shippingMethod || 'Inside Dhaka'}
                    </span>
                  </div>
                </div>

                {/* Items Ordered */}
                <div className="space-y-2 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-100 pb-1">
                    Items ({order.items.length})
                  </h4>
                  <div className="space-y-1.5">
                    {order.items.map((item: any) => (
                      <div key={item.id} className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-1.5">
                          <Package className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700">
                            <strong className="text-slate-900">{item.quantity}x</strong>{' '}
                            {item.name}
                          </span>
                        </div>
                        <strong className="text-slate-900 font-mono flex-shrink-0">
                          {formatBDT(item.total)}
                        </strong>
                      </div>
                    ))}
                    <div className="flex justify-between pt-2 border-t border-slate-100 font-bold text-slate-900">
                      <span>Total COD Amount:</span>
                      <span className="font-mono text-sm">{formatBDT(order.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Printable Invoice & Packing Slip Section */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-sky-400 flex-shrink-0">
                    <Printer className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">
                      Printable Tax Invoice & Packing Slip (A4)
                    </h5>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Includes ATMODESK branding, customer address, barcode, COD breakdown, and 7-day warranty stamp.
                    </p>
                  </div>
                </div>

                <a
                  href={`/admin/orders/${order.id}/invoice`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition whitespace-nowrap"
                >
                  <Printer className="w-4 h-4 text-sky-400" />
                  Open & Print Invoice
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}
