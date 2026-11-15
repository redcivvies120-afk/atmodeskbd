// src/app/api/storefront/products/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    })

    const categoryIndexMap = new Map<string, number>()
    categories.forEach((c, idx) => {
      categoryIndexMap.set(c.id, idx)
    })

    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        category: true,
      },
      orderBy: [
        { isFeatured: 'desc' },
        { soldCount: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    const payload = products.map((p) => {
      const primaryImage =
        p.images.find((img) => img.isPrimary)?.url ||
        p.images[0]?.url ||
        '/logo.jpg'

      const catIdx = p.categoryId ? (categoryIndexMap.get(p.categoryId) ?? 0) : 0

      return {
        id: p.sku || p.id,
        name: p.name,
        category: catIdx,
        price: Math.round(p.price),
        oldPrice: p.originalPrice ? Math.round(p.originalPrice) : undefined,
        image: primaryImage,
        slug: p.slug,
        stock: p.stock,
      }
    })

    return NextResponse.json(payload, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  } catch (error: any) {
    console.error('Storefront products API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
