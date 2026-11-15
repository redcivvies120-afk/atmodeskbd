// src/components/home/AppleGadgetsHero.tsx
'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { formatBDT } from '@/lib/utils'
import { useCart } from '@/store/cart'
import { useToast } from '@/components/shared/Providers'
import { TACTILE_SPRING } from '@/components/shared/LiquidMotion'
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Sparkles,
  Zap,
  Flame,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  Clock,
  Eye,
} from 'lucide-react'

interface Slide {
  id: string
  badge: string
  badgeColor: string
  title: string
  titleHighlight: string
  subtitle: string
  price: number
  originalPrice: number
  slug: string
  image: string
  bgGradient: string
  specs: string[]
}

const HERO_SLIDES: Slide[] = [
  {
    id: 'cmtvs1qob0001qbvsafeznftn',
    badge: 'FLAGSHIP · 2026 EDITION',
    badgeColor: 'bg-[#0071e3] text-white',
    title: 'WeatherStation Mini',
    titleHighlight: 'WiFi Smart Desk Clock',
    subtitle:
      'Real-time Dhaka BST time, temperature, humidity and barometric pressure synced over 2.4GHz WiFi.',
    price: 1599,
    originalPrice: 2499,
    slug: 'atmodesk-weatherstation-mini-wifi-desk-clock',
    image: '/products/atmodesk-weatherstation-mini-1.jpg',
    bgGradient: 'from-[#f0f4fb] via-white to-[#f5f5f7]',
    specs: ['Live Dhaka Weather', 'WiFi 2.4GHz Sync', 'IPS Full Color Display', '24-48h Dhaka Delivery'],
  },
  {
    id: 'cmtvsizab0001cfkj9x8tdtap',
    badge: 'PRODUCTIVITY ESSENTIAL',
    badgeColor: 'bg-amber-600 text-white',
    title: 'GravityCube Pro',
    titleHighlight: 'Dual-Mode Pomodoro Timer',
    subtitle:
      'Flip to focus. Boost study and programming sessions with physical gyroscope timing and silent vibrations.',
    price: 1499,
    originalPrice: 2299,
    slug: 'atmodesk-gravitycube-pro-pomodoro-timer',
    image: '/products/atmodesk-gravitycube-pro-1.jpg',
    bgGradient: 'from-[#fef7ee] via-white to-[#f5f5f7]',
    specs: ['Physical Flip Sensor', 'Silent Vibration Alert', 'Rechargeable USB-C', 'Cash on Delivery'],
  },
  {
    id: 'cmus997340001mxx1sdqqufd3',
    badge: 'NEW AMBIENT ARRIVAL',
    badgeColor: 'bg-rose-600 text-white',
    title: 'PixelSmile Mood Clock',
    titleHighlight: 'Voice-Activated LED Nightlight',
    subtitle:
      'Expressive pixel face animations, acoustic voice trigger, and 3000K warm soothing bedside ambient light.',
    price: 1699,
    originalPrice: 2899,
    slug: 'atmodesk-pixelsmile-mood-clock-voice-activated-led-nightlight-ufd3',
    image: '/products/atmodesk-pixelsmile-mood-1.jpg',
    bgGradient: 'from-[#fdf2f4] via-white to-[#f5f5f7]',
    specs: ['Voice Clap Trigger', 'Warm Nightlight', 'Expressive Pixel Faces', '7-Day Replacement'],
  },
]

