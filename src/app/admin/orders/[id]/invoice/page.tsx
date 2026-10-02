import React from 'react'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { formatBDT, formatDate } from '@/lib/utils'
import { ensureDatabaseTables } from '@/lib/init-db'
import { InvoiceActions } from './InvoiceActions'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface InvoicePageProps {
  params: Promise<{ id: string }>
}

// Generates an SVG barcode pattern from any alphanumeric string
function BarcodeSVG({ value }: { value: string }) {
  const chars = value.toUpperCase()
  const bars: { width: number; isBlack: boolean }[] = []
  
  // Create deterministic bar widths from characters
  bars.push({ width: 3, isBlack: true })
  bars.push({ width: 1, isBlack: false })
  bars.push({ width: 2, isBlack: true })
  bars.push({ width: 2, isBlack: false })

  for (let i = 0; i < chars.length; i++) {
    const code = chars.charCodeAt(i)
    const w1 = (code % 3) + 1
    const w2 = ((code >> 1) % 3) + 1
    const w3 = ((code >> 2) % 2) + 1
    bars.push({ width: w1, isBlack: true })
    bars.push({ width: w2, isBlack: false })
    bars.push({ width: w3, isBlack: true })
    bars.push({ width: 1, isBlack: false })
  }

  bars.push({ width: 2, isBlack: true })
  bars.push({ width: 1, isBlack: false })
  bars.push({ width: 3, isBlack: true })

  const totalWidth = bars.reduce((sum, b) => sum + b.width, 0) * 2

  let currentX = 0
  return (
    <div className="flex flex-col items-center">
      <svg width={totalWidth} height="44" className="overflow-visible">
        {bars.map((bar, idx) => {
          const x = currentX
          const w = bar.width * 2
          currentX += w
          if (!bar.isBlack) return null
          return <rect key={idx} x={x} y="0" width={w} height="44" fill="#0f172a" />
        })}
      </svg>
      <span className="font-mono text-[10px] tracking-widest text-slate-700 mt-1 uppercase font-semibold">
        *{value}*
      </span>
    </div>
  )
}

