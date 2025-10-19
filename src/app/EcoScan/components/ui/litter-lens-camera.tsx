import { useLitterDetection } from "@/hooks/useLitterDetection"
import { Activity, Camera, Leaf, Package, Sparkles, TrendingUp, X, Zap } from "lucide-react"
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
          try {
            await videoRef.current.play()
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

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => {
          track.stop()
        })
      }
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setDetectionHistory((prev) => {
        const newHistory = [...prev, { time: Date.now(), count: detections.length }]
        return newHistory.slice(-20)
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
    <div className="relative w-full h-screen bg-slate-950 flex flex-col overflow-hidden">
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 1; box-shadow: 0 0 20px rgba(34, 197, 94, 0.5); }
          50% { opacity: 0.8; box-shadow: 0 0 30px rgba(34, 197, 94, 0.8); }
        }
        @keyframes scan-line {
          0% { top: 0%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .scan-line {
          animation: scan-line 3s ease-in-out infinite;
        }
        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.1), transparent);
          background-size: 1000px 100%;
          animation: shimmer 3s infinite;
        }
        .glass-panel {
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(34, 197, 94, 0.15);
        }
        .metric-card {
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(34, 197, 94, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }
        .detection-pulse {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        /* Responsive Styles */
        @media (max-width: 768px) {
          .camera-layout {
            flex-direction: column !important;
          }
          .metrics-sidebar {
            width: 100% !important;
            max-height: 45vh !important;
            border-left: none !important;
            border-top: 1px solid rgba(34, 197, 94, 0.2) !important;
          }
          .header-content {
            flex-direction: column !important;
            gap: 0.5rem !important;
          }
          .header-buttons {
            flex-wrap: wrap !important;
            justify-content: center !important;
          }
          .header-title {
            font-size: 0.875rem !important;
          }
          .detection-indicator {
            bottom: 4rem !important;
            font-size: 0.875rem !important;
            padding: 0.5rem 1rem !important;
          }
        }
        
        @media (min-width: 769px) and (max-width: 1024px) {
          .metrics-sidebar {
            width: 18rem !important;
          }
        }
        
        @media (max-width: 640px) {
          .corner-brackets {
            display: none !important;
          }
          .glass-panel {
            padding: 0.75rem !important;
          }
          .metric-card {
            padding: 0.75rem !important;
          }
        }
      `}</style>

      {/* Enhanced Header */}
      <div className="glass-panel border-b border-emerald-500/20 flex-shrink-0 relative overflow-hidden">
        <div className="shimmer absolute inset-0 pointer-events-none" />
        <div className="header-content relative z-10 flex items-center justify-between px-6 py-4">
          <div className="header-buttons flex items-center gap-4">
            <button
              onClick={handleClose}
              className="group px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-xl text-emerald-400 font-semibold text-sm hover:from-emerald-500/30 hover:to-teal-500/30 hover:border-emerald-400/50 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-emerald-500/20"
            >
              <X className="w-4 h-4" />
              <span>Exit</span>
            </button>
            <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <div className="detection-pulse w-2 h-2 bg-emerald-400 rounded-full" />
              <span className="text-emerald-400 font-bold text-sm tracking-wide">AI VISION ACTIVE</span>
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Camera className="w-5 h-5 text-emerald-400" />
            <span className="header-title text-emerald-400 font-bold text-lg tracking-tight">EcoScan</span>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="camera-layout flex flex-1 overflow-hidden min-h-0">
        {/* Camera Viewport */}
        <div className="relative flex-1 bg-black flex items-center justify-center">
          {/* Scanning effect overlay */}
          <div className="absolute inset-0 pointer-events-none z-10">
            <div className="scan-line absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-50" />
          </div>

          {/* Corner brackets for futuristic feel */}
          <div className="corner-brackets absolute inset-4 pointer-events-none z-10">
            <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-emerald-400/60 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-emerald-400/60 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-emerald-400/60 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-emerald-400/60 rounded-br-lg" />
          </div>

          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-contain"
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />

          {detections.map((detection, index) => (
            <DetectionBox key={index} label={detection.label} confidence={detection.confidence} box={detection.box} />
          ))}

          {!isModelLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/95 backdrop-blur-sm">
              <div className="text-center flex flex-col gap-8 items-center p-8">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
                  <Zap className="absolute inset-0 m-auto w-8 h-8 text-emerald-400" />
                </div>
                <div className="flex flex-col gap-3">
                  <p className="text-emerald-400 text-xl font-bold tracking-wide">
                    INITIALIZING AI ENGINE
                  </p>
                  <p className="text-slate-400 text-sm">
                    Loading neural network detection system...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Detection count indicator */}
          {detections.length > 0 && (
            <div className="detection-indicator absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
              <div className="metric-card px-6 py-3 rounded-2xl flex items-center gap-3 detection-pulse">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-400 font-bold text-lg">
                  {detections.length} ITEM{detections.length > 1 ? "S" : ""} DETECTED
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Metrics Sidebar */}
        <div className="metrics-sidebar w-80 glass-panel border-l border-emerald-500/20 overflow-y-auto">
          <div className="p-6 flex flex-col gap-6">
            {/* Session Stats */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                <h3 className="text-emerald-400 font-bold text-sm tracking-wide uppercase">Session Stats</h3>
              </div>

              {[
                { label: "Items Logged", value: sessionCount, icon: Package, color: "emerald", gradient: "from-emerald-500 to-teal-500" },
                { label: "CO₂ Saved", value: `${totalCO2.toFixed(2)}kg`, icon: Leaf, color: "green", gradient: "from-green-500 to-emerald-500" },
                { label: "Live Detection", value: detections.length, icon: Zap, color: "teal", gradient: "from-teal-500 to-cyan-500" },
              ].map((metric, i) => (
                <div key={i} className="metric-card p-5 rounded-2xl group hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 bg-gradient-to-br ${metric.gradient} rounded-lg`}>
                      <metric.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                      {metric.label}
                    </span>
                  </div>
                  <div className={`text-3xl font-black bg-gradient-to-r ${metric.gradient} bg-clip-text text-transparent`}>
                    {metric.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Activity Graph */}
            <div className="metric-card p-5 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-300 font-bold text-sm uppercase tracking-wide">
                    Live Activity
                  </span>
                </div>
                <span className="text-slate-500 text-xs">20s</span>
              </div>
              <div className="flex items-end gap-1 h-20">
                {detectionHistory.length > 0 ? (
                  detectionHistory.map((point, i) => {
                    const maxCount = Math.max(...detectionHistory.map((p) => p.count), 1)
                    const heightPercent = (point.count / maxCount) * 100
                    return (
                      <div
                        key={i}
                        className="flex-1 rounded-t-sm transition-all duration-300 min-w-[6px]"
                        style={{
                          height: `${Math.max(heightPercent, 8)}%`,
                          background: point.count > 0
                            ? 'linear-gradient(to top, rgb(34, 197, 94), rgb(16, 185, 129))'
                            : 'rgba(71, 85, 105, 0.3)',
                        }}
                      />
                    )
                  })
                ) : (
                  <div className="w-full text-center text-slate-500 text-sm py-4">
                    Collecting data...
                  </div>
                )}
              </div>
            </div>

            {/* Action Button */}
            <Button
              variant="primary"
              size="lg"
              onClick={handleLogItem}
              disabled={detections.length === 0}
              fullWidth
              icon={<Leaf className="w-6 h-6" />}
            >
              {detections.length > 0 ? "LOG ITEM" : "SCANNING..."}
            </Button>

            {/* Status Indicator */}
            <div className={`p-4 rounded-xl border transition-all duration-300 ${
              detections.length > 0
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : 'bg-slate-800/50 border-slate-700/30'
            }`}>
              <div className="flex items-center justify-center gap-3">
                {detections.length > 0 ? (
                  <>
                    <div className="detection-pulse w-2 h-2 bg-emerald-400 rounded-full" />
                    <span className="text-emerald-400 font-bold text-sm">
                      TARGET ACQUIRED
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-slate-600 rounded-full animate-pulse" />
                    <span className="text-slate-400 font-semibold text-sm">
                      SEARCHING FOR ITEMS
                    </span>
                  </>
                )}
              </div>
            </div>
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
