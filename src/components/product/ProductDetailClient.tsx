'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatBDT } from '@/lib/utils'
import { useCart } from '@/store/cart'
import { useWishlist } from '@/store/wishlist'
import { useToast } from '@/components/shared/Providers'
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

  const isSaved = isWishlisted(product.id)
  const isOutOfStock = product.stock <= 0

  const currentPrice = selectedVariant?.price || product.price
  const images = product.images.length > 0 ? product.images : [{ id: '1', url: '/placeholder-product.jpg', isPrimary: true }]
  const activeImage = images[activeImageIndex]?.url || images[0]?.url

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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* ─── LEFT: IMAGE GALLERY ─────────────────────────────── */}
      <div className="lg:col-span-6 space-y-4">
        {/* Main Display Image with Zoom preview */}
        <div className="relative aspect-square w-full bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs flex items-center justify-center p-4">
          <img
            src={activeImage}
            alt={product.name}
            className="w-full h-full object-contain max-h-[480px] hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              ;(e.target as HTMLElement).style.display = 'none'
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

      {/* ─── RIGHT: PRODUCT DETAILS & BUY ACTIONS ────────────── */}
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
                    i < Math.floor(product.rating)
                      ? 'fill-amber-400'
                      : i < product.rating
                      ? 'fill-amber-300'
                      : 'text-slate-200'
                  }`}
                />
              ))}
              <span className="font-bold text-slate-900 ml-1.5 text-sm">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-slate-400">({product.reviewCount} customer reviews)</span>
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
            href={`https://wa.me/8801712345678?text=${encodeURIComponent(
              `Hello ATMODESK, I want to order "${product.name}" (SKU: ${product.sku}) priced at ৳${currentPrice}. Please confirm delivery.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs"
          >
            <span>💬</span> Order Directly via WhatsApp (+880 1712-345678)
          </a>
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
              <span>Cash on Delivery, bKash, Nagad, Rocket, Visa/Mastercard supported.</span>
            </div>
          </div>
        </div>

        {/* Information Tabs */}
        <div className="border-t border-slate-200 pt-6 space-y-4">
          <div className="flex border-b border-slate-200 gap-6 text-sm font-bold">
            <button
              onClick={() => setActiveTab('desc')}
              className={`pb-3 border-b-2 transition ${
                activeTab === 'desc'
                  ? 'border-sky-600 text-sky-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Description &amp; Features
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-3 border-b-2 transition ${
                activeTab === 'specs'
                  ? 'border-sky-600 text-sky-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-3 border-b-2 transition ${
                activeTab === 'shipping'
                  ? 'border-sky-600 text-sky-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Shipping &amp; Warranty
            </button>
          </div>

          {/* Tab Content */}
          <div className="text-sm text-slate-600 leading-relaxed">
            {activeTab === 'desc' && (
              <div className="space-y-3">
                <p>{product.description}</p>
                {product.details && (
                  <div className="whitespace-pre-line bg-slate-50 p-4 rounded-xl font-mono text-xs text-slate-800 border border-slate-200/80">
                    {product.details}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="space-y-2">
                {product.specs.length > 0 ? (
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    {product.specs.map((s, idx) => (
                      <div
                        key={s.id}
                        className={`grid grid-cols-2 p-3 text-xs ${
                          idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'
                        }`}
                      >
                        <span className="font-bold text-slate-700">{s.key}</span>
                        <span className="text-slate-900">{s.value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 italic">No technical specifications listed for this product.</p>
                )}
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-2">
                <p><strong>Courier:</strong> Pathao Courier, Steadfast, RedX</p>
                <p><strong>Warranty:</strong> 6 Months Official Service Warranty on smart clock displays.</p>
                <p><strong>Packaging:</strong> Custom cushioned bubble wrap &amp; sealed unboxing package.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
