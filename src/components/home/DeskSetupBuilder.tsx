// src/components/home/DeskSetupBuilder.tsx
'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { formatBDT } from '@/lib/utils'
import { useCart } from '@/store/cart'
import { useToast } from '@/components/shared/Providers'
import { MORPH_SPRING, TACTILE_SPRING } from '@/components/shared/LiquidMotion'
import {
  SlidersHorizontal,
  Clock,
  Sparkles,
  Zap,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Palette,
  PackageCheck,
} from 'lucide-react'

// Step 1: Centerpiece Products (Real from DB)
const CENTERPIECES = [
  {
    id: 'cmtvs1qob0001qbvsafeznftn',
    name: 'WeatherStation Mini',
    subtitle: 'WiFi Smart Desk Clock with Live Dhaka Weather',
    price: 1599,
    originalPrice: 2499,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    slug: 'atmodesk-weatherstation-mini-wifi-desk-clock',
  },
  {
    id: 'cmtvsizab0001cfkj9x8tdtap',
    name: 'GravityCube Pro',
    subtitle: 'Dual-Mode Gyroscope Pomodoro Focus Timer',
    price: 1499,
    originalPrice: 2299,
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80',
    slug: 'atmodesk-gravitycube-pro-pomodoro-timer',
  },
  {
    id: 'cmus997340001mxx1sdqqufd3',
    name: 'PixelSmile Mood Clock',
    subtitle: 'Voice-Activated LED Smart Nightlight',
    price: 1699,
    originalPrice: 2899,
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80',
    slug: 'atmodesk-pixelsmile-mood-clock-voice-activated-led-nightlight-ufd3',
  },
]

// Step 2: Ambient Lighting Accents
const LIGHTING_ACCENTS = [
  {
    id: 'ambient-warm-lamp',
    name: 'Warm Sunset Ambient Lamp',
    subtitle: '3000K Soft Glow Touch Dimmable Light',
    price: 999,
    originalPrice: 1500,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80',
    tag: 'Popular',
  },
  {
    id: 'ambient-monitor-bar',
    name: 'AtmoBar Screen Lightbar',
    subtitle: 'Asymmetric Eye-Care USB Monitor Bar',
    price: 1450,
    originalPrice: 2200,
    image: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=600&q=80',
    tag: 'Ergonomic',
  },
  {
    id: 'ambient-none',
    name: 'No Ambient Light',
    subtitle: 'Keep setup minimalist without light',
    price: 0,
    originalPrice: 0,
    image: '',
    tag: 'Skip',
  },
]

// Step 3: Power & Desk Mat Add-on
const ACCESSORIES = [
  {
    id: 'acc-leather-mat',
    name: 'Vegan Leather Desk Pad (90x40cm)',
    subtitle: 'Waterproof Dual-sided Midnight Black / Studio Grey',
    price: 650,
    originalPrice: 950,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80',
    tag: 'Best Seller',
  },
  {
    id: 'acc-fast-hub',
    name: '65W GaN Fast Charging Dock',
    subtitle: '3x USB-C + 1x USB-A Desktop Power Hub',
    price: 1350,
    originalPrice: 1950,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80',
    tag: 'Superfast',
  },
  {
    id: 'acc-none',
    name: 'No Extra Surface Tech',
    subtitle: 'Skip desk surface accessories',
    price: 0,
    originalPrice: 0,
    image: '',
    tag: 'Skip',
  },
]

