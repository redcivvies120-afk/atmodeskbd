'use client'

import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/shared/Providers'
import { Upload, X, ImagePlus, Loader2, Plus, Trash2, Palette, Box } from 'lucide-react'

interface VariantRow {
  name: string   // e.g. "Color", "Model"
  value: string  // e.g. "Black", "Pro Version"
  price: string  // optional override price
  stock: string  // variant-specific stock
}

interface ImageItem {
  url: string
  preview: string
  isPrimary: boolean
}

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

  // Multiple images state
  const [images, setImages] = useState<ImageItem[]>([])
  const [uploading, setUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  // Variants state
  const [variants, setVariants] = useState<VariantRow[]>([])

  // Upload image via our server-side API
  const uploadImage = async (file: File) => {
    setUploading(true)
    try {
      const localUrl = URL.createObjectURL(file)

      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Upload failed')
      }

      const data = await res.json()
      const newImage: ImageItem = {
        url: data.url,
        preview: data.url,
        isPrimary: images.length === 0, // first image is primary
      }
      setImages(prev => [...prev, newImage])
      toast('Image uploaded! 🖼️')
    } catch (err: any) {
      toast(err.message || 'Image upload failed.', 'error')
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        toast('Please select image files only (JPG, PNG, WebP)', 'error')
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        toast('Each image must be smaller than 10 MB', 'error')
        return
      }
      uploadImage(file)
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const removeImage = (index: number) => {
    setImages(prev => {
      const updated = prev.filter((_, i) => i !== index)
      // If we removed the primary, make first one primary
      if (updated.length > 0 && !updated.some(img => img.isPrimary)) {
        updated[0].isPrimary = true
      }
      return updated
    })
  }

  const setPrimaryImage = (index: number) => {
    setImages(prev => prev.map((img, i) => ({ ...img, isPrimary: i === index })))
  }

  const addImageByUrl = (url: string) => {
    if (!url.trim()) return
    setImages(prev => [...prev, { url: url.trim(), preview: url.trim(), isPrimary: prev.length === 0 }])
  }

  // Variant helpers
  const addVariant = () => {
    setVariants(prev => [...prev, { name: 'Color', value: '', price: '', stock: '' }])
  }

  const updateVariant = (index: number, field: keyof VariantRow, value: string) => {
    setVariants(prev => prev.map((v, i) => i === index ? { ...v, [field]: value } : v))
  }

  const removeVariant = (index: number) => {
    setVariants(prev => prev.filter((_, i) => i !== index))
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
          images: images.map((img, i) => ({
            url: img.url,
            isPrimary: img.isPrimary,
            sortOrder: i,
          })),
          variants: variants
            .filter(v => v.value.trim())
            .map(v => ({
              name: v.name,
              value: v.value,
              price: v.price ? parseFloat(v.price) : null,
              stock: v.stock ? parseInt(v.stock, 10) : 0,
            })),
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

      {/* -- Multiple Product Images -- */}
      <div className="space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          Product Photos (Multiple)
        </label>

        {/* Upload buttons */}
        <div className="flex gap-2">
          <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-sky-50 hover:bg-sky-100 border-2 border-sky-300 hover:border-sky-500 rounded-xl text-sm font-bold text-sky-700 cursor-pointer transition">
            🖼️ Select from Gallery
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
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
              onChange={(e) => handleFileSelect(e.target.files)}
              disabled={uploading}
            />
          </label>
        </div>

        {/* Drag & Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed cursor-pointer transition text-center ${
            isDragging
              ? 'border-sky-500 bg-sky-50'
              : 'border-slate-300 hover:border-sky-400 hover:bg-slate-50/80'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
              <p className="text-xs text-slate-500 font-medium">Uploading photo...</p>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
                <ImagePlus className="w-5 h-5 text-sky-500" />
              </div>
              <p className="text-[11px] text-slate-400">Drag & drop images here · You can upload multiple · JPG, PNG, WebP — max 10 MB each</p>
            </>
          )}
        </div>

        {/* Image Previews Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {images.map((img, i) => (
              <div key={i} className={`relative rounded-xl overflow-hidden border-2 ${img.isPrimary ? 'border-sky-500 ring-2 ring-sky-200' : 'border-slate-200'}`}>
                <img src={img.preview} alt={`Photo ${i + 1}`} className="w-full aspect-square object-cover" />
                <div className="absolute top-1 right-1 flex gap-1">
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 text-[10px]"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setPrimaryImage(i)}
                  className={`absolute bottom-0 left-0 right-0 text-center text-[10px] font-bold py-1 transition ${
                    img.isPrimary
                      ? 'bg-sky-500 text-white'
                      : 'bg-black/50 text-white/80 hover:bg-sky-600'
                  }`}
                >
                  {img.isPrimary ? '⭐ Main Photo' : 'Set as Main'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Manual URL fallback */}
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="Or paste an image URL..."
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-sky-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addImageByUrl((e.target as HTMLInputElement).value)
                ;(e.target as HTMLInputElement).value = ''
              }
            }}
          />
          <button
            type="button"
            onClick={(e) => {
              const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement
              addImageByUrl(input.value)
              input.value = ''
            }}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 transition"
          >
            Add URL
          </button>
        </div>
        <p className="text-[11px] text-slate-400">
          💡 First image becomes the main product photo. Click &quot;Set as Main&quot; to change.
        </p>
      </div>

      {/* -- Color / Model Variants -- */}
      <div className="space-y-3 border-t border-slate-100 pt-5">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Color / Model Options
            </label>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Add different colors, models, or sizes that customers can choose from
            </p>
          </div>
          <button
            type="button"
            onClick={addVariant}
            className="flex items-center gap-1.5 px-3 py-2 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl text-xs font-bold text-sky-700 transition"
          >
            <Plus className="w-3.5 h-3.5" /> Add Option
          </button>
        </div>

        {variants.length > 0 && (
          <div className="space-y-3">
            {variants.map((variant, i) => (
              <div key={i} className="flex flex-wrap items-end gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="w-28">
                  <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Type</label>
                  <select
                    value={variant.name}
                    onChange={(e) => updateVariant(i, 'name', e.target.value)}
                    className="w-full px-2 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-sky-500"
                  >
                    <option value="Color">🎨 Color</option>
                    <option value="Model">📦 Model</option>
                    <option value="Size">📐 Size</option>
                    <option value="Version">🔢 Version</option>
                    <option value="Style">✨ Style</option>
                  </select>
                </div>
                <div className="flex-1 min-w-[120px]">
                  <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Value *</label>
                  <input
                    type="text"
                    value={variant.value}
                    onChange={(e) => updateVariant(i, 'value', e.target.value)}
                    placeholder={variant.name === 'Color' ? 'e.g. Black, White, Rose Gold' : 'e.g. Pro, Standard'}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-sky-500"
                  />
                </div>
                <div className="w-24">
                  <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Price ৳</label>
                  <input
                    type="number"
                    value={variant.price}
                    onChange={(e) => updateVariant(i, 'price', e.target.value)}
                    placeholder="Same"
                    min="0"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-sky-500"
                  />
                </div>
                <div className="w-20">
                  <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Stock</label>
                  <input
                    type="number"
                    value={variant.stock}
                    onChange={(e) => updateVariant(i, 'stock', e.target.value)}
                    placeholder="10"
                    min="0"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-sky-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeVariant(i)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {variants.length === 0 && (
          <div className="flex items-center gap-3 p-4 bg-slate-50/60 border border-dashed border-slate-200 rounded-xl text-xs text-slate-400">
            <Palette className="w-5 h-5 text-slate-300" />
            <span>No options added yet. Click &quot;Add Option&quot; to add colors, models, or sizes.</span>
          </div>
        )}
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
          placeholder={"• WiFi 2.4GHz connected\n• 64x32 RGB Display\n• USB-C Powered"}
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
