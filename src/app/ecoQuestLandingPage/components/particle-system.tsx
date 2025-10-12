"use client"
import { useEffect, useRef, useState } from "react"

interface Particle {
  id: number
  delay: number
  duration: number
  x: number
  size: number
  emoji: string
}

export default function ParticleSystem() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [showParticles, setShowParticles] = useState(true)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const newParticles: Particle[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      delay: Math.random() * 5,
      duration: 15 + Math.random() * 10,
      x: Math.random() * 100,
      size: 20 + Math.random() * 40,
      emoji: i % 3 === 0 ? "🍃" : i % 3 === 1 ? "🌿" : "✨",
    }))
    setParticles(newParticles)

    // Set up intersection observer to detect when impact section is visible
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Hide particles when impact section is in view
            setShowParticles(false)
          } else {
            // Show particles when impact section is not in view
            setShowParticles(true)
          }
        })
      },
      {
        threshold: 0.3, // Trigger when 30% of the impact section is visible
        rootMargin: '0px 0px -100px 0px' // Add some margin to trigger slightly before
      }
    )

    // Find and observe the impact section
    const impactSection = document.querySelector('#impact')
    if (impactSection && observerRef.current) {
      observerRef.current.observe(impactSection)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  return (
    <>
      <div 
        className={`fixed inset-0 pointer-events-none overflow-hidden transition-opacity duration-1000 ${
          showParticles ? 'opacity-100' : 'opacity-0'
        }`} 
        style={{ zIndex: 1 }}
      >
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute opacity-30 text-emerald-500 dark:text-emerald-400"
            style={{
              left: `${particle.x}vw`,
              fontSize: particle.size,
              animation: `particle-rise ${particle.duration}s linear infinite`,
              animationDelay: `${particle.delay}s`,
            }}
          >
            {particle.emoji}
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes particle-rise {
          0% {
            transform: translateY(110vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          50% {
            opacity: 0.4;
          }
          90% {
            opacity: 0;
          }
          100% {
            transform: translateY(-10vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </>
  )
}
