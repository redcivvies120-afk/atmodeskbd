// src/app/api/storefront/orders/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateOrderNumber, isValidBDPhone, normalizeBDPhone } from '@/lib/utils'
import { sanitizeString, sanitizePhone, sanitizeMultiline } from '@/lib/security'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // 1. Sanitize & validate inputs
    const fullName = sanitizeString(body?.name, 100)
    const rawPhone = sanitizePhone(body?.phone)
    const address = sanitizeMultiline(body?.address, 300)
    const note = sanitizeMultiline(body?.note, 500)
    const items = body?.items

    if (!fullName || !rawPhone || !address) {
      return NextResponse.json(
        { error: 'Please provide your full name, phone number, and delivery address.' },
        { status: 400 }
      )
    }

    if (!isValidBDPhone(rawPhone)) {
      return NextResponse.json(
        { error: 'Please enter a valid 11-digit Bangladesh phone number (01XXXXXXXXX).' },
        { status: 400 }
      )
    }
    const phone = normalizeBDPhone(rawPhone)

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Your cart is empty. Add at least one product.' },
        { status: 400 }
      )
    }

    // 2. Look up products from database (Never trust client prices)
    const verifiedItems: {
      productId: string
      name: string
      image: string
      price: number
      quantity: number
      total: number
      sku: string
    }[] = []

    let calculatedSubtotal = 0

    for (const it of items) {
      const targetSku = String(it.sku || it.id || '').trim()
      const qty = Math.max(1, Math.min(Number(it.q || it.quantity || 1), 10))

      // Lookup product by sku or id
      const product = await prisma.product.findFirst({
        where: {
          isActive: true,
          OR: [
            { sku: targetSku },
            { id: targetSku },
            { name: { contains: String(it.n || '').trim(), mode: 'insensitive' } },
          ],
        },
        include: { images: { orderBy: { sortOrder: 'asc' } } },
      })

      if (!product) {
        continue
      }

      // Check stock
      if (product.stock < qty) {
        return NextResponse.json(
          { error: `Sorry, "${product.name}" only has ${product.stock} units left in stock.` },
          { status: 400 }
        )
      }

      const verifiedPrice = Math.round(product.price)
      const lineTotal = verifiedPrice * qty
      calculatedSubtotal += lineTotal

      verifiedItems.push({
        productId: product.id,
        name: product.name,
        image: product.images[0]?.url || '/logo.jpg',
        price: verifiedPrice,
        quantity: qty,
        total: lineTotal,
        sku: product.sku,
      })
    }

    if (verifiedItems.length === 0) {
      return NextResponse.json(
        { error: 'None of the items in your order could be verified in inventory.' },
        { status: 400 }
      )
    }

    // 3. Server delivery charge calculation:
    // Free delivery inside Dhaka over ৳2,000, otherwise ৳60
    const shippingCost = calculatedSubtotal >= 2000 ? 0 : 60
    const calculatedTotal = calculatedSubtotal + shippingCost

    // 4. Find or create guest user
    const guestEmail = `${phone}@atmodeskbd.local`
    let user = await prisma.user.findFirst({
      where: { OR: [{ phone }, { email: guestEmail }] },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: fullName,
          phone,
          email: guestEmail,
          role: 'CUSTOMER',
        },
      })
    }

    // 5. Create address
    const savedAddress = await prisma.address.create({
      data: {
        userId: user.id,
        label: 'Order Delivery',
        fullName,
        phone,
        line1: address,
        city: 'Dhaka',
      },
    })

    // 6. Generate official order number
    const orderNumber = generateOrderNumber()

    // 7. Atomic transaction to create order, order items, and decrement stock
    const newOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: user.id,
          addressId: savedAddress.id,
          status: 'PENDING',
          paymentStatus: 'PENDING',
          paymentMethod: 'COD',
          subtotal: calculatedSubtotal,
          shippingCost,
          total: calculatedTotal,
          notes: note || 'Placed via Storefront Quick Checkout',
          shippingMethod: 'Steadfast Courier',
        },
      })

      // Create order items & decrement stock
      for (const item of verifiedItems) {
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity,
            total: item.total,
          },
        })

        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
            soldCount: { increment: item.quantity },
          },
        })
      }

      return order
    })

    // Return the response format expected by storefront.html: {"orderId": 1234}
    // Using order.orderNumber so customer and admin can immediately track it
    return NextResponse.json({
      orderId: newOrder.orderNumber,
      message: 'Order placed successfully via Cash on Delivery.',
    })
  } catch (error: any) {
    console.error('Storefront order placement error:', error)
    return NextResponse.json(
      { error: 'Could not place the order. Please try again or message us on WhatsApp.' },
      { status: 500 }
    )
  }
}
