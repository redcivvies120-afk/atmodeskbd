// src/app/api/orders/[orderNumber]/return/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifySignedToken, sanitizeString, sanitizeMultiline } from '@/lib/security'
import { getServerUserSession } from '@/lib/user-auth'
import { normalizeBDPhone } from '@/lib/utils'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber: rawOrderNumber } = await params
    const orderNumber = sanitizeString(rawOrderNumber, 50).trim().toUpperCase()

    if (!orderNumber) {
      return NextResponse.json({ error: 'Order number is required.' }, { status: 400 })
    }

    const body = await req.json().catch(() => ({}))
    const token = typeof body?.token === 'string' ? body.token.trim() : null
    const phone = typeof body?.phone === 'string' ? normalizeBDPhone(body.phone) : null
    const reason = sanitizeString(body?.reason, 100) || 'Defective / Damaged'
    const resolution = body?.resolution === 'REFUND' ? 'Cash Refund' : 'Replacement (Brand New Unit)'
    const refundMethod = sanitizeString(body?.refundMethod, 30) || 'bKash'
    const refundNumber = sanitizeString(body?.refundNumber, 30) || ''
    const details = sanitizeMultiline(body?.details || '', 1000)

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        address: true,
        items: true,
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 })
    }

    // Authorization check
    const session = await getServerUserSession()
    let isAuthorized = false

    if (session?.id && session.id === order.userId) {
      isAuthorized = true
    } else if (token) {
      const payload = await verifySignedToken<{ o: string }>(token, 'order')
      if (payload && payload.o === order.orderNumber) {
        isAuthorized = true
      }
    } else if (phone && order.address?.phone) {
      if (normalizeBDPhone(order.address.phone) === phone) {
        isAuthorized = true
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized: You do not have permission to request return for this order.' },
        { status: 403 }
      )
    }

    // Must be DELIVERED to request a return / refund
    if (order.status !== 'DELIVERED') {
      return NextResponse.json(
        { error: 'Return and refund requests can only be initiated after your order is delivered.' },
        { status: 400 }
      )
    }

    // Check 7-Day Guarantee Window
    const deliveryDate = order.updatedAt || order.createdAt
    const diffMs = Date.now() - new Date(deliveryDate).getTime()
    const diffDays = diffMs / (1000 * 60 * 60 * 24)

    if (diffDays > 7.0) {
      return NextResponse.json(
        {
          error:
            'The 7-day return and replacement window for this order has expired according to our store policy. If you need hardware support, please contact our helpline.',
        },
        { status: 400 }
      )
    }

    // Update order status to RETURN_REQUESTED and store return info in notes
    const timestamp = new Date().toLocaleString('en-BD', { timeZone: 'Asia/Dhaka' })
    const returnNote = `\n[${timestamp}] RETURN/REFUND REQUEST:
• Reason: ${reason}
• Resolution Choice: ${resolution}
• Refund Payout: ${refundMethod} (${refundNumber || 'N/A'})
• Customer Note: ${details || 'None'}`

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'RETURN_REQUESTED',
        notes: ((order.notes || '') + returnNote).trim(),
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Your return/refund request has been submitted. Our team will verify and contact you shortly.',
      order: {
        orderNumber: updatedOrder.orderNumber,
        status: updatedOrder.status,
      },
    })
  } catch (error: any) {
    console.error('[Order Return Error]', error)
    return NextResponse.json(
      { error: 'Failed to submit return request. Please contact support via WhatsApp.' },
      { status: 500 }
    )
  }
}
