import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const { status, paymentStatus, trackingNumber } = body

    const order = await prisma.order.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(paymentStatus ? { paymentStatus } : {}),
        ...(trackingNumber !== undefined ? { trackingNumber } : {}),
      },
    })

    return NextResponse.json({ success: true, order })
  } catch (error: any) {
    console.error('[Admin Order Update Error]', error)
    return NextResponse.json({ error: error.message || 'Failed to update order' }, { status: 500 })
  }
}
