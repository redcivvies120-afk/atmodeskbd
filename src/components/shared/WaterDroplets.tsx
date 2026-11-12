import type { CSSProperties } from 'react'

interface Drop {
  x: string // left
  y: string // top
  d: number // diameter px
  run: number // how far it slides down px
  dur: number // seconds per life
  delay: number // seconds (negative = already mid-cycle on load)
}

/* Hand-placed so the layout is deterministic (no hydration mismatch) and
   never clusters. Mixed sizes read as real condensation on glass. */
const HERO_DROPS: Drop[] = [
  { x: '6%',  y: '14%', d: 20, run: 90,  dur: 14, delay: -3 },
  { x: '17%', y: '58%', d: 10, run: 60,  dur: 11, delay: -8 },
  { x: '27%', y: '8%',  d: 14, run: 110, dur: 17, delay: -11 },
  { x: '38%', y: '70%', d: 8,  run: 50,  dur: 10, delay: -5 },
  { x: '46%', y: '22%', d: 22, run: 100, dur: 16, delay: -1 },
  { x: '55%', y: '82%', d: 12, run: 40,  dur: 12, delay: -9 },
  { x: '64%', y: '12%', d: 9,  run: 80,  dur: 13, delay: -6 },
  { x: '73%', y: '48%', d: 18, run: 120, dur: 18, delay: -13 },
  // hidden on phones (see CSS) from here on
  { x: '82%', y: '20%', d: 11, run: 70,  dur: 12, delay: -2 },
  { x: '90%', y: '64%', d: 16, run: 90,  dur: 15, delay: -10 },
  { x: '12%', y: '36%', d: 7,  run: 46,  dur: 9,  delay: -4 },
  { x: '34%', y: '44%', d: 13, run: 84,  dur: 14, delay: -12 },
  { x: '60%', y: '55%', d: 7,  run: 52,  dur: 10, delay: -7 },
  { x: '95%', y: '10%', d: 10, run: 66,  dur: 11, delay: -14 },
]

const CARD_DROPS: Drop[] = [
  { x: '8%',  y: '10%', d: 12, run: 60, dur: 12, delay: -2 },
  { x: '78%', y: '16%', d: 9,  run: 48, dur: 10, delay: -6 },
  { x: '88%', y: '58%', d: 14, run: 70, dur: 15, delay: -9 },
  { x: '20%', y: '66%', d: 8,  run: 40, dur: 9,  delay: -4 },
]

/**
 * Beads of water that sit on the surface, then slide down leaving a trail.
 * Place inside a `relative overflow-hidden` parent. Pure CSS animation.
 */
export function WaterDroplets({
  preset = 'hero',
  className = '',
}: {
  preset?: 'hero' | 'card'
  className?: string
}) {
  return null
}
