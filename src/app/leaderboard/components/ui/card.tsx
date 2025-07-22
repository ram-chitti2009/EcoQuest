"use client"

import type React from "react"

interface CardProps {
  children: React.ReactNode
  className?: string
}

interface CardHeaderProps {
  children: React.ReactNode
  className?: string
}

interface CardContentProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden ${className}`}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return (
    <div className={`px-6 py-4 bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-100 ${className}`}>
      {children}
    </div>
  )
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>
}
