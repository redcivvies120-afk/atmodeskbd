'use client'

import React from 'react'

export function LiquidBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1] select-none" aria-hidden="true">
      {/* Top Left Fluid Cyan Droplet */}
      <div
        className="absolute -top-32 -left-32 w-96 h-96 sm:w-[500px] sm:h-[500px] bg-gradient-to-tr from-sky-400/20 via-cyan-300/25 to-teal-200/15 rounded-full blur-3xl animate-liquid-morph opacity-80"
        style={{ animationDuration: '14s' }}
      />

      {/* Top Right Floating Water Droplet */}
      <div
        className="absolute top-20 -right-28 w-80 h-80 sm:w-[480px] sm:h-[480px] bg-gradient-to-br from-indigo-500/18 via-purple-400/20 to-sky-300/15 rounded-full blur-3xl animate-liquid-morph opacity-70"
        style={{ animationDuration: '18s', animationDelay: '-4s' }}
      />

      {/* Mid Center Ambient Refraction Bead */}
      <div
        className="absolute top-[45%] left-[20%] w-72 h-72 sm:w-[420px] sm:h-[420px] bg-gradient-to-r from-teal-300/15 via-sky-400/15 to-transparent rounded-full blur-3xl animate-liquid-morph opacity-60"
        style={{ animationDuration: '16s', animationDelay: '-8s' }}
      />

      {/* Bottom Floating Water Blob */}
      <div
        className="absolute -bottom-36 right-[15%] w-96 h-96 sm:w-[540px] sm:h-[540px] bg-gradient-to-tl from-sky-400/18 via-blue-500/15 to-indigo-300/10 rounded-full blur-3xl animate-liquid-morph opacity-65"
        style={{ animationDuration: '20s', animationDelay: '-2s' }}
      />
    </div>
  )
}
