// src/components/layout/Footer.tsx
import React from 'react'
import Link from 'next/link'
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Mail,
  MessageCircle,
  MapPin,
  Banknote,
} from 'lucide-react'
import { LiquidIcon } from '@/components/shared/LiquidIcon'

const FEATURES = [
  { icon: Truck, tone: 'sky', title: 'Fast BD delivery', text: 'Inside Dhaka 24-48h, nationwide 3-5 days' },
  { icon: ShieldCheck, tone: 'green', title: '100% authentic', text: 'Tested gadgets with warranty' },
  { icon: RotateCcw, tone: 'amber', title: '7-day replacement', text: 'Hassle-free replacement policy' },
  { icon: Headphones, tone: 'violet', title: 'WhatsApp support', text: 'Text-only support, we reply fast' },
] as const

const CATEGORY_LINKS = [
  ['/products?category=smart-clocks', 'Smart Clocks'],
  ['/products?category=weather-stations', 'Weather Stations'],
  ['/products?category=ambient-lights', 'Ambient Lights'],
  ['/products?category=desk-tech', 'Desk Tech & Hubs'],
  ['/products', 'All Products'],
]

const CARE_LINKS = [
  ['/track-order', 'Track Your Order'],
  ['/account', 'My Account'],
  ['/faq', 'FAQ / Help Center'],
  ['/returns', 'Return & Replacement Policy'],
  ['/about', 'About Us'],
  ['/contact', 'Contact Us'],
]

export function Footer() {
  return (
    <footer className="relative bg-[#04070f] text-slate-300 pb-28 md:pb-0 overflow-hidden border-t border-white/[0.08]">
      {/* Value bar */}
      <div className="relative border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex items-center gap-4">
                <LiquidIcon icon={f.icon} tone={f.tone} variant="frost" size="lg" />
                <div>
                  <h4 className="text-white font-semibold text-sm">{f.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block font-bold text-2xl tracking-tight text-white">
              ATMODESK<span className="text-sky-400">.bd</span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Bangladesh&apos;s online store for aesthetic desk setups, WiFi smart clocks, mini weather displays and
              ambient LED tech. Sourced directly from global OEM manufacturers.
            </p>
            <ul className="space-y-2.5 text-sm text-slate-400 pt-2">
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span>New Eskaton, Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <a
                  href="https://wa.me/8801318043562"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  +880 1318-043562 (WhatsApp text only)
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <a href="mailto:support@atmodeskbd.com" className="hover:text-white transition">
                  support@atmodeskbd.com
                </a>
              </li>
            </ul>
            <a
              href="https://www.facebook.com/people/Atmodeskbd/61593715040434/"
              target="_blank"
              rel="noopener noreferrer"
              className="lg-btn-ghost inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Follow us on Facebook
            </a>
          </div>

          <nav aria-label="Categories">
            <h4 className="text-white font-semibold text-sm mb-4">Categories</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              {CATEGORY_LINKS.map(([href, label]) => (
                <li key={label}>
                  <Link href={href} className="hover:text-white transition">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Customer care">
            <h4 className="text-white font-semibold text-sm mb-4">Customer care</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              {CARE_LINKS.map(([href, label]) => (
                <li key={label}>
                  <Link href={href} className="hover:text-white transition">
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <a href="https://wa.me/8801318043562" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-white transition">
                  WhatsApp helpline
                </a>
              </li>
              <li>
                <a href="https://m.me/atmodeskbd" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-white transition">
                  Message on Facebook
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Payment</h4>
            <div className="rounded-3xl bg-white/[0.06] p-4 mb-6 space-y-2 ring-1 ring-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]">
              <div className="flex items-center gap-2.5">
                <LiquidIcon icon={Banknote} tone="green" variant="frost" size="sm" />
                <span className="text-sm font-semibold text-white">Cash on Delivery</span>
              </div>
              <p className="text-[12px] text-slate-400 leading-relaxed">
                Pay in cash when your order reaches your door. Available nationwide.
              </p>
            </div>
            <h4 className="text-slate-400 font-medium text-xs mb-2">Delivery partners</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Steadfast · Pathao Courier · RedX · Paperfly · Sundarban Courier
            </p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="relative border-t border-white/[0.08] bg-black/40 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ATMODESK.bd · All rights reserved. Registered in Bangladesh.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-slate-300 transition">Terms &amp; Conditions</Link>
            <Link href="/privacy" className="hover:text-slate-300 transition">Privacy Policy</Link>
            <Link href="/returns" className="hover:text-slate-300 transition">Returns Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
