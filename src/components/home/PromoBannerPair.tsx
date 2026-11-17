// src/components/home/PromoBannerPair.tsx
'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { formatBDT } from '@/lib/utils'
import { useCart } from '@/store/cart'
import { useToast } from '@/components/shared/Providers'
import { TACTILE_SPRING } from '@/components/shared/LiquidMotion'
import { ShoppingBag, ArrowRight, Zap, Sparkles, Flame, CheckCircle2 } from 'lucide-react'

export function PromoBannerPair() {
  const router = useRouter()
  const { addItem } = useCart()
  const { toast } = useToast()

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

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" aria-label="Promotional Campaigns">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Banner 1: Study & Work Productivity */}
        <div className="rounded-[32px] p-6 sm:p-8 bg-gradient-to-br from-[#083466] via-slate-900 to-black text-white relative overflow-hidden flex flex-col justify-between shadow-lg group">
          {/* Subtle Ambient Backlight */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-start justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 px-3 py-1 text-[11px] font-bold text-amber-300">
              <Flame className="w-3.5 h-3.5" /> FOCUS &amp; PRODUCTIVITY
            </span>
            <span className="rounded-full bg-rose-500 text-white font-black text-xs px-2.5 py-0.5">
              -35% OFF
            </span>
          </div>

          <div className="my-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center relative z-10">
            <div className="sm:col-span-7 space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                GravityCube Pro
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-2">
                Boost study and programming sessions with dual-mode gyroscope Pomodoro timing and silent haptic vibration.
              </p>
              <div className="pt-2 flex items-baseline gap-2.5">
                <span className="text-2xl font-black text-amber-400 tabular">{formatBDT(1499)}</span>
                <span className="text-xs text-slate-400 line-through tabular">{formatBDT(2299)}</span>
                <span className="text-[11px] text-emerald-400 font-semibold">Save ৳800</span>
              </div>
            </div>

            <div className="sm:col-span-5 flex justify-center">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-white/10 border border-white/10 p-2 overflow-hidden shadow-inner flex items-center justify-center">
                <img
                  src="/products/atmodesk-gravitycube-pro-1.jpg"
                  alt="GravityCube Pro"
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition duration-300"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center gap-3 relative z-10">
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              transition={TACTILE_SPRING}
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
              className="flex-1 py-3 px-4 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md shadow-amber-500/20"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Buy with Cash on Delivery</span>
            </motion.button>

            <Link
              href="/product/atmodesk-gravitycube-pro-pomodoro-timer"
              className="py-3 px-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition border border-white/15"
            >
              Details
            </Link>
          </div>
        </div>

        {/* Banner 2: Ambient Voice Nightlight */}
        <div className="rounded-[32px] p-6 sm:p-8 bg-gradient-to-br from-[#0A9EE6] via-blue-700 to-indigo-900 text-white relative overflow-hidden flex flex-col justify-between shadow-lg group">
          {/* Subtle Ambient Backlight */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-start justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 border border-white/30 px-3 py-1 text-[11px] font-bold text-white">
              <Sparkles className="w-3.5 h-3.5" /> VOICE ACTIVATED · NEW
            </span>
            <span className="rounded-full bg-white text-[#0A9EE6] font-black text-xs px-2.5 py-0.5 shadow-xs">
              -41% OFF
            </span>
          </div>

          <div className="my-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center relative z-10">
            <div className="sm:col-span-7 space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                PixelSmile Mood Clock
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed line-clamp-2">
                Clap to illuminate. Expressive pixel emotions with 3000K soft warm nightlight and dual smart alarms.
              </p>
              <div className="pt-2 flex items-baseline gap-2.5">
                <span className="text-2xl font-black text-white tabular">{formatBDT(1699)}</span>
                <span className="text-xs text-blue-200 line-through tabular">{formatBDT(2899)}</span>
                <span className="text-[11px] text-cyan-200 font-semibold">Save ৳1,200</span>
              </div>
            </div>

            <div className="sm:col-span-5 flex justify-center">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-white/10 border border-white/20 p-2 overflow-hidden shadow-inner flex items-center justify-center">
                <img
                  src="/products/atmodesk-pixelsmile-mood-1.jpg"
                  alt="PixelSmile Mood Clock"
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition duration-300"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/15 flex items-center gap-3 relative z-10">
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              transition={TACTILE_SPRING}
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
              className="flex-1 py-3 px-4 rounded-full bg-white hover:bg-slate-100 text-[#0A9EE6] font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Buy with Cash on Delivery</span>
            </motion.button>

            <Link
              href="/product/atmodesk-pixelsmile-mood-clock-voice-activated-led-nightlight-ufd3"
              className="py-3 px-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition border border-white/20"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
