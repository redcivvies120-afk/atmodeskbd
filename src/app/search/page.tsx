import React from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/product/ProductCard'
import { Search, Sparkles } from 'lucide-react'
import { ImageSearchButton } from '@/components/search/ImageSearchButton'

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export const dynamic = 'force-dynamic'

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams
  const query = q?.trim() || ''

  const popularSearches = [
    'Smart Clock',
    'Weather Station',
    'LED Matrix',
    'Flip Clock',
    'Nixie Tube',
    'Ambient Light',
    'Desk Organiser',
    'Sand Timer',
  ]

  let products: any[] = []
  let partialProducts: any[] = []

  if (query) {
    // Smart search: split query into individual words
    const words = query
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 1)

    if (words.length > 0) {
      // Build conditions: each word must appear in at least one field
      const wordConditions = words.map((word) => ({
        OR: [
          { name: { contains: word, mode: 'insensitive' as const } },
          { description: { contains: word, mode: 'insensitive' as const } },
          { sku: { contains: word, mode: 'insensitive' as const } },
          { category: { name: { contains: word, mode: 'insensitive' as const } } },
        ],
      }))

      // First: exact match (all words present)
      try {
        products = await prisma.product.findMany({
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
      } catch (err) {
        console.error('Smart search exact match error:', err)
      }

      // Second: partial matches (any word) if not enough results
      if (products.length < 6) {
        try {
          partialProducts = await prisma.product.findMany({
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
        } catch (err) {
          console.error('Smart search partial match error:', err)
        }
      }
    }
  }

  const allResults = [...products, ...partialProducts]

  // Fallback recommended products if query yields no results
  let recommended: any[] = []
  if (query && allResults.length === 0) {
    try {
      recommended = await prisma.product.findMany({
        where: { isActive: true, isFeatured: true },
        include: { images: true, category: true },
        take: 4,
      })
    } catch (err) {
      console.error('Recommended products error:', err)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Search Input Section */}
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Search Products
        </h1>

        {/* Text Search */}
        <form action="/search" method="GET" className="relative">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search smart clocks, weather stations, desk gadgets..."
            className="w-full pl-12 pr-28 py-3.5 bg-white border border-slate-300 focus:border-sky-500 rounded-2xl text-sm text-slate-900 outline-none shadow-xs"
            autoFocus
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition"
          >
            Search
          </button>
        </form>

        {/* Image Search + Smart Search Info */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <ImageSearchButton />
          <span className="text-[11px] text-slate-400">
            💡 Smart search: type &quot;smart clock&quot; to find all smart clocks
          </span>
        </div>

        {/* Popular Tags */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
            Popular:
          </span>
          {popularSearches.map((term) => (
            <Link
              key={term}
              href={`/search?q=${encodeURIComponent(term)}`}
              className="px-3 py-1 bg-white border border-slate-200 hover:border-sky-500 text-xs font-medium text-slate-600 hover:text-sky-600 rounded-full transition shadow-2xs"
            >
              {term}
            </Link>
          ))}
        </div>
      </div>

      {/* Results Header */}
      {query && (
        <div className="border-b border-slate-200 pb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Results for <span className="text-sky-600 font-extrabold">&quot;{query}&quot;</span>
          </h2>
          <p className="text-xs text-slate-500">
            {allResults.length} products found
            {products.length > 0 && partialProducts.length > 0 && (
              <span className="text-slate-400">
                {' '}· {products.length} exact matches, {partialProducts.length} related
              </span>
            )}
          </p>
        </div>
      )}

      {/* Results */}
      {allResults.length > 0 ? (
        <div className="space-y-8">
          {/* Exact matches */}
          {products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>
          )}

          {/* Partial / related matches */}
          {partialProducts.length > 0 && (
            <div className="space-y-4">
              {products.length > 0 && (
                <h3 className="text-base font-bold text-slate-700 flex items-center gap-2 pt-4 border-t border-slate-200">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Related Products
                </h3>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {partialProducts.map((p) => (
                  <ProductCard key={p.id} {...p} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : query ? (
        <div className="space-y-10">
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3 max-w-lg mx-auto">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-2xl">
              🔎
            </div>
            <h3 className="text-lg font-bold text-slate-900">No products matched &quot;{query}&quot;</h3>
            <p className="text-xs text-slate-500">
              Try searching with more general keywords like &quot;clock&quot;, &quot;weather&quot;, or &quot;light&quot;.
            </p>
          </div>

          {/* Recommended Alternatives */}
          {recommended.length > 0 && (
            <div className="space-y-6 pt-4 border-t border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" /> You May Be Interested In
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommended.map((p) => (
                  <ProductCard key={p.id} {...p} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}
