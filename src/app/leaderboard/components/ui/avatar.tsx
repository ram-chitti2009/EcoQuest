"use client"

import { useState } from "react"

interface AvatarProps {
  src?: string
  alt?: string
  fallback: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export function Avatar({ src, alt, fallback, size = "md", className = "" }: AvatarProps) {
  const [imageError, setImageError] = useState(false)

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full overflow-hidden flex items-center justify-center font-semibold transition-transform hover:scale-105 ${className}`}
    >
      {src && !imageError ? (
        <img
          src={src || "/placeholder.svg"}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 flex items-center justify-center text-white font-bold">
          {fallback}
        </div>
      )}
    </div>
  )
}
