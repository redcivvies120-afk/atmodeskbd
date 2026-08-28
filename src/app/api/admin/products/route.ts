import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'
import { ensureDatabaseTables } from '@/lib/init-db'

export async function POST(req: Request) {
  try {
    await ensureDatabaseTables()
    const body = await req.json()
    const {
      name,
      sku,
      categoryId,
      price,
      originalPrice,
      stock,
      description,
      details,
      imageUrl,
      isFeatured,
      isBestSeller,
      isNewArrival,
      isActive,
    } = body

    if (!name || !sku || !price) {
      return NextResponse.json({ error: 'Name, SKU, and Price are required.' }, { status: 400 })
    }

    const slug = slugify(name) + '-' + Date.now().toString(36)
    const numPrice = parseFloat(price)
    const numOriginal = originalPrice ? parseFloat(originalPrice) : null
    const discount = numOriginal && numOriginal > numPrice ? Math.round(((numOriginal - numPrice) / numOriginal) * 100) : 0

    const product = await prisma.product.create({
      data: {
        name,
        sku,
        slug,
        categoryId: categoryId || null,
        price: numPrice,
        originalPrice: numOriginal,
        discount,
        stock: parseInt(stock || '10', 10),
        description: description || null,
        details: details || null,
        isFeatured: Boolean(isFeatured),
        isBestSeller: Boolean(isBestSeller),
        isNewArrival: Boolean(isNewArrival),
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        images: imageUrl
          ? {
              create: [
                {
                  url: imageUrl,
                  isPrimary: true,
                  sortOrder: 0,
                },
              ],
            }
          : undefined,
      },
    })

    return NextResponse.json({ success: true, product })
  } catch (error: any) {
    console.error('[Admin Add Product Error]', error)
    return NextResponse.json({ error: error.message || 'Failed to add product' }, { status: 500 })
  }
}
