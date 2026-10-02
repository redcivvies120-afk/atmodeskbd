import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ensureDatabaseTables } from '@/lib/init-db'
import {
  sendSMS,
  sendOrderConfirmationSMS,
  sendOrderShippedSMS,
  sendOrderDeliveredSMS,
} from '@/lib/sms'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await ensureDatabaseTables()
    const { id } = await params
    const body = await req.json()
    const { type = 'CONFIRM', customMessage } = body

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        address: true,
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const phone = order.address?.phone
    const customerName = order.address?.fullName || 'Customer'

    if (!phone) {
      return NextResponse.json({ error: 'Customer has no phone number on file' }, { status: 400 })
    }

    let result
    if (type === 'CONFIRM') {
      result = await sendOrderConfirmationSMS({
        phone,
        customerName,
        orderNumber: order.orderNumber,
        total: order.total,
        orderId: order.id,
      })
    } else if (type === 'SHIPPED') {
      result = await sendOrderShippedSMS({
        phone,
        customerName,
        orderNumber: order.orderNumber,
        trackingNumber: order.trackingNumber || undefined,
        courierName: order.shippingMethod || 'Courier',
        orderId: order.id,
      })
    } else if (type === 'DELIVERED') {
      result = await sendOrderDeliveredSMS({
        phone,
        customerName,
        orderNumber: order.orderNumber,
        orderId: order.id,
      })
    } else if (type === 'CUSTOM') {
      if (!customMessage || !customMessage.trim()) {
        return NextResponse.json({ error: 'Custom message text cannot be empty' }, { status: 400 })
      }
      result = await sendSMS({
        phone,
        message: customMessage.trim(),
        orderId: order.id,
      })
    } else {
      return NextResponse.json({ error: `Invalid SMS type: ${type}` }, { status: 400 })
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to dispatch SMS' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      provider: result.provider,
      messageId: result.messageId,
      simulated: result.simulated,
      message: 'SMS sent successfully',
    })
  } catch (error: any) {
    console.error('[Admin Order SMS Error]', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to send SMS' },
      { status: 500 }
    )
  }
}
