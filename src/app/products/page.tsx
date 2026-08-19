import React from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/product/ProductCard'
import { Filter, SlidersHorizontal, ArrowUpDown } from 'lucide-react'

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string
    sort?: string
    minPrice?: string
    maxPrice?: string
    rating?: string
    inStock?: string
    page?: string
  }>
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  const categorySlug = params.category
  const sort = params.sort || 'newest'
  const minPrice = params.minPrice ? parseFloat(params.minPrice) : undefined
  const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : undefined
  const minRating = params.rating ? parseFloat(params.rating) : undefined
  const inStockOnly = params.inStock === 'true'
  const currentPage = parseInt(params.page || '1', 10)
  const pageSize = 12

  // Build where filter
  const where: any = {
    isActive: true,
  }

  if (categorySlug) {
    where.category = { slug: categorySlug }
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {}
    if (minPrice !== undefined) where.price.gte = minPrice
    if (maxPrice !== undefined) where.price.lte = maxPrice
  }

  if (minRating !== undefined) {
    where.rating = { gte: minRating }
  }

  if (inStockOnly) {
    where.stock = { gt: 0 }
  }

  // Build orderBy
  let orderBy: any = { createdAt: 'desc' }
  if (sort === 'price-low') orderBy = { price: 'asc' }
  if (sort === 'price-high') orderBy = { price: 'desc' }
  if (sort === 'rating') orderBy = { rating: 'desc' }
  if (sort === 'popular') orderBy = { soldCount: 'desc' }

  // Fetch products and categories
  const [products, totalCount, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      include: { images: true, category: true },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({ where: { isActive: true } }),
  ])

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {categorySlug
              ? categories.find((c) => c.slug === categorySlug)?.name || 'Products'
              : 'All Desk Tech & Gadgets'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Showing {products.length} of {totalCount} items
          </p>
        </div>

        {/* Sorting Dropdown Form (clean GET links) */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
            Sort by:
          </span>
          <div className="flex flex-wrap gap-1.5 text-xs">
            {[
              { label: 'Newest', val: 'newest' },
              { label: 'Price: Low to High', val: 'price-low' },
              { label: 'Price: High to Low', val: 'price-high' },
              { label: 'Top Rated', val: 'rating' },
              { label: 'Popular', val: 'popular' },
            ].map((s) => (
              <Link
                key={s.val}
                href={`/products?${new URLSearchParams({
                  ...(categorySlug ? { category: categorySlug } : {}),
                  sort: s.val,
                }).toString()}`}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  sort === s.val
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className="space-y-6 lg:border-r lg:border-slate-200 lg:pr-6">
          {/* Category Filter */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-sky-600" /> Categories
            </h3>
            <div className="space-y-1.5">
              <Link
                href="/products"
                className={`block px-3 py-2 rounded-xl text-sm font-medium transition ${
                  !categorySlug ? 'bg-sky-50 text-sky-700 font-bold' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                All Categories
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/products?category=${c.slug}`}
                  className={`block px-3 py-2 rounded-xl text-sm font-medium transition ${
                    categorySlug === c.slug
                      ? 'bg-sky-50 text-sky-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Price Ranges */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Price Range (BDT)
            </h3>
            <div className="space-y-1.5 text-sm">
              <Link
                href={`/products?${new URLSearchParams({
                  ...(categorySlug ? { category: categorySlug } : {}),
                  maxPrice: '2000',
                }).toString()}`}
                className="block px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
              >
                Under ৳2,000
              </Link>
              <Link
                href={`/products?${new URLSearchParams({
                  ...(categorySlug ? { category: categorySlug } : {}),
                  minPrice: '2000',
                  maxPrice: '3500',
                }).toString()}`}
                className="block px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
              >
                ৳2,000 – ৳3,500
              </Link>
              <Link
                href={`/products?${new URLSearchParams({
                  ...(categorySlug ? { category: categorySlug } : {}),
                  minPrice: '3500',
                }).toString()}`}
                className="block px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
              >
                Above ৳3,500
              </Link>
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Availability
            </h3>
            <Link
              href={`/products?${new URLSearchParams({
                ...(categorySlug ? { category: categorySlug } : {}),
                inStock: 'true',
              }).toString()}`}
              className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-sky-600 font-medium"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              In Stock Only
            </Link>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="lg:col-span-3 space-y-8">
          {products.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-2xl">
                🔍
              </div>
              <h3 className="text-lg font-bold text-slate-900">No products match your filters</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                Try resetting your filters or browsing another category to find what you need.
              </p>
              <Link
                href="/products"
                className="inline-block px-5 py-2.5 bg-sky-600 text-white text-sm font-semibold rounded-xl hover:bg-sky-700 transition"
              >
                Reset All Filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6 border-t border-slate-200">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Link
                  key={page}
                  href={`/products?${new URLSearchParams({
                    ...(categorySlug ? { category: categorySlug } : {}),
                    ...(sort ? { sort } : {}),
                    page: page.toString(),
                  }).toString()}`}
                  className={`w-10 h-10 rounded-xl font-bold text-sm flex items-center justify-center transition ${
                    currentPage === page
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {page}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
