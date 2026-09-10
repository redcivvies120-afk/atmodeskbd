// src/components/product/ShareButtons.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { Share2, Copy, Check } from 'lucide-react'

export interface ShareButtonsProps {
  productName: string
  productUrl: string
  className?: string
}

export function ShareButtons({ productName, productUrl, className = '' }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const [fullUrl, setFullUrl] = useState(productUrl)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (productUrl.startsWith('http://') || productUrl.startsWith('https://')) {
        setFullUrl(productUrl)
      } else {
        const cleanPath = productUrl.startsWith('/') ? productUrl : `/${productUrl}`
        setFullUrl(`${window.location.origin}${cleanPath}`)
      }
    }
  }, [productUrl])

  const handleCopyLink = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(fullUrl)
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea')
        textarea.value = fullUrl
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy URL:', err)
    }
  }

  const whatsappMessage = `Check out ${productName} on ATMODESK.bd! ${fullUrl}`
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`
  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        <Share2 className="w-3.5 h-3.5 text-sky-600" />
        <span>Share this product</span>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {/* WhatsApp Share Button */}
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800/60 transition shadow-2xs"
          title="Share on WhatsApp"
        >
          {/* WhatsApp SVG Icon */}
          <svg
            className="w-3.5 h-3.5 fill-current text-emerald-600 dark:text-emerald-400"
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.276-.1-.476-.15-.676.15-.2.301-.776.979-.951 1.18-.175.2-.35.225-.651.075-.3-.15-1.267-.467-2.414-1.49-.893-.796-1.496-1.78-1.671-2.08-.175-.3-.019-.462.132-.612.136-.135.301-.35.451-.525.15-.175.2-.301.301-.5.1-.2.05-.376-.025-.526-.075-.15-.676-1.631-.926-2.233-.244-.587-.492-.507-.676-.516h-.576c-.2 0-.526.075-.801.376-.275.3-1.051 1.027-1.051 2.504s1.077 2.905 1.227 3.106c.15.2 2.119 3.235 5.132 4.537.717.31 1.277.495 1.713.633.72.229 1.375.197 1.893.12.578-.087 1.78-.727 2.03-1.43.25-.702.25-1.303.175-1.43-.075-.125-.275-.2-.576-.35zM12.04 2C6.543 2 2.08 6.463 2.08 11.96c0 1.98.58 3.824 1.583 5.378L2 22l4.808-1.579a9.92 9.92 0 005.232 1.499c5.497 0 9.96-4.463 9.96-9.96C22 6.463 17.537 2 12.04 2zm0 18.232c-1.603 0-3.093-.453-4.364-1.238l-.313-.193-2.855.939.954-2.783-.211-.336a8.212 8.212 0 01-1.252-4.661c0-4.57 3.719-8.288 8.29-8.288 4.572 0 8.29 3.718 8.29 8.288 0 4.57-3.718 8.288-8.29 8.288z" />
          </svg>
          <span>WhatsApp</span>
        </a>

        {/* Facebook Share Button */}
        <a
          href={facebookHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800/60 transition shadow-2xs"
          title="Share on Facebook"
        >
          <svg
            className="w-3.5 h-3.5 fill-current text-blue-600 dark:text-blue-400"
            viewBox="0 0 24 24"
          >
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span>Facebook</span>
        </a>

        {/* Copy Link Button */}
        <button
          onClick={handleCopyLink}
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition shadow-2xs cursor-pointer"
          title="Copy link to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-700 dark:text-emerald-300">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Copy Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
