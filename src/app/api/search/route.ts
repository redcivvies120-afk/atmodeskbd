import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() || ''

  if (!q) {
    return NextResponse.json({ products: [], query: '' })
  }

  // Split query into individual words for smarter matching
  const words = q
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 1) // skip single chars

  if (words.length === 0) {
    return NextResponse.json({ products: [], query: q })
  }

  try {
    // Build OR conditions for each word across multiple fields
    const wordConditions = words.map((word) => ({
      OR: [
        { name: { contains: word, mode: 'insensitive' as const } },
        { description: { contains: word, mode: 'insensitive' as const } },
        { sku: { contains: word, mode: 'insensitive' as const } },
        { category: { name: { contains: word, mode: 'insensitive' as const } } },
      ],
    }))

    // All words must match (AND logic) — "smart clock" matches products with BOTH "smart" AND "clock"
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        AND: wordConditions,
      },
      include: { images: true, category: true },
      take: 24,
      orderBy: [
        { isFeatured: 'desc' },
        { soldCount: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    // Also get partial matches (any word) if we didn't find enough
    let extraProducts: any[] = []
    if (products.length < 6) {
      extraProducts = await prisma.product.findMany({
        where: {
          isActive: true,
          id: { notIn: products.map((p) => p.id) },
          OR: words.flatMap((word) => [
            { name: { contains: word, mode: 'insensitive' as const } },
            { description: { contains: word, mode: 'insensitive' as const } },
            { category: { name: { contains: word, mode: 'insensitive' as const } } },
          ]),
        },
        include: { images: true, category: true },
        take: 12 - products.length,
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      })
    }

    return NextResponse.json({
      products: [...products, ...extraProducts],
      query: q,
      exactCount: products.length,
      partialCount: extraProducts.length,
    })
  } catch (err) {
    console.error('Smart search error:', err)
    return NextResponse.json({ products: [], query: q, error: 'Search failed' })
  }
}
