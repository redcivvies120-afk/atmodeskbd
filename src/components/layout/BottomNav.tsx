'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/store/cart'
import { useWishlist } from '@/store/wishlist'
import { useMounted } from '@/lib/use-mounted'
import { Home, LayoutGrid, Heart, ShoppingBag, User } from 'lucide-react'

export function BottomNav() {
  const pathname = usePathname()
  const mounted = useMounted()
  const cartCount = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0))
  const toggleCart = useCart((s) => s.toggleCart)
  const wishlistCount = useWishlist((s) => s.items.length)

  // Hide on admin routes
  if (pathname?.startsWith('/admin')) return null

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname?.startsWith(href))

  const items = [
    { label: 'Home', href: '/', icon: Home, badge: 0 },
    { label: 'Catalog', href: '/products', icon: LayoutGrid, badge: 0 },
    { label: 'Wishlist', href: '/wishlist', icon: Heart, badge: wishlistCount },
    { label: 'Account', href: '/account', icon: User, badge: 0 },
  ]

  const itemCls =
    'lg-dock-item flex min-w-[58px] flex-col items-center justify-center rounded-[22px] px-2.5 py-1.5 text-[10px] font-medium'

  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed inset-x-3 z-40 bottom-[calc(env(safe-area-inset-bottom,0px)+10px)]"
    >
      <div className="lg-dock flex items-center justify-around px-1.5 py-1.5">
        {items.map((item) => {
          const Icon = item.icon
          const active = !!isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              data-active={active}
              aria-current={active ? 'page' : undefined}
              className={itemCls}
            >
              <span className="relative">
                <Icon className="h-[22px] w-[22px]" strokeWidth={active ? 2.4 : 2} />
                {mounted && item.badge > 0 && (
                  <span
                    key={item.badge}
                    className="absolute -right-2.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white animate-bounce-in"
                  >
                    {item.badge}
                  </span>
                )}
              </span>
              <span className="mt-0.5">{item.label}</span>
            </Link>
          )
        })}

        <button
          type="button"
          onClick={toggleCart}
          className={itemCls}
          aria-label={`Open cart${mounted && cartCount ? `, ${cartCount} items` : ''}`}
        >
          <span className="relative">
            <ShoppingBag className="h-[22px] w-[22px]" />
            {mounted && cartCount > 0 && (
              <span
                key={cartCount}
                className="absolute -right-2.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-sky-500 px-1 text-[9px] font-bold text-white animate-bounce-in"
              >
                {cartCount}
              </span>
            )}
          </span>
          <span className="mt-0.5">Cart</span>
        </button>
      </div>
    </nav>
  )
}
