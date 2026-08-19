'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  User,
  Package,
  Heart,
  Phone,
  Lock,
  ArrowRight,
  ShieldCheck,
  Search,
  LogIn,
  UserPlus,
} from 'lucide-react'

export function AccountClient() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'track' | 'login' | 'register'>('track')
  const [trackPhone, setTrackPhone] = useState('')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [regName, setRegName] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!trackPhone.trim()) return
    router.push(`/track-order?query=${encodeURIComponent(trackPhone.trim())}`)
  }

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('Welcome back! Logging into your customer portal...')
    setTimeout(() => {
      setMessage('No active customer account found with these credentials. You can also track your orders directly by phone number.')
    }, 1000)
  }

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('Creating your account...')
    setTimeout(() => {
      setMessage('Registration successful! You can now place orders and track your shipments.')
    }, 1000)
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-3xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto text-2xl shadow-inner">
          <User className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Customer Portal
        </h1>
        <p className="text-xs text-slate-500">
          Track your shipments, view past orders, or sign in to your Atmodesk account.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-100 rounded-2xl">
        <button
          onClick={() => { setActiveTab('track'); setMessage(null) }}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'track'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Search className="w-3.5 h-3.5" /> Quick Track
        </button>
        <button
          onClick={() => { setActiveTab('login'); setMessage(null) }}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'login'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <LogIn className="w-3.5 h-3.5" /> Sign In
        </button>
        <button
          onClick={() => { setActiveTab('register'); setMessage(null) }}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'register'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <UserPlus className="w-3.5 h-3.5" /> Register
        </button>
      </div>

      {/* Status Message */}
      {message && (
        <div className="p-3 bg-sky-50 border border-sky-200 text-sky-800 text-xs rounded-xl text-center">
          {message}
        </div>
      )}

      {/* Card Content */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        {/* 1. Quick Track */}
        {activeTab === 'track' && (
          <form onSubmit={handleTrackSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Phone Number or Order Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. 01318043562 or ATD-2026-XXXX"
                  value={trackPhone}
                  onChange={(e) => setTrackPhone(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                  required
                />
                <Package className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">
                Enter the mobile number you used at checkout to instantly view your order delivery status.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-xs"
            >
              Track My Order <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* 2. Sign In */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone or Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="01318043562 or you@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
                <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
            >
              Sign In <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* 3. Register */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Tanvir Hasan"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="01318043562"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Create Password
              </label>
              <input
                type="password"
                placeholder="At least 6 characters"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-xs"
            >
              Create Customer Account <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>

      {/* Helpful Shortcuts */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/wishlist"
          className="p-4 bg-white border border-slate-200 hover:border-sky-500 rounded-2xl transition flex items-center gap-3 shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">My Wishlist</h4>
            <p className="text-[10px] text-slate-400">View saved items</p>
          </div>
        </Link>

        <Link
          href="/track-order"
          className="p-4 bg-white border border-slate-200 hover:border-sky-500 rounded-2xl transition flex items-center gap-3 shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Track Order</h4>
            <p className="text-[10px] text-slate-400">Live courier tracker</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
