import React from 'react'
import Link from 'next/link'
import { ShieldCheck, Lock, Eye, FileText, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy — ATMODESK Bangladesh',
  description: 'How ATMODESK protects your personal information and order security.',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-slate-700 text-sm leading-relaxed">
      <div className="text-center space-y-3">
        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-full uppercase tracking-wider">
          Data Protection
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500">
          Your privacy is sacred at ATMODESK Bangladesh.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Information We Collect</h2>
          <p>
            When you register an account or place an order, we collect only the necessary details to fulfill your delivery: your <strong>Name</strong>, <strong>Bangladesh Mobile Number</strong>, <strong>Delivery Address (Dhaka or District)</strong>, and optional email address.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. How We Use Your Data</h2>
          <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
            <li>To dispatch your parcel with our courier partners (Steadfast / Pathao / RedX).</li>
            <li>To send you SMS/WhatsApp delivery updates and tracking links.</li>
            <li>To verify Cash on Delivery orders and process warranties.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. Payment Security</h2>
          <p>
            We do not store your bKash PIN, Nagad PIN, or credit card numbers. All electronic payments are processed through encrypted, bank-grade payment gateways.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">4. Contact Us</h2>
          <p className="text-xs text-slate-600">
            If you have questions regarding your data or wish to delete your account, please message us on WhatsApp at <strong className="text-slate-900">+880 1318-043562</strong>.
          </p>
        </section>
      </div>
    </div>
  )
}
