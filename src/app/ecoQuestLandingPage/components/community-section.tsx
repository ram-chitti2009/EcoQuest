"use client"

import { slideUpClasses, useIntersectionAnimation } from "../hooks/useIntersectionAnimation"
import { Button } from "./button"

export function CommunitySection() {
  const { elementRef, isVisible } = useIntersectionAnimation({
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px"
  })

  return (
    <section 
      ref={elementRef}
      id="community" 
      className="py-24 bg-white dark:bg-gray-900 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-16 ${slideUpClasses(isVisible)}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 text-balance">
            Join a Global Movement
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-pretty">
            Connect with passionate individuals from around the world who are committed to creating a sustainable
            future.
          </p>
        </div>

        {/* Community Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              ),
              title: "Learn & Share",
              description: "Join a community of learners and share together on Learning Patch."
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              ),
              title: "Local Groups",
              description: "Find and join local environmental groups to make a direct impact in your community."
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ),
              title: "Events & Challenges",
              description: "Participate in global challenges and compete with fellow eco-warriors in Carbon Clash."
            }
          ].map((item, index) => (
            <div 
              key={index}
              className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 transform ${
                isVisible 
                  ? `translate-y-0 opacity-100 scale-100 delay-${index * 200}` 
                  : 'translate-y-8 opacity-0 scale-95'
              }`}
            >
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className={`text-center ${slideUpClasses(isVisible)}`}>
          <Button variant="outline" size="lg">
            Explore Community
          </Button>
        </div>
      </div>
    </section>
  )
}