// src/components/home/FlashDealsSection.tsx
'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { formatBDT } from '@/lib/utils'
import { useCart } from '@/store/cart'
import { useToast } from '@/components/shared/Providers'
import { TACTILE_SPRING } from '@/components/shared/LiquidMotion'
import {
  Flame,
  Clock,
  ArrowRight,
  ShoppingBag,
  Star,
  Zap,
  CheckCircle2,
} from 'lucide-react'

interface FlashProduct {
  id: string
  name: string
  slug: string
  image: string
  category: string
  price: number
  originalPrice: number
  stock: number
  soldPercent: number
}

const FLASH_PRODUCTS: FlashProduct[] = [
  {
    id: 'cmtvs1qob0001qbvsafeznftn',
    name: 'WeatherStation Mini — WiFi Smart Desk Clock',
    slug: 'atmodesk-weatherstation-mini-wifi-desk-clock',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    category: 'Smart Clocks',
    price: 1599,
    originalPrice: 2499,
    stock: 6,
    soldPercent: 78,
  },
  {
    id: 'cmtvsizab0001cfkj9x8tdtap',
    name: 'GravityCube Pro — Dual-Mode Pomodoro Timer',
    slug: 'atmodesk-gravitycube-pro-pomodoro-timer',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80',
    category: 'Focus Gadgets',
    price: 1499,
    originalPrice: 2299,
    stock: 4,
    soldPercent: 84,
  },
  {
    id: 'cmus997340001mxx1sdqqufd3',
    name: 'PixelSmile Mood Clock — Voice LED Nightlight',
    slug: 'atmodesk-pixelsmile-mood-clock-voice-activated-led-nightlight-ufd3',
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80',
    category: 'Ambient Lighting',
    price: 1699,
    originalPrice: 2899,
    stock: 4,
    soldPercent: 62,
  },
]

