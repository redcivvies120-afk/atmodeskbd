'use client'

import React, { useState } from 'react'
import { Star, CheckCircle2, MessageSquarePlus, ThumbsUp, Loader2, Sparkles, ChevronDown } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useToast } from '@/components/shared/Providers'

export interface ReviewItem {
  id: string
  rating: number
  title?: string | null
  body?: string | null
  authorName?: string | null
  isVerified: boolean
  createdAt: string | Date
  user?: {
    id?: string
    name?: string | null
    image?: string | null
  } | null
}

interface ProductReviewsProps {
  productId: string
  productName: string
  initialRating: number
  initialReviewCount: number
  initialReviews: ReviewItem[]
  onReviewAdded?: (newReview: ReviewItem, newRating: number, newCount: number) => void
}

export function ProductReviews({
  productId,
  productName,
  initialRating,
  initialReviewCount,
  initialReviews,
  onReviewAdded,
}: ProductReviewsProps) {
  const { toast } = useToast()
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews || [])
  const [rating, setRating] = useState<number>(initialRating || 4.9)
  const [reviewCount, setReviewCount] = useState<number>(initialReviewCount || reviews.length)

  // Write a Review Form state
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formRating, setFormRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [formName, setFormName] = useState('')
  const [formTitle, setFormTitle] = useState('')
  const [formComment, setFormComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Filtering & Pagination
  const [starFilter, setStarFilter] = useState<number | null>(null)
  const [visibleCount, setVisibleCount] = useState(6)

  // Calculate rating breakdown distribution
  const count5 = reviews.filter((r) => r.rating === 5).length
  const count4 = reviews.filter((r) => r.rating === 4).length
  const count3 = reviews.filter((r) => r.rating === 3).length
  const count2 = reviews.filter((r) => r.rating === 2).length
  const count1 = reviews.filter((r) => r.rating === 1).length
  const totalReviews = reviews.length || 1

  const pct5 = Math.round((count5 / totalReviews) * 100)
  const pct4 = Math.round((count4 / totalReviews) * 100)
  const pct3 = Math.round((count3 / totalReviews) * 100)
  const pct2 = Math.round((count2 / totalReviews) * 100)
  const pct1 = Math.round((count1 / totalReviews) * 100)

  // Filtered reviews list
  const filteredReviews = starFilter
    ? reviews.filter((r) => r.rating === starFilter)
    : reviews

  const visibleReviews = filteredReviews.slice(0, visibleCount)

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim()) {
      toast('Please enter your name.', 'error')
      return
    }
    if (!formComment.trim()) {
      toast('Please write a short review comment.', 'error')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName.trim(),
          rating: formRating,
          title: formTitle.trim() || undefined,
          comment: formComment.trim(),
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit review')
      }

      // Add new review at the top
      const createdReview: ReviewItem = data.review
      const updatedList = [createdReview, ...reviews]
      setReviews(updatedList)
      setRating(data.newRating || rating)
      setReviewCount(data.newCount || reviewCount + 1)

      if (onReviewAdded) {
        onReviewAdded(createdReview, data.newRating, data.newCount)
      }

      // Reset form
      setFormName('')
      setFormTitle('')
      setFormComment('')
      setFormRating(5)
      setIsFormOpen(false)

      toast('Thank you! Your review has been published. ⭐⭐⭐⭐⭐')
    } catch (err: any) {
      toast(err.message || 'Error submitting review', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8" id="customer-reviews-section">
      {/* ─── HEADER & RATING SUMMARY CARD ──────────────────────────── */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          {/* Big Score Box */}
          <div className="flex items-center gap-6">
            <div className="text-center sm:text-left">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight font-mono">
                  {rating.toFixed(1)}
                </span>
                <span className="text-slate-400 font-bold text-lg">/ 5</span>
              </div>
              <div className="flex items-center text-amber-400 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(rating)
                        ? 'fill-amber-400'
                        : i < rating
                        ? 'fill-amber-300'
                        : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1.5">
                Based on <strong className="text-slate-900">{reviewCount}</strong> verified customer reviews
              </p>
            </div>
          </div>

          {/* Rating Breakdown Progress Bars */}
          <div className="flex-1 max-w-md space-y-2">
            {[
              { stars: 5, pct: pct5, count: count5 },
              { stars: 4, pct: pct4, count: count4 },
              { stars: 3, pct: pct3, count: count3 },
              { stars: 2, pct: pct2, count: count2 },
              { stars: 1, pct: pct1, count: count1 },
            ].map((bar) => (
              <div key={bar.stars} className="flex items-center gap-3 text-xs">
                <span className="w-12 font-bold text-slate-700 flex items-center gap-1 flex-shrink-0">
                  {bar.stars} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                </span>
                <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${bar.pct}%` }}
                  />
                </div>
                <span className="w-10 text-right text-slate-400 font-mono text-[11px] flex-shrink-0">
                  {bar.pct}%
                </span>
              </div>
            ))}
          </div>

          {/* "Write a Review" Trigger Button */}
          <div className="flex flex-col sm:items-end justify-center">
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-sm transition cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4 text-sky-400" />
              {isFormOpen ? 'Close Review Form' : 'Write a Customer Review'}
            </button>
            <p className="text-[11px] text-slate-400 mt-2 text-center sm:text-right">
              Share your experience with other Bangladeshi tech lovers
            </p>
          </div>
        </div>

        {/* ─── INTERACTIVE REVIEW FORM (Expandable) ──────────────────── */}
        {isFormOpen && (
          <form
            onSubmit={handleSubmitReview}
            className="mt-8 pt-8 border-t border-slate-200/80 space-y-5 animate-fade-in"
          >
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base">
              <Sparkles className="w-4 h-4 text-sky-500" />
              <span>Leave Your Review for {productName}</span>
            </div>

            {/* Star Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Your Overall Rating <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= (hoverRating || formRating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-600 ml-2">
                  {formRating === 5 && '⭐⭐⭐⭐⭐ Excellent (5.0)'}
                  {formRating === 4 && '⭐⭐⭐⭐ Very Good (4.0)'}
                  {formRating === 3 && '⭐⭐⭐ Good (3.0)'}
                  {formRating === 2 && '⭐⭐ Fair (2.0)'}
                  {formRating === 1 && '⭐ Poor (1.0)'}
                </span>
              </div>
            </div>

            {/* Reviewer Name & Headline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Your Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Tanvir Ahmed"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 outline-none focus:border-sky-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Review Headline / Title (Optional)
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Looks futuristic on my desk!"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 outline-none focus:border-sky-500 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Comment Body */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Detailed Review &amp; Experience <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={formComment}
                onChange={(e) => setFormComment(e.target.value)}
                placeholder="What did you like about the product? How is the build quality, display brightness, WiFi setup, or delivery speed?"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 outline-none focus:border-sky-500 focus:bg-white transition leading-relaxed"
              />
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm shadow-xs transition disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <ThumbsUp className="w-4 h-4" />
                    Submit Review
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ─── FILTER BAR ────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
            Filter:
          </span>
          <button
            onClick={() => {
              setStarFilter(null)
              setVisibleCount(6)
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              starFilter === null
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Reviews ({reviews.length})
          </button>

          <button
            onClick={() => {
              setStarFilter(5)
              setVisibleCount(6)
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
              starFilter === 5
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            5 Stars ({count5})
          </button>

          {count4 > 0 && (
            <button
              onClick={() => {
                setStarFilter(4)
                setVisibleCount(6)
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                starFilter === 4
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              4 Stars ({count4})
            </button>
          )}
        </div>

        <span className="text-xs text-slate-400">
          Showing {Math.min(visibleCount, filteredReviews.length)} of {filteredReviews.length} reviews
        </span>
      </div>

      {/* ─── REVIEWS CARDS LIST ────────────────────────────────────── */}
      {visibleReviews.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200/80 text-slate-400">
          <p className="text-sm font-semibold">No reviews found for this filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visibleReviews.map((r) => {
            const reviewerName = r.authorName || r.user?.name || 'Verified Buyer'
            const initial = reviewerName.charAt(0).toUpperCase()

            return (
              <div
                key={r.id}
                className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-3 hover:border-slate-300 transition"
              >
                <div>
                  {/* Top: Avatar, Name, Verified Badge, Date */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                        {initial}
                      </div>
                      <div>
                        <strong className="text-slate-900 text-xs sm:text-sm block leading-tight">
                          {reviewerName}
                        </strong>
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold mt-0.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          Verified Buyer
                        </span>
                      </div>
                    </div>

                    <span className="text-[11px] text-slate-400 whitespace-nowrap">
                      {formatDate(r.createdAt)}
                    </span>
                  </div>

                  {/* Star Rating */}
                  <div className="flex items-center text-amber-400 mt-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Review Title */}
                  {r.title && (
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm mt-2">
                      {r.title}
                    </h4>
                  )}

                  {/* Review Body */}
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mt-1.5">
                    {r.body}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ─── LOAD MORE BUTTON ──────────────────────────────────────── */}
      {filteredReviews.length > visibleCount && (
        <div className="text-center pt-4">
          <button
            onClick={() => setVisibleCount((prev) => prev + 6)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm shadow-xs transition cursor-pointer"
          >
            <span>Load More Customer Reviews</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs">
              +{Math.min(6, filteredReviews.length - visibleCount)} remaining
            </span>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      )}
    </div>
  )
}
