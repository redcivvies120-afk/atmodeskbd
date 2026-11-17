'use client'

import React, { Suspense } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { LayoutDashboard, ShoppingBag, Package, Layers, Tag, Users, Image as ImageIcon } from 'lucide-react'

const NAV = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Prepared orders', href: '/admin/orders?status=PREPARED', icon: Package },
  { label: 'Products', href: '/admin/products', icon: Layers },
  { label: 'Categories', href: '/admin/categories', icon: Layers },
  { label: 'Coupons', href: '/admin/coupons', icon: Tag },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Banners & hero', href: '/admin/banners', icon: ImageIcon },
]

function NavList() {
  const pathname = usePathname()
  const search = useSearchParams()
  const prepared = search.get('status') === 'PREPARED'

  return (
    <nav className="p-3 space-y-0.5" aria-label="Admin navigation">
      {NAV.map((item) => {
        const Icon = item.icon
        const [hrefPath, hrefQuery] = item.href.split('?')
        let active = pathname === hrefPath || pathname.startsWith(hrefPath + '/')
        if (hrefPath === '/admin/orders') active = active && (hrefQuery ? prepared : !prepared)
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-semibold transition ${
              active ? 'bg-white text-[#083466] shadow-sm' : 'text-sky-100/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Icon className={`w-4 h-4 ${active ? 'text-[#0A9EE6]' : 'text-sky-300'}`} />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

export function AdminNav() {
  return (
    <Suspense fallback={<div className="p-3 text-xs text-sky-200">Loading menu...</div>}>
      <NavList />
    </Suspense>
  )
}
