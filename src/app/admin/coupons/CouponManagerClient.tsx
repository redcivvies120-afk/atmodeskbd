'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/shared/Providers'
import { formatBDT } from '@/lib/utils'
import { Tag, Plus, CheckCircle2 } from 'lucide-react'

export function CouponManagerClient({ initialCoupons }: { initialCoupons: any[] }) {
  const router = useRouter()
  const { toast } = useToast()
  const [code, setCode] = useState('')
  const [type, setType] = useState('PERCENTAGE')
  const [value, setValue] = useState('')
  const [minOrderAmount, setMinOrderAmount] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim() || !value) return

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          type,
          value,
          minOrderAmount: minOrderAmount || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create coupon')

      toast(`Coupon ${code.toUpperCase()} created! 🎟️`)
      setCode('')
      setValue('')
      setMinOrderAmount('')
      router.refresh()
    } catch (err: any) {
      toast(err.message || 'Error', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
      {/* Create form */}
      <form onSubmit={handleAdd} className="md:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Plus className="w-4 h-4 text-sky-600" /> Create Voucher Code
        </h2>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Coupon Code *
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. SUMMER15"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono uppercase outline-none focus:border-sky-500 font-bold"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Discount Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
            >
              <option value="PERCENTAGE">Percentage (%)</option>
              <option value="FIXED">Flat (BDT ৳)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Value *
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={type === 'PERCENTAGE' ? '10' : '200'}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-sky-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Minimum Order Amount (BDT ৳)
          </label>
          <input
            type="number"
            value={minOrderAmount}
            onChange={(e) => setMinOrderAmount(e.target.value)}
            placeholder="e.g. 1500"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-sky-500"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl transition shadow-xs disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : '+ Create Voucher'}
        </button>
      </form>

      {/* List */}
      <div className="md:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Tag className="w-4 h-4 text-sky-600" /> Active Vouchers ({initialCoupons.length})
        </h2>

        <div className="divide-y divide-slate-100">
          {initialCoupons.map((c) => (
            <div key={c.id} className="py-3 flex items-center justify-between">
              <div>
                <strong className="text-sm font-mono font-bold text-slate-900 block">{c.code}</strong>
                <span className="text-xs text-slate-500">
                  {c.type === 'PERCENTAGE' ? `${c.value}% discount` : `৳${c.value} flat off`}
                  {c.minOrderAmount ? ` · Min Order: ${formatBDT(c.minOrderAmount)}` : ''}
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs bg-emerald-50 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" /> Active
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
