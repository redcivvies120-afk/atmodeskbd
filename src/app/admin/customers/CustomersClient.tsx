'use client'

import React, { useState } from 'react'
import { formatBDT, formatDate } from '@/lib/utils'
import {
  Users,
  Search,
  Phone,
  Mail,
  Calendar,
  ShoppingBag,
  ShieldCheck,
  UserCheck,
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
  const [search, setSearch] = useState('')

  const filtered = initialCustomers.filter((c) => {
    const q = search.toLowerCase()
    return (
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.phone && c.phone.includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q))
    )
  })

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
          <span className="text-xs text-slate-400">
            Live database records
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500 font-medium">
              {search ? 'No matching registered customers found.' : 'No registered customers yet. New signups from the website will automatically appear here!'}
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
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((c) => {
                  const ordersCount = c.orders?.length || 0
                  const totalSpent = c.orders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0
                  const isGenEmail = c.email.includes('@customer.atmodeskbd.com')

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
                        {c.phone ? (
                          <a href={`tel:${c.phone}`} className="hover:text-sky-600 hover:underline">
                            {c.phone}
                          </a>
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
                      <td className="p-3.5 text-slate-500">
                        {formatDate(c.createdAt)}
                      </td>
                      <td className="p-3.5 text-center">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          ordersCount > 0
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {ordersCount} orders
                        </span>
                      </td>
                      <td className="p-3.5 text-right font-bold text-slate-900">
                        {formatBDT(totalSpent)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
