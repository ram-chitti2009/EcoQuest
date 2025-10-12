"use client"

import { useEffect, useRef, useState } from "react"

interface UseIntersectionOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export function useIntersectionAnimation(options: UseIntersectionOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = "0px 0px -100px 0px",
    triggerOnce = true
  } = options

  const [isVisible, setIsVisible] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (triggerOnce) {
            setHasTriggered(true)
          }
        } else if (!triggerOnce && !hasTriggered) {
          setIsVisible(false)
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin, triggerOnce, hasTriggered])

  return { elementRef, isVisible }
}

// Animation class utilities
export const slideUpClasses = (isVisible: boolean, delay = 0) => 
  `transform transition-all duration-1000 ease-out ${
    isVisible 
      ? `translate-y-0 opacity-100 ${delay > 0 ? `delay-${delay}` : ''}` 
      : 'translate-y-12 opacity-0'
  }`

export const slideInFromLeftClasses = (isVisible: boolean, delay = 0) =>
  `transform transition-all duration-1000 ease-out ${
    isVisible 
      ? `translate-x-0 opacity-100 ${delay > 0 ? `delay-${delay}` : ''}` 
      : '-translate-x-12 opacity-0'
  }`

export const slideInFromRightClasses = (isVisible: boolean, delay = 0) =>
  `transform transition-all duration-1000 ease-out ${
    isVisible 
      ? `translate-x-0 opacity-100 ${delay > 0 ? `delay-${delay}` : ''}` 
      : 'translate-x-12 opacity-0'
  }`

export const fadeInClasses = (isVisible: boolean, delay = 0) =>
  `transition-all duration-1000 ease-out ${
    isVisible 
      ? `opacity-100 ${delay > 0 ? `delay-${delay}` : ''}` 
      : 'opacity-0'
  }`

export const scaleInClasses = (isVisible: boolean, delay = 0) =>
  `transform transition-all duration-1000 ease-out ${
    isVisible 
      ? `scale-100 opacity-100 ${delay > 0 ? `delay-${delay}` : ''}` 
      : 'scale-95 opacity-0'
  }`