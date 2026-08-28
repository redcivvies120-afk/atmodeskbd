import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { EditProductForm } from './EditProductForm'
import { ArrowLeft } from 'lucide-react'
import { ensureDatabaseTables } from '@/lib/init-db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let product: any = null
  let categories: any[] = []

  try {
    await ensureDatabaseTables()
    const [p, cats] = await Promise.all([
      prisma.product.findUnique({
        where: { id },
        include: { images: true, category: true },
      }),
      prisma.category.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }),
    ])
    product = p
    categories = cats
  } catch (err) {
    console.error('EditProductPage error:', err)
  }

  if (!product) notFound()

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
          <h1 className="text-2xl font-extrabold text-slate-900">Edit Product</h1>
          <p className="text-xs text-slate-500">Update details for {product.name}</p>
        </div>
      </div>

      <EditProductForm product={product} categories={categories} />
    </div>
  )
}
