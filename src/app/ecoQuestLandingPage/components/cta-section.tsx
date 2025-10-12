"use client"

import { scaleInClasses, slideUpClasses, useIntersectionAnimation } from "../hooks/useIntersectionAnimation"
import { Button } from "./button"

export function CTASection() {
  const { elementRef, isVisible } = useIntersectionAnimation({
    threshold: 0.2,
    rootMargin: "0px 0px -50px 0px"
  })

  return (
    <section 
      ref={elementRef}
      className="py-24 bg-gradient-to-br from-emerald-100 via-teal-50 to-emerald-100 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-emerald-950/30 relative"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className={slideUpClasses(isVisible)}>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 text-balance">
            Ready to Start Your Sustainability Journey?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto text-pretty">
            Join a community of people who are committed to making a difference. Employ EcoQuest today and turn your everyday actions into
            global impact.
          </p>
        </div>
        
        <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 ${scaleInClasses(isVisible)}`}>
          <div className={`transform transition-all duration-700 ease-out ${
            isVisible ? 'translate-y-0 opacity-100 delay-300' : 'translate-y-4 opacity-0'
          }`}>
            <Button variant="primary" size="lg" pulse>
              Get Started Free
            </Button>
          </div>
          <div className={`transform transition-all duration-700 ease-out ${
            isVisible ? 'translate-y-0 opacity-100 delay-500' : 'translate-y-4 opacity-0'
          }`}>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>
        
        <div className={`transform transition-all duration-700 ease-out ${
          isVisible ? 'translate-y-0 opacity-100 delay-700' : 'translate-y-4 opacity-0'
        }`}>
        </div>
      </div>
    </section>
  )
}
