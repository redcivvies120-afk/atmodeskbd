// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format price in BDT
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('bn-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format price with ৳ symbol
export function formatBDT(amount: number): string {
  return `৳${amount.toLocaleString('en-BD')}`
}

// Generate slug from string
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Generate order number (CSPRNG suffix; works in both server and client bundles)
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const rand = Array.from(globalThis.crypto.getRandomValues(new Uint8Array(6)))
    .map((b) => b.toString(36).padStart(2, '0'))
    .join('')
    .slice(0, 8)
    .toUpperCase()
  return `ATD-${timestamp}-${rand}`
}

// Calculate discount percentage
export function calcDiscount(original: number, current: number): number {
  if (!original || original <= current) return 0
  return Math.round(((original - current) / original) * 100)
}

// Truncate text
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Get primary image url
export function getPrimaryImage(images: { url: string; isPrimary: boolean }[]): string {
  if (!images || images.length === 0) return '/placeholder-product.jpg'
  const primary = images.find((img) => img.isPrimary)
  return primary?.url || images[0]?.url || '/placeholder-product.jpg'
}

// Bangladesh phone validation
export function isValidBDPhone(phone: string): boolean {
  const cleaned = phone.replace(/\s+/g, '')
  return /^(\+?880|0)?1[3-9]\d{8}$/.test(cleaned)
}

// Normalize Bangladesh phone to standard 11-digit format (e.g. 01318043562)
export function normalizeBDPhone(phone: string): string {
  if (!phone) return ''
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('880') && digits.length >= 13) {
    return '0' + digits.slice(3)
  }
  if (digits.length === 10 && digits.startsWith('1')) {
    return '0' + digits
  }
  return digits
}

// Format date
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

// Format date short
export function formatDateShort(date: Date | string): string {
  return new Intl.DateTimeFormat('en-BD', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

// Get order status label
export function getOrderStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: 'Order Placed (Pending)',
    CONFIRMED: 'Order Accepted',
    PROCESSING: 'Prepared in Warehouse',
    SHIPPED: 'Shipped with Courier',
    OUT_FOR_DELIVERY: 'Out for Delivery',
    DELIVERED: 'Delivered',
    RETURN_REQUESTED: 'Return / Refund Requested',
    RETURNED: 'Returned',
    REFUNDED: 'Refunded',
    CANCELLED: 'Cancelled',
  }
  return labels[status] || status
}

// Get order status color
export function getOrderStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-200',
    PROCESSING: 'bg-sky-100 text-sky-800 border-sky-300',
    SHIPPED: 'bg-purple-100 text-purple-800 border-purple-200',
    OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-800 border-orange-200',
    DELIVERED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    RETURN_REQUESTED: 'bg-amber-100 text-amber-900 border-amber-300',
    RETURNED: 'bg-slate-100 text-slate-800 border-slate-200',
    REFUNDED: 'bg-pink-100 text-pink-800 border-pink-200',
    CANCELLED: 'bg-rose-100 text-rose-800 border-rose-200',
  }
  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200'
}

// Stub email notification (replace with real SMTP later)
export async function sendNotification(opts: {
  to: string
  subject: string
  body: string
}) {
  if (process.env.NODE_ENV === 'development') {
    console.log('📧 [Email stub]', opts)
  }
  // TODO: integrate nodemailer/sendgrid
}
