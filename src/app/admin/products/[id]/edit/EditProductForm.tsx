'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/shared/Providers'

export function EditProductForm({ product, categories }: { product: any; categories: any[] }) {
  const router = useRouter()
  const { toast } = useToast()

  const [name, setName] = useState(product.name || '')
  const [sku, setSku] = useState(product.sku || '')
  const [categoryId, setCategoryId] = useState(product.categoryId || '')
  const [price, setPrice] = useState(product.price?.toString() || '')
  const [originalPrice, setOriginalPrice] = useState(product.originalPrice?.toString() || '')
  const [stock, setStock] = useState(product.stock?.toString() || '0')
  const [imageUrl, setImageUrl] = useState(product.images[0]?.url || '')
  const [description, setDescription] = useState(product.description || '')
  const [details, setDetails] = useState(product.details || '')
  const [isFeatured, setIsFeatured] = useState(Boolean(product.isFeatured))
  const [isBestSeller, setIsBestSeller] = useState(Boolean(product.isBestSeller))
  const [isNewArrival, setIsNewArrival] = useState(Boolean(product.isNewArrival))
  const [isActive, setIsActive] = useState(Boolean(product.isActive))
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !sku || !price) {
      toast('Please fill in Name, SKU, and Price.', 'error')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          sku,
          categoryId: categoryId || undefined,
          price,
          originalPrice: originalPrice || undefined,
          stock,
          imageUrl: imageUrl.trim() || undefined,
          description,
          details,
          isFeatured,
          isBestSeller,
          isNewArrival,
          isActive,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update product')

      toast('Product updated successfully! ✏️')
      router.push('/admin/products')
      router.refresh()
    } catch (err: any) {
      toast(err.message || 'Error updating product', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

    const [uploading, setUploading] = useState(false)
    const [imagePreview, setImagePreview] = useState(product.images[0]?.url || '')

    const uploadImage = async (file: File) => {
      setUploading(true)
      try {
        const localUrl = URL.createObjectURL(file)
        setImagePreview(localUrl)

        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        })

        if (!res.ok) throw new Error('Upload failed')
        const data = await res.json()
        setImageUrl(data.url)
        setImagePreview(data.url)
        toast('Image uploaded! 🖼️')
      } catch (err: any) {
        toast(err.message || 'Upload failed', 'error')
      } finally {
        setUploading(false)
      }
    }

    return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Product Title *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-sky-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            SKU / Product Code *
          </label>
          <input
            type="text"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono outline-none focus:border-sky-500 uppercase"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Category
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-sky-500"
          >
            <option value="">Select Category...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Selling Price (BDT ৳) *
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-sky-500 font-bold"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Original Price (BDT ৳)
          </label>
          <input
            type="number"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            placeholder="For strikethrough"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-sky-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Stock Quantity
          </label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-sky-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Product Image
          </label>
          <div className="space-y-2">
            {/* Mobile-friendly buttons */}
            <div className="flex gap-2">
              <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-sky-50 hover:bg-sky-100 border-2 border-sky-300 hover:border-sky-500 rounded-xl text-sm font-bold text-sky-700 cursor-pointer transition">
                🖼️ Select from Gallery
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) uploadImage(file)
                  }}
                  disabled={uploading}
                />
              </label>
              <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 hover:border-amber-500 rounded-xl text-sm font-bold text-amber-700 cursor-pointer transition">
                📷 Take Photo
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) uploadImage(file)
                  }}
                  disabled={uploading}
                />
              </label>
            </div>
            {uploading && (
              <div className="flex items-center justify-center gap-2 py-2 text-xs text-sky-600 font-semibold">
                <span className="animate-spin">⏳</span> Uploading...
              </div>
            )}
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value)
                setImagePreview(e.target.value)
              }}
              placeholder="Or paste image URL"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-sky-500"
            />
            {imagePreview && (
              <div className="w-20 h-20 rounded-xl border border-slate-200 overflow-hidden">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
          Short Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-sky-500"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
          Bullet Features &amp; Specs Details
        </label>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={4}
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono outline-none focus:border-sky-500"
        />
      </div>

      {/* Flags */}
      <div className="flex flex-wrap gap-6 pt-2 border-t border-slate-100 text-xs font-bold text-slate-700">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
          />
          <span>Active (Visible on Store)</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
          />
          <span>Featured on Homepage</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isBestSeller}
            onChange={(e) => setIsBestSeller(e.target.checked)}
            className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
          />
          <span>Best Seller Badge</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isNewArrival}
            onChange={(e) => setIsNewArrival(e.target.checked)}
            className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
          />
          <span>New Arrival Badge</span>
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="px-5 py-2.5 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition shadow-xs disabled:opacity-50"
        >
          {isSubmitting ? 'Saving Changes...' : 'Save & Update'}
        </button>
      </div>
    </form>
  )
}
