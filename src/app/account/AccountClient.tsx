// src/app/account/AccountClient.tsx
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
  MessageCircle,
  Loader2,
} from 'lucide-react'

export function AccountClient() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
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
  const [forgotStep, setForgotStep] = useState<1 | 2>(1)
  const [forgotCode, setForgotCode] = useState('')
  const [forgotNewPassword, setForgotNewPassword] = useState('')
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('')
  
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
        throw new Error(data.error || 'Failed to create account')
      }

      setSuccessMsg('Account created successfully! You are now signed in.')
      await checkUser()
    } catch (err: any) {
      setErrorMsg(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  // 2-Step Forgot Password
  const handleForgotCheck = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!forgotIdentifier.trim()) {
      setErrorMsg('Please enter your phone number or email address.')
      return
    }

    setSubmitting(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: forgotIdentifier }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to process request')
      }

      setSuccessMsg(data.message)
      setForgotStep(2)
    } catch (err: any) {
      setErrorMsg(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleForgotReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (forgotNewPassword !== forgotConfirmPassword) {
      setErrorMsg('Passwords do not match.')
      return
    }
    if (forgotNewPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters.')
      return
    }
    if (!/^\d{6}$/.test(forgotCode.trim())) {
      setErrorMsg('Please enter the 6-digit code we sent you.')
      return
    }

    setSubmitting(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: forgotIdentifier,
          code: forgotCode.trim(),
          newPassword: forgotNewPassword,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update password')
      }

      setSuccessMsg(data.message)
      setLoginEmail(forgotIdentifier)
      setLoginPassword('')
      setTimeout(() => {
        setActiveTab('login')
        setForgotStep(1)
        setForgotCode('')
        setForgotNewPassword('')
        setForgotConfirmPassword('')
      }, 1500)
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
        <Loader2 className="w-8 h-8 text-[#0077C8] animate-spin mx-auto" />
        <p className="text-xs text-[#5B6B80]">Loading your customer profile...</p>
      </div>
    )
  }

  // --- IF LOGGED IN: SHOW REAL CUSTOMER DASHBOARD ---------------
  if (currentUser) {
    const orders = currentUser.orders || []
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#fafafa]">
        {/* Profile Card */}
        <div className="liquid-glass-card bg-white border border-black/[0.08] rounded-[32px] p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#0077C8] text-white flex items-center justify-center text-xl font-black shadow-md">
              {currentUser.name ? currentUser.name.slice(0, 2).toUpperCase() : 'AD'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-[#0F2138] tracking-tight">{currentUser.name}</h1>
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-full uppercase tracking-wider border border-emerald-200/50">
                  Registered Customer
                </span>
              </div>
              <p className="text-xs text-[#5B6B80] mt-1 flex flex-wrap items-center gap-4">
                {currentUser.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-[#0077C8]" /> {currentUser.phone}</span>}
                {currentUser.email && <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-[#0077C8]" /> {currentUser.email}</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <Link
              href="/track-order"
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-full bg-[#F3F7FB] hover:bg-black/5 text-[#0F2138] text-xs font-bold transition flex items-center justify-center gap-1.5 border border-black/[0.06]"
            >
              <Package className="w-3.5 h-3.5" /> Track Deliveries
            </Link>
            <button
              onClick={handleLogout}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition flex items-center justify-center gap-1.5 border border-rose-200/50"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>

        {/* Customer Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="liquid-glass-card bg-white border border-black/[0.08] rounded-[24px] p-5 shadow-xs">
            <span className="text-[11px] font-bold text-[#86868b] uppercase tracking-wider block">Total Orders</span>
            <div className="text-2xl font-black text-[#0F2138] mt-1 tabular">{orders.length}</div>
            <p className="text-[11px] text-[#86868b] mt-1">Purchased with Cash on Delivery</p>
          </div>

          <div className="liquid-glass-card bg-white border border-black/[0.08] rounded-[24px] p-5 shadow-xs">
            <span className="text-[11px] font-bold text-[#86868b] uppercase tracking-wider block">Support Helpline</span>
            <div className="text-sm font-bold text-emerald-600 mt-1 flex items-center gap-1">
              <MessageCircle className="w-4 h-4" /> 01318043562
            </div>
            <p className="text-[11px] text-[#86868b] mt-1">WhatsApp text support (10am–10pm BST)</p>
          </div>

          <div className="liquid-glass-card bg-white border border-black/[0.08] rounded-[24px] p-5 shadow-xs">
            <span className="text-[11px] font-bold text-[#86868b] uppercase tracking-wider block">Warranty Protection</span>
            <div className="text-sm font-bold text-[#0077C8] mt-1 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> 7-Day Replacement
            </div>
            <p className="text-[11px] text-[#86868b] mt-1">Hassle-free coverage on all gadgets</p>
          </div>
        </div>

        {/* Order History */}
        <div className="liquid-glass-card bg-white border border-black/[0.08] rounded-[32px] p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-black/[0.06] pb-4">
            <div>
              <h2 className="text-lg font-black text-[#0F2138] tracking-tight">Your Order History</h2>
              <p className="text-xs text-[#5B6B80] mt-0.5">All desk gadget purchases linked to your customer profile</p>
            </div>
            <Link
              href="/products"
              className="text-xs font-bold text-[#0077C8] hover:underline"
            >
              Browse Catalog →
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Package className="w-10 h-10 text-[#86868b] mx-auto opacity-50" />
              <h3 className="text-sm font-bold text-[#0F2138]">No orders yet</h3>
              <p className="text-xs text-[#5B6B80] max-w-xs mx-auto">
                Ready to elevate your desk setup? Check out our aesthetic smart clocks.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#0077C8] text-white text-xs font-bold shadow-xs hover:bg-[#0066AD] transition"
              >
                Start Shopping <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-black/[0.06]">
              {orders.map((o: any) => (
                <div key={o.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-[#0F2138]">{o.orderNumber}</span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${getOrderStatusColor(o.status)}`}>
                        {getOrderStatusLabel(o.status)}
                      </span>
                    </div>
                    <p className="text-xs text-[#5B6B80]">
                      Placed on {formatDate(o.createdAt)} · {o.items?.length || 0} items · {o.paymentMethod}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-2">
                    <div className="text-right mr-3">
                      <span className="text-[10px] text-[#86868b] block uppercase">Total</span>
                      <strong className="text-base font-black text-[#0F2138] tabular">{formatBDT(o.total)}</strong>
                    </div>
                    <Link
                      href={`/track-order?orderNumber=${o.orderNumber}&phone=${encodeURIComponent(currentUser.phone || '')}`}
                      className="px-3.5 py-1.5 bg-[#0077C8]/10 hover:bg-[#0077C8]/20 text-[#0077C8] text-xs font-bold rounded-full transition"
                    >
                      Track &amp; Manage
                    </Link>
                    <Link
                      href={`/order-confirmed/${o.orderNumber}`}
                      className="px-3.5 py-1.5 bg-[#F3F7FB] hover:bg-black/5 text-[#0F2138] text-xs font-semibold rounded-full transition border border-black/[0.06]"
                    >
                      Receipt
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

  // --- IF GUEST: SHOW SIGN IN / REGISTER / TRACK TABS -----------
  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-3xl bg-[#0077C8]/10 text-[#0077C8] flex items-center justify-center mx-auto text-2xl shadow-xs">
          <User className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0F2138]">
          Customer Portal
        </h1>
        <p className="text-xs text-[#5B6B80]">
          Sign in to your account, register, or track active orders.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex p-1.5 bg-[#F3F7FB] rounded-full border border-black/[0.06]">
        <button
          onClick={() => { setActiveTab('login'); setErrorMsg(null); setSuccessMsg(null) }}
          className={`flex-1 py-2 text-xs font-bold rounded-full transition flex items-center justify-center gap-1.5 ${
            activeTab === 'login'
              ? 'bg-[#0077C8] text-white shadow-xs'
              : 'text-[#5B6B80] hover:text-[#0F2138]'
          }`}
        >
          <LogIn className="w-3.5 h-3.5" /> Sign In
        </button>
        <button
          onClick={() => { setActiveTab('register'); setErrorMsg(null); setSuccessMsg(null) }}
          className={`flex-1 py-2 text-xs font-bold rounded-full transition flex items-center justify-center gap-1.5 ${
            activeTab === 'register'
              ? 'bg-[#0077C8] text-white shadow-xs'
              : 'text-[#5B6B80] hover:text-[#0F2138]'
          }`}
        >
          <UserPlus className="w-3.5 h-3.5" /> Register
        </button>
        <button
          onClick={() => { setActiveTab('track'); setErrorMsg(null); setSuccessMsg(null) }}
          className={`flex-1 py-2 text-xs font-bold rounded-full transition flex items-center justify-center gap-1.5 ${
            activeTab === 'track'
              ? 'bg-[#0077C8] text-white shadow-xs'
              : 'text-[#5B6B80] hover:text-[#0F2138]'
          }`}
        >
          <Search className="w-3.5 h-3.5" /> Track Order
        </button>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl text-center font-medium">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-2xl text-center font-medium">
          {successMsg}
        </div>
      )}

      {/* Card Content */}
      <div className="liquid-glass-card bg-white border border-black/[0.08] rounded-[32px] p-6 sm:p-8 shadow-xs">
        {/* 1. SIGN IN TAB */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#0F2138] uppercase tracking-wider mb-1.5">
                Phone Number or Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="01318043562 or email@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 text-sm bg-[#F3F7FB] border border-black/[0.08] rounded-full focus:bg-white focus:outline-none focus:border-[#0077C8] focus:shadow-[0_0_0_3px_rgba(0,113,227,0.16)] font-medium text-[#0F2138] transition"
                  required
                />
                <User className="w-4 h-4 text-[#86868b] absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#0F2138] uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => { setActiveTab('forgot'); setErrorMsg(null); setSuccessMsg(null) }}
                  className="text-xs text-[#0077C8] hover:underline font-semibold"
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
                  className="w-full pl-4 pr-10 py-3 text-sm bg-[#F3F7FB] border border-black/[0.08] rounded-full focus:bg-white focus:outline-none focus:border-[#0077C8] focus:shadow-[0_0_0_3px_rgba(0,113,227,0.16)] text-[#0F2138] transition"
                  required
                />
                <Lock className="w-4 h-4 text-[#86868b] absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-[#0077C8] hover:bg-[#0066AD] text-white font-bold text-xs rounded-full transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-md shadow-[#0077C8]/20"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className="text-xs text-[#0077C8] hover:underline font-semibold"
              >
                Don&apos;t have an account? Register now →
              </button>
            </div>
          </form>
        )}

        {/* 2. REGISTER TAB */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#0F2138] uppercase tracking-wider mb-1.5">
                Your Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Tanvir Hasan"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-[#F3F7FB] border border-black/[0.08] rounded-full focus:bg-white focus:outline-none focus:border-[#0077C8] focus:shadow-[0_0_0_3px_rgba(0,113,227,0.16)] text-[#0F2138] transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F2138] uppercase tracking-wider mb-1.5">
                Phone Number (Bangladesh)
              </label>
              <input
                type="tel"
                placeholder="01318043562"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-[#F3F7FB] border border-black/[0.08] rounded-full focus:bg-white focus:outline-none focus:border-[#0077C8] focus:shadow-[0_0_0_3px_rgba(0,113,227,0.16)] font-medium text-[#0F2138] transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F2138] uppercase tracking-wider mb-1.5">
                Email Address <span className="text-[#86868b] font-normal lowercase">(optional)</span>
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-[#F3F7FB] border border-black/[0.08] rounded-full focus:bg-white focus:outline-none focus:border-[#0077C8] focus:shadow-[0_0_0_3px_rgba(0,113,227,0.16)] text-[#0F2138] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F2138] uppercase tracking-wider mb-1.5">
                Create Password
              </label>
              <input
                type="password"
                placeholder="Minimum 6 characters"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-[#F3F7FB] border border-black/[0.08] rounded-full focus:bg-white focus:outline-none focus:border-[#0077C8] focus:shadow-[0_0_0_3px_rgba(0,113,227,0.16)] text-[#0F2138] transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-[#0077C8] hover:bg-[#0066AD] text-white font-bold text-xs rounded-full transition flex items-center justify-center gap-2 shadow-md shadow-[#0077C8]/20 disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Create Customer Account <ArrowRight className="w-4 h-4" /></>}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="text-xs text-[#0077C8] hover:underline font-semibold"
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
              <label className="block text-xs font-bold text-[#0F2138] uppercase tracking-wider mb-1.5">
                Phone Number or Order Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. 01318043562 or ATD-2026-XXXX"
                  value={trackPhone}
                  onChange={(e) => setTrackPhone(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 text-sm bg-[#F3F7FB] border border-black/[0.08] rounded-full focus:bg-white focus:outline-none focus:border-[#0077C8] focus:shadow-[0_0_0_3px_rgba(0,113,227,0.16)] font-medium text-[#0F2138] transition"
                  required
                />
                <Package className="w-4 h-4 text-[#86868b] absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[11px] text-[#86868b] mt-1.5">
                Track your parcel delivery without signing in.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#0077C8] hover:bg-[#0066AD] text-white font-bold text-xs rounded-full transition flex items-center justify-center gap-2 shadow-md shadow-[#0077C8]/20"
            >
              Track My Parcel <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* 4. FORGOT PASSWORD TAB - 2-STEP DIRECT RESET */}
        {activeTab === 'forgot' && (
          <div className="space-y-5 animate-fade-in">
            <div className="text-center space-y-1">
              <h2 className="text-base font-bold text-[#0F2138]">
                {forgotStep === 1 ? 'Find Your Account' : 'Verify and Set New Password'}
              </h2>
              <p className="text-xs text-[#5B6B80]">
                {forgotStep === 1
                  ? 'Enter your registered phone number or email. We will send a verification code.'
                  : 'Enter the 6-digit code we sent you and choose a new password.'}
              </p>
            </div>

            {forgotStep === 1 ? (
              <form onSubmit={handleForgotCheck} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#0F2138] uppercase tracking-wider mb-1.5">
                    Phone Number or Email
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. 01318043562 or email@example.com"
                      value={forgotIdentifier}
                      onChange={(e) => setForgotIdentifier(e.target.value)}
                      className="w-full pl-4 pr-10 py-3 text-sm bg-[#F3F7FB] border border-black/[0.08] rounded-full focus:bg-white focus:outline-none focus:border-[#0077C8] focus:shadow-[0_0_0_3px_rgba(0,113,227,0.16)] font-medium text-[#0F2138] transition"
                      required
                    />
                    <Mail className="w-4 h-4 text-[#86868b] absolute right-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-[#0077C8] hover:bg-[#0066AD] text-white font-bold text-xs rounded-full transition flex items-center justify-center gap-2 shadow-md shadow-[#0077C8]/20 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Verify Account &amp; Continue <ArrowRight className="w-4 h-4" /></>}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => { setActiveTab('login'); setErrorMsg(null); setSuccessMsg(null) }}
                    className="text-xs text-[#5B6B80] hover:text-[#0F2138] font-semibold"
                  >
                    ← Back to Sign In
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleForgotReset} className="space-y-4">
                <div className="p-3 bg-sky-50 border border-sky-100 rounded-2xl text-xs text-[#0077C8] font-medium flex items-center gap-2">
                  <span>👤</span>
                  <span>Resetting password for: <strong>{forgotIdentifier}</strong></span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F2138] uppercase tracking-wider mb-1.5">
                    Verification Code *
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    placeholder="6-digit code"
                    value={forgotCode}
                    onChange={(e) => setForgotCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-3 text-sm bg-[#F3F7FB] border border-black/[0.08] rounded-full focus:bg-white focus:outline-none focus:border-[#0077C8] font-mono tracking-widest text-[#0F2138] transition"
                    required
                  />

                  {/* Immediate WhatsApp Help for OTP */}
                  <div className="mt-2.5 p-3.5 bg-amber-50/90 border border-amber-200/60 rounded-2xl text-xs text-amber-900 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-amber-950 text-[11px]">
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>Didn&apos;t receive an SMS code on your mobile?</span>
                    </div>
                    <p className="text-[10px] text-amber-800 leading-relaxed">
                      Carrier SMS delivery may be delayed. You can message our support on WhatsApp to receive your code or have your password reset instantly:
                    </p>
                    <a
                      href={`https://wa.me/8801318043562?text=${encodeURIComponent(
                        `Hello Atmodesk, I need a password reset code for my account (${forgotIdentifier}).`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800 hover:underline pt-0.5 text-[11px]"
                    >
                      <MessageCircle className="w-3 h-3" />
                      Get Reset Code via WhatsApp (+880 1318-043562) &rarr;
                    </a>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F2138] uppercase tracking-wider mb-1.5">
                    New Password *
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="At least 8 characters"
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      className="w-full pl-4 pr-10 py-3 text-sm bg-[#F3F7FB] border border-black/[0.08] rounded-full focus:bg-white focus:outline-none focus:border-[#0077C8] font-medium text-[#0F2138] transition"
                      required
                    />
                    <Lock className="w-4 h-4 text-[#86868b] absolute right-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F2138] uppercase tracking-wider mb-1.5">
                    Confirm New Password *
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Retype your new password"
                      value={forgotConfirmPassword}
                      onChange={(e) => setForgotConfirmPassword(e.target.value)}
                      className="w-full pl-4 pr-10 py-3 text-sm bg-[#F3F7FB] border border-black/[0.08] rounded-full focus:bg-white focus:outline-none focus:border-[#0077C8] font-medium text-[#0F2138] transition"
                      required
                    />
                    <Lock className="w-4 h-4 text-[#86868b] absolute right-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-full transition flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Save New Password &amp; Sign In <ArrowRight className="w-4 h-4" /></>}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => { setForgotStep(1); setErrorMsg(null); setSuccessMsg(null) }}
                    className="text-xs text-[#5B6B80] hover:text-[#0F2138] font-semibold"
                  >
                    ← Back to Step 1
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
