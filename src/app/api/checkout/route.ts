import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateOrderNumber, isValidBDPhone, normalizeBDPhone } from '@/lib/utils'
import { ensureDatabaseTables } from '@/lib/init-db'
import { getClientIp, checkRateLimit, rateLimitExceededResponse } from '@/lib/rate-limit'
import { sanitizeString, sanitizeEmail, sanitizePhone, sanitizeMultiline } from '@/lib/security'
import { getServerUserSession } from '@/lib/user-auth'

export async function POST(req: Request) {
  try {
    // 1. Rate limiting: max 10 checkouts per 10 minutes per IP
    const clientIp = getClientIp(req)
    const rateCheck = checkRateLimit(`checkout:${clientIp}`, 10, 600)
    if (!rateCheck.success) {
      return rateLimitExceededResponse(rateCheck)
    }

    await ensureDatabaseTables()
    const body = await req.json()

    // 2. Input sanitization
    const fullName = sanitizeString(body?.fullName, 100)
    const rawPhone = sanitizePhone(body?.phone)
    const rawEmail = sanitizeEmail(body?.email)
    const line1 = sanitizeString(body?.line1, 200)
    const area = sanitizeString(body?.area, 100)
    const city = sanitizeString(body?.city, 100)
    const district = sanitizeString(body?.district, 100)
    const postalCode = sanitizeString(body?.postalCode, 20)
    const shippingLocation = body?.shippingLocation === 'outside_dhaka' ? 'outside_dhaka' : 'inside_dhaka'
    const paymentMethod = 'COD'
    const couponCode = sanitizeString(body?.couponCode, 30).toUpperCase()
    const notes = sanitizeMultiline(body?.notes, 500)
    const items = body?.items

    // 3. Address and cart validation
    if (!fullName || !rawPhone || !line1 || !city) {
      return NextResponse.json(
        { error: 'Please fill in all required address fields.' },
        { status: 400 }
      )
    }

    if (!isValidBDPhone(rawPhone)) {
      return NextResponse.json(
        { error: 'Please enter a valid 11-digit Bangladesh phone number (e.g., 01712345678).' },
        { status: 400 }
      )
    }

    const phone = normalizeBDPhone(rawPhone)

    if (!items || !Array.isArray(items) || items.length === 0 || items.length > 30) {
      return NextResponse.json(
        { error: 'Your cart contains an invalid number of items.' },
        { status: 400 }
      )
    }

    // 4. Server-side product price & inventory verification
    const productIds = items
      .map((i: any) => typeof i?.productId === 'string' ? sanitizeString(i.productId, 100) : null)
      .filter(Boolean) as string[]

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
      const quantity = parseInt(String(item?.quantity || 1), 10)
      if (isNaN(quantity) || quantity < 1 || quantity > 20) {
        return NextResponse.json(
          { error: 'Invalid quantity for an item in your cart.' },
          { status: 400 }
        )
      }

      const dbProduct = dbProducts.find((p) => p.id === item.productId)
      if (!dbProduct) {
        return NextResponse.json(
          { error: 'Product not found or currently unavailable.' },
          { status: 400 }
        )
      }

      if (dbProduct.stock < quantity) {
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

      const lineTotal = itemPrice * quantity
      subtotal += lineTotal

      const primaryImg = dbProduct.images.find((i) => i.isPrimary)?.url || dbProduct.images[0]?.url || ''

      orderItemsData.push({
        productId: dbProduct.id,
        variantId: item.variantId || null,
        name: dbProduct.name + (variantName ? ` (${variantName})` : ''),
        image: primaryImg,
        price: itemPrice,
        quantity,
        total: lineTotal,
      })
    }

    // 5. Coupon calculation (check static codes and database coupons)
    let discountAmount = 0
    if (couponCode) {
      if (couponCode === 'WELCOME10') {
        discountAmount = Math.round(subtotal * 0.1)
      } else if (couponCode === 'FLAT200' && subtotal >= 2000) {
        discountAmount = 200
      } else {
        const dbCoupon = await prisma.coupon.findUnique({
          where: { code: couponCode },
        })
        if (dbCoupon && dbCoupon.isActive) {
          if (!dbCoupon.minOrderAmount || subtotal >= dbCoupon.minOrderAmount) {
            if (dbCoupon.type === 'PERCENTAGE') {
              discountAmount = Math.round(subtotal * (dbCoupon.value / 100))
            } else {
              discountAmount = Math.min(subtotal, Math.round(dbCoupon.value))
            }
          }
        }
      }
    }

    // 6. Shipping calculation
    let shippingCost = shippingLocation === 'outside_dhaka' ? 120 : 60
    if (subtotal >= 2000 && shippingLocation !== 'outside_dhaka') {
      shippingCost = 0 // Free shipping in Dhaka over 2000 BDT
    }

    const total = Math.max(0, subtotal - discountAmount + shippingCost)

    // 7. Check authenticated user session first (link to real customer account)
    const session = await getServerUserSession()
    let user = null

    if (session?.id) {
      user = await prisma.user.findUnique({
        where: { id: session.id },
      })
    }

    if (!user) {
      user = await prisma.user.findFirst({
        where: {
          OR: [
            ...(rawEmail ? [{ email: rawEmail }] : []),
            { phone },
          ],
        },
      })
    }

    if (!user) {
      const guestEmail = rawEmail || `customer_${Date.now()}_${Math.random().toString(36).substring(2, 6)}@atmodeskbd.com`
      user = await prisma.user.create({
        data: {
          name: fullName,
          email: guestEmail,
          phone,
          role: 'CUSTOMER',
        },
      })
    }

    // 8. Create Address record
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

    // 9. Create Order
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
        paymentStatus: 'PENDING',
        paymentMethod,
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

    // 10. Deduct product stock in parallel
    await Promise.all(
      items.map((item: any) => {
        const qty = parseInt(String(item.quantity || 1), 10)
        return prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: qty },
            soldCount: { increment: qty },
          },
        })
      })
    )

    // 11. WhatsApp notification message for store administration
    const itemsList = orderItemsData.map((i: any) => `• ${i.name} x${i.quantity} = ৳${i.total}`).join('\n')
    const adminWhatsAppMsg = encodeURIComponent(
      `🛒 NEW ORDER #${orderNumber}\n\n` +
      `👤 ${fullName}\n📱 ${phone}\n📍 ${line1}, ${city}${district ? ', ' + district : ''}\n\n` +
      `📦 Items:\n${itemsList}\n\n` +
      `💰 Subtotal: ৳${subtotal}\n🚚 Shipping: ৳${shippingCost}\n${discountAmount > 0 ? `🎟️ Discount: -৳${discountAmount}\n` : ''}` +
      `✅ TOTAL: ৳${total}\n💳 Payment: Cash on Delivery (COD)\n\n` +
      `📅 Est. Delivery: ${estimatedDelivery.toLocaleDateString('en-BD')}` +
      `${notes ? '\n📝 Note: ' + notes : ''}`
    )

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
      total: order.total,
      customerName: fullName,
      estimatedDelivery: estimatedDelivery.toISOString(),
      adminNotifyUrl: `https://wa.me/8801318043562?text=${adminWhatsAppMsg}`,
    })
  } catch (error: any) {
    console.error('[Checkout Error]', error)
    return NextResponse.json(
      { error: 'Failed to place order. Please review your information and try again.' },
      { status: 500 }
    )
  }
}
