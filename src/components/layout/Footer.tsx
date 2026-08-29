import React from 'react'
import Link from 'next/link'
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Mail,
  Phone,
  MapPin,
  Banknote,
} from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pb-20 md:pb-0">
      {/* Features Value Bar */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Fast BD Delivery</h4>
                <p className="text-xs text-slate-400 mt-0.5">Inside Dhaka 24-48h, Nationwide 3-5 days</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">100% Authentic</h4>
                <p className="text-xs text-slate-400 mt-0.5">Tested gadgets with warranty</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">7-Day Replacement</h4>
                <p className="text-xs text-slate-400 mt-0.5">Hassle-free replacement policy</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center flex-shrink-0">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">24/7 BD Support</h4>
                <p className="text-xs text-slate-400 mt-0.5">Call or WhatsApp our Dhaka team</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Company Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-black text-2xl tracking-tight text-white">
                ATMODESK<span className="text-sky-400">.bd</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Bangladesh's premier online store for aesthetic desk setups, WiFi smart clocks, mini weather displays, and ambient LED tech gadgets. Sourced directly from global OEM manufacturers.
            </p>
            <div className="space-y-2 text-sm text-slate-400 pt-2">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span>New Eskaton, Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <a href="tel:+8801318043562" className="hover:text-white transition">
                  +880 1318-043562 (WhatsApp Support)
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span>support@atmodeskbd.com</span>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Categories</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/products?category=smart-clocks" className="hover:text-white transition">
                  Smart Clocks
                </Link>
              </li>
              <li>
                <Link href="/products?category=weather-stations" className="hover:text-white transition">
                  Weather Stations
                </Link>
              </li>
              <li>
                <Link href="/products?category=ambient-lights" className="hover:text-white transition">
                  Ambient Lights
                </Link>
              </li>
              <li>
                <Link href="/products?category=desk-tech" className="hover:text-white transition">
                  Desk Tech &amp; Hubs
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition">
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Customer Care</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/track-order" className="hover:text-white transition">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-white transition">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-white transition">
                  My Wishlist
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-white transition">
                  Checkout
                </Link>
              </li>
              <li>
                <a href="https://wa.me/8801318043562" target="_blank" rel="noopener noreferrer" className="hover:text-white text-emerald-400 transition">
                  WhatsApp Helpline
                </a>
              </li>
            </ul>
          </div>

          {/* Payment & Courier Partners */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Payment Method</h4>
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 mb-6 space-y-2">
              <div className="flex items-center gap-2.5 text-emerald-400">
                <Banknote className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">Cash on Delivery</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Pay safely in cash when your order is delivered to your doorstep. Available nationwide.
              </p>
            </div>

            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-2 text-slate-400">Delivery Partners</h4>
            <p className="text-xs text-slate-500">
              Steadfast · Pathao Courier · RedX · Paperfly · Sundarban Courier
            </p>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-slate-800/80 bg-slate-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ATMODESK.bd · All rights reserved. Registered in Bangladesh.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-slate-300 transition underline underline-offset-2">
              Terms &amp; Conditions (TOC)
            </Link>
            <Link href="/privacy" className="hover:text-slate-300 transition">
              Privacy Policy
            </Link>
            <Link href="/returns" className="hover:text-slate-300 transition">
              7-Day Return Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
