import { CheckCircle2, Leaf, TrendingUp, X } from "lucide-react"
import { useEffect, useState } from "react"

interface ConfirmationModalProps {
  label: string
  co2Saved: number
  onClose: () => void
}

export function ConfirmationModal({ label, co2Saved, onClose }: ConfirmationModalProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(true)
    const timer = setTimeout(() => {
      setShow(false)
      setTimeout(onClose, 300)
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <>
      <style>{`
        @keyframes modal-in {
          from { transform: scale(0.8) translateY(20px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes modal-out {
          from { transform: scale(1) translateY(0); opacity: 1; }
          to { transform: scale(0.8) translateY(20px); opacity: 0; }
        }
        @keyframes check-draw {
          0% { stroke-dashoffset: 100; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }
        .modal-animate-in {
          animation: modal-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .modal-animate-out {
          animation: modal-out 0.3s ease-in;
        }
      `}</style>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
        <div
          className={`relative bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-emerald-500/30 rounded-3xl shadow-2xl shadow-emerald-500/20 max-w-md w-full overflow-hidden ${
            show ? 'modal-animate-in' : 'modal-animate-out'
          }`}
        >
          <button
            onClick={() => {
              setShow(false)
              setTimeout(onClose, 300)
            }}
            className="absolute top-4 right-4 p-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-lg transition-colors z-10"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>

          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 animate-pulse" />

          <div className="p-8 flex flex-col items-center gap-6 relative">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/50">
                <CheckCircle2 className="w-14 h-14 text-white" strokeWidth={3} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full animate-ping opacity-20" />

              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    background: `linear-gradient(135deg, rgb(34, 197, 94), rgb(20, 184, 166))`,
                    top: '50%',
                    left: '50%',
                    animation: `confetti 1s ease-out ${i * 0.1}s`,
                    transform: `rotate(${i * 60}deg) translate(40px)`,
                  }}
                />
              ))}
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-3xl font-black text-white">
                Success!
              </h3>
              <p className="text-slate-300 text-lg">
                Item logged successfully
              </p>
            </div>

            <div className="w-full space-y-3">
              <div className="bg-slate-800/50 border border-emerald-500/20 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg">
                    <Leaf className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Item Type</p>
                    <p className="text-white font-bold text-lg capitalize">{label}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-emerald-300 text-xs font-semibold uppercase tracking-wide">CO₂ Impact</p>
                    <p className="text-emerald-400 font-black text-2xl">{co2Saved.toFixed(3)}kg</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-emerald-400 font-bold text-sm">SAVED</p>
                </div>
              </div>
            </div>

            <p className="text-slate-400 text-sm text-center">
              Great work! Every item counts toward a cleaner planet.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
