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
import { formatBDT } from '@/lib/utils'
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
  Camera,
  CloudSun,
  Lightbulb,
  Cpu,
  BatteryCharging,
  Flame,
  SlidersHorizontal,
  Zap,
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
  const cartSubtotal = useCart((s) => s.subtotal())
  const toggleCart = useCart((s) => s.toggleCart)
  const wishlistCount = useWishlist((s) => s.items.length)

  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchSuggestions, setSearchSuggestions] = useState<{ id: string; name: string; slug: string; price: number }[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const catDropdownRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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
        setShowSuggestions(false)
      }
    }
    const onClickOutside = (e: MouseEvent) => {
      if (catDropdownRef.current && !catDropdownRef.current.contains(e.target as Node)) {
        setCategoryMenuOpen(false)
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
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
      setShowSuggestions(false)
      router.push(`/search?q=${encodeURIComponent(q)}`)
    }
  }

  const handleSearchChange = (val: string) => {
    setSearchQuery(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (val.trim().length < 2) { setSearchSuggestions([]); setShowSuggestions(false); return }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(val.trim())}&limit=5`)
        if (!res.ok) return
        const data = await res.json()
        const hits = (data.products ?? []).map((p: any) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: p.salePrice ?? p.price,
        }))
        setSearchSuggestions(hits.slice(0, 5))
        setShowSuggestions(hits.length > 0)
      } catch {}
    }, 300)
  }

  const iconBtn =
    'relative hidden sm:flex items-center justify-center h-10 min-w-10 px-2.5 rounded-full text-[#0F2138] hover:text-[#0077C8] hover:bg-black/[0.04] transition'

  return (
    <>
      {/* Scrolling Marquee Announcement Strip */}
      <div className="bg-[#0F2138] text-white text-xs py-2 px-4 overflow-hidden relative">
        <div className="animate-marquee whitespace-nowrap inline-block">
          {[
            '🚀 Free delivery inside Dhaka over ৳2,000',
            '💳 Cash on Delivery nationwide — no prepayment needed',
            '🔄 7-Day Replacement Guarantee on all products',
            '📦 24-48h Dhaka dispatch · 3-5 days nationwide',
            '💬 WhatsApp support: 01318043562 (text only)',
            '✅ 100% authentic — OEM-sourced desk tech',
          ].map((msg, i) => (
            <span key={i} className="mx-8">{msg}</span>
          ))}
          {/* Duplicate for seamless loop */}
          {[
            '🚀 Free delivery inside Dhaka over ৳2,000',
            '💳 Cash on Delivery nationwide — no prepayment needed',
            '🔄 7-Day Replacement Guarantee on all products',
            '📦 24-48h Dhaka dispatch · 3-5 days nationwide',
            '💬 WhatsApp support: 01318043562 (text only)',
            '✅ 100% authentic — OEM-sourced desk tech',
          ].map((msg, i) => (
            <span key={`d-${i}`} className="mx-8">{msg}</span>
          ))}
        </div>
      </div>

      {/* Sticky Bright White Liquid Glass Navbar */}
      <header className="sticky top-0 z-40 w-full glass-nav" data-scrolled={isScrolled}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div
            className={`flex items-center justify-between gap-2 sm:gap-4 transition-all duration-300 ${
              isScrolled ? 'h-14 md:h-[60px]' : 'h-14 md:h-[68px]'
            }`}
          >
            {/* Left: mobile menu button + logo */}
            <div className="flex items-center gap-1.5">
              <motion.button
                type="button"
                whileTap={{ scale: 0.92 }}
                transition={TACTILE_SPRING}
                onClick={() => setMobileMenuOpen((v) => !v)}
                className="md:hidden flex h-10 w-10 items-center justify-center rounded-full text-[#0F2138] hover:bg-black/5 transition"
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
                  className="h-7 sm:h-9 md:h-10 w-auto object-contain rounded-lg"
                />
                <span className="flex flex-col leading-none">
                  <span className="font-bold text-base sm:text-xl tracking-tight text-[#0F2138] group-hover:text-[#0077C8] transition">
                    ATMODESK<span className="text-[#0077C8]">.bd</span>
                  </span>
                  <span className="mt-0.5 hidden text-[10px] tracking-wide text-[#5B6B80] sm:block">
                    Smart desk tech
                  </span>
                </span>
              </Link>
            </div>

            {/* Desktop Search with Autocomplete */}
            <div ref={searchRef} className="hidden md:flex flex-1 max-w-lg mx-6 relative">
              <form onSubmit={handleSearch} role="search" className="w-full relative">
                <label htmlFor="nav-search" className="sr-only">Search products</label>
                <input
                  id="nav-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => searchSuggestions.length > 0 && setShowSuggestions(true)}
                  placeholder="Search smart clocks, weather stations, desk gadgets"
                  autoComplete="off"
                  className="w-full h-10 pl-11 pr-32 rounded-full text-sm text-[#0F2138] placeholder:text-[#86868b] outline-none transition-all duration-200 bg-[#F3F7FB] border border-black/[0.06] hover:bg-[#efeff2] focus:bg-white focus:border-[#0077C8] focus:shadow-[0_0_0_3px_rgba(0,113,227,0.16)]"
                />
                <Search className="w-4 h-4 text-[#86868b] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <Link href="/search" className="flex h-8 w-8 items-center justify-center rounded-full text-[#5B6B80] hover:text-[#0077C8] hover:bg-black/5 transition" title="Search by image" aria-label="Search by image">
                    <Camera className="w-4 h-4" />
                  </Link>
                  <motion.button whileTap={{ scale: 0.96 }} transition={TACTILE_SPRING} type="submit" className="lg-btn-primary h-8 px-4 rounded-full text-xs font-semibold">
                    Search
                  </motion.button>
                </div>
              </form>
              {/* Autocomplete Dropdown */}
              <AnimatePresence>
                {showSuggestions && searchSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.97 }}
                    transition={MORPH_SPRING}
                    className="absolute top-full left-0 right-0 mt-2 z-50 glass-bright rounded-2xl shadow-lg border border-black/[0.06] overflow-hidden"
                  >
                    {searchSuggestions.map((s) => (
                      <Link
                        key={s.id}
                        href={`/product/${s.slug}`}
                        onClick={() => { setShowSuggestions(false); setSearchQuery('') }}
                        className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm hover:bg-[#0077C8]/[0.06] transition group"
                      >
                        <span className="flex items-center gap-2 text-[#0F2138] font-medium truncate">
                          <Search className="w-3.5 h-3.5 text-[#86868b] flex-shrink-0" />
                          {s.name}
                        </span>
                        <span className="text-xs font-bold text-[#0077C8] flex-shrink-0">৳{s.price?.toLocaleString()}</span>
                      </Link>
                    ))}
                    <div className="border-t border-black/[0.05] px-4 py-2">
                      <button onClick={() => { setShowSuggestions(false); router.push(`/search?q=${encodeURIComponent(searchQuery)}`) }} className="text-xs text-[#0077C8] font-semibold hover:underline">
                        See all results for &quot;{searchQuery}&quot; →
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-0.5 sm:gap-1.5">
              <Link
                href="/search"
                className="md:hidden flex h-10 w-10 items-center justify-center rounded-full text-[#0F2138] hover:bg-black/5 active:scale-95 transition"
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
                    className="absolute top-0.5 right-0 grid min-w-[18px] h-[18px] place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-white"
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
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                transition={TACTILE_SPRING}
                onClick={toggleCart}
                className="lg-btn-primary relative flex h-10 items-center gap-1.5 rounded-full px-3.5 sm:px-4 text-xs sm:text-sm font-semibold"
                aria-label={`Open cart${mounted && cartCount ? `, ${cartCount} items` : ''}`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {mounted && cartCount > 0 ? formatBDT(cartSubtotal) : 'Cart'}
                </span>
                {mounted && cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0.4 }}
                    animate={{ scale: 1 }}
                    transition={TACTILE_SPRING}
                    className="grid min-w-[20px] h-5 place-items-center rounded-full bg-white px-1.5 text-[11px] font-bold text-[#0077C8]"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </motion.button>
            </div>
          </div>

          {/* Desktop Category Navigation with Morphing Frosted Dropdown */}
          <nav
            aria-label="Categories"
            className="hidden md:flex items-center gap-6 py-2 border-t border-black/[0.05] text-sm font-medium text-[#5B6B80]"
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
                className="flex items-center gap-1.5 py-1 font-semibold text-[#0F2138] hover:text-[#0077C8] transition"
              >
                All categories
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    categoryMenuOpen ? 'rotate-180 text-[#0077C8]' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {categoryMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.94, y: -6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: -4 }}
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
                          className="flex items-center justify-between gap-3 rounded-2xl px-2.5 py-2 text-[#0F2138] transition hover:bg-[#0077C8]/[0.06]"
                        >
                          <span className="flex items-center gap-3">
                            <LiquidIcon icon={c.icon} tone={c.tone} size="sm" />
                            <span className="text-sm font-medium">{c.name}</span>
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              c.available
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-amber-50 text-amber-700'
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
              <Link key={c.slug} href={`/products?category=${c.slug}`} className="hover:text-[#0F2138] transition">
                {c.name}
              </Link>
            ))}
            <Link href="/products" className="hover:text-[#0F2138] transition">
              All products
            </Link>
            <a
              href="#desk-builder"
              className="inline-flex items-center gap-1.5 font-bold text-xs text-[#0077C8] bg-[#0077C8]/10 hover:bg-[#0077C8]/15 px-3 py-1 rounded-full border border-[#0077C8]/20 transition"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Desk Setup Studio</span>
            </a>
            <Link href="/track-order" className="hover:text-[#0F2138] transition">
              Track order
            </Link>
            <a
              href="#flash-deals-heading"
              className="ml-auto flex items-center gap-1.5 font-bold text-xs text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1 rounded-full border border-rose-200/50 transition"
            >
              <Flame className="w-3.5 h-3.5 animate-pulse text-rose-500" /> Flash Deals
            </a>
          </nav>
        </div>

        {/* Mobile Glass Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={MORPH_SPRING}
              className="md:hidden glass-bright border-t border-black/[0.06] overflow-hidden"
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
                    className="w-full h-11 rounded-2xl bg-[#F3F7FB] border border-black/[0.08] text-[#0F2138] placeholder:text-[#86868b] pl-10 pr-4 text-base outline-none focus:bg-white focus:border-[#0077C8]"
                  />
                  <Search className="w-4 h-4 text-[#86868b] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </form>

                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((c) => (
                    <Link
                      key={c.slug}
                      href={c.available ? `/products?category=${c.slug}` : '/products'}
                      className="flex items-center gap-2.5 rounded-2xl bg-[#F3F7FB] p-2 text-xs font-semibold text-[#0F2138] active:scale-95 transition"
                    >
                      <LiquidIcon icon={c.icon} tone={c.tone} size="sm" />
                      <span className="flex-1 truncate">{c.name}</span>
                      {!c.available && (
                        <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-800">
                          Soon
                        </span>
                      )}
                    </Link>
                  ))}
                </div>

                <div className="border-t border-black/[0.06] pt-3 text-[15px] font-medium text-[#0F2138] space-y-1">
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
                    <Link key={href} href={href} className="block rounded-xl px-3 py-2.5 hover:bg-black/[0.04]">
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
