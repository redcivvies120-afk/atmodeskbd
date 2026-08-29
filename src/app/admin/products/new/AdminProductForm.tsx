'use client'

import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/shared/Providers'
import { Upload, X, ImagePlus, Loader2 } from 'lucide-react'

export function AdminProductForm({ categories }: { categories: { id: string; name: string }[] }) {
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState('')
  const [sku, setSku] = useState(`ATD-${Math.floor(100 + Math.random() * 900)}`)
  const [categoryId, setCategoryId] = useState('')
  const [price, setPrice] = useState('')
  const [originalPrice, setOriginalPrice] = useState('')
  const [stock, setStock] = useState('25')
  const [description, setDescription] = useState('')
  const [details, setDetails] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  const [isBestSeller, setIsBestSeller] = useState(false)
  const [isNewArrival, setIsNewArrival] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Image state
  const [imageUrl, setImageUrl] = useState('')
  const [imagePreview, setImagePreview] = useState('')
  const [uploading, setUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  // Upload image to Cloudinary
  const uploadToCloudinary = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'atmodeskbd_products')
      formData.append('folder', 'atmodeskbd/products')

      const res = await fetch('https://api.cloudinary.com/v1_1/atmodeskbd/image/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error('Upload failed')
      const data = await res.json()
      setImageUrl(data.secure_url)
      setImagePreview(data.secure_url)
      toast('Image uploaded successfully! 🖼️')
    } catch (err) {
      // Fallback: show local preview + ask for URL
      const localUrl = URL.createObjectURL(file)
      setImagePreview(localUrl)
      toast('Cloudinary not set up yet. Enter an image URL below instead.', 'error')
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast('Please select an image file (JPG, PNG, WebP)', 'error')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      toast('Image must be smaller than 10 MB', 'error')
      return
    }
    uploadToCloudinary(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !sku || !price) {
      toast('Please fill in Name, SKU, and Price.', 'error')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
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
          isActive: true,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create product')

      toast('Product created successfully! 📦')
      router.push('/admin/products')
      router.refresh()
    } catch (err: any) {
      toast(err.message || 'Error creating product', 'error')
    } finally {
      setIsSubmitting(false)
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
            placeholder="e.g. RGB Matrix Smart Weather Clock"
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
            placeholder="ATD-001"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-sky-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Category
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-sky-500"
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Sale Price (৳ BDT) *
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="1499"
            min="0"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-sky-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Original Price (৳ BDT) — for showing strikethrough
          </label>
          <input
            type="number"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            placeholder="2000"
            min="0"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-sky-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Stock Quantity
          </label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="25"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* ── Product Image Upload ── */}
      <div className="space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          Product Photo
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Drag & Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center gap-2 p-6 rounded-2xl border-2 border-dashed cursor-pointer transition text-center ${
              isDragging
                ? 'border-sky-500 bg-sky-50'
                : 'border-slate-300 hover:border-sky-400 hover:bg-slate-50/80'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFileSelect(file)
              }}
            />
            {uploading ? (
              <>
                <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
                <p className="text-xs text-slate-500 font-medium">Uploading photo...</p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center">
                  <ImagePlus className="w-6 h-6 text-sky-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700">Click to upload or drag & drop</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">JPG, PNG, WebP — max 10 MB</p>
                </div>
              </>
            )}
          </div>

          {/* Preview */}
          <div className="relative flex items-center justify-center bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden min-h-[140px]">
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="Product preview"
                  className="w-full h-full object-contain max-h-[160px] p-2"
                />
                <button
                  type="button"
                  onClick={() => { setImagePreview(''); setImageUrl('') }}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <p className="text-xs text-slate-400">Preview appears here</p>
            )}
          </div>
        </div>

        {/* Manual URL fallback */}
        <div>
          <label className="block text-[11px] text-slate-500 mb-1">
            Or paste an image URL directly (from Facebook, Google Images, etc.)
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value)
              setImagePreview(e.target.value)
            }}
            placeholder="https://example.com/your-product-image.jpg"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-sky-500"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            💡 Easy tip: Upload your photo to <strong>imgbb.com</strong> (free) and paste the link here
          </p>
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
          placeholder="Summary of the product..."
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
          placeholder="• WiFi 2.4GHz connected&#10;• 64x32 RGB Display&#10;• USB-C Powered"
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono outline-none focus:border-sky-500"
        />
      </div>

      {/* Flags */}
      <div className="flex flex-wrap gap-6 pt-2 border-t border-slate-100 text-xs font-bold text-slate-700">
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
          {isSubmitting ? 'Saving...' : 'Publish Product'}
        </button>
      </div>
    </form>
  )
}
