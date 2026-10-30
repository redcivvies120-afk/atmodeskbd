'use client'

import React, { useState } from 'react'
import { formatBDT, formatDate } from '@/lib/utils'
import { useToast } from '@/components/shared/Providers'
import {
  Users,
  Search,
  MessageCircle,
  Mail,
  Calendar,
  ShoppingBag,
  ShieldCheck,
  UserCheck,
  KeyRound,
  X,
  Loader2,
  Check,
} from 'lucide-react'

interface Customer {
  id: string
  name: string | null
  email: string
  phone: string | null
  createdAt: string | Date
  orders: any[]
}

export function CustomersClient({ initialCustomers }: { initialCustomers: Customer[] }) {
  const { toast } = useToast()
  const [search, setSearch] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [isResetting, setIsResetting] = useState(false)

  const filtered = initialCustomers.filter((c) => {
    const q = search.toLowerCase()
    return (
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.phone && c.phone.includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q))
    )
  })

  const handleOpenReset = (c: Customer) => {
    setSelectedCustomer(c)
    // Generate a secure, friendly temporary password suggestion
    setNewPassword(`Atmo@${Math.floor(1000 + Math.random() * 9000)}`)
  }

  const handleSavePassword = async () => {
    if (!selectedCustomer) return
    if (!newPassword || newPassword.length < 6) {
      toast('Password must be at least 6 characters', 'error')
      return
    }

    setIsResetting(true)
    try {
      const res = await fetch(`/api/admin/customers/${selectedCustomer.id}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to reset password')

      toast(`Password updated for ${selectedCustomer.name || selectedCustomer.phone}!`, 'success')
      navigator.clipboard.writeText(newPassword)
      toast('Temporary password copied to clipboard!', 'info')
      setSelectedCustomer(null)
    } catch (err: any) {
      toast(err.message || 'Error updating password', 'error')
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Stat Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">
              Total Registered
            </span>
            <strong className="text-2xl font-black text-slate-900">
              {initialCustomers.length}
            </strong>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">
              Active Accounts
            </span>
            <strong className="text-2xl font-black text-slate-900">
              {initialCustomers.length}
            </strong>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">
              Customer Orders
            </span>
            <strong className="text-2xl font-black text-slate-900">
              {initialCustomers.reduce((sum, c) => sum + (c.orders?.length || 0), 0)}
            </strong>
          </div>
        </div>
      </div>

      {/* Search Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search registered customers by name, phone (e.g. 01318...), or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            Registered Customers List ({filtered.length})
          </h2>
          <span className="text-xs text-slate-400">Live database records</span>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500 font-medium">
              {search
                ? 'No matching registered customers found.'
                : 'No registered customers yet. New signups from the website will automatically appear here!'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200/80">
                <tr>
                  <th className="p-3.5">Customer Name</th>
                  <th className="p-3.5">Phone Number</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Joined Date</th>
                  <th className="p-3.5 text-center">Orders</th>
                  <th className="p-3.5 text-right">Total Spent</th>
                  <th className="p-3.5 text-center w-36">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((c) => {
                  const ordersCount = c.orders?.length || 0
                  const totalSpent = c.orders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0
                  const isGenEmail = c.email.includes('@customer.atmodeskbd.com')
                  const phone = c.phone || ''
                  const cleanPhone = phone.startsWith('0') ? '88' + phone : phone.replace('+', '')

                  return (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3.5 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-black text-[11px]">
                            {c.name ? c.name.slice(0, 2).toUpperCase() : 'U'}
                          </div>
                          <span>{c.name || 'Anonymous User'}</span>
                        </div>
                      </td>
                      <td className="p-3.5 font-mono text-slate-700">
                        {phone ? (
                          <span>{phone}</span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="p-3.5 text-slate-600">
                        {isGenEmail ? (
                          <span className="text-slate-400 italic text-[11px]">Phone Account</span>
                        ) : (
                          c.email
                        )}
                      </td>
                      <td className="p-3.5 text-slate-500">{formatDate(c.createdAt)}</td>
                      <td className="p-3.5 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            ordersCount > 0
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {ordersCount} orders
                        </span>
                      </td>
                      <td className="p-3.5 text-right font-bold text-slate-900">
                        {formatBDT(totalSpent)}
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Reset Password Button */}
                          <button
                            onClick={() => handleOpenReset(c)}
                            title="Reset Password for this customer"
                            className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-bold transition flex items-center gap-1 shadow-2xs"
                          >
                            <KeyRound className="w-3 h-3 text-sky-400" />
                            <span>Reset</span>
                          </button>

                          {/* WhatsApp Customer */}
                          {phone && (
                            <a
                              href={`https://wa.me/${cleanPhone}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Chat with Customer on WhatsApp"
                              className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Password Reset Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Reset Customer Password</h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {selectedCustomer.name || selectedCustomer.phone || selectedCustomer.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600">
                Enter a new password for this customer. When saved, it will be automatically copied to your clipboard so you can text it to them on WhatsApp.
              </p>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  New Password
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="flex-1 px-3.5 py-2.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <button
                    type="button"
                    onClick={() => setNewPassword(`Atmo@${Math.floor(1000 + Math.random() * 9000)}`)}
                    className="px-2.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-[10px] transition"
                  >
                    Random
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePassword}
                disabled={isResetting}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-xs disabled:opacity-50"
              >
                {isResetting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Save &amp; Copy Password</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
