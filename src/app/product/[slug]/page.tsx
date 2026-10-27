import React from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { ProductDetailClient } from '@/components/product/ProductDetailClient'
import { safeJsonLd } from '@/lib/security'
import { ProductCard } from '@/components/product/ProductCard'

// Edge ISR caching: revalidates every 60s
export const revalidate = 60

export async function generateStaticParams() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true },
    })
    return products.map((p) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

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

  const primaryImg = product.images.find((i) => i.isPrimary)?.url || product.images[0]?.url || '/logo.jpg'
  const fullImageUrl = primaryImg.startsWith('http')
    ? primaryImg
    : `https://atmodeskbd-eo1e.vercel.app${primaryImg}`

  return {
    title: `${product.name} — ATMODESK Bangladesh`,
    description: product.description || `Buy ${product.name} in Bangladesh with Cash on Delivery at ATMODESK.`,
    alternates: {
      canonical: `https://atmodeskbd-eo1e.vercel.app/product/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} — ৳${product.price} | ATMODESK Bangladesh`,
      description: product.description || `Order ${product.name} at best price in Bangladesh. Fast Dhaka delivery.`,
      url: `https://atmodeskbd-eo1e.vercel.app/product/${product.slug}`,
      siteName: 'ATMODESK Bangladesh',
      type: 'website',
      images: [
        {
          url: fullImageUrl,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} — ৳${product.price} | ATMODESK`,
      description: product.description || `Order ${product.name} at best price in Bangladesh.`,
      images: [fullImageUrl],
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
        reviews: {
          where: { isApproved: true },
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: { id: true, name: true, image: true },
            },
          },
        },
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

      if (relatedProducts.length === 0) {
        relatedProducts = await prisma.product.findMany({
          where: {
            id: { not: product.id },
            isActive: true,
          },
          include: { images: true, category: true },
          take: 4,
        })
      }
    }
  } catch (err) {
    console.error('Product page lookup error:', err)
  }

  if (!product || !product.isActive) {
    notFound()
  }

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || product.name,
    image: product.images?.map((img: any) => img.url) || [],
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      url: `https://atmodeskbd-eo1e.vercel.app/product/${product.slug}`,
      priceCurrency: 'BDT',
      price: product.price,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'ATMODESK.bd',
      },
    },
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(productJsonLd) }}
      />

      {/* Product Detail Component */}
      <ProductDetailClient product={product} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-10 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900">
              You Might Also Like
            </h2>
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
              Explore More Gear
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
