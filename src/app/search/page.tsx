import React from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/product/ProductCard'
import { Search, Sparkles } from 'lucide-react'

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

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
  if (query) {
    products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
          { sku: { contains: query } },
          { category: { name: { contains: query } } },
        ],
      },
      include: { images: true, category: true },
      take: 20,
    })
  }

  // Fallback recommended products if query yields no results
  let recommended: any[] = []
  if (products.length === 0) {
    recommended = await prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: { images: true, category: true },
      take: 4,
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Search Input Bar */}
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Search Products
        </h1>
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
            Results for <span className="text-sky-600 font-extrabold">"{query}"</span>
          </h2>
          <p className="text-xs text-slate-500">{products.length} products found</p>
        </div>
      )}

      {/* Results or Recommendations */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
      ) : query ? (
        <div className="space-y-10">
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3 max-w-lg mx-auto">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-2xl">
              🔎
            </div>
            <h3 className="text-lg font-bold text-slate-900">No products matched "{query}"</h3>
            <p className="text-xs text-slate-500">
              Try searching with more general keywords like "clock", "weather", or "light".
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
