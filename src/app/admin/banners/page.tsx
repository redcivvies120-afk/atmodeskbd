// src/app/admin/banners/page.tsx
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Image as ImageIcon,
  Layers,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  Flame,
  Layout,
  Maximize2,
  Smartphone,
  Monitor,
} from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface BannerDef {
  id: string
  name: string
  position: string
  gridArea: string
  dimensions: string
  aspectRatio: string
  productName: string
  productSlug: string
  image: string
  fallbackImages: string[]
  badge: string
  priceBDT: number
  regularBDT: number
  status: 'ACTIVE' | 'SCHEDULED' | 'DRAFT'
  deviceSupport: string
}

const BANNERS: BannerDef[] = [
  {
    id: 'banner-1',
    name: 'Banner One (Hero Main Slider)',
    position: 'Hero Section — Main Banner (Left 3fr / 8-cols on desktop, Full Width on mobile)',
    gridArea: 'hero .main',
    dimensions: '1200 × 470 px',
    aspectRatio: '1200/470 (2.55 : 1)',
    productName: 'WeatherStation Mini (Flagship 2026)',
    productSlug: 'atmodesk-weatherstation-mini-wifi-desk-clock',
    image: '/products/atmodesk-weatherstation-mini-1.jpg',
    fallbackImages: [
      '/products/atmodesk-weatherstation-mini-1.jpg',
      '/products/atmodesk-weatherstation-mini-2.webp',
      '/products/atmodesk-weatherstation-mini-3.jpg',
    ],
    badge: 'FLAGSHIP · 2026 EDITION',
    priceBDT: 1599,
    regularBDT: 2499,
    status: 'ACTIVE',
    deviceSupport: 'Desktop, Tablet, Mobile (Touch swipe enabled)',
  },
  {
    id: 'banner-2',
    name: 'Banner Two (Hero Top-Right Side Banner)',
    position: 'Hero Section — Top Side Banner (Right 1fr / 4-cols on desktop, Top in stack)',
    gridArea: 'hero .side .ph (Top)',
    dimensions: '400 × 230 px',
    aspectRatio: '400/230 (1.74 : 1)',
    productName: 'GravityCube Pro (Dual-Mode Pomodoro)',
    productSlug: 'atmodesk-gravitycube-pro-pomodoro-timer',
    image: '/products/atmodesk-gravitycube-pro-1.jpg',
    fallbackImages: [
      '/products/atmodesk-gravitycube-pro-1.jpg',
      '/products/atmodesk-gravitycube-pro-2.jpg',
    ],
    badge: 'TRENDING FOCUS TOOL (-35%)',
    priceBDT: 1499,
    regularBDT: 2299,
    status: 'ACTIVE',
    deviceSupport: 'Desktop, Tablet, Mobile (Stacked side card)',
  },
  {
    id: 'banner-3',
    name: 'Banner Three (Hero Bottom-Right Side Banner)',
    position: 'Hero Section — Bottom Side Banner (Right 1fr / 4-cols on desktop, Bottom in stack)',
    gridArea: 'hero .side .ph (Bottom)',
    dimensions: '400 × 230 px',
    aspectRatio: '400/230 (1.74 : 1)',
    productName: 'PixelSmile Mood Clock (Voice LED)',
    productSlug: 'atmodesk-pixelsmile-mood-clock-voice-activated-led-nightlight-ufd3',
    image: '/products/atmodesk-pixelsmile-mood-1.jpg',
    fallbackImages: [
      '/products/atmodesk-pixelsmile-mood-1.jpg',
      '/products/atmodesk-pixelsmile-mood-2.webp',
      '/products/atmodesk-pixelsmile-mood-3.jpg',
    ],
    badge: 'VOICE-ACTIVATED (-41%)',
    priceBDT: 1699,
    regularBDT: 2899,
    status: 'ACTIVE',
    deviceSupport: 'Desktop, Tablet, Mobile (Stacked side card)',
  },
  {
    id: 'banner-4',
    name: 'Campaign Banner Left (Mid-Page)',
    position: 'Mid-Page Section — Left Half Banner (.two container)',
    gridArea: 'section .two .ph (Left)',
    dimensions: '750 × 190 px',
    aspectRatio: '750/190 (3.95 : 1)',
    productName: 'GravityCube Focus Setup Campaign',
    productSlug: 'atmodesk-gravitycube-pro-pomodoro-timer',
    image: '/products/atmodesk-gravitycube-pro-2.jpg',
    fallbackImages: ['/products/atmodesk-gravitycube-pro-1.jpg'],
    badge: 'FOCUS & PRODUCTIVITY',
    priceBDT: 1499,
    regularBDT: 2299,
    status: 'ACTIVE',
    deviceSupport: 'Desktop (1/2 width), Mobile (Full width stacked)',
  },
  {
    id: 'banner-5',
    name: 'Campaign Banner Right (Mid-Page)',
    position: 'Mid-Page Section — Right Half Banner (.two container)',
    gridArea: 'section .two .ph (Right)',
    dimensions: '750 × 190 px',
    aspectRatio: '750/190 (3.95 : 1)',
    productName: 'PixelSmile Warm Ambient LED Campaign',
    productSlug: 'atmodesk-pixelsmile-mood-clock-voice-activated-led-nightlight-ufd3',
    image: '/products/atmodesk-pixelsmile-mood-2.webp',
    fallbackImages: ['/products/atmodesk-pixelsmile-mood-1.jpg'],
    badge: 'SMART BEDROOM AMBIENCE',
    priceBDT: 1699,
    regularBDT: 2899,
    status: 'ACTIVE',
    deviceSupport: 'Desktop (1/2 width), Mobile (Full width stacked)',
  },
]

