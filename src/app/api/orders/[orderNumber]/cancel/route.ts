// src/app/api/orders/[orderNumber]/cancel/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifySignedToken, sanitizeString, sanitizeMultiline } from '@/lib/security'
import { getServerUserSession } from '@/lib/user-auth'
import { normalizeBDPhone } from '@/lib/utils'

// Stages where cancellation is permitted (before leaving warehouse)
const CANCELLABLE_STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING']

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
    const reason = sanitizeMultiline(body?.reason || 'Cancelled by customer', 500)

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

    // Authorization check: Valid token OR matching phone OR logged-in user
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
        { error: 'Unauthorized: You do not have permission to cancel this order.' },
        { status: 403 }
      )
    }

    // Check status eligibility
    if (order.status === 'CANCELLED') {
      return NextResponse.json({ error: 'This order has already been cancelled.' }, { status: 400 })
    }

    if (!CANCELLABLE_STATUSES.includes(order.status)) {
      return NextResponse.json(
        {
          error:
            'This parcel has already left our warehouse with the courier and cannot be cancelled online. Please text us on WhatsApp at +880 1318-043562 for assistance.',
        },
        { status: 400 }
      )
    }

    // Process cancellation: update status and restore inventory
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // 1. Restore product stock
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { increment: item.quantity },
            soldCount: { decrement: item.quantity },
          },
        })
      }

      // 2. Append cancellation record to notes
      const timestamp = new Date().toLocaleString('en-BD', { timeZone: 'Asia/Dhaka' })
      const noteAppend = `\n[${timestamp}] Order Cancelled by Customer. Reason: ${reason}`
      const newNotes = (order.notes || '') + noteAppend

      // 3. Update order status
      return tx.order.update({
        where: { id: order.id },
        data: {
          status: 'CANCELLED',
          notes: newNotes.trim(),
        },
      })
    })

    return NextResponse.json({
      success: true,
      message: 'Your order has been successfully cancelled.',
      order: {
        orderNumber: updatedOrder.orderNumber,
        status: updatedOrder.status,
      },
    })
  } catch (error: any) {
    console.error('[Order Cancel Error]', error)
    return NextResponse.json(
      { error: 'Failed to cancel order. Please try again or contact support.' },
      { status: 500 }
    )
  }
}
