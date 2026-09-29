'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatBDT, formatDate, getOrderStatusLabel, getOrderStatusColor } from '@/lib/utils'
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
  LogOut,
  Clock,
  Calendar,
  Mail,
  Loader2,
} from 'lucide-react'

export function AccountClient() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'track' | 'login' | 'register' | 'forgot'>('login')
  
  // Forms state
  const [trackPhone, setTrackPhone] = useState('')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [regName, setRegName] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [forgotIdentifier, setForgotIdentifier] = useState('')
  const [forgotWhatsappUrl, setForgotWhatsappUrl] = useState<string | null>(null)
  
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Fetch active user on load
  const checkUser = async () => {
    try {
      const res = await fetch('/api/auth/me')
      const data = await res.json()
      if (data.user) {
        setCurrentUser(data.user)
      } else {
        setCurrentUser(null)
      }
    } catch (e) {
      setCurrentUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkUser()
  }, [])

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!trackPhone.trim()) return
    router.push(`/track-order?query=${encodeURIComponent(trackPhone.trim())}`)
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: loginEmail, password: loginPassword }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to sign in')
      }

      setSuccessMsg('Signed in successfully!')
      await checkUser()
    } catch (err: any) {
      setErrorMsg(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName,
          phone: regPhone,
          email: regEmail,
          password: regPassword,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to register')
      }

      setSuccessMsg('Account registered successfully! Welcome to Atmodesk.')
      await checkUser()
    } catch (err: any) {
      setErrorMsg(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setErrorMsg(null)
    setSuccessMsg(null)
    setForgotWhatsappUrl(null)

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: forgotIdentifier }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit reset request')
      }

      setSuccessMsg(data.message)
      if (data.whatsappUrl) {
        setForgotWhatsappUrl(data.whatsappUrl)
      }
    } catch (err: any) {
      setErrorMsg(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setCurrentUser(null)
      setSuccessMsg('You have been logged out.')
    } catch (e) {
      setCurrentUser(null)
    }
  }

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <Loader2 className="w-8 h-8 text-sky-600 animate-spin mx-auto" />
        <p className="text-xs text-slate-500">Loading your customer profile...</p>
      </div>
    )
  }

  // ─── IF LOGGED IN: SHOW REAL CUSTOMER DASHBOARD ───────────────
  if (currentUser) {
    const orders = currentUser.orders || []
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Profile Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-sky-600 text-white flex items-center justify-center text-xl font-black shadow-md">
              {currentUser.name ? currentUser.name.slice(0, 2).toUpperCase() : 'AD'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900">{currentUser.name}</h1>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-full uppercase tracking-wider">
                  Registered Customer
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
                {currentUser.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-sky-500" /> {currentUser.phone}
                  </span>
                )}
                {currentUser.email && !currentUser.email.includes('@customer.atmodeskbd.com') && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-sky-500" /> {currentUser.email}
                  </span>
                )}
                {currentUser.createdAt && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" /> Member since {formatDate(currentUser.createdAt)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Link
              href="/track-order"
              className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs"
            >
              <Package className="w-3.5 h-3.5" /> Track Shipments
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 border border-slate-300 hover:bg-rose-50 hover:text-rose-600 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" /> Log Out
            </button>
          </div>
        </div>

        {/* Order History */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-sky-600" /> My Order History
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Orders placed under your account.</p>
            </div>
            <Link
              href="/products"
              className="text-xs font-bold text-sky-600 hover:underline"
            >
              Continue Shopping →
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto text-xl">
                🛍️
              </div>
              <h3 className="text-sm font-bold text-slate-900">No orders yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore our premium collection of smart pixel clocks, ambient lights, and desk tech!
              </p>
              <Link
                href="/products"
                className="inline-block px-5 py-2.5 bg-sky-600 text-white font-bold text-xs rounded-xl hover:bg-sky-700 transition shadow-xs mt-2"
              >
                Browse Catalog
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {orders.map((o: any) => (
                <div key={o.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-slate-900">{o.orderNumber}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getOrderStatusColor(o.status)}`}>
                        {getOrderStatusLabel(o.status)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Placed on {formatDate(o.createdAt)} · {o.items?.length || 0} items · {o.paymentMethod}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Total</span>
                      <strong className="text-base font-extrabold text-slate-900">{formatBDT(o.total)}</strong>
                    </div>
                    <Link
                      href={`/order-confirmed/${o.orderNumber}`}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition"
                    >
                      View Receipt
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // ─── IF GUEST: SHOW SIGN IN / REGISTER / TRACK TABS ───────────
  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-3xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto text-2xl shadow-inner">
          <User className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Customer Portal
        </h1>
        <p className="text-xs text-slate-500">
          Sign in with Google, register, or order as guest.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-100 rounded-2xl">
        <button
          onClick={() => { setActiveTab('login'); setErrorMsg(null); setSuccessMsg(null) }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'login'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <LogIn className="w-3.5 h-3.5" /> Sign In
        </button>
        <button
          onClick={() => { setActiveTab('register'); setErrorMsg(null); setSuccessMsg(null) }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'register'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <UserPlus className="w-3.5 h-3.5" /> Register
        </button>
        <button
          onClick={() => { setActiveTab('track'); setErrorMsg(null); setSuccessMsg(null) }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'track'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Search className="w-3.5 h-3.5" /> Track Order
        </button>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl text-center font-medium">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl text-center font-medium">
          {successMsg}
        </div>
      )}

      {/* Card Content */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        {/* 1. SIGN IN TAB */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone Number or Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="01318043562 or email@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                  required
                />
                <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => { setActiveTab('forgot'); setErrorMsg(null); setSuccessMsg(null) }}
                  className="text-xs text-sky-600 hover:text-sky-700 hover:underline font-semibold"
                >
                  Forgot password?
                </button>
              </div>
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
              disabled={submitting}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
                <span className="bg-white px-2 text-slate-400">or</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => window.location.href = '/api/auth/google'}
              className="w-full py-3.5 bg-white border border-slate-200 hover:bg-slate-50 hover:-translate-y-0.5 hover:shadow-md text-slate-700 font-bold text-xs rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className="text-xs text-sky-600 hover:underline font-semibold"
              >
                Don't have an account? Register now →
              </button>
            </div>
          </form>
        )}

        {/* 2. REGISTER TAB */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Your Full Name
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
                Phone Number (Bangladesh)
              </label>
              <input
                type="tel"
                placeholder="01318043562"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Create Password
              </label>
              <input
                type="password"
                placeholder="Minimum 6 characters"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Create Customer Account <ArrowRight className="w-4 h-4" /></>}
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
                <span className="bg-white px-2 text-slate-400">or</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => window.location.href = '/api/auth/google'}
              className="w-full py-3.5 bg-white border border-slate-200 hover:bg-slate-50 hover:-translate-y-0.5 hover:shadow-md text-slate-700 font-bold text-xs rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign Up with Google
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="text-xs text-sky-600 hover:underline font-semibold"
              >
                Already have an account? Sign in →
              </button>
            </div>
          </form>
        )}

        {/* 3. TRACK ORDER TAB */}
        {activeTab === 'track' && (
          <form onSubmit={handleTrackSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
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
                Track your parcel delivery without signing in.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-xs"
            >
              Track My Parcel <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* 4. FORGOT PASSWORD TAB */}
        {activeTab === 'forgot' && (
          <div className="space-y-5 animate-fade-in">
            <div className="text-center space-y-1">
              <h2 className="text-base font-bold text-slate-900">Reset Your Password</h2>
              <p className="text-xs text-slate-500">
                Enter your registered phone number or email address to recover your account.
              </p>
            </div>

            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Phone Number or Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. 01318043562 or email@example.com"
                    value={forgotIdentifier}
                    onChange={(e) => setForgotIdentifier(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                    required
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Request Password Reset <ArrowRight className="w-4 h-4" /></>}
              </button>

              {forgotWhatsappUrl ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-2 text-center animate-fade-in">
                  <strong className="block font-bold text-emerald-800">✅ Reset Request Initiated!</strong>
                  <p className="text-[11px] text-emerald-700">Click below to message support on WhatsApp for instant 1-minute password reset:</p>
                  <a
                    href={forgotWhatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-xs"
                  >
                    💬 Open WhatsApp Support
                  </a>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-100 text-sky-900 text-xs space-y-1">
                  <strong className="block font-bold">💬 Need instant help?</strong>
                  <p className="text-[11px] text-sky-700">
                    Message our WhatsApp support directly at{' '}
                    <a
                      href="https://wa.me/8801318043562?text=Hi%20Atmodesk%2C%20I%20need%20help%20resetting%20my%20account%20password."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-bold text-sky-800"
                    >
                      +880 1318-043562
                    </a>{' '}
                    with your registered phone number.
                  </p>
                </div>
              )}

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setActiveTab('login'); setErrorMsg(null); setSuccessMsg(null) }}
                  className="text-xs text-slate-500 hover:text-slate-900 font-semibold"
                >
                  ← Back to Sign In
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
