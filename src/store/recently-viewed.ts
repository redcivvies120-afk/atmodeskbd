// src/store/recently-viewed.ts
'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface RecentlyViewedProduct {
  id: string
  name: string
  slug: string
  image: string
  price: number
  originalPrice?: number | null
  categoryName?: string | null
}

interface RecentlyViewedStore {
  products: RecentlyViewedProduct[]
  items: RecentlyViewedProduct[]
  addProduct: (product: RecentlyViewedProduct) => void
  getProducts: () => RecentlyViewedProduct[]
  clearAll: () => void
}

export const useRecentlyViewed = create<RecentlyViewedStore>()(
  persist(
    (set, get) => ({
      products: [],
      get items() {
        return get().products
      },

      addProduct: (product) => {
        const current = get().products
        // Remove existing occurrence if already present by id or slug
        const filtered = current.filter(
          (p) => p.id !== product.id && p.slug !== product.slug
        )
        // Add new product to front and cap at 10 items
        const updated = [product, ...filtered].slice(0, 10)
        set({ products: updated })
      },

      getProducts: () => get().products,

      clearAll: () => set({ products: [] }),
    }),
    {
      name: 'atmodesk-recently-viewed',
      partialize: (state) => ({ products: state.products }),
    }
  )
)
