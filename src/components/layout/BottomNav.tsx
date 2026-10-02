'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/store/cart'
import { useWishlist } from '@/store/wishlist'
import { Home, Grid, Heart, ShoppingBag, User } from 'lucide-react'

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
    { label: 'Catalog', href: '/products', icon: Grid },
    { label: 'Wishlist', href: '/wishlist', icon: Heart, badge: wishlistItems.length },
    { label: 'Account', href: '/account', icon: User },
  ]

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-dock border-t border-white/80 px-2 pt-2 pb-[calc(env(safe-area-inset-bottom,0px)+8px)] flex justify-around items-center transition-all duration-300"
    >
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl text-xs transition-all duration-200 active:scale-90 ${
              isActive
                ? 'text-sky-600 font-extrabold bg-sky-500/10 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 font-medium'
            }`}
          >
            {isActive && (
              <span className="absolute -top-1 w-5 h-1 bg-sky-500 rounded-full shadow-sm shadow-sky-500/50" />
            )}
            <div className="relative">
              <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
              {item.badge ? (
                <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[9px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center shadow-xs">
                  {item.badge}
                </span>
              ) : null}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
          </Link>
        )
      })}

      {/* Cart button on mobile */}
      <button
        onClick={toggleCart}
        className="relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl text-xs text-slate-700 hover:text-sky-600 font-medium transition-all duration-200 active:scale-90"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5 text-slate-800" />
          <span className="absolute -top-1 -right-2 bg-sky-600 text-white text-[9px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center shadow-xs">
            {itemCount()}
          </span>
        </div>
        <span className="text-[10px] mt-0.5 tracking-tight font-bold text-slate-900">Cart</span>
      </button>
    </nav>
  )
}
