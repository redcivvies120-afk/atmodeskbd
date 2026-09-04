'use client'

import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, X, Loader2, ImageIcon, Upload } from 'lucide-react'

export function ImageSearchButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleImageSearch = async () => {
    if (!preview) return
    setIsSearching(true)

    try {
      // Analyze the image to extract product keywords
      // We use a simple approach: extract dominant colors and general object type
      // Since we can't run ML in the browser without a heavy library,
      // we'll use the image to generate search terms based on visual analysis

      // Create a canvas to analyze the image
      const img = new Image()
      img.crossOrigin = 'anonymous'
      
      await new Promise<void>((resolve) => {
        img.onload = () => resolve()
        img.src = preview
      })

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      canvas.width = 100
      canvas.height = 100
      ctx.drawImage(img, 0, 0, 100, 100)

      const imageData = ctx.getImageData(0, 0, 100, 100).data

      // Analyze dominant colors
      let totalR = 0, totalG = 0, totalB = 0
      let darkPixels = 0, lightPixels = 0
      const pixelCount = imageData.length / 4

      for (let i = 0; i < imageData.length; i += 4) {
        totalR += imageData[i]
        totalG += imageData[i + 1]
        totalB += imageData[i + 2]
        const brightness = (imageData[i] + imageData[i + 1] + imageData[i + 2]) / 3
        if (brightness < 80) darkPixels++
        if (brightness > 180) lightPixels++
      }

      const avgR = totalR / pixelCount
      const avgG = totalG / pixelCount
      const avgB = totalB / pixelCount

      // Generate search terms based on image analysis
      const searchTerms: string[] = []

      // Color-based suggestions
      if (avgR > 180 && avgG < 100 && avgB < 100) searchTerms.push('red', 'ambient light')
      if (avgR < 100 && avgG < 100 && avgB > 180) searchTerms.push('blue', 'LED')
      if (avgR > 180 && avgG > 180 && avgB < 100) searchTerms.push('warm', 'ambient')
      if (avgR < 80 && avgG < 80 && avgB < 80) searchTerms.push('dark', 'black', 'clock')
      if (avgR > 200 && avgG > 200 && avgB > 200) searchTerms.push('white', 'minimal')
      if (avgG > avgR && avgG > avgB) searchTerms.push('green', 'weather')

      // If mostly dark, likely a clock or tech device
      if (darkPixels > pixelCount * 0.4) {
        searchTerms.push('smart clock', 'desk tech')
      }

      // If has bright spots on dark background, likely LED/display
      if (darkPixels > pixelCount * 0.5 && lightPixels > pixelCount * 0.05) {
        searchTerms.push('LED', 'display', 'pixel')
      }

      // Default fallback terms
      if (searchTerms.length === 0) {
        searchTerms.push('desk', 'gadget', 'clock')
      }

      // Use the most relevant search term
      const bestTerm = searchTerms[0] || 'clock'
      setResults(searchTerms.slice(0, 6))

      // Navigate to search with the detected terms
      setTimeout(() => {
        router.push(`/search?q=${encodeURIComponent(bestTerm)}`)
        setIsOpen(false)
        setIsSearching(false)
        setPreview(null)
      }, 1500)
    } catch (err) {
      console.error('Image search error:', err)
      setIsSearching(false)
      // Fallback: just search for "desk gadget"
      router.push('/search?q=desk+gadget')
      setIsOpen(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setPreview(null)
    setResults([])
    setIsSearching(false)
  }

  return (
    <>
      {/* Image Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-sky-500 text-slate-600 hover:text-sky-600 text-xs font-semibold rounded-xl transition shadow-xs"
      >
        <Camera className="w-4 h-4" />
        Search by Image
      </button>

      {/* Image Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center mx-auto">
                <Camera className="w-6 h-6 text-sky-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Search by Image</h3>
              <p className="text-xs text-slate-500">
                Upload a photo of a product and we&apos;ll find similar items
              </p>
            </div>

            {/* Upload Area */}
            {!preview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-sky-500 rounded-2xl p-8 text-center cursor-pointer transition group"
              >
                <div className="space-y-3">
                  <div className="w-14 h-14 bg-slate-100 group-hover:bg-sky-50 rounded-2xl flex items-center justify-center mx-auto transition">
                    <Upload className="w-7 h-7 text-slate-400 group-hover:text-sky-600 transition" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      Click to upload an image
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      JPG, PNG, WEBP · Max 10MB
                    </p>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-4">
                {/* Image Preview */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-200">
                  <img
                    src={preview}
                    alt="Search image"
                    className="w-full h-48 object-contain bg-slate-50"
                  />
                  {!isSearching && (
                    <button
                      onClick={() => {
                        setPreview(null)
                        setResults([])
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white rounded-full shadow-md text-slate-500 hover:text-slate-700 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Analysis Results */}
                {isSearching && (
                  <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 text-center space-y-2">
                    <Loader2 className="w-5 h-5 text-sky-600 mx-auto animate-spin" />
                    <p className="text-xs font-semibold text-sky-700">
                      Analyzing your image...
                    </p>
                    {results.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 justify-center pt-1">
                        {results.map((term) => (
                          <span
                            key={term}
                            className="px-2.5 py-1 bg-white border border-sky-200 text-sky-700 text-[11px] font-medium rounded-full"
                          >
                            {term}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Search Button */}
                {!isSearching && (
                  <button
                    onClick={handleImageSearch}
                    className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold rounded-xl transition shadow-xs flex items-center justify-center gap-2"
                  >
                    <ImageIcon className="w-4 h-4" />
                    Find Similar Products
                  </button>
                )}
              </div>
            )}

            {/* Tips */}
            <div className="bg-slate-50 rounded-xl p-3 text-[11px] text-slate-500 space-y-1">
              <p className="font-semibold text-slate-600">💡 Tips for best results:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Use clear, well-lit photos</li>
                <li>Focus on one product at a time</li>
                <li>Include the full product in frame</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
