// src/app/about/page.tsx
import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Banknote,
  Users,
  Compass,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Clock,
  HeartHandshake,
  Cpu,
  MessageCircle,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us — ATMODESK Bangladesh | Aesthetic Smart Clocks & Desk Tech',
  description:
    'ATMODESK.bd is Bangladesh’s premium destination for aesthetic desk setups. Founded with the mission to bring global-quality smart clocks, weather stations, and ambient desk gadgets to Bangladesh at affordable prices.',
  openGraph: {
    title: 'About Us — ATMODESK Bangladesh',
    description:
      'Discover the story behind ATMODESK.bd. Curating premium smart clocks, weather stations, and ambient desk tech in Dhaka, Bangladesh.',
    url: 'https://atmodeskbd-eo1e.vercel.app/about',
    siteName: 'ATMODESK BD',
    locale: 'en_BD',
    type: 'website',
  },
}

export default function AboutPage() {
  const whyChooseUsCards = [
    {
      icon: ShieldCheck,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200/60',
      title: 'Authentic Products',
      tagline: '100% Verified Quality',
      description:
        'Every smart clock, weather station, and desk gadget is sourced directly from verified OEM manufacturers and quality-tested in Dhaka before dispatch.',
    },
    {
      icon: Truck,
      iconBg: 'bg-sky-50 text-[#0071e3] border-sky-200/60',
      title: 'Fast Delivery',
      tagline: '24–48h Dhaka · 3–5 Days Nationwide',
      description:
        'Rapid fulfillment from our Dhaka warehouse. Get your desk upgrade within 24 to 48 hours in Dhaka, or 3 to 5 business days across all 64 districts.',
    },
    {
      icon: Banknote,
      iconBg: 'bg-amber-50 text-amber-600 border-amber-200/60',
      title: 'Cash on Delivery',
      tagline: '100% Zero-Risk Shopping',
      description:
        'Pay safely in cash when the courier hands your parcel at your doorstep. No mandatory advance payment, so you can shop with complete peace of mind.',
    },
    {
      icon: RotateCcw,
      iconBg: 'bg-purple-50 text-purple-600 border-purple-200/60',
      title: '7-Day Replacement',
      tagline: 'Hassle-Free Protection',
      description:
        'Received an item with a transit defect or hardware fault? Message our WhatsApp or Facebook team for a swift, no-questions-asked 7-day replacement.',
    },
  ]

  const missionPillars = [
    {
      icon: Sparkles,
      title: 'Aesthetic First',
      description:
        'We believe a beautiful workspace breeds clear thinking and creative joy. Every piece in our catalog is hand-picked for desk appeal.',
    },
    {
      icon: Cpu,
      title: 'Smart & Functional',
      description:
        'From real-time WiFi weather telemetry to customizable pixel art and ambient RGB backlighting, our gadgets do more than tell time.',
    },
    {
      icon: HeartHandshake,
      title: 'Customer-Centric Care',
      description:
        'Direct human support via WhatsApp and Messenger. We guide you through initial setup, WiFi syncing, and troubleshooting every step of the way.',
    },
  ]

  return (
    <div className="space-y-12 sm:space-y-16 pb-20 bg-[#fafafa]">
      {/* --- 1. HERO SECTION (Apple Liquid Glass) ---------------- */}
      <section className="relative overflow-hidden pt-8 sm:pt-12 pb-12 sm:pb-16" aria-label="About Hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="relative rounded-[32px] sm:rounded-[40px] bg-gradient-to-br from-white via-[#f8f9fa] to-sky-50/50 border border-black/[0.08] p-8 sm:p-14 lg:p-16 shadow-xs overflow-hidden">
            {/* Ambient specular glows */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#0071e3]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0071e3]/10 border border-[#0071e3]/20 text-[#0071e3] text-xs font-bold uppercase tracking-wider shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Our Story &amp; Vision · Dhaka, Bangladesh</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#1d1d1f] leading-[1.08]">
                Elevating Workspaces Across Bangladesh With{' '}
                <span className="text-[#0071e3]">
                  Ambient Desk Tech
                </span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-[#6e6e73] leading-relaxed max-w-2xl mx-auto">
                <strong className="text-[#1d1d1f] font-semibold">ATMODESK.bd</strong> is Bangladesh&apos;s premium destination
                for aesthetic desk setups. Founded with the mission to bring global-quality smart clocks, weather stations,
                and ambient desk gadgets to Bangladesh at affordable prices.
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold text-sm shadow-md shadow-[#0071e3]/20 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="https://wa.me/8801318043562"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-[#f5f5f7] text-[#1d1d1f] font-bold text-sm border border-black/[0.08] shadow-xs transition-all hover:scale-[1.02] active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp Support</span>
                </a>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-black/[0.06] relative z-10">
              <div className="text-center p-4 rounded-2xl bg-white/80 border border-black/[0.06] shadow-xs">
                <div className="text-2xl sm:text-3xl font-black text-[#0071e3] tabular">100%</div>
                <div className="text-xs text-[#6e6e73] mt-1 font-semibold">Authentic OEM Products</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-white/80 border border-black/[0.06] shadow-xs">
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 tabular">24–48h</div>
                <div className="text-xs text-[#6e6e73] mt-1 font-semibold">Dhaka Express Delivery</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-white/80 border border-black/[0.06] shadow-xs">
                <div className="text-2xl sm:text-3xl font-black text-amber-600 tabular">64 Districts</div>
                <div className="text-xs text-[#6e6e73] mt-1 font-semibold">Cash on Delivery</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-white/80 border border-black/[0.06] shadow-xs">
                <div className="text-2xl sm:text-3xl font-black text-purple-600 tabular">7 Days</div>
                <div className="text-xs text-[#6e6e73] mt-1 font-semibold">Replacement Guarantee</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 2. OUR MISSION SECTION ------------------------------ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="liquid-glass-card bg-white border border-black/[0.08] rounded-[32px] sm:rounded-[36px] p-8 sm:p-12 shadow-xs space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0071e3]/10 text-[#0071e3] text-xs font-bold uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5" />
                <span>Our Mission</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1d1d1f] tracking-tight">
                Bringing Inspiring Desk Culture To Bangladesh
              </h2>
              <p className="text-[#6e6e73] text-sm sm:text-base leading-relaxed">
                We spend our most creative, ambitious hours sitting at our desks — writing code, designing interfaces,
                studying late into the night, managing businesses, or creating content. Yet, desk accessories available
                locally were either generic, overpriced, or took weeks to arrive via unreliable overseas shipments.
              </p>
              <p className="text-[#6e6e73] text-sm sm:text-base leading-relaxed">
                <strong className="text-[#1d1d1f]">ATMODESK.bd</strong> was created to change that reality. We curate viral, aesthetic, and functional
                desk gadgets from around the globe — IPS weather stations, Nixie retro tube displays, animated pixel
                clocks, and ambient backlights — bringing them to Bangladesh with fast local delivery and Cash on Delivery.
              </p>
            </div>

            <div className="lg:col-span-5 bg-gradient-to-br from-[#1d1d1f] to-[#2c2c2e] text-white rounded-[28px] p-6 sm:p-8 space-y-5 shadow-lg">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#32ade6]" />
                The ATMODESK Promise
              </h3>
              <ul className="space-y-3.5 text-xs sm:text-sm text-white/80">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Strict Quality Control:</strong> Every unit is tested with Bangladesh
                    voltage and WiFi networks before leaving our Dhaka warehouse.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Zero Advance Risk:</strong> Always Cash on Delivery. Check your parcel
                    when it arrives at your doorstep.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Local Dhaka Support:</strong> Fast guidance via WhatsApp and Facebook
                    Messenger 7 days a week.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* 3 Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-6 border-t border-black/[0.06]">
            {missionPillars.map((pillar) => {
              const Icon = pillar.icon
              return (
                <div
                  key={pillar.title}
                  className="p-6 rounded-2xl bg-[#f5f5f7] border border-black/[0.04] space-y-2.5 transition hover:bg-white hover:shadow-xs hover:border-black/[0.08]"
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-black/[0.06] text-[#0071e3] flex items-center justify-center shadow-xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-[#1d1d1f] text-base">{pillar.title}</h3>
                  <p className="text-xs sm:text-sm text-[#6e6e73] leading-relaxed">{pillar.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* --- 3. WHY CHOOSE US SECTION ---------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="px-3.5 py-1 bg-[#0071e3]/10 text-[#0071e3] font-bold text-xs rounded-full uppercase tracking-wider">
            Why Shop With Us
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1d1d1f] tracking-tight">
            Why Choose ATMODESK.bd
          </h2>
          <p className="text-xs sm:text-sm text-[#6e6e73]">
            We combine premium international aesthetics with reliable local service in Bangladesh.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {whyChooseUsCards.map((card) => {
            const Icon = card.icon
            return (
              <div
                key={card.title}
                className="liquid-glass-card bg-white border border-black/[0.08] rounded-[28px] p-6 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-4">
                  <div
                    className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${card.iconBg} transition-transform group-hover:scale-105 shadow-xs`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-[#0071e3] uppercase tracking-wider">
                      {card.tagline}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors">
                      {card.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-[#6e6e73] leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-black/[0.06] flex items-center text-xs font-semibold text-[#86868b]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
                  <span>Guaranteed by ATMODESK</span>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* --- 4. FOUNDER / TEAM SECTION --------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[32px] sm:rounded-[40px] bg-white border border-black/[0.08] p-8 sm:p-12 shadow-xs overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0071e3]/10 text-[#0071e3] text-xs font-bold uppercase tracking-wider">
              <Users className="w-3.5 h-3.5" />
              <span>Behind the Brand</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1d1d1f] tracking-tight">
              Founded by Tech Enthusiasts in Dhaka
            </h2>

            <div className="space-y-4 text-[#6e6e73] text-sm sm:text-base leading-relaxed">
              <p>
                ATMODESK.bd was started by a group of tech enthusiasts and desk setup creators right here in{' '}
                <strong className="text-[#1d1d1f]">New Eskaton, Dhaka</strong>. Like many of our customers, we spent hours
                curating our workstations, seeking that ideal balance between productive minimalism and ambient warmth.
              </p>
              <p>
                Seeing how difficult it was to find genuine smart clocks and ambient weather stations in Bangladesh without
                risking broken imports or weeks of customs delays, we decided to solve it for our entire community.
              </p>
              <p>
                Today, we take pride in serving tech lovers, software engineers, content creators, and remote workers
                across every district in Bangladesh — ensuring every parcel arrives safely with zero risk.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-[#1d1d1f] font-medium border-t border-black/[0.06]">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#0071e3]" />
                <span>New Eskaton, Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Active 10:00 AM – 10:00 PM (Sat–Thu BST)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 5. CONTACT CTA AT BOTTOM ---------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#0071e3] to-[#0077ed] text-white rounded-[32px] sm:rounded-[36px] p-8 sm:p-12 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <span className="px-3 py-1 bg-white/20 text-white font-bold text-xs rounded-full uppercase tracking-wider">
                We&apos;re Here to Help
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Have Questions or Need Help Choosing?
              </h2>
              <p className="text-sm sm:text-base text-white/90 max-w-xl">
                Whether you need advice on which smart clock suits your desk or want to track an active order, our Dhaka
                team is ready to assist you instantly.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <a
                href="https://wa.me/8801318043562"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-md transition transform hover:scale-[1.02] active:scale-95 text-center"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>

              <a
                href="https://www.facebook.com/people/Atmodeskbd/61593715040434/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-white hover:bg-[#f5f5f7] text-[#1d1d1f] font-bold text-sm shadow-md transition transform hover:scale-[1.02] active:scale-95 text-center"
              >
                <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Visit Facebook Page</span>
              </a>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition text-center"
              >
                <span>Send a Message via Contact Form</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
