import React from 'react'
import { prisma } from '@/lib/prisma'
import { CategoryManagerClient } from './CategoryManagerClient'

export const revalidate = 0

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { products: true } } },
  })

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Categories Management
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Organize and structure your store's collections.
        </p>
      </div>

      <CategoryManagerClient initialCategories={categories} />
    </div>
  )
}
