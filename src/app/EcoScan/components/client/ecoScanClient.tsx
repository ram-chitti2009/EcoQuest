"use client"

import Header from "@/app/components/Header"
import { createClient } from "@/utils/supabase/client"
import { getUserProfileByUserId } from "@/utils/supabase/functions"
import { BarChart3, Camera, Globe, Sparkles, TrendingUp } from "lucide-react"
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
                  background: "linear-gradient(135deg, #166534 0%, #22c55e 50%, #10b981 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "-0.03em",
                }}
              >
                {isLoading ? "Loading..." : `${userName}'s EcoScan`}
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

              <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
                <Button
                  variant="primary"
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

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "24px",
                  marginTop: "80px",
                  maxWidth: "900px",
                  margin: "80px auto 0",
                }}
              >
                {[
                  { label: "Items Detected", value: "10K+", icon: Camera },
                  { label: "CO₂ Prevented", value: "2.4T", icon: TrendingUp },
                  { label: "Active Users", value: "500+", icon: Globe },
                ].map((stat, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "32px 24px",
                      background: "#ffffff",
                      border: "1px solid rgba(34, 197, 94, 0.15)",
                      borderRadius: "16px",
                      boxShadow: "0 4px 24px rgba(0, 0, 0, 0.04)",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)"
                      e.currentTarget.style.boxShadow = "0 12px 40px rgba(34, 197, 94, 0.15)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)"
                      e.currentTarget.style.boxShadow = "0 4px 24px rgba(0, 0, 0, 0.04)"
                    }}
                  >
                    <stat.icon style={{ width: "32px", height: "32px", color: "#22c55e", marginBottom: "16px" }} />
                    <div
                      style={{
                        fontSize: "36px",
                        fontWeight: "700",
                        color: "#166534",
                        marginBottom: "8px",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {stat.value}
                    </div>
                    <div style={{ fontSize: "14px", color: "#6b7280", fontWeight: "500" }}>{stat.label}</div>
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
