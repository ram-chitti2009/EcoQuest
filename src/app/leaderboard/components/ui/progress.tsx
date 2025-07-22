"use client"

import { useEffect, useState } from "react"

interface ProgressProps {
  value: number
  className?: string
  color?: "green" | "blue" | "purple" | "orange" | "pink"
}

export function Progress({ value, className = "", color = "green" }: ProgressProps) {
  const [animatedValue, setAnimatedValue] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value)
    }, 100)
    return () => clearTimeout(timer)
  }, [value])

  const colorClasses = {
    green: "from-green-400 to-emerald-500",
    blue: "from-blue-400 to-cyan-500",
    purple: "from-purple-400 to-pink-500",
    orange: "from-orange-400 to-red-500",
    pink: "from-pink-400 to-rose-500",
  }

  return (
    <div className={`w-full bg-gray-200 rounded-full h-3 overflow-hidden ${className}`}>
      <div
        className={`h-full bg-gradient-to-r ${colorClasses[color]} transition-all duration-1000 ease-out rounded-full shadow-sm`}
        style={{ width: `${Math.min(animatedValue, 100)}%` }}
      />
    </div>
  )
}
