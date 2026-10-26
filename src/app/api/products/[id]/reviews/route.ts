import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ensureDatabaseTables } from '@/lib/init-db'
import { getClientIp, checkRateLimit, rateLimitExceededResponse } from '@/lib/rate-limit'
import { sanitizeString, sanitizeMultiline, sanitizeEmail } from '@/lib/security'
import { getServerUserSession } from '@/lib/user-auth'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // 1. Rate limiting: max 5 reviews per 10 minutes per IP
    const clientIp = getClientIp(req)
    const rateCheck = checkRateLimit(`review:${clientIp}`, 5, 600)
    if (!rateCheck.success) {
      return rateLimitExceededResponse(rateCheck)
    }

    await ensureDatabaseTables()
    const { id: rawId } = await params
    const id = sanitizeString(rawId, 100)
    const body = await req.json()

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    // 2. Input sanitization
    const name = sanitizeString(body?.name, 100)
    const rawEmail = sanitizeEmail(body?.email)
    const title = body?.title ? sanitizeString(body.title, 150) : null
    const reviewBody = sanitizeMultiline(body?.comment || body?.body, 2000)
    const rawRating = body?.rating

    if (!name) {
      return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 })
    }

    if (!reviewBody || reviewBody.length < 5) {
      return NextResponse.json({ error: 'Please write a review comment (minimum 5 characters).' }, { status: 400 })
    }

    const numRating = Number(rawRating)
    if (!numRating || numRating < 1 || numRating > 5) {
      return NextResponse.json({ error: 'Please select a valid rating between 1 and 5 stars.' }, { status: 400 })
    }

    // 3. Verify product exists
    const product = await prisma.product.findUnique({
      where: { id },
      select: { id: true, name: true },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 })
    }

    // 4. Link to authenticated user if session exists
    let userId = null
    const session = await getServerUserSession()
    if (session?.id) {
      userId = session.id
    } else if (rawEmail) {
      const existingUser = await prisma.user.findFirst({
        where: { email: rawEmail },
        select: { id: true },
      })
      if (existingUser) userId = existingUser.id
    }

    const review = await prisma.review.create({
      data: {
        productId: id,
        userId,
        authorName: name,
        rating: Math.round(numRating),
        title: title || null,
        body: reviewBody,
        isApproved: true,
        isVerified: true,
      },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
    })

    // 5. Recalculate product rating and review count
    const allReviews = await prisma.review.findMany({
      where: { productId: id, isApproved: true },
      select: { rating: true },
    })

    const newCount = allReviews.length
    const totalScore = allReviews.reduce((sum, r) => sum + r.rating, 0)
    const newRating = Math.round((totalScore / newCount) * 10) / 10

    await prisma.product.update({
      where: { id },
      data: {
        rating: newRating,
        reviewCount: newCount,
      },
    })

    return NextResponse.json({
      success: true,
      review,
      newRating,
      newCount,
      message: 'Review submitted successfully!',
    })
  } catch (error: any) {
    console.error('[Product Review Submission Error]', error)
    return NextResponse.json(
      { error: 'Failed to submit review. Please try again.' },
      { status: 500 }
    )
  }
}
