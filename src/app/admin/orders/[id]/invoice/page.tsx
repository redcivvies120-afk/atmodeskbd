import { requireAdmin } from '@/lib/admin-guard'
import React from 'react'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { formatBDT, formatDate } from '@/lib/utils'
import { InvoiceActions } from './InvoiceActions'
import Image from 'next/image'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface InvoicePageProps {
  params: Promise<{ id: string }>
}

// Generates a crisp SVG barcode pattern from any alphanumeric string
function BarcodeSVG({ value }: { value: string }) {
  const chars = (value || 'ATMODESK').toUpperCase()
  const bars: { width: number; isBlack: boolean }[] = []

  // Leading quiet zone & start pattern
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

  // Trailing stop pattern
  bars.push({ width: 2, isBlack: true })
  bars.push({ width: 1, isBlack: false })
  bars.push({ width: 3, isBlack: true })

  const totalWidth = bars.reduce((sum, b) => sum + b.width, 0) * 1.8

  let currentX = 0
  return (
    <div className="flex flex-col items-center">
      <svg width={totalWidth} height="36" className="overflow-visible">
        {bars.map((bar, idx) => {
          const x = currentX
          const w = bar.width * 1.8
          currentX += w
          if (!bar.isBlack) return null
          return <rect key={idx} x={x} y="0" width={w} height="36" fill="#0f172a" />
        })}
      </svg>
      <span className="font-mono text-[9px] tracking-widest text-slate-700 mt-1 uppercase font-bold">
        *{value}*
      </span>
    </div>
  )
}

