import React from 'react'
import Link from 'next/link'
import {
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  MessageCircle,
  ShieldCheck,
  Truck,
  DollarSign,
  ArrowRight,
  Package,
} from 'lucide-react'

export const metadata = {
  title: 'Return & Refund Policy — ATMODESK Bangladesh',
  description: '7-Day Return, Replacement & Refund Policy for ATMODESK Bangladesh. Returns are processed via Messenger.',
}

export default function ReturnsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-slate-700 text-sm leading-relaxed">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="px-3 py-1 bg-amber-50 text-amber-700 font-bold text-xs rounded-full uppercase tracking-wider">
          Official Store Policy
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          Return &amp; Refund Policy
        </h1>
        <p className="text-xs text-slate-500">
          Last Updated: September 2026 · ATMODESK Bangladesh (Registered in Dhaka)
        </p>
      </div>

      {/* Messenger Callout Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-sky-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0 text-white">
            <MessageCircle className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-extrabold text-white">
              Notice: All Returns &amp; Refunds Must Be Initiated via Messenger
            </h2>
            <p className="text-xs text-blue-100 leading-relaxed">
              To ensure fast verification and issue tracking, our support team manages all product returns, exchanges, and refund requests directly through <strong>Facebook Messenger</strong>.
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap gap-3">
          <a
            href="https://m.me/atmodeskbd"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs rounded-xl transition shadow-sm"
          >
            <span>💬</span> Open Facebook Messenger Chat
          </a>
          <a
            href="https://wa.me/8801318043562?text=Hello%20ATMODESK,%20I%20want%20to%20request%20a%20return/refund"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition shadow-sm"
          >
            <span>📱</span> WhatsApp Helpline (+880 1318-043562)
          </a>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-8">
        {/* Section 1: 7-Day Replacement Guarantee */}
        <section className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              1. 7-Day Return &amp; Replacement Guarantee
            </h2>
          </div>
          <p className="text-slate-600 text-xs sm:text-sm">
            We inspect every smart clock and gadget before dispatch. However, if your order has any issues, you are protected under our <strong>7-Day Replacement Policy</strong> from the day you receive your parcel.
          </p>
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2">
            <strong className="text-slate-900 text-xs block font-bold">Eligible Reasons for Return &amp; Replacement:</strong>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li>Product damaged during courier transit (broken screen, cracked casing, loose parts).</li>
              <li>Defective hardware or technical malfunction (display not turning on, WiFi connectivity failure, faulty buttons).</li>
              <li>Incorrect item, color, or model delivered compared to your order.</li>
              <li>Missing items or accessories in the package.</li>
            </ul>
          </div>
        </section>

        {/* Section 2: Step-by-Step Return Process via Messenger */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              2. How to Request a Return / Refund via Messenger
            </h2>
          </div>
          <p className="text-xs text-slate-600">
            Please follow these simple steps to claim your return or replacement:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h3 className="font-bold text-slate-900 text-xs">Reach Out on Messenger</h3>
              <p className="text-xs text-slate-600">
                Send a message to our official Messenger chat (<code>m.me/atmodeskbd</code>) with your <strong>Order ID</strong> (e.g. ATD-XXXX) and mobile number.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h3 className="font-bold text-slate-900 text-xs">Share Photo / Video Proof</h3>
              <p className="text-xs text-slate-600">
                Send a short unboxing video or clear photo showing the defect, transit damage, or incorrect product received.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                3
              </span>
              <h3 className="font-bold text-slate-900 text-xs">Approval &amp; Courier Pickup</h3>
              <p className="text-xs text-slate-600">
                Our support team will verify your claim within a few hours and assign a courier rider to collect the item from your doorstep.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                4
              </span>
              <h3 className="font-bold text-slate-900 text-xs">Replacement / Refund Sent</h3>
              <p className="text-xs text-slate-600">
                A brand new replacement unit is dispatched immediately, or your full refund is sent via mobile banking (bKash/Nagad).
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Refund Policy */}
        <section className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              3. Refund Policy &amp; Timelines
            </h2>
          </div>
          <div className="space-y-2 text-xs sm:text-sm text-slate-600">
            <p>
              If an exact replacement is out of stock or you choose a refund, your money will be returned in full:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
              <li><strong>Cash on Delivery Orders:</strong> Refunds are disbursed directly to your personal <strong>bKash</strong>, <strong>Nagad</strong>, or <strong>Rocket</strong> account number upon return courier pickup.</li>
              <li><strong>Processing Time:</strong> Refunds are completed within <strong>24 to 72 hours</strong> after the returned product is received and inspected by our Dhaka warehouse.</li>
              <li><strong>Delivery Charges:</strong> If the return is due to a defect or error from our side, ATMODESK covers all courier return shipping costs.</li>
            </ul>
          </div>
        </section>

        {/* Section 4: Return Conditions */}
        <section className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              4. Return Conditions &amp; Requirements
            </h2>
          </div>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
            <li>The item must be in its original packaging with all included cables, power adapters, user manuals, and accessories.</li>
            <li>The item must not show signs of physical tampering, intentional damage, burn marks, or improper electrical usage.</li>
            <li>Return requests must be sent to our Messenger team within <strong>7 days</strong> of the courier delivery date.</li>
          </ul>
        </section>

        {/* Contact Support Footer */}
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-3">
          <h3 className="text-sm font-bold text-slate-900">
            Have a question about your order or need a return?
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Our Dhaka customer support team is active from 10:00 AM to 10:00 PM every day to assist you.
          </p>
          <div className="flex justify-center gap-3 pt-1">
            <a
              href="https://m.me/atmodeskbd"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition shadow-xs"
            >
              <span>💬</span> Message on Facebook Messenger
            </a>
            <a
              href="tel:+8801318043562"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition"
            >
              <span>📞</span> Call +880 1318-043562
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
