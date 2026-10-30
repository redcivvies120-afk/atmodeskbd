'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/shared/Providers'
import {
  RotateCcw,
  XCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Package,
  MessageCircle,
  ShieldCheck,
  Send,
  Loader2,
} from 'lucide-react'

interface CustomerOrderActionsProps {
  orderNumber: string
  status: string
  updatedAt: string | Date
  createdAt: string | Date
  token?: string | null
  phone?: string | null
  onStatusChange?: (newStatus: string) => void
}

export function CustomerOrderActions({
  orderNumber,
  status: initialStatus,
  updatedAt,
  createdAt,
  token,
  phone,
  onStatusChange,
}: CustomerOrderActionsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [currentStatus, setCurrentStatus] = useState(initialStatus)

  // Modal states
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelReason, setCancelReason] = useState('Change of delivery address / phone')
  const [customCancelReason, setCustomCancelReason] = useState('')
  const [isSubmittingCancel, setIsSubmittingCancel] = useState(false)

  const [showReturnModal, setShowReturnModal] = useState(false)
  const [returnReason, setReturnReason] = useState('Hardware malfunction / screen defect')
  const [resolution, setResolution] = useState<'REPLACEMENT' | 'REFUND'>('REPLACEMENT')
  const [refundMethod, setRefundMethod] = useState<'bKash' | 'Nagad' | 'Rocket'>('bKash')
  const [refundNumber, setRefundNumber] = useState('')
  const [returnDetails, setReturnDetails] = useState('')
  const [isSubmittingReturn, setIsSubmittingReturn] = useState(false)

  // 7-day warranty window calculation
  const deliveryDate = new Date(updatedAt || createdAt)
  const diffMs = Date.now() - deliveryDate.getTime()
  const daysSinceDelivery = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const daysRemaining = Math.max(0, 7 - daysSinceDelivery)
  const isWithin7Days = daysSinceDelivery <= 7

  // Can cancel: PENDING, CONFIRMED, PROCESSING (Prepared in warehouse, NOT yet shipped)
  const canCancel = ['PENDING', 'CONFIRMED', 'PROCESSING'].includes(currentStatus)
  const isShippedOrLater = ['SHIPPED', 'OUT_FOR_DELIVERY'].includes(currentStatus)
  const isDelivered = currentStatus === 'DELIVERED'
  const isReturnRequested = currentStatus === 'RETURN_REQUESTED'
  const isCancelled = currentStatus === 'CANCELLED'

  // Handle Cancellation Submit
  const handleCancelOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingCancel(true)

    try {
      const fullReason =
        cancelReason === 'Other' && customCancelReason.trim()
          ? customCancelReason.trim()
          : cancelReason

      const res = await fetch(`/api/orders/${orderNumber}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token || undefined,
          phone: phone || undefined,
          reason: fullReason,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to cancel order.')
      }

      toast('Order has been cancelled successfully.', 'success')
      setCurrentStatus('CANCELLED')
      setShowCancelModal(false)
      if (onStatusChange) onStatusChange('CANCELLED')
      router.refresh()
    } catch (err: any) {
      toast(err.message || 'Error cancelling order.', 'error')
    } finally {
      setIsSubmittingCancel(false)
    }
  }

  // Handle Return Submit
  const handleReturnOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (resolution === 'REFUND' && !refundNumber.trim()) {
      toast('Please provide your bKash/Nagad mobile number to receive your refund.', 'error')
      return
    }

    setIsSubmittingReturn(true)

    try {
      const res = await fetch(`/api/orders/${orderNumber}/return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token || undefined,
          phone: phone || undefined,
          reason: returnReason,
          resolution,
          refundMethod,
          refundNumber: refundNumber.trim(),
          details: returnDetails.trim(),
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit return request.')
      }

      toast('Return / refund request submitted! Our team will contact you.', 'success')
      setCurrentStatus('RETURN_REQUESTED')
      setShowReturnModal(false)
      if (onStatusChange) onStatusChange('RETURN_REQUESTED')
      router.refresh()
    } catch (err: any) {
      toast(err.message || 'Error submitting return request.', 'error')
    } finally {
      setIsSubmittingReturn(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* ── STAGE NOTIFICATION BANNER FOR CUSTOMER ────────────────── */}
      {currentStatus === 'PENDING' && (
        <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-900 animate-fade-in">
          <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="font-bold text-sm block">Order Received (Awaiting Confirmation)</strong>
            <p className="text-amber-800 leading-relaxed">
              We have received your order details. Our Dhaka fulfillment team will verify your address and prepare your parcel shortly.
            </p>
          </div>
        </div>
      )}

      {(currentStatus === 'PROCESSING' || currentStatus === 'CONFIRMED') && (
        <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl flex items-start gap-3 text-xs text-sky-950 animate-fade-in shadow-xs">
          <Package className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <strong className="font-extrabold text-sm text-sky-950">
                📦 Order Prepared in Warehouse
              </strong>
              <span className="px-2 py-0.5 bg-sky-200 text-sky-900 font-bold rounded-full text-[10px]">
                Ready for Dispatch
              </span>
            </div>
            <p className="text-sky-800 leading-relaxed">
              Great news! Your smart clock and accessories have been thoroughly inspected, bubble-wrapped, and safely boxed in our Dhaka warehouse. It will be collected by the courier rider for delivery shortly.
            </p>
          </div>
        </div>
      )}

      {isShippedOrLater && (
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl flex items-start gap-3 text-xs text-purple-950 animate-fade-in">
          <Truck className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="font-bold text-sm text-purple-950 block">
              🚚 In Transit with Courier
            </strong>
            <p className="text-purple-800 leading-relaxed">
              Your parcel has left our warehouse and is on the road with the delivery courier. The rider will contact you prior to arrival. Please keep the exact cash amount ready for inspection upon delivery.
            </p>
          </div>
        </div>
      )}

      {isDelivered && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-xs text-emerald-950 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <strong className="font-extrabold text-sm text-emerald-950">
                ✅ Delivered &amp; Verified
              </strong>
              {isWithin7Days ? (
                <span className="px-2.5 py-0.5 bg-emerald-200 text-emerald-900 font-bold rounded-full text-[11px] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 7-Day Guarantee Active ({daysRemaining} days left)
                </span>
              ) : (
                <span className="text-[11px] text-slate-400 font-medium">
                  7-Day Return Window Closed
                </span>
              )}
            </div>
            <p className="text-emerald-800 leading-relaxed">
              Your parcel was successfully delivered. You are fully protected under our 7-Day Return and Replacement policy.
            </p>
          </div>
        </div>
      )}

      {isReturnRequested && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-start gap-3 text-xs text-amber-950 animate-fade-in">
          <RotateCcw className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="font-extrabold text-sm text-amber-950 block">
              🔄 Return / Refund Request Under Review
            </strong>
            <p className="text-amber-800 leading-relaxed">
              We have received your return/replacement request. Our Dhaka customer support team will contact your phone or WhatsApp to verify and schedule courier pickup.
            </p>
          </div>
        </div>
      )}

      {isCancelled && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-xs text-rose-950 animate-fade-in">
          <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="font-bold text-sm text-rose-950 block">❌ Order Cancelled</strong>
            <p className="text-rose-800 leading-relaxed">
              This order has been cancelled. No payment will be collected, and inventory has been returned.
            </p>
          </div>
        </div>
      )}

      {/* ── ACTION BUTTONS AREA ─────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        {/* Case 1: Cancel Allowed (PENDING, CONFIRMED, PROCESSING before leaving warehouse) */}
        {canCancel && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCancelModal(true)}
              className="px-4 py-2 border border-rose-300 hover:bg-rose-50 text-rose-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-2xs"
            >
              <XCircle className="w-3.5 h-3.5" /> Cancel Order
            </button>
            <span className="text-[11px] text-slate-400">
              (Available until order leaves warehouse with courier)
            </span>
          </div>
        )}

        {/* Case 2: Once Shipped, Cancel Option is Removed */}
        {isShippedOrLater && (
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>
              Order has left our warehouse with the courier. Cancellation is no longer available online.
            </span>
          </div>
        )}

        {/* Case 3: Delivered within 7 Days -> Show Return / Refund Option */}
        {isDelivered && isWithin7Days && (
          <button
            onClick={() => setShowReturnModal(true)}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-sm shadow-amber-600/20"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Request Return / Refund (7-Day Guarantee)
          </button>
        )}

        {/* Case 4: Delivered after 7 Days -> Return Option is Removed */}
        {isDelivered && !isWithin7Days && (
          <div className="text-[11px] text-slate-400 italic">
            The 7-day return guarantee period has ended according to store policy.
          </div>
        )}
      </div>

      {/* ── CANCEL ORDER MODAL ─────────────────────────────────────── */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Cancel Order #{orderNumber}?</h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>

            <form onSubmit={handleCancelOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Reason for Cancellation
                </label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-sky-500"
                >
                  <option value="Change of delivery address / phone">Change of delivery address or phone</option>
                  <option value="Ordered by mistake / wrong product">Ordered by mistake or wrong model</option>
                  <option value="Need to change payment or items">Need to change cart items</option>
                  <option value="Delivery time too long">Delivery time too long</option>
                  <option value="Other">Other reason</option>
                </select>
              </div>

              {cancelReason === 'Other' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Please Specify
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={customCancelReason}
                    onChange={(e) => setCustomCancelReason(e.target.value)}
                    placeholder="Briefly tell us why you are cancelling..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-sky-500"
                  />
                </div>
              )}

              <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 space-y-1">
                <p>• Your reserved product stock will be returned to inventory.</p>
                <p>• Since this is Cash on Delivery, zero money was deducted from you.</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  disabled={isSubmittingCancel}
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Keep Order
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCancel}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {isSubmittingCancel ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    'Confirm Cancel'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── RETURN / REFUND MODAL (7-DAY GUARANTEE) ─────────────────── */}
      {showReturnModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Request Return / Refund
                </h3>
                <p className="text-xs text-emerald-600 font-semibold">
                  Protected by ATMODESK 7-Day Replacement Policy
                </p>
              </div>
            </div>

            <form onSubmit={handleReturnOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Reason for Return *
                </label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-sky-500"
                >
                  <option value="Hardware malfunction / screen defect">Hardware malfunction or screen defect</option>
                  <option value="Damaged during courier transit">Damaged during courier transit (cracked/broken)</option>
                  <option value="WiFi / connectivity failure">WiFi or pairing failure</option>
                  <option value="Incorrect item or variant delivered">Incorrect item or color delivered</option>
                  <option value="Missing cables or accessories">Missing accessories or cables</option>
                  <option value="Other defect">Other issue</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Preferred Solution *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setResolution('REPLACEMENT')}
                    className={`p-3 rounded-xl border text-left text-xs font-bold transition ${
                      resolution === 'REPLACEMENT'
                        ? 'border-sky-600 bg-sky-50 text-sky-900 ring-1 ring-sky-500'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    📦 Free Replacement
                    <span className="block text-[10px] font-normal text-slate-500 mt-0.5">
                      Brand new unit sent to your doorstep
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setResolution('REFUND')}
                    className={`p-3 rounded-xl border text-left text-xs font-bold transition ${
                      resolution === 'REFUND'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-500'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    💰 Cash Refund
                    <span className="block text-[10px] font-normal text-slate-500 mt-0.5">
                      Direct to bKash or Nagad wallet
                    </span>
                  </button>
                </div>
              </div>

              {resolution === 'REFUND' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-emerald-50/60 border border-emerald-200 rounded-2xl animate-fade-in">
                  <div>
                    <label className="block text-[11px] font-bold text-emerald-950 uppercase tracking-wider mb-1">
                      Wallet Provider
                    </label>
                    <select
                      value={refundMethod}
                      onChange={(e) => setRefundMethod(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl text-xs text-slate-900 outline-none"
                    >
                      <option value="bKash">bKash (Personal)</option>
                      <option value="Nagad">Nagad (Personal)</option>
                      <option value="Rocket">Rocket (Personal)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-emerald-950 uppercase tracking-wider mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="017XXXXXXXX"
                      value={refundNumber}
                      onChange={(e) => setRefundNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl text-xs text-slate-900 outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Describe the Issue (Optional)
                </label>
                <textarea
                  rows={2}
                  value={returnDetails}
                  onChange={(e) => setReturnDetails(e.target.value)}
                  placeholder="Explain what went wrong so we can resolve it quickly..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-sky-500"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 space-y-1">
                <p>• Our team will arrange courier pickup from your address.</p>
                <p>• Replacements are dispatched within 24 hours of inspection.</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  disabled={isSubmittingReturn}
                  onClick={() => setShowReturnModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReturn}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {isSubmittingReturn ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    'Submit Request'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
