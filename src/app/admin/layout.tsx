import React from 'react'
import Link from 'next/link'
import { ExternalLink, ShieldCheck } from 'lucide-react'
import { isServerAdminAuthenticated } from '@/lib/admin-auth'
import { AdminLoginGate } from '@/components/admin/AdminLoginGate'
import { AdminLogoutButton } from '@/components/admin/AdminLogoutButton'
import { AdminNav } from '@/components/admin/AdminNav'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = await isServerAdminAuthenticated()

  // If not authenticated with admin passcode, show the login gate
  if (!isAuthenticated) {
    return <AdminLoginGate />
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#003060] text-white flex flex-col justify-between flex-shrink-0 md:sticky md:top-0 md:h-screen md:overflow-y-auto">
        <div>
          <div className="p-5 border-b border-white/10">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <span className="bg-white rounded-xl p-1.5 shadow-sm">
                <img src="/logo-header.png" alt="ATMODESK.bd" className="h-9 w-auto" />
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-sky-300 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Admin
              </span>
            </Link>
          </div>
          <AdminNav />
        </div>

        <div className="p-3 border-t border-white/10 space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-sky-100/80 hover:bg-white/10 hover:text-white transition"
          >
            <span>View live store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <AdminLogoutButton />
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-10 max-w-7xl">{children}</main>
    </div>
  )
}
