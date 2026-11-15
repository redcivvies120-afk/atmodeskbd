// src/app/storefront/page.tsx
import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Storefront — ATMODESK Bangladesh',
  description: 'Single-file high-speed storefront for ATMODESK.bd desk tech gadgets.',
}

export default function StorefrontPage() {
  return (
    <div className="w-full min-h-screen bg-white">
      <iframe
        src="/storefront.html"
        title="ATMODESK.bd Storefront"
        className="w-full h-screen border-none"
      />
    </div>
  )
}
