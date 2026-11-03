'use client'

import React, { useEffect } from 'react'

export function WaterRippleListener() {
  useEffect(() => {
    const handlePointerDown = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest?.(
        'button, a, .glass-card, .liquid-glass-card, .ios-glass-icon, [role="button"]'
      ) as HTMLElement | null

      if (!target) return

      // Don't duplicate ripple if already busy
      const rect = target.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height) * 1.6
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      const ripple = document.createElement('span')
      ripple.className = 'water-drop-wave'
      ripple.style.width = `${size}px`
      ripple.style.height = `${size}px`
      ripple.style.left = `${x}px`
      ripple.style.top = `${y}px`

      // Ensure target position relative for clipping if not set
      const computedPos = window.getComputedStyle(target).position
      if (computedPos === 'static') {
        target.style.position = 'relative'
      }
      target.classList.add('ripple-surface')
      target.appendChild(ripple)

      setTimeout(() => {
        ripple.remove()
      }, 850)
    }

    window.addEventListener('pointerdown', handlePointerDown, { passive: true })
    return () => window.removeEventListener('pointerdown', handlePointerDown)
  }, [])

  return null
}
