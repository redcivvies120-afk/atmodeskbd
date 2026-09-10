'use client'

import React, { useState } from 'react'
import { Bell, CheckCircle, Loader2 } from 'lucide-react'

interface BackInStockProps {
  productId: string
  productName: string
}

export function BackInStockNotify({ productId, productName }: BackInStockProps) {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email && !phone) return

    setLoading(true)
    // Store in localStorage for now (could be sent to API later)
    try {
      const notifications = JSON.parse(localStorage.getItem('atmodesk-stock-notify') || '[]')
      notifications.push({
        productId,
        productName,
        email,
        phone,
        createdAt: new Date().toISOString(),
      })
      localStorage.setItem('atmodesk-stock-notify', JSON.stringify(notifications))
      setSubmitted(true)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700">
        <CheckCircle className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm font-medium">
          We&apos;ll notify you when <strong>&quot;{productName}&quot;</strong> is back in stock!
        </p>
      </div>
    )
  }

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-amber-700 font-semibold text-sm transition"
      >
        <Bell className="w-4 h-4" />
        Notify Me When Back In Stock
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 p-4 bg-amber-50 border border-amber-200 rounded-xl">
      <div className="flex items-center gap-2 text-amber-700 mb-2">
        <Bell className="w-4 h-4" />
        <p className="text-sm font-bold">Get notified when it&apos;s back!</p>
      </div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        className="w-full px-3 py-2 bg-white border border-amber-200 rounded-lg text-sm outline-none focus:border-amber-500"
      />
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Or phone number (optional)"
        className="w-full px-3 py-2 bg-white border border-amber-200 rounded-lg text-sm outline-none focus:border-amber-500"
      />
      <button
        type="submit"
        disabled={loading || (!email && !phone)}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-lg transition disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bell className="w-4 h-4" />}
        Notify Me
      </button>
    </form>
  )
}
