import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ensureDatabaseTables } from '@/lib/init-db'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await ensureDatabaseTables()
    const { id } = await params
    const body = await req.json()
    const { name, email, rating, title, comment } = body

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 })
    }

    const reviewBody = comment || body.body
    if (!reviewBody || typeof reviewBody !== 'string' || !reviewBody.trim()) {
      return NextResponse.json({ error: 'Please write your review comment.' }, { status: 400 })
    }

    const numRating = Number(rating)
    if (!numRating || numRating < 1 || numRating > 5) {
      return NextResponse.json({ error: 'Please select a valid rating between 1 and 5 stars.' }, { status: 400 })
    }

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id },
      select: { id: true, name: true },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 })
    }

    // Find or create customer account for the review
    const reviewerEmail = email && typeof email === 'string' && email.includes('@')
      ? email.trim().toLowerCase()
      : `guest_rev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}@atmodesk.local`

    let user = await prisma.user.findFirst({
      where: { email: reviewerEmail },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: name.trim(),
          email: reviewerEmail,
          role: 'CUSTOMER',
        },
      })
    }

    // Check if user already reviewed this product
    const existing = await prisma.review.findUnique({
      where: {
        productId_userId: {
          productId: id,
          userId: user.id,
        },
      },
    })

    let review
    if (existing) {
      review = await prisma.review.update({
        where: { id: existing.id },
        data: {
          rating: Math.round(numRating),
          title: title ? title.trim() : null,
          body: reviewBody.trim(),
          isApproved: true,
          isVerified: true,
        },
        include: {
          user: {
            select: { id: true, name: true, image: true },
          },
        },
      })
    } else {
      review = await prisma.review.create({
        data: {
          productId: id,
          userId: user.id,
          rating: Math.round(numRating),
          title: title ? title.trim() : null,
          body: reviewBody.trim(),
          isApproved: true,
          isVerified: true,
        },
        include: {
          user: {
            select: { id: true, name: true, image: true },
          },
        },
      })
    }

    // Recalculate product rating and review count
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
      { error: error?.message || 'Failed to submit review' },
      { status: 500 }
    )
  }
}
