import { ArrowRight, Brain, Chrome as Broom, Camera, Sparkles } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "./ui/card"

export const ActionCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Log a Cleanup Card - Links to Community Cleanup */}
      <Link href="/community-cleanup" className="block">
        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 text-white hover:shadow-2xl transition-all duration-500 hover:scale-[1.03] cursor-pointer">
          {/* ...existing background decorative elements... */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors duration-500" />
          <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors duration-500" />
          
          {/* ...existing floating action indicator... */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm">
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>

          <CardContent className="relative p-6 text-center">
            {/* Icon with enhanced styling */}
            <div className="relative mb-4">
              <div className="absolute inset-0 rounded-full bg-white/10 blur-xl scale-150 group-hover:scale-200 transition-transform duration-500" />
              <div className="relative p-3 rounded-full bg-white/15 backdrop-blur-sm group-hover:bg-white/25 transition-colors duration-300 inline-block">
                <Broom className="h-7 w-7 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            
            <h3 className="text-lg font-bold mb-2 group-hover:text-xl transition-all duration-300">
              Log a Cleanup
            </h3>
            <p className="text-emerald-100 text-sm leading-relaxed group-hover:text-white transition-colors duration-300">
              Record your environmental impact and track your contribution
            </p>
            
            {/* Progress indicator */}
            <div className="mt-4 flex items-center justify-center space-x-1">
              <Sparkles className="h-3 w-3 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="h-1 w-16 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white/40 rounded-full w-0 group-hover:w-full transition-all duration-1000 delay-200" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* Scan with Litter Lens Card - Links to Litter Lens */}
      <Link href="/litterLens" className="block">
        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-teal-500 via-cyan-500 to-emerald-600 text-white hover:shadow-2xl transition-all duration-500 hover:scale-[1.03] cursor-pointer">
          {/* ...existing background decorative elements... */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute -top-8 -left-8 w-28 h-28 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors duration-500" />
          <div className="absolute -bottom-10 -right-10 w-36 h-36 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors duration-500" />
          
          {/* ...existing scanning animation effect... */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white/30 rounded-full animate-ping" />
          </div>

          {/* ...existing floating action indicator... */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm">
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>

          <CardContent className="relative p-6 text-center">
            {/* Icon with camera effect */}
            <div className="relative mb-4">
              <div className="absolute inset-0 rounded-full bg-white/10 blur-xl scale-150 group-hover:scale-200 transition-transform duration-500" />
              <div className="relative p-3 rounded-full bg-white/15 backdrop-blur-sm group-hover:bg-white/25 transition-colors duration-300 inline-block">
                <Camera className="h-7 w-7 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            
            <h3 className="text-lg font-bold mb-2 group-hover:text-xl transition-all duration-300">
              Scan with Litter Lens
            </h3>
            <p className="text-teal-100 text-sm leading-relaxed group-hover:text-white transition-colors duration-300">
              AI-powered litter detection and instant environmental insights
            </p>
            
            {/* AI indicator */}
            <div className="mt-4 flex items-center justify-center space-x-2">
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <div 
                    key={i}
                    className="w-2 h-2 rounded-full bg-white/40 group-hover:bg-white/80 transition-all duration-300 group-hover:animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
              <span className="text-xs opacity-70 group-hover:opacity-100 transition-opacity duration-300">AI Ready</span>
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* Take an Eco Quiz Card - Links to Carbon Clash */}
      <Link href="/carbon-clash" className="block">
        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 text-white hover:shadow-2xl transition-all duration-500 hover:scale-[1.03] cursor-pointer">
          {/* ...existing background decorative elements... */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors duration-500" />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors duration-500" />
          
          {/* ...existing knowledge particles effect... */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i}
                className="absolute w-1 h-1 bg-white/40 rounded-full animate-pulse"
                style={{
                  top: `${20 + i * 10}%`,
                  left: `${15 + i * 12}%`,
                  animationDelay: `${i * 200}ms`
                }}
              />
            ))}
          </div>

          {/* ...existing floating action indicator... */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm">
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>

          <CardContent className="relative p-6 text-center">
            {/* Icon with brain pulse effect */}
            <div className="relative mb-4">
              <div className="absolute inset-0 rounded-full bg-white/10 blur-xl scale-150 group-hover:scale-200 transition-transform duration-500" />
              <div className="relative p-3 rounded-full bg-white/15 backdrop-blur-sm group-hover:bg-white/25 transition-colors duration-300 inline-block">
                <Brain className="h-7 w-7 group-hover:animate-pulse transition-transform duration-300" />
              </div>
            </div>
            
            <h3 className="text-lg font-bold mb-2 group-hover:text-xl transition-all duration-300">
              Take an Eco Quiz
            </h3>
            <p className="text-green-100 text-sm leading-relaxed group-hover:text-white transition-colors duration-300">
              Test your environmental knowledge and learn something new
            </p>
            
            {/* Knowledge level indicator */}
            <div className="mt-4 flex items-center justify-center space-x-2">
              <div className="flex items-center space-x-1">
                <Sparkles className="h-3 w-3 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="text-xs opacity-70 group-hover:opacity-100 transition-opacity duration-300">Challenge Yourself</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  )
}