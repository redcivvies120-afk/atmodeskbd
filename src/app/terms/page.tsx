import React from 'react'
import Link from 'next/link'
import { ShieldCheck, FileText, ArrowRight, Truck, RotateCcw, CreditCard, Lock } from 'lucide-react'

export const metadata = {
  title: 'Terms & Conditions — ATMODESK Bangladesh',
  description: 'Terms of Service, Order, Delivery & Warranty policies of ATMODESK Bangladesh.',
}

export default function TermsPage() {
  const sections = [
    { id: 'introduction', title: '1. Introduction & Acceptance' },
    { id: 'ordering', title: '2. Orders & Pricing' },
    { id: 'delivery', title: '3. Nationwide Delivery Policy' },
    { id: 'payments', title: '4. Payment Methods (bKash / Nagad / COD)' },
    { id: 'warranty', title: '5. 7-Day Replacement & Warranty' },
    { id: 'privacy', title: '6. Customer Privacy & Data Protection' },
    { id: 'contact', title: '7. Official Support & Contact' },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="px-3 py-1 bg-sky-50 text-sky-700 font-bold text-xs rounded-full uppercase tracking-wider">
          Legal &amp; Store Policies
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          Terms &amp; Conditions
        </h1>
        <p className="text-xs text-slate-500">
          Last updated: August 2026 · ATMODESK Bangladesh (Registered in Dhaka, Bangladesh)
        </p>
      </div>

      {/* Table of Contents (TOC) Box */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
          <FileText className="w-4 h-4 text-sky-600" /> Table of Contents (TOC)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-xs font-semibold text-slate-700 hover:text-sky-700 transition flex items-center justify-between group shadow-2xs"
            >
              <span>{s.title}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600 transition group-hover:translate-x-0.5" />
            </a>
          ))}
        </div>
      </div>

      {/* Policy Articles */}
      <div className="space-y-10 text-slate-700 text-sm leading-relaxed">
        {/* 1. Intro */}
        <section id="introduction" className="space-y-3 scroll-mt-24 border-b border-slate-100 pb-8">
          <h3 className="text-lg font-bold text-slate-900">1. Introduction &amp; Acceptance</h3>
          <p>
            Welcome to <strong>ATMODESK.bd</strong>. By accessing our website (<code>atmodeskbd.vercel.app</code>) or placing an order with us via online checkout or WhatsApp, you agree to be bound by these terms. We specialize in authentic ambient desk electronics, WiFi smart clocks, and lifestyle desk gear in Bangladesh.
          </p>
        </section>

        {/* 2. Ordering */}
        <section id="ordering" className="space-y-3 scroll-mt-24 border-b border-slate-100 pb-8">
          <h3 className="text-lg font-bold text-slate-900">2. Orders &amp; Pricing</h3>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
            <li>All prices are stated in <strong>Bangladeshi Taka (৳ BDT)</strong> and are inclusive of standard applicable taxes.</li>
            <li>We reserve the right to verify customer phone numbers via SMS or phone call before dispatching high-value orders.</li>
            <li>Orders placed before 4:00 PM are processed on the same business day.</li>
          </ul>
        </section>

        {/* 3. Delivery */}
        <section id="delivery" className="space-y-3 scroll-mt-24 border-b border-slate-100 pb-8">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-sky-600" />
            <h3 className="text-lg font-bold text-slate-900">3. Nationwide Delivery Policy</h3>
          </div>
          <p>We partner with top Bangladeshi courier services (Steadfast, Pathao, RedX, Paperfly):</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-sky-50/60 border border-sky-100 rounded-2xl space-y-1">
              <strong className="text-slate-900 text-xs font-bold block">Inside Dhaka City</strong>
              <p className="text-xs text-slate-600">Delivery in <strong>24 to 48 hours</strong>. Shipping fee: ৳60 (Free on orders over ৳2,000).</p>
            </div>
            <div className="p-4 bg-purple-50/60 border border-purple-100 rounded-2xl space-y-1">
              <strong className="text-slate-900 text-xs font-bold block">Outside Dhaka (All 64 Districts)</strong>
              <p className="text-xs text-slate-600">Delivery in <strong>3 to 5 business days</strong> via courier home delivery. Shipping fee: ৳120 flat.</p>
            </div>
          </div>
        </section>

        {/* 4. Payments */}
        <section id="payments" className="space-y-3 scroll-mt-24 border-b border-slate-100 pb-8">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-bold text-slate-900">4. Payment Methods</h3>
          </div>
          <p>
            We offer 100% secure payment gateways for Bangladesh:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
            <li><strong>Cash on Delivery (COD):</strong> Check your parcel condition and pay cash directly to the delivery rider.</li>
            <li><strong>bKash / Nagad / Rocket:</strong> Pay instantly through your mobile banking wallet.</li>
            <li><strong>Credit / Debit Cards:</strong> Visa and Mastercard online payments.</li>
          </ul>
        </section>

        {/* 5. 7-Day Replacement */}
        <section id="warranty" className="space-y-3 scroll-mt-24 border-b border-slate-100 pb-8">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-bold text-slate-900">5. 7-Day Replacement &amp; Warranty</h3>
          </div>
          <p>
            Every product purchased from ATMODESK is covered by our <strong>7-Day Replacement Guarantee</strong>. If your smart clock or gadget arrives damaged, defective, or with any manufacturing defect, we will replace it free of charge!
          </p>
        </section>

        {/* 6. Privacy */}
        <section id="privacy" className="space-y-3 scroll-mt-24 border-b border-slate-100 pb-8">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-900">6. Customer Privacy</h3>
          </div>
          <p>
            Your customer phone number, delivery address, and order details are strictly protected. We never sell or share your information with any third-party advertisers.
          </p>
        </section>

        {/* 7. Contact */}
        <section id="contact" className="space-y-3 scroll-mt-24">
          <h3 className="text-lg font-bold text-slate-900">7. Official Support</h3>
          <p>
            For order inquiries, warranty claims, or bulk orders, reach out directly to our team:
          </p>
          <div className="p-4 bg-slate-100 rounded-2xl space-y-1 text-xs text-slate-700 font-medium">
            <p>📍 <strong>Office Address:</strong> New Eskaton, Dhaka, Bangladesh</p>
            <p>📞 <strong>Helpline / WhatsApp:</strong> <a href="tel:+8801318043562" className="text-sky-600 underline">+880 1318-043562</a></p>
            <p>✉️ <strong>Email:</strong> support@atmodeskbd.com</p>
          </div>
        </section>
      </div>
    </div>
  )
}
