// src/components/home/TrustBadgesStrip.tsx
'use client'

import React from 'react'
import { Truck, ShieldCheck, RotateCcw, Zap, MessageCircle } from 'lucide-react'
import { LiquidIcon, type LiquidTone } from '@/components/shared/LiquidIcon'

const TRUST_POINTS: {
  icon: typeof Truck
  tone: LiquidTone
  title: string
  subtitle: string
  highlight?: string
}[] = [
  {
    icon: Truck,
    tone: 'sky',
    title: 'Fast Express Delivery',
    subtitle: '24–48h in Dhaka · 3-5 days across 64 districts',
    highlight: 'Dhaka 24-48h',
  },
  {
    icon: ShieldCheck,
    tone: 'green',
    title: 'Cash on Delivery',
    subtitle: 'Inspect when courier arrives before paying',
    highlight: 'Zero Risk',
  },
  {
    icon: RotateCcw,
    tone: 'violet',
    title: '7-Day Replacement',
    subtitle: 'Guaranteed swap on defects or transit damage',
    highlight: 'Official Policy',
  },
  {
    icon: Zap,
    tone: 'amber',
    title: 'Pre-Tested Quality',
    subtitle: 'Calibrated & checked in Bangladesh first',
    highlight: '100% Tested',
  },
  {
    icon: MessageCircle,
    tone: 'teal',
    title: 'WhatsApp Helpline',
    subtitle: 'Text +880 1318-043562 for live support',
    highlight: 'Instant Chat',
  },
]

export function TrustBadgesStrip() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6" aria-label="Customer Guarantees">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        {TRUST_POINTS.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.title}
              className="liquid-glass-card rounded-2xl p-4 sm:p-4.5 border border-black/[0.06] bg-white flex flex-col justify-between gap-2.5 shadow-xs hover:shadow-sm hover:border-black/15 transition group"
            >
              <div className="flex items-center justify-between">
                <LiquidIcon icon={Icon} tone={item.tone} variant="glass" size="sm" lift />
                {item.highlight && (
                  <span className="text-[10px] font-bold text-[#0071e3] bg-[#0071e3]/10 px-2 py-0.5 rounded-full">
                    {item.highlight}
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#1d1d1f] group-hover:text-[#0071e3] transition">
                  {item.title}
                </h3>
                <p className="text-[11px] text-[#6e6e73] leading-snug mt-0.5">
                  {item.subtitle}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
