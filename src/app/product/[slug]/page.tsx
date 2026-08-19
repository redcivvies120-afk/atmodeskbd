import React from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { ProductDetailClient } from '@/components/product/ProductDetailClient'
import { ProductCard } from '@/components/product/ProductCard'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { images: true },
  })

  if (!product) {
    return { title: 'Product Not Found — ATMODESK' }
  }

  const primaryImage = product.images[0]?.url

  return {
    title: `${product.name} — ATMODESK Bangladesh`,
    description: product.description || `Buy ${product.name} in Bangladesh with Cash on Delivery at ATMODESK.`,
    openGraph: {
      title: product.name,
      description: product.description || '',
      images: primaryImage ? [primaryImage] : [],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  let product: any = null
  let relatedProducts: any[] = []

  try {
    product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: true,
        category: true,
        brand: true,
        variants: true,
        specs: true,
      },
    })

    if (product && product.isActive) {
      relatedProducts = await prisma.product.findMany({
        where: {
          categoryId: product.categoryId,
          id: { not: product.id },
          isActive: true,
        },
        include: { images: true, category: true },
        take: 4,
      })
    }
  } catch (err) {
    console.error('Product page lookup error:', err)
  }

  if (!product || !product.isActive) {
    notFound()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Product Detail Component */}
      <ProductDetailClient product={product} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-slate-200 pt-12 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold text-slate-900">
              You May Also Like
            </h2>
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
              More in {product.category?.name}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
