import React from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { AdminProductForm } from './AdminProductForm'
import { ArrowLeft } from 'lucide-react'

export const revalidate = 0

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/products"
          className="p-2 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-xl transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Add New Product</h1>
          <p className="text-xs text-slate-500">Enter product specifications, BDT pricing, and stock.</p>
        </div>
      </div>

      <AdminProductForm categories={categories} />
    </div>
  )
}