export default async function OrderInvoicePage({ params }: InvoicePageProps) {
  await requireAdmin()
  const { id } = await params

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
  const customerName = addr?.fullName || order.user?.name || 'Customer'
  const isPaid = order.paymentStatus === 'PAID'
  const codPayable = isPaid ? 0 : order.total
  const invoiceNumber = `INV-${new Date(order.createdAt).getFullYear()}-${order.orderNumber}`

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

  const trackOrderUrl = `https://atmodeskbd.vercel.app/track-order?order=${order.orderNumber}`
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=110x110&margin=2&data=${encodeURIComponent(
    trackOrderUrl
  )}`

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-4 sm:px-6 lg:px-8 print:p-0 print:bg-white text-slate-900 font-sans">
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm 10mm;
          }
          body {
            background: white !important;
            color: #0f172a !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          #invoice-printable-card {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
            margin: 0 !important;
          }
        }
      `}</style>

      <div className="max-w-4xl mx-auto">
        {/* Interactive PDF, Print & WhatsApp Header */}
        <InvoiceActions
          orderNumber={order.orderNumber}
          customerPhone={phone}
          customerName={customerName}
          totalAmount={order.total}
          codAmount={codPayable}
        />

        {/* Printable Paper Canvas (Target for PDF Generation) */}
        <div
          id="invoice-printable-card"
          className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm print:rounded-none relative text-slate-900"
        >
          {/* TOP BANNER & BRAND HEADER */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b-2 border-slate-950 pb-6">
            <div>
              {/* Brand Logo & Title */}
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-950 flex items-center justify-center text-white font-black text-lg shadow-sm">
                  A
                </div>
                <div>
                  <span className="text-2xl font-black tracking-tight text-slate-950 font-mono block leading-none">
                    ATMODESK
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">
                    Smart Workspace Tech • Bangladesh
                  </span>
                </div>
              </div>

              {/* Company Info & Official Contacts */}
              <div className="text-[11px] text-slate-600 mt-3 space-y-0.5">
                <p className="font-semibold text-slate-800">Atmodesk Bangladesh Ltd.</p>
                <p>House 14, Road 7, Dhanmondi, Dhaka-1205</p>
                <p>
                  WhatsApp: <strong className="text-slate-900">01318043562</strong> (Text only) | Web:{' '}
                  <span className="text-slate-900 font-medium">atmodeskbd.com</span>
                </p>
              </div>
            </div>

            {/* Document Title & Tracking Barcode */}
            <div className="flex flex-col items-start sm:items-end text-left sm:text-right">
              <span className="px-3 py-1 rounded-md bg-slate-950 text-white font-mono font-bold text-[11px] uppercase tracking-wider mb-2 shadow-2xs">
                Commercial Invoice & Packing Slip
              </span>
              <BarcodeSVG value={order.trackingNumber || order.orderNumber} />
            </div>
          </div>

          {/* INVOICE METADATA RIBBON */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                Invoice Reference
              </span>
              <strong className="font-mono text-xs text-slate-950 block mt-0.5">
                {invoiceNumber}
              </strong>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                Order Date & Time
              </span>
              <strong className="text-slate-900 block mt-0.5 text-xs">
                {formatDate(order.createdAt)}
              </strong>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                Payment Terms
              </span>
              <div className="mt-0.5">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                  {order.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : order.paymentMethod}
                </span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                Courier Tracking ID
              </span>
              <strong className="font-mono text-slate-950 block mt-0.5 text-xs">
                {order.trackingNumber || 'Pending Dispatch'}
              </strong>
              {order.shippingMethod && (
                <span className="text-[10px] text-slate-500 font-medium">
                  via {order.shippingMethod}
                </span>
              )}
            </div>
          </div>

          {/* CUSTOMER & DISPATCH INFORMATION CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-5 border-b border-slate-200 text-xs">
            {/* Recipient Card */}
            <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/90">
              <span className="text-slate-400 uppercase text-[10px] font-bold tracking-wider block mb-1">
                Ship To (Customer):
              </span>
              <p className="font-black text-sm text-slate-950">{customerName}</p>
              <p className="text-slate-900 font-mono font-bold mt-1 text-xs">
                Phone: <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200">{phone}</span>
              </p>
              <p className="text-slate-700 mt-2 leading-relaxed text-[11px]">
                {fullAddress || 'Address on record with customer service'}
              </p>
            </div>

            {/* Courier & Dispatch Card */}
            <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/90 flex flex-col justify-between">
              <div>
                <span className="text-slate-400 uppercase text-[10px] font-bold tracking-wider block mb-1">
                  Delivery Notes & Instructions:
                </span>
                <p className="text-slate-700 italic text-[11px] leading-relaxed">
                  {order.notes || 'Please text customer via WhatsApp/SMS before delivery. Handle with care.'}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] text-slate-500 flex justify-between items-center">
                <span>
                  Delivery Zone:{' '}
                  <strong className="text-slate-800">
                    {order.shippingMethod?.includes('Outside')
                      ? 'Nationwide / Outside Dhaka'
                      : 'Inside Dhaka'}
                  </strong>
                </span>
                <span className="font-bold text-slate-700">Fragile Electronic</span>
              </div>
            </div>
          </div>

          {/* LINE ITEMS TABLE */}
          <div className="py-5">
            <h3 className="font-bold text-slate-900 text-[11px] uppercase tracking-wider mb-2.5">
              Ordered Products & Specifications
            </h3>
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/80 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4 w-12 text-center">#</th>
                    <th className="py-2.5 px-4">Product Description</th>
                    <th className="py-2.5 px-4 text-center w-20">Quantity</th>
                    <th className="py-2.5 px-4 text-right w-28">Unit Price</th>
                    <th className="py-2.5 px-4 text-right w-28">Total Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {order.items.map((item: any, idx: number) => (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 text-center font-mono text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4">
                        <strong className="text-slate-950 block text-xs">{item.name}</strong>
                        <span className="text-[10px] text-slate-500 font-mono">
                          SKU: ATMO-CLK-{item.productId?.slice(-4) || 'GEN'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-bold">
                        <span className="inline-block px-2 py-0.5 bg-slate-100 rounded-md font-mono text-slate-900">
                          {item.quantity}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-700">
                        {formatBDT(item.price)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-950">
                        {formatBDT(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FINANCIAL SUMMARY & COD HANDOVER BANNER */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pt-2 border-t border-slate-200">
            {/* Guarantee Policy Badge */}
            <div className="max-w-sm text-xs text-slate-600 space-y-2">
              <div className="p-3.5 bg-sky-50/70 border border-sky-100 rounded-2xl">
                <p className="font-extrabold text-sky-950 text-xs flex items-center gap-1.5 mb-1">
                  🛡️ 7-Day Brand New Replacement Guarantee
                </p>
                <p className="text-[10px] leading-relaxed text-sky-900/80">
                  Eligible for 100% brand new unit replacement for verified manufacturing defects or transit damage within 7 days of delivery. No cash refunds are provided.
                </p>
              </div>

              <div className="text-[10px] text-slate-500 pl-1">
                <p>
                  <strong>Customer Service:</strong> Text us on WhatsApp at{' '}
                  <span className="text-slate-800 font-bold">+880 1318-043562</span> (Strictly text only, no phone calls).
                </p>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="w-full sm:w-80 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono font-semibold">{formatBDT(order.subtotal)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Courier Delivery Fee:</span>
                <span className="font-mono font-semibold">{formatBDT(order.shippingCost)}</span>
              </div>

              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount ({order.couponCode || 'Promo'}):</span>
                  <span className="font-mono">- {formatBDT(order.discountAmount)}</span>
                </div>
              )}

              {/* COD BANNER */}
              <div className="p-4 bg-slate-950 text-white rounded-2xl mt-3 shadow-md border border-slate-800">
                <div className="flex justify-between items-center text-xs">
                  <span className="uppercase font-bold tracking-wider text-slate-300 text-[10px]">
                    {isPaid ? 'Total Paid' : 'Cash to Collect (COD)'}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                      isPaid ? 'bg-emerald-500 text-slate-950' : 'bg-sky-400 text-slate-950'
                    }`}
                  >
                    {isPaid ? 'PAID' : 'COD ON DELIVERY'}
                  </span>
                </div>
                <div className="text-2xl font-black font-mono mt-1 text-white">
                  {formatBDT(codPayable)}
                </div>
                <p className="text-[10px] text-slate-400 mt-1 border-t border-slate-800/80 pt-1">
                  {isPaid
                    ? 'Payment settled via online transaction.'
                    : 'Courier Rider: Please collect exact cash amount upon delivery handover.'}
                </p>
              </div>
            </div>
          </div>

          {/* VERIFICATION QR CODE & SIGNATURE FOOTER */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            {/* Scannable Live Tracking QR Code */}
            <div className="flex items-center gap-3">
              <img
                src={qrCodeUrl}
                alt="Track Order QR Code"
                width={64}
                height={64}
                className="rounded-lg border border-slate-200"
              />
              <div className="text-[10px] text-slate-500 leading-tight">
                <strong className="text-slate-800 block text-[11px]">Scan to Track Order</strong>
                <span>Scan with phone camera to view</span>
                <span className="block text-slate-400 font-mono">atmodeskbd.com</span>
              </div>
            </div>

            {/* Official Digital Seal & Authorized Signature */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="inline-block px-3 py-1 rounded-full border border-emerald-300 bg-emerald-50 text-emerald-800 font-mono text-[9px] font-bold uppercase tracking-wider">
                  ✓ Verified Dispatch
                </div>
                <span className="block text-[9px] text-slate-400 mt-0.5">QC Inspected</span>
              </div>

              <div className="text-center w-40 border-t border-slate-300 pt-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-700 tracking-wider block">
                  Authorized Signatory
                </span>
                <span className="text-[9px] text-slate-400 block font-mono">Atmodesk Operations</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
