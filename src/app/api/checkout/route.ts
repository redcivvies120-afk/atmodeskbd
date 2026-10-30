// src/app/api/checkout/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateOrderNumber, isValidBDPhone, normalizeBDPhone } from '@/lib/utils'
import { getClientIp, checkRateLimit, rateLimitExceededResponse } from '@/lib/rate-limit'
import {
  sanitizeString,
  sanitizeEmail,
  sanitizePhone,
  sanitizeMultiline,
  createSignedToken,
} from '@/lib/security'
import { getServerUserSession } from '@/lib/user-auth'

class OutOfStock extends Error {}
class CouponExhausted extends Error {}

/** Server-side coupon validation. Honors every rule the Coupon model defines. */
async function resolveCoupon(code: string, subtotal: number) {
  if (!code) return null
  const c = await prisma.coupon.findUnique({ where: { code } })
  const now = new Date()
  if (!c || !c.isActive) return null
  if (c.startsAt && c.startsAt > now) return null
  if (c.expiresAt && c.expiresAt < now) return null
  if (c.usageLimit != null && c.usedCount >= c.usageLimit) return null
  if (c.minOrderAmount && subtotal < c.minOrderAmount) return null

  let discount =
    c.type === 'PERCENTAGE'
      ? Math.round((subtotal * Math.min(c.value, 100)) / 100)
      : Math.round(c.value)
  if (c.maxDiscount) discount = Math.min(discount, c.maxDiscount)
  discount = Math.max(0, Math.min(discount, subtotal))
  return { coupon: c, discount }
}

/** Optional bot check. Active only when TURNSTILE_SECRET is set (Cloudflare Turnstile, free). */
async function passesBotCheck(token: unknown, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET
  if (!secret) return true
  if (typeof token !== 'string' || !token) return false
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    })
    const data = await res.json()
    return data?.success === true
  } catch {
    return false
  }
}

