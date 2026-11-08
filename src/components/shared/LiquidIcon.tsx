import type { LucideIcon } from 'lucide-react'

export type LiquidTone = 'sky' | 'indigo' | 'violet' | 'teal' | 'green' | 'amber' | 'rose' | 'slate'
export type LiquidVariant = 'glass' | 'solid' | 'frost'
export type LiquidSize = 'sm' | 'md' | 'lg' | 'xl'

interface LiquidIconProps {
  icon: LucideIcon
  tone?: LiquidTone
  /** glass = frosted tint (light bg) · solid = Apple app icon · frost = for dark bg */
  variant?: LiquidVariant
  size?: LiquidSize
  /** lift + spring on hover (also reacts to a parent with the `group` class) */
  lift?: boolean
  className?: string
}

/**
 * Apple-style liquid glass icon tile.
 * Server-component safe: no hooks, no client JS.
 *
 *   <LiquidIcon icon={Truck} tone="sky" />
 *   <LiquidIcon icon={Zap} tone="amber" variant="solid" size="lg" />
 *   <LiquidIcon icon={ShieldCheck} tone="green" variant="frost" />   // on dark
 */
export function LiquidIcon({
  icon: Icon,
  tone = 'sky',
  variant = 'glass',
  size = 'md',
  lift = false,
  className = '',
}: LiquidIconProps) {
  return (
    <span
      className={`lg-icon lg-${tone} ${className}`}
      data-v={variant}
      data-size={size}
      data-lift={lift ? '' : undefined}
      aria-hidden="true"
    >
      <Icon />
    </span>
  )
}
