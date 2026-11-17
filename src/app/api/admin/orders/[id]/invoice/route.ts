import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isServerAdminAuthenticated } from '@/lib/admin-auth'
import { buildInvoicePdf } from '@/lib/invoice-pdf'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isServerAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 })
  }

  const { id } = await params
  const order = await prisma.order.findUnique({
    where: { id },
    include: { address: true, items: true, user: true },
  })
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  const a = order.address
  const address = [a?.line1, a?.line2, a?.area, a?.city, a?.district, a?.postalCode]
    .filter(Boolean)
    .join(', ')

  try {
    const pdf = await buildInvoicePdf({
      invoiceNumber: `INV-${new Date(order.createdAt).getFullYear()}-${order.orderNumber}`,
      orderNumber: order.orderNumber,
      createdAt: order.createdAt,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      discountAmount: order.discountAmount,
      total: order.total,
      couponCode: order.couponCode,
      notes: order.notes,
      trackingNumber: order.trackingNumber,
      shippingMethod: order.shippingMethod,
      customerName: a?.fullName || order.user?.name || 'Customer',
      phone: a?.phone || order.user?.phone || '-',
      address,
      items: order.items.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        price: i.price,
        total: i.total,
      })),
    })

    const inline = new URL(req.url).searchParams.get('inline') === '1'
    return new Response(new Uint8Array(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `${inline ? 'inline' : 'attachment'}; filename="Invoice-ATMODESK-${order.orderNumber}.pdf"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    console.error('Invoice PDF generation failed', err)
    return NextResponse.json({ error: 'Could not generate the invoice PDF.' }, { status: 500 })
  }
}
