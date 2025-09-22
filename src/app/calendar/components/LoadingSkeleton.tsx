import React from 'react'

export function CalendarSkeleton() {
  return (
    <div className="grid grid-cols-7 gap-2">
      {Array.from({ length: 42 }, (_, index) => (
        <div 
          key={index} 
          className="h-14 w-14 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl animate-pulse"
          style={{ animationDelay: `${index * 20}ms` }}
        />
      ))}
    </div>
  )
}

export function EventCardSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((index) => (
        <div 
          key={index}
          className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200 animate-pulse"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="h-6 bg-emerald-200 rounded-lg w-3/4"></div>
            <div className="h-6 bg-emerald-200 rounded-full w-16"></div>
          </div>
          <div className="h-4 bg-emerald-100 rounded w-full mb-2"></div>
          <div className="h-4 bg-emerald-100 rounded w-2/3 mb-3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-emerald-100 rounded w-1/2"></div>
            <div className="h-4 bg-emerald-100 rounded w-3/4"></div>
            <div className="h-4 bg-emerald-100 rounded w-1/3"></div>
          </div>
        </div>
      ))}
    </div>
  )
}