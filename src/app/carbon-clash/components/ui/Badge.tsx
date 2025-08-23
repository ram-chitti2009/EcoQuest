import type React from "react"
import { cn } from "../../lib/utils"

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline"
  children: React.ReactNode
}

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  const variants = {
    default: "bg-emerald-600 text-white",
    secondary: "bg-emerald-100 text-emerald-800",
    outline: "border border-emerald-600 text-emerald-600 bg-transparent",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
