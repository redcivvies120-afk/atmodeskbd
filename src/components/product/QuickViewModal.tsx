// src/components/product/QuickViewModal.tsx
'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, ShoppingBag, Plus, Minus, ArrowRight, Check, AlertCircle } from 'lucide-react'
import { useCart } from '@/store/cart'
import { formatBDT } from '@/lib/utils'
import { useToast } from '@/components/shared/Providers'

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
  // Direct prop pass-through support
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

export function QuickViewModal({
  isOpen = true,
  onClose,
  product,
  ...directProps
}: QuickViewModalProps) {
  const { addItem } = useCart()
  const { toast } = useToast()

  // Consolidate product from either product prop or direct props
  const activeProduct: QuickViewProduct | null = product || (directProps.id ? {
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
  } : null)

  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [added, setAdded] = useState(false)

  // Reset quantity & selected image when product changes
  useEffect(() => {
    setQuantity(1)
    setSelectedImageIndex(0)
    setAdded(false)
  }, [activeProduct?.id])

  // ESC key handler and lock body scroll
  useEffect(() => {
    if (!isOpen || !activeProduct) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, activeProduct, onClose])

  if (!isOpen || !activeProduct) {
    return null
  }

  // Normalize images
  const normalizedImages: string[] = (() => {
    if (!activeProduct.images || activeProduct.images.length === 0) {
      return ['/placeholder-product.jpg']
    }
    return activeProduct.images.map((img) => (typeof img === 'string' ? img : img.url))
  })()

  const currentImage = normalizedImages[selectedImageIndex] || normalizedImages[0] || '/placeholder-product.jpg'
  const isOutOfStock = activeProduct.stock <= 0
  const categoryName = typeof activeProduct.category === 'string'
    ? activeProduct.category
    : activeProduct.category?.name

  const handleAddToCart = () => {
    if (isOutOfStock) return

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
    toast(`Added "${activeProduct.name}" to cart! 🛍️`)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Quick view: ${activeProduct.name}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6"
    >
      {/* Dark Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog Content */}
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl z-10 animate-fade-in no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition shadow-2xs hover:scale-105 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 sm:p-7 lg:p-8">
          {/* Left Column: Product Images */}
          <div className="flex flex-col gap-3">
            <div className="relative aspect-square w-full bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700/60">
              <img
                src={currentImage}
                alt={activeProduct.name}
                className="w-full h-full object-cover object-center transition-all duration-300"
                onError={(e) => {
                  const el = e.target as HTMLImageElement
                  el.onerror = null
                  el.src = '/placeholder-product.jpg'
                }}
              />

              {activeProduct.discount && activeProduct.discount > 0 ? (
                <span className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-extrabold px-2.5 py-1 rounded-full shadow-xs">
                  -{activeProduct.discount}%
                </span>
              ) : null}
            </div>

            {/* Thumbnails if multiple */}
            {normalizedImages.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {normalizedImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition flex-shrink-0 cursor-pointer ${
                      selectedImageIndex === idx
                        ? 'border-sky-600 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const el = e.target as HTMLImageElement
                        el.onerror = null
                        el.src = '/placeholder-product.jpg'
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Info & Actions */}
          <div className="flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              {/* Category Pill */}
              {categoryName && (
                <span className="inline-block text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                  {categoryName}
                </span>
              )}

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {activeProduct.name}
              </h2>

              {/* Price & Stock */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {formatBDT(activeProduct.price)}
                </span>
                {activeProduct.originalPrice && activeProduct.originalPrice > activeProduct.price && (
                  <span className="text-sm sm:text-base text-slate-400 line-through">
                    {formatBDT(activeProduct.originalPrice)}
                  </span>
                )}
              </div>

              {/* Stock status */}
              <div className="flex items-center gap-2 pt-1">
                {isOutOfStock ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 font-bold text-xs rounded-full">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Out of Stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold text-xs rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    In Stock ({activeProduct.stock} units available)
                  </span>
                )}
              </div>

              {/* Description */}
              {activeProduct.description && (
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-4 leading-relaxed pt-1">
                  {activeProduct.description}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              {/* Quantity Selector */}
              {!isOutOfStock && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Quantity:
                  </span>
                  <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition disabled:opacity-30 cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center font-bold text-slate-900 dark:text-white text-sm">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(activeProduct.stock, quantity + 1))}
                      disabled={quantity >= activeProduct.stock}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition disabled:opacity-30 cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-full py-3 px-5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm transition flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-sky-600/20 cursor-pointer"
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
              </button>

              {/* View Full Details Link */}
              <div className="text-center">
                <Link
                  href={`/product/${activeProduct.slug}`}
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition"
                >
                  <span>View Full Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
