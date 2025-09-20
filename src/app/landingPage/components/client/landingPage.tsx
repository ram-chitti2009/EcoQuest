"use client"

import { createClient } from '@/utils/supabase/client'
import { ArrowRight, Award, Bot, CalendarCheck, Camera, CheckCircle, MapPin, Sparkles, Users, Zap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from "react"
import { Button } from "../ui/Button"
import { Card, CardContent } from "../ui/Card"

// Custom hook for intersection observer that only triggers once
function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsIntersecting(true)
          setHasAnimated(true)
          observer.unobserve(element) // Stop observing after first trigger
        }
      },
      {
        threshold: 0.1,
        rootMargin: '-50px',
        ...options,
      }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [hasAnimated, options])

  return { elementRef, isIntersecting }
}

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsLoggedIn(!!session)
    }
    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  // Handle button click for logged-in users
  const handleAuthButtonClick = () => {
    if (isLoggedIn) {
      // Scroll to top before navigation
      window.scrollTo({ top: 0, behavior: 'instant' })
      router.push('/dashboard')
    }
  }

  // Intersection observers for each section
  const heroSection = useIntersectionObserver()
  const howItWorksSection = useIntersectionObserver()
  const featuresSection = useIntersectionObserver()
  const testimonialSection = useIntersectionObserver()
  const ctaSection = useIntersectionObserver()

  // Refs for smooth scroll
  const heroRef = useRef<HTMLDivElement>(null)
  const howItWorksRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)

  // Scroll handlers
  const scrollToHero = (e?: React.MouseEvent) => {
    if (e) e.preventDefault()
    heroRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const scrollToHowItWorks = (e?: React.MouseEvent) => {
    if (e) e.preventDefault()
    howItWorksRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const scrollToFeatures = (e?: React.MouseEvent) => {
    if (e) e.preventDefault()
    featuresRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  useEffect(() => {
    setIsLoaded(true)
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth'
    return () => {
      document.documentElement.style.scrollBehavior = 'auto'
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 overflow-x-hidden">
      {/* Responsive Header */}
      <header
        className={`border-b-4 border-green-800 relative bg-white transition-all duration-1000 z-30 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between md:pl-0 md:pr-4">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2 -ml-4 md:-ml-20">
            <div className="w-12 h-12 md:w-16 md:h-16 relative bg-white rounded-full shadow-lg flex items-center justify-center p-2 transition-transform duration-300 hover:scale-110">
              <Image
                src="/Screenshot 2025-07-12 172658.png"
                alt="EcoQuest Logo"
                layout="fill"
                objectFit="contain"
                className="rounded-full"
                priority
              />
            </div>
            <span className="font-semibold text-gray-900 text-lg md:text-xl">EcoQuest</span>
          </div>
          {/* Navigation + Login Grouped */}
          <div className="hidden md:flex items-center space-x-8 -mr-16">
            <a href="#hero" onClick={scrollToHero} className="text-gray-900 font-bold hover:text-green-700 transition-colors duration-300 cursor-pointer">
              About
            </a>
            <a href="#how-it-works" onClick={scrollToHowItWorks} className="text-gray-900 font-bold hover:text-green-700 transition-colors duration-300 cursor-pointer">
              How It Works
            </a>
            <a href="#features" onClick={scrollToFeatures} className="text-gray-900 font-bold hover:text-green-700 transition-colors duration-300 cursor-pointer">
              Features
            </a>
            {isLoggedIn ? (
              <Button
                onClick={handleAuthButtonClick}
                size="lg"
                className="bg-green-600 hover:bg-green-700 px-6 md:px-8 py-2 ml-4 transition-all duration-300 hover:scale-105"
              >
                <span className="hidden sm:inline text-white">Start your Quests</span>
                <span className="inline sm:hidden">
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Button>
            ) : (
              <Link href="/login">
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 px-6 md:px-8 py-2 ml-4 transition-all duration-300 hover:scale-105"
                >
                  <span className="hidden sm:inline text-white">Login</span>
                  <span className="inline sm:hidden">
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </Button>
              </Link>
            )}
          </div>
        </div>
        {/* Mobile Nav: Show links and login as row below header */}
        <div className="flex md:hidden items-center justify-center gap-4 border-t border-green-100 py-2 bg-white text-sm">
          <a href="#hero" onClick={scrollToHero} className="text-gray-900 font-bold hover:text-green-700 transition-colors duration-300 cursor-pointer">
            About
          </a>
          <a href="#how-it-works" onClick={scrollToHowItWorks} className="text-gray-900 font-bold hover:text-green-700 transition-colors duration-300 cursor-pointer">
            How It Works
          </a>
          <a href="#features" onClick={scrollToFeatures} className="text-gray-900 font-bold hover:text-green-700 transition-colors duration-300 cursor-pointer">
            Features
          </a>
          {isLoggedIn ? (
            <Button
              onClick={handleAuthButtonClick}
              size="sm"
              className="bg-green-600 hover:bg-green-700 px-4 py-2 text-white transition-all duration-300 hover:scale-105"
            >
              <span className="hidden xs:inline">Start your Quests</span>
              <span className="inline xs:hidden">
                <ArrowRight className="w-4 h-4" />
              </span>
            </Button>
          ) : (
            <Link href="/login">
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 px-4 py-2 text-white transition-all duration-300 hover:scale-105"
              >
                <span className="hidden xs:inline">Login</span>
                <span className="inline xs:hidden">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <section ref={el => { heroSection.elementRef.current = el as HTMLDivElement; heroRef.current = el as HTMLDivElement }} id="hero" className="container mx-auto px-6 py-16 lg:py-24">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <div className={`space-y-8 transition-all duration-1200 ease-out ${
            heroSection.isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}>
            {/* Badge with delayed animation */}
            <div className={`inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-all duration-800 delay-200 ${
              heroSection.isIntersecting ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}>
              <Sparkles className="w-4 h-4" />
              <span>For Pennsylvania Students</span>
            </div>

            {/* Main Headline with staggered animation */}
            <h1 className={`text-5xl md:text-7xl font-bold text-gray-900 leading-tight tracking-tight transition-all duration-1000 delay-400 ${
              heroSection.isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}>
              Track your cleanups.
              <br />
              <span className="text-green-600">Compete</span> with friends.
              <br />
              <span className="text-blue-600">Help</span> your community.
            </h1>

            {/* Subheading */}
            <p className={`text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed transition-all duration-1000 delay-600 ${
              heroSection.isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}>
              Join thousands of Pennsylvania students taking climate action locally. Report environmental issues, earn
              rewards, and make a real difference in your community.
            </p>

            {/* Hero Image */}
            <div className={`relative max-w-3xl mx-auto transition-all duration-1200 delay-800 ${
              heroSection.isIntersecting ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-12"
            }`}>
              <div className="relative bg-gradient-to-br from-green-100 to-blue-100 rounded-3xl p-8 shadow-2xl shadow-green-500/10 transform hover:scale-105 transition-transform duration-500">
                <Image
                  src="/BExDE5S8ccd4NJailCsxED4r6F8sRIA51632313995.png?height=400&width=700"
                  alt="Students using EcoQuest app to track environmental cleanups"
                  width={700}
                  height={400}
                  className="w-full h-auto rounded-2xl"
                />

                {/* Floating Stats */}
                <div className={`absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl transition-all duration-1000 delay-1200 ${
                  heroSection.isIntersecting ? "opacity-100 translate-x-0 translate-y-0" : "opacity-0 translate-x-8 -translate-y-8"
                }`}>
                  <div className="text-2xl font-bold text-green-600">2,847</div>
                  <div className="text-sm text-gray-600">Items Collected</div>
                </div>

                <div className={`absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl transition-all duration-1000 delay-1400 ${
                  heroSection.isIntersecting ? "opacity-100 translate-x-0 translate-y-0" : "opacity-0 -translate-x-8 translate-y-8"
                }`}>
                  <div className="text-2xl font-bold text-blue-600">156</div>
                  <div className="text-sm text-gray-600">Active Students</div>
                </div>
              </div>
            </div>

            {/* Primary CTA with bounce effect */}
            <div className={`space-y-6 transition-all duration-1000 delay-1000 ${
              heroSection.isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-xl px-12 py-6 rounded-2xl shadow-2xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-105 group font-semibold"
              >
                Launch EcoQuest
                <ArrowRight className="ml-3 w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>

              <p className="text-sm text-gray-500">Free for all Pennsylvania students • No signup required</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section 
        ref={el => { howItWorksSection.elementRef.current = el as HTMLDivElement; howItWorksRef.current = el as HTMLDivElement }}
        id="how-it-works"
        className={`py-20 bg-gradient-to-br from-gray-50 to-green-50 relative transition-all duration-1000 ${
          howItWorksSection.isIntersecting ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className={`text-center mb-16 transition-all duration-1000 delay-200 ${
              howItWorksSection.isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                How <span className="text-green-600">EcoQuest</span> Works
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Making environmental impact simple and rewarding in just three steps
              </p>
            </div>

            {/* Steps */}
            <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
              {/* Step 1: Spot & Report */}
              <div className={`text-center transition-all duration-1000 delay-400 ${
                howItWorksSection.isIntersecting ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"
              }`}>
                <div className="relative mb-8">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg z-10">
                    1
                  </div>
                  
                  {/* Visual Card */}
                  <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-4 border-green-100">
                    <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-green-500 transition-all duration-300">
                      <Camera className="w-10 h-10 text-green-600" />
                    </div>
                    
                    {/* Mock Phone Screen */}
                    <div className="bg-gray-900 rounded-2xl p-4 mx-auto max-w-48">
                      <div className="bg-green-50 rounded-xl p-4 space-y-3">
                        <div className="w-full h-24 bg-green-200 rounded-lg flex items-center justify-center">
                          <Camera className="w-8 h-8 text-green-700" />
                        </div>
                        <div className="space-y-2">
                          <div className="h-2 bg-green-300 rounded w-3/4"></div>
                          <div className="h-2 bg-green-200 rounded w-1/2"></div>
                        </div>
                        <div className="w-full h-8 bg-green-500 rounded-lg"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Spot & Report</h3>
                <p className="text-gray-600 leading-relaxed">
                  See litter or environmental issues? Snap a photo, drop a pin on the map, and report it instantly. 
                  Your report helps build a real-time map of environmental concerns in your community.
                </p>
              </div>

              {/* Step 2: Plan & Join */}
              <div className={`text-center transition-all duration-1000 delay-600 ${
                howItWorksSection.isIntersecting ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"
              }`}>
                <div className="relative mb-8">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg z-10">
                    2
                  </div>
                  
                  {/* Visual Card */}
                  <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-4 border-blue-100">
                    <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Users className="w-10 h-10 text-blue-600" />
                    </div>
                    
                    {/* Mock Map Interface */}
                    <div className="bg-gray-900 rounded-2xl p-4 mx-auto max-w-48">
                      <div className="bg-blue-50 rounded-xl p-4 space-y-3">
                        <div className="w-full h-24 bg-blue-200 rounded-lg relative">
                          <div className="absolute top-2 left-2 w-3 h-3 bg-red-500 rounded-full"></div>
                          <div className="absolute top-4 right-3 w-3 h-3 bg-red-500 rounded-full"></div>
                          <div className="absolute bottom-3 left-1/2 w-4 h-4 bg-blue-600 rounded-full transform -translate-x-1/2"></div>
                        </div>
                        <div className="flex space-x-2">
                          <div className="flex-1 h-6 bg-blue-300 rounded"></div>
                          <div className="w-6 h-6 bg-blue-500 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Plan & Join</h3>
                <p className="text-gray-600 leading-relaxed">
                  Schedule cleanup events or join existing ones near you. Invite friends, coordinate with your school, 
                  and see exactly where help is needed most on our interactive map.
                </p>
              </div>

              {/* Step 3: Clean & Compete */}
              <div className={`text-center transition-all duration-1000 delay-800 ${
                howItWorksSection.isIntersecting ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"
              }`}>
                <div className="relative mb-8">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg z-10">
                    3
                  </div>
                  
                  {/* Visual Card */}
                  <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-4 border-purple-100">
                    <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-purple-600" />
                    </div>
                    
                    {/* Mock Achievement Screen */}
                    <div className="bg-gray-900 rounded-2xl p-4 mx-auto max-w-48">
                      <div className="bg-purple-50 rounded-xl p-4 space-y-3">
                        <div className="w-full h-16 bg-gradient-to-r from-purple-200 to-purple-300 rounded-lg flex items-center justify-center">
                          <div className="text-purple-700 font-bold text-lg">+50 XP</div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-3 bg-purple-300 rounded w-full"></div>
                          <div className="h-2 bg-purple-200 rounded w-2/3"></div>
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-6 h-6 bg-yellow-400 rounded-full"></div>
                          <div className="w-6 h-6 bg-yellow-400 rounded-full"></div>
                          <div className="w-6 h-6 bg-yellow-400 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Clean & Compete</h3>
                <p className="text-gray-600 leading-relaxed">
                  Take action and track your impact! Log items collected, earn XP, unlock achievements, 
                  and climb the leaderboard. See your real environmental impact grow over time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with section transition */}
      <section 
        ref={el => { featuresSection.elementRef.current = el as HTMLDivElement; featuresRef.current = el as HTMLDivElement }}
        id="features"
        className={`py-16 bg-white relative transition-all duration-1000 ${
          featuresSection.isIntersecting ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Section transition overlay */}
        <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-white to-white transition-all duration-1500 ${
          featuresSection.isIntersecting ? "opacity-100" : "opacity-0"
        }`} />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Section Header */}
            <div className={`text-center mb-12 transition-all duration-1000 delay-200 ${
              featuresSection.isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Everything you need to make an <span className="text-green-600">impact</span>
              </h2>
              <p className="text-lg text-gray-600">
                Simple tools that make environmental action engaging and rewarding
              </p>
            </div>

            {/* Feature Cards with staggered animation */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: MapPin,
                  title: "Report Environmental Issues",
                  description: "Snap a photo, drop a pin, and report litter or environmental concerns in your area.",
                  color: "green",
                  delay: "delay-300"
                },
                {
                  icon: CalendarCheck,
                  title: "Plan & Organize Cleanups",
                  description: "Schedule and coordinate community cleanup events with ease, inviting friends and tracking participation.",
                  color: "orange",
                  delay: "delay-500"
                },
                {
                  icon: Zap,
                  title: "Earn XP & Compete",
                  description: "Gain experience points for every cleanup and climb the leaderboard with friends.",
                  color: "blue",
                  delay: "delay-700"
                },
                {
                  icon: Bot,
                  title: "AI Environmental Advisor",
                  description: "Get personalized tips and guidance for maximizing your environmental impact.",
                  color: "purple",
                  delay: "delay-900"
                }
              ].map((feature, index) => {
                const Icon = feature.icon
                return (
                  <Card 
                    key={index}
                    className={`group cursor-pointer border-0 bg-gray-50 hover:bg-white transition-all duration-700 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-2 ${feature.delay} ${
                      featuresSection.isIntersecting ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"
                    }`}
                  >
                    <CardContent className="p-8 text-center space-y-4">
                      <div className={`w-16 h-16 ${
                        feature.color === 'green' ? 'bg-green-100 group-hover:bg-green-500' :
                        feature.color === 'orange' ? 'bg-orange-100 group-hover:bg-orange-500' :
                        feature.color === 'blue' ? 'bg-blue-100 group-hover:bg-blue-500' :
                        'bg-purple-100 group-hover:bg-purple-500'
                      } rounded-2xl flex items-center justify-center mx-auto transition-all duration-300 group-hover:scale-110`}>
                        <Icon className={`w-8 h-8 ${
                          feature.color === 'green' ? 'text-green-600' :
                          feature.color === 'orange' ? 'text-orange-600' :
                          feature.color === 'blue' ? 'text-blue-600' :
                          'text-purple-600'
                        } group-hover:text-white transition-colors duration-300`} />
                      </div>
                      <h3 className={`text-xl font-semibold text-gray-900 ${
                        feature.color === 'green' ? 'group-hover:text-green-600' :
                        feature.color === 'orange' ? 'group-hover:text-orange-600' :
                        feature.color === 'blue' ? 'group-hover:text-blue-600' :
                        'group-hover:text-purple-600'
                      } transition-colors duration-300`}>
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section 
        ref={testimonialSection.elementRef}
        className={`py-16 bg-gradient-to-br from-green-50 to-blue-50 relative transition-all duration-1200 ${
          testimonialSection.isIntersecting ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="container mx-auto px-6">
          <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 delay-300 ${
            testimonialSection.isIntersecting ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"
          }`}>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl hover:shadow-2xl transition-shadow duration-500">
              <div className={`w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 transition-all duration-800 delay-500 ${
                testimonialSection.isIntersecting ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-50 rotate-180"
              }`}>
                <Award className="w-10 h-10 text-green-600" />
              </div>

              <blockquote className={`text-2xl lg:text-3xl font-light text-gray-900 mb-8 leading-relaxed transition-all duration-1000 delay-700 ${
                testimonialSection.isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}>
                &ldquo;Our school collected over <span className="font-medium text-green-600">2,000 pieces of litter</span>{" "}
                and EcoQuest made environmental action fun and engaging for our entire student body.&rdquo;
              </blockquote>

              <div className={`flex items-center justify-center space-x-4 transition-all duration-1000 delay-900 ${
                testimonialSection.isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-medium">SJ</span>
                </div>
                <div className="text-left">
                  <cite className="text-gray-900 font-medium not-italic">Sarah Johnson</cite>
                  <div className="text-gray-600 text-sm">Environmental Coordinator</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section 
        ref={ctaSection.elementRef}
        className={`bg-gradient-to-r from-green-500 to-green-600 py-20 relative overflow-hidden transition-all duration-1200 ${
          ctaSection.isIntersecting ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Animated background elements */}
        <div className={`absolute inset-0 transition-all duration-2000 ${
          ctaSection.isIntersecting ? "opacity-20 scale-100" : "opacity-0 scale-150"
        }`}>
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-300 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className={`text-4xl lg:text-5xl font-bold text-white mb-6 transition-all duration-1000 delay-300 ${
            ctaSection.isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}>
            Ready to Start Your <span className="font-light">EcoQuest?</span>
          </h2>
          
          <p className={`text-xl text-green-100 mb-12 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-500 ${
            ctaSection.isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}>
            Join thousands of Pennsylvania students making a measurable difference in their communities. Your
            environmental journey starts with a single action.
          </p>
          
          {isLoggedIn ? (
            <Button
              onClick={handleAuthButtonClick}
              size="lg"
              className={`bg-white text-green-600 hover:bg-gray-100 rounded-2xl px-12 py-4 text-lg font-semibold transition-all duration-500 hover:scale-105 hover:shadow-2xl group ${
                ctaSection.isIntersecting ? "opacity-100 translate-y-0 delay-700" : "opacity-0 translate-y-8"
              }`}
            >
              Start Your Quest
              <ArrowRight className="ml-3 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          ) : (
            <Link href="/login">
              <Button
                size="lg"
                className={`bg-white text-green-600 hover:bg-gray-100 rounded-2xl px-12 py-4 text-lg font-semibold transition-all duration-500 hover:scale-105 hover:shadow-2xl group ${
                  ctaSection.isIntersecting ? "opacity-100 translate-y-0 delay-700" : "opacity-0 translate-y-8"
                }`}
              >
                Start Your Quest
                <ArrowRight className="ml-3 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className={`bg-gray-900 py-8 transition-all duration-1000 ${
        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 -ml-24">
              <div className="w-16 h-16 relative bg-white rounded-full shadow-lg flex items-center justify-center p-2 transition-transform duration-300 hover:scale-110">
                <Image
                  src="/Screenshot%202025-07-12%20172658.png"
                  alt="EcoQuest Logo"
                  layout="fill"
                  objectFit="contain"
                  className="rounded-full"
                  priority
                />
              </div>
              <span className="font-semibold text-white">EcoQuest</span>
            </div>
            <p className="text-gray-400 text-sm">Created by EcoQuest - 2025</p>
          </div>
        </div>
      </footer>

      {/* parallax effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 left-1/4 w-64 h-64 bg-green-200/20 rounded-full blur-3xl transition-all duration-3000 ${
          isLoaded ? "animate-pulse opacity-100" : "opacity-0"
        }`} />
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl transition-all duration-3000 delay-1000 ${
          isLoaded ? "animate-pulse opacity-100" : "opacity-0"
        }`} />
      </div>
    </div>
  )
}