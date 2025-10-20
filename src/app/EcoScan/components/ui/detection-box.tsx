import { Sparkles } from "lucide-react"

interface DetectionBoxProps {
  label: string
  confidence: number
  box: { x: number; y: number; width: number; height: number }
}

export function DetectionBox({ label, confidence, box }: DetectionBoxProps) {
  return (
    <>
      <style>{`
        @keyframes border-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.6), inset 0 0 20px rgba(34, 197, 94, 0.1); }
          50% { box-shadow: 0 0 40px rgba(34, 197, 94, 0.9), inset 0 0 30px rgba(34, 197, 94, 0.2); }
        }
        @keyframes slide-in {
          from { transform: translateX(-10px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .detection-border {
          animation: border-glow 2s ease-in-out infinite;
        }
        .detection-label {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
      <div
        className="detection-border absolute border-2 border-emerald-400 rounded-lg pointer-events-none"
        style={{
          left: `${box.x}px`,
          top: `${box.y}px`,
          width: `${box.width}px`,
          height: `${box.height}px`,
        }}
      >
        <div className="detection-label absolute -top-12 left-0 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg shadow-emerald-500/50 backdrop-blur-sm border border-emerald-400/30 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>{label}</span>
          <span className="text-emerald-100 font-normal">
            {Math.round(confidence * 100)}%
          </span>
        </div>
        <div className="absolute top-0 left-0 w-3 h-3 border-t-4 border-l-4 border-emerald-400 rounded-tl" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-4 border-r-4 border-emerald-400 rounded-tr" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-4 border-l-4 border-emerald-400 rounded-bl" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-4 border-r-4 border-emerald-400 rounded-br" />
      </div>
    </>
  )
}
