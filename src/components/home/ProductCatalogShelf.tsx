// src/components/home/ProductCatalogShelf.tsx
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { ProductCard, type ProductCardProps } from '@/components/product/ProductCard'
import { LiquidReveal, TACTILE_SPRING } from '@/components/shared/LiquidMotion'
import { Layers, ArrowRight, Sparkles, Star, TrendingUp } from 'lucide-react'

interface ProductCatalogShelfProps {
  products: any[]
  categories: { id: string; name: string; slug: string }[]
}

export function ProductCatalogShelf({ products, categories }: ProductCatalogShelfProps) {
  const [activeTab, setActiveTab] = useState('ALL')

  const tabs = [
    { id: 'ALL', label: 'All Products' },
    { id: 'NEW_ARRIVALS', label: '🆕 New Arrivals' },
    { id: 'BEST_SELLERS', label: '🔥 Best Sellers' },
    ...categories.map((c) => ({ id: c.slug, label: c.name })),
  ]

  const filteredProducts =
    activeTab === 'ALL'
      ? products
      : activeTab === 'NEW_ARRIVALS'
      ? [...products].sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
      : activeTab === 'BEST_SELLERS'
      ? [...products].sort((a, b) => (b.soldCount ?? 0) - (a.soldCount ?? 0))
      : products.filter(
          (p) =>
            p.category?.slug === activeTab ||
            p.name.toLowerCase().includes(activeTab.replace('-', ' '))
        )

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" aria-labelledby="featured-heading">
      {/* Header and Filter Tabs (Apple Gadgets Architecture) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-black/[0.06]">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A9EE6] uppercase tracking-wider mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Curated Inventory</span>
          </div>
          <h2 id="featured-heading" className="text-2xl sm:text-4xl font-black tracking-tight text-[#083466]">
            Featured Desk Tech &amp; Smart Clocks
          </h2>
          <p className="text-xs sm:text-sm text-[#5B6B80] mt-1">
            Tested &amp; calibrated in Dhaka. In-stock units ready for instant 24-48h dispatch.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <motion.button
                key={tab.id}
                type="button"
                whileTap={{ scale: 0.95 }}
                transition={TACTILE_SPRING}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-[#0A9EE6] text-white shadow-sm'
                    : 'bg-[#F3F7FB] text-[#5B6B80] hover:text-[#083466] hover:bg-black/5'
                }`}
              >
                {tab.label}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Grid of Product Cards */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredProducts.map((p, i) => (
            <LiquidReveal key={p.id} delay={Math.min(i * 0.04, 0.2)}>
              <ProductCard {...p} priority={i < 3} />
            </LiquidReveal>
          ))}
        </div>
      ) : (
        <div className="liquid-glass-card rounded-[28px] p-12 text-center space-y-3 bg-[#fafafa] border border-black/[0.06]">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-[#0A9EE6]/10 text-[#0A9EE6] flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#083466]">More Items Restocking Soon</h3>
          <p className="text-xs text-[#5B6B80] max-w-sm mx-auto">
            Our next shipment of ambient desk devices is currently being calibrated in Dhaka.
          </p>
          <button
            type="button"
            onClick={() => setActiveTab('ALL')}
            className="text-xs font-bold text-[#0A9EE6] hover:underline pt-2 block mx-auto"
          >
            ← View All In-Stock Products
          </button>
        </div>
      )}
    </section>
  )
}
