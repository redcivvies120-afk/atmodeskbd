import React from 'react'

export default function AdminOrdersLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Title */}
      <div className="space-y-2">
        <div className="h-8 w-64 bg-slate-200 rounded-xl" />
        <div className="h-4 w-96 bg-slate-200/60 rounded-lg" />
      </div>

      {/* Stage Tab Badges Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="p-3 bg-white rounded-2xl border border-slate-200 space-y-2 h-20 shadow-xs">
            <div className="flex justify-between items-center">
              <div className="w-5 h-5 rounded bg-slate-100" />
              <div className="w-6 h-4 rounded-full bg-slate-200" />
            </div>
            <div className="h-3 w-20 bg-slate-200 rounded" />
          </div>
        ))}
      </div>

      {/* Orders Table Skeleton */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between">
          <div className="h-4 w-32 bg-slate-200 rounded" />
          <div className="h-4 w-24 bg-slate-200 rounded" />
        </div>
        <div className="divide-y divide-slate-100 p-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="py-4 px-4 flex items-center justify-between gap-4">
              <div className="h-4 w-28 bg-slate-200 rounded" />
              <div className="h-4 w-40 bg-slate-100 rounded" />
              <div className="h-6 w-20 bg-slate-200 rounded-full" />
              <div className="h-4 w-24 bg-slate-200 rounded" />
              <div className="h-8 w-32 bg-slate-100 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
