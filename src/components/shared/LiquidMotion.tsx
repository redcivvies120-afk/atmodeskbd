'use client'

import React, { useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type Transition,
} from 'motion/react'

export const LIQUID_SPRING: Transition = {
  type: 'spring',
  stiffness: 380,
  damping: 30,
  mass: 0.85,
}

export const MORPH_SPRING: Transition = {
  type: 'spring',
  stiffness: 430,
  damping: 32,
  mass: 0.8,
}

export const TACTILE_SPRING: Transition = {
  type: 'spring',
  stiffness: 520,
  damping: 26,
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
  y = 18,
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
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.55,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface LiquidGlassTiltCardProps {
  children: React.ReactNode
  className?: string
  maxTilt?: number
}

/**
 * Subtle Apple-grade 3D perspective tilt + spring press on desktop mice.
 * Zero pointer overhead on Android/iOS touch devices or reduced-motion mode.
 */
export function LiquidGlassTiltCard({
  children,
  className = '',
  maxTilt = 4,
}: LiquidGlassTiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const prefersReduced = useReducedMotion()
  const [canHover, setCanHover] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    setCanHover(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setCanHover(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [maxTilt, -maxTilt]),
    { stiffness: 300, damping: 28 }
  )
  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-maxTilt, maxTilt]),
    { stiffness: 300, damping: 28 }
  )

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canHover || prefersReduced || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const nx = (e.clientX - rect.left) / rect.width - 0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(nx)
    mouseY.set(ny)
    cardRef.current.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    cardRef.current.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <div style={{ perspective: 1100 }} className="h-full">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={
          canHover && !prefersReduced
            ? { rotateX, rotateY, transformStyle: 'preserve-3d' }
            : undefined
        }
        whileTap={prefersReduced ? undefined : { scale: 0.985 }}
        transition={TACTILE_SPRING}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  )
}
