"use client"

export default function LoadingScreen({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black pointer-events-auto" style={{ minHeight: '100vh', minWidth: '100vw' }}>
      <div className="flex flex-col items-center">
        {/* Animated Arrow Image */}
        <div className="relative mb-8">
          {/* Base logo (teal background + white arrow) */}
          <img src="/Screenshot 2025-07-12 172658.png" alt="Loading arrow" className="w-56 h-56 animate-pulse-scale" />

          {/* Black arrow overlay that gets clipped away to reveal white */}
          <div className="absolute inset-0">
            <div
              className="w-56 h-56 animate-fill-reveal"
              style={{
                backgroundImage: `url(/Screenshot 2025-07-12 172658.png)`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                filter: "brightness(0)",
              }}
            />
          </div>

          {/* Rotating overlay for extra animation */}
          <div className="absolute inset-0 animate-spin-slow opacity-20">
            <img src="/Screenshot 2025-07-12 172658.png" alt="Loading arrow overlay" className="w-56 h-56" />
          </div>
        </div>

        {/* Loading text */}
        <div className="text-center">
          <span className="text-white text-xl font-semibold tracking-wide">{message}</span>
          <div className="flex justify-center mt-3 space-x-1">
            <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulseScale {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }
        
        @keyframes fillReveal {
          0% {
            clip-path: polygon(0% 100%, 0% 100%, 0% 100%, 0% 100%);
          }
          100% {
            clip-path: polygon(0% 100%, 100% 0%, 100% 0%, 0% 100%);
          }
        }
        
        .animate-pulse-scale {
          animation: pulseScale 2s ease-in-out infinite;
        }
        
        .animate-fill-reveal {
          animation: fillReveal 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