export function AppleGadgetsHero() {
  const router = useRouter()
  const { addItem } = useCart()
  const { toast } = useToast()

  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
  }, [])

  // Auto-play slider (Apple Gadgets style)
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [isPaused, nextSlide])

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX }
  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX
    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > 50) { diff > 0 ? nextSlide() : prevSlide() }
  }

  const handleInstantBuy = (product: {
    id: string
    name: string
    slug: string
    image: string
    price: number
    originalPrice: number
  }) => {
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image,
      price: product.price,
      originalPrice: product.originalPrice,
      stock: 10,
      quantity: 1,
      openDrawer: false,
    })
    toast(`Added “${product.name}” to order. Proceeding to checkout...`)
    router.push('/checkout')
  }

  const slide = HERO_SLIDES[currentSlide]
  const savings = slide.originalPrice - slide.price
  const discountPct = Math.round((savings / slide.originalPrice) * 100)

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6 sm:py-6" aria-label="Hero Showcase">
      {/* 2:1 Asymmetrical Hero Grid (Apple Gadgets Architecture) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
        {/* Main Sliding Banner Carousel (Left 8 cols) */}
        <div
          className="lg:col-span-8 relative rounded-[32px] sm:rounded-[36px] overflow-hidden border border-black/[0.08] bg-white shadow-sm flex flex-col justify-between min-h-[460px] sm:min-h-[500px]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Animated Slide Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className={`p-6 sm:p-10 md:p-12 h-full flex flex-col justify-between bg-gradient-to-br ${slide.bgGradient} relative`}
            >
              {/* Ambient Specular Glow */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/60 rounded-full blur-3xl pointer-events-none" />

              {/* Top Banner Tag & Stock Status */}
              <div className="flex items-center justify-between gap-3 relative z-10">
                <span
                  className={`inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-xs ${slide.badgeColor}`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {slide.badge}
                </span>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-200/50 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Ready to Dispatch · Dhaka Hub</span>
                </div>
              </div>

              {/* Center Content: Title, Price & Visual */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-auto py-4 relative z-10">
                {/* Left Text */}
                <div className="md:col-span-7 space-y-4 text-center md:text-left">
                  <div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1d1d1f] tracking-tight leading-[1.08]">
                      {slide.title}
                    </h2>
                    <span className="text-lg sm:text-xl font-bold text-[#0071e3] block mt-1">
                      {slide.titleHighlight}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#6e6e73] leading-relaxed max-w-md mx-auto md:mx-0">
                    {slide.subtitle}
                  </p>

                  {/* Pricing Display (Apple Gadgets Special Cash Price) */}
                  <div className="pt-1 flex items-baseline justify-center md:justify-start gap-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#0071e3] block">
                        Special Cash Price:
                      </span>
                      <span className="text-2xl sm:text-3xl font-black text-[#1d1d1f] tabular">
                        {formatBDT(slide.price)}
                      </span>
                    </div>

                    <div className="text-left">
                      <span className="text-[10px] text-[#86868b] block">Regular Price:</span>
                      <span className="text-sm text-[#86868b] line-through tabular">
                        {formatBDT(slide.originalPrice)}
                      </span>
                    </div>

                    <span className="rounded-full bg-rose-500 text-white font-black text-xs px-2.5 py-0.5 shadow-xs self-center">
                      Save {formatBDT(savings)}
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.96 }}
                      transition={TACTILE_SPRING}
                      onClick={() =>
                        handleInstantBuy({
                          id: slide.id,
                          name: `${slide.title} — ${slide.titleHighlight}`,
                          slug: slide.slug,
                          image: slide.image,
                          price: slide.price,
                          originalPrice: slide.originalPrice,
                        })
                      }
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-bold bg-[#0071e3] hover:bg-[#0077ed] text-white shadow-lg shadow-[#0071e3]/20 transition"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Order Now (Cash on Delivery)</span>
                    </motion.button>

                    <Link
                      href={`/product/${slide.slug}`}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-full px-6 py-3 text-sm font-semibold bg-white hover:bg-[#f5f5f7] text-[#1d1d1f] border border-black/[0.08] shadow-xs transition"
                    >
                      <span>Explore Specs</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#6e6e73]" />
                    </Link>
                  </div>
                </div>

                {/* Right Product Image with Specular Glow & Float Badge */}
                <div className="md:col-span-5 flex justify-center relative">
                  <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-[28px] bg-white p-3.5 shadow-xl border border-black/[0.08] flex items-center justify-center group overflow-hidden">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover rounded-2xl group-hover:scale-108 transition duration-500"
                    />

                    {/* Floating Quality Tag */}
                    <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-3.5 py-1 rounded-full border border-black/[0.08] shadow-md flex items-center gap-1.5 text-[10px] font-bold text-[#1d1d1f] whitespace-nowrap z-10">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Pre-Tested in Dhaka</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Feature Specs */}
              <div className="relative z-10 pt-4 border-t border-black/[0.06] flex flex-wrap items-center justify-between gap-2 text-xs text-[#6e6e73]">
                {slide.specs.map((spec) => (
                  <span key={spec} className="inline-flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0071e3]" />
                    {spec}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Controls: Arrows & Dots */}
          <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous slide"
              className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#1d1d1f] flex items-center justify-center shadow-md border border-black/[0.08] transition active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next slide"
              className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#1d1d1f] flex items-center justify-center shadow-md border border-black/[0.08] transition active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-6 sm:left-10 z-20 flex items-center gap-1.5">
            {HERO_SLIDES.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === idx ? 'w-7 bg-[#0071e3]' : 'w-2 bg-black/20 hover:bg-black/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stacked Side Feature Banners (Right 4 cols - Apple Gadgets structure) */}
        <div className="lg:col-span-4 flex flex-col gap-4 sm:gap-6">
          {/* Top Banner: GravityCube Pro */}
          <div className="liquid-glass-card rounded-[32px] p-5 sm:p-6 border border-black/[0.08] bg-gradient-to-br from-white via-[#fafafa] to-amber-50/30 flex-1 flex flex-col justify-between relative overflow-hidden group shadow-xs hover:shadow-md transition">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100/70 border border-amber-300/50 px-2.5 py-0.5 text-[10px] font-black text-amber-800">
                  <Flame className="w-3 h-3 text-amber-600" /> TRENDING FOCUS TOOL
                </span>
                <h3 className="text-base sm:text-lg font-black text-[#1d1d1f] mt-2 group-hover:text-[#0071e3] transition">
                  GravityCube Pro
                </h3>
                <p className="text-xs text-[#6e6e73] line-clamp-1 mt-0.5">
                  Dual-Mode Gyroscope Pomodoro Timer
                </p>
              </div>

              <span className="rounded-full bg-rose-500 text-white font-black text-[10px] px-2 py-0.5 shadow-xs">
                -35%
              </span>
            </div>

            <div className="my-3 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-[#0071e3] uppercase">Special Cash Price:</div>
                <div className="text-xl sm:text-2xl font-black text-[#1d1d1f] tabular">{formatBDT(1499)}</div>
                <div className="text-[11px] text-[#86868b] line-through tabular">
                  Regular: {formatBDT(2299)}
                </div>
              </div>

              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-white border border-black/[0.08] overflow-hidden flex items-center justify-center p-2 shadow-sm flex-shrink-0 group-hover:shadow-md transition">
                <img
                  src="/products/atmodesk-gravitycube-pro-1.jpg"
                  alt="GravityCube Pro"
                  className="w-full h-full object-cover rounded-xl group-hover:scale-108 transition duration-300"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-black/[0.06] flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  handleInstantBuy({
                    id: 'cmtvsizab0001cfkj9x8tdtap',
                    name: 'ATMODESK GravityCube Pro — Dual-Mode Pomodoro Timer',
                    slug: 'atmodesk-gravitycube-pro-pomodoro-timer',
                    image: '/products/atmodesk-gravitycube-pro-1.jpg',
                    price: 1499,
                    originalPrice: 2299,
                  })
                }
                className="flex-1 py-2.5 px-3 rounded-full bg-[#1d1d1f] hover:bg-[#0071e3] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Instant Buy Now</span>
              </button>

              <Link
                href="/product/atmodesk-gravitycube-pro-pomodoro-timer"
                className="h-9 w-9 rounded-full bg-[#f5f5f7] hover:bg-black/5 flex items-center justify-center text-[#1d1d1f] transition border border-black/[0.06]"
                title="View details"
              >
                <Eye className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Bottom Banner: PixelSmile Mood Clock */}
          <div className="liquid-glass-card rounded-[32px] p-5 sm:p-6 border border-black/[0.08] bg-gradient-to-br from-white via-[#fafafa] to-sky-50/30 flex-1 flex flex-col justify-between relative overflow-hidden group shadow-xs hover:shadow-md transition">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#0071e3]/10 border border-[#0071e3]/20 px-2.5 py-0.5 text-[10px] font-black text-[#0071e3]">
                  <Sparkles className="w-3 h-3" /> VOICE-ACTIVATED
                </span>
                <h3 className="text-base sm:text-lg font-black text-[#1d1d1f] mt-2 group-hover:text-[#0071e3] transition">
                  PixelSmile Mood Clock
                </h3>
                <p className="text-xs text-[#6e6e73] line-clamp-1 mt-0.5">
                  Voice-Activated LED Smart Nightlight
                </p>
              </div>

              <span className="rounded-full bg-rose-500 text-white font-black text-[10px] px-2 py-0.5 shadow-xs">
                -41%
              </span>
            </div>

            <div className="my-3 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-[#0071e3] uppercase">Special Cash Price:</div>
                <div className="text-xl sm:text-2xl font-black text-[#1d1d1f] tabular">{formatBDT(1699)}</div>
                <div className="text-[11px] text-[#86868b] line-through tabular">
                  Regular: {formatBDT(2899)}
                </div>
              </div>

              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-white border border-black/[0.08] overflow-hidden flex items-center justify-center p-2 shadow-sm flex-shrink-0 group-hover:shadow-md transition">
                <img
                  src="/products/atmodesk-pixelsmile-mood-1.jpg"
                  alt="PixelSmile Mood Clock"
                  className="w-full h-full object-cover rounded-xl group-hover:scale-108 transition duration-300"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-black/[0.06] flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  handleInstantBuy({
                    id: 'cmus997340001mxx1sdqqufd3',
                    name: 'ATMODESK PixelSmile Mood Clock — Voice-Activated LED Nightlight',
                    slug: 'atmodesk-pixelsmile-mood-clock-voice-activated-led-nightlight-ufd3',
                    image: '/products/atmodesk-pixelsmile-mood-1.jpg',
                    price: 1699,
                    originalPrice: 2899,
                  })
                }
                className="flex-1 py-2.5 px-3 rounded-full bg-[#1d1d1f] hover:bg-[#0071e3] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Instant Buy Now</span>
              </button>

              <Link
                href="/product/atmodesk-pixelsmile-mood-clock-voice-activated-led-nightlight-ufd3"
                className="h-9 w-9 rounded-full bg-[#f5f5f7] hover:bg-black/5 flex items-center justify-center text-[#1d1d1f] transition border border-black/[0.06]"
                title="View details"
              >
                <Eye className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
