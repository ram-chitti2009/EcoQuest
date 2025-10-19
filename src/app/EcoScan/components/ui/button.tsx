"use client"

import type React from "react"

import type { ButtonHTMLAttributes, ReactNode } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "green"
  size?: "sm" | "md" | "lg"
  children: ReactNode
  icon?: ReactNode
  fullWidth?: boolean
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  icon,
  fullWidth = false,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: size === "sm" ? "8px" : size === "md" ? "10px" : "12px",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontWeight: "600",
    letterSpacing: "0.02em",
    borderRadius: "8px",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    border: "none",
    outline: "none",
    width: fullWidth ? "100%" : "auto",
    opacity: disabled ? 0.5 : 1,
  }

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: {
      padding: "10px 16px",
      fontSize: "13px",
    },
    md: {
      padding: "14px 24px",
      fontSize: "14px",
    },
    lg: {
      padding: "16px 32px",
      fontSize: "15px",
    },
  }

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
      color: "#ffffff",
      boxShadow: "0 4px 20px rgba(6, 182, 212, 0.25)",
    },
    secondary: {
      background: "rgba(15, 23, 42, 0.8)",
      color: "#ffffff",
      border: "1px solid rgba(148, 163, 184, 0.2)",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    },
    ghost: {
      background: "rgba(255, 255, 255, 0.05)",
      color: "#ffffff",
      border: "1px solid rgba(255, 255, 255, 0.1)",
    },
    green: {
      background: "#166534",
      color: "#ffffff",
      boxShadow: "0 4px 20px rgba(22, 101, 52, 0.25)",
    },
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return
    const target = e.currentTarget
    target.style.transform = "translateY(-2px)"
    if (variant === "primary") {
      target.style.boxShadow = "0 6px 28px rgba(6, 182, 212, 0.4)"
    } else if (variant === "secondary") {
      target.style.background = "rgba(15, 23, 42, 1)"
      target.style.borderColor = "rgba(148, 163, 184, 0.3)"
    } else if (variant === "green") {
      target.style.boxShadow = "0 6px 28px rgba(22, 101, 52, 0.4)"
      target.style.background = "#15803e"
    } else {
      target.style.background = "rgba(255, 255, 255, 0.1)"
    }
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return
    const target = e.currentTarget
    target.style.transform = "translateY(0)"
    if (variant === "primary") {
      target.style.boxShadow = "0 4px 20px rgba(6, 182, 212, 0.25)"
    } else if (variant === "secondary") {
      target.style.background = "rgba(15, 23, 42, 0.8)"
      target.style.borderColor = "rgba(148, 163, 184, 0.2)"
    } else if (variant === "green") {
      target.style.boxShadow = "0 4px 20px rgba(22, 101, 52, 0.25)"
      target.style.background = "#166534"
    } else {
      target.style.background = "rgba(255, 255, 255, 0.05)"
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return
    e.currentTarget.style.transform = "translateY(0) scale(0.98)"
  }

  const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return
    e.currentTarget.style.transform = "translateY(-2px) scale(1)"
  }

  return (
    <button
      style={{
        ...baseStyles,
        ...sizeStyles[size],
        ...variantStyles[variant],
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      disabled={disabled}
      {...props}
    >
      {icon && <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>}
      {children}
    </button>
  )
}
