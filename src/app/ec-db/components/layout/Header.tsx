import type React from "react"

interface HeaderProps {
  title: string
  subtitle?: string
  children?: React.ReactNode
  className?: string
}

export function Header({ title, subtitle, children, className = "" }: HeaderProps) {
  return (
    <div className={`bg-white border-b border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>Time</span>
          <span>Date</span>
        </div>
      </div>
      {children}
    </div>
  )
}