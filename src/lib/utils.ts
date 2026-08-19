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

// Generate order number
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `ATD-${timestamp}-${random}`
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
    PENDING: 'Pending',
    CONFIRMED: 'Confirmed',
    PROCESSING: 'Processing',
    SHIPPED: 'Shipped',
    OUT_FOR_DELIVERY: 'Out for Delivery',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
    RETURNED: 'Returned',
    REFUNDED: 'Refunded',
  }
  return labels[status] || status
}

// Get order status color
export function getOrderStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    PROCESSING: 'bg-indigo-100 text-indigo-800',
    SHIPPED: 'bg-purple-100 text-purple-800',
    OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
    RETURNED: 'bg-gray-100 text-gray-800',
    REFUNDED: 'bg-pink-100 text-pink-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
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
