import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'
import { ensureDatabaseTables } from '@/lib/init-db'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await ensureDatabaseTables()
    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: true, category: true, specs: true, variants: true },
    })
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    return NextResponse.json({ product })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await ensureDatabaseTables()
    const { id } = await params
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
      imageUrl,      // legacy single image
      images,        // new multi-image: [{ url, isPrimary, sortOrder }]
      variants,      // new variants: [{ name, value, price?, stock? }]
      isFeatured,
      isBestSeller,
      isNewArrival,
      isActive,
    } = body

    const numPrice = parseFloat(price)
    const numOriginal = originalPrice ? parseFloat(originalPrice) : null
    const discount = numOriginal && numOriginal > numPrice ? Math.round(((numOriginal - numPrice) / numOriginal) * 100) : 0

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(name ? { name, slug: slugify(name) + '-' + id.slice(-4) } : {}),
        ...(sku ? { sku } : {}),
        categoryId: categoryId || null,
        price: numPrice,
        originalPrice: numOriginal,
        discount,
        stock: parseInt(stock || '0', 10),
        description: description || null,
        details: details || null,
        isFeatured: Boolean(isFeatured),
        isBestSeller: Boolean(isBestSeller),
        isNewArrival: Boolean(isNewArrival),
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    })

    // Handle images: if multi-image array provided, replace all
    if (images && Array.isArray(images) && images.length > 0) {
      await prisma.productImage.deleteMany({ where: { productId: id } })
      await prisma.productImage.createMany({
        data: images.map((img: any, i: number) => ({
          productId: id,
          url: img.url,
          isPrimary: Boolean(img.isPrimary),
          sortOrder: img.sortOrder ?? i,
        })),
      })
    } else if (imageUrl) {
      // Legacy single image
      await prisma.productImage.deleteMany({ where: { productId: id } })
      await prisma.productImage.create({
        data: { productId: id, url: imageUrl, isPrimary: true, sortOrder: 0 },
      })
    }

    // Handle variants: if provided, replace all
    if (variants && Array.isArray(variants)) {
      // Delete old cart items referencing old variants first
      const oldVariantIds = (await prisma.productVariant.findMany({
        where: { productId: id },
        select: { id: true },
      })).map(v => v.id)

      if (oldVariantIds.length > 0) {
        await prisma.cartItem.deleteMany({
          where: { variantId: { in: oldVariantIds } },
        })
      }

      await prisma.productVariant.deleteMany({ where: { productId: id } })

      const validVariants = variants.filter((v: any) => v.value?.trim())
      if (validVariants.length > 0) {
        await prisma.productVariant.createMany({
          data: validVariants.map((v: any) => ({
            productId: id,
            name: v.name || 'Color',
            value: v.value,
            price: v.price ? parseFloat(v.price) : null,
            stock: v.stock ? parseInt(v.stock, 10) : 0,
          })),
        })
      }
    }

    return NextResponse.json({ success: true, product: updated })
  } catch (error: any) {
    console.error('[Admin Edit Product Error]', error)
    return NextResponse.json({ error: error.message || 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await ensureDatabaseTables()
    const { id } = await params

    // Delete all related records before deleting product
    // (must delete in correct order to avoid FK constraint errors)
    await prisma.productImage.deleteMany({ where: { productId: id } })
    await prisma.productSpec.deleteMany({ where: { productId: id } })

    // Delete cart items first, then variants
    await prisma.cartItem.deleteMany({ where: { productId: id } })
    await prisma.wishlistItem.deleteMany({ where: { productId: id } })

    // Nullify order items referencing this product (keep order history but remove product link)
    await prisma.orderItem.updateMany({
      where: { productId: id },
      data: { productId: id }, // keep as-is but we need to handle FK
    })

    // Delete variants (after cart items referencing variants are gone)
    await prisma.productVariant.deleteMany({ where: { productId: id } })

    // Delete reviews
    await prisma.review.deleteMany({ where: { productId: id } }).catch(() => {})

    // Soft delete instead of hard delete to preserve order history
    await prisma.product.update({
      where: { id },
      data: { isActive: false, name: `[Deleted] ${id}`, slug: `deleted-${id}-${Date.now()}` },
    })

    return NextResponse.json({ success: true, message: 'Product removed successfully' })
  } catch (error: any) {
    console.error('[Admin Delete Product Error]', error)
    return NextResponse.json({ error: error.message || 'Failed to delete product' }, { status: 500 })
  }
}
