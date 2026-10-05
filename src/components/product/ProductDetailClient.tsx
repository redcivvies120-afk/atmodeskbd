'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { formatBDT } from '@/lib/utils'
import { useCart } from '@/store/cart'
import { useWishlist } from '@/store/wishlist'
import { useToast } from '@/components/shared/Providers'
import { useRecentlyViewed } from '@/store/recently-viewed'
import { RecentlyViewed } from '@/components/product/RecentlyViewed'
import {
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Star,
  Plus,
  Minus,
  Check,
  CreditCard,
  Share2,
} from 'lucide-react'
import { BackInStockNotify } from '@/components/product/BackInStockNotify'
import { ProductReviews, ReviewItem } from '@/components/product/ProductReviews'

export interface ProductDetailProps {
  product: {
    id: string
    name: string
    slug: string
    sku: string
    price: number
    originalPrice?: number | null
    discount: number
    stock: number
    description?: string | null
    details?: string | null
    rating: number
    reviewCount: number
    images: { id: string; url: string; isPrimary: boolean; alt?: string | null }[]
    category?: { id: string; name: string; slug: string } | null
    brand?: { id: string; name: string } | null
    variants: { id: string; name: string; value: string; price?: number | null; stock: number }[]
    specs: { id: string; key: string; value: string }[]
    reviews?: ReviewItem[]
  }
}

