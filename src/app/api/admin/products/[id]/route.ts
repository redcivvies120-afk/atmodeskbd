import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'
import { ensureDatabaseTables } from '@/lib/init-db'
import { isServerAdminAuthenticated } from '@/lib/admin-auth'
import { sanitizeString, sanitizeMultiline } from '@/lib/security'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const isAuth = await isServerAdminAuthenticated()
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized: Admin privileges required.' }, { status: 401 })
    }

    await ensureDatabaseTables()
    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id: sanitizeString(id, 100) },
      include: { images: true, category: true, specs: true, variants: true },
    })
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    return NextResponse.json({ product })
  } catch (error: any) {
    console.error('[Admin Get Product Error]', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const isAuth = await isServerAdminAuthenticated()
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized: Admin privileges required.' }, { status: 401 })
    }

    await ensureDatabaseTables()
    const { id: rawId } = await params
    const id = sanitizeString(rawId, 100)
    const body = await req.json()
    const rawName = body?.name ? sanitizeString(body.name, 200) : undefined
    const rawSku = body?.sku ? sanitizeString(body.sku, 50) : undefined
    const categoryId = body?.categoryId ? sanitizeString(body.categoryId, 50) : null
    const price = body?.price !== undefined ? parseFloat(String(body.price)) : undefined
    const originalPrice = body?.originalPrice ? parseFloat(String(body.originalPrice)) : null
    const stock = body?.stock !== undefined ? parseInt(String(body.stock), 10) : undefined
    const description = body?.description !== undefined ? sanitizeMultiline(body.description, 5000) : undefined
    const details = body?.details !== undefined ? sanitizeMultiline(body.details, 5000) : undefined
    const imageUrl = body?.imageUrl ? sanitizeString(body.imageUrl, 1000) : undefined
    const images = body?.images
    const variants = body?.variants
    const isFeatured = body?.isFeatured !== undefined ? Boolean(body.isFeatured) : undefined
    const isBestSeller = body?.isBestSeller !== undefined ? Boolean(body.isBestSeller) : undefined
    const isNewArrival = body?.isNewArrival !== undefined ? Boolean(body.isNewArrival) : undefined
    const isActive = body?.isActive !== undefined ? Boolean(body.isActive) : undefined

    const discount = price !== undefined && originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(rawName ? { name: rawName, slug: slugify(rawName) + '-' + id.slice(-4) } : {}),
        ...(rawSku ? { sku: rawSku } : {}),
        categoryId: categoryId || null,
        ...(price !== undefined && !isNaN(price) ? { price } : {}),
        originalPrice: originalPrice,
        discount,
        ...(stock !== undefined && !isNaN(stock) ? { stock: Math.max(0, stock) } : {}),
        ...(description !== undefined ? { description: description || null } : {}),
        ...(details !== undefined ? { details: details || null } : {}),
        ...(isFeatured !== undefined ? { isFeatured } : {}),
        ...(isBestSeller !== undefined ? { isBestSeller } : {}),
        ...(isNewArrival !== undefined ? { isNewArrival } : {}),
        ...(isActive !== undefined ? { isActive } : {}),
      },
    })

    // Handle images: if multi-image array provided, replace all
    if (images && Array.isArray(images) && images.length > 0) {
      await prisma.productImage.deleteMany({ where: { productId: id } })
      const sanitizedImages = images
        .map((img: any, i: number) => ({
          productId: id,
          url: sanitizeString(img?.url, 1000),
          isPrimary: Boolean(img?.isPrimary),
          sortOrder: typeof img?.sortOrder === 'number' ? img.sortOrder : i,
        }))
        .filter((img) => img.url.length > 0)

      if (sanitizedImages.length > 0) {
        await prisma.productImage.createMany({ data: sanitizedImages })
      }
    } else if (imageUrl) {
      await prisma.productImage.deleteMany({ where: { productId: id } })
      await prisma.productImage.create({
        data: { productId: id, url: imageUrl, isPrimary: true, sortOrder: 0 },
      })
    }

    // Handle variants: if provided, replace all
    if (variants && Array.isArray(variants)) {
      const oldVariantIds = (
        await prisma.productVariant.findMany({
          where: { productId: id },
          select: { id: true },
        })
      ).map((v) => v.id)

      if (oldVariantIds.length > 0) {
        await prisma.cartItem.deleteMany({
          where: { variantId: { in: oldVariantIds } },
        })
      }

      await prisma.productVariant.deleteMany({ where: { productId: id } })

      const sanitizedVariants = variants
        .filter((v: any) => v && typeof v.value === 'string' && v.value.trim().length > 0)
        .map((v: any) => ({
          productId: id,
          name: sanitizeString(v.name || 'Color', 50),
          value: sanitizeString(v.value, 100),
          price: v.price ? parseFloat(String(v.price)) : null,
          stock: v.stock ? parseInt(String(v.stock), 10) : 0,
        }))

      if (sanitizedVariants.length > 0) {
        await prisma.productVariant.createMany({ data: sanitizedVariants })
      }
    }

    return NextResponse.json({ success: true, product: updated })
  } catch (error: any) {
    console.error('[Admin Update Product Error]', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const isAuth = await isServerAdminAuthenticated()
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized: Admin privileges required.' }, { status: 401 })
    }

    await ensureDatabaseTables()
    const { id: rawId } = await params
    const id = sanitizeString(rawId, 100)

    // Delete related child rows in safe order
    await prisma.cartItem.deleteMany({ where: { productId: id } })
    await prisma.wishlistItem.deleteMany({ where: { productId: id } })
    await prisma.productSpec.deleteMany({ where: { productId: id } })
    await prisma.productImage.deleteMany({ where: { productId: id } })
    await prisma.productVariant.deleteMany({ where: { productId: id } })
    await prisma.review.deleteMany({ where: { productId: id } })

    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ success: true, message: 'Product deleted' })
  } catch (error: any) {
    console.error('[Admin Delete Product Error]', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
