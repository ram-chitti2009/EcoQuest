import type React from "react"
import { cn } from "../../lib/utils"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-emerald-100 bg-white shadow-lg hover:shadow-xl transition-shadow duration-200",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
