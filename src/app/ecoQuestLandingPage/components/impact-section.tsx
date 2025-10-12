"use client"

import { slideInFromLeftClasses, slideInFromRightClasses, useIntersectionAnimation } from "../hooks/useIntersectionAnimation"
import { Button } from "./button"

export function ImpactSection() {
  const { elementRef, isVisible } = useIntersectionAnimation({
    threshold: 0.2,
    rootMargin: "0px 0px -100px 0px"
  })

  return (
    <section
      ref={elementRef}
      id="impact"
      className="py-24 bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/20 dark:to-gray-900 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className={slideInFromLeftClasses(isVisible)}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-6">
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Real Impact</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 text-balance">
              Your Actions Create Ripples of Change
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Every challenge completed, every sustainable choice made, contributes to a larger movement. See how your
              individual actions combine with millions of others to create measurable environmental impact.
            </p>

            {/* Impact Stats */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              {[
                { value: "450K", label: "Tons CO₂ Saved" },
                { value: "2.8M", label: "Trees Planted" },
                { value: "15M", label: "Plastic Bottles Avoided" },
                { value: "890K", label: "Gallons Water Conserved" }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 transform transition-all duration-700 ease-out ${
                    isVisible 
                      ? `translate-y-0 opacity-100 delay-${300 + index * 100}` 
                      : 'translate-y-4 opacity-0'
                  }`}
                >
                  <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className={`transform transition-all duration-700 ease-out ${
              isVisible ? 'translate-y-0 opacity-100 delay-700' : 'translate-y-4 opacity-0'
            }`}>
              <Button variant="primary" size="lg">
                View Full Impact Report
              </Button>
            </div>
          </div>

          {/* Visual */}
          <div className={`relative ${slideInFromRightClasses(isVisible)}`}>
            <div className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-xl">
              {/* Placeholder for impact visualization */}
              <div className="aspect-square bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-xl flex items-center justify-center">
                <svg
                  className="w-32 h-32 text-emerald-600 dark:text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            {/* Decorative elements */}
            <div className={`absolute -top-4 -right-4 w-24 h-24 bg-teal-500/20 dark:bg-teal-500/10 rounded-full blur-2xl transform transition-all duration-1000 ease-out ${
              isVisible ? 'scale-100 opacity-100 delay-500' : 'scale-0 opacity-0'
            }`} />
            <div className={`absolute -bottom-4 -left-4 w-32 h-32 bg-emerald-500/20 dark:bg-emerald-500/10 rounded-full blur-2xl transform transition-all duration-1000 ease-out ${
              isVisible ? 'scale-100 opacity-100 delay-700' : 'scale-0 opacity-0'
            }`} />
          </div>
        </div>
      </div>
    </section>
  )
}
