"use client"

import type { ReactNode } from "react"

interface StatCardProps {
  label: string
  value: string | number
  icon?: ReactNode
  variant?: "default" | "highlight"
}

export function StatCard({ label, value, icon, variant = "default" }: StatCardProps) {
  const isHighlight = variant === "highlight"

  return (
    <div
      style={{
        background: isHighlight ? "rgba(6, 182, 212, 0.1)" : "rgba(15, 23, 42, 0.6)",
        border: `1px solid ${isHighlight ? "rgba(6, 182, 212, 0.3)" : "rgba(148, 163, 184, 0.1)"}`,
        borderRadius: "12px",
        padding: "24px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        alignItems: "center",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "default",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)"
        e.currentTarget.style.borderColor = isHighlight ? "rgba(6, 182, 212, 0.5)" : "rgba(148, 163, 184, 0.2)"
        e.currentTarget.style.boxShadow = isHighlight
          ? "0 8px 24px rgba(6, 182, 212, 0.2)"
          : "0 8px 24px rgba(0, 0, 0, 0.1)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)"
        e.currentTarget.style.borderColor = isHighlight ? "rgba(6, 182, 212, 0.3)" : "rgba(148, 163, 184, 0.1)"
        e.currentTarget.style.boxShadow = "none"
      }}
    >
      {icon && (
        <div
          style={{
            color: isHighlight ? "#06b6d4" : "#64748b",
            display: "flex",
            alignItems: "center",
          }}
        >
          {icon}
        </div>
      )}
      <div
        style={{
          fontSize: "36px",
          fontWeight: "700",
          color: isHighlight ? "#06b6d4" : "#ffffff",
          letterSpacing: "-0.02em",
          lineHeight: "1",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: "11px",
          color: "#64748b",
          fontWeight: "600",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          textAlign: "center",
        }}
      >
        {label}
      </div>
    </div>
  )
}
