"use client"
import { type ButtonHTMLAttributes, forwardRef } from "react"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  pulse?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", pulse = false, children, ...props }, ref) => {
    const variantClasses = {
      primary: "bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600",
      secondary:
        "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600",
      outline:
        "border-2 border-emerald-600 bg-transparent text-emerald-600 hover:bg-emerald-600 hover:text-white dark:border-emerald-400 dark:text-emerald-400 dark:hover:bg-emerald-400 dark:hover:text-gray-900",
      ghost: "bg-transparent text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800",
    }

    const sizeClasses = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    }

    const pulseClass = pulse ? "animate-pulse-glow" : ""

    return (
      <>
        <button
          ref={ref}
          className={`inline-flex items-center justify-center font-medium transition-all duration-300 rounded-lg outline-none cursor-pointer border-none ${variantClasses[variant]} ${sizeClasses[size]} ${pulseClass} ${className}`}
          {...props}
        >
          {children}
        </button>
        {pulse && (
          <style jsx>{`
            @keyframes pulse-glow {
              0%,
              100% {
                box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
              }
              50% {
                box-shadow: 0 0 30px rgba(16, 185, 129, 0.6);
              }
            }
            .animate-pulse-glow {
              animation: pulse-glow 2s ease-in-out infinite;
            }
          `}</style>
        )}
      </>
    )
  },
)

Button.displayName = "Button"

export { Button }