export default async function OrderInvoicePage({ params }: InvoicePageProps) {
  const { id } = await params

  await ensureDatabaseTables()
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      address: true,
      items: true,
      user: true,
    },
  })

  if (!order) {
    notFound()
  }

  const addr = order.address
  const phone = addr?.phone || order.user?.phone || '—'
  const isPaid = order.paymentStatus === 'PAID'
  const codPayable = isPaid ? 0 : order.total
  const fullAddress = [
    addr?.line1,
    addr?.line2,
    addr?.area,
    addr?.city,
    addr?.district,
    addr?.postalCode,
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-4 sm:px-6 lg:px-8 print:p-0 print:bg-white text-slate-900">
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 10mm 12mm;
          }
          body {
            background: white !important;
            color: #0f172a !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
          .invoice-card {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            max-width: 100% !important;
          }
        }
      `}</style>

      <div className="max-w-4xl mx-auto">
        {/* Interactive Print and Navigation Header */}
        <InvoiceActions orderNumber={order.orderNumber} />

        {/* Printable Paper Canvas */}
        <div className="invoice-card bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm print:rounded-none">
          {/* Top Brand Header & Barcode */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b-2 border-slate-900 pb-6">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-extrabold text-base">
                  A
                </div>
                <span className="text-2xl font-black tracking-tight text-slate-950 font-mono">
                  ATMODESK
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Aesthetic Smart Clocks & Minimalist Desk Gadgets
              </p>
              <div className="text-[11px] text-slate-500 mt-2 space-y-0.5">
                <p>House 14, Road 7, Dhanmondi, Dhaka-1205</p>
                <p>Hotline: <strong className="text-slate-800">01318043562</strong> | Web: atmodeskbd.com</p>
              </div>
            </div>

            <div className="flex flex-col items-end text-right">
              <span className="px-3 py-1 rounded-md bg-slate-900 text-white font-mono font-bold text-xs uppercase tracking-wider mb-2">
                Tax Invoice & Packing Slip
              </span>
              <BarcodeSVG value={order.trackingNumber || order.orderNumber} />
            </div>
          </div>

          {/* Invoice Meta Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                Order Number
              </span>
              <strong className="font-mono text-sm text-slate-950 block mt-0.5">
                #{order.orderNumber}
              </strong>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                Order Date
              </span>
              <strong className="text-slate-900 block mt-0.5">
                {formatDate(order.createdAt)}
              </strong>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                Payment Type
              </span>
              <strong className="text-slate-900 block mt-0.5">
                {order.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : order.paymentMethod}
              </strong>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                Courier Tracking
              </span>
              <strong className="font-mono text-slate-950 block mt-0.5">
                {order.trackingNumber || 'Pending Dispatch'}
              </strong>
              {order.shippingMethod && (
                <span className="text-[10px] text-slate-500">via {order.shippingMethod}</span>
              )}
            </div>
          </div>

          {/* Delivery & Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-slate-200 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <span className="text-slate-400 uppercase text-[10px] font-bold tracking-wider block mb-1">
                Recipient / Ship To:
              </span>
              <p className="font-black text-sm text-slate-950">{addr?.fullName || order.user?.name || 'Customer'}</p>
              <p className="text-slate-800 font-mono font-bold mt-1 text-xs">
                Phone: {phone}
              </p>
              <p className="text-slate-600 mt-1 leading-relaxed">
                {fullAddress || 'Address on file with customer service'}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
              <div>
                <span className="text-slate-400 uppercase text-[10px] font-bold tracking-wider block mb-1">
                  Delivery Notes & Instructions:
                </span>
                <p className="text-slate-700 italic">
                  {order.notes || 'Please handle with care. Fragile electronic desktop device.'}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                <span>Shipping Zone: <strong>{order.shippingMethod?.includes('Outside') ? 'Nationwide / Outside Dhaka' : 'Inside Dhaka'}</strong></span>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="py-6">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
              Ordered Items
            </h3>
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">#</th>
                    <th className="py-3 px-4">Item Details</th>
                    <th className="py-3 px-4 text-center w-20">Qty</th>
                    <th className="py-3 px-4 text-right w-28">Unit Price</th>
                    <th className="py-3 px-4 text-right w-28">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {order.items.map((item: any, idx: number) => (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-4 text-center font-mono text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="py-3.5 px-4">
                        <strong className="text-slate-950 block">{item.name}</strong>
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold">
                        {item.quantity}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-600">
                        {formatBDT(item.price)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-950">
                        {formatBDT(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing Calculation Breakdown & COD Stamp */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pt-4 border-t border-slate-200">
            {/* Courier instructions & Guarantee badge */}
            <div className="max-w-xs text-xs text-slate-500 space-y-1.5">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <p className="font-bold text-slate-800 text-[11px] mb-1">
                  🛡️ 7-Day Replacement Warranty
                </p>
                <p className="text-[10px] leading-relaxed text-slate-500">
                  Customer must check the package in the presence of the delivery agent. For any hardware assistance or queries, WhatsApp us at 01318043562.
                </p>
              </div>
            </div>

            {/* Price Calculations */}
            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono font-semibold">{formatBDT(order.subtotal)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Shipping Fee:</span>
                <span className="font-mono font-semibold">{formatBDT(order.shippingCost)}</span>
              </div>

              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount ({order.couponCode || 'Promo'}):</span>
                  <span className="font-mono">- {formatBDT(order.discountAmount)}</span>
                </div>
              )}

              {/* Grand COD Payable Box */}
              <div className="p-4 bg-slate-950 text-white rounded-2xl mt-3 shadow-sm">
                <div className="flex justify-between items-center text-xs">
                  <span className="uppercase font-bold tracking-wider text-slate-300">
                    {isPaid ? 'Total Paid' : 'Cash to Collect (COD)'}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500 text-slate-950">
                    {isPaid ? 'PAID' : 'COD'}
                  </span>
                </div>
                <div className="text-2xl font-black font-mono mt-1 text-white">
                  {formatBDT(codPayable)}
                </div>
              </div>
            </div>
          </div>

          {/* Footer signature line */}
          <div className="mt-12 pt-8 border-t border-slate-200 flex justify-between items-end text-xs text-slate-400">
            <div>
              <p className="font-mono text-[10px]">Printed: {new Date().toLocaleString('en-BD')}</p>
              <p className="text-[10px]">Thank you for choosing ATMODESK Bangladesh!</p>
            </div>
            <div className="text-center w-48 border-t border-slate-300 pt-2">
              <span className="text-[10px] uppercase font-bold text-slate-600 tracking-wider">
                Authorized Signature
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
