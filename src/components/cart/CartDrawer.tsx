'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/store/cart'
import { formatBDT } from '@/lib/utils'
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react'

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQty, removeItem, subtotal, itemCount } = useCart()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-sky-600" />
              <h2 className="text-lg font-bold text-slate-900">Your Shopping Cart</h2>
              <span className="bg-sky-50 text-sky-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                {itemCount()} items
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-slate-800 mb-1">Your cart is empty</h3>
                <p className="text-sm text-slate-500 mb-6">Looks like you haven't added any smart gadgets yet.</p>
                <button
                  onClick={closeCart}
                  className="px-5 py-2.5 bg-sky-600 text-white text-sm font-semibold rounded-xl hover:bg-sky-700 transition"
                >
                  Explore Products
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.productId + (item.variantId || '')}
                  className="flex gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 items-center"
                >
                  <div className="relative w-18 h-18 bg-white rounded-xl overflow-hidden flex-shrink-0 border border-slate-200/80">
                    <img
                      src={item.image || '/placeholder-product.jpg'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        ;(e.target as HTMLElement).style.display = 'none'
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/${item.slug}`}
                      onClick={closeCart}
                      className="text-sm font-semibold text-slate-900 hover:text-sky-600 line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    {item.variantName && (
                      <p className="text-xs text-slate-500 mt-0.5">{item.variantName}</p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold text-sky-600">
                        {formatBDT(item.price)}
                      </span>
                      <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden shadow-xs">
                        <button
                          onClick={() => updateQty(item.productId, item.quantity - 1, item.variantId)}
                          className="p-1 hover:bg-slate-100 text-slate-600 transition"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-slate-800 min-w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.productId, item.quantity + 1, item.variantId)}
                          disabled={item.quantity >= item.stock}
                          className="p-1 hover:bg-slate-100 text-slate-600 transition disabled:opacity-30"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId, item.variantId)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-4 md:p-6 border-t border-slate-100 bg-slate-50/50 space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">{formatBDT(subtotal())}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
                <span className="text-base font-bold text-slate-900">Total (Est.)</span>
                <span className="text-xl font-extrabold text-sky-600">{formatBDT(subtotal())}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="w-full py-3 px-4 rounded-xl text-center text-sm font-semibold border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition"
                >
                  View Cart
                </Link>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full py-3 px-4 rounded-xl text-center text-sm font-semibold bg-sky-600 text-white hover:bg-sky-700 shadow-md shadow-sky-600/20 flex items-center justify-center gap-1.5 transition"
                >
                  Checkout <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <p className="text-center text-[11px] text-slate-400">
                🔒 Safe &amp; Secure Checkout · Cash on Delivery Available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
