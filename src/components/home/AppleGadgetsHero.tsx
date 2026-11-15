// src/components/home/AppleGadgetsHero.tsx
'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'motion/react'
import { formatBDT } from '@/lib/utils'
import { useCart } from '@/store/cart'
import { useToast } from '@/components/shared/Providers'
import { LiveDhakaClock } from '@/components/home/LiveDhakaClock'
import { MORPH_SPRING, TACTILE_SPRING } from '@/components/shared/LiquidMotion'
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Zap,
  Sparkles,
  ShoppingBag,
  Flame,
  Clock,
  Eye,
} from 'lucide-react'

export function AppleGadgetsHero() {
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleBuyNow = (product: {
    id: string
    name: string
    slug: string
    image: string
    price: number
    originalPrice?: number
    stock: number
  }) => {
    addItem({
      ...product,
      productId: product.id,
      quantity: 1,
      openDrawer: true,
    })
    toast(`Added “${product.name}” to your cart`)
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 sm:py-8">
      {/* 2:1 Asymmetrical Hero Grid (Apple Gadgets Architecture) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
        {/* Main Flagship Banner (Left 8 cols) */}
        <div className="lg:col-span-8 liquid-glass-card rounded-[36px] p-6 sm:p-10 border border-black/[0.08] relative overflow-hidden bg-gradient-to-br from-[#f8f9fb] via-white to-[#f0f4f9] flex flex-col justify-between shadow-sm">
          {/* Ambient Specular Highlight */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#0071e3]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Tagline */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1 text-xs font-bold text-[#0071e3] shadow-xs border border-black/[0.06]">
              <Sparkles className="w-3.5 h-3.5 text-[#0071e3]" />
              <span>OFFICIAL FLAGSHIP · 2026 EDITION</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/40">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>In Stock in Dhaka Hub</span>
            </div>
          </div>

          {/* Middle Content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10 my-auto">
            <div className="md:col-span-7 space-y-4 text-center md:text-left">
              <h1 className="text-3xl sm:text-5xl font-black tracking-[-0.03em] leading-[1.08] text-[#1d1d1f]">
                Smart Clocks.
                <br />
                <span className="text-[#0071e3]">Live Dhaka Weather.</span>
                <br />
                Ambient Desk Tech.
              </h1>

              <p className="text-sm sm:text-base text-[#6e6e73] leading-relaxed max-w-md mx-auto md:mx-0">
                Sync live barometric pressure, WiFi BST time, and temperature on your desk. Tested and verified in
                Bangladesh before delivery.
              </p>

              {/* Price & Action */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
                <Link
                  href="/products?category=smart-clocks"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold bg-[#0071e3] hover:bg-[#0077ed] text-white shadow-lg shadow-[#0071e3]/20 transition"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Shop Flagship Clocks</span>
                </Link>

                <a
                  href="#desk-builder"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-full px-6 py-3.5 text-sm font-semibold bg-white hover:bg-[#f5f5f7] text-[#1d1d1f] border border-black/[0.08] shadow-xs transition"
                >
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Build Desk Setup</span>
                </a>
              </div>
            </div>

            {/* Interactive Live Dhaka Clock Telemetry Widget */}
            <div className="md:col-span-5 flex justify-center">
              <div className="w-full max-w-xs scale-90 sm:scale-95 md:scale-100 origin-center">
                <LiveDhakaClock />
              </div>
            </div>
          </div>

          {/* Bottom Trust Ribbon */}
          <div className="relative z-10 pt-6 mt-6 border-t border-black/[0.06] flex flex-wrap items-center justify-between gap-3 text-xs text-[#6e6e73]">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#0071e3]" />
              <span><strong>24-48h</strong> Delivery in Dhaka</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span><strong>Cash on Delivery</strong> nationwide</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-violet-600" />
              <span><strong>7-Day</strong> Replacement Guarantee</span>
            </div>
          </div>
        </div>

        {/* Stacked Side Feature Banners (Right 4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4 sm:gap-6">
          {/* Card 1: GravityCube Pro Pomodoro */}
          <div className="liquid-glass-card rounded-[32px] p-5 sm:p-6 border border-black/[0.08] bg-gradient-to-br from-white to-[#fafafa] flex-1 flex flex-col justify-between relative overflow-hidden group shadow-sm hover:shadow-md transition">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200/50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700">
                  <Flame className="w-3 h-3 text-amber-500" /> TRENDING FOCUS TOOL
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[#1d1d1f] mt-2 group-hover:text-[#0071e3] transition">
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

            <div className="my-3 flex items-center justify-between">
              <div>
                <div className="text-xs text-[#6e6e73]">Special Cash Price:</div>
                <div className="text-xl font-black text-[#1d1d1f] tabular">{formatBDT(1499)}</div>
                <div className="text-[11px] text-[#86868b] line-through tabular">
                  Regular: {formatBDT(2299)}
                </div>
              </div>

              <div className="w-20 h-20 rounded-2xl bg-[#f5f5f7] border border-black/[0.06] overflow-hidden flex items-center justify-center p-2">
                <img
                  src="https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=200&q=80"
                  alt="GravityCube Pro"
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-black/[0.06] flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  handleBuyNow({
                    id: 'cmtvsizab0001cfkj9x8tdtap',
                    name: 'ATMODESK GravityCube Pro — Dual-Mode Pomodoro Timer',
                    slug: 'atmodesk-gravitycube-pro-pomodoro-timer',
                    image:
                      'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80',
                    price: 1499,
                    originalPrice: 2299,
                    stock: 4,
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

          {/* Card 2: PixelSmile Mood Clock */}
          <div className="liquid-glass-card rounded-[32px] p-5 sm:p-6 border border-black/[0.08] bg-gradient-to-br from-white to-[#fafafa] flex-1 flex flex-col justify-between relative overflow-hidden group shadow-sm hover:shadow-md transition">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#0071e3]/10 border border-[#0071e3]/20 px-2.5 py-0.5 text-[10px] font-bold text-[#0071e3]">
                  <Sparkles className="w-3 h-3" /> NEW ARRIVAL
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[#1d1d1f] mt-2 group-hover:text-[#0071e3] transition">
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

            <div className="my-3 flex items-center justify-between">
              <div>
                <div className="text-xs text-[#6e6e73]">Special Cash Price:</div>
                <div className="text-xl font-black text-[#1d1d1f] tabular">{formatBDT(1699)}</div>
                <div className="text-[11px] text-[#86868b] line-through tabular">
                  Regular: {formatBDT(2899)}
                </div>
              </div>

              <div className="w-20 h-20 rounded-2xl bg-[#f5f5f7] border border-black/[0.06] overflow-hidden flex items-center justify-center p-2">
                <img
                  src="https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=200&q=80"
                  alt="PixelSmile Mood Clock"
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-black/[0.06] flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  handleBuyNow({
                    id: 'cmus997340001mxx1sdqqufd3',
                    name: 'ATMODESK PixelSmile Mood Clock — Voice-Activated LED Nightlight',
                    slug: 'atmodesk-pixelsmile-mood-clock-voice-activated-led-nightlight-ufd3',
                    image:
                      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80',
                    price: 1699,
                    originalPrice: 2899,
                    stock: 4,
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
