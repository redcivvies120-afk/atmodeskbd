// src/app/page.tsx
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { AppleGadgetsHero } from '@/components/home/AppleGadgetsHero'
import { TrustBadgesStrip } from '@/components/home/TrustBadgesStrip'
import { FlashDealsSection } from '@/components/home/FlashDealsSection'
import { PromoBannerPair } from '@/components/home/PromoBannerPair'
import { DeskSetupBuilder } from '@/components/home/DeskSetupBuilder'
import { LiveDhakaClock } from '@/components/home/LiveDhakaClock'
import { ProductCatalogShelf } from '@/components/home/ProductCatalogShelf'
import { LiquidIcon, type LiquidTone } from '@/components/shared/LiquidIcon'
import { LiquidReveal } from '@/components/shared/LiquidMotion'
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Zap,
  Clock,
  Star,
  CheckCircle2,
  CloudSun,
  BatteryCharging,
  Package,
  type LucideIcon,
} from 'lucide-react'

function getCategoryTheme(slug: string, name: string): { Icon: LucideIcon; tone: LiquidTone } {
  const s = (slug + ' ' + name).toLowerCase()
  if (s.includes('clock')) return { Icon: Clock, tone: 'sky' }
  if (s.includes('weather')) return { Icon: CloudSun, tone: 'indigo' }
  if (s.includes('ambient') || s.includes('light')) return { Icon: Sparkles, tone: 'violet' }
  if (s.includes('desk') || s.includes('tech') || s.includes('gadget')) return { Icon: Zap, tone: 'teal' }
  if (s.includes('power') || s.includes('charger')) return { Icon: BatteryCharging, tone: 'green' }
  return { Icon: Package, tone: 'slate' }
}

export const revalidate = 60

const HOME_PRODUCT_LIMIT = 12

