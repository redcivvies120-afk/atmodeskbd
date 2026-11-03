import React from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/product/ProductCard'
import { formatBDT } from '@/lib/utils'
import { LiveDhakaClock } from '@/components/home/LiveDhakaClock'
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
  CloudSun,
  BatteryCharging,
  Package,
} from 'lucide-react'

function getCategoryTheme(slug: string, name: string) {
  const s = (slug + ' ' + name).toLowerCase()
  if (s.includes('clock')) {
    return {
      Icon: Clock,
      gradient: 'ios-icon-clock',
      glow: 'shadow-sky-500/30',
    }
  }
  if (s.includes('weather')) {
    return {
      Icon: CloudSun,
      gradient: 'ios-icon-weather',
      glow: 'shadow-blue-500/30',
    }
  }
  if (s.includes('ambient') || s.includes('light')) {
    return {
      Icon: Sparkles,
      gradient: 'ios-icon-ambient',
      glow: 'shadow-purple-500/30',
    }
  }
  if (s.includes('desk') || s.includes('tech') || s.includes('gadget')) {
    return {
      Icon: Zap,
      gradient: 'ios-icon-tech',
      glow: 'shadow-cyan-500/30',
    }
  }
  if (s.includes('power') || s.includes('charger')) {
    return {
      Icon: BatteryCharging,
      gradient: 'ios-icon-power',
      glow: 'shadow-emerald-500/30',
    }
  }
  return {
    Icon: Package,
    gradient: 'ios-icon-clock',
    glow: 'shadow-slate-500/20',
  }
}

// Edge ISR caching: revalidates every 60s without blocking users
export const revalidate = 60

