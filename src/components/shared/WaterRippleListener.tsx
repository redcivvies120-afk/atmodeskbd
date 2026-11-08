'use client'

import { useEffect } from 'react'

const RIPPLE_TARGETS =
  'button, a, [role="button"], .liquid-glass-card, .glass-card, .ios-glass-icon, .lg-icon'

/**
 * Global pointer effects, one listener each (no per-component JS):
 *  1. Water ripple where you tap / click
 *  2. Specular glare that follows the cursor across .liquid-glass-card
 * Both are skipped for reduced-motion users; glare is mouse-only.
 */
export function WaterRippleListener() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')

    const onPointerDown = (e: PointerEvent) => {
      if (reduce.matches || e.button > 0) return
      const el = (e.target as Element | null)?.closest?.(RIPPLE_TARGETS) as HTMLElement | null
      if (!el || el.hasAttribute('data-no-ripple')) return
      if ((el as HTMLButtonElement).disabled || el.getAttribute('aria-disabled') === 'true') return
      if (el.querySelectorAll(':scope > .water-drop-wave').length >= 3) return

      const rect = el.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      const size = Math.min(Math.max(rect.width, rect.height) * 1.5, 420)

      // Temporarily make the element a clipping, positioned container.
      const wasStatic = getComputedStyle(el).position === 'static'
      if (wasStatic) el.style.position = 'relative'
      el.setAttribute('data-rippling', '')

      const ripple = document.createElement('span')
      ripple.className = 'water-drop-wave'
      ripple.style.width = ripple.style.height = `${size}px`
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`
      ripple.setAttribute('aria-hidden', 'true')
      el.appendChild(ripple)

      ripple.addEventListener(
        'animationend',
        () => {
          ripple.remove()
          if (!el.querySelector(':scope > .water-drop-wave')) {
            el.removeAttribute('data-rippling')
            if (wasStatic) el.style.position = ''
          }
        },
        { once: true }
      )
    }

    let raf = 0
    let pending: { card: HTMLElement; x: number; y: number } | null = null
    const flush = () => {
      raf = 0
      if (!pending) return
      const { card, x, y } = pending
      const r = card.getBoundingClientRect()
      card.style.setProperty('--mx', `${x - r.left}px`)
      card.style.setProperty('--my', `${y - r.top}px`)
      pending = null
    }
    const onPointerMove = (e: PointerEvent) => {
      if (!finePointer.matches || e.pointerType !== 'mouse') return
      const card = (e.target as Element | null)?.closest?.('.liquid-glass-card') as HTMLElement | null
      if (!card) return
      pending = { card, x: e.clientX, y: e.clientY }
      if (!raf) raf = requestAnimationFrame(flush)
    }

    window.addEventListener('pointerdown', onPointerDown, { passive: true })
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return null
}
