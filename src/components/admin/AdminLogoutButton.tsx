'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export function AdminLogoutButton() {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (!confirm('Are you sure you want to lock and sign out of the Admin Panel?')) return
    setIsLoggingOut(true)
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      router.refresh()
    } catch {
      window.location.href = '/admin'
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition"
      title="Lock admin portal"
    >
      <span className="flex items-center gap-2">
        <LogOut className="w-4 h-4" />
        {isLoggingOut ? 'Locking...' : 'Lock Admin Panel'}
      </span>
    </button>
  )
}
