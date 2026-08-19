'use client'

import React, { useState } from 'react'
import { formatBDT, formatDate, getOrderStatusColor, getOrderStatusLabel } from '@/lib/utils'
import { useToast } from '@/components/shared/Providers'

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
      toast(`Order ${order.orderNumber} updated to ${getOrderStatusLabel(newStatus)}`)
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

  return (
    <>
      <tr className="hover:bg-slate-50/50 transition text-xs">
        <td className="py-3.5 px-4">
          <span className="font-mono font-bold text-slate-900 block">{order.orderNumber}</span>
          <span className="text-[11px] text-slate-400">{formatDate(order.createdAt)}</span>
        </td>
        <td className="py-3.5 px-4">
          <strong className="text-slate-900 block">{order.address?.fullName || 'Customer'}</strong>
          <span className="text-slate-500">{order.address?.phone}</span>
          <span className="text-[11px] text-slate-400 block">{order.address?.city}</span>
        </td>
        <td className="py-3.5 px-4">
          <span className="text-slate-700 font-semibold">{order.items.length} items</span>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-[11px] text-sky-600 block hover:underline"
          >
            {showDetails ? 'Hide items' : 'View items'}
          </button>
        </td>
        <td className="py-3.5 px-4 font-bold text-slate-900">
          {formatBDT(order.total)}
          <span className="text-[10px] text-slate-400 block font-normal">{order.paymentMethod}</span>
        </td>
        <td className="py-3.5 px-4">
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
        <td className="py-3.5 px-4">
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

      {/* Expanded item details row */}
      {showDetails && (
        <tr className="bg-slate-50/80">
          <td colSpan={6} className="py-3 px-6 text-xs text-slate-600 space-y-2">
            <div className="font-bold text-slate-900">Delivery Address:</div>
            <p>
              {order.address?.line1}, {order.address?.area}, {order.address?.city} {order.address?.postalCode}
            </p>
            <div className="font-bold text-slate-900 pt-1">Items List:</div>
            <div className="space-y-1">
              {order.items.map((i: any) => (
                <div key={i.id} className="flex justify-between max-w-md">
                  <span>
                    {i.quantity} × {i.name}
                  </span>
                  <strong>{formatBDT(i.total)}</strong>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}
