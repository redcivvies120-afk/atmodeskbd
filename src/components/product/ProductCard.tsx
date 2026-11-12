// src/components/product/ProductCard.tsx
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { formatBDT } from '@/lib/utils'
import { useCart } from '@/store/cart'
import { useWishlist } from '@/store/wishlist'
import { useToast } from '@/components/shared/Providers'
import { LiquidGlassTiltCard, TACTILE_SPRING } from '@/components/shared/LiquidMotion'
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react'
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
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#0f172a'/><stop offset='1' stop-color='#1e293b'/></linearGradient></defs><rect width='600' height='600' fill='url(#g)'/><g fill='none' stroke='#475569' stroke-width='14' stroke-linecap='round'><circle cx='300' cy='300' r='92'/><path d='M300 244v56l36 22'/></g></svg>`
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
  const discountPct = discount && discount > 0 ? Math.round(discount) : 0

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
    })
    toast(`Added “${name}” to your cart`)
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
    <LiquidGlassTiltCard className="group relative liquid-glass-card flex h-full flex-col rounded-[28px]">
      <article className="flex h-full flex-col">
        {/* Media */}
        <div className="relative aspect-square w-full overflow-hidden bg-slate-900">
          <Link href={`/product/${slug}`} className="absolute inset-0 block" aria-label={name}>
            <img
              src={primaryImage}
              alt={name}
              width={600}
              height={600}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={priority ? 'high' : 'auto'}
              className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.06]"
              onError={(e) => {
                const el = e.currentTarget
                if (el.src !== PLACEHOLDER) el.src = PLACEHOLDER
              }}
            />
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.06] via-transparent to-[#0b0f1b]/70" />
          </Link>

          {/* Liquid Badges */}
          <div className="pointer-events-none absolute left-3 top-3 z-10 flex flex-col items-start gap-1.5">
            {discountPct > 0 && (
              <span className="rounded-full bg-rose-500 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_6px_14px_-4px_rgba(244,63,94,0.7)]">
                -{discountPct}%
              </span>
            )}
            {isBestSeller ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-950/70 px-2.5 py-0.5 text-[10px] font-semibold text-amber-300 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_0_0.5px_rgba(251,191,36,0.4)]">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> Best seller
              </span>
            ) : isNewArrival ? (
              <span className="rounded-full bg-slate-950/70 px-2.5 py-0.5 text-[10px] font-semibold text-sky-300 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_0_0.5px_rgba(56,189,248,0.4)]">
                New
              </span>
            ) : null}
          </div>

          {/* Wishlist */}
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

          {/* Quick view */}
          <button
            type="button"
            onClick={() => setIsQuickViewOpen(true)}
            className="lg-glass-btn absolute bottom-3 left-1/2 z-20 h-9! w-auto! -translate-x-1/2 gap-1.5 px-4 text-xs font-semibold opacity-0 transition-opacity duration-300 focus-visible:opacity-100 group-hover:opacity-100"
          >
            <Eye className="h-3.5 w-3.5 text-sky-300" />
            Quick view
          </button>

          {isOutOfStock && (
            <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center bg-slate-950/65 backdrop-blur-[2px]">
              <span className="rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white ring-1 ring-white/20">
                Out of stock
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col p-4">
          {category && (
            <span className="mb-1 truncate text-[11px] font-medium text-sky-400">
              {category.name}
            </span>
          )}

          <Link href={`/product/${slug}`} className="transition group-hover:text-sky-300">
            <h3 className="mb-1.5 line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-white">
              {name}
            </h3>
          </Link>

          <div className="mb-3 flex items-center gap-2 text-xs text-slate-400">
            {hasReviews ? (
              <>
                <span className="inline-flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold tabular text-slate-200">{rating.toFixed(1)}</span>
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
                </span>
              </>
            ) : (
              <span className="text-slate-500">No reviews yet</span>
            )}
            {isLowStock && (
              <span className="ml-auto rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-300 ring-1 ring-amber-400/25">
                Only {stock} left
              </span>
            )}
          </div>

          <div className="mt-auto flex items-center justify-between gap-2 border-t border-white/[0.08] pt-3">
            <div>
              <div className="text-base font-bold tabular tracking-tight text-white">
                {formatBDT(price)}
              </div>
              {originalPrice && originalPrice > price ? (
                <div className="text-xs tabular text-slate-500 line-through">
                  {formatBDT(originalPrice)}
                </div>
              ) : null}
            </div>

            <motion.button
              type="button"
              whileTap={{ scale: 0.88 }}
              transition={TACTILE_SPRING}
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="lg-icon lg-sky"
              data-v="solid"
              data-size="sm"
              aria-label={isOutOfStock ? `${name} is out of stock` : `Add ${name} to cart`}
            >
              <ShoppingBag />
            </motion.button>
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
    </LiquidGlassTiltCard>
  )
}
