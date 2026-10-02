import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ensureDatabaseTables } from '@/lib/init-db'
import { sendToSteadfast, sendToPathao } from '@/lib/courier'
import { sendOrderShippedSMS } from '@/lib/sms'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await ensureDatabaseTables()
    const { id } = await params
    const body = await req.json()
    const { courier = 'steadfast', note } = body

    // 1. Fetch order details
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        address: true,
        items: true,
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (!order.address) {
      return NextResponse.json({ error: 'Order has no delivery address' }, { status: 400 })
    }

    const addr = order.address
    const fullAddress = [
      addr.line1,
      addr.line2,
      addr.area,
      addr.city,
      addr.district,
      addr.postalCode,
    ]
      .filter(Boolean)
      .join(', ')

    // If already paid, COD amount is 0; otherwise total order amount
    const codAmount = order.paymentStatus === 'PAID' ? 0 : order.total
    const itemDescription = order.items.map((i: any) => `${i.name} x${i.quantity}`).join(', ')

    const courierPayload = {
      orderNumber: order.orderNumber,
      recipientName: addr.fullName,
      recipientPhone: addr.phone,
      recipientAddress: fullAddress,
      recipientCity: addr.city,
      codAmount,
      note: note || order.notes || 'Fragile desk gadget',
      itemDescription,
    }

    // 2. Dispatch to selected courier
    let result
    if (courier === 'pathao') {
      result = await sendToPathao(courierPayload)
    } else {
      result = await sendToSteadfast(courierPayload)
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || `Failed to dispatch order to ${courier}` },
        { status: 400 }
      )
    }

    const courierDisplayName = result.courier === 'pathao' ? 'Pathao Courier' : 'Steadfast Courier'

    // 3. Update order in database with tracking number and mark as SHIPPED
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        trackingNumber: result.trackingCode,
        shippingMethod: courierDisplayName,
        status: 'SHIPPED',
      },
    })

    // 4. Send customer automated SMS notification with tracking code
    try {
      if (addr.phone) {
        await sendOrderShippedSMS({
          phone: addr.phone,
          customerName: addr.fullName,
          orderNumber: order.orderNumber,
          trackingNumber: result.trackingCode,
          courierName: courierDisplayName,
          orderId: order.id,
        })
      }
    } catch (smsError) {
      console.warn('[Dispatch SMS Warning]', smsError)
    }

    return NextResponse.json({
      success: true,
      courier: result.courier,
      courierName: courierDisplayName,
      consignmentId: result.consignmentId,
      trackingCode: result.trackingCode,
      trackingUrl: result.trackingUrl,
      status: result.status,
      simulated: result.simulated,
      order: updatedOrder,
    })
  } catch (error: any) {
    console.error('[Courier Dispatch API Error]', error)
    return NextResponse.json(
      { error: error?.message || 'Courier dispatch failed' },
      { status: 500 }
    )
  }
}
