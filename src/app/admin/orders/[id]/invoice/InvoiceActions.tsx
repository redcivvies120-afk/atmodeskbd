'use client'

import React, { useState } from 'react'
import {
  Printer,
  ArrowLeft,
  Download,
  Share2,
  Check,
  MessageCircle,
  FileText,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'

interface InvoiceActionsProps {
  orderNumber: string
  customerPhone?: string
  customerName?: string
  totalAmount: number
  codAmount: number
}

export function InvoiceActions({
  orderNumber,
  customerPhone = '',
  customerName = 'Customer',
  totalAmount,
  codAmount,
}: InvoiceActionsProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  // Dynamically load html2pdf from CDN
  const loadHtml2Pdf = async (): Promise<any> => {
    if (typeof window === 'undefined') return null
    if ((window as any).html2pdf) return (window as any).html2pdf
    return new Promise((resolve, reject) => {
      const existing = document.getElementById('html2pdf-cdn')
      if (existing) {
        existing.addEventListener('load', () => resolve((window as any).html2pdf))
        return
      }
      const script = document.createElement('script')
      script.id = 'html2pdf-cdn'
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
      script.async = true
      script.onload = () => resolve((window as any).html2pdf)
      script.onerror = () => reject(new Error('PDF generator script failed to load'))
      document.head.appendChild(script)
    })
  }

  const handleDownloadPDF = async () => {
    setIsGenerating(true)
    try {
      const html2pdf = await loadHtml2Pdf()
      const element = document.getElementById('invoice-printable-card')
      if (!element) throw new Error('Invoice content element not found')

      const opt = {
        margin: [6, 8, 6, 8],
        filename: `Invoice-ATMODESK-${orderNumber}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      }

      await html2pdf().set(opt).from(element).save()
    } catch (err) {
      console.warn('Direct PDF export encountered an error, falling back to print dialog:', err)
      window.print()
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleCopyLink = () => {
    const trackUrl = `${window.location.origin}/track-order?order=${orderNumber}`
    navigator.clipboard.writeText(trackUrl)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2500)
  }

  // Pre-formatted WhatsApp text link
  const cleanPhone = customerPhone.startsWith('0')
    ? '88' + customerPhone
    : customerPhone.replace('+', '')
  const waText = encodeURIComponent(
    `Hello ${customerName}, thank you for choosing Atmodesk Bangladesh! 📦\n\nYour order #${orderNumber} is confirmed for Cash on Delivery.\nAmount to pay upon delivery: ৳${codAmount.toLocaleString(
      'en-BD'
    )}\n\nLive tracking link: https://atmodeskbd.vercel.app/track-order?order=${orderNumber}\n\nOur delivery partner will send an SMS/text before arrival.`
  )
  const waUrl = `https://wa.me/${cleanPhone}?text=${waText}`

  return (
    <div className="no-print bg-slate-900 text-white px-4 py-3 sm:px-6 sm:py-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xl mb-6 border border-slate-800">
      {/* Left: Navigation and Order ID */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Orders Hub
        </Link>
        <div className="hidden sm:block">
          <span className="text-xs text-slate-400 font-mono block">Order ID</span>
          <span className="text-sm font-mono font-bold text-white">#{orderNumber}</span>
        </div>
      </div>

      {/* Right: PDF Download, Print, and WhatsApp Actions */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Download PDF Button */}
        <button
          onClick={handleDownloadPDF}
          disabled={isGenerating}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-60"
          title="Save as a high-resolution PDF file"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
              <span>Generating PDF...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-slate-950" />
              <span>Download PDF</span>
            </>
          )}
        </button>

        {/* Print / Save as PDF Button */}
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition cursor-pointer"
          title="Print directly to A4 paper or system PDF printer"
        >
          <Printer className="w-3.5 h-3.5 text-slate-300" />
          <span className="hidden md:inline">Print / Save as PDF</span>
        </button>

        {/* WhatsApp Customer Button */}
        {cleanPhone && (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-semibold transition"
            title="Send invoice & tracking info to customer on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WhatsApp Invoice</span>
          </a>
        )}

        {/* Copy Tracking Link */}
        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition cursor-pointer"
          title="Copy customer tracking link to clipboard"
        >
          {copiedLink ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Copy Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
