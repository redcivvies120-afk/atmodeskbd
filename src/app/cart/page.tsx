'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/store/cart'
import { formatBDT } from '@/lib/utils'
import { useToast } from '@/components/shared/Providers'
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  Truck,
} from 'lucide-react'

export default function CartPage() {
  const { items, updateQty, removeItem, clearCart, subtotal } = useCart()
  const { toast } = useToast()

  const [couponCode, setCouponCode] = useState('')
  const [discountPercent, setDiscountPercent] = useState<number>(0)
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [shippingCost, setShippingCost] = useState<number>(subtotal() >= 2000 ? 0 : 60)

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    const code = couponCode.trim().toUpperCase()
    if (code === 'WELCOME10') {
      setDiscountPercent(10)
      setAppliedCoupon('WELCOME10')
      toast('Coupon WELCOME10 applied! 10% discount added. 🎉')
    } else if (code === 'FLAT200') {
      if (subtotal() < 2000) {
        toast('FLAT200 requires minimum order of ৳2,000', 'error')
        return
      }
      setDiscountPercent(0)
      setAppliedCoupon('FLAT200')
      toast('Coupon FLAT200 applied! ৳200 discount added. 🎉')
    } else {
      toast('Invalid or expired coupon code', 'error')
    }
  }

  const rawSubtotal = subtotal()
  const discountAmount =
    appliedCoupon === 'WELCOME10'
      ? Math.round(rawSubtotal * 0.1)
      : appliedCoupon === 'FLAT200'
      ? 200
      : 0
  const finalTotal = Math.max(0, rawSubtotal - discountAmount + (rawSubtotal >= 2000 ? 0 : shippingCost))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Your Shopping Cart</h1>
        <p className="text-sm text-slate-500 mt-1">
          Review your selected smart gadgets before proceeding to checkout.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Your Cart is Currently Empty</h2>
          <p className="text-sm text-slate-500">
            Looks like you haven't added any desk tech to your cart yet.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-xl transition shadow-md shadow-sky-600/20"
          >
            Start Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Line Items List */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="font-bold text-slate-900 text-sm">Products ({items.length})</span>
              <button
                onClick={() => {
                  if (confirm('Clear all items from your cart?')) clearCart()
                }}
                className="text-xs text-rose-600 hover:underline font-semibold"
              >
                Clear Cart
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {items.map((item) => (
                <div key={item.productId + (item.variantId || '')} className="py-4 flex gap-4 items-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 flex-shrink-0 p-1">
                    <img
                      src={item.image || '/placeholder-product.jpg'}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-xl"
                      onError={(e) => {
                        ;(e.target as HTMLElement).style.display = 'none'
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/${item.slug}`}
                      className="text-sm font-bold text-slate-900 hover:text-sky-600 line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    {item.variantName && (
                      <p className="text-xs text-slate-500 mt-0.5">{item.variantName}</p>
                    )}
                    <div className="text-sm font-bold text-sky-600 mt-1">
                      {formatBDT(item.price)}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center border border-slate-300 rounded-xl bg-white p-1">
                    <button
                      onClick={() => updateQty(item.productId, item.quantity - 1, item.variantId)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 transition"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQty(item.productId, item.quantity + 1, item.variantId)}
                      disabled={item.quantity >= item.stock}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 transition disabled:opacity-30"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right min-w-20">
                    <div className="text-sm font-extrabold text-slate-900">
                      {formatBDT(item.price * item.quantity)}
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.productId, item.variantId)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Free shipping threshold indicator */}
            <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 flex items-center gap-3 text-xs text-sky-800">
              <Truck className="w-5 h-5 text-sky-600 flex-shrink-0" />
              <div>
                {rawSubtotal >= 2000 ? (
                  <span>
                    🎉 <strong>Congratulations!</strong> You qualified for <strong>Free Delivery</strong> inside Dhaka!
                  </span>
                ) : (
                  <span>
                    Add <strong>{formatBDT(2000 - rawSubtotal)}</strong> more to get <strong>Free Delivery</strong> in Dhaka!
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary & Checkout */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6 sticky top-24">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Order Summary
            </h2>

            {/* Coupon Box */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Voucher code (e.g. WELCOME10)"
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs uppercase font-mono outline-none focus:border-sky-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition"
                >
                  Apply
                </button>
              </div>
              {appliedCoupon && (
                <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" /> Voucher "{appliedCoupon}" applied!
                </div>
              )}
            </form>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">{formatBDT(rawSubtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-{formatBDT(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Estimated Shipping</span>
                <span>
                  {rawSubtotal >= 2000 ? (
                    <strong className="text-emerald-600">FREE</strong>
                  ) : (
                    formatBDT(shippingCost)
                  )}
                </span>
              </div>

              <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
                <span className="text-base font-extrabold text-slate-900">Total</span>
                <span className="text-2xl font-black text-sky-600">{formatBDT(finalTotal)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full py-4 px-6 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm text-center transition flex items-center justify-center gap-2 shadow-lg shadow-sky-600/25"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="pt-2 text-center text-xs text-slate-400 space-y-1">
              <p className="flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                100% Safe &amp; Verified Checkout
              </p>
              <p>Cash on Delivery available all across Bangladesh</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
