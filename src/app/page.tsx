// src/app/page.tsx
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/product/ProductCard'
import { LiveDhakaClock } from '@/components/home/LiveDhakaClock'
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
    <div className="space-y-14 sm:space-y-24 pb-14 sm:pb-24">
      {/* --- HERO ------------------------------------------------------- */}
      <section className="relative isolate overflow-hidden pt-10 pb-16 sm:pt-14 sm:pb-24 lg:py-28 border-b border-white/[0.07]">
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(68rem_38rem_at_18%_-8%,rgba(56,189,248,0.24),transparent_60%),radial-gradient(50rem_36rem_at_95%_25%,rgba(129,140,248,0.18),transparent_60%),linear-gradient(to_bottom,#040711,#060913)]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <LiquidReveal className="lg:col-span-7 space-y-5 sm:space-y-7 text-center lg:text-left">
              <div className="mx-auto lg:mx-0 inline-flex items-center gap-2 rounded-full bg-white/[0.07] px-3.5 py-1.5 text-xs font-medium text-sky-200 ring-1 ring-white/15 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
                <Sparkles className="w-3.5 h-3.5 text-sky-300" />
                <span>Desk tech, shipped across Bangladesh</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-[-0.03em] leading-[1.05] text-white">
                Smart clocks.
                <br />
                <span className="bg-gradient-to-r from-sky-300 via-cyan-200 to-indigo-300 bg-clip-text text-transparent">
                  Ambient weather.
                </span>
                <br />
                A desk that feels alive.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Real-time Dhaka weather stations, WiFi LED clocks and ambient desk tools. Cash on delivery, tested before
                dispatch.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1">
                <Link
                  href="/products"
                  className="lg-btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold"
                >
                  Shop best sellers <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/products?category=smart-clocks"
                  className="lg-btn-ghost w-full sm:w-auto inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-semibold"
                >
                  Explore clocks
                </Link>
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-5 sm:pt-7 text-left">
                {[
                  { icon: Truck, tone: 'sky', text: '24-48h delivery in Dhaka' },
                  { icon: ShieldCheck, tone: 'green', text: 'Cash on delivery' },
                  { icon: RotateCcw, tone: 'violet', text: '7-day replacement' },
                ].map((b) => (
                  <li
                    key={b.text}
                    className="flex items-center gap-3 rounded-2xl bg-white/[0.05] p-2 pr-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.09),inset_0_1px_0_rgba(255,255,255,0.14)]"
                  >
                    <LiquidIcon icon={b.icon} tone={b.tone as LiquidTone} variant="frost" size="sm" />
                    <span className="text-xs font-medium text-slate-200">{b.text}</span>
                  </li>
                ))}
              </ul>
            </LiquidReveal>

            <LiquidReveal delay={0.1} className="lg:col-span-5 flex justify-center">
              <LiveDhakaClock />
            </LiquidReveal>
          </div>
        </div>
      </section>

      {/* --- CATEGORIES ------------------------------------------------- */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-labelledby="cat-heading">
          <LiquidReveal className="flex items-end justify-between mb-5 sm:mb-7">
            <h2 id="cat-heading" className="text-2xl sm:text-4xl font-semibold tracking-tight text-white">
              Browse by category
            </h2>
            <Link href="/products" className="inline-flex items-center gap-1 text-sm font-medium text-sky-400 hover:text-sky-300">
              All products <ArrowRight className="w-4 h-4" />
            </Link>
          </LiquidReveal>

          <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 overflow-x-auto sm:overflow-visible pb-3 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar snap-x-mandatory">
            {categories.map((c) => {
              const productCount = c._count?.products ?? 0
              const hasStock = productCount > 0
              const { Icon, tone } = getCategoryTheme(c.slug, c.name)

              return (
                <Link
                  key={c.id}
                  href={hasStock ? `/products?category=${c.slug}` : '/products'}
                  className={`group snap-start min-w-[148px] sm:min-w-0 flex-shrink-0 sm:flex-shrink liquid-glass-card rounded-[28px] p-4 sm:p-5 flex flex-col items-center text-center gap-3 ${
                    hasStock ? '' : 'opacity-70'
                  }`}
                >
                  <LiquidIcon icon={Icon} tone={tone} size="lg" lift />
                  <h3 className="font-semibold text-sm text-white truncate max-w-full">{c.name}</h3>
                  {hasStock ? (
                    <span className="text-[11px] font-medium text-emerald-300 bg-emerald-500/15 ring-1 ring-emerald-400/25 px-2.5 py-0.5 rounded-full">
                      {productCount} in stock
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-amber-300 bg-amber-500/15 ring-1 ring-amber-400/25 px-2.5 py-0.5 rounded-full">
                      Restocking soon
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* --- FEATURED --------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-labelledby="featured-heading">
        <LiquidReveal className="flex items-end justify-between mb-5 sm:mb-8">
          <h2 id="featured-heading" className="text-2xl sm:text-4xl font-semibold tracking-tight text-white">
            Featured desk tech &amp; clocks
          </h2>
          <Link href="/products" className="inline-flex items-center gap-1 text-sm font-medium text-sky-400 hover:text-sky-300">
            Full catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </LiquidReveal>

        {allProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {allProducts.map((p, i) => (
              <LiquidReveal key={p.id} delay={Math.min(i * 0.05, 0.25)}>
                <ProductCard {...p} priority={i < 3} />
              </LiquidReveal>
            ))}
          </div>
        ) : (
          <div className="liquid-glass-card rounded-[28px] p-10 text-center space-y-4">
            <div className="mx-auto w-fit">
              <LiquidIcon icon={Sparkles} tone="sky" size="lg" />
            </div>
            <h3 className="text-xl font-semibold text-white">New products coming soon</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              We&apos;re curating the best smart clocks, weather stations and desk gadgets for you.
            </p>
          </div>
        )}
      </section>

      {/* --- REVIEWS ---------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 cv-auto" aria-labelledby="reviews-heading">
        <LiquidReveal className="text-center max-w-2xl mx-auto space-y-2 mb-8 sm:mb-12">
          <p className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-emerald-400">
            <CheckCircle2 className="w-4 h-4" /> Customers across Bangladesh
          </p>
          <h2 id="reviews-heading" className="text-2xl sm:text-4xl font-semibold tracking-tight text-white">
            Loved by desk setup enthusiasts
          </h2>
        </LiquidReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {[
            {
              text: 'The WeatherStation Mini is a game changer for my programming desk. Shows Dhaka real-time temp and humidity seamlessly. Got delivered in Dhanmondi within 24 hours!',
              name: 'Tanvir Hasan',
              place: 'Dhaka',
            },
            {
              text: 'GravityCube Pro has boosted my study focus significantly. Flip to 30 mins and lock in. Build quality is solid and the bKash checkout was super smooth.',
              name: 'Farhana Yasmin',
              place: 'Chittagong',
            },
            {
              text: 'The PixelSmile Mood Clock is adorable! Voice activation works reliably and the warm nightlight is perfect for the bedside table. 10/10 recommendation.',
              name: 'Samiul Karim',
              place: 'Uttara, Dhaka',
            },
          ].map((r, i) => (
            <LiquidReveal key={r.name} delay={i * 0.07}>
              <figure className="liquid-glass-card rounded-[28px] p-6 space-y-3 h-full flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-0.5" role="img" aria-label="5 out of 5 stars">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <blockquote className="text-sm text-slate-200 leading-relaxed">&ldquo;{r.text}&rdquo;</blockquote>
                </div>
                <figcaption className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <strong className="font-semibold text-white">{r.name}</strong>
                  <span className="text-slate-400">{r.place} · Verified buyer</span>
                </figcaption>
              </figure>
            </LiquidReveal>
          ))}
        </div>
      </section>

      {/* --- WHY ATMODESK ---------------------------------------------- */}
      <LiquidReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 cv-auto">
        <section aria-label="Why shop with ATMODESK">
          <div className="liquid-glass-card rounded-[36px] p-8 sm:p-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center sm:text-left">
              {[
                { icon: Truck, tone: 'sky', title: 'Fast express shipping', text: '24–48 hours inside Dhaka. Nationwide courier coverage in 3–5 days.' },
                { icon: ShieldCheck, tone: 'green', title: 'Zero-risk checkout', text: 'Cash on Delivery or advance bKash / Nagad. Inspect your gadget when the courier arrives.' },
                { icon: RotateCcw, tone: 'violet', title: '7-day replacement', text: 'Replacement guarantee on manufacturing defects and transit damage.' },
                { icon: Zap, tone: 'amber', title: 'Tested before dispatch', text: 'Every unit is checked in Bangladesh first. English manual and USB cable included.' },
              ].map((f) => (
                <div key={f.title} className="space-y-3 flex flex-col items-center sm:items-start">
                  <LiquidIcon icon={f.icon} tone={f.tone as LiquidTone} variant="solid" size="lg" />
                  <h3 className="font-semibold text-base text-white">{f.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </LiquidReveal>
    </div>
  )
}
