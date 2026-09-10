// src/components/shared/DarkModeToggle.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/store/theme'

export interface DarkModeToggleProps {
  className?: string
}

export function DarkModeToggle({ className = '' }: DarkModeToggleProps) {
  const { isDark, toggle } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className={`p-2 text-slate-700 rounded-full hover:bg-slate-100 transition flex items-center justify-center ${className}`}
        disabled
      >
        <Moon className="w-5 h-5 text-slate-600" />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`p-2 text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center cursor-pointer ${className}`}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-400 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="w-5 h-5 text-slate-700 transition-transform hover:-rotate-12" />
      )}
    </button>
  )
}
