"use client"

import { useEffect } from "react"
import { CheckCircle2, TrendingUp, X } from "lucide-react"
import { Button } from "./button"

interface ConfirmationModalProps {
  label: string
  co2Saved: number
  onClose: () => void
}

export function ConfirmationModal({ label, co2Saved, onClose }: ConfirmationModalProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 4000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "rgba(0, 0, 0, 0.85)",
        backdropFilter: "blur(12px)",
        animation: "fadeIn 0.2s ease-in",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
      onClick={onClose}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "linear-gradient(to bottom, #0f172a 0%, #1e293b 100%)",
          border: "1px solid rgba(6, 182, 212, 0.3)",
          borderRadius: "16px",
          padding: "40px 32px",
          maxWidth: "440px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
          animation: "slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "0 24px 80px rgba(0, 0, 0, 0.6), 0 0 60px rgba(6, 182, 212, 0.2)",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            width: "32px",
            height: "32px",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "6px",
            color: "#94a3b8",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"
            e.currentTarget.style.color = "#ffffff"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"
            e.currentTarget.style.color = "#94a3b8"
          }}
        >
          <X style={{ width: "16px", height: "16px" }} />
        </button>

        {/* Success Icon */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 60px rgba(6, 182, 212, 0.5), 0 8px 32px rgba(6, 182, 212, 0.3)",
              animation: "scaleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.1s backwards",
            }}
          >
            <CheckCircle2 style={{ width: "40px", height: "40px", color: "#ffffff" }} />
          </div>
        </div>

        {/* Title and Description */}
        <div
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <h3
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#ffffff",
              letterSpacing: "-0.01em",
              margin: 0,
            }}
          >
            ITEM LOGGED
          </h3>
          <p
            style={{
              fontSize: "15px",
              color: "#94a3b8",
              margin: 0,
              lineHeight: "1.6",
            }}
          >
            Successfully cleaned up:{" "}
            <span style={{ color: "#ffffff", fontWeight: "600", textTransform: "capitalize" }}>{label}</span>
          </p>
        </div>

        <div
          style={{
            background: "rgba(6, 182, 212, 0.1)",
            border: "1px solid rgba(6, 182, 212, 0.3)",
            borderRadius: "12px",
            padding: "28px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              color: "#06b6d4",
            }}
          >
            <TrendingUp style={{ width: "20px", height: "20px" }} />
            <span
              style={{
                fontSize: "12px",
                fontWeight: "600",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Environmental Impact
            </span>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "48px",
                fontWeight: "700",
                color: "#ffffff",
                letterSpacing: "-0.03em",
                lineHeight: "1",
              }}
            >
              {co2Saved}kg
            </div>
            <div
              style={{
                fontSize: "14px",
                color: "#64748b",
                marginTop: "8px",
                fontWeight: "500",
              }}
            >
              CO₂ emissions prevented
            </div>
          </div>
        </div>

        <Button variant="primary" size="lg" fullWidth onClick={onClose}>
          CONTINUE SCANNING
        </Button>
      </div>
    </div>
  )
}
