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
  Truck,
  Send,
  ExternalLink,
  Loader2,
  CheckCircle2,
} from 'lucide-react'

export function OrderRowClient({ order }: { order: any }) {
  const { toast } = useToast()
  const [status, setStatus] = useState(order.status)
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '')
  const [shippingMethod, setShippingMethod] = useState(order.shippingMethod || '')
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDispatching, setIsDispatching] = useState<string | null>(null) // 'steadfast' | 'pathao' | null
  const [isSendingSMS, setIsSendingSMS] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [smsType, setSmsType] = useState<'CONFIRM' | 'SHIPPED' | 'DELIVERED' | 'CUSTOM'>('CONFIRM')
  const [customSms, setCustomSms] = useState('')

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

  // 1-Click Courier Dispatch
  const handleCourierDispatch = async (courier: 'steadfast' | 'pathao') => {
    setIsDispatching(courier)
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/courier`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courier }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to dispatch to courier')

      setTrackingNumber(data.trackingCode)
      setStatus('SHIPPED')
      setShippingMethod(data.courierName)
      toast(
        `Dispatched via ${data.courierName}! Consignment: ${data.trackingCode} ${
          data.simulated ? '(Simulation Mode)' : ''
        }`
      )
    } catch (err: any) {
      toast(err.message || 'Courier dispatch failed', 'error')
    } finally {
      setIsDispatching(null)
    }
  }

  // Send Automated or Custom SMS
  const handleSendSMS = async (type: 'CONFIRM' | 'SHIPPED' | 'DELIVERED' | 'CUSTOM') => {
    setIsSendingSMS(true)
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/sms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          customMessage: type === 'CUSTOM' ? customSms : undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send SMS')

      toast(
        `SMS sent to customer! (${data.provider || 'Gateway'}) ${
          data.simulated ? '[Simulated]' : ''
        }`
      )
      if (type === 'CUSTOM') setCustomSms('')
    } catch (err: any) {
      toast(err.message || 'Failed to send SMS', 'error')
    } finally {
      setIsSendingSMS(false)
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

  // Compute courier tracking URL
  let courierTrackUrl = ''
  if (trackingNumber) {
    if (shippingMethod?.toLowerCase().includes('pathao') || trackingNumber.startsWith('PTH')) {
      courierTrackUrl = `https://merchant.pathao.com/tracking?consignment_id=${trackingNumber}`
    } else {
      courierTrackUrl = `https://steadfast.com.bd/tracking/${trackingNumber}`
    }
  }

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
            {showDetails ? 'Hide details' : 'View & Dispatch'}
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

        {/* Logistics & Actions */}
        <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
          <div className="flex flex-col gap-1.5 min-w-[170px]">
            {/* Quick Actions Bar */}
            <div className="flex items-center gap-1.5">
              <a
                href={`/admin/orders/${order.id}/invoice`}
                target="_blank"
                rel="noopener noreferrer"
                title="Print Invoice & Packing Slip (A4)"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold shadow-xs transition"
              >
                <Printer className="w-3 h-3" />
                Invoice
              </a>

              {trackingNumber ? (
                <a
                  href={courierTrackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Track consignment with courier"
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 text-[11px] font-mono font-bold transition"
                >
                  <Truck className="w-3 h-3" />
                  {trackingNumber}
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              ) : (
                <button
                  onClick={() => setShowDetails(true)}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 text-[10px] font-bold transition"
                >
                  <Truck className="w-3 h-3" />
                  Dispatch
                </button>
              )}
            </div>

            {/* Manual Tracking Save Field */}
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Tracking code..."
                className="w-28 px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-[10px] outline-none font-mono"
              />
              <button
                onClick={handleSaveTracking}
                disabled={isUpdating}
                className="px-1.5 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-[10px] font-semibold rounded"
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

              {/* Bangladesh Operations & Automation Bar */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* 1. Courier 1-Click Dispatch */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                        <Truck className="w-4 h-4 text-sky-600" />
                        1-Click Courier Dispatch
                      </h5>
                      {trackingNumber && (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-mono text-[10px] font-bold">
                          Dispatched
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Create consignment with API and auto-notify customer via SMS.
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        onClick={() => handleCourierDispatch('steadfast')}
                        disabled={isDispatching !== null}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition disabled:opacity-50 cursor-pointer"
                      >
                        {isDispatching === 'steadfast' ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Truck className="w-3.5 h-3.5" />
                        )}
                        Steadfast Courier
                      </button>

                      <button
                        onClick={() => handleCourierDispatch('pathao')}
                        disabled={isDispatching !== null}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition disabled:opacity-50 cursor-pointer"
                      >
                        {isDispatching === 'pathao' ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Truck className="w-3.5 h-3.5" />
                        )}
                        Pathao Courier
                      </button>
                    </div>

                    {trackingNumber && (
                      <div className="mt-2 p-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] flex items-center justify-between">
                        <span className="font-mono text-slate-700">Code: <strong>{trackingNumber}</strong></span>
                        <a
                          href={courierTrackUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-600 hover:underline font-bold inline-flex items-center gap-0.5"
                        >
                          Live Tracking <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* 2. Customer SMS Notifications */}
                  <div className="space-y-2">
                    <h5 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                      <Send className="w-4 h-4 text-emerald-600" />
                      Instant SMS Dispatch
                    </h5>
                    <p className="text-[11px] text-slate-500">
                      Send order updates straight to {phone || 'customer'}.
                    </p>

                    <div className="grid grid-cols-3 gap-1.5 pt-1">
                      <button
                        onClick={() => handleSendSMS('CONFIRM')}
                        disabled={isSendingSMS}
                        className="px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold transition text-center"
                      >
                        Confirmed
                      </button>
                      <button
                        onClick={() => handleSendSMS('SHIPPED')}
                        disabled={isSendingSMS}
                        className="px-2 py-1.5 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-800 text-[10px] font-bold transition text-center"
                      >
                        Dispatched
                      </button>
                      <button
                        onClick={() => handleSendSMS('DELIVERED')}
                        disabled={isSendingSMS}
                        className="px-2 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[10px] font-bold transition text-center"
                      >
                        Delivered
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1">
                      <input
                        type="text"
                        value={customSms}
                        onChange={(e) => setCustomSms(e.target.value)}
                        placeholder="Custom SMS text..."
                        className="flex-1 px-2.5 py-1 text-[11px] bg-slate-50 border border-slate-200 rounded-lg outline-none"
                      />
                      <button
                        onClick={() => handleSendSMS('CUSTOM')}
                        disabled={isSendingSMS || !customSms.trim()}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold rounded-lg disabled:opacity-50"
                      >
                        Send
                      </button>
                    </div>
                  </div>

                  {/* 3. Printable Invoice & Packing Slip */}
                  <div className="space-y-2 flex flex-col justify-between">
                    <div>
                      <h5 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                        <Printer className="w-4 h-4 text-slate-700" />
                        Printable Invoice & Packing Slip
                      </h5>
                      <p className="text-[11px] text-slate-500">
                        Official A4 tax invoice with customer address, COD stamp & barcode for courier pickup.
                      </p>
                    </div>

                    <div className="pt-2">
                      <a
                        href={`/admin/orders/${order.id}/invoice`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-sm"
                      >
                        <Printer className="w-4 h-4 text-sky-400" />
                        Open Printable A4 Invoice
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}
