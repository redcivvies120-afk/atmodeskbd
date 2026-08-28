import React from 'react'
import { prisma } from '@/lib/prisma'
import { CategoryManagerClient } from './CategoryManagerClient'
import { ensureDatabaseTables } from '@/lib/init-db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminCategoriesPage() {
  let categories: any[] = []
  try {
    await ensureDatabaseTables()
    categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { products: true } } },
    })
  } catch (err) {
    console.error('AdminCategoriesPage error:', err)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Categories Management
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Organize and structure your store&apos;s collections.
        </p>
      </div>

      <CategoryManagerClient initialCategories={categories} />
    </div>
  )
}
