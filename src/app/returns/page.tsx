import React from 'react'
import Link from 'next/link'
import { RotateCcw, CheckCircle2, AlertCircle, HelpCircle, ArrowRight } from 'lucide-react'

export const metadata = {
  title: '7-Day Return & Replacement Policy — ATMODESK Bangladesh',
  description: 'Our customer-first return, refund, and replacement policy in Bangladesh.',
}

export default function ReturnsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-slate-700 text-sm leading-relaxed">
      <div className="text-center space-y-3">
        <span className="px-3 py-1 bg-amber-50 text-amber-700 font-bold text-xs rounded-full uppercase tracking-wider">
          Customer Assurance
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          7-Day Return &amp; Replacement Policy
        </h1>
        <p className="text-xs text-slate-500">
          Shop with 100% confidence. If anything goes wrong, we've got you covered.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" /> When Are You Eligible for a Replacement?
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
            <li>The product received is physically damaged or has broken glass/LED display upon unboxing.</li>
            <li>The product has internal technical faults (WiFi not connecting, power issue, clock display issue).</li>
            <li>The incorrect item, variant, or color was delivered.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-sky-600" /> How to Claim a 7-Day Replacement
          </h2>
          <ol className="list-decimal pl-5 space-y-2 text-xs text-slate-600">
            <li>Take a short unboxing video or photo showing the issue.</li>
            <li>Send the video along with your Order ID or phone number to our WhatsApp: <a href="https://wa.me/8801318043562" className="text-sky-600 font-bold underline">+880 1318-043562</a>.</li>
            <li>Our Dhaka technical team will review and approve an instant replacement delivery within 24–48 hours!</li>
          </ol>
        </section>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-2">
          <h3 className="text-xs font-bold text-slate-900">Need immediate assistance with an order?</h3>
          <a
            href="https://wa.me/8801318043562?text=Hi%20Atmodesk,%20I%20have%20an%20issue%20with%20my%20order"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-xs"
          >
            <span>💬</span> Message WhatsApp Support (+880 1318-043562)
          </a>
        </div>
      </div>
    </div>
  )
}