export function FlashDealsSection() {
  const { addItem } = useCart()
  const { toast } = useToast()

  // Countdown timer to midnight Dhaka time
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 42, seconds: 19 })

  useEffect(() => {
    const calcDhakaMidnight = () => {
      const now = new Date()
      // Current Dhaka time
      const dhakaTimeStr = now.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' })
      const dhakaNow = new Date(dhakaTimeStr)
      const dhakaMidnight = new Date(dhakaNow)
      dhakaMidnight.setHours(24, 0, 0, 0)

      const diff = dhakaMidnight.getTime() - dhakaNow.getTime()
      if (diff <= 0) {
        return { hours: 23, minutes: 59, seconds: 59 }
      }
      const h = Math.floor(diff / (1000 * 60 * 60))
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const s = Math.floor((diff % (1000 * 60)) / 1000)
      return { hours: h, minutes: m, seconds: s }
    }

    setTimeLeft(calcDhakaMidnight())
    const interval = setInterval(() => {
      setTimeLeft(calcDhakaMidnight())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleInstantBuy = (product: FlashProduct) => {
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image,
      price: product.price,
      originalPrice: product.originalPrice,
      stock: product.stock,
      quantity: 1,
      openDrawer: true,
    })
    toast(`Added “${product.name}” to your cart`)
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" aria-labelledby="flash-deals-heading">
      <div className="rounded-[36px] bg-gradient-to-r from-rose-50 via-amber-50/40 to-sky-50 border border-rose-200/50 p-6 sm:p-8 md:p-10 relative overflow-hidden shadow-sm">
        {/* Decorative blur */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-rose-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header with Live Countdown Timer */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-rose-200/40 relative z-10">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-500/25">
              <Flame className="w-6 h-6 animate-pulse" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="flash-deals-heading" className="text-xl sm:text-2xl font-black text-[#083466] tracking-tight">
                  Flash Deals of the Day
                </h2>
                <span className="rounded-full bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                  Live
                </span>
              </div>
              <p className="text-xs text-[#5B6B80] mt-0.5">
                Special Cash Prices for Cash on Delivery &amp; bKash. Limited stock reserved for Dhaka hub.
              </p>
            </div>
          </div>

          {/* Countdown Clock (Apple Gadgets style) */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-rose-200/70 shadow-xs">
            <Clock className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-bold text-[#083466] uppercase tracking-wider">Ends in:</span>
            <div className="flex items-center gap-1 font-mono text-sm font-black text-rose-600">
              <span className="w-8 py-1 rounded-lg bg-rose-500 text-white text-center">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-rose-500">:</span>
              <span className="w-8 py-1 rounded-lg bg-rose-500 text-white text-center">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-rose-500">:</span>
              <span className="w-8 py-1 rounded-lg bg-rose-500 text-white text-center">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* Product Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10">
          {FLASH_PRODUCTS.map((prod) => {
            const savings = prod.originalPrice - prod.price
            const discountPct = Math.round((savings / prod.originalPrice) * 100)

            return (
              <div
                key={prod.id}
                className="liquid-glass-card rounded-[28px] p-5 border border-black/[0.08] bg-white flex flex-col justify-between shadow-xs hover:shadow-md transition group"
              >
                <div>
                  {/* Top media & badges */}
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#F3F7FB] mb-4">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />

                    {/* Discount & Category tags */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col items-start gap-1">
                      <span className="rounded-full bg-rose-600 text-white font-black text-xs px-2.5 py-0.5 shadow-xs">
                        Save {formatBDT(savings)}
                      </span>
                      <span className="rounded-full bg-white/90 backdrop-blur-md text-[#083466] font-semibold text-[10px] px-2 py-0.5 shadow-xs">
                        -{discountPct}% OFF
                      </span>
                    </div>

                    <div className="absolute top-2.5 right-2.5">
                      <span className="flex items-center gap-1 rounded-full bg-emerald-500/90 backdrop-blur-md text-white font-bold text-[10px] px-2 py-0.5 shadow-xs">
                        <CheckCircle2 className="w-3 h-3" /> In Stock
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-[#0A9EE6] uppercase tracking-wider block mb-1">
                    {prod.category}
                  </span>

                  <Link href={`/product/${prod.slug}`}>
                    <h3 className="text-sm font-bold text-[#083466] group-hover:text-[#0A9EE6] transition line-clamp-2 leading-snug">
                      {prod.name}
                    </h3>
                  </Link>

                  {/* Pricing Breakdown: Special Cash Price vs Regular */}
                  <div className="mt-3 pt-3 border-t border-black/[0.06] flex items-baseline justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#0A9EE6] block">
                        Special Cash Price:
                      </span>
                      <span className="text-xl font-black text-[#083466] tabular">{formatBDT(prod.price)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-[#86868b] block">Regular Price:</span>
                      <span className="text-xs text-[#86868b] line-through tabular">
                        {formatBDT(prod.originalPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Stock Scarcity Bar */}
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-[#5B6B80]">
                      <span>Reserved: {prod.soldPercent}%</span>
                      <span className="text-rose-600 font-semibold">Only {prod.stock} units left</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-black/[0.06] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-500 to-rose-500"
                        style={{ width: `${prod.soldPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Instant Purchase Buttons */}
                <div className="mt-4 pt-3 border-t border-black/[0.06] flex items-center gap-2">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.96 }}
                    transition={TACTILE_SPRING}
                    onClick={() => handleInstantBuy(prod)}
                    className="flex-1 py-2.5 px-3 rounded-full bg-[#0A9EE6] hover:bg-[#0888CC] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-[#0A9EE6]/20"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Instant Buy Now</span>
                  </motion.button>

                  <Link
                    href={`/product/${prod.slug}`}
                    className="h-9 px-3 rounded-full bg-[#F3F7FB] hover:bg-black/5 flex items-center justify-center text-xs font-semibold text-[#083466] transition border border-black/[0.06]"
                  >
                    View
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
