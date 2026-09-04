import React from 'react'
import Link from 'next/link'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Layers,
  Tag,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react'
import { isServerAdminAuthenticated } from '@/lib/admin-auth'
import { AdminLoginGate } from '@/components/admin/AdminLoginGate'
import { AdminLogoutButton } from '@/components/admin/AdminLogoutButton'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = await isServerAdminAuthenticated()

  // If not authenticated with admin passcode, show the login gate
  if (!isAuthenticated) {
    return <AdminLoginGate />
  }

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Customers', href: '/admin/customers', icon: Users },
    { label: 'Categories', href: '/admin/categories', icon: Layers },
    { label: 'Coupons', href: '/admin/coupons', icon: Tag },
  ]

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-sky-500 text-slate-950 flex items-center justify-center font-black text-sm shadow-sm">
                A
              </span>
              <div className="leading-tight">
                <span className="font-extrabold text-sm tracking-tight text-white block">
                  ATMODESK
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-sky-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 inline" /> Protected Admin
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition"
                >
                  <Icon className="w-4 h-4 text-sky-400" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Footer Actions & Lock Button */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-white/5 hover:text-white transition"
          >
            <span>View Live Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <AdminLogoutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl">
        {children}
      </main>
    </div>
  )
}
