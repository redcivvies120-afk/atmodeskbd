'use client'

import React, { useState } from 'react'
import { Printer, ArrowLeft, Download, Share2, Check, MessageCircle, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { STORE } from '@/lib/store-info'

interface InvoiceActionsProps {
  orderId: string
  orderNumber: string
  customerPhone?: string
  customerName?: string
  totalAmount: number
  codAmount: number
}

export function InvoiceActions({
  orderId,
  orderNumber,
  customerPhone = '',
  customerName = 'Customer',
  codAmount,
}: InvoiceActionsProps) {
  const [copiedLink, setCopiedLink] = useState(false)

  const pdfUrl = `/api/admin/orders/${orderId}/invoice`
  const trackUrl = `${STORE.siteUrl}/track-order?order=${orderNumber}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(trackUrl)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2500)
  }

  const digits = customerPhone.replace(/[^0-9]/g, '')
  const cleanPhone = digits.startsWith('0') ? '88' + digits : digits
  const waText = encodeURIComponent(
    `Hello ${customerName}, thank you for choosing ${STORE.name}!\n\nYour order #${orderNumber} is confirmed for Cash on Delivery.\nAmount to pay on delivery: ৳${codAmount.toLocaleString('en-BD')}\n\nTrack your order: ${trackUrl}`
  )
  const waUrl = `https://wa.me/${cleanPhone}?text=${waText}`

  const btn = 'inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer'

  return (
    <div className="no-print bg-[#083466] text-white px-4 py-3 sm:px-6 sm:py-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xl mb-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/orders" className={`${btn} bg-white/10 hover:bg-white/20 text-white`}>
          <ArrowLeft className="w-3.5 h-3.5" />
          Orders
        </Link>
        <div className="hidden sm:block">
          <span className="text-[10px] uppercase tracking-wider text-sky-200 block">Invoice for order</span>
          <span className="text-sm font-mono font-bold">#{orderNumber}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Real PDF, generated on the server */}
        <a
          href={pdfUrl}
          download={`Invoice-ATMODESK-${orderNumber}.pdf`}
          className={`${btn} bg-sky-400 hover:bg-sky-300 text-[#083466] font-bold`}
          title="Download the invoice as a PDF file"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </a>
        <a
          href={`${pdfUrl}?inline=1`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${btn} bg-white/10 hover:bg-white/20 text-white`}
          title="Open the PDF in a new tab"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Open PDF</span>
        </a>
        <button onClick={() => window.print()} className={`${btn} bg-white/10 hover:bg-white/20 text-white`} title="Print this page">
          <Printer className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Print page</span>
        </button>
        {cleanPhone && (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${btn} bg-emerald-600 hover:bg-emerald-500 text-white`}
            title="Open WhatsApp with the order message ready to send"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WhatsApp customer</span>
          </a>
        )}
        <button onClick={handleCopyLink} className={`${btn} bg-white/10 hover:bg-white/20 text-white`} title="Copy the customer tracking link">
          {copiedLink ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-300" />
              <span className="text-emerald-300">Copied</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Copy link</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
