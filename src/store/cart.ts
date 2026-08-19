// src/store/cart.ts
'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  productId: string
  name: string
  slug: string
  image: string
  price: number
  originalPrice?: number
  quantity: number
  variantId?: string
  variantName?: string
  stock: number
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (productId: string, variantId?: string) => void
  updateQty: (productId: string, qty: number, variantId?: string) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  itemCount: () => number
  subtotal: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (incoming) => {
        const items = get().items
        const key = incoming.productId + (incoming.variantId || '')
        const existing = items.find(
          (i) => i.productId === incoming.productId && i.variantId === incoming.variantId
        )
        if (existing) {
          const newQty = Math.min(existing.quantity + (incoming.quantity || 1), incoming.stock)
          set({
            items: items.map((i) =>
              i.productId === incoming.productId && i.variantId === incoming.variantId
                ? { ...i, quantity: newQty }
                : i
            ),
            isOpen: true,
          })
        } else {
          set({
            items: [...items, { ...incoming, quantity: incoming.quantity || 1 }],
            isOpen: true,
          })
        }
      },

      removeItem: (productId, variantId) =>
        set({
          items: get().items.filter(
            (i) => !(i.productId === productId && i.variantId === variantId)
          ),
        }),

      updateQty: (productId, qty, variantId) => {
        if (qty <= 0) {
          get().removeItem(productId, variantId)
          return
        }
        set({
          items: get().items.map((i) =>
            i.productId === productId && i.variantId === variantId
              ? { ...i, quantity: Math.min(qty, i.stock) }
              : i
          ),
        })
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: 'atmodeskbd-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
)
