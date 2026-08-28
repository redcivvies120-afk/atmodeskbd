import React from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ProductListClient } from './ProductListClient'
import { Plus } from 'lucide-react'
import { ensureDatabaseTables } from '@/lib/init-db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminProductsPage() {
  let products: any[] = []
  try {
    await ensureDatabaseTables()
    products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: { category: true, images: true },
    })
  } catch (err) {
    console.error('AdminProductsPage error:', err)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Products Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your store's inventory, pricing, and product status.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl transition shadow-xs"
        >
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      <ProductListClient initialProducts={products} />
    </div>
  )
}
