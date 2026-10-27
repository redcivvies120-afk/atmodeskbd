// src/app/api/admin/orders/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isServerAdminAuthenticated } from '@/lib/admin-auth'
import { sanitizeString } from '@/lib/security'

const ALLOWED_ORDER_STATUSES = [
  'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED',
]
const ALLOWED_PAYMENT_STATUSES = ['PENDING', 'PAID', 'FAILED', 'REFUNDED']

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await isServerAdminAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized: Admin privileges required.' }, { status: 401 })
    }

    const { id: rawId } = await params
    const id = sanitizeString(rawId, 100)
    const body = await req.json()
    const { status, paymentStatus, trackingNumber } = body

    const updateData: any = {}
    if (status && ALLOWED_ORDER_STATUSES.includes(status)) updateData.status = status
    if (paymentStatus && ALLOWED_PAYMENT_STATUSES.includes(paymentStatus)) updateData.paymentStatus = paymentStatus
    if (trackingNumber !== undefined) {
      updateData.trackingNumber = trackingNumber ? sanitizeString(trackingNumber, 100) : null
    }

    const order = await prisma.$transaction(async (tx) => {
      const existing = await tx.order.findUnique({
        where: { id },
        select: { status: true, items: { select: { productId: true, quantity: true } } },
      })
      if (!existing) return null

      // Cancelling an order puts its stock back (once)
      if (updateData.status === 'CANCELLED' && existing.status !== 'CANCELLED') {
        for (const it of existing.items) {
          await tx.product.update({
            where: { id: it.productId },
            data: { stock: { increment: it.quantity }, soldCount: { decrement: it.quantity } },
          })
        }
      }
      return tx.order.update({ where: { id }, data: updateData })
    })

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error('[Admin Order Update Error]', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
