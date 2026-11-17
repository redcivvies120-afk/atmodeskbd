import PDFDocument from 'pdfkit'
import QRCode from 'qrcode'
import fs from 'node:fs'
import path from 'node:path'
import { STORE } from './store-info'

export interface InvoiceItem {
  name: string
  quantity: number
  price: number
  total: number
}

export interface InvoiceData {
  invoiceNumber: string
  orderNumber: string
  createdAt: Date
  status: string
  paymentStatus: string
  paymentMethod: string
  subtotal: number
  shippingCost: number
  discountAmount: number
  total: number
  couponCode?: string | null
  notes?: string | null
  trackingNumber?: string | null
  shippingMethod?: string | null
  customerName: string
  phone: string
  address: string
  items: InvoiceItem[]
}

const C = {
  navy: '#003060',
  brand: '#0077C8',
  sky: '#00A0F0',
  ink: '#0F2138',
  mute: '#5B6B80',
  line: '#E3E9F0',
  zebra: '#F5F8FC',
  green: '#0A8F4C',
}
const PAGE_W = 595.28
const PAGE_H = 841.89
const M = 40
const CW = PAGE_W - M * 2

const asset = (...p: string[]) => path.join(process.cwd(), ...p)
const FONT_DIR = ['src', 'assets', 'fonts']

function money(n: number): string {
  const v = Math.round(n * 100) / 100
  return (
    '৳' +
    v.toLocaleString('en-US', {
      minimumFractionDigits: Number.isInteger(v) ? 0 : 2,
      maximumFractionDigits: 2,
    })
  )
}

function fmtDate(d: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Dhaka',
  }).format(d)
}

