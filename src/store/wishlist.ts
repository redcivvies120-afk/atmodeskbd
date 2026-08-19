'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface WishlistItem {
  productId: string
  name: string
  slug: string
  image: string
  price: number
  originalPrice?: number
  addedAt: string
}

interface WishlistStore {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (productId: string) => void
  toggleItem: (item: WishlistItem) => void
  isWishlisted: (productId: string) => boolean
  clearWishlist: () => void
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        if (!get().isWishlisted(item.productId)) {
          set({ items: [...get().items, item] })
        }
      },
      removeItem: (productId) =>
        set({ items: get().items.filter((i) => i.productId !== productId) }),
      toggleItem: (item) => {
        if (get().isWishlisted(item.productId)) {
          get().removeItem(item.productId)
        } else {
          get().addItem(item)
        }
      },
      isWishlisted: (productId) => get().items.some((i) => i.productId === productId),
      clearWishlist: () => set({ items: [] }),
    }),
    { name: 'atmodeskbd-wishlist' }
  )
)