export function ProductDetailClient({ product }: ProductDetailProps) {
  const router = useRouter()
  const { addItem } = useCart()
  const { toggleItem, isWishlisted } = useWishlist()
  const { toast } = useToast()

  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0] || null)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'shipping'>('desc')
  const [rating, setRating] = useState(product.rating || 4.9)
  const [reviewCount, setReviewCount] = useState(product.reviewCount || product.reviews?.length || 0)

  const { addProduct } = useRecentlyViewed()
  const isSaved = isWishlisted(product.id)
  const isOutOfStock = product.stock <= 0

  const currentPrice = selectedVariant?.price || product.price
  const images = product.images.length > 0 ? product.images : [{ id: '1', url: '/placeholder-product.jpg', isPrimary: true }]
  const activeImage = images[activeImageIndex]?.url || images[0]?.url

  useEffect(() => {
    if (product.id) {
      addProduct({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: currentPrice,
        originalPrice: product.originalPrice || undefined,
        image: activeImage,
        categoryName: product.category?.name,
      })
    }
  }, [product.id, currentPrice, activeImage])

  const handleAddToCart = () => {
    if (isOutOfStock) return
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: activeImage,
      price: currentPrice,
      originalPrice: product.originalPrice || undefined,
      stock: product.stock,
      quantity,
      variantId: selectedVariant?.id,
      variantName: selectedVariant ? `${selectedVariant.name}: ${selectedVariant.value}` : undefined,
    })
    toast(`Added ${quantity} × "${product.name}" to cart! 🛍️`)
  }

  const handleBuyNow = () => {
    if (isOutOfStock) return
    handleAddToCart()
    router.push('/checkout')
  }

  const handleToggleWishlist = () => {
    toggleItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: activeImage,
      price: currentPrice,
      originalPrice: product.originalPrice || undefined,
      addedAt: new Date().toISOString(),
    })
    toast(isSaved ? `Removed from wishlist` : `Saved to wishlist ❤️`)
  }

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* --- TOP: PRODUCT HERO (Gallery + Buy Box) -------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* --- LEFT: IMAGE GALLERY ------------------------------- */}
        <div className="lg:col-span-6 space-y-4 lg:sticky lg:top-24">
        {/* Main Display Image with Zoom preview */}
        <div className="relative aspect-square w-full bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs flex items-center justify-center p-4">
          <img
            src={activeImage}
            alt={product.name}
            className="w-full h-full object-contain max-h-[480px] hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const el = e.target as HTMLImageElement
              el.onerror = null
              el.src = ''
              el.style.display = 'none'
              // Show placeholder
              const parent = el.parentElement
              if (parent && !parent.querySelector('.img-placeholder')) {
                const placeholder = document.createElement('div')
                placeholder.className = 'img-placeholder flex flex-col items-center justify-center text-slate-300 space-y-3'
                placeholder.innerHTML = `
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                  <span class="text-sm font-medium text-slate-400">Image not available</span>
                `
                parent.appendChild(placeholder)
              }
            }}
          />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
            {product.discount > 0 && (
              <span className="bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-xs">
                SAVE {product.discount}%
              </span>
            )}
            {product.stock > 0 && product.stock <= 5 && (
              <span className="bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-xs">
                Only {product.stock} left in stock!
              </span>
            )}
          </div>
        </div>

        {/* Thumbnail Selector */}
        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {images.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-20 h-20 rounded-2xl bg-white border-2 overflow-hidden flex-shrink-0 p-1 transition ${
                  activeImageIndex === idx
                    ? 'border-sky-600 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img.url} alt="thumbnail" className="w-full h-full object-cover rounded-xl" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* --- RIGHT: PRODUCT DETAILS & BUY ACTIONS -------------- */}
      <div className="lg:col-span-6 space-y-6">
        <div>
          {product.category && (
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
              {product.category.name}
            </span>
          )}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 leading-snug">
            {product.name}
          </h1>

          {/* SKU & Brand info */}
          <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
            <span>SKU: <strong className="text-slate-600">{product.sku}</strong></span>
            {product.brand && (
              <>
                <span>·</span>
                <span>Brand: <strong className="text-slate-600">{product.brand.name}</strong></span>
              </>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(rating)
                      ? 'fill-amber-400'
                      : i < rating
                      ? 'fill-amber-300'
                      : 'text-slate-200'
                  }`}
                />
              ))}
              <span className="font-bold text-slate-900 ml-1.5 text-sm">{rating.toFixed(1)}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('customer-reviews-section')
                el?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="text-xs text-sky-600 hover:text-sky-700 font-semibold hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>({reviewCount} customer reviews)</span>
              <span>· Write a Review</span>
            </button>
          </div>
        </div>

        {/* Price & Stock */}
        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-slate-900">
                {formatBDT(currentPrice)}
              </span>
              {product.originalPrice && product.originalPrice > currentPrice && (
                <span className="text-base text-slate-400 line-through">
                  {formatBDT(product.originalPrice)}
                </span>
              )}
            </div>
            <p className="text-xs text-emerald-600 font-semibold mt-0.5">
              Inclusive of all VAT · Cash on Delivery available
            </p>
          </div>

          <div className="text-right">
            {isOutOfStock ? (
              <span className="inline-block px-3 py-1 bg-rose-100 text-rose-700 font-bold text-xs rounded-full">
                Out of Stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 font-bold text-xs rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                In Stock ({product.stock} units)
              </span>
            )}
          </div>
        </div>

        {/* Variants (if applicable) */}
        {product.variants.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Select Option:
            </span>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${
                    selectedVariant?.id === v.id
                      ? 'border-sky-600 bg-sky-50 text-sky-700 shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {v.name}: {v.value}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity & Actions */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-4">
            {/* Quantity Selector */}
            <div className="flex items-center border border-slate-300 rounded-xl bg-white p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 transition"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-bold text-slate-900 text-sm">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 transition disabled:opacity-30"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Wishlist Button */}
            <button
              onClick={handleToggleWishlist}
              className={`p-3 rounded-xl border transition flex items-center justify-center gap-2 text-sm font-semibold ${
                isSaved
                  ? 'border-rose-300 bg-rose-50 text-rose-600'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
              <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Wishlist'}</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="w-full py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
            >
              <ShoppingBag className="w-4 h-4" /> Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="w-full py-3.5 px-6 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm transition flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-sky-600/25"
            >
              ⚡ Buy Now (Cash on Del.)
            </button>
          </div>

          {/* WhatsApp Direct Order Button */}
          <a
            href={`https://wa.me/8801318043562?text=${encodeURIComponent(
              `Hello ATMODESK, I want to order "${product.name}" (SKU: ${product.sku}) priced at ৳${currentPrice}. Please confirm delivery.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs"
          >
            <span>💬</span> Order Directly via WhatsApp (+880 1318-043562)
          </a>

          {/* Back in Stock Notification (only when out of stock) */}
          {isOutOfStock && (
            <BackInStockNotify productId={product.id} productName={product.name} />
          )}

          {/* Share Product */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Share:</span>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Check out "${product.name}" on ATMODESK.bd! https://atmodeskbd-eo1e.vercel.app/product/${product.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-[11px] font-bold rounded-full transition"
            >
              WhatsApp
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://atmodeskbd-eo1e.vercel.app/product/${product.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 text-[11px] font-bold rounded-full transition"
            >
              Facebook
            </a>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`https://atmodeskbd-eo1e.vercel.app/product/${product.slug}`)
                toast('Link copied! 📋')
              }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-bold rounded-full transition"
            >
              📋 Copy Link
            </button>
          </div>
        </div>

        {/* Bangladesh Shipping & Assurance Card */}
        <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 text-xs text-slate-600">
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-sky-600 flex-shrink-0" />
            <div>
              <strong className="text-slate-900 font-semibold block">Bangladesh Delivery Times:</strong>
              <span>Inside Dhaka: 24–48 hours (৳60) · Outside Dhaka: 3–5 days (৳120)</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
            <RotateCcw className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <strong className="text-slate-900 font-semibold block">7 Days Easy Return:</strong>
              <span>Defective or incorrect item replacement guarantee with no questions asked.</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <strong className="text-slate-900 font-semibold block">Payment Security:</strong>
              <span>100% Cash on Delivery — pay when you receive your order at your doorstep.</span>
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* --- INFORMATION TABS (Description, Specs, Delivery) ---- */}
      <div id="product-tabs" className="border-t border-slate-200/80 pt-8 sm:pt-12 space-y-6">
        <div className="flex border-b border-slate-200 gap-6 sm:gap-8 text-sm sm:text-base font-bold overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('desc')}
            className={`pb-3 border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'desc'
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Description &amp; Features
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'specs'
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`pb-3 border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'shipping'
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Delivery &amp; Warranty
          </button>
        </div>

        {/* Tab Content */}
        <div className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-4xl">
          {activeTab === 'desc' && (
            <div className="space-y-4">
              <p className="text-slate-700 leading-relaxed text-base">{product.description}</p>
              {product.details && (
                <div className="whitespace-pre-line bg-slate-50 p-5 rounded-2xl font-mono text-xs sm:text-sm text-slate-800 border border-slate-200/80 leading-relaxed">
                  {product.details}
                </div>
              )}
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="space-y-3">
              {product.specs.length > 0 ? (
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs divide-y divide-slate-100">
                  {product.specs.map((s, idx) => (
                    <div
                      key={s.id}
                      className={`grid grid-cols-1 sm:grid-cols-3 p-3.5 sm:p-4 text-xs sm:text-sm ${
                        idx % 2 === 0 ? 'bg-slate-50/70' : 'bg-white'
                      }`}
                    >
                      <span className="font-bold text-slate-700 sm:col-span-1">{s.key}</span>
                      <span className="text-slate-900 sm:col-span-2 mt-0.5 sm:mt-0 font-medium">{s.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 italic">No technical specifications listed for this product.</p>
              )}
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-4 text-slate-700 text-sm">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-sky-600 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-slate-900 font-bold block">Courier &amp; Delivery Coverage:</strong>
                  <span>Fast doorstep delivery across all 64 districts in Bangladesh via Pathao Courier and Steadfast. Inside Dhaka: 24–48 hours (৳60). Outside Dhaka: 3–5 days (৳120).</span>
                </div>
              </div>
              <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
                <ShieldCheck className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-slate-900 font-bold block">Service Warranty:</strong>
                  <span>6 Months Official Service Warranty on smart clock displays, sensors, and microcontrollers.</span>
                </div>
              </div>
              <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
                <RotateCcw className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-slate-900 font-bold block">Unboxing &amp; Return Policy:</strong>
                  <span>Every unit is packaged with custom shock-absorbent bubble wrap. 7-day hassle-free replacement guarantee for defective items.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- DEDICATED CUSTOMER REVIEWS SHOWCASE (Full width) --- */}
      <div id="customer-reviews-section" className="border-t border-slate-200/80 pt-10 sm:pt-14 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-sky-600">Verified Feedback</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Customer Ratings &amp; Reviews
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {reviewCount} verified reviews for {product.name}
          </span>
        </div>

        <ProductReviews
          productId={product.id}
          productName={product.name}
          initialRating={rating}
          initialReviewCount={reviewCount}
          initialReviews={product.reviews || []}
          onReviewAdded={(_newR, newRating, newCount) => {
            setRating(newRating)
            setReviewCount(newCount)
          }}
        />
      </div>

      {/* --- RECENTLY VIEWED PRODUCTS (Full width) ------------- */}
      <div className="border-t border-slate-200/80 pt-10 sm:pt-14">
        <RecentlyViewed />
      </div>
    </div>
  )
}
