import type React from "react"
import { forwardRef } from "react"

const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className = "", type = "text", ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={`w-full px-3 py-2 border border-stone-200 rounded-lg text-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    />
  )
})

Input.displayName = "Input"

export { Input }

