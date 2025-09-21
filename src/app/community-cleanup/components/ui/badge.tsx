import type React from "react"
import { forwardRef } from "react"

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline" | "destructive"
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = "", variant = "default", children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center px-2 py-1 rounded text-xs font-medium"

    const variants = {
      default: "bg-green-100 text-green-800",
      secondary: "bg-stone-100 text-stone-800",
      outline: "border border-stone-300 text-stone-700",
      destructive: "bg-red-100 text-red-800",
    }

    return (
      <span ref={ref} className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
        {children}
      </span>
    )
  },
)

Badge.displayName = "Badge"

export { Badge }
