import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ensureDatabaseTables } from '@/lib/init-db'
import { isServerAdminAuthenticated } from '@/lib/admin-auth'
import { sanitizeString } from '@/lib/security'

const ALLOWED_ORDER_STATUSES = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
]

const ALLOWED_PAYMENT_STATUSES = ['PENDING', 'PAID', 'FAILED', 'REFUNDED']

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const isAuth = await isServerAdminAuthenticated()
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized: Admin privileges required.' }, { status: 401 })
    }

    await ensureDatabaseTables()
    const { id: rawId } = await params
    const id = sanitizeString(rawId, 100)
    const body = await req.json()
    const { status, paymentStatus, trackingNumber } = body

    const updateData: any = {}

    if (status && ALLOWED_ORDER_STATUSES.includes(status)) {
      updateData.status = status
    }

    if (paymentStatus && ALLOWED_PAYMENT_STATUSES.includes(paymentStatus)) {
      updateData.paymentStatus = paymentStatus
    }

    if (trackingNumber !== undefined) {
      updateData.trackingNumber = trackingNumber ? sanitizeString(trackingNumber, 100) : null
    }

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ success: true, order })
  } catch (error: any) {
    console.error('[Admin Order Update Error]', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