export default function AdminBannersPage() {
  return (
    <div className="space-y-8 p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Layout className="w-3.5 h-3.5" /> Storefront Hero &amp; Banners Manager
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Banner Positioning &amp; Asset Mapping
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official 14-section retail architecture blueprint matching Apple Gadgets BD layout.
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-xs transition"
        >
          <span>View Live Storefront</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Visual Blueprint Diagram (Matching Cloud HTML Layout) */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-widest text-sky-400">
            CSS Grid Layout Wireframe · 1280px Container
          </span>
          <span className="text-xs text-slate-400">Responsive Breakpoints: 820px, 600px</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 font-mono text-xs text-center">
          {/* Main Banner 1 (8 cols) */}
          <div className="lg:col-span-8 p-6 rounded-2xl bg-sky-500/20 border-2 border-sky-400/50 flex flex-col items-center justify-center min-h-[160px] space-y-2">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-400 text-slate-950 font-bold text-[11px]">
              Banner 1: Main Banner (1200 × 470)
            </span>
            <span className="text-slate-300">Position: Hero Grid Left (3fr) · Auto-play Carousel</span>
            <span className="text-[10px] text-sky-300">WeatherStation Mini · GravityCube · PixelSmile</span>
          </div>

          {/* Side Banners (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <div className="p-4 rounded-2xl bg-amber-500/20 border-2 border-amber-400/50 flex flex-col items-center justify-center min-h-[75px] space-y-1">
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold text-[10px]">
                Banner 2: Side Top (400 × 230)
              </span>
              <span className="text-[11px] text-slate-300">GravityCube Pro · ৳1,499</span>
            </div>

            <div className="p-4 rounded-2xl bg-rose-500/20 border-2 border-rose-400/50 flex flex-col items-center justify-center min-h-[75px] space-y-1">
              <span className="px-2 py-0.5 rounded-full bg-rose-400 text-slate-950 font-bold text-[10px]">
                Banner 3: Side Bottom (400 × 230)
              </span>
              <span className="text-[11px] text-slate-300">PixelSmile Mood · ৳1,699</span>
            </div>
          </div>

          {/* Mid Page Banners (750x190) */}
          <div className="lg:col-span-6 p-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 text-[11px]">
            Banner 4: Mid-Page Left (750 × 190) · Focus Campaign
          </div>
          <div className="lg:col-span-6 p-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 text-[11px]">
            Banner 5: Mid-Page Right (750 × 190) · Mood Ambience Campaign
          </div>
        </div>
      </div>

      {/* Banner Cards with Real Pictures and Detailed Positioning */}
      <div className="space-y-6">
        <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-sky-600" />
          Active Banner Inventory &amp; Position Mapping
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {BANNERS.slice(0, 3).map((b) => (
            <div
              key={b.id}
              className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition group"
            >
              <div className="space-y-3">
                {/* Position Badge & Status */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 font-mono font-bold text-[10px] uppercase border border-sky-200/60">
                    {b.id.toUpperCase()}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> ACTIVE
                  </span>
                </div>

                {/* Banner Name & Positioning */}
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base group-hover:text-sky-600 transition">
                    {b.name}
                  </h3>
                  <div className="text-xs font-semibold text-slate-500 mt-1">
                    📍 <strong className="text-slate-800">Positioning:</strong> {b.position}
                  </div>
                </div>

                {/* Real Picture Container */}
                <div className="relative w-full aspect-[16/10] rounded-2xl bg-slate-100 overflow-hidden border border-slate-200/80 group-hover:border-sky-300 transition">
                  <img
                    src={b.image}
                    alt={b.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono text-white">
                    {b.dimensions}
                  </div>
                </div>

                {/* Specs List */}
                <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100 font-mono">
                  <div>
                    <span className="text-slate-400">CSS Grid Area:</span>{' '}
                    <code className="text-sky-600 font-bold">{b.gridArea}</code>
                  </div>
                  <div>
                    <span className="text-slate-400">Aspect Ratio:</span>{' '}
                    <span className="font-semibold text-slate-800">{b.aspectRatio}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Featured Item:</span>{' '}
                    <span className="font-semibold text-slate-800">{b.productName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Price In Banner:</span>{' '}
                    <span className="font-bold text-slate-900">৳{b.priceBDT.toLocaleString()}</span>{' '}
                    <span className="line-through text-slate-400 text-[11px]">৳{b.regularBDT.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  href={`/product/${b.productSlug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:underline"
                >
                  <span>Preview Product Page</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-[10px] text-slate-400">Synced with DB</span>
              </div>
            </div>
          ))}
        </div>

        {/* Mid-Page Campaign Banners 4 & 5 */}
        <div className="mt-8 pt-6 border-t border-slate-200 space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
            Mid-Page Campaign Pair Banners (750 × 190 px)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {BANNERS.slice(3).map((b) => (
              <div
                key={b.id}
                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-3 hover:shadow-md transition group"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono font-bold text-[10px] uppercase">
                    {b.id.toUpperCase()}
                  </span>
                  <span className="text-xs font-mono text-slate-500">{b.dimensions}</span>
                </div>

                <div className="relative w-full aspect-[750/190] rounded-xl bg-slate-100 overflow-hidden border border-slate-200">
                  <img
                    src={b.image}
                    alt={b.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{b.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    📍 <strong>Position:</strong> {b.position}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
