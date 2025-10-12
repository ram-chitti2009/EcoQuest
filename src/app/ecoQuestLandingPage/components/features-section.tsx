"use client"

import { fadeInClasses, slideUpClasses, useIntersectionAnimation } from "../hooks/useIntersectionAnimation"
import { FeatureCard } from "./feature-card"

export function FeaturesSection() {
  const { elementRef, isVisible } = useIntersectionAnimation({
    threshold: 0.1,
    rootMargin: "0px 0px -150px 0px"
  })

  const features = [
    {
      image: "/carbonTracker.png",
      title: "Impact Tracking",
      description: "Visualize your environmental impact with real-time metrics and insights.",
    },
    {
      image: "/communityCleanup.png",
      title: "Global Community",
      description: "Connect with millions of eco-warriors worldwide and share your journey.",
    },
    {
      image: "/badges.png",
      title: "Rewards & Badges",
      description: "Earn achievements and unlock exclusive rewards as you progress.",
    },
    {
      image: "/leaderboard.png",
      title: "Leaderboards",
      description: "Compete with friends and climb the ranks in weekly sustainability challenges.",
    },
    {
      image: "/educationalContent.png",
      title: "Educational Content",
      description: "Learn about sustainability through curated articles, videos, and expert tips.",
    },
  ]

  return (
    <section 
      ref={elementRef}
      id="features" 
      className="py-24 bg-gray-50 dark:bg-gray-800/50 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-16 ${slideUpClasses(isVisible)}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 text-balance">
            Everything You Need to Make a Difference
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-pretty">
            Powerful features designed to make sustainability engaging, measurable, and rewarding.
          </p>
        </div>

        {/* Feature Grid - Upside Down Pyramid Layout */}
        <div className={`${fadeInClasses(isVisible)}`}>
          {/* Top Row - 3 Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {features.slice(0, 3).map((feature, index) => (
              <div
                key={index}
                className={`transform transition-all duration-700 ease-out ${
                  isVisible 
                    ? `translate-y-0 opacity-100 delay-${Math.min(index * 100, 500)}` 
                    : 'translate-y-8 opacity-0'
                }`}
              >
                <FeatureCard
                  image={feature.image}
                  title={feature.title}
                  description={feature.description}
                  delay={index * 0.1}
                />
              </div>
            ))}
          </div>

          {/* Bottom Row - 2 Features Centered */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {features.slice(3, 5).map((feature, index) => (
              <div
                key={index + 3}
                className={`transform transition-all duration-700 ease-out ${
                  isVisible 
                    ? `translate-y-0 opacity-100 delay-${Math.min((index + 3) * 100, 500)}` 
                    : 'translate-y-8 opacity-0'
                }`}
              >
                <FeatureCard
                  image={feature.image}
                  title={feature.title}
                  description={feature.description}
                  delay={(index + 3) * 0.1}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
