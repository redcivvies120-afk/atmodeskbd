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
    <footer className="relative bg-[#F3F7FB] text-[#5B6B80] pb-28 md:pb-0 overflow-hidden border-t border-black/[0.08]">
      {/* Value bar */}
      <div className="relative border-b border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex items-center gap-4">
                <LiquidIcon icon={f.icon} tone={f.tone} variant="glass" size="lg" />
                <div>
                  <h4 className="text-[#083466] font-semibold text-sm">{f.title}</h4>
                  <p className="text-xs text-[#5B6B80] mt-0.5">{f.text}</p>
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
            <Link href="/" className="inline-block font-bold text-2xl tracking-tight text-[#083466]">
              ATMODESK<span className="text-[#0A9EE6]">.bd</span>
            </Link>
            <p className="text-sm text-[#5B6B80] max-w-sm leading-relaxed">
              Bangladesh&apos;s online store for aesthetic desk setups, WiFi smart clocks, mini weather displays and
              ambient LED tech. Sourced directly from global OEM manufacturers.
            </p>
            <ul className="space-y-2.5 text-sm text-[#5B6B80] pt-2">
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#0A9EE6] flex-shrink-0" />
                <span>New Eskaton, Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <a
                  href="https://wa.me/8801318043562"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#083466] transition"
                >
                  +880 1318-043562 (WhatsApp text only)
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#0A9EE6] flex-shrink-0" />
                <a href="mailto:support@atmodeskbd.com" className="hover:text-[#083466] transition">
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
              <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Follow us on Facebook
            </a>

            {/* Social Media Icons Row */}
            <div className="flex items-center gap-3 mt-3">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/people/Atmodeskbd/61593715040434/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#F3F7FB] hover:bg-[#1877F2]/10 flex items-center justify-center transition border border-black/[0.06]"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              {/* Instagram */}
              <a
                href="https://instagram.com/atmodeskbd"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#F3F7FB] hover:bg-pink-500/10 flex items-center justify-center transition border border-black/[0.06]"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#ig)" strokeWidth="2"/><circle cx="12" cy="12" r="5" stroke="url(#ig)" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1.5" fill="url(#ig)"/><defs><linearGradient id="ig" x1="2" y1="22" x2="22" y2="2"><stop stopColor="#FD5"/><stop offset=".5" stopColor="#FF543E"/><stop offset="1" stopColor="#C837AB"/></linearGradient></defs></svg>
              </a>
              {/* YouTube */}
              <a
                href="https://youtube.com/@atmodeskbd"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#F3F7FB] hover:bg-red-500/10 flex items-center justify-center transition border border-black/[0.06]"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-[#FF0000]" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              {/* WhatsApp */}
              <a
                href="https://wa.me/8801318043562"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#F3F7FB] hover:bg-emerald-500/10 flex items-center justify-center transition border border-black/[0.06]"
                aria-label="WhatsApp"
              >
                <svg className="w-4 h-4 fill-[#25D366]" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
              </a>
            </div>
          </div>

          <nav aria-label="Categories">
            <h4 className="text-[#083466] font-semibold text-sm mb-4">Categories</h4>
            <ul className="space-y-2.5 text-sm text-[#5B6B80]">
              {CATEGORY_LINKS.map(([href, label]) => (
                <li key={label}>
                  <Link href={href} className="hover:text-[#083466] transition">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Customer care">
            <h4 className="text-[#083466] font-semibold text-sm mb-4">Customer care</h4>
            <ul className="space-y-2.5 text-sm text-[#5B6B80]">
              {CARE_LINKS.map(([href, label]) => (
                <li key={label}>
                  <Link href={href} className="hover:text-[#083466] transition">
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <a href="https://wa.me/8801318043562" target="_blank" rel="noopener noreferrer" className="text-emerald-700 font-medium hover:text-emerald-800 transition">
                  WhatsApp helpline
                </a>
              </li>
              <li>
                <a href="https://m.me/atmodeskbd" target="_blank" rel="noopener noreferrer" className="text-[#0A9EE6] font-medium hover:underline transition">
                  Message on Facebook
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <h4 className="text-[#083466] font-semibold text-sm mb-4">Payment</h4>
            <div className="rounded-3xl bg-white p-4 mb-6 space-y-2 shadow-xs ring-1 ring-black/[0.06]">
              <div className="flex items-center gap-2.5">
                <LiquidIcon icon={Banknote} tone="green" variant="glass" size="sm" />
                <span className="text-sm font-semibold text-[#083466]">Cash on Delivery</span>
              </div>
              <p className="text-[12px] text-[#5B6B80] leading-relaxed">
                Pay in cash when your order reaches your door. Available nationwide.
              </p>
            </div>
            <h4 className="text-[#083466] font-semibold text-xs mb-2">Delivery partners</h4>
            <p className="text-xs text-[#5B6B80] leading-relaxed">
              Steadfast · Pathao Courier · RedX · Paperfly · Sundarban Courier
            </p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="relative border-t border-black/[0.06] bg-white/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#86868b]">
          <p>© {new Date().getFullYear()} ATMODESK.bd · All rights reserved. Registered in Bangladesh.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-[#083466] transition">Terms &amp; Conditions</Link>
            <Link href="/privacy" className="hover:text-[#083466] transition">Privacy Policy</Link>
            <Link href="/returns" className="hover:text-[#083466] transition">Returns Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
