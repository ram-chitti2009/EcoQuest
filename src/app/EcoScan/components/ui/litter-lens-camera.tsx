"use client"

import Header from "@/app/components/Header"
import { useLitterDetection } from "@/hooks/useLitterDetection"
import { Activity, Leaf, Package, TrendingUp, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Button } from "./button"
import { ConfirmationModal } from "./confirmation-modal"
import { DetectionBox } from "./detection-box"

interface LitterLensCameraProps {
  onClose: () => void
}

export function LitterLensCamera({ onClose }: LitterLensCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [sessionCount, setSessionCount] = useState(0)
  const [totalCO2, setTotalCO2] = useState(0)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [lastDetection, setLastDetection] = useState<{ label: string; co2Saved: number } | null>(null)
  const [detectionHistory, setDetectionHistory] = useState<Array<{ time: number; count: number }>>([])

  const { detections, isModelLoaded } = useLitterDetection(videoRef, canvasRef)

  useEffect(() => {
    let currentStream: MediaStream | null = null

    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: "environment", 
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
        })
        currentStream = mediaStream
        setStream(mediaStream)
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
          // Ensure video plays
          try {
            await videoRef.current.play()
            console.log("Camera started successfully")
          } catch (playError) {
            console.error("Video play error:", playError)
          }
        }
      } catch (error) {
        console.error("Camera access error:", error)
        alert("Unable to access camera. Please make sure you've granted camera permissions.")
      }
    }

    startCamera()

    // Cleanup function to stop camera when component unmounts
    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => {
          track.stop()
          console.log("Camera track stopped")
        })
      }
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setDetectionHistory((prev) => {
        const newHistory = [...prev, { time: Date.now(), count: detections.length }]
        return newHistory.slice(-20) // Keep last 20 data points
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [detections.length])

  const handleLogItem = () => {
    if (detections.length > 0) {
      const detection = detections[0]
      const co2Saved = getCO2Savings(detection.label)
      setLastDetection({ label: detection.label, co2Saved })
      setSessionCount((prev) => prev + 1)
      setTotalCO2((prev) => prev + co2Saved)
      setShowConfirmation(true)
    }
  }

  const handleClose = () => {
    // Stop all camera tracks before closing
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop()
      })
    }
    if (videoRef.current?.srcObject) {
      const videoStream = videoRef.current.srcObject as MediaStream
      videoStream.getTracks().forEach((track) => {
        track.stop()
      })
      videoRef.current.srcObject = null
    }
    onClose()
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflow: "hidden",
      }}
    >
      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .camera-layout {
            flex-direction: column !important;
          }
          .metrics-sidebar {
            flex: 0 0 auto !important;
            width: 100% !important;
            max-height: 40vh !important;
            border-left: none !important;
            border-top: 1px solid rgba(34, 197, 94, 0.15) !important;
          }
          .camera-viewport {
            flex: 1 !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .metrics-sidebar {
            flex: 0 0 280px !important;
          }
        }
      `}</style>
      <Header title="EcoScan" centerMessage="🔍 AI-powered real-time detection active" />
      
      <div
        style={{
          background: "linear-gradient(to bottom, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.85) 100%)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(34, 197, 94, 0.15)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={handleClose}
              style={{
                padding: "6px 12px",
                background: "rgba(34, 197, 94, 0.1)",
                border: "1px solid rgba(34, 197, 94, 0.3)",
                borderRadius: "8px",
                color: "#166534",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(34, 197, 94, 0.15)"
                e.currentTarget.style.borderColor = "rgba(34, 197, 94, 0.4)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(34, 197, 94, 0.1)"
                e.currentTarget.style.borderColor = "rgba(34, 197, 94, 0.3)"
              }}
            >
              ← Back
            </button>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    background: "#22c55e",
                    borderRadius: "50%",
                    boxShadow: "0 0 8px rgba(34, 197, 94, 0.6)",
                    animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                  }}
                />
                <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
                <span
                  style={{
                    color: "#22c55e",
                    fontSize: "13px",
                    fontWeight: "600",
                    letterSpacing: "0.03em",
                  }}
                >
                  SCANNING ACTIVE
                </span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" icon={<X style={{ width: "18px", height: "18px" }} />} onClick={handleClose}>
            CLOSE
          </Button>
        </div>
      </div>

      {/* Main content area with camera and metrics side by side */}
      <div
        className="camera-layout"
        style={{
          display: "flex",
          flexDirection: "row",
          flex: 1,
          overflow: "hidden",
          minHeight: 0,
        }}
      >
        {/* Camera viewport - takes up most of the space */}
        <div
          className="camera-viewport"
          style={{
            position: "relative",
            flex: 1,
            background: "#000000",
            minHeight: 0,
            minWidth: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}
          />

          {detections.map((detection, index) => (
            <DetectionBox key={index} label={detection.label} confidence={detection.confidence} box={detection.box} />
          ))}

          {!isModelLoaded && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255, 255, 255, 0.98)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                  alignItems: "center",
                  padding: "32px",
                }}
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    border: "4px solid rgba(34, 197, 94, 0.2)",
                    borderTop: "4px solid #22c55e",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <p
                    style={{
                      color: "#166534",
                      fontSize: "16px",
                      fontWeight: "700",
                      margin: 0,
                      letterSpacing: "0.01em",
                    }}
                  >
                    INITIALIZING AI MODEL
                  </p>
                  <p style={{ color: "#6b7280", fontSize: "13px", margin: 0 }}>
                    Loading TensorFlow.js detection system...
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Metrics sidebar - takes up remaining space on right, hidden on mobile */}
        <div
          className="metrics-sidebar"
          style={{
            flex: "0 0 320px",
            background: "linear-gradient(to bottom, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.92) 100%)",
            backdropFilter: "blur(16px)",
            borderLeft: "1px solid rgba(34, 197, 94, 0.15)",
            overflowY: "auto",
            position: "relative",
          }}
        >
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {[
              { label: "Items Logged", value: sessionCount, icon: Package, color: "#22c55e" },
              { label: "CO₂ Saved", value: `${totalCO2.toFixed(2)}kg`, icon: TrendingUp, color: "#10b981" },
              { label: "Detected Now", value: detections.length, icon: Activity, color: "#059669" },
            ].map((metric, i) => (
              <div
                key={i}
                style={{
                  padding: "16px",
                  background: "#ffffff",
                  border: "1px solid rgba(34, 197, 94, 0.15)",
                  borderRadius: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                  position: "relative",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <metric.icon style={{ width: "16px", height: "16px", color: metric.color }} />
                  <span style={{ fontSize: "11px", color: "#6b7280", fontWeight: "600", textTransform: "uppercase" }}>
                    {metric.label}
                  </span>
                </div>
                <div style={{ fontSize: "24px", fontWeight: "700", color: "#166534", letterSpacing: "-0.01em" }}>
                  {metric.value}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              padding: "20px",
              background: "#ffffff",
              border: "1px solid rgba(34, 197, 94, 0.15)",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#6b7280", textTransform: "uppercase" }}>
                Detection Activity
              </span>
              <span style={{ fontSize: "11px", color: "#9ca3af" }}>Last 20 seconds</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: "4px",
                height: "60px",
                justifyContent: "space-between",
              }}
            >
              {detectionHistory.length > 0 ? (
                detectionHistory.map((point, i) => {
                  const maxCount = Math.max(...detectionHistory.map((p) => p.count), 1)
                  const heightPercent = (point.count / maxCount) * 100
                  return (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: `${Math.max(heightPercent, 5)}%`,
                        background: point.count > 0 ? "linear-gradient(to top, #22c55e, #10b981)" : "#e5e7eb",
                        borderRadius: "2px 2px 0 0",
                        transition: "height 0.3s ease",
                        minWidth: "8px",
                      }}
                    />
                  )
                })
              ) : (
                <div style={{ width: "100%", textAlign: "center", color: "#9ca3af", fontSize: "13px" }}>
                  Collecting data...
                </div>
              )}
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={handleLogItem}
            disabled={detections.length === 0}
            fullWidth
            icon={<Leaf style={{ width: "20px", height: "20px" }} />}
          >
            {detections.length > 0 ? "LOG THIS ITEM" : "NO ITEMS DETECTED"}
          </Button>

          {detections.length > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "10px",
                background: "rgba(34, 197, 94, 0.1)",
                border: "1px solid rgba(34, 197, 94, 0.2)",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  background: "#22c55e",
                  borderRadius: "50%",
                  boxShadow: "0 0 8px rgba(34, 197, 94, 0.6)",
                }}
              />
              <span style={{ color: "#166534", fontSize: "13px", fontWeight: "600" }}>
                {detections.length} ITEM{detections.length > 1 ? "S" : ""} IN VIEW
              </span>
            </div>
          )}
        </div>
        </div>
      </div>

      {showConfirmation && lastDetection && (
        <ConfirmationModal
          label={lastDetection.label}
          co2Saved={lastDetection.co2Saved}
          onClose={() => setShowConfirmation(false)}
        />
      )}
    </div>
  )
}

function getCO2Savings(label: string): number {
  const co2Database: Record<string, number> = {
    bottle: 0.082,
    cup: 0.011,
    can: 0.17,
    plastic: 0.05,
    paper: 0.015,
    cardboard: 0.02,
  }

  const normalizedLabel = label.toLowerCase()
  for (const [key, value] of Object.entries(co2Database)) {
    if (normalizedLabel.includes(key)) {
      return value
    }
  }

  return 0.025
}
