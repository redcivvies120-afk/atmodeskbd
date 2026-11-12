// src/components/layout/Navbar.tsx
'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import { useCart } from '@/store/cart'
import { useWishlist } from '@/store/wishlist'
import { useMounted } from '@/lib/use-mounted'
import { MORPH_SPRING, TACTILE_SPRING } from '@/components/shared/LiquidMotion'
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
  CloudSun,
  Lightbulb,
  Cpu,
  BatteryCharging,
  Flame,
  type LucideIcon,
} from 'lucide-react'
import { LiquidIcon, type LiquidTone } from '@/components/shared/LiquidIcon'

const CATEGORIES: { name: string; slug: string; icon: LucideIcon; tone: LiquidTone; available: boolean }[] = [
  { name: 'Smart Clocks', slug: 'smart-clocks', icon: Clock, tone: 'sky', available: true },
  { name: 'Weather Stations', slug: 'weather-stations', icon: CloudSun, tone: 'indigo', available: true },
  { name: 'Ambient Lights', slug: 'ambient-lights', icon: Lightbulb, tone: 'violet', available: false },
  { name: 'Desk Tech', slug: 'desk-tech', icon: Cpu, tone: 'teal', available: false },
  { name: 'Power & Chargers', slug: 'power-chargers', icon: BatteryCharging, tone: 'green', available: false },
]

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const mounted = useMounted()
  const cartCount = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0))
  const toggleCart = useCart((s) => s.toggleCart)
  const wishlistCount = useWishlist((s) => s.items.length)

  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const catDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
    setCategoryMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false)
        setCategoryMenuOpen(false)
      }
    }
    const onClickOutside = (e: MouseEvent) => {
      if (catDropdownRef.current && !catDropdownRef.current.contains(e.target as Node)) {
        setCategoryMenuOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClickOutside)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClickOutside)
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = searchQuery.trim()
    if (q) {
      setMobileMenuOpen(false)
      router.push(`/search?q=${encodeURIComponent(q)}`)
    }
  }

  const iconBtn =
    'relative hidden sm:flex items-center justify-center h-10 min-w-10 px-2.5 rounded-full text-slate-300 hover:text-sky-300 hover:bg-white/[0.08] transition'

  return (
    <>
      {/* Top notification bar */}
      <div className="bg-[#04070f] text-slate-400 text-xs py-2 px-4 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden md:flex items-center gap-4">
            <a
              href="https://wa.me/8801318043562"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition"
              title="Text us on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp text: 01318043562
            </a>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-[11px] text-sky-400 tabular">
              <Clock className="w-3 h-3" /> Dhaka (BST UTC+6)
            </span>
          </div>
          <div className="mx-auto md:mx-0 flex items-center gap-1.5 text-[11px] sm:text-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span className="truncate">
              Free delivery in Dhaka over <strong className="text-white">৳2,000</strong> · Cash on Delivery
            </span>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link href="/track-order" className="hover:text-white transition">
              Track order
            </Link>
            <span aria-hidden="true">·</span>
            <a
              href="https://wa.me/8801318043562"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-white transition"
            >
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp support
            </a>
          </div>
        </div>
      </div>

      {/* Sticky Liquid Glass Navbar */}
      <header className="sticky top-0 z-40 w-full glass-nav" data-scrolled={isScrolled}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div
            className={`flex items-center justify-between gap-2 sm:gap-4 transition-all duration-300 ${
              isScrolled ? 'h-14 md:h-[60px]' : 'h-14 md:h-[68px]'
            }`}
          >
            {/* Left: mobile menu toggle + logo */}
            <div className="flex items-center gap-1.5">
              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                transition={TACTILE_SPRING}
                onClick={() => setMobileMenuOpen((v) => !v)}
                className="md:hidden flex h-10 w-10 items-center justify-center rounded-full text-slate-200 hover:bg-white/10 transition"
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.button>

              <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0" aria-label="ATMODESK.bd home">
                <Image
                  src="/logo.jpg"
                  alt=""
                  width={88}
                  height={44}
                  priority
                  className="h-7 sm:h-9 md:h-10 w-auto object-contain rounded-lg ring-1 ring-white/15"
                />
                <span className="flex flex-col leading-none">
                  <span className="font-bold text-base sm:text-xl tracking-tight text-white group-hover:text-sky-300 transition">
                    ATMODESK<span className="text-sky-400">.bd</span>
                  </span>
                  <span className="mt-0.5 hidden text-[10px] tracking-wide text-slate-400 sm:block">
                    Smart desk tech
                  </span>
                </span>
              </Link>
            </div>

            {/* Desktop Liquid Search */}
            <form
              onSubmit={handleSearch}
              role="search"
              className="hidden md:flex flex-1 max-w-lg mx-6 relative"
            >
              <label htmlFor="nav-search" className="sr-only">
                Search products
              </label>
              <input
                id="nav-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search smart clocks, weather stations, desk gadgets"
                className="w-full h-10 pl-11 pr-32 rounded-full text-sm text-white placeholder:text-slate-400 outline-none transition-all duration-300 bg-white/[0.06] border border-white/[0.1] hover:bg-white/[0.09] focus:bg-slate-900/90 focus:border-sky-400/60 focus:shadow-[0_0_0_3px_rgba(56,189,248,0.18)]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <Link
                  href="/search"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:text-sky-300 hover:bg-white/10 transition"
                  title="Search by image"
                  aria-label="Search by image"
                >
                  <Camera className="w-4 h-4" />
                </Link>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  transition={TACTILE_SPRING}
                  type="submit"
                  className="lg-btn-primary h-8 px-4 rounded-full text-xs font-semibold"
                >
                  Search
                </motion.button>
              </div>
            </form>

            {/* Right Actions */}
            <div className="flex items-center gap-0.5 sm:gap-1.5">
              <Link
                href="/search"
                className="md:hidden flex h-10 w-10 items-center justify-center rounded-full text-slate-200 hover:bg-white/10 active:scale-95 transition"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </Link>

              <Link
                href="/wishlist"
                className={iconBtn}
                aria-label={`Wishlist${mounted && wishlistCount ? `, ${wishlistCount} saved` : ''}`}
              >
                <Heart className="w-5 h-5" />
                {mounted && wishlistCount > 0 && (
                  <motion.span
                    key={wishlistCount}
                    initial={{ scale: 0.4 }}
                    animate={{ scale: 1 }}
                    transition={TACTILE_SPRING}
                    className="absolute top-0.5 right-0 grid min-w-[18px] h-[18px] place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-[#0a0e1a]"
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </Link>

              <Link href="/account" className={`${iconBtn} gap-1.5`} aria-label="Account">
                <User className="w-5 h-5" />
                <span className="text-sm font-medium hidden lg:inline">Account</span>
              </Link>

              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                transition={TACTILE_SPRING}
                onClick={toggleCart}
                className="lg-btn-primary relative flex h-10 items-center gap-1.5 rounded-full px-3.5 sm:px-4 text-xs sm:text-sm font-semibold"
                aria-label={`Open cart${mounted && cartCount ? `, ${cartCount} items` : ''}`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
                {mounted && cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0.4 }}
                    animate={{ scale: 1 }}
                    transition={TACTILE_SPRING}
                    className="grid min-w-[20px] h-5 place-items-center rounded-full bg-white px-1.5 text-[11px] font-bold text-sky-900"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </motion.button>
            </div>
          </div>

          {/* Desktop Category Navigation with Morphing Liquid Dropdown */}
          <nav
            aria-label="Categories"
            className="hidden md:flex items-center gap-8 py-2 border-t border-white/[0.06] text-sm font-medium text-slate-300"
          >
            <div
              ref={catDropdownRef}
              className="relative"
              onMouseEnter={() => setCategoryMenuOpen(true)}
              onMouseLeave={() => setCategoryMenuOpen(false)}
            >
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded={categoryMenuOpen}
                onClick={() => setCategoryMenuOpen((v) => !v)}
                className="flex items-center gap-1.5 py-1 font-semibold text-white hover:text-sky-300 transition"
              >
                All categories
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    categoryMenuOpen ? 'rotate-180 text-sky-400' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {categoryMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: -6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94, y: -4 }}
                    transition={MORPH_SPRING}
                    style={{ transformOrigin: 'top left' }}
                    className="absolute left-0 top-full z-50 pt-2"
                  >
                    <div className="w-76 rounded-3xl glass-bright p-2">
                      {CATEGORIES.map((c) => (
                        <Link
                          key={c.slug}
                          href={c.available ? `/products?category=${c.slug}` : '/products'}
                          onClick={() => setCategoryMenuOpen(false)}
                          className="flex items-center justify-between gap-3 rounded-2xl px-2.5 py-2 text-slate-100 transition hover:bg-white/[0.08]"
                        >
                          <span className="flex items-center gap-3">
                            <LiquidIcon icon={c.icon} tone={c.tone} size="sm" />
                            <span className="text-sm font-medium">{c.name}</span>
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              c.available
                                ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/25'
                                : 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/25'
                            }`}
                          >
                            {c.available ? 'In stock' : 'Soon'}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {CATEGORIES.filter((c) => c.available).map((c) => (
              <Link key={c.slug} href={`/products?category=${c.slug}`} className="hover:text-sky-300 transition">
                {c.name}
              </Link>
            ))}
            <Link href="/products" className="hover:text-sky-300 transition">
              All products
            </Link>
            <Link href="/track-order" className="text-slate-400 hover:text-sky-300 transition">
              Track order
            </Link>
            <Link
              href="/products"
              className="ml-auto flex items-center gap-1.5 font-semibold text-amber-300 hover:text-amber-200 transition"
            >
              <Flame className="w-4 h-4" /> Hot deals
            </Link>
          </nav>
        </div>

        {/* Mobile Morphing Glass Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={MORPH_SPRING}
              className="md:hidden glass-bright border-t border-white/10 overflow-hidden"
            >
              <div className="p-4 space-y-4 max-h-[calc(100dvh-7rem)] overflow-y-auto">
                <form onSubmit={handleSearch} role="search" className="relative">
                  <label htmlFor="nav-search-m" className="sr-only">
                    Search products
                  </label>
                  <input
                    id="nav-search-m"
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search smart clocks, weather tech"
                    className="w-full h-11 rounded-2xl bg-white/[0.07] border border-white/15 text-white placeholder:text-slate-400 pl-10 pr-4 text-base outline-none focus:border-sky-400"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </form>

                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((c) => (
                    <Link
                      key={c.slug}
                      href={c.available ? `/products?category=${c.slug}` : '/products'}
                      className="flex items-center gap-2.5 rounded-2xl bg-white/[0.06] p-2 text-xs font-semibold text-slate-100 ring-1 ring-white/10 active:scale-95 transition"
                    >
                      <LiquidIcon icon={c.icon} tone={c.tone} size="sm" />
                      <span className="flex-1 truncate">{c.name}</span>
                      {!c.available && (
                        <span className="rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-bold text-amber-300">
                          Soon
                        </span>
                      )}
                    </Link>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-3 text-[15px] font-medium text-slate-200 space-y-1">
                  <Link
                    href="/account"
                    className="lg-btn-primary mb-2 flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold"
                  >
                    <User className="w-4 h-4" /> Sign in / My account
                  </Link>
                  {[
                    ['/products', 'All products'],
                    ['/track-order', 'Track order'],
                    ['/faq', 'FAQ / Help center'],
                    ['/about', 'About us'],
                    ['/contact', 'Contact us'],
                  ].map(([href, label]) => (
                    <Link key={href} href={href} className="block rounded-xl px-3 py-2.5 hover:bg-white/[0.07]">
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
