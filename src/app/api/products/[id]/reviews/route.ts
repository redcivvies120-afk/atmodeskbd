// src/app/api/products/[id]/reviews/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getClientIp, checkRateLimit, rateLimitExceededResponse } from '@/lib/rate-limit'
import { sanitizeString, sanitizeMultiline } from '@/lib/security'
import { getServerUserSession } from '@/lib/user-auth'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // 1. Login required (stops anonymous spam and email-based impersonation)
    const session = await getServerUserSession()
    if (!session?.id) {
      return NextResponse.json({ error: 'Please sign in to write a review.' }, { status: 401 })
    }

    // 2. Rate limit (shared store): per IP and per user
    const clientIp = getClientIp(req)
    const ipCheck = await checkRateLimit(`review_ip:${clientIp}`, 5, 600)
    if (!ipCheck.success) return rateLimitExceededResponse(ipCheck)
    const userCheck = await checkRateLimit(`review_user:${session.id}`, 10, 86400)
    if (!userCheck.success) return rateLimitExceededResponse(userCheck)

    const { id: rawId } = await params
    const id = sanitizeString(rawId, 100)
    if (!id) return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })

    const body = await req.json()
    const name = sanitizeString(body?.name, 100)
    const title = body?.title ? sanitizeString(body.title, 150) : null
    const reviewBody = sanitizeMultiline(body?.comment || body?.body, 2000)
    const numRating = Number(body?.rating)

    if (!name) return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 })
    if (!reviewBody || reviewBody.length < 5) {
      return NextResponse.json({ error: 'Please write a review comment (minimum 5 characters).' }, { status: 400 })
    }
    if (!Number.isFinite(numRating) || numRating < 1 || numRating > 5) {
      return NextResponse.json({ error: 'Please select a valid rating between 1 and 5 stars.' }, { status: 400 })
    }

    const product = await prisma.product.findUnique({ where: { id }, select: { id: true } })
    if (!product) return NextResponse.json({ error: 'Product not found.' }, { status: 404 })

    // 3. One review per user per product
    const already = await prisma.review.findFirst({
      where: { productId: id, userId: session.id },
      select: { id: true },
    })
    if (already) {
      return NextResponse.json({ error: 'You have already reviewed this product.' }, { status: 409 })
    }

    // 4. "Verified" is derived from a real DELIVERED order, never self-declared
    const bought = await prisma.orderItem.findFirst({
      where: { productId: id, order: { userId: session.id, status: 'DELIVERED' } },
      select: { id: true },
    })

    const review = await prisma.review.create({
      data: {
        productId: id,
        userId: session.id,
        authorName: name,
        rating: Math.round(numRating),
        title: title || null,
        body: reviewBody,
        isVerified: !!bought,
        isApproved: !!bought, // unverified reviews wait for admin approval
      },
      include: { user: { select: { id: true, name: true, image: true } } },
    })

    // 5. Recompute rating with an aggregate (no loading every review)
    const agg = await prisma.review.aggregate({
      where: { productId: id, isApproved: true },
      _avg: { rating: true },
      _count: { _all: true },
    })
    const newRating = Math.round((agg._avg.rating ?? 0) * 10) / 10
    const newCount = agg._count._all
    await prisma.product.update({ where: { id }, data: { rating: newRating, reviewCount: newCount } })

    return NextResponse.json({
      success: true,
      review,
      newRating,
      newCount,
      message: bought
        ? 'Review submitted successfully!'
        : 'Thanks! Your review will appear after moderation.',
    })
  } catch (error) {
    console.error('[Product Review Submission Error]', error)
    return NextResponse.json({ error: 'Failed to submit review. Please try again.' }, { status: 500 })
  }
}
