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
  MessageCircle,
  Clock,
  Sparkles,
  Camera,
} from 'lucide-react'
import { DarkModeToggle } from '@/components/shared/DarkModeToggle'

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
    { name: 'Smart Clocks', slug: 'smart-clocks', icon: '⏰', available: true },
    { name: 'Weather Stations', slug: 'weather-stations', icon: '⛅', available: true },
    { name: 'Ambient Lights', slug: 'ambient-lights', icon: '💡', available: false },
    { name: 'Desk Tech', slug: 'desk-tech', icon: '⚡', available: false },
    { name: 'Power & Chargers', slug: 'power-chargers', icon: '🔋', available: false },
  ]

  return (
    <>
      {/* Top Notification Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 text-center font-medium border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden md:flex items-center gap-4 text-slate-400">
            <a
              href="https://wa.me/8801318043562"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition font-medium"
              title="Text us on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp Text: 01318043562
            </a>
            <span>·</span>
            <span className="flex items-center gap-1 text-[11px] text-sky-400 font-mono">
              <Clock className="w-3 h-3 text-sky-400" /> Dhaka (BST UTC+6)
            </span>
          </div>
          <div className="mx-auto md:mx-0 flex items-center gap-1.5 text-[11px] sm:text-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse flex-shrink-0" />
            <span className="truncate">
              Free delivery in Dhaka over <strong className="text-white">৳2,000</strong> · Cash on Delivery
            </span>
          </div>
          <div className="hidden md:flex items-center gap-3 text-slate-400">
            <Link href="/track-order" className="hover:text-white transition">
              Track Order
            </Link>
            <span>·</span>
            <a
              href="https://wa.me/8801318043562"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white text-emerald-400 flex items-center gap-1 transition"
            >
              <span>💬</span> WhatsApp Support
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ease-out glass-nav ${
          isScrolled
            ? 'shadow-md shadow-slate-900/5'
            : 'shadow-xs'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-18 md:h-20 gap-2 sm:gap-4">
            {/* Left: Mobile Menu Button + Logo */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 text-slate-700 hover:text-slate-900 rounded-xl hover:bg-white/60 active:scale-95 transition"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
                <div className="relative h-8 sm:h-10 md:h-12 w-auto flex items-center">
                  <img
                    src="/logo.jpg"
                    alt="ATMODESK"
                    className="h-7 sm:h-9 md:h-11 w-auto object-contain rounded-md"
                    onError={(e) => {
                      ;(e.target as HTMLElement).style.display = 'none'
                    }}
                  />
                  <div className="flex flex-col ml-1">
                    <span className="font-extrabold text-base sm:text-xl md:text-2xl tracking-tight text-slate-900 group-hover:text-sky-600 transition leading-none">
                      ATMODESK<span className="text-sky-600">.bd</span>
                    </span>
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-500 font-semibold mt-0.5 hidden sm:block">
                      Smart Desk Tech
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-6 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search smart clocks, weather stations, desk gadgets..."
                className="w-full pl-11 pr-28 py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-sky-500 rounded-full text-sm text-slate-900 placeholder:text-slate-400 outline-none transition shadow-xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <Link
                  href="/search"
                  className="p-1.5 text-slate-400 hover:text-sky-600 rounded-full hover:bg-slate-100 transition"
                  title="Search by Image"
                >
                  <Camera className="w-4 h-4" />
                </Link>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-full transition shadow-xs"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search Button for Mobile */}
              <Link
                href="/search"
                className="md:hidden p-2 text-slate-700 hover:text-sky-600 rounded-full hover:bg-white/60 active:scale-95 transition"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </Link>

              {/* Wishlist - Desktop only, mobile has it in BottomNav */}
              <Link
                href="/wishlist"
                className="hidden sm:flex relative p-2 text-slate-700 hover:text-sky-600 rounded-full hover:bg-slate-100 transition items-center"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Account - Desktop only, mobile has it in BottomNav */}
              <Link
                href="/account"
                className="hidden sm:flex p-2 text-slate-700 hover:text-sky-600 rounded-full hover:bg-slate-100 transition items-center gap-1.5"
                title="Account"
              >
                <User className="w-5 h-5" />
                <span className="text-sm font-medium hidden lg:inline">Account</span>
              </Link>

              {/* Dark Mode Toggle - Desktop only, mobile in drawer */}
              <div className="hidden sm:block">
                <DarkModeToggle />
              </div>

              {/* Cart Button */}
              <button
                onClick={toggleCart}
                className="relative flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-full text-xs sm:text-sm font-semibold transition shadow-sm shadow-sky-600/20 active:scale-95"
                aria-label="Shopping Cart"
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
              <div className="absolute top-full left-0 mt-1 w-60 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 hidden group-hover:block z-50 animate-fade-in">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={c.available ? `/products?category=${c.slug}` : `/products`}
                    className="flex items-center justify-between px-3 py-2 text-slate-700 hover:bg-sky-50 hover:text-sky-600 rounded-xl text-sm transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <span>{c.icon}</span>
                      <span>{c.name}</span>
                    </div>
                    {c.available ? (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">In Stock</span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Soon</span>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {categories.filter((c) => c.available).map((c) => (
              <Link
                key={c.slug}
                href={`/products?category=${c.slug}`}
                className="hover:text-sky-600 transition font-medium"
              >
                {c.name}
              </Link>
            ))}

            <Link href="/products" className="hover:text-sky-600 transition font-medium">
              All Products
            </Link>

            <Link href="/track-order" className="hover:text-sky-600 transition font-medium text-slate-500">
              Track Order
            </Link>

            <Link href="/products" className="text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1 ml-auto">
              🔥 Hot Deals
            </Link>
          </nav>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-bright border-b border-white/80 p-4 space-y-4 shadow-2xl animate-slide-down">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search smart clocks, weather tech..."
                className="w-full pl-10 pr-4 py-2.5 bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </form>

            <div className="space-y-1.5">
              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider px-2 py-0.5">
                Popular Categories
              </p>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={c.available ? `/products?category=${c.slug}` : `/products`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2.5 bg-white/70 hover:bg-white rounded-xl text-xs font-semibold text-slate-700 hover:text-sky-600 border border-slate-200/60 shadow-2xs active:scale-95 transition"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-base">{c.icon}</span>
                      <span className="truncate">{c.name}</span>
                    </div>
                    {c.available ? (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" title="In Stock" />
                    ) : (
                      <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded">Soon</span>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 space-y-1">
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 mb-2 bg-sky-50 text-sky-800 rounded-xl font-bold text-sm border border-sky-100 shadow-xs"
              >
                <User className="w-4 h-4 text-sky-600" />
                <span>Sign In / My Account</span>
              </Link>
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
                href="/faq"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-slate-700 font-medium"
              >
                FAQ / Help Center
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-slate-700 font-medium"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-slate-700 font-medium"
              >
                Contact Us
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
