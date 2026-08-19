'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

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

export function Providers({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const toast = (text: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, type, text }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3200)
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-20 md:bottom-6 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4 md:px-0">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all transform animate-fade-in flex items-center justify-between gap-3 ${
              t.type === 'error'
                ? 'bg-rose-600 text-white shadow-rose-500/20'
                : t.type === 'info'
                ? 'bg-slate-800 text-white shadow-slate-900/20'
                : 'bg-slate-900 text-white shadow-slate-900/20 border border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <span>{t.type === 'error' ? '⚠️' : t.type === 'info' ? 'ℹ️' : '✓'}</span>
              <span>{t.text}</span>
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}
              className="text-xs opacity-60 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
