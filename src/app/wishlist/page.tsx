'use client'

import React from 'react'
import Link from 'next/link'
import { useWishlist } from '@/store/wishlist'
import { useCart } from '@/store/cart'
import { formatBDT } from '@/lib/utils'
import { useToast } from '@/components/shared/Providers'
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react'

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist()
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleMoveToCart = (item: any) => {
    addItem({
      id: item.productId,
      productId: item.productId,
      name: item.name,
      slug: item.slug,
      image: item.image,
      price: item.price,
      originalPrice: item.originalPrice,
      stock: 10,
      quantity: 1,
    })
    removeItem(item.productId)
    toast(`Moved "${item.name}" to cart! 🛍️`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Your Wishlist</h1>
          <p className="text-sm text-slate-500 mt-1">
            {items.length} {items.length === 1 ? 'item' : 'items'} saved for later.
          </p>
        </div>

        {items.length > 0 && (
          <button
            onClick={() => {
              if (confirm('Clear your entire wishlist?')) clearWishlist()
            }}
            className="text-xs font-bold text-rose-600 hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Your Wishlist is Empty</h2>
          <p className="text-sm text-slate-500">
            Click the heart icon on any product to save it here for later.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-xl transition shadow-md"
          >
            Explore Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.productId}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden p-4 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <Link href={`/product/${item.slug}`} className="block aspect-square bg-slate-50 rounded-xl overflow-hidden">
                  <img src={item.image || '/placeholder-product.jpg'} alt={item.name} className="w-full h-full object-cover" />
                </Link>
                <Link href={`/product/${item.slug}`} className="block font-semibold text-sm text-slate-900 hover:text-sky-600 line-clamp-2">
                  {item.name}
                </Link>
                <div className="text-base font-extrabold text-slate-900">
                  {formatBDT(item.price)}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleMoveToCart(item)}
                  className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> Move to Cart
                </button>
                <button
                  onClick={() => {
                    removeItem(item.productId)
                    toast('Removed item from wishlist')
                  }}
                  className="w-full py-2 text-slate-500 hover:text-rose-600 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1 hover:bg-rose-50"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
