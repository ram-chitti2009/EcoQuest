"use client"

import { getCommunityStats, getEcoEventsByCategory } from "@/utils/supabase/functions"
import { useEffect, useState } from "react"
import { slideInFromLeftClasses, slideInFromRightClasses, useIntersectionAnimation } from "../hooks/useIntersectionAnimation"

function formatCount(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1).replace(/\.0$/, "")}K`
  return value.toString()
}

export function ImpactSection() {
  const { elementRef, isVisible } = useIntersectionAnimation({
    threshold: 0.2,
    rootMargin: "0px 0px -100px 0px"
  })

  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total_carbon_saved: 0,
    total_volunteer_hours: 0,
    total_cleanups: 0,
    active_users: 0
  })

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const [communityRes, cleanupRes] = await Promise.all([
          getCommunityStats(),
          getEcoEventsByCategory('cleanup')
        ])

        if (!mounted) return

        if (communityRes && communityRes.data) {
          // prefer communityRes values but override total_cleanups with live eco_events count
          const communityData = communityRes.data
          const cleanupCount = Array.isArray(cleanupRes?.data) ? cleanupRes.data.length : communityData.total_cleanups || 0
          setStats({
            total_carbon_saved: communityData.total_carbon_saved || 0,
            total_volunteer_hours: communityData.total_volunteer_hours || 0,
            total_cleanups: cleanupCount,
            active_users: communityData.active_users || 0
          })
        } else if (cleanupRes && Array.isArray(cleanupRes.data)) {
          // fallback: use cleanup count if community stats unavailable
          setStats(prev => ({ ...prev, total_cleanups: cleanupRes.data.length }))
        }
      } catch (err) {
        console.error('Error loading community stats:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => { mounted = false }
  }, [])

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
                { value: loading ? '...' : formatCount(stats.total_carbon_saved), label: "Tons CO₂ Saved" },
                { value: loading ? '...' : formatCount(stats.total_volunteer_hours), label: "Volunteer Hours" },
                { value: 28, label: "Cleanups" },
                { value: loading ? '...' : formatCount(stats.active_users), label: "Active Users" }
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
          </div>

          {/* Visual */}
          <div className={`relative ${slideInFromRightClasses(isVisible)}`}>
            <div className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-xl">
              {/* Video impact visualization: try both /videos/ecoQuest.mp4 and /ecoQuest.mp4 (public/) */}
              <div className="w-full rounded-xl overflow-hidden bg-black flex items-center justify-center">
                <video
                  className="w-full h-auto object-contain max-h-96"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label="Impact visualization video"
                >
                  <source src="/videos/ecoQuest.mp4" type="video/mp4" />
                  <source src="/ecoQuest.mp4" type="video/mp4" />
                  {/* Fallback poster or message */}
                  Your browser does not support the video tag.
                </video>
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
