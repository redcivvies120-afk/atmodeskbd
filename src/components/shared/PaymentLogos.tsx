import React from 'react'

export function BkashLogo({ className = 'h-6' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 bg-[#E2136E] text-white rounded-lg font-black text-xs tracking-wider shadow-xs ${className}`}>
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
      <span>bKash</span>
    </div>
  )
}

export function NagadLogo({ className = 'h-6' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 bg-[#F7941D] text-white rounded-lg font-black text-xs tracking-wider shadow-xs ${className}`}>
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2c1.1 0 2 .9 2 2v1.1C17.6 5.7 20 8.6 20 12c0 4.4-3.6 8-8 8s-8-3.6-8-8c0-3.4 2.4-6.3 6-6.9V4c0-1.1.9-2 2-2z" />
      </svg>
      <span>নগদ / Nagad</span>
    </div>
  )
}

export function RocketLogo({ className = 'h-6' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 bg-[#8C3494] text-white rounded-lg font-black text-xs tracking-wider shadow-xs ${className}`}>
      <span>🚀 Rocket</span>
    </div>
  )
}
