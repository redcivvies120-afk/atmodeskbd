'use client'

import React from 'react'
import { Printer, ArrowLeft, Download } from 'lucide-react'
import Link from 'next/link'

export function InvoiceActions({ orderNumber }: { orderNumber: string }) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="no-print bg-slate-900 text-white px-4 py-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-lg mb-6">
      <div className="flex items-center gap-2">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Orders
        </Link>
        <span className="text-xs text-slate-400 font-mono hidden sm:inline">
          Order #{orderNumber}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition shadow-sm cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          Print Invoice / Slip (A4)
        </button>
      </div>
    </div>
  )
}
