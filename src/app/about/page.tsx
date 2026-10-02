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
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      title: 'Authentic Products',
      tagline: '100% Verified Quality',
      description:
        'Every smart clock, weather station, and desk gadget is sourced directly from verified OEM manufacturers and quality-tested in Dhaka before dispatch.',
    },
    {
      icon: Truck,
      iconBg: 'bg-sky-50 text-sky-600 border-sky-100',
      title: 'Fast Delivery',
      tagline: '24–48h Dhaka · 3–5 Days Nationwide',
      description:
        'Rapid fulfillment from our Dhaka warehouse. Get your desk upgrade within 24 to 48 hours in Dhaka, or 3 to 5 business days across all 64 districts.',
    },
    {
      icon: Banknote,
      iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
      title: 'Cash on Delivery',
      tagline: '100% Zero-Risk Shopping',
      description:
        'Pay safely in cash when the courier hands your parcel at your doorstep. No mandatory advance payment, so you can shop with complete peace of mind.',
    },
    {
      icon: RotateCcw,
      iconBg: 'bg-purple-50 text-purple-600 border-purple-100',
      title: '7-Day Replacement',
      tagline: 'Hassle-Free Protection',
      description:
        'Received an item with a transit defect or hardware fault? Message our Facebook Messenger team for a swift, no-questions-asked 7-day replacement.',
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
    <div className="space-y-16 sm:space-y-20 pb-20">
      {/* --- 1. HERO SECTION ------------------------------------- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white pt-14 pb-20 md:py-24">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-sky-400 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Our Story &amp; Vision · Dhaka, Bangladesh</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Elevating Workspaces Across Bangladesh With{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-amber-300">
                Ambient Desk Tech
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              <strong className="text-white font-semibold">ATMODESK.bd</strong> is Bangladesh&apos;s premium destination
              for aesthetic desk setups. Founded with the mission to bring global-quality smart clocks, weather stations,
              and ambient desk gadgets to Bangladesh at affordable prices.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm shadow-lg shadow-sky-500/25 transition-all transform hover:-translate-y-0.5"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/8801318043562"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/15 transition-all"
              >
                <span>💬 WhatsApp Us</span>
              </a>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14 pt-8 border-t border-slate-800/80">
            <div className="text-center p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50">
              <div className="text-2xl sm:text-3xl font-extrabold text-sky-400">100%</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Authentic Products</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">24–48h</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Dhaka Express Delivery</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">64 Districts</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Cash on Delivery</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50">
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-400">7 Days</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Replacement Policy</div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 2. OUR MISSION SECTION ------------------------------ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-xs space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5" />
                <span>Our Mission</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                Bringing Inspiring Desk Culture To Bangladesh
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                We spend our most creative, ambitious hours sitting at our desks — writing code, designing interfaces,
                studying late into the night, managing businesses, or creating content. Yet, desk accessories available
                locally were either generic, overpriced, or took weeks to arrive via unreliable overseas shipments.
              </p>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                <strong>ATMODESK.bd</strong> was created to change that reality. We curate viral, aesthetic, and functional
                desk gadgets from around the globe — IPS weather stations, Nixie retro tube displays, animated pixel
                clocks, and ambient backlights — bringing them to Bangladesh with fast local delivery and Cash on Delivery.
              </p>
            </div>

            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 sm:p-8 space-y-5 shadow-md">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-400" />
                The ATMODESK Promise
              </h3>
              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-300">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
            {missionPillars.map((pillar) => {
              const Icon = pillar.icon
              return (
                <div
                  key={pillar.title}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5"
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-sky-600 flex items-center justify-center shadow-xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base">{pillar.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{pillar.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* --- 3. WHY CHOOSE US SECTION ---------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="px-3 py-1 bg-sky-50 text-sky-700 font-bold text-xs rounded-full uppercase tracking-wider">
            Why Shop With Us
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Why Choose ATMODESK.bd
          </h2>
          <p className="text-sm text-slate-600">
            We combine premium international aesthetics with reliable local service in Bangladesh.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyChooseUsCards.map((card) => {
            const Icon = card.icon
            return (
              <div
                key={card.title}
                className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-6 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-4">
                  <div
                    className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${card.iconBg} transition-transform group-hover:scale-105`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-sky-600 uppercase tracking-wider">
                      {card.tagline}
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-sky-600 transition-colors">
                      {card.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center text-xs font-semibold text-slate-500">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-1.5" />
                  <span>Guaranteed by ATMODESK</span>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* --- 4. FOUNDER / TEAM SECTION --------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sky-400 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
              <Users className="w-3.5 h-3.5" />
              <span>Behind the Brand</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Founded by Tech Enthusiasts in Dhaka
            </h2>

            <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              <p>
                ATMODESK.bd was started by a group of tech enthusiasts and desk setup creators right here in{' '}
                <strong className="text-white">New Eskaton, Dhaka</strong>. Like many of our customers, we spent hours
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

            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-400" />
                <span>New Eskaton, Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Active 10:00 AM – 10:00 PM (Sat–Thu)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 5. CONTACT CTA AT BOTTOM ---------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-sky-600 via-sky-700 to-blue-800 text-white rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <span className="px-3 py-1 bg-white/20 text-white font-bold text-xs rounded-full uppercase tracking-wider">
                We&apos;re Here to Help
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Have Questions or Need Help Choosing?
              </h2>
              <p className="text-sm sm:text-base text-sky-100 max-w-xl">
                Whether you need advice on which smart clock suits your desk or want to track an active order, our Dhaka
                team is ready to assist you instantly.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <a
                href="https://wa.me/8801318043562"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-md transition transform hover:-translate-y-0.5 text-center"
              >
                <span>📱</span>
                <span>Chat on WhatsApp</span>
              </a>

              <a
                href="https://www.facebook.com/people/Atmodeskbd/61593715040434/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-md transition transform hover:-translate-y-0.5 text-center"
              >
                <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Visit Facebook Page</span>
              </a>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-sky-900/50 hover:bg-sky-900/80 text-white font-semibold text-xs border border-white/20 transition text-center"
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
