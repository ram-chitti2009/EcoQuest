import type React from "react"
import { cn } from "../../lib/utils"

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive"
  children: React.ReactNode
}

export function Alert({ className, variant = "default", children, ...props }: AlertProps) {
  const variants = {
    default: "border-emerald-200 bg-emerald-50 text-emerald-800",
    destructive: "border-red-200 bg-red-50 text-red-800",
  }

  return (
    <div className={cn("relative w-full rounded-lg border p-4", variants[variant], className)} {...props}>
      {children}
    </div>
  )
}

export function AlertTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h5 className={cn("mb-1 font-medium leading-none tracking-tight", className)} {...props}>
      {children}
    </h5>
  )
}

export function AlertDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <div className={cn("text-sm [&_p]:leading-relaxed", className)} {...props}>
      {children}
    </div>
  )
}
