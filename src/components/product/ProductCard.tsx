// src/components/product/ProductCard.tsx
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { formatBDT } from '@/lib/utils'
import { useCart } from '@/store/cart'
import { useWishlist } from '@/store/wishlist'
import { useToast } from '@/components/shared/Providers'
import { TACTILE_SPRING } from '@/components/shared/LiquidMotion'
import { Heart, ShoppingBag, Star, Eye, Zap, CheckCircle2 } from 'lucide-react'
import { QuickViewModal } from '@/components/product/QuickViewModal'

export interface ProductCardProps {
  id: string
  name: string
  slug: string
  price: number
  originalPrice?: number | null
  discount?: number
  stock: number
  rating?: number
  reviewCount?: number
  images?: { url: string; isPrimary: boolean }[]
  category?: { name: string; slug: string } | null
  isNewArrival?: boolean
  isBestSeller?: boolean
  isFeatured?: boolean
  priority?: boolean
}

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#F3F7FB'/><stop offset='1' stop-color='#e5e5ea'/></linearGradient></defs><rect width='600' height='600' fill='url(#g)'/><g fill='none' stroke='#86868b' stroke-width='14' stroke-linecap='round'><circle cx='300' cy='300' r='92'/><path d='M300 244v56l36 22'/></g></svg>`
  )

