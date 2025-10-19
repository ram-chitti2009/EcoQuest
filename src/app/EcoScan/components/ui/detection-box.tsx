"use client"

interface DetectionBoxProps {
  label: string
  confidence: number
  box: { x: number; y: number; width: number; height: number }
}

export function DetectionBox({ label, confidence, box }: DetectionBoxProps) {
  return (
    <div
      style={{
        position: "absolute",
        left: `${box.x}%`,
        top: `${box.y}%`,
        width: `${box.width}%`,
        height: `${box.height}%`,
        border: "2px solid #06b6d4",
        borderRadius: "4px",
        boxShadow: "0 0 20px rgba(6, 182, 212, 0.4), inset 0 0 20px rgba(6, 182, 212, 0.1)",
        animation: "fadeIn 0.2s ease-in",
        pointerEvents: "none",
      }}
    >
      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
      <div
        style={{
          position: "absolute",
          top: "-32px",
          left: "0",
          background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
          padding: "6px 12px",
          borderRadius: "4px",
          fontSize: "12px",
          fontWeight: "600",
          color: "#ffffff",
          letterSpacing: "0.02em",
          whiteSpace: "nowrap",
          boxShadow: "0 4px 12px rgba(6, 182, 212, 0.4)",
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        {label.toUpperCase()} · {Math.round(confidence * 100)}%
      </div>
    </div>
  )
}
