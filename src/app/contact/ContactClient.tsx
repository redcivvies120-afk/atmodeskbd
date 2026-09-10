'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useToast } from '@/components/shared/Providers'
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  X,
  RotateCcw,
} from 'lucide-react'

const SUBJECT_OPTIONS = [
  'General Inquiry',
  'Order Issue',
  'Product Question',
  'Return Request',
  'Other',
] as const

type SubjectType = (typeof SUBJECT_OPTIONS)[number]

export function ContactClient() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry' as SubjectType,
    message: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showToast, setShowToast] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errorMessage) setErrorMessage(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    // Basic Validation
    if (!formData.name.trim()) {
      setErrorMessage('Please enter your full name.')
      return
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please enter a valid email address.')
      return
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 8) {
      setErrorMessage('Please enter a valid phone number (e.g. 01318043562).')
      return
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      setErrorMessage('Please write a message with at least 10 characters.')
      return
    }

    setIsSubmitting(true)

    // Simulate sending without backend
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
      setShowToast(true)
      toast('Thank you! Your message has been sent successfully.', 'success')

      // Auto-hide toast after 8 seconds
      setTimeout(() => {
        setShowToast(false)
      }, 8000)
    }, 600)
  }

  const handleResetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: 'General Inquiry',
      message: '',
    })
    setIsSuccess(false)
    setShowToast(false)
    setErrorMessage(null)
  }

  return (
    <div className="space-y-12">
      {/* Floating Success Toast (Fixed Notification) */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-fade-in">
          <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-sky-500/40 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm text-white">Message Received!</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Thank you, <strong>{formData.name || 'there'}</strong>. We received your note regarding{' '}
                <span className="text-sky-400">&ldquo;{formData.subject}&rdquo;</span>. Our Dhaka team will reach out
                shortly.
              </p>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="text-slate-400 hover:text-white p-1 transition"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Left Form & Right Contact Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ─── LEFT COLUMN: CONTACT FORM ───────────────────────── */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 md:p-10 shadow-xs relative">
            <div className="space-y-2 mb-8">
              <span className="px-3 py-1 bg-sky-50 text-sky-700 font-bold text-xs rounded-full uppercase tracking-wider">
                Send a Message
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Get In Touch With Us
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Have a question about our smart clocks, order status, or wholesale inquiries? Fill out the form and our
                Dhaka team will reply promptly.
              </p>
            </div>

            {isSuccess ? (
              <div className="text-center py-10 px-4 space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  <h3 className="text-xl font-black text-slate-900">Thank You for Reaching Out!</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Your message regarding <strong className="text-slate-900">&ldquo;{formData.subject}&rdquo;</strong> has
                    been successfully sent. Our support desk in Dhaka is on it.
                  </p>
                  <p className="text-xs text-slate-500">
                    Need instant confirmation? You can also message us directly on WhatsApp or Facebook Messenger.
                  </p>
                </div>
                <div className="pt-4 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
                  >
                    Send Another Message
                  </button>
                  <a
                    href="https://wa.me/8801318043562"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition inline-flex items-center gap-1.5"
                  >
                    <span>📱 Open WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="contact-name" className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Your Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Tanvir Ahmed"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-sm text-slate-900 outline-hidden transition bg-slate-50/50"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label htmlFor="contact-email" className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. tanvir@gmail.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-sm text-slate-900 outline-hidden transition bg-slate-50/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label htmlFor="contact-phone" className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Phone / WhatsApp <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. 01318043562"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-sm text-slate-900 outline-hidden transition bg-slate-50/50"
                    />
                  </div>

                  {/* Subject Dropdown */}
                  <div className="space-y-1.5">
                    <label htmlFor="contact-subject" className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Subject <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="contact-subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-sm text-slate-900 outline-hidden transition bg-slate-50/50"
                    >
                      {SUBJECT_OPTIONS.map((subj) => (
                        <option key={subj} value={subj}>
                          {subj}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label htmlFor="contact-message" className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Your Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us what you need or include your Order ID if you're inquiring about an existing order..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-sm text-slate-900 outline-hidden transition bg-slate-50/50 resize-y"
                  />
                </div>

                {/* Quick note for returns */}
                {formData.subject === 'Return Request' && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 flex items-start gap-2">
                    <RotateCcw className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-600" />
                    <span>
                      <strong>Tip for Returns:</strong> All 7-day returns &amp; replacements can also be processed in
                      real-time via{' '}
                      <a
                        href="https://m.me/atmodeskbd"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline font-bold text-blue-900"
                      >
                        Facebook Messenger
                      </a>{' '}
                      for fastest photo verification!
                    </span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-extrabold text-sm tracking-wide shadow-md shadow-sky-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending Your Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message to ATMODESK</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-slate-400 text-center">
                  🔒 We respect your privacy. Your details are strictly used to respond to your inquiry.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* ─── RIGHT COLUMN: CONTACT INFO CARDS ────────────────── */}
        <div className="lg:col-span-5 space-y-4">
          {/* Quick Direct Chat Cards */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
            <div>
              <span className="px-3 py-1 bg-white/10 text-sky-400 font-bold text-xs rounded-full uppercase tracking-wider">
                Direct Channels
              </span>
              <h3 className="text-xl font-extrabold text-white mt-2">Need Instant Help?</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Connect directly with our Dhaka customer service team for the fastest reply.
              </p>
            </div>

            <div className="space-y-3">
              {/* WhatsApp */}
              <a
                href="https://wa.me/8801318043562"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <span className="text-lg">📱</span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-white group-hover:text-emerald-300 transition">
                      WhatsApp Support
                    </h4>
                    <p className="text-xs text-slate-300">+880 1318-043562</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                  Chat Now &rarr;
                </span>
              </a>

              {/* Messenger */}
              <a
                href="https://m.me/atmodeskbd"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-white group-hover:text-sky-300 transition">
                      Facebook Messenger
                    </h4>
                    <p className="text-xs text-slate-300">m.me/atmodeskbd</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-sky-400 group-hover:translate-x-0.5 transition-transform">
                  Open Chat &rarr;
                </span>
              </a>
            </div>
          </div>

          {/* Details Info List */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
            {/* Phone */}
            <div className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-slate-50 transition">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Phone Helpline</span>
                <p className="text-sm font-extrabold text-slate-900 mt-0.5">
                  <a href="tel:+8801318043562" className="hover:text-sky-600 transition">
                    +880 1318-043562
                  </a>
                </p>
                <p className="text-xs text-slate-500 mt-0.5">Voice calls &amp; SMS support</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-slate-50 transition">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Official Email</span>
                <p className="text-sm font-extrabold text-slate-900 mt-0.5">
                  <a href="mailto:support@atmodeskbd.com" className="hover:text-sky-600 transition">
                    support@atmodeskbd.com
                  </a>
                </p>
                <p className="text-xs text-slate-500 mt-0.5">Replies within 12 hours</p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-slate-50 transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Headquarters &amp; Hub</span>
                <p className="text-sm font-extrabold text-slate-900 mt-0.5">New Eskaton, Dhaka, Bangladesh</p>
                <p className="text-xs text-slate-500 mt-0.5">E-commerce order dispatch point</p>
              </div>
            </div>

            {/* Business Hours */}
            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Business Hours</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Open Today
                  </span>
                </div>
                <p className="text-sm font-extrabold text-slate-900 mt-0.5">10:00 AM – 10:00 PM</p>
                <p className="text-xs text-slate-500 mt-0.5">Saturday to Thursday (Friday limited support)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── BOTTOM SECTION: GOOGLE MAPS EMBED / LOCATION ─────── */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-sky-600 uppercase tracking-wider">Dispatch Warehouse &amp; Office</span>
            <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-rose-500" />
              New Eskaton, Dhaka, Bangladesh
            </h3>
            <p className="text-xs text-slate-500">
              Orders are packaged and dispatched directly from our central Dhaka hub.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://maps.google.com/?q=New+Eskaton,+Dhaka,+Bangladesh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Responsive Google Maps Embed */}
        <div className="relative w-full h-80 sm:h-96 bg-slate-100">
          <iframe
            title="ATMODESK Bangladesh Location - New Eskaton, Dhaka"
            src="https://maps.google.com/maps?q=New%20Eskaton,%20Dhaka,%20Bangladesh&t=&z=15&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full border-0"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />

          {/* Floating info badge over map */}
          <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl p-4 shadow-lg max-w-xs hidden sm:block">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <h4 className="font-extrabold text-xs text-slate-900">ATMODESK Central Hub</h4>
            </div>
            <p className="text-[11px] text-slate-600 mt-1">
              New Eskaton, Dhaka 1000, Bangladesh
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Courier pickup &amp; delivery base
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
