// src/components/cart/CartDrawer.tsx
'use client'

import React from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { useCart } from '@/store/cart'
import { formatBDT } from '@/lib/utils'
import { LIQUID_SPRING, TACTILE_SPRING } from '@/components/shared/LiquidMotion'
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react'

const FALLBACK_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><rect width='200' height='200' fill='#f5f5f7'/><circle cx='100' cy='100' r='34' fill='none' stroke='#86868b' stroke-width='6'/></svg>`
  )

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQty, removeItem, subtotal, itemCount } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={closeCart}
            className="absolute inset-0 bg-slate-900/35 backdrop-blur-xs"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={LIQUID_SPRING}
              className="w-screen max-w-md glass-bright border-l border-black/[0.08] flex flex-col text-[#1d1d1f]"
            >
              {/* Header */}
              <div className="p-4 md:p-6 border-b border-black/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#0071e3]" />
                  <h2 className="text-lg font-bold text-[#1d1d1f]">Your Shopping Cart</h2>
                  <span className="bg-[#f0f7ff] text-[#0071e3] text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {itemCount()} items
                  </span>
                </div>
                <button
                  onClick={closeCart}
                  className="lg-glass-btn"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#6e6e73]">
                    <div className="w-16 h-16 bg-[#f5f5f7] rounded-full flex items-center justify-center mb-4 text-[#86868b]">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-semibold text-[#1d1d1f] mb-1">Your cart is empty</h3>
                    <p className="text-sm text-[#6e6e73] mb-6">
                      Looks like you haven&apos;t added any smart gadgets yet.
                    </p>
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      transition={TACTILE_SPRING}
                      onClick={closeCart}
                      className="lg-btn-primary px-5 py-2.5 text-sm font-semibold rounded-full"
                    >
                      Explore Products
                    </motion.button>
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={item.productId + (item.variantId || '')}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 24 }}
                        transition={LIQUID_SPRING}
                        className="flex gap-4 p-3 bg-[#f5f5f7] rounded-2xl border border-black/[0.05] items-center"
                      >
                        <div className="relative w-18 h-18 bg-white rounded-xl overflow-hidden flex-shrink-0 border border-black/[0.06]">
                          <img
                            src={item.image || FALLBACK_IMG}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const el = e.currentTarget
                              if (el.src !== FALLBACK_IMG) el.src = FALLBACK_IMG
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/product/${item.slug}`}
                            onClick={closeCart}
                            className="text-sm font-semibold text-[#1d1d1f] hover:text-[#0071e3] line-clamp-1"
                          >
                            {item.name}
                          </Link>
                          {item.variantName && (
                            <p className="text-xs text-[#6e6e73] mt-0.5">{item.variantName}</p>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm font-bold text-[#0071e3] tabular">
                              {formatBDT(item.price)}
                            </span>
                            <div className="flex items-center border border-black/10 rounded-lg bg-white overflow-hidden">
                              <button
                                onClick={() => updateQty(item.productId, item.quantity - 1, item.variantId)}
                                className="p-1.5 hover:bg-[#f5f5f7] text-[#1d1d1f] transition"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-2 text-xs font-semibold text-[#1d1d1f] min-w-6 text-center tabular">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQty(item.productId, item.quantity + 1, item.variantId)}
                                disabled={item.quantity >= item.stock}
                                className="p-1.5 hover:bg-[#f5f5f7] text-[#1d1d1f] transition disabled:opacity-30"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId, item.variantId)}
                          className="p-1.5 text-[#86868b] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="p-4 md:p-6 border-t border-black/[0.06] bg-[#f5f5f7]/70 space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm text-[#6e6e73]">
                      <span>Subtotal</span>
                      <span className="font-semibold text-[#1d1d1f] tabular">{formatBDT(subtotal())}</span>
                    </div>
                    <div className="flex justify-between text-xs text-[#86868b]">
                      <span>Shipping</span>
                      <span>Calculated at checkout</span>
                    </div>
                  </div>

                  <div className="border-t border-black/[0.08] pt-3 flex justify-between items-baseline">
                    <span className="text-base font-bold text-[#1d1d1f]">Total (Est.)</span>
                    <span className="text-xl font-bold text-[#0071e3] tabular">
                      {formatBDT(subtotal())}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <Link
                      href="/cart"
                      onClick={closeCart}
                      className="lg-btn-ghost w-full py-3 px-4 rounded-xl text-center text-sm font-semibold"
                    >
                      View Cart
                    </Link>
                    <Link
                      href="/checkout"
                      onClick={closeCart}
                      className="lg-btn-primary w-full py-3 px-4 rounded-xl text-center text-sm font-semibold flex items-center justify-center gap-1.5"
                    >
                      Checkout <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                  <p className="text-center text-[11px] text-[#86868b]">
                    Safe &amp; Secure Checkout · Cash on Delivery Available
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
