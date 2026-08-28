import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateOrderNumber, isValidBDPhone } from '@/lib/utils'
import { ensureDatabaseTables } from '@/lib/init-db'

export async function POST(req: Request) {
  try {
    await ensureDatabaseTables()
    const body = await req.json()
    const {
      fullName,
      phone,
      email,
      line1,
      area,
      city,
      district,
      postalCode,
      shippingLocation, // 'inside_dhaka' | 'outside_dhaka'
      paymentMethod, // 'COD' | 'BKASH' | 'NAGAD' | 'CARD'
      couponCode,
      notes,
      items, // array of { productId, variantId, quantity }
    } = body

    // 1. Basic validation
    if (!fullName || !phone || !line1 || !city) {
      return NextResponse.json(
        { error: 'Please fill in all required address fields.' },
        { status: 400 }
      )
    }

    if (!isValidBDPhone(phone)) {
      return NextResponse.json(
        { error: 'Please enter a valid Bangladesh phone number (e.g., 01712345678).' },
        { status: 400 }
      )
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Your cart is empty.' },
        { status: 400 }
      )
    }

    // 2. Fetch products from database to verify prices and stock server-side
    const productIds = items.map((i: any) => i.productId)
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
      include: { images: true, variants: true },
    })

    if (dbProducts.length === 0) {
      return NextResponse.json(
        { error: 'Selected products are unavailable.' },
        { status: 400 }
      )
    }

    let subtotal = 0
    const orderItemsData: any[] = []

    for (const item of items) {
      const dbProduct = dbProducts.find((p) => p.id === item.productId)
      if (!dbProduct) {
        return NextResponse.json(
          { error: `Product not found or currently unavailable.` },
          { status: 400 }
        )
      }

      if (dbProduct.stock < item.quantity) {
        return NextResponse.json(
          { error: `"${dbProduct.name}" only has ${dbProduct.stock} units remaining.` },
          { status: 400 }
        )
      }

      let itemPrice = dbProduct.price
      let variantName = null

      if (item.variantId) {
        const dbVariant = dbProduct.variants.find((v) => v.id === item.variantId)
        if (dbVariant) {
          if (dbVariant.price) itemPrice = dbVariant.price
          variantName = `${dbVariant.name}: ${dbVariant.value}`
        }
      }

      const lineTotal = itemPrice * item.quantity
      subtotal += lineTotal

      const primaryImg = dbProduct.images.find((i) => i.isPrimary)?.url || dbProduct.images[0]?.url || ''

      orderItemsData.push({
        productId: dbProduct.id,
        variantId: item.variantId || null,
        name: dbProduct.name + (variantName ? ` (${variantName})` : ''),
        image: primaryImg,
        price: itemPrice,
        quantity: item.quantity,
        total: lineTotal,
      })
    }

    // 3. Calculate coupon discount server-side
    let discountAmount = 0
    if (couponCode) {
      const code = couponCode.trim().toUpperCase()
      if (code === 'WELCOME10') {
        discountAmount = Math.round(subtotal * 0.1)
      } else if (code === 'FLAT200' && subtotal >= 2000) {
        discountAmount = 200
      }
    }

    // 4. Calculate shipping cost
    let shippingCost = shippingLocation === 'outside_dhaka' ? 120 : 60
    if (subtotal >= 2000 && shippingLocation !== 'outside_dhaka') {
      shippingCost = 0 // Free shipping in Dhaka over 2000
    }

    const total = Math.max(0, subtotal - discountAmount + shippingCost)

    // 5. Check or create guest/customer user
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(email ? [{ email }] : []),
          { phone },
        ],
      },
    })

    if (!user) {
      const guestEmail = email || `customer_${Date.now()}@atmodeskbd.com`
      user = await prisma.user.create({
        data: {
          name: fullName,
          email: guestEmail,
          phone,
          role: 'CUSTOMER',
        },
      })
    }

    // 6. Create Address record
    const address = await prisma.address.create({
      data: {
        userId: user.id,
        label: 'Shipping',
        fullName,
        phone,
        line1,
        area: area || null,
        city,
        district: district || city,
        postalCode: postalCode || null,
      },
    })

    // 7. Create Order in Database
    const orderNumber = generateOrderNumber()
    const estimatedDays = shippingLocation === 'outside_dhaka' ? 4 : 2
    const estimatedDelivery = new Date()
    estimatedDelivery.setDate(estimatedDelivery.getDate() + estimatedDays)

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user.id,
        addressId: address.id,
        status: 'PENDING',
        paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PENDING',
        paymentMethod: paymentMethod || 'COD',
        subtotal,
        discountAmount,
        shippingCost,
        total,
        couponCode: couponCode || null,
        notes: notes || null,
        shippingMethod: shippingLocation === 'outside_dhaka' ? 'Outside Dhaka (Nationwide)' : 'Inside Dhaka',
        estimatedDelivery,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
      },
    })

    // 8. Deduct product stock in database
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: { decrement: item.quantity },
          soldCount: { increment: item.quantity },
        },
      })
    }

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
      total: order.total,
    })
  } catch (error: any) {
    console.error('[Checkout Error]', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to place order. Please try again.' },
      { status: 500 }
    )
  }
}
