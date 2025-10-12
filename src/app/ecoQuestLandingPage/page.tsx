"use client"

import { useTheme } from "../../contexts/ThemeContext"
import { CommunitySection } from "./components/community-section"
import { CTASection } from "./components/cta-section"
import { FeaturesSection } from "./components/features-section"
import { Footer } from "./components/footer"
import { HeroSection } from "./components/hero-section"
import { ImpactSection } from "./components/impact-section"
import { Navigation } from "./components/navigation"
import ParticleSystem from "./components/particle-system"
import { SectionTransition } from "./components/section-transition"

export default function Home() {
  const { mounted } = useTheme()

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <>
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>
      
      <main className="min-h-screen relative bg-white dark:bg-gray-900 overflow-x-hidden">
        <ParticleSystem />
        <Navigation />
        
        <HeroSection />
        
        {/* Hero to Features Transition */}
        <SectionTransition variant="wave" color="white" height="lg" />
        
        <FeaturesSection />
        
        {/* Features to Impact Transition */}
        <SectionTransition variant="curve" color="emerald" height="md" />
        
        <ImpactSection />
        
        {/* Impact to Community Transition */}
        <SectionTransition variant="diagonal" color="white" height="md" />
        
        <CommunitySection />
        
        {/* Community to CTA Transition */}
        <SectionTransition variant="geometric" color="emerald" height="lg" />
        
        <CTASection />
        
        {/* CTA to Footer Transition */}
        <SectionTransition variant="wave" color="gray" height="md" />
        
        <Footer />
      </main>
    </>
  )
}
