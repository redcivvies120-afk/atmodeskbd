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
      imageUrl,      // legacy single image support
      images,        // new multi-image: [{ url, isPrimary, sortOrder }]
      variants,      // new variants: [{ name, value, price?, stock? }]
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

    // Build images create array
    let imagesCreate: any[] = []
    if (images && Array.isArray(images) && images.length > 0) {
      // New multi-image format
      imagesCreate = images.map((img: any, i: number) => ({
        url: img.url,
        isPrimary: Boolean(img.isPrimary),
        sortOrder: img.sortOrder ?? i,
      }))
    } else if (imageUrl) {
      // Legacy single image
      imagesCreate = [{ url: imageUrl, isPrimary: true, sortOrder: 0 }]
    }

    // Build variants create array
    let variantsCreate: any[] = []
    if (variants && Array.isArray(variants) && variants.length > 0) {
      variantsCreate = variants
        .filter((v: any) => v.value?.trim())
        .map((v: any) => ({
          name: v.name || 'Color',
          value: v.value,
          price: v.price ? parseFloat(v.price) : null,
          stock: v.stock ? parseInt(v.stock, 10) : 0,
        }))
    }

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
        images: imagesCreate.length > 0
          ? { create: imagesCreate }
          : undefined,
        variants: variantsCreate.length > 0
          ? { create: variantsCreate }
          : undefined,
      },
      include: { images: true, variants: true },
    })

    return NextResponse.json({ success: true, product })
  } catch (error: any) {
    console.error('[Admin Add Product Error]', error)
    return NextResponse.json({ error: error.message || 'Failed to add product' }, { status: 500 })
  }
}