export default async function HomePage() {
  let categories: any[] = []
  let allProducts: any[] = []

  try {
    const [c, p] = await Promise.all([
      prisma.category.findMany({
        where: { isActive: true },
        include: {
          _count: {
            select: { products: { where: { isActive: true } } },
          },
        },
        orderBy: { sortOrder: 'asc' },
      }),
      prisma.product.findMany({
        where: { isActive: true },
        include: { images: true, category: true },
        orderBy: [{ isFeatured: 'desc' }, { soldCount: 'desc' }, { createdAt: 'desc' }],
      }),
    ])

    categories = c
    allProducts = p
  } catch (err) {
    console.error('Prisma query fallback:', err)
  }

  return (
    <div className="space-y-10 sm:space-y-16 pb-12 sm:pb-16">
      {/* --- 1. HERO SECTION ------------------------------------- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white pt-8 pb-14 sm:pt-12 sm:pb-20 md:py-24">
        {/* Glow ambient backdrops */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-60 sm:w-80 h-60 sm:h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/10 border border-white/15 text-sky-400 text-[11px] sm:text-xs font-semibold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Desk Aesthetic in Bangladesh</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
                Smart Clocks. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-amber-300">
                  Ambient Weather.
                </span>{' '}
                <br />
                Your Desk, Alive.
              </h1>

              <p className="text-sm sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Elevate your desktop setup with real-time Dhaka weather stations, WiFi LED smart clocks, and modern ambient productivity tools.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  href="/products"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-sm transition shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2"
                >
                  Shop Best Sellers <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/products?category=smart-clocks"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/10 backdrop-blur-md transition flex items-center justify-center gap-2"
                >
                  Explore Clocks
                </Link>
              </div>

              {/* Trust badges - Frosted Liquid Pills with iOS Squircle Icons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-slate-800/80 text-xs">
                <div className="liquid-pill px-3 py-2 rounded-2xl bg-slate-900/50 border border-white/10 text-slate-200 flex items-center justify-center lg:justify-start gap-2.5 shadow-sm backdrop-blur-xl">
                  <div className="w-7 h-7 rounded-xl ios-glass-icon ios-icon-clock flex items-center justify-center flex-shrink-0 shadow-xs">
                    <Truck className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-300">24-48h Delivery in Dhaka</span>
                </div>
                <div className="liquid-pill px-3 py-2 rounded-2xl bg-slate-900/50 border border-white/10 text-slate-200 flex items-center justify-center lg:justify-start gap-2.5 shadow-sm backdrop-blur-xl">
                  <div className="w-7 h-7 rounded-xl ios-glass-icon ios-icon-power flex items-center justify-center flex-shrink-0 shadow-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-300">Cash on Delivery</span>
                </div>
                <div className="liquid-pill px-3 py-2 rounded-2xl bg-slate-900/50 border border-white/10 text-slate-200 flex items-center justify-center lg:justify-start gap-2.5 shadow-sm backdrop-blur-xl">
                  <div className="w-7 h-7 rounded-xl ios-glass-icon ios-icon-ambient flex items-center justify-center flex-shrink-0 shadow-xs">
                    <RotateCcw className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-300">7-Day Replacement</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Mockup / Product Hero with REAL-TIME DHAKA CLOCK */}
            <div className="lg:col-span-5 flex justify-center">
              <LiveDhakaClock />
            </div>
          </div>
        </div>
      </section>

      {/* --- 2. CATEGORIES BROWSER ------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-4 sm:mb-6">
          <div>
            <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-sky-600">Curated Collections</span>
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 mt-0.5 sm:mt-1">
              Browse by Category
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs sm:text-sm font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
          >
            All Products <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        </div>

        <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 scrollbar-none snap-x">
          {categories.map((c) => {
            const productCount = c._count?.products ?? 0
            const hasStock = productCount > 0
            const theme = getCategoryTheme(c.slug, c.name)
            const CatIcon = theme.Icon

            return (
              <Link
                key={c.id}
                href={hasStock ? `/products?category=${c.slug}` : `/products`}
                className={`group min-w-[130px] sm:min-w-0 snap-start p-3.5 sm:p-5 liquid-glass-card fluid-spring rounded-3xl transition-all duration-300 flex flex-col items-center text-center space-y-2 flex-shrink-0 sm:flex-shrink ${
                  hasStock
                    ? 'hover:border-sky-400/80 hover:shadow-xl hover:shadow-sky-500/15 hover:-translate-y-1.5'
                    : 'opacity-85 hover:border-slate-300'
                }`}
              >
                <div
                  className={`w-12 h-12 sm:w-16 sm:h-16 ios-glass-icon ${theme.gradient} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-md ${theme.glow}`}
                >
                  <CatIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow-sm" />
                </div>
                <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-sky-600 transition truncate max-w-full">
                  {c.name}
                </h3>
                {hasStock ? (
                  <span className="text-[10px] sm:text-xs text-emerald-700 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                    {productCount} {productCount === 1 ? 'Item' : 'Items'} In Stock
                  </span>
                ) : (
                  <span className="text-[10px] sm:text-xs text-amber-700 font-bold bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                    Restocking Soon
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </section>

      {/* --- 3. CURATED PREMIER SHOWCASE (NO REPETITION) --------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-4 sm:mb-8">
          <div>
            <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-sky-600 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Signature Gear
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 mt-0.5 sm:mt-1">
              Featured Desk Tech & Clocks
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs sm:text-sm font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
          >
            Explore Catalog <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        </div>

        {allProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {allProducts.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center space-y-4 shadow-xs">
            <span className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto text-2xl">
              <Sparkles className="w-7 h-7" />
            </span>
            <h3 className="text-xl font-bold text-slate-900">New Products Coming Soon!</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              We&apos;re curating the best smart clocks, weather stations, and desk gadgets for you.
            </p>
          </div>
        )}
      </section>


      {/* --- 5. VERIFIED CUSTOMER REVIEWS ------------------------ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-8 sm:mb-12">
          <span className="text-xs font-extrabold uppercase tracking-wider text-sky-600 flex items-center justify-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Real Customers Across Bangladesh
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Loved by Enthusiasts in Dhaka & Nationwide
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Over 800+ verified 5-star ratings from developers, gamers, and desk setup creators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="liquid-glass-card fluid-spring p-6 rounded-3xl shadow-sm border border-white/80 space-y-3">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              &quot;The WeatherStation Mini is a game changer for my programming desk. Shows Dhaka real-time temp and humidity seamlessly. Got delivered in Dhanmondi within 24 hours!&quot;
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <strong className="text-slate-900">Tanvir Hasan</strong>
              <span className="text-slate-400">Dhaka · Verified Buyer</span>
            </div>
          </div>

          <div className="liquid-glass-card fluid-spring p-6 rounded-3xl shadow-sm border border-white/80 space-y-3">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              &quot;GravityCube Pro has boosted my study focus significantly. Flip to 30 mins and lock in. Build quality is solid and the bKash checkout was super smooth.&quot;
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <strong className="text-slate-900">Farhana Yasmin</strong>
              <span className="text-slate-400">Chittagong · Verified Buyer</span>
            </div>
          </div>

          <div className="liquid-glass-card fluid-spring p-6 rounded-3xl shadow-sm border border-white/80 space-y-3">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              &quot;The PixelSmile Mood Clock is adorable! Voice activation works reliably and the warm nightlight is perfect for the bedside table. 10/10 recommendation.&quot;
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <strong className="text-slate-900">Samiul Karim</strong>
              <span className="text-slate-400">Uttara, Dhaka · Verified Buyer</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- 6. WHY ATMODESK (TRUST BADGES) ----------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="liquid-glass-card rounded-3xl p-8 sm:p-12 border border-white/80 shadow-md backdrop-blur-2xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 text-center sm:text-left">
            <div className="space-y-3">
              <div className="w-13 h-13 sm:w-14 sm:h-14 ios-glass-icon ios-icon-clock flex items-center justify-center mx-auto sm:mx-0 shadow-md">
                <Truck className="w-6 h-6 text-white drop-shadow-sm" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">Fast Express Shipping</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                24–48 hours delivery inside Dhaka city. Nationwide courier coverage in 3–5 days across Bangladesh.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-13 h-13 sm:w-14 sm:h-14 ios-glass-icon ios-icon-power flex items-center justify-center mx-auto sm:mx-0 shadow-md">
                <ShieldCheck className="w-6 h-6 text-white drop-shadow-sm" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">Zero-Risk Checkout</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Cash on Delivery or advance bKash/Nagad. Inspect your gadget when the delivery agent arrives.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-13 h-13 sm:w-14 sm:h-14 ios-glass-icon ios-icon-ambient flex items-center justify-center mx-auto sm:mx-0 shadow-md">
                <RotateCcw className="w-6 h-6 text-white drop-shadow-sm" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">7-Day Replacement</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Hassle-free 7-day replacement guarantee on any manufacturing defects or transit issues.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-13 h-13 sm:w-14 sm:h-14 ios-glass-icon ios-icon-tech flex items-center justify-center mx-auto sm:mx-0 shadow-md">
                <Zap className="w-6 h-6 text-white drop-shadow-sm" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">Authentic Tech Only</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Every unit is QC-tested in Bangladesh before dispatch. English manuals and USB cables included.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
