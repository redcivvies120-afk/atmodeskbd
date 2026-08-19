'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/store/cart'
import { useWishlist } from '@/store/wishlist'
import { Home, Grid, Search, Heart, ShoppingBag } from 'lucide-react'

export function BottomNav() {
  const pathname = usePathname()
  const { itemCount, toggleCart } = useCart()
  const { items: wishlistItems } = useWishlist()

  // Hide bottom nav on admin routes
  if (pathname?.startsWith('/admin')) {
    return null
  }

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Categories', href: '/products', icon: Grid },
    { label: 'Search', href: '/search', icon: Search },
    { label: 'Wishlist', href: '/wishlist', icon: Heart, badge: wishlistItems.length },
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1.5 flex justify-around items-center">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl text-xs font-medium transition ${
              isActive ? 'text-sky-600 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {item.badge ? (
                <span className="absolute -top-1 -right-1.5 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              ) : null}
            </div>
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </Link>
        )
      })}

      {/* Cart button on mobile */}
      <button
        onClick={toggleCart}
        className="flex flex-col items-center justify-center p-1.5 rounded-xl text-xs font-medium text-slate-500 hover:text-sky-600 transition"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5 text-slate-800" />
          <span className="absolute -top-1 -right-1.5 bg-sky-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {itemCount()}
          </span>
        </div>
        <span className="text-[10px] mt-0.5 text-slate-800 font-bold">Cart</span>
      </button>
    </div>
  )
}
