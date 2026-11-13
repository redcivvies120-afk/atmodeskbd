// src/components/shared/LiquidMotion.tsx
'use client'

import React from 'react'
import { motion, useReducedMotion, type Transition } from 'motion/react'

export const LIQUID_SPRING: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 32,
  mass: 0.85,
}

export const MORPH_SPRING: Transition = {
  type: 'spring',
  stiffness: 440,
  damping: 34,
  mass: 0.8,
}

export const TACTILE_SPRING: Transition = {
  type: 'spring',
  stiffness: 520,
  damping: 28,
  mass: 0.6,
}

interface LiquidRevealProps {
  children: React.ReactNode
  delay?: number
  y?: number
  className?: string
}

export function LiquidReveal({
  children,
  delay = 0,
  y = 14,
  className = '',
}: LiquidRevealProps) {
  const prefersReduced = useReducedMotion()

  if (prefersReduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: 0.45,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
