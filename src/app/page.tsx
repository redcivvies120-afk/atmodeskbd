import React from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/product/ProductCard'
import { formatBDT } from '@/lib/utils'
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Zap,
  TrendingUp,
  Clock,
  Layers,
  Star,
  CheckCircle2,
} from 'lucide-react'

// Force dynamic rendering on every request so admin updates appear instantly
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function HomePage() {
  let categories: any[] = [
    { id: '1', name: 'Smart Clocks', slug: 'smart-clocks' },
    { id: '2', name: 'Weather Stations', slug: 'weather-stations' },
    { id: '3', name: 'Audio & Earbuds', slug: 'audio' },
    { id: '4', name: 'Desk Tech & Hubs', slug: 'desk-tech' },
    { id: '5', name: 'Ambient Lights', slug: 'ambient-lights' },
  ]
  let featuredProducts: any[] = []
  let bestSellers: any[] = []
  let newArrivals: any[] = []
  let discountProducts: any[] = []

  try {
    const [c, f, b, n, d] = await Promise.all([
      prisma.category.findMany({
        where: { isActive: true },
        take: 6,
        orderBy: { sortOrder: 'asc' },
      }),
      prisma.product.findMany({
        where: { isActive: true, isFeatured: true },
        include: { images: true, category: true },
        take: 4,
      }),
      prisma.product.findMany({
        where: { isActive: true, isBestSeller: true },
        include: { images: true, category: true },
        take: 4,
      }),
      prisma.product.findMany({
        where: { isActive: true, isNewArrival: true },
        include: { images: true, category: true },
        take: 4,
      }),
      prisma.product.findMany({
        where: { isActive: true, discount: { gt: 0 } },
        include: { images: true, category: true },
        take: 4,
        orderBy: { discount: 'desc' },
      }),
    ])

    if (c.length > 0) categories = c
    featuredProducts = f
    bestSellers = b
    newArrivals = n
    discountProducts = d
  } catch (err) {
    console.error('Prisma query fallback:', err)
  }

  return (
    <div className="space-y-16 pb-16">
      {/* ─── 1. HERO SECTION ───────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white pt-12 pb-20 md:py-24">
        {/* Glow ambient backdrops */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-sky-400 text-xs font-semibold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Desk Aesthetic in Bangladesh</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Smart Clocks. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-amber-300">
                  Ambient Weather.
                </span>{' '}
                <br />
                Your Desk, Alive.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Upgrade your workspace with mini pixel smart clocks, WiFi weather displays, and ambient LED gadgets. Curated from top global factories with Cash on Delivery nationwide.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/products"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2"
                >
                  Shop Now <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/products?category=smart-clocks"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm transition backdrop-blur-md text-center"
                >
                  Explore Clocks
                </Link>
              </div>

              {/* Trust Badges in Hero */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 text-xs text-slate-300">
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Cash on Delivery</span>
                </div>
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <Truck className="w-4 h-4 text-sky-400" />
                  <span>24-48h Dhaka Delivery</span>
                </div>
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Official Warranty</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Mockup Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-2xl backdrop-blur-xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500" />
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-xs font-mono text-slate-400">ATMODESK CLOCK OS</span>
                </div>

                {/* Clock Face Mockup */}
                <div className="bg-slate-950 rounded-2xl p-6 text-center border border-slate-800 space-y-3 relative overflow-hidden">
                  <div className="absolute top-2 right-3 flex items-center gap-1 text-[10px] text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    WiFi Connected
                  </div>
                  <div className="text-5xl sm:text-6xl font-mono font-bold tracking-widest text-sky-400">
                    12:45
                  </div>
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-widest">
                    Wednesday · Dhaka, BD
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px]">TEMP</span>
                      <strong className="text-amber-400 text-sm">28°C</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">HUMIDITY</span>
                      <strong className="text-teal-400 text-sm">65%</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">AIR (AQI)</span>
                      <strong className="text-emerald-400 text-sm">48 Good</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-300 bg-white/5 p-3 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-sky-400" />
                    <span>Featured: <strong>Pixel Weather Clock Pro</strong></span>
                  </div>
                  <span className="text-emerald-400 font-bold">{formatBDT(2999)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. CATEGORIES GRID ─────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Explore Collections</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/products"
            className="text-sm font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
          >
            All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/products?category=${c.slug}`}
              className="group p-5 bg-white border border-slate-200/80 hover:border-sky-500 rounded-2xl transition-all shadow-xs hover:shadow-md flex flex-col items-center text-center space-y-2"
            >
              <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:bg-sky-600 group-hover:text-white transition duration-300">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-sky-600 transition">
                {c.name}
              </h3>
              <span className="text-xs text-slate-400">View Products →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── 3. FEATURED PRODUCTS ──────────────────────────────── */}
      {featuredProducts.length > 0 ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Handpicked Quality</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Featured Desk Gadgets
              </h2>
            </div>
            <Link
              href="/products"
              className="text-sm font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        </section>
      ) : (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center space-y-4 shadow-xs">
            <span className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto text-2xl">
              <Sparkles className="w-7 h-7" />
            </span>
            <h3 className="text-xl font-bold text-slate-900">New Products Coming Soon!</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              We&apos;re curating the best smart clocks, weather stations, and desk gadgets for you. Stay tuned for exciting new arrivals!
            </p>
            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-xl transition shadow-xs"
              >
                Browse Store <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── 4. PROMOTIONAL BANNER ─────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-700 p-8 sm:p-12 text-white shadow-xl">
          <div className="max-w-2xl space-y-4">
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider">
              Limited Time Bangladesh Launch
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold leading-tight">
              Get 10% Flat Off on Your First Order
            </h3>
            <p className="text-sky-100 text-sm sm:text-base leading-relaxed">
              Use voucher code <strong className="bg-white text-slate-900 px-2 py-0.5 rounded font-mono font-bold">WELCOME10</strong> at checkout. Plus enjoy free delivery inside Dhaka on orders over ৳2,000!
            </p>
            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-100 transition shadow-md"
              >
                Claim Discount <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. BEST SELLERS (if products exist) ───────────────── */}
      {bestSellers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Customer Favorites
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Best Selling Tech
              </h2>
            </div>
            <Link
              href="/products"
              className="text-sm font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              See More <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        </section>
      )}

      {/* ─── 6. NEW ARRIVALS (if products exist) ───────────────── */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Fresh Drops</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                New Arrivals This Week
              </h2>
            </div>
            <Link
              href="/products"
              className="text-sm font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              Browse All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        </section>
      )}

      {/* ─── 7. CUSTOMER REVIEWS ───────────────────────────────── */}
      <section className="bg-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">What Bangladesh is Saying</span>
            <h2 className="text-3xl font-extrabold text-slate-900">Loved by Tech Enthusiasts</h2>
            <p className="text-slate-600 text-sm">Real reviews from our verified customers in Dhaka, Chittagong, and Sylhet.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-700 italic">
                "The Pixel Weather Clock Pro is insane! Connects to my home WiFi easily and shows accurate Dhaka temperature and AQI. Everyone on my Zoom calls asks about it."
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">Tanvir Hasan</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified (Gulshan, Dhaka)
                </span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-700 italic">
                "Ordered via Cash on Delivery to Chittagong. Arrived in 3 days in solid bubble wrap packaging. The Retro Flip Clock looks super aesthetic on my walnut desk."
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">Mahmudul Karim</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified (Chittagong)
                </span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-700 italic">
                "Great customer support on WhatsApp. They guided me through the 2.4GHz WiFi setup in 2 minutes. 10/10 store!"
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">Farzana Rahman</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified (Uttara, Dhaka)
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 8. NEWSLETTER ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-4 border border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-400">Join the Community</span>
          <h3 className="text-2xl sm:text-3xl font-extrabold">Stay Updated on New Desk Drops</h3>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Subscribe to our newsletter for exclusive discounts, new Chinese factory drops, and desk setup inspiration.
          </p>
          <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-sky-500"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm rounded-xl transition"
            >
              Subscribe
            </button>
          </form>
          <p className="text-[11px] text-slate-500">No spam. Unsubscribe at any time.</p>
        </div>
      </section>
    </div>
  )
}
