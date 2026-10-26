import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'
import { ensureDatabaseTables } from '@/lib/init-db'
import { isServerAdminAuthenticated } from '@/lib/admin-auth'
import { sanitizeString, sanitizeMultiline } from '@/lib/security'

export async function POST(req: Request) {
  try {
    // 1. Admin Authentication Check
    const isAuth = await isServerAdminAuthenticated()
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized: Admin privileges required.' }, { status: 401 })
    }

    await ensureDatabaseTables()
    const body = await req.json()
    const rawName = sanitizeString(body?.name, 200)
    const rawSku = sanitizeString(body?.sku, 50)
    const rawPrice = body?.price
    const rawOriginalPrice = body?.originalPrice
    const rawStock = body?.stock
    const rawDescription = sanitizeMultiline(body?.description, 5000)
    const rawDetails = sanitizeMultiline(body?.details, 5000)
    const categoryId = body?.categoryId ? sanitizeString(body.categoryId, 50) : null
    const imageUrl = body?.imageUrl ? sanitizeString(body.imageUrl, 1000) : null
    const images = body?.images
    const variants = body?.variants
    const isFeatured = Boolean(body?.isFeatured)
    const isBestSeller = Boolean(body?.isBestSeller)
    const isNewArrival = Boolean(body?.isNewArrival)
    const isActive = body?.isActive !== undefined ? Boolean(body.isActive) : true

    if (!rawName || !rawSku || rawPrice === undefined || rawPrice === null) {
      return NextResponse.json({ error: 'Name, SKU, and Price are required.' }, { status: 400 })
    }

    const numPrice = parseFloat(String(rawPrice))
    if (isNaN(numPrice) || numPrice < 0) {
      return NextResponse.json({ error: 'Invalid price amount.' }, { status: 400 })
    }

    const numOriginal = rawOriginalPrice ? parseFloat(String(rawOriginalPrice)) : null
    const discount = numOriginal && numOriginal > numPrice ? Math.round(((numOriginal - numPrice) / numOriginal) * 100) : 0
    const slug = slugify(rawName) + '-' + Date.now().toString(36)
    const stock = parseInt(String(rawStock || '10'), 10)

    // Build images create array
    let imagesCreate: any[] = []
    if (images && Array.isArray(images) && images.length > 0) {
      imagesCreate = images.map((img: any, i: number) => ({
        url: sanitizeString(img?.url, 1000),
        isPrimary: Boolean(img?.isPrimary),
        sortOrder: typeof img?.sortOrder === 'number' ? img.sortOrder : i,
      })).filter((img) => img.url.length > 0)
    } else if (imageUrl) {
      imagesCreate = [{ url: imageUrl, isPrimary: true, sortOrder: 0 }]
    }

    // Build variants create array
    let variantsCreate: any[] = []
    if (variants && Array.isArray(variants) && variants.length > 0) {
      variantsCreate = variants
        .filter((v: any) => v && typeof v.value === 'string' && v.value.trim().length > 0)
        .map((v: any) => ({
          name: sanitizeString(v.name || 'Color', 50),
          value: sanitizeString(v.value, 100),
          price: v.price ? parseFloat(String(v.price)) : null,
          stock: v.stock ? parseInt(String(v.stock), 10) : 0,
        }))
    }

    const product = await prisma.product.create({
      data: {
        name: rawName,
        sku: rawSku,
        slug,
        categoryId: categoryId || null,
        price: numPrice,
        originalPrice: numOriginal,
        discount,
        stock: isNaN(stock) ? 0 : Math.max(0, stock),
        description: rawDescription || null,
        details: rawDetails || null,
        isFeatured,
        isBestSeller,
        isNewArrival,
        isActive,
        images: imagesCreate.length > 0 ? { create: imagesCreate } : undefined,
        variants: variantsCreate.length > 0 ? { create: variantsCreate } : undefined,
      },
      include: { images: true, variants: true },
    })

    return NextResponse.json({ success: true, product })
  } catch (error: any) {
    console.error('[Admin Add Product Error]', error)
    return NextResponse.json({ error: 'Failed to add product. Please check input values.' }, { status: 500 })
  }
}