export async function POST(req: Request) {
  try {
    // 1. Rate limit (shared store)
    const clientIp = getClientIp(req)
    const rateCheck = await checkRateLimit(`checkout:${clientIp}`, 10, 600)
    if (!rateCheck.success) return rateLimitExceededResponse(rateCheck)

    const body = await req.json()

    if (!(await passesBotCheck(body?.turnstileToken, clientIp))) {
      return NextResponse.json({ error: 'Bot check failed. Please try again.' }, { status: 400 })
    }

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

    if (!fullName || !rawPhone || !line1 || !city) {
      return NextResponse.json({ error: 'Please fill in all required address fields.' }, { status: 400 })
    }
    if (!isValidBDPhone(rawPhone)) {
      return NextResponse.json(
        { error: 'Please enter a valid 11-digit Bangladesh phone number (e.g., 01712345678).' },
        { status: 400 }
      )
    }
    const phone = normalizeBDPhone(rawPhone)

    if (!Array.isArray(items) || items.length === 0 || items.length > 30) {
      return NextResponse.json({ error: 'Your cart contains an invalid number of items.' }, { status: 400 })
    }

    // 3. Per-phone abuse limit (DB-backed, works on serverless)
    const pendingRecent = await prisma.order.count({
      where: {
        status: 'PENDING',
        address: { phone },
        createdAt: { gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
    })
    if (pendingRecent >= 3) {
      return NextResponse.json(
        { error: 'Too many pending orders for this phone number. Please wait for confirmation.' },
        { status: 429 }
      )
    }

    // 4. Merge quantities per product (blocks the "same product on many lines" stock bypass)
    const qtyByProduct = new Map<string, number>()
    for (const it of items) {
      const pid = typeof it?.productId === 'string' ? sanitizeString(it.productId, 100) : ''
      const q = Number.parseInt(String(it?.quantity ?? 1), 10)
      if (!pid || !Number.isInteger(q) || q < 1 || q > 20) {
        return NextResponse.json({ error: 'Invalid quantity for an item in your cart.' }, { status: 400 })
      }
      qtyByProduct.set(pid, (qtyByProduct.get(pid) ?? 0) + q)
    }
    for (const q of qtyByProduct.values()) {
      if (q > 20) {
        return NextResponse.json({ error: 'Maximum 20 units per product per order.' }, { status: 400 })
      }
    }

    // 5. Server-side prices (never trust the client)
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: [...qtyByProduct.keys()] }, isActive: true },
      include: { images: true, variants: true },
    })

    let subtotal = 0
    const orderItemsData: any[] = []

    for (const item of items) {
      const pid = sanitizeString(item.productId, 100)
      const quantity = Number.parseInt(String(item?.quantity ?? 1), 10)
      const dbProduct = dbProducts.find((p) => p.id === pid)
      if (!dbProduct) {
        return NextResponse.json({ error: 'Product not found or currently unavailable.' }, { status: 400 })
      }
      if (dbProduct.stock < (qtyByProduct.get(pid) ?? 0)) {
        return NextResponse.json(
          { error: `"${dbProduct.name}" only has ${dbProduct.stock} units remaining.` },
          { status: 400 }
        )
      }

      let itemPrice = dbProduct.price
      let variantName: string | null = null
      let variantId: string | null = null

      if (item.variantId) {
        const dbVariant = dbProduct.variants.find((v) => v.id === item.variantId)
        if (!dbVariant) {
          return NextResponse.json({ error: 'Selected variant is unavailable.' }, { status: 400 })
        }
        if (dbVariant.stock != null && dbVariant.stock < quantity) {
          return NextResponse.json(
            { error: `"${dbProduct.name}" (${dbVariant.value}) has limited stock.` },
            { status: 400 }
          )
        }
        if (dbVariant.price) itemPrice = dbVariant.price
        variantName = `${dbVariant.name}: ${dbVariant.value}`
        variantId = dbVariant.id
      }

      const lineTotal = itemPrice * quantity
      subtotal += lineTotal
      const primaryImg =
        dbProduct.images.find((i) => i.isPrimary)?.url || dbProduct.images[0]?.url || ''

      orderItemsData.push({
        productId: dbProduct.id,
        variantId,
        name: dbProduct.name + (variantName ? ` (${variantName})` : ''),
        image: primaryImg,
        price: itemPrice,
        quantity,
        total: lineTotal,
      })
    }

    // 6. Promo codes currently disabled
    const applied = null
    const discountAmount = 0

    // 7. Shipping
    let shippingCost = shippingLocation === 'outside_dhaka' ? 120 : 60
    if (subtotal >= 2000 && shippingLocation !== 'outside_dhaka') shippingCost = 0
    const total = Math.max(0, subtotal - discountAmount + shippingCost)

    // 8. Who is ordering? Only the verified logged-in user is ever attached to an existing account.
    //    Anonymous checkouts get a NEW guest record, never an existing customer's account.
    const session = await getServerUserSession()
    let user = session?.id ? await prisma.user.findUnique({ where: { id: session.id } }) : null
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: fullName,
          email: `guest_${crypto.randomUUID()}@guest.atmodeskbd.com`,
          phone,
          role: 'CUSTOMER',
        },
      })
    }

    // 9. Atomic: stock decrement + coupon claim + address + order, all or nothing
    const orderNumber = generateOrderNumber()
    const estimatedDelivery = new Date()
    estimatedDelivery.setDate(estimatedDelivery.getDate() + (shippingLocation === 'outside_dhaka' ? 4 : 2))

    let order
    try {
      order = await prisma.$transaction(async (tx) => {
        for (const [productId, qty] of qtyByProduct) {
          const r = await tx.product.updateMany({
            where: { id: productId, isActive: true, stock: { gte: qty } }, // guard + decrement in ONE statement
            data: { stock: { decrement: qty }, soldCount: { increment: qty } },
          })
          if (r.count !== 1) throw new OutOfStock()
        }

        // Coupon processing disabled for now

        const address = await tx.address.create({
          data: {
            userId: user!.id,
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

        return tx.order.create({
          data: {
            orderNumber,
            userId: user!.id,
            addressId: address.id,
            status: 'PENDING',
            paymentStatus: 'PENDING',
            paymentMethod,
            subtotal,
            discountAmount,
            shippingCost,
            total,
            couponCode: null,
            notes: notes || null,
            shippingMethod: shippingLocation === 'outside_dhaka' ? 'Outside Dhaka (Nationwide)' : 'Inside Dhaka',
            estimatedDelivery,
            items: { create: orderItemsData },
          },
          include: { items: true },
        })
      })
    } catch (e) {
      if (e instanceof OutOfStock) {
        return NextResponse.json({ error: 'An item in your cart just went out of stock.' }, { status: 409 })
      }
      if (e instanceof CouponExhausted) {
        return NextResponse.json({ error: 'This coupon is no longer available.' }, { status: 409 })
      }
      throw e
    }

    // 10. Admin WhatsApp notification text
    const itemsList = orderItemsData.map((i) => `• ${i.name} x${i.quantity} = ৳${i.total}`).join('\n')
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
      // Signed proof-of-ownership for the confirmation page (30 days)
      accessToken: await createSignedToken({ o: order.orderNumber }, 'order', 60 * 60 * 24 * 30),
      adminNotifyUrl: `https://wa.me/8801318043562?text=${adminWhatsAppMsg}`,
    })
  } catch (error) {
    console.error('[Checkout Error]', error)
    return NextResponse.json(
      { error: 'Failed to place order. Please review your information and try again.' },
      { status: 500 }
    )
  }
}
