// src/lib/sms.ts
import { prisma } from '@/lib/prisma'
import { normalizeBDPhone } from '@/lib/utils'

export interface SendSMSOptions {
  phone: string
  message: string
  orderId?: string
  userId?: string
}

export interface SendSMSResult {
  success: boolean
  provider?: string
  messageId?: string
  error?: string
  simulated?: boolean
}

/**
 * Format BD phone to 8801XXXXXXXXX or 01XXXXXXXXX based on provider requirements
 */
export function formatBDPhoneForGateway(phone: string, includeCountryCode = true): string {
  const normalized = normalizeBDPhone(phone) // returns 01XXXXXXXXX
  if (!normalized) return ''
  if (includeCountryCode) {
    return '88' + normalized
  }
  return normalized
}

/**
 * Core SMS sender with support for Greenweb, BulkSMS BD, ElitBuzz, and Simulated dev mode
 */
export async function sendSMS({
  phone,
  message,
  orderId,
  userId,
}: SendSMSOptions): Promise<SendSMSResult> {
  const provider = (process.env.SMS_PROVIDER || 'greenweb').toLowerCase()
  const apiKey = process.env.SMS_API_KEY || process.env.GREENWEB_TOKEN || process.env.BULKSMSBD_API_KEY
  const senderId = process.env.SMS_SENDER_ID || 'ATMODESK'

  // If no API key is provided, run in safe simulation mode (doesn't fail or crash)
  if (!apiKey) {
    console.log(`📱 [SMS Simulated] to: ${phone} | message: "${message}"`)

    // Save notification record in database if orderId is available
    try {
      if (orderId) {
        await prisma.notification.create({
          data: {
            orderId,
            userId: userId || null,
            type: 'SMS',
            title: 'SMS Notification (Simulated)',
            message,
          },
        })
      }
    } catch (e) {
      // Ignore notification save errors
    }

    return {
      success: true,
      provider: 'simulated',
      simulated: true,
    }
  }

  try {
    let result: SendSMSResult = { success: false }

    if (provider === 'greenweb') {
      const recipient = formatBDPhoneForGateway(phone, false) // 01XXXXXXXXX or 8801...
      const url = `https://api.greenweb.com.bd/api.php?token=${encodeURIComponent(apiKey)}&to=${encodeURIComponent(recipient)}&message=${encodeURIComponent(message)}`
      const res = await fetch(url, { method: 'GET' })
      const text = await res.text()

      if (text.toLowerCase().includes('ok') || text.toLowerCase().includes('success') || text.includes('CAM')) {
        result = { success: true, provider: 'greenweb', messageId: text.trim() }
      } else {
        result = { success: false, provider: 'greenweb', error: text }
      }
    } else if (provider === 'bulksmsbd') {
      const recipient = formatBDPhoneForGateway(phone, true) // 8801XXXXXXXXX
      const url = `https://bulksmsbd.net/api/smsapi?api_key=${encodeURIComponent(apiKey)}&type=text&number=${encodeURIComponent(recipient)}&senderid=${encodeURIComponent(senderId)}&message=${encodeURIComponent(message)}`
      const res = await fetch(url, { method: 'GET' })
      const json = await res.json().catch(() => null)

      if (json?.response_code === 202 || json?.success) {
        result = { success: true, provider: 'bulksmsbd', messageId: json.message_id || json.msg }
      } else {
        result = { success: false, provider: 'bulksmsbd', error: json?.error_message || 'BulkSMS BD error' }
      }
    } else if (provider === 'elitbuzz') {
      const recipient = formatBDPhoneForGateway(phone, true)
      const url = `https://portal.elitbuzz-bd.com/smsapi?api_key=${encodeURIComponent(apiKey)}&type=text&contacts=${encodeURIComponent(recipient)}&senderid=${encodeURIComponent(senderId)}&msg=${encodeURIComponent(message)}`
      const res = await fetch(url, { method: 'GET' })
      const text = await res.text()

      if (text.includes('SMS SUBMITTED') || text.includes('success')) {
        result = { success: true, provider: 'elitbuzz', messageId: text.trim() }
      } else {
        result = { success: false, provider: 'elitbuzz', error: text }
      }
    }

    // Record in DB
    if (orderId && result.success) {
      await prisma.notification.create({
        data: {
          orderId,
          userId: userId || null,
          type: 'SMS',
          title: `SMS Sent (${result.provider})`,
          message,
        },
      }).catch(() => null)
    }

    return result
  } catch (error: any) {
    console.error('[SMS Gateway Error]:', error)
    return {
      success: false,
      error: error?.message || 'Failed to send SMS through gateway',
    }
  }
}

/**
 * Automated Template: Order Placed / Confirmed
 */
export async function sendOrderConfirmationSMS({
  phone,
  customerName,
  orderNumber,
  total,
  orderId,
}: {
  phone: string
  customerName: string
  orderNumber: string
  total: number
  orderId?: string
}) {
  const firstName = customerName ? customerName.split(' ')[0] : 'Customer'
  const message = `Dear ${firstName}, your ATMODESK order #${orderNumber} for BDT ${total} is confirmed! Cash on Delivery. Track: https://atmodeskbd-eo1e.vercel.app/track-order Help: 01318043562`
  return sendSMS({ phone, message, orderId })
}

/**
 * Automated Template: Handed Over to Courier (Shipped)
 */
export async function sendOrderShippedSMS({
  phone,
  customerName,
  orderNumber,
  trackingNumber,
  courierName,
  orderId,
}: {
  phone: string
  customerName: string
  orderNumber: string
  trackingNumber?: string
  courierName?: string
  orderId?: string
}) {
  const firstName = customerName ? customerName.split(' ')[0] : 'Customer'
  const courier = courierName || 'Courier'
  const trackingText = trackingNumber ? ` Tracking: ${trackingNumber}.` : ''
  const message = `Dear ${firstName}, your ATMODESK order #${orderNumber} has been dispatched via ${courier}.${trackingText} Please keep cash ready. Hotline: 01318043562`
  return sendSMS({ phone, message, orderId })
}

/**
 * Automated Template: Order Delivered
 */
export async function sendOrderDeliveredSMS({
  phone,
  customerName,
  orderNumber,
  orderId,
}: {
  phone: string
  customerName: string
  orderNumber: string
  orderId?: string
}) {
  const firstName = customerName ? customerName.split(' ')[0] : 'Customer'
  const message = `Dear ${firstName}, your ATMODESK order #${orderNumber} has been delivered! Enjoy your smart desk tech. Need setup support? WhatsApp: 01318043562`
  return sendSMS({ phone, message, orderId })
}