export function ProductCard({
  id,
  name,
  slug,
  price,
  originalPrice,
  discount,
  stock,
  rating = 0,
  reviewCount = 0,
  images = [],
  category,
  isNewArrival,
  isBestSeller,
  priority = false,
}: ProductCardProps) {
  const router = useRouter()
  const addItem = useCart((s) => s.addItem)
  const toggleItem = useWishlist((s) => s.toggleItem)
  const isSaved = useWishlist((s) => s.items.some((i) => i.productId === id))
  const { toast } = useToast()
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const [pop, setPop] = useState(0)

  const primaryImage = images.find((i) => i.isPrimary)?.url || images[0]?.url || PLACEHOLDER
  const isOutOfStock = stock <= 0
  const isLowStock = stock > 0 && stock <= 5
  const hasReviews = reviewCount > 0 && rating > 0

  const hasSavings = originalPrice && originalPrice > price
  const savingsAmount = hasSavings ? (originalPrice as number) - price : 0
  const discountPct =
    discount && discount > 0
      ? Math.round(discount)
      : hasSavings
      ? Math.round((savingsAmount / (originalPrice as number)) * 100)
      : 0

  const handleAddToCart = () => {
    if (isOutOfStock) return
    addItem({
      id,
      productId: id,
      name,
      slug,
      image: primaryImage,
      price,
      originalPrice: originalPrice || undefined,
      stock,
      quantity: 1,
      openDrawer: true,
    })
    toast(`Added “${name}” to your cart`)
  }

  const handleBuyNow = () => {
    if (isOutOfStock) return
    addItem({
      id,
      productId: id,
      name,
      slug,
      image: primaryImage,
      price,
      originalPrice: originalPrice || undefined,
      stock,
      quantity: 1,
      openDrawer: false,
    })
    toast(`Added “${name}” to your order. Proceeding to checkout...`)
    router.push('/checkout')
  }

  const handleToggleWishlist = () => {
    toggleItem({
      productId: id,
      name,
      slug,
      image: primaryImage,
      price,
      originalPrice: originalPrice || undefined,
      addedAt: new Date().toISOString(),
    })
    setPop((n) => n + 1)
    toast(isSaved ? 'Removed from wishlist' : 'Saved to wishlist', 'info')
  }

  return (
    <article className="group relative liquid-glass-card flex h-full flex-col rounded-[28px] border border-black/[0.08] bg-white overflow-hidden shadow-xs hover:shadow-md transition">
      {/* Media */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#F3F7FB]">
        <Link href={`/product/${slug}`} className="absolute inset-0 block" aria-label={name}>
          <img
            src={primaryImage}
            alt={name}
            width={600}
            height={600}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={priority ? 'high' : 'auto'}
            className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            onError={(e) => {
              const el = e.currentTarget
              if (el.src !== PLACEHOLDER) el.src = PLACEHOLDER
            }}
          />
        </Link>

        {/* Badges (Top-Left) */}
        <div className="pointer-events-none absolute left-3 top-3 z-10 flex flex-col items-start gap-1.5">
          {discountPct > 0 && (
            <span className="rounded-full bg-rose-500 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-xs">
              -{discountPct}% OFF
            </span>
          )}
          {isBestSeller ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700 backdrop-blur-md shadow-xs border border-amber-200/50">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> Best seller
            </span>
          ) : isNewArrival ? (
            <span className="rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-semibold text-[#0A9EE6] backdrop-blur-md shadow-xs border border-[#0A9EE6]/20">
              New Arrival
            </span>
          ) : null}
        </div>

        {/* Wishlist Button (Top-Right) */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-pressed={isSaved}
          aria-label={isSaved ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
          className="lg-glass-btn absolute right-3 top-3 z-20"
        >
          <Heart
            key={pop}
            className={`h-[18px] w-[18px] animate-bounce-in ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`}
          />
        </button>

        {/* Quick View Button (Center-Bottom Hover) */}
        <button
          type="button"
          onClick={() => setIsQuickViewOpen(true)}
          className="lg-glass-btn absolute bottom-3 left-1/2 z-20 h-9! w-auto! -translate-x-1/2 gap-1.5 px-4 text-xs font-semibold opacity-0 transition-opacity duration-200 focus-visible:opacity-100 group-hover:opacity-100"
        >
          <Eye className="h-3.5 w-3.5 text-[#0A9EE6]" />
          Quick view
        </button>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center bg-white/70 backdrop-blur-[2px]">
            <span className="rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-[#083466] shadow-md ring-1 ring-black/10">
              Out of stock
            </span>
          </div>
        )}
      </div>

      {/* Info & Pricing */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          {category && (
            <span className="truncate text-[11px] font-semibold text-[#0A9EE6] uppercase tracking-wider">
              {category.name}
            </span>
          )}

          {!isOutOfStock && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              In Stock
            </span>
          )}
        </div>

        <Link href={`/product/${slug}`} className="transition group-hover:text-[#0A9EE6]">
          <h3 className="mb-2 line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-snug text-[#083466]">
            {name}
          </h3>
        </Link>

        {/* Rating and Stock Warning */}
        <div className="mb-3 flex items-center gap-2 text-xs text-[#5B6B80]">
          {hasReviews ? (
            <>
              <span className="inline-flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="font-semibold tabular text-[#083466]">{rating.toFixed(1)}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
              </span>
            </>
          ) : (
            <span className="text-[#86868b] text-[11px]">Verified Dhaka Stock</span>
          )}
          {isLowStock && (
            <span className="ml-auto rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
              Only {stock} left
            </span>
          )}
        </div>

        {/* Pricing (Apple Gadgets Special Cash Price vs Regular Price) */}
        <div className="mt-auto pt-3 border-t border-black/[0.06] space-y-3">
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold text-[#0A9EE6] uppercase tracking-wider block">
                Special Cash Price:
              </span>
              <div className="text-lg sm:text-xl font-black tabular tracking-tight text-[#083466]">
                {formatBDT(price)}
              </div>
            </div>

            {hasSavings && (
              <div className="text-right">
                <span className="text-[10px] text-[#86868b] block">Regular:</span>
                <span className="text-xs tabular text-[#86868b] line-through">
                  {formatBDT(originalPrice as number)}
                </span>
              </div>
            )}
          </div>

          {/* Dual Action Buttons: Buy Now + Add to Cart (Apple Gadgets style) */}
          <div className="grid grid-cols-12 gap-2">
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              transition={TACTILE_SPRING}
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="col-span-8 sm:col-span-9 py-2.5 px-3 rounded-full bg-[#083466] hover:bg-[#0A9EE6] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Buy Now</span>
            </motion.button>

            <motion.button
              type="button"
              whileTap={{ scale: 0.92 }}
              transition={TACTILE_SPRING}
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="col-span-4 sm:col-span-3 py-2.5 rounded-full bg-[#F3F7FB] hover:bg-black/[0.08] text-[#083466] hover:text-[#0A9EE6] transition flex items-center justify-center border border-black/[0.06] disabled:opacity-50"
              aria-label={isOutOfStock ? `${name} is out of stock` : `Add ${name} to cart`}
              title="Add to cart"
            >
              <ShoppingBag className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      <QuickViewModal
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        id={id}
        name={name}
        slug={slug}
        price={price}
        originalPrice={originalPrice}
        discount={discount}
        stock={stock}
        images={images}
        category={category}
      />
    </article>
  )
}
