'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/shared/Providers'
import { Plus, Layers } from 'lucide-react'

export function CategoryManagerClient({ initialCategories }: { initialCategories: any[] }) {
  const router = useRouter()
  const { toast } = useToast()
  const [categories, setCategories] = useState(initialCategories)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), description: description.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to add category')

      toast(`Category "${name}" added! 🏷️`)
      setName('')
      setDescription('')
      router.refresh()
    } catch (err: any) {
      toast(err.message || 'Error', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
      {/* Create form */}
      <form onSubmit={handleAdd} className="md:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Plus className="w-4 h-4 text-sky-600" /> Add New Category
        </h2>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Category Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. RGB Matrix Clocks"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-sky-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Short description..."
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-sky-500"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl transition shadow-xs disabled:opacity-50"
        >
          {isSubmitting ? 'Adding...' : '+ Save Category'}
        </button>
      </form>

      {/* List */}
      <div className="md:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Layers className="w-4 h-4 text-sky-600" /> Active Categories ({initialCategories.length})
        </h2>

        <div className="divide-y divide-slate-100">
          {initialCategories.map((c) => (
            <div key={c.id} className="py-3 flex items-center justify-between">
              <div>
                <strong className="text-sm text-slate-900 block">{c.name}</strong>
                <span className="text-xs text-slate-400 font-mono">slug: {c.slug}</span>
              </div>
              <span className="bg-sky-50 text-sky-700 font-bold text-xs px-2.5 py-1 rounded-full">
                {c._count?.products || 0} products
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
