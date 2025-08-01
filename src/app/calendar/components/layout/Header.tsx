import * as React from "react"
import { Clock, User } from "react-feather"

interface HeaderProps {
  title: string
  subtitle?: string
  children?: React.ReactNode
  className?: string
}

export function Header({ title, subtitle, children, className = "" }: HeaderProps) {
  const [currentTime, setCurrentTime] = React.useState(new Date())
  React.useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className={`bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4 ${className}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{currentTime.toLocaleTimeString([], { timeStyle: 'short' })}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>{currentTime.toLocaleDateString([], { dateStyle: 'medium' })}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600" />
          </div>
        </div>
      </div>
      {children}
    </header>
  )
}