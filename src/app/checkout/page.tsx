'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/store/cart'
import { formatBDT } from '@/lib/utils'
import { useToast } from '@/components/shared/Providers'
import {
  ShieldCheck,
  Truck,
  Lock,
  ShoppingBag,
  Banknote,
  CheckCircle2,
} from 'lucide-react'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCart()
  const { toast } = useToast()

  // Form State
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [line1, setLine1] = useState('')
  const [area, setArea] = useState('')
  const [city, setCity] = useState('Dhaka')
  const [district, setDistrict] = useState('Dhaka')
  const [postalCode, setPostalCode] = useState('')
  const [shippingLocation, setShippingLocation] = useState<'inside_dhaka' | 'outside_dhaka'>('inside_dhaka')
  const [paymentMethod] = useState<'COD'>('COD')
  const [couponCode, setCouponCode] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const rawSubtotal = subtotal()

  // Shipping logic
  const isFreeDhakaShipping = rawSubtotal >= 2000 && shippingLocation === 'inside_dhaka'
  const shippingCost = shippingLocation === 'outside_dhaka' ? 120 : isFreeDhakaShipping ? 0 : 60

  // Discount logic
  let discountAmount = 0
  if (couponCode.trim().toUpperCase() === 'WELCOME10') {
    discountAmount = Math.round(rawSubtotal * 0.1)
  } else if (couponCode.trim().toUpperCase() === 'FLAT200' && rawSubtotal >= 2000) {
    discountAmount = 200
  }

  const finalTotal = Math.max(0, rawSubtotal - discountAmount + shippingCost)

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()

    if (items.length === 0) {
      toast('Your cart is empty. Please add items to checkout.', 'error')
      router.push('/products')
      return
    }

    if (!fullName.trim() || !phone.trim() || !line1.trim() || !city.trim()) {
      toast('Please fill in all required delivery fields.', 'error')
      return
    }

    // Bangladesh phone validation
    const cleanPhone = phone.replace(/\s+/g, '')
    if (!/^(\+?880|0)?1[3-9]\d{8}$/.test(cleanPhone)) {
      toast('Please enter a valid 11-digit Bangladesh phone number (e.g. 01712345678).', 'error')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone: cleanPhone,
          email: email.trim() || undefined,
          line1,
          area,
          city,
          district: district || city,
          postalCode,
          shippingLocation,
          paymentMethod: 'COD',
          couponCode: couponCode.trim() || undefined,
          notes,
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
          })),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order.')
      }

      toast('Order placed successfully! 🎉', 'success')
      clearCart()
      router.push(`/order-confirmed/${data.orderNumber}`)
    } catch (err: any) {
      toast(err.message || 'Something went wrong. Please try again.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white border border-slate-200 rounded-3xl text-center space-y-4">
        <div className="w-16 h-16 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Your Cart is Empty</h2>
        <p className="text-sm text-slate-500">Please add items to your cart before proceeding to checkout.</p>
        <Link
          href="/products"
          className="inline-block px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-xl transition"
        >
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Checkout</h1>
        <p className="text-sm text-slate-500 mt-1">
          Complete your delivery details. Cash on Delivery is available nationwide.
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ─── LEFT: ADDRESS & PAYMENT FORM ──────────────────── */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Customer Info */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="w-6 h-6 rounded-full bg-sky-600 text-white text-xs flex items-center justify-center font-extrabold">
                1
              </span>
              Contact &amp; Delivery Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Tanvir Hasan"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-xl text-sm text-slate-900 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Mobile Number * (01XXXXXXXXX)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 01712345678"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-xl text-sm text-slate-900 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="For order receipts and tracking updates"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-xl text-sm text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Full Street Address / House / Road / Sector *
              </label>
              <textarea
                value={line1}
                onChange={(e) => setLine1(e.target.value)}
                rows={2}
                placeholder="e.g. House 45, Road 12, Block D, Banani"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-xl text-sm text-slate-900 outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  City / District *
                </label>
                <select
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value)
                    setDistrict(e.target.value)
                    if (e.target.value !== 'Dhaka') {
                      setShippingLocation('outside_dhaka')
                    } else {
                      setShippingLocation('inside_dhaka')
                    }
                  }}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-xl text-sm text-slate-900 outline-none"
                >
                  <option value="Dhaka">Dhaka</option>
                  <option value="Chittagong">Chittagong</option>
                  <option value="Sylhet">Sylhet</option>
                  <option value="Rajshahi">Rajshahi</option>
                  <option value="Khulna">Khulna</option>
                  <option value="Barisal">Barisal</option>
                  <option value="Rangpur">Rangpur</option>
                  <option value="Mymensingh">Mymensingh</option>
                  <option value="Comilla">Comilla</option>
                  <option value="Gazipur">Gazipur</option>
                  <option value="Narayanganj">Narayanganj</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Area / Thana
                </label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Gulshan / Dhanmondi"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-xl text-sm text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="e.g. 1212"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-xl text-sm text-slate-900 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Shipping Method */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="w-6 h-6 rounded-full bg-sky-600 text-white text-xs flex items-center justify-center font-extrabold">
                2
              </span>
              Select Delivery Area
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                onClick={() => setShippingLocation('inside_dhaka')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-start justify-between ${
                  shippingLocation === 'inside_dhaka'
                    ? 'border-sky-600 bg-sky-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-sky-600" />
                    <strong className="text-sm text-slate-900">Inside Dhaka City</strong>
                  </div>
                  <p className="text-xs text-slate-500">Delivered within 24–48 hours</p>
                </div>
                <span className="text-sm font-extrabold text-slate-900">
                  {rawSubtotal >= 2000 ? <span className="text-emerald-600">FREE</span> : '৳60'}
                </span>
              </label>

              <label
                onClick={() => setShippingLocation('outside_dhaka')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-start justify-between ${
                  shippingLocation === 'outside_dhaka'
                    ? 'border-sky-600 bg-sky-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-purple-600" />
                    <strong className="text-sm text-slate-900">Outside Dhaka (Nationwide)</strong>
                  </div>
                  <p className="text-xs text-slate-500">Delivered via Courier in 3–5 days</p>
                </div>
                <span className="text-sm font-extrabold text-slate-900">৳120</span>
              </label>
            </div>
          </div>

          {/* Step 3: Payment Method - Cash on Delivery Only */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="w-6 h-6 rounded-full bg-sky-600 text-white text-xs flex items-center justify-center font-extrabold">
                3
              </span>
              Payment Method
            </h2>

            <div className="p-5 rounded-2xl border-2 border-emerald-500 bg-emerald-50/40 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <Banknote className="w-6 h-6" />
                  </div>
                  <div>
                    <strong className="text-base text-slate-900 block flex items-center gap-2">
                      Cash on Delivery (COD)
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" />
                    </strong>
                    <span className="text-xs text-slate-600">
                      Pay with cash when your parcel is delivered at your doorstep.
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full whitespace-nowrap">
                  100% Safe
                </span>
              </div>
              <p className="text-[11px] text-slate-500 pl-14 pt-1">
                ✓ No advance payment required · Inspect your parcel upon delivery
              </p>
            </div>
          </div>

          {/* Delivery Note */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Special Delivery Instructions (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="e.g. Call before delivery, leave with guard, etc."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-xl text-sm text-slate-900 outline-none"
            />
          </div>
        </div>

        {/* ─── RIGHT: ORDER SUMMARY & PLACE ORDER ─────────────── */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6 sticky top-24">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            Order Review ({items.length} items)
          </h2>

          {/* Items Preview */}
          <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto no-scrollbar pr-1">
            {items.map((item) => (
              <div key={item.productId + (item.variantId || '')} className="py-2.5 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                  <img src={item.image || '/placeholder-product.jpg'} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                  <p className="text-[11px] text-slate-500">Qty: {item.quantity}</p>
                </div>
                <span className="text-xs font-bold text-slate-900">
                  {formatBDT(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Coupon Code Input */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Voucher code (e.g. WELCOME10)"
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs uppercase font-mono outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  if (couponCode.toUpperCase() === 'WELCOME10') {
                    toast('WELCOME10 applied: 10% discount!')
                  } else if (couponCode.toUpperCase() === 'FLAT200') {
                    toast('FLAT200 applied: ৳200 discount!')
                  } else {
                    toast('Invalid coupon code', 'error')
                  }
                }}
                className="px-3 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="space-y-2 text-sm pt-2 border-t border-slate-100">
            <div className="flex justify-between text-slate-600">
              <span>Items Subtotal</span>
              <span className="font-semibold text-slate-900">{formatBDT(rawSubtotal)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Voucher Discount</span>
                <span>-{formatBDT(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600">
              <span>Delivery Charge ({shippingLocation === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'})</span>
              <span className="font-semibold text-slate-900">
                {shippingCost === 0 ? <strong className="text-emerald-600">FREE</strong> : formatBDT(shippingCost)}
              </span>
            </div>

            <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
              <span className="text-base font-extrabold text-slate-900">Payable Total</span>
              <span className="text-2xl font-black text-sky-600">{formatBDT(finalTotal)}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-sky-600/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Placing Your Order...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4" /> Place Order ({formatBDT(finalTotal)})
              </span>
            )}
          </button>

          <div className="pt-2 text-center text-xs text-slate-400 space-y-1">
            <p className="flex items-center justify-center gap-1 font-semibold text-slate-600">
              <Banknote className="w-4 h-4 text-emerald-600" />
              Cash on Delivery · Pay when you receive your order
            </p>
            <p className="flex items-center justify-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Verified Authentic Products with 7-Day Guarantee
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}
