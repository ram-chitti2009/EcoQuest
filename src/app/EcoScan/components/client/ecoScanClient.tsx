"use client"

import Header from "@/app/components/Header"
import { createClient } from "@/utils/supabase/client"
import { getUserProfileByUserId } from "@/utils/supabase/functions"
import { BarChart3, Camera, Sparkles, TrendingUp, Zap } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { LitterLensCamera } from "../ui/litter-lens-camera"

export default function HomePage() {
  const [isLensActive, setIsLensActive] = useState(false)
  const [userName, setUserName] = useState("User")
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createClient()

  // Fetch user profile data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        const userId = user?.id
        
        if (userId) {
          const profileResult = await getUserProfileByUserId(userId)
          if (profileResult.data) {
            setUserName(profileResult.data.name || "User")
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        setUserName("User")
      } finally {
        setIsLoading(false)
      }
    }
    fetchUserData()
  }, [])

  return (
    <>
      {isLensActive ? (
        <LitterLensCamera onClose={() => setIsLensActive(false)} />
      ) : (
        <div
          style={{
            minHeight: "100vh",
            background: "linear-gradient(to bottom, #f8fdf9 0%, #ffffff 50%, #f0fdf4 100%)",
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-10%",
              right: "-5%",
              width: "600px",
              height: "600px",
              background: "radial-gradient(circle, rgba(34, 197, 94, 0.08) 0%, transparent 70%)",
              borderRadius: "50%",
              filter: "blur(60px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-10%",
              left: "-5%",
              width: "500px",
              height: "500px",
              background: "radial-gradient(circle, rgba(16, 185, 129, 0.06) 0%, transparent 70%)",
              borderRadius: "50%",
              filter: "blur(60px)",
            }}
          />

          <Header title="EcoScan" centerMessage="AI-powered litter detection and environmental impact tracking" />

          <main style={{ position: "relative", zIndex: 1 }}>
            <section
              style={{
                padding: "120px 32px 80px",
                maxWidth: "1200px",
                margin: "0 auto",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 16px",
                  background: "rgba(34, 197, 94, 0.1)",
                  border: "1px solid rgba(34, 197, 94, 0.2)",
                  borderRadius: "100px",
                  marginBottom: "32px",
                }}
              >
                <Sparkles style={{ width: "16px", height: "16px", color: "#22c55e" }} />
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#166534",
                    letterSpacing: "0.02em",
                  }}
                >
                  AI-POWERED ENVIRONMENTAL IMPACT
                </span>
              </div>

              <h1
                style={{
                  fontSize: "72px",
                  fontWeight: "800",
                  lineHeight: "1.1",
                  marginBottom: "24px",
                  letterSpacing: "-0.03em",
                }}
              >
                {isLoading ? (
                  "Loading..."
                ) : (
                  <>
                    <span style={{color:"#166534"}}>
                      {userName}
                    </span>
                    <span style={{ color: "#166534" }}>&apos;s EcoScan</span>
                  </>
                )}
              </h1>

              <p
                style={{
                  fontSize: "20px",
                  color: "#4b5563",
                  lineHeight: "1.7",
                  maxWidth: "680px",
                  margin: "0 auto 48px",
                  fontWeight: "400",
                }}
              >
                Use advanced computer vision to detect litter in real-time, log your cleanup efforts, and visualize your
                environmental contribution with precision analytics.
              </p>

              <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", marginBottom: "80px" }}>
                <Button
                  variant="green"
                  size="lg"
                  icon={<Camera style={{ width: "22px", height: "22px" }} />}
                  onClick={() => setIsLensActive(true)}
                >
                  Launch EcoScan
                </Button>
                <Button variant="secondary" size="lg" icon={<BarChart3 style={{ width: "22px", height: "22px" }} />}>
                  View Analytics
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-32">
              {[
                {
                  label: "Items Scanned",
                  value: "127.4K",
                  change: "+23%",
                  icon: Camera,
                  gradient: "from-blue-500 to-cyan-500"
                },
                {
                  label: "CO₂ Offset",
                  value: "8.2T",
                  change: "+18%",
                  icon: TrendingUp,
                  gradient: "from-emerald-500 to-teal-500"
                },
                {
                  label: "Global Users",
                  value: "2,847",
                  change: "+31%",
                  icon: Zap,
                  gradient: "from-violet-500 to-purple-500"
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="group relative p-8 bg-white border border-gray-200 rounded-3xl shadow-md hover:shadow-xl transition-all duration-500 hover:scale-105 overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                  <div className="relative space-y-6">
                    <div className="flex items-start justify-between">
                      <div className={`p-3.5 bg-gradient-to-br ${stat.gradient} rounded-2xl shadow-lg`}>
                        <stat.icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                        <span className="text-sm font-semibold text-emerald-600">{stat.change}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-5xl font-black tracking-tight text-black">
                        {stat.value}
                      </div>
                      <div className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            </section>
          </main>
        </div>
      )}
    </>
  )
}
