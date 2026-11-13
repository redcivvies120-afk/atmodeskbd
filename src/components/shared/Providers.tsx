// src/components/shared/Providers.tsx
'use client'

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { LIQUID_SPRING } from '@/components/shared/LiquidMotion'

type ToastType = 'success' | 'error' | 'info'

interface ToastMessage {
  id: string
  type: ToastType
  text: string
}

interface ToastContextType {
  toast: (text: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType>({ toast: () => {} })

export const useToast = () => useContext(ToastContext)

const TONE: Record<ToastType, { icon: typeof Info; cls: string }> = {
  success: { icon: CheckCircle2, cls: 'text-emerald-600' },
  error: { icon: AlertTriangle, cls: 'text-rose-600' },
  info: { icon: Info, cls: 'text-[#0071e3]' },
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const counter = useRef(0)

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    (text: string, type: ToastType = 'success') => {
      const id = `t${++counter.current}`
      setToasts((prev) => [...prev.slice(-2), { id, type, text }])
      window.setTimeout(() => dismiss(id), 3200)
    },
    [dismiss]
  )

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <MotionConfig reducedMotion="user">
      <ToastContext.Provider value={value}>
        {children}

        <div
          role="status"
          aria-live="polite"
          className="fixed left-0 right-0 z-[60] flex flex-col items-center gap-2 pointer-events-none px-4 bottom-[calc(env(safe-area-inset-bottom,0px)+92px)] md:bottom-6 md:left-auto md:right-6 md:items-end"
        >
          <AnimatePresence mode="popLayout">
            {toasts.map((t) => {
              const { icon: Icon, cls } = TONE[t.type]
              return (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, y: 14, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={LIQUID_SPRING}
                  className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-[#1d1d1f] glass-bright"
                >
                  <Icon className={`h-5 w-5 flex-none ${cls}`} aria-hidden="true" />
                  <span className="flex-1 leading-snug">{t.text}</span>
                  <button
                    type="button"
                    onClick={() => dismiss(t.id)}
                    className="flex-none rounded-full p-1 text-slate-400 transition hover:bg-black/5 hover:text-slate-700"
                    aria-label="Dismiss notification"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </ToastContext.Provider>
    </MotionConfig>
  )
}
