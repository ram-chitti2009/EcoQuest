"use client"

import type React from "react"

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "ghost"
  active?: boolean
  className?: string
}

export function Button({ children, onClick, variant = "primary", active = false, className = "" }: ButtonProps) {
  const baseClasses =
    "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"

  const variantClasses = {
    primary: active
      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg transform scale-105"
      : "bg-white text-gray-700 hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-600 hover:text-white hover:shadow-lg hover:scale-105 border border-gray-200",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
  }

  return (
    <button onClick={onClick} className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </button>
  )
}
