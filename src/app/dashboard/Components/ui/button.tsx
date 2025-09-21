"use client"

import type React from "react"

export const Button = ({
  children,
  className = "",
  variant = "default",
  size = "default",
  onClick,
  ...props
}: {
  children: React.ReactNode
  className?: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  onClick?: () => void
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"

  const variants = {
    default: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-lg",
    outline: "border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400",
    ghost: "text-gray-600 hover:bg-gray-100",
  }

  const sizes = {
    default: "px-4 py-2 text-sm",
    sm: "px-3 py-1.5 text-xs",
    lg: "px-6 py-3 text-base",
  }

  return (
    <button className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} onClick={onClick} {...props}>
      {children}
    </button>
  )
}
