"use client"
import { useState, useRef, type MouseEvent } from "react"
import Image from "next/image"

interface FeatureCardProps {
  image: string
  title: string
  description: string
  delay?: number
}

export function FeatureCard({ image, title, description, delay = 0 }: FeatureCardProps) {
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateXValue = ((y - centerY) / centerY) * -10
    const rotateYValue = ((x - centerX) / centerX) * 10

    setRotateX(rotateXValue)
    setRotateY(rotateYValue)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
    setIsHovered(false)
  }

  return (
    <div
      ref={cardRef}
      style={{
        opacity: 0,
        animation: `fadeInUp 0.8s ease-out ${delay}s forwards`,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 overflow-hidden"
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) ${
            isHovered ? "scale(1.02)" : "scale(1)"
          }`,
          transition: "transform 0.1s ease-out, box-shadow 0.3s ease, border-color 0.3s ease",
          boxShadow: isHovered ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)" : "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          borderColor: isHovered ? "rgb(16, 185, 129)" : "",
        }}
      >
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(52, 211, 153, 0.1))",
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        />

        <div className="relative z-10">
          <div
            className="w-full h-[200px] rounded-xl overflow-hidden mb-6 relative"
            style={{
              transform: isHovered ? "scale(1.05)" : "scale(1)",
              transition: "transform 0.3s ease",
            }}
          >
            <Image src={image || "/placeholder.svg"} alt={title} fill style={{ objectFit: "cover" }} />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">{title}</h3>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
