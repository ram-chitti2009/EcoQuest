"use client"

import type React from "react"

interface BadgeProps {
  children: React.ReactNode
  variant?: "default" | "gold" | "silver" | "bronze" | "user" | "team"
  className?: string
}

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  const variantClasses = {
    default: "bg-gray-100 text-gray-800 border-gray-200",
    gold: "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg",
    silver: "bg-gradient-to-r from-gray-300 to-gray-500 text-white shadow-lg",
    bronze: "bg-gradient-to-r from-amber-600 to-amber-800 text-white shadow-lg",
    user: "bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-md",
    team: "bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-md",
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border transition-all hover:scale-105 ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
