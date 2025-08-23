import type React from "react"
import { cn } from "../../lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
}

export function Progress({ className, value, max = 100, ...props }: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className={cn("relative w-full overflow-hidden rounded-full bg-emerald-100", className)} {...props}>
      <div
        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}
