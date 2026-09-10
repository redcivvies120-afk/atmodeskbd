// src/components/product/RecentlyViewed.tsx
'use client'

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { Eye, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'
import { useRecentlyViewed } from '@/store/recently-viewed'
import { formatBDT } from '@/lib/utils'

export function RecentlyViewed() {
  const { products, clearAll } = useRecentlyViewed()
  const [mounted, setMounted] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Avoid hydration mismatch by waiting for client mount
  if (!mounted || products.length === 0) {
    return null
  }

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const scrollAmount = direction === 'left' ? -260 : 260
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }

  return (
    <section className="w-full py-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-sky-50 dark:bg-sky-950/50 flex items-center justify-center text-sky-600">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
              Recently Viewed
            </h3>
            <p className="text-xs text-slate-500">Products you browsed recently</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {products.length > 3 && (
            <div className="hidden sm:flex items-center gap-1">
              <button
                onClick={() => handleScroll('left')}
                className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-600 hover:border-sky-300 transition flex items-center justify-center shadow-2xs"
                title="Scroll left"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleScroll('right')}
                className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-600 hover:border-sky-300 transition flex items-center justify-center shadow-2xs"
                title="Scroll right"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          <button
            onClick={clearAll}
            className="text-xs text-slate-400 hover:text-rose-600 transition flex items-center gap-1 px-2.5 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Clear history"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Row */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-4 overflow-x-auto no-scrollbar pb-2 pt-1 scroll-smooth"
      >
        {products.map((item) => {
          const fallbackImage = '/placeholder-product.jpg'
          const imageSrc = item.image || fallbackImage

          return (
            <Link
              key={item.id}
              href={`/product/${item.slug}`}
              className="group flex-shrink-0 w-36 sm:w-44 bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl overflow-hidden hover:shadow-lg hover:border-sky-300 dark:hover:border-sky-500 transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-square w-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                <img
                  src={imageSrc}
                  alt={item.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const el = e.target as HTMLImageElement
                    el.onerror = null
                    el.src = fallbackImage
                  }}
                />
              </div>

              <div className="p-3 flex flex-col justify-between flex-1 gap-1.5">
                <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-2 group-hover:text-sky-600 transition leading-snug">
                  {item.name}
                </h4>

                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {formatBDT(item.price)}
                  </span>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <span className="text-[11px] text-slate-400 line-through">
                      {formatBDT(item.originalPrice)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
