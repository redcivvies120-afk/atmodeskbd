'use client'

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'

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
  success: { icon: CheckCircle2, cls: 'text-emerald-500' },
  error: { icon: AlertTriangle, cls: 'text-rose-500' },
  info: { icon: Info, cls: 'text-sky-500' },
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
      // keep at most 3 on screen
      setToasts((prev) => [...prev.slice(-2), { id, type, text }])
      window.setTimeout(() => dismiss(id), 3200)
    },
    [dismiss]
  )

  // Stable value: consumers (every ProductCard) no longer re-render on each toast.
  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div
        role="status"
        aria-live="polite"
        className="fixed left-0 right-0 z-[60] flex flex-col items-center gap-2 pointer-events-none px-4 bottom-[calc(env(safe-area-inset-bottom,0px)+92px)] md:bottom-6 md:left-auto md:right-6 md:items-end"
      >
        {toasts.map((t) => {
          const { icon: Icon, cls } = TONE[t.type]
          return (
            <div
              key={t.id}
              className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-medium text-slate-900 animate-toast-in bg-white/80 backdrop-blur-2xl backdrop-saturate-200 shadow-[0_18px_40px_-14px_rgba(15,23,42,0.35),inset_0_1px_0_rgba(255,255,255,0.9),0_0_0_0.5px_rgba(15,23,42,0.1)]"
            >
              <Icon className={`h-5 w-5 flex-none ${cls}`} aria-hidden="true" />
              <span className="flex-1 leading-snug">{t.text}</span>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="flex-none rounded-full p-1 text-slate-400 transition hover:bg-slate-900/5 hover:text-slate-700"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
