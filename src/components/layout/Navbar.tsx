'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/store/cart'
import { useWishlist } from '@/store/wishlist'
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  PhoneCall,
  Clock,
  Sparkles,
} from 'lucide-react'

export function Navbar() {
  const router = useRouter()
  const { itemCount, toggleCart } = useCart()
  const { items: wishlistItems } = useWishlist()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoriesOpen, setCategoriesOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const categories = [
    { name: 'Smart Clocks', slug: 'smart-clocks', icon: '⏰' },
    { name: 'Weather Stations', slug: 'weather-stations', icon: '⛅' },
    { name: 'Ambient Lights', slug: 'ambient-lights', icon: '💡' },
    { name: 'Desk Tech', slug: 'desk-tech', icon: '⚡' },
    { name: 'Electronics', slug: 'electronics', icon: '🔌' },
  ]

  return (
    <>
      {/* Top Notification Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 text-center font-medium border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden md:flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1">
              <PhoneCall className="w-3 h-3 text-sky-400" /> +880 1712-345678
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" /> 10:00 AM - 9:00 PM (Sat-Thu)
            </span>
          </div>
          <div className="mx-auto md:mx-0 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>
              Free delivery in Dhaka over <strong className="text-white">৳2,000</strong> · Cash on Delivery all over Bangladesh
            </span>
          </div>
          <div className="hidden md:flex items-center gap-3 text-slate-400">
            <Link href="/track-order" className="hover:text-white transition">
              Track Order
            </Link>
            <span>·</span>
            <Link href="/admin" className="hover:text-white transition">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200' : 'bg-white border-b border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 md:h-20 gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
              <div className="relative h-10 md:h-12 w-auto flex items-center">
                <img
                  src="/logo.jpg"
                  alt="ATMODESK"
                  className="h-10 md:h-12 w-auto object-contain rounded-md"
                  onError={(e) => {
                    // Fallback logo if image fails
                    ;(e.target as HTMLElement).style.display = 'none'
                  }}
                />
                <div className="flex flex-col ml-1">
                  <span className="font-extrabold text-xl md:text-2xl tracking-tight text-slate-900 group-hover:text-sky-600 transition">
                    ATMODESK<span className="text-sky-600">.bd</span>
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold -mt-1 hidden sm:block">
                    Smart Desk Tech
                  </span>
                </div>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-6 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search smart clocks, weather stations, desk gadgets..."
                className="w-full pl-11 pr-24 py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-sky-500 rounded-full text-sm text-slate-900 placeholder:text-slate-400 outline-none transition shadow-xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-full transition shadow-xs"
              >
                Search
              </button>
            </form>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              {/* Search Toggle for Mobile */}
              <Link
                href="/search"
                className="md:hidden p-2 text-slate-700 hover:text-sky-600 rounded-full hover:bg-slate-100 transition"
              >
                <Search className="w-5 h-5" />
              </Link>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-2 text-slate-700 hover:text-sky-600 rounded-full hover:bg-slate-100 transition flex items-center"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Account */}
              <Link
                href="/account"
                className="p-2 text-slate-700 hover:text-sky-600 rounded-full hover:bg-slate-100 transition flex items-center gap-1.5"
                title="Account"
              >
                <User className="w-5 h-5" />
                <span className="text-sm font-medium hidden lg:inline">Account</span>
              </Link>

              {/* Cart Button */}
              <button
                onClick={toggleCart}
                className="relative flex items-center gap-2 px-3 sm:px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-full text-sm font-semibold transition shadow-sm shadow-sky-600/20"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
                <span className="bg-white text-sky-700 text-xs px-1.5 py-0.2 rounded-full font-bold">
                  {itemCount()}
                </span>
              </button>
            </div>
          </div>

          {/* Categories Horizontal Navigation */}
          <nav className="hidden md:flex items-center gap-8 py-2.5 border-t border-slate-100 text-sm font-medium text-slate-600">
            <div className="relative group">
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="flex items-center gap-1.5 text-slate-900 font-semibold hover:text-sky-600 transition py-1"
              >
                All Categories <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 hidden group-hover:block z-50 animate-fade-in">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/products?category=${c.slug}`}
                    className="flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-sky-50 hover:text-sky-600 rounded-xl text-sm transition"
                  >
                    <span>{c.icon}</span>
                    <span>{c.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/products?category=${c.slug}`}
                className="hover:text-sky-600 transition"
              >
                {c.name}
              </Link>
            ))}

            <Link href="/products" className="text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1 ml-auto">
              🔥 Hot Deals
            </Link>
          </nav>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-4 shadow-lg animate-fade-in">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </form>

            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
                Categories
              </p>
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/products?category=${c.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-slate-700 hover:bg-sky-50 rounded-xl font-medium"
                >
                  <span className="text-base">{c.icon}</span>
                  <span>{c.name}</span>
                </Link>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-3 space-y-1">
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-slate-700 font-medium"
              >
                All Products
              </Link>
              <Link
                href="/track-order"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-slate-700 font-medium"
              >
                Track Order
              </Link>
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-slate-700 font-medium"
              >
                My Account
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