export async function buildInvoicePdf(d: InvoiceData): Promise<Buffer> {
  const doc = new PDFDocument({
    size: 'A4',
    margin: M,
    bufferPages: true,
    info: {
      Title: `Invoice ${d.invoiceNumber}`,
      Author: STORE.name,
      Subject: `Order ${d.orderNumber}`,
    },
  })
  const chunks: Buffer[] = []
  doc.on('data', (c: Buffer) => chunks.push(c))
  const finished = new Promise<Buffer>((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)
  })

  doc.registerFont('R', fs.readFileSync(asset(...FONT_DIR, 'HindSiliguri-Regular.ttf')))
  doc.registerFont('M', fs.readFileSync(asset(...FONT_DIR, 'HindSiliguri-Medium.ttf')))
  doc.registerFont('B', fs.readFileSync(asset(...FONT_DIR, 'HindSiliguri-Bold.ttf')))
  const logoPath = asset('public', 'logo-header.png')
  const hasLogo = fs.existsSync(logoPath)

  const isPaid = d.paymentStatus === 'PAID'
  const trackUrl = `${STORE.siteUrl}/track-order?order=${encodeURIComponent(d.orderNumber)}`

  // ---------- helpers ----------
  const label = (txt: string, x: number, y: number, w?: number) =>
    doc.font('B').fontSize(7).fillColor(C.mute).text(txt.toUpperCase(), x, y, { width: w, characterSpacing: 0.6 })

  const topBar = () => {
    doc.rect(0, 0, PAGE_W, 6).fill(C.navy)
    doc.rect(0, 6, PAGE_W, 2).fill(C.sky)
  }

  const fullHeader = (): number => {
    topBar()
    const y = 30
    if (hasLogo) doc.image(logoPath, M, y, { height: 56 })
    const tx = hasLogo ? M + 96 : M
    doc.font('B').fontSize(13).fillColor(C.navy).text(STORE.name, tx, y + 2, { lineBreak: false })
    doc.font('R').fontSize(8.5).fillColor(C.mute)
    doc.text(STORE.address, tx, y + 21, { lineBreak: false })
    doc.text(`${STORE.phone} (${STORE.phoneNote})`, tx, y + 33, { lineBreak: false })
    doc.text(STORE.email, tx, y + 45, { lineBreak: false })

    doc.font('B').fontSize(26).fillColor(C.navy).text('INVOICE', M, y, { width: CW, align: 'right' })
    doc.font('M').fontSize(9).fillColor(C.mute).text(d.invoiceNumber, M, y + 32, { width: CW, align: 'right' })
    if (isPaid) {
      doc.roundedRect(PAGE_W - M - 46, y + 48, 46, 16, 8).fill(C.green)
      doc.font('B').fontSize(8).fillColor('#fff').text('PAID', PAGE_W - M - 46, y + 52, { width: 46, align: 'center' })
    }
    return y + 76
  }

  const miniHeader = (): number => {
    topBar()
    doc.font('B').fontSize(11).fillColor(C.navy).text(STORE.name, M, 26, { lineBreak: false })
    doc.font('M').fontSize(9).fillColor(C.mute).text(`${d.invoiceNumber} (continued)`, M, 28, { width: CW, align: 'right' })
    return 56
  }

  // ---------- page 1 header + meta strip ----------
  let y = fullHeader()

  doc.roundedRect(M, y, CW, 44, 6).fill(C.zebra)
  const metaCols: [string, string][] = [
    ['Invoice date', fmtDate(d.createdAt)],
    ['Order number', `#${d.orderNumber}`],
    ['Payment', d.paymentMethod === 'COD' ? 'Cash on Delivery' : d.paymentMethod],
    ['Order status', d.status.replace(/_/g, ' ')],
  ]
  const colW = CW / 4
  metaCols.forEach(([k, v], i) => {
    const x = M + i * colW + 12
    label(k, x, y + 8, colW - 16)
    doc.font('M').fontSize(9.5).fillColor(C.ink).text(v, x, y + 21, { width: colW - 16, lineBreak: false, ellipsis: true })
  })
  y += 44 + 14

  // ---------- bill-to / delivery boxes ----------
  const boxW = (CW - 12) / 2
  const nameH = (() => {
    doc.font('B').fontSize(11)
    return doc.heightOfString(d.customerName, { width: boxW - 24 })
  })()
  doc.font('R').fontSize(9)
  const addrH = doc.heightOfString(d.address || 'Address on record', { width: boxW - 24 })
  const leftH = 20 + nameH + 14 + addrH + 14

  const zone = d.shippingMethod?.includes('Outside') ? 'Outside Dhaka' : 'Inside Dhaka'
  const notes = d.notes?.trim() || 'Please text the customer before delivery. Handle with care.'
  doc.font('R').fontSize(9)
  const notesH = doc.heightOfString(notes, { width: boxW - 24 })
  const rightH = 20 + 14 + 14 + 14 + notesH + 14
  const bh = Math.max(leftH, rightH, 90)

  doc.roundedRect(M, y, boxW, bh, 6).lineWidth(0.8).stroke(C.line)
  label('Bill to / ship to', M + 12, y + 10)
  doc.font('B').fontSize(11).fillColor(C.ink).text(d.customerName, M + 12, y + 22, { width: boxW - 24 })
  doc.font('M').fontSize(9).fillColor(C.ink).text(`Phone: ${d.phone}`, M + 12, y + 24 + nameH, { width: boxW - 24 })
  doc.font('R').fontSize(9).fillColor(C.mute).text(d.address || 'Address on record', M + 12, y + 38 + nameH, { width: boxW - 24 })

  const rx = M + boxW + 12
  doc.roundedRect(rx, y, boxW, bh, 6).lineWidth(0.8).stroke(C.line)
  label('Delivery', rx + 12, y + 10)
  doc.font('R').fontSize(9).fillColor(C.mute)
  doc.text(`Courier: `, rx + 12, y + 24, { continued: true }).font('M').fillColor(C.ink).text(d.shippingMethod || 'To be assigned')
  doc.font('R').fillColor(C.mute).text(`Tracking ID: `, rx + 12, y + 38, { continued: true }).font('M').fillColor(C.ink).text(d.trackingNumber || 'Pending dispatch')
  doc.font('R').fillColor(C.mute).text(`Zone: `, rx + 12, y + 52, { continued: true }).font('M').fillColor(C.ink).text(zone)
  doc.font('R').fontSize(9).fillColor(C.mute).text(notes, rx + 12, y + 68, { width: boxW - 24 })
  y += bh + 18

  // ---------- items table ----------
  const col = {
    n: M + 10,
    name: M + 34,
    qty: M + 318,
    unit: M + 358,
    amt: M + 432,
  }
  const tableHead = (yy: number): number => {
    doc.rect(M, yy, CW, 22).fill(C.navy)
    doc.font('B').fontSize(8).fillColor('#fff')
    doc.text('#', col.n, yy + 7, { width: 20, lineBreak: false })
    doc.text('ITEM', col.name, yy + 7, { width: 270, lineBreak: false })
    doc.text('QTY', col.qty, yy + 7, { width: 34, align: 'center', lineBreak: false })
    doc.text('UNIT PRICE', col.unit, yy + 7, { width: 68, align: 'right', lineBreak: false })
    doc.text('AMOUNT', col.amt, yy + 7, { width: 73, align: 'right', lineBreak: false })
    return yy + 22
  }
  y = tableHead(y)

  d.items.forEach((it, i) => {
    doc.font('M').fontSize(9.5)
    const h = doc.heightOfString(it.name, { width: 270 })
    const rowH = Math.max(h + 14, 26)
    if (y + rowH > PAGE_H - 120) {
      doc.addPage()
      y = tableHead(miniHeader())
    }
    if (i % 2 === 1) doc.rect(M, y, CW, rowH).fill(C.zebra)
    doc.font('R').fontSize(9).fillColor(C.mute).text(String(i + 1), col.n, y + 7, { width: 20, lineBreak: false })
    doc.font('M').fontSize(9.5).fillColor(C.ink).text(it.name, col.name, y + 7, { width: 270 })
    doc.font('M').fontSize(9.5).fillColor(C.ink).text(String(it.quantity), col.qty, y + 7, { width: 34, align: 'center', lineBreak: false })
    doc.font('R').fontSize(9.5).fillColor(C.ink).text(money(it.price), col.unit, y + 7, { width: 68, align: 'right', lineBreak: false })
    doc.font('B').fontSize(9.5).fillColor(C.ink).text(money(it.total), col.amt, y + 7, { width: 73, align: 'right', lineBreak: false })
    y += rowH
    doc.moveTo(M, y).lineTo(M + CW, y).lineWidth(0.5).stroke(C.line)
  })
  y += 16

  // ---------- totals + policy + QR ----------
  if (y + 190 > PAGE_H - 70) {
    doc.addPage()
    y = miniHeader() + 8
  }
  const totX = M + CW - 240
  const rows: [string, string, string][] = [['Subtotal', money(d.subtotal), C.ink], ['Delivery charge', money(d.shippingCost), C.ink]]
  if (d.discountAmount > 0) rows.push([`Discount${d.couponCode ? ` (${d.couponCode})` : ''}`, `− ${money(d.discountAmount)}`, C.green])
  let ty = y
  rows.forEach(([k, v, colr]) => {
    doc.font('R').fontSize(9.5).fillColor(C.mute).text(k, totX, ty, { width: 120, lineBreak: false })
    doc.font('M').fontSize(9.5).fillColor(colr).text(v, totX + 120, ty, { width: 120, align: 'right', lineBreak: false })
    ty += 18
  })
  ty += 4
  doc.roundedRect(totX, ty, 240, 62, 8).fill(C.navy)
  doc.font('B').fontSize(7.5).fillColor('#BFD7F0').text(isPaid ? 'TOTAL PAID' : 'CASH TO COLLECT ON DELIVERY', totX + 14, ty + 11, { width: 212, characterSpacing: 0.6 })
  doc.font('B').fontSize(22).fillColor('#fff').text(money(isPaid ? d.total : d.total), totX + 14, ty + 26, { width: 212 })

  // left: policy box
  const polW = 250
  doc.roundedRect(M, y, polW, 74, 6).fill(C.zebra)
  doc.font('B').fontSize(8.5).fillColor(C.navy).text('7-day brand-new replacement guarantee', M + 12, y + 10, { width: polW - 24 })
  doc.font('R').fontSize(7.8).fillColor(C.mute).text(
    'Verified manufacturing defects or transit damage reported within 7 days of delivery are replaced with a brand-new unit. Cash refunds are not provided.',
    M + 12, y + 24, { width: polW - 24 }
  )

  // QR (vector)
  const qr = QRCode.create(trackUrl, { errorCorrectionLevel: 'M' })
  const n = qr.modules.size
  const cell = 2.3
  const qrSize = n * cell
  const qy = y + 88
  doc.rect(M - 4, qy - 4, qrSize + 8, qrSize + 8).fill('#fff')
  doc.fillColor(C.ink)
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (qr.modules.data[r * n + c]) doc.rect(M + c * cell, qy + r * cell, cell + 0.15, cell + 0.15).fill(C.ink)
    }
  }
  doc.font('B').fontSize(9).fillColor(C.navy).text('Scan to track your order', M + qrSize + 14, qy + 8, { width: 180 })
  doc.font('R').fontSize(8).fillColor(C.mute).text(`Order #${d.orderNumber}`, M + qrSize + 14, qy + 22, { width: 180 })
  doc.font('R').fontSize(7.5).fillColor(C.mute).text(trackUrl.replace('https://', ''), M + qrSize + 14, qy + 34, { width: 200 })

  // signature
  const sy = Math.max(ty + 62 + 36, qy + qrSize + 6)
  doc.moveTo(totX + 40, sy).lineTo(totX + 240, sy).lineWidth(0.6).stroke(C.mute)
  doc.font('B').fontSize(7.5).fillColor(C.mute).text('AUTHORIZED SIGNATORY', totX + 40, sy + 4, { width: 200, align: 'center', characterSpacing: 0.5 })

  // ---------- footer on every page ----------
  const range = doc.bufferedPageRange()
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i)
    const fy = PAGE_H - 52
    doc.page.margins.bottom = 0
    doc.moveTo(M, fy).lineTo(M + CW, fy).lineWidth(0.6).stroke(C.line)
    doc.font('M').fontSize(8).fillColor(C.navy).text(`Thank you for shopping with ${STORE.name}`, M, fy + 8, { width: CW, align: 'center', lineBreak: false })
    doc.font('R').fontSize(7.5).fillColor(C.mute).text(`${STORE.phone} (${STORE.phoneNote})  ·  ${STORE.email}  ·  ${STORE.siteUrl.replace('https://', '')}`, M, fy + 20, { width: CW, align: 'center', lineBreak: false })
    doc.font('R').fontSize(7.5).fillColor(C.mute).text(`Page ${i - range.start + 1} of ${range.count}`, M, fy + 20, { width: CW, align: 'right', lineBreak: false })
  }

  doc.end()
  return finished
}
