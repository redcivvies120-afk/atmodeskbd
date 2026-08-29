'use client'

import React, { useState } from 'react'
import { formatBDT, formatDate, getOrderStatusColor, getOrderStatusLabel } from '@/lib/utils'
import { useToast } from '@/components/shared/Providers'
import { ChevronDown, ChevronUp, Phone, MapPin, Package, MessageCircle } from 'lucide-react'

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
      toast(`Order ${order.orderNumber} → ${getOrderStatusLabel(newStatus)}`)
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
  ].filter(Boolean).join(', ')

  return (
    <>
      {/* Main Row */}
      <tr
        className={`hover:bg-slate-50/70 transition text-xs cursor-pointer ${showDetails ? 'bg-sky-50/40' : ''}`}
        onClick={() => setShowDetails(!showDetails)}
      >
        <td className="py-3.5 px-4">
          <span className="font-mono font-bold text-slate-900 block">{order.orderNumber}</span>
          <span className="text-[11px] text-slate-400">{formatDate(order.createdAt)}</span>
        </td>

        <td className="py-3.5 px-4">
          <strong className="text-slate-900 block">{addr?.fullName || 'Customer'}</strong>
          <a
            href={`tel:${phone}`}
            onClick={(e) => e.stopPropagation()}
            className="text-sky-600 font-mono hover:underline block"
          >
            {phone}
          </a>
          <span className="text-[11px] text-slate-400">{addr?.city}{addr?.district ? `, ${addr.district}` : ''}</span>
        </td>

        <td className="py-3.5 px-4">
          <span className="text-slate-700 font-semibold">{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
          <span className="text-[11px] text-sky-600 flex items-center gap-0.5 mt-0.5">
            {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {showDetails ? 'Hide details' : 'View details'}
          </span>
        </td>

        <td className="py-3.5 px-4 font-bold text-slate-900">
          {formatBDT(order.total)}
          <span className="text-[10px] text-slate-400 block font-normal">{order.paymentMethod}</span>
        </td>

        <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={isUpdating}
            className={`px-2.5 py-1 rounded-full font-bold text-[11px] outline-none border cursor-pointer ${getOrderStatusColor(status)}`}
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

        <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Courier ID..."
              className="w-28 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] outline-none font-mono"
            />
            <button
              onClick={handleSaveTracking}
              className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold rounded-lg"
            >
              Save
            </button>
          </div>
        </td>
      </tr>

      {/* Expanded Details Row */}
      {showDetails && (
        <tr className="bg-sky-50/30 border-t border-sky-100">
          <td colSpan={6} className="px-6 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">

              {/* Customer Info */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">
                  Customer Info
                </h4>
                <div className="space-y-1 text-slate-600">
                  <p className="font-bold text-slate-900 text-sm">{addr?.fullName || '—'}</p>
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-sky-500 flex-shrink-0" />
                    <a href={`tel:${phone}`} className="text-sky-600 hover:underline font-mono">{phone || '—'}</a>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <MessageCircle className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                    <a
                      href={`https://wa.me/${waPhone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:underline"
                    >
                      WhatsApp Customer
                    </a>
                  </p>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">
                  Delivery Address
                </h4>
                <div className="space-y-1 text-slate-600">
                  <p className="flex gap-1.5">
                    <MapPin className="w-3 h-3 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>{fullAddress || 'No address provided'}</span>
                  </p>
                  {addr?.label && (
                    <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold">
                      {addr.label}
                    </span>
                  )}
                  {order.notes && (
                    <p className="text-amber-700 bg-amber-50 px-2 py-1 rounded-lg mt-1">
                      📝 Note: {order.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Items Ordered */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">
                  Items Ordered
                </h4>
                <div className="space-y-1.5">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-1.5">
                        <Package className="w-3 h-3 text-slate-400 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">
                          <strong className="text-slate-900">{item.quantity}×</strong> {item.name}
                        </span>
                      </div>
                      <strong className="text-slate-900 flex-shrink-0">{formatBDT(item.total)}</strong>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-slate-900">
                    <span>Total</span>
                    <span>{formatBDT(order.total)}</span>
                  </div>
                  {order.discountAmount > 0 && (
                    <p className="text-emerald-600 text-[11px]">
                      Coupon saved: {formatBDT(order.discountAmount)}
                      {order.couponCode && ` (${order.couponCode})`}
                    </p>
                  )}
                </div>
              </div>

            </div>
          </td>
        </tr>
      )}
    </>
  )
}