export default async function HomePage() {
  let categories: any[] = []
  let allProducts: any[] = []

  try {
    const [c, p] = await Promise.all([
      prisma.category.findMany({
        where: { isActive: true },
        include: { _count: { select: { products: { where: { isActive: true } } } } },
        orderBy: { sortOrder: 'asc' },
      }),
      prisma.product.findMany({
        where: { isActive: true },
        include: { images: true, category: true },
        orderBy: [{ isFeatured: 'desc' }, { soldCount: 'desc' }, { createdAt: 'desc' }],
        take: HOME_PRODUCT_LIMIT,
      }),
    ])
    categories = c
    allProducts = p
  } catch (err) {
    console.error('Prisma query fallback:', err)
  }

  return (
    <div className="space-y-10 sm:space-y-16 pb-16 sm:pb-24 bg-white">
      {/* --- 1. APPLE GADGETS 2:1 ASYMMETRICAL HERO GRID ------------------- */}
      <AppleGadgetsHero />

      {/* --- 2. 5-POINT RETAIL TRUST & VALUE RIBBON ----------------------- */}
      <TrustBadgesStrip />

      {/* --- 3. QUICK CATEGORY VISUAL HUB (Apple Gadgets style) ----------- */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-labelledby="cat-heading">
          <div className="flex items-end justify-between mb-5 sm:mb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0A9EE6] block">
                Catalog Navigation
              </span>
              <h2 id="cat-heading" className="text-xl sm:text-3xl font-black tracking-tight text-[#083466]">
                Explore By Category
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#0A9EE6] hover:underline"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 overflow-x-auto sm:overflow-visible pb-3 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar snap-x-mandatory">
            {categories.map((c) => {
              const productCount = c._count?.products ?? 0
              const hasStock = productCount > 0
              const { Icon, tone } = getCategoryTheme(c.slug, c.name)

              return (
                <Link
                  key={c.id}
                  href={hasStock ? `/products?category=${c.slug}` : '/products'}
                  className={`group snap-start min-w-[140px] sm:min-w-0 flex-shrink-0 sm:flex-shrink liquid-glass-card rounded-[24px] p-4 sm:p-5 flex flex-col items-center text-center gap-2.5 border border-black/[0.06] hover:border-black/15 hover:shadow-md transition ${
                    hasStock ? 'bg-white' : 'opacity-70 bg-[#fafafa]'
                  }`}
                >
                  <LiquidIcon icon={Icon} tone={tone} size="md" lift />
                  <h3 className="font-bold text-xs sm:text-sm text-[#083466] truncate max-w-full">
                    {c.name}
                  </h3>
                  {hasStock ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/40">
                      {productCount} in stock
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/40">
                      Restocking
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* --- 4. FLASH DEALS OF THE DAY WITH LIVE COUNTDOWN ---------------- */}
      <FlashDealsSection />

      {/* --- 5. DUAL PROMOTIONAL FEATURE BANNERS (Apple Gadgets style) ---- */}
      <PromoBannerPair />

      {/* --- 6. ATMODESK STUDIO: THE UNIQUE INTERACTIVE DESK BUILDER ------ */}
      <DeskSetupBuilder />

      {/* --- 7. LIVE DHAKA ATMOSPHERIC TELEMETRY SHOWCASE ---------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4" aria-labelledby="telemetry-heading">
        <div className="rounded-[36px] bg-gradient-to-r from-[#f0f4f9] via-white to-[#F3F7FB] border border-black/[0.08] p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xs">
          <div className="space-y-4 text-center lg:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#0A9EE6]/10 px-3 py-1 text-xs font-bold text-[#0A9EE6]">
              <CloudSun className="w-4 h-4 text-[#0A9EE6]" />
              <span>LIVE DHAKA ATMOSPHERIC TELEMETRY</span>
            </div>
            <h2 id="telemetry-heading" className="text-2xl sm:text-3xl font-black text-[#083466] tracking-tight">
              Real-Time Dhaka Weather &amp; Time Sync
            </h2>
            <p className="text-xs sm:text-sm text-[#5B6B80] leading-relaxed">
              Every ATMODESK WeatherStation connects directly to Dhaka Open-Meteo telemetry over 2.4GHz WiFi,
              delivering accurate BST time (UTC+6), ambient humidity, and barometric pressure right on your desk.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1 text-xs text-[#083466] font-semibold">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Auto WiFi BST (UTC+6)
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#0A9EE6]" /> Live Pressure (hPa)
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-600" /> Temperature &amp; Humidity
              </span>
            </div>
          </div>

          <div className="flex justify-center flex-shrink-0 scale-95 sm:scale-100">
            <LiveDhakaClock />
          </div>
        </div>
      </section>

      {/* --- 8. FEATURED CATALOG SHELF WITH TABS (Apple Gadgets Grid) ----- */}
      <ProductCatalogShelf products={allProducts} categories={categories} />

      {/* --- 9. VERIFIED BANGLADESH REVIEWS & UNBOXING TRUST -------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-labelledby="reviews-heading">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-8 sm:mb-12">
          <p className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/50">
            <CheckCircle2 className="w-4 h-4" /> Verified Customer Reviews · Bangladesh
          </p>
          <h2 id="reviews-heading" className="text-2xl sm:text-4xl font-black tracking-tight text-[#083466]">
            Loved by Programmers &amp; Desk Setup Creators
          </h2>
          <p className="text-xs sm:text-sm text-[#5B6B80]">
            Real feedback from customers who upgraded their workstations with ATMODESK.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {[
            {
              text: 'The WeatherStation Mini is a game changer for my programming desk. Shows Dhaka real-time temp and humidity seamlessly. Got delivered in Dhanmondi within 24 hours via Steadfast courier!',
              name: 'Tanvir Hasan',
              place: 'Dhanmondi, Dhaka',
              product: 'WeatherStation Mini',
            },
            {
              text: 'GravityCube Pro has boosted my study focus significantly. Flip to 30 mins and lock in without looking at my phone. Build quality is solid and the Cash on Delivery checkout was completely zero-risk.',
              name: 'Farhana Yasmin',
              place: 'GEC Circle, Chittagong',
              product: 'GravityCube Pro',
            },
            {
              text: 'The PixelSmile Mood Clock is adorable! Voice activation works reliably and the warm nightlight is perfect for the bedside table. Tested properly before packing, came with USB-C cable. 10/10 recommendation.',
              name: 'Samiul Karim',
              place: 'Uttara, Dhaka',
              product: 'PixelSmile Mood Clock',
            },
          ].map((r, i) => (
            <LiquidReveal key={r.name} delay={i * 0.06}>
              <figure className="liquid-glass-card rounded-[28px] p-6 space-y-4 h-full flex flex-col justify-between bg-gradient-to-br from-white to-[#fafafa] border border-black/[0.08] shadow-xs">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-0.5" role="img" aria-label="5 out of 5 stars">
                      {[...Array(5)].map((_, idx) => (
                        <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-[#0A9EE6] bg-[#0A9EE6]/10 px-2 py-0.5 rounded-full">
                      {r.product}
                    </span>
                  </div>
                  <blockquote className="text-xs sm:text-sm text-[#083466] leading-relaxed">
                    &ldquo;{r.text}&rdquo;
                  </blockquote>
                </div>
                <figcaption className="pt-3 border-t border-black/[0.06] flex items-center justify-between text-xs">
                  <div>
                    <strong className="font-bold text-[#083466] block">{r.name}</strong>
                    <span className="text-[11px] text-[#5B6B80]">{r.place}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                    Verified Buyer
                  </span>
                </figcaption>
              </figure>
            </LiquidReveal>
          ))}
        </div>
      </section>

      {/* --- 10. WHY ATMODESK (RETAIL ASSURANCE BANNER) ------------------ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Why shop with ATMODESK">
        <div className="rounded-[36px] bg-[#F3F7FB] border border-black/[0.08] p-8 sm:p-12 relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center sm:text-left">
            {[
              {
                icon: Truck,
                tone: 'sky',
                title: 'Fast Express Shipping',
                text: '24–48 hours inside Dhaka. Nationwide courier coverage in 3–5 days across all 64 districts in Bangladesh.',
              },
              {
                icon: ShieldCheck,
                tone: 'green',
                title: 'Zero-Risk Cash on Delivery',
                text: 'Pay only after opening and inspecting your gadget with the courier. Advance bKash and Nagad also supported.',
              },
              {
                icon: RotateCcw,
                tone: 'violet',
                title: '7-Day Replacement Guarantee',
                text: 'Hassle-free replacement guarantee on manufacturing defects or transit damage. Strictly customer-first policy.',
              },
              {
                icon: Zap,
                tone: 'amber',
                title: 'Pre-Tested in Bangladesh',
                text: 'Every unit is unboxed, tested, and calibrated in Dhaka before dispatch. English manual and USB cable included.',
              },
            ].map((f) => (
              <div key={f.title} className="space-y-3 flex flex-col items-center sm:items-start">
                <LiquidIcon icon={f.icon} tone={f.tone as LiquidTone} variant="solid" size="lg" />
                <h3 className="font-bold text-base text-[#083466]">{f.title}</h3>
                <p className="text-xs sm:text-sm text-[#5B6B80] leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
