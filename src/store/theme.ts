// src/store/theme.ts
'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeStore {
  isDark: boolean
  toggle: () => void
  setDark: (isDark: boolean) => void
}

function updateDocumentClass(isDark: boolean) {
  if (typeof document !== 'undefined') {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
}

export const useTheme = create<ThemeStore>()(
  persist(
    (set, get) => ({
      isDark: false,

      toggle: () => {
        const next = !get().isDark
        updateDocumentClass(next)
        set({ isDark: next })
      },

      setDark: (isDark: boolean) => {
        updateDocumentClass(isDark)
        set({ isDark })
      },
    }),
    {
      name: 'atmodesk-theme',
      onRehydrateStorage: () => (state) => {
        if (state) {
          updateDocumentClass(state.isDark)
        }
      },
    }
  )
)
