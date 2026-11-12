'use client'

import React from 'react'
import { motion, useReducedMotion } from 'motion/react'

export default function Template({ children }: { children: React.ReactNode }) {
  const prefersReduced = useReducedMotion()

  if (prefersReduced) {
    return <>{children}</>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.36,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
