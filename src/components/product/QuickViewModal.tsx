// src/components/product/QuickViewModal.tsx
'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { X, ShoppingBag, Plus, Minus, ArrowRight, Check, AlertCircle } from 'lucide-react'
import { useCart } from '@/store/cart'
import { formatBDT } from '@/lib/utils'
import { useToast } from '@/components/shared/Providers'
import { LIQUID_SPRING, TACTILE_SPRING } from '@/components/shared/LiquidMotion'

export interface QuickViewProduct {
  id: string
  name: string
  slug: string
  price: number
  originalPrice?: number | null
  discount?: number | null
  stock: number
  images?: Array<{ url: string; isPrimary?: boolean; alt?: string | null }> | string[]
  category?: { name: string; slug?: string } | string | null
  description?: string | null
}

export interface QuickViewModalProps {
  isOpen?: boolean
  onClose: () => void
  product?: QuickViewProduct | null
  id?: string
  name?: string
  slug?: string
  price?: number
  originalPrice?: number | null
  discount?: number | null
  stock?: number
  images?: Array<{ url: string; isPrimary?: boolean; alt?: string | null }> | string[]
  category?: { name: string; slug?: string } | string | null
  description?: string | null
}

const FALLBACK_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'><rect width='600' height='600' fill='#0f172a'/><circle cx='300' cy='300' r='92' fill='none' stroke='#475569' stroke-width='14'/></svg>`
  )

export function QuickViewModal({
  isOpen = true,
  onClose,
  product,
  ...directProps
}: QuickViewModalProps) {
  const { addItem } = useCart()
  const { toast } = useToast()

  const activeProduct: QuickViewProduct | null =
    product ||
    (directProps.id
      ? {
          id: directProps.id,
          name: directProps.name || '',
          slug: directProps.slug || '',
          price: directProps.price || 0,
          originalPrice: directProps.originalPrice,
          discount: directProps.discount,
          stock: directProps.stock ?? 0,
          images: directProps.images || [],
          category: directProps.category,
          description: directProps.description,
        }
      : null)

  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    setQuantity(1)
    setSelectedImageIndex(0)
    setAdded(false)
  }, [activeProduct?.id])

  useEffect(() => {
    if (!isOpen || !activeProduct) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, activeProduct, onClose])

  const normalizedImages: string[] = (() => {
    if (!activeProduct?.images || activeProduct.images.length === 0) {
      return [FALLBACK_IMG]
    }
    return activeProduct.images.map((img) => (typeof img === 'string' ? img : img.url))
  })()

  const currentImage = normalizedImages[selectedImageIndex] || normalizedImages[0] || FALLBACK_IMG
  const isOutOfStock = (activeProduct?.stock ?? 0) <= 0
  const categoryName =
    typeof activeProduct?.category === 'string'
      ? activeProduct.category
      : activeProduct?.category?.name

  const handleAddToCart = () => {
    if (!activeProduct || isOutOfStock) return

    addItem({
      id: activeProduct.id,
      productId: activeProduct.id,
      name: activeProduct.name,
      slug: activeProduct.slug,
      image: currentImage,
      price: activeProduct.price,
      originalPrice: activeProduct.originalPrice || undefined,
      stock: activeProduct.stock,
      quantity,
    })

    setAdded(true)
    setTimeout(() => setAdded(false), 2200)
    toast(`Added "${activeProduct.name}" to cart!`)
  }

  return (
    <AnimatePresence>
      {isOpen && activeProduct && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Quick view: ${activeProduct.name}`}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Liquid Glass Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={LIQUID_SPRING}
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto glass-bright rounded-[32px] z-10 no-scrollbar text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              type="button"
              aria-label="Close modal"
              className="lg-glass-btn absolute top-4 right-4 z-20 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 sm:p-7 lg:p-8">
              {/* Product Gallery */}
              <div className="flex flex-col gap-3">
                <div className="relative aspect-square w-full bg-slate-900 rounded-2xl overflow-hidden border border-white/10">
                  <img
                    src={currentImage}
                    alt={activeProduct.name}
                    className="w-full h-full object-cover object-center transition-all duration-300"
                    onError={(e) => {
                      const el = e.currentTarget
                      if (el.src !== FALLBACK_IMG) el.src = FALLBACK_IMG
                    }}
                  />

                  {activeProduct.discount && activeProduct.discount > 0 ? (
                    <span className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-extrabold px-2.5 py-1 rounded-full shadow-md">
                      -{activeProduct.discount}%
                    </span>
                  ) : null}
                </div>

                {normalizedImages.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                    {normalizedImages.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition flex-shrink-0 cursor-pointer ${
                          selectedImageIndex === idx
                            ? 'border-sky-400 shadow-sm'
                            : 'border-white/10 opacity-65 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const el = e.currentTarget
                            if (el.src !== FALLBACK_IMG) el.src = FALLBACK_IMG
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  {categoryName && (
                    <span className="inline-block text-xs font-bold text-sky-300 bg-sky-500/15 ring-1 ring-sky-400/25 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {categoryName}
                    </span>
                  )}

                  <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                    {activeProduct.name}
                  </h2>

                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white tabular">
                      {formatBDT(activeProduct.price)}
                    </span>
                    {activeProduct.originalPrice && activeProduct.originalPrice > activeProduct.price && (
                      <span className="text-sm sm:text-base text-slate-500 line-through tabular">
                        {formatBDT(activeProduct.originalPrice)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    {isOutOfStock ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-500/15 text-rose-300 ring-1 ring-rose-400/25 font-bold text-xs rounded-full">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Out of Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/25 font-bold text-xs rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        In Stock ({activeProduct.stock} units available)
                      </span>
                    )}
                  </div>

                  {activeProduct.description && (
                    <p className="text-xs sm:text-sm text-slate-300 line-clamp-4 leading-relaxed pt-1">
                      {activeProduct.description}
                    </p>
                  )}
                </div>

                <div className="space-y-4 pt-3 border-t border-white/10">
                  {!isOutOfStock && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Quantity:
                      </span>
                      <div className="flex items-center border border-white/15 rounded-xl bg-white/[0.06] p-1">
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          disabled={quantity <= 1}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-200 hover:bg-white/10 transition disabled:opacity-30 cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-10 text-center font-bold text-white text-sm tabular">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.min(activeProduct.stock, quantity + 1))}
                          disabled={quantity >= activeProduct.stock}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-200 hover:bg-white/10 transition disabled:opacity-30 cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    transition={TACTILE_SPRING}
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className="lg-btn-primary w-full py-3.5 px-5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {added ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
                      </>
                    )}
                  </motion.button>

                  <div className="text-center">
                    <Link
                      href={`/product/${activeProduct.slug}`}
                      onClick={onClose}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-sky-300 transition"
                    >
                      <span>View Full Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
