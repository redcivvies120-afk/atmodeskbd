'use client'

import React from 'react'
import Link from 'next/link'
import { formatBDT } from '@/lib/utils'
import { useCart } from '@/store/cart'
import { useWishlist } from '@/store/wishlist'
import { useToast } from '@/components/shared/Providers'
import { Heart, ShoppingBag, Star } from 'lucide-react'

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
}

export function ProductCard({
  id,
  name,
  slug,
  price,
  originalPrice,
  discount,
  stock,
  rating = 4.8,
  reviewCount = 12,
  images = [],
  category,
  isNewArrival,
  isBestSeller,
}: ProductCardProps) {
  const { addItem } = useCart()
  const { toggleItem, isWishlisted } = useWishlist()
  const { toast } = useToast()

  const primaryImage = images.find((i) => i.isPrimary)?.url || images[0]?.url || '/placeholder-product.jpg'
  const isOutOfStock = stock <= 0
  const isSaved = isWishlisted(id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
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
    toast(`Added "${name}" to cart! 🛍️`)
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleItem({
      productId: id,
      name,
      slug,
      image: primaryImage,
      price,
      originalPrice: originalPrice || undefined,
      addedAt: new Date().toISOString(),
    })
    toast(isSaved ? `Removed from wishlist` : `Saved to wishlist ❤️`)
  }

  return (
    <div className="group relative bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col h-full">
      {/* Image Container */}
      <Link href={`/product/${slug}`} className="relative aspect-square w-full bg-slate-100 overflow-hidden block">
        <img
          src={primaryImage}
          alt={name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            const el = e.target as HTMLImageElement
            el.onerror = null
            el.src = ''
            el.style.display = 'none'
            const parent = el.parentElement
            if (parent && !parent.querySelector('.img-placeholder')) {
              const placeholder = document.createElement('div')
              placeholder.className = 'img-placeholder absolute inset-0 flex flex-col items-center justify-center text-slate-300 bg-slate-50'
              placeholder.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                <span class="text-xs font-medium text-slate-400 mt-2">No image</span>
              `
              parent.appendChild(placeholder)
            }
          }}
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {discount && discount > 0 ? (
            <span className="bg-rose-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs">
              -{discount}%
            </span>
          ) : null}
          {isBestSeller ? (
            <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
              ★ Best Seller
            </span>
          ) : isNewArrival ? (
            <span className="bg-sky-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
              New
            </span>
          ) : null}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition shadow-xs z-10 ${
            isSaved
              ? 'bg-rose-50 text-rose-500'
              : 'bg-white/80 hover:bg-white text-slate-600 hover:text-rose-500'
          }`}
          title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-white text-slate-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1">
        {category && (
          <span className="text-[11px] font-semibold uppercase tracking-wider text-sky-600 mb-1">
            {category.name}
          </span>
        )}

        <Link href={`/product/${slug}`} className="group-hover:text-sky-600 transition">
          <h3 className="font-semibold text-sm text-slate-900 line-clamp-2 leading-snug mb-1.5">
            {name}
          </h3>
        </Link>

        {/* Ratings */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
          <div className="flex items-center text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span className="font-bold text-slate-800 ml-1 text-xs">{rating.toFixed(1)}</span>
          </div>
          <span>·</span>
          <span>{reviewCount} reviews</span>
        </div>

        {/* Pricing & Cart Action */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-base font-extrabold text-slate-900">
              {formatBDT(price)}
            </div>
            {originalPrice && originalPrice > price ? (
              <div className="text-xs text-slate-400 line-through">
                {formatBDT(originalPrice)}
              </div>
            ) : null}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex items-center justify-center w-9 h-9 rounded-xl transition ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-sky-600 hover:bg-sky-700 text-white shadow-sm shadow-sky-600/20 active:scale-95'
            }`}
            title="Add to cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
