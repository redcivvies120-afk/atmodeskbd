import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ContactClient } from './ContactClient'
import { Sparkles, MessageCircle, PhoneCall, ShieldCheck, Truck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us — ATMODESK Bangladesh | Customer Support & Dhaka Office',
  description:
    'Need help with your smart clock, order tracking, or return? Contact ATMODESK Bangladesh. Call/WhatsApp +880 1318-043562 or visit us in New Eskaton, Dhaka.',
  openGraph: {
    title: 'Contact Us — ATMODESK Bangladesh',
    description:
      'Direct support for smart clocks and desk gadgets in Bangladesh. Phone, WhatsApp, Messenger, and office address in New Eskaton, Dhaka.',
    url: 'https://atmodeskbd-eo1e.vercel.app/contact',
    siteName: 'ATMODESK BD',
    locale: 'en_BD',
    type: 'website',
  },
}

export default function ContactPage() {
  return (
    <div className="space-y-12 pb-20">
      {/* ─── HERO HEADER ────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white pt-12 pb-16 md:py-20">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-sky-400 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dhaka Helpdesk &amp; Inquiries</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            We&apos;re Always Here to Help Your Setup
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Have a question before buying, need technical setup help, or want to track an existing order? Reach out to
            our local team in Dhaka through your preferred channel.
          </p>

          <div className="pt-2 flex flex-wrap justify-center items-center gap-4 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              WhatsApp Online
            </span>
            <span>·</span>
            <span>Saturday – Thursday (10 AM – 10 PM)</span>
            <span>·</span>
            <span className="text-sky-400">Response within 2 hours</span>
          </div>
        </div>
      </section>

      {/* ─── MAIN CONTENT ───────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ContactClient />
      </div>
    </div>
  )
}