export function DeskSetupBuilder() {
  const router = useRouter()
  const { addItem } = useCart()
  const { toast } = useToast()

  const [selectedCenter, setSelectedCenter] = useState(CENTERPIECES[0])
  const [selectedLight, setSelectedLight] = useState(LIGHTING_ACCENTS[0])
  const [selectedAcc, setSelectedAcc] = useState(ACCESSORIES[0])

  // Calculation
  const subtotal = selectedCenter.price + selectedLight.price + selectedAcc.price
  const originalSubtotal =
    selectedCenter.originalPrice + selectedLight.originalPrice + selectedAcc.originalPrice
  // 10% Bundle Discount
  const bundleDiscount = Math.round(subtotal * 0.1)
  const bundleTotal = subtotal - bundleDiscount
  const totalSavings = originalSubtotal - bundleTotal

  const handleOrderSetup = () => {
    // Add centerpiece to cart
    addItem({
      id: selectedCenter.id,
      productId: selectedCenter.id,
      name: `[Setup Bundle] ${selectedCenter.name}`,
      slug: selectedCenter.slug,
      image: selectedCenter.image,
      price: selectedCenter.price,
      originalPrice: selectedCenter.originalPrice,
      stock: 10,
      quantity: 1,
      openDrawer: false,
    })

    // If light selected
    if (selectedLight.id !== 'ambient-none') {
      addItem({
        id: selectedLight.id,
        productId: selectedLight.id,
        name: `[Setup Bundle] ${selectedLight.name}`,
        slug: selectedCenter.slug,
        image: selectedLight.image,
        price: selectedLight.price,
        originalPrice: selectedLight.originalPrice,
        stock: 10,
        quantity: 1,
        openDrawer: false,
      })
    }

    // If accessory selected
    if (selectedAcc.id !== 'acc-none') {
      addItem({
        id: selectedAcc.id,
        productId: selectedAcc.id,
        name: `[Setup Bundle] ${selectedAcc.name}`,
        slug: selectedCenter.slug,
        image: selectedAcc.image,
        price: selectedAcc.price,
        originalPrice: selectedAcc.originalPrice,
        stock: 10,
        quantity: 1,
        openDrawer: false,
      })
    }

    toast('Desk Setup bundle added! Proceeding to Cash on Delivery checkout...')
    router.push('/checkout')
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="desk-builder">
      <div className="liquid-glass-card rounded-[36px] p-6 sm:p-10 md:p-12 border border-black/[0.08] shadow-xl relative overflow-hidden bg-gradient-to-b from-white via-[#fafafa] to-[#F3F7FB]">
        {/* Specular Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0077C8]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10 pb-6 border-b border-black/[0.06]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#0077C8]/10 px-3.5 py-1 text-xs font-bold text-[#0077C8] mb-3">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>ATMODESK STUDIO · INTERACTIVE BUILDER</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#0F2138]">
              Build Your Dream Ambient Desk
            </h2>
            <p className="text-sm sm:text-base text-[#5B6B80] max-w-2xl mt-1.5">
              Customize your workstation centerpiece, ambient lighting, and desk surface accessories. Get an instant{' '}
              <strong className="text-[#0077C8]">10% Bundle Discount</strong> with Cash on Delivery nationwide.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200/50 w-fit">
            <CheckCircle2 className="w-4 h-4" />
            <span>Pre-tested &amp; verified in Dhaka</span>
          </div>
        </div>

        {/* Interactive 3-Step Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          {/* Steps Column (Left 8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Step 1: Centerpiece */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0F2138]">
                  <span className="w-6 h-6 rounded-full bg-[#0077C8] text-white flex items-center justify-center text-xs font-black">
                    1
                  </span>
                  Choose Smart Centerpiece
                </span>
                <span className="text-xs text-[#5B6B80]">WiFi Weather &amp; Clocks</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {CENTERPIECES.map((item) => {
                  const isSelected = selectedCenter.id === item.id
                  return (
                    <motion.button
                      key={item.id}
                      type="button"
                      whileTap={{ scale: 0.98 }}
                      transition={TACTILE_SPRING}
                      onClick={() => setSelectedCenter(item)}
                      className={`text-left rounded-2xl p-4 transition-all duration-200 border flex flex-col justify-between relative ${
                        isSelected
                          ? 'bg-white border-[#0077C8] shadow-md ring-2 ring-[#0077C8]/20'
                          : 'bg-white/80 border-black/[0.08] hover:border-black/20 hover:bg-white'
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute top-3 right-3 text-[#0077C8]">
                          <CheckCircle2 className="w-4 h-4 fill-[#0077C8] text-white" />
                        </span>
                      )}
                      <div>
                        <div className="text-xs font-bold text-[#0F2138]">{item.name}</div>
                        <p className="text-[11px] text-[#5B6B80] line-clamp-2 mt-0.5 leading-snug">
                          {item.subtitle}
                        </p>
                      </div>
                      <div className="mt-4 pt-2 border-t border-black/[0.06] flex items-baseline gap-2">
                        <span className="text-sm font-bold text-[#0F2138] tabular">{formatBDT(item.price)}</span>
                        <span className="text-[10px] text-[#86868b] line-through tabular">
                          {formatBDT(item.originalPrice)}
                        </span>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* Step 2: Lighting Accents */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0F2138]">
                  <span className="w-6 h-6 rounded-full bg-[#0077C8] text-white flex items-center justify-center text-xs font-black">
                    2
                  </span>
                  Choose Ambient Lighting
                </span>
                <span className="text-xs text-[#5B6B80]">Eye-care &amp; Mood</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {LIGHTING_ACCENTS.map((item) => {
                  const isSelected = selectedLight.id === item.id
                  return (
                    <motion.button
                      key={item.id}
                      type="button"
                      whileTap={{ scale: 0.98 }}
                      transition={TACTILE_SPRING}
                      onClick={() => setSelectedLight(item)}
                      className={`text-left rounded-2xl p-4 transition-all duration-200 border flex flex-col justify-between relative ${
                        isSelected
                          ? 'bg-white border-[#0077C8] shadow-md ring-2 ring-[#0077C8]/20'
                          : 'bg-white/80 border-black/[0.08] hover:border-black/20 hover:bg-white'
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute top-3 right-3 text-[#0077C8]">
                          <CheckCircle2 className="w-4 h-4 fill-[#0077C8] text-white" />
                        </span>
                      )}
                      <div>
                        <div className="text-xs font-bold text-[#0F2138]">{item.name}</div>
                        <p className="text-[11px] text-[#5B6B80] line-clamp-2 mt-0.5 leading-snug">
                          {item.subtitle}
                        </p>
                      </div>
                      <div className="mt-4 pt-2 border-t border-black/[0.06] flex items-baseline gap-2">
                        {item.price > 0 ? (
                          <>
                            <span className="text-sm font-bold text-[#0F2138] tabular">
                              +{formatBDT(item.price)}
                            </span>
                            <span className="text-[10px] text-[#86868b] line-through tabular">
                              {formatBDT(item.originalPrice)}
                            </span>
                          </>
                        ) : (
                          <span className="text-xs font-semibold text-[#86868b]">None (৳0)</span>
                        )}
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* Step 3: Desk Surface & Power */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0F2138]">
                  <span className="w-6 h-6 rounded-full bg-[#0077C8] text-white flex items-center justify-center text-xs font-black">
                    3
                  </span>
                  Choose Power &amp; Surface
                </span>
                <span className="text-xs text-[#5B6B80]">Desk Organization</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {ACCESSORIES.map((item) => {
                  const isSelected = selectedAcc.id === item.id
                  return (
                    <motion.button
                      key={item.id}
                      type="button"
                      whileTap={{ scale: 0.98 }}
                      transition={TACTILE_SPRING}
                      onClick={() => setSelectedAcc(item)}
                      className={`text-left rounded-2xl p-4 transition-all duration-200 border flex flex-col justify-between relative ${
                        isSelected
                          ? 'bg-white border-[#0077C8] shadow-md ring-2 ring-[#0077C8]/20'
                          : 'bg-white/80 border-black/[0.08] hover:border-black/20 hover:bg-white'
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute top-3 right-3 text-[#0077C8]">
                          <CheckCircle2 className="w-4 h-4 fill-[#0077C8] text-white" />
                        </span>
                      )}
                      <div>
                        <div className="text-xs font-bold text-[#0F2138]">{item.name}</div>
                        <p className="text-[11px] text-[#5B6B80] line-clamp-2 mt-0.5 leading-snug">
                          {item.subtitle}
                        </p>
                      </div>
                      <div className="mt-4 pt-2 border-t border-black/[0.06] flex items-baseline gap-2">
                        {item.price > 0 ? (
                          <>
                            <span className="text-sm font-bold text-[#0F2138] tabular">
                              +{formatBDT(item.price)}
                            </span>
                            <span className="text-[10px] text-[#86868b] line-through tabular">
                              {formatBDT(item.originalPrice)}
                            </span>
                          </>
                        ) : (
                          <span className="text-xs font-semibold text-[#86868b]">None (৳0)</span>
                        )}
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Live Summary & Order Card (Right 4 cols) */}
          <div className="lg:col-span-4">
            <div className="liquid-glass-card rounded-3xl p-6 border border-black/[0.08] bg-white sticky top-24 space-y-6 shadow-lg">
              <div className="flex items-center justify-between pb-4 border-b border-black/[0.06]">
                <div className="text-sm font-bold text-[#0F2138] uppercase tracking-wider flex items-center gap-2">
                  <PackageCheck className="w-4 h-4 text-[#0077C8]" />
                  Setup Summary
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  10% OFF APPLIED
                </span>
              </div>

              {/* Selected List */}
              <div className="space-y-3 text-xs">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-[#0F2138] font-semibold">
                    1. {selectedCenter.name}
                    <span className="block text-[10px] text-[#5B6B80] font-normal">Centerpiece</span>
                  </div>
                  <span className="font-bold tabular text-[#0F2138]">{formatBDT(selectedCenter.price)}</span>
                </div>

                {selectedLight.price > 0 && (
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-[#0F2138] font-semibold">
                      2. {selectedLight.name}
                      <span className="block text-[10px] text-[#5B6B80] font-normal">Ambient Light</span>
                    </div>
                    <span className="font-bold tabular text-[#0F2138]">+{formatBDT(selectedLight.price)}</span>
                  </div>
                )}

                {selectedAcc.price > 0 && (
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-[#0F2138] font-semibold">
                      3. {selectedAcc.name}
                      <span className="block text-[10px] text-[#5B6B80] font-normal">Surface &amp; Power</span>
                    </div>
                    <span className="font-bold tabular text-[#0F2138]">+{formatBDT(selectedAcc.price)}</span>
                  </div>
                )}
              </div>

              {/* Pricing Breakdown */}
              <div className="pt-4 border-t border-black/[0.06] space-y-2 text-xs">
                <div className="flex items-center justify-between text-[#5B6B80]">
                  <span>Item Subtotal:</span>
                  <span className="tabular font-medium">{formatBDT(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-emerald-600 font-semibold">
                  <span>Bundle Special Discount (10%):</span>
                  <span className="tabular">-{formatBDT(bundleDiscount)}</span>
                </div>
                <div className="flex items-center justify-between text-[#5B6B80]">
                  <span>Delivery inside Dhaka:</span>
                  <span className="text-emerald-700 font-semibold uppercase">Free</span>
                </div>
                <div className="pt-3 border-t border-black/[0.08] flex items-baseline justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#0F2138] block">Special Cash Price:</span>
                    <span className="text-[10px] text-[#86868b] line-through tabular">
                      Regular: {formatBDT(originalSubtotal)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#0077C8] tabular tracking-tight">
                      {formatBDT(bundleTotal)}
                    </span>
                    <span className="block text-[10px] font-bold text-rose-600">
                      You Save {formatBDT(totalSavings)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout CTA */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={TACTILE_SPRING}
                onClick={handleOrderSetup}
                className="w-full py-3.5 px-4 rounded-full bg-[#0077C8] hover:bg-[#0066AD] text-white font-bold text-sm shadow-lg shadow-[#0077C8]/20 flex items-center justify-center gap-2 transition"
              >
                <span>Order Complete Setup (COD)</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              {/* Trust Indicators */}
              <div className="space-y-1.5 pt-2 text-[11px] text-[#5B6B80]">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Cash on Delivery across all 64 districts</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-violet-600 flex-shrink-0" />
                  <span>Strictly 7-Day Replacement Guarantee</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
                  <span>24–48h Express Shipping in Dhaka</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
