"use client"

import { ChevronDown, ChevronUp, Droplets, Eye, History, Leaf, Sparkles, TrendingUp, Wind } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import Header from "../components/Header"
import SideBar from "../components/Sidebar"
import EcoSimMap from "./components/EcoSimMap"
import { getRegionMetrics } from "./lib/functions"

type ViewMode = "live" | "compare"
type TimePeriod = "week" | "month" | "180days" | "year"

const mockEvents = [
  {
    id: 1,
    date: "2025-01-10",
    type: "cleanup",
    description: "Beach Cleanup Event",
    impact: { trash: -2.5, cleanliness: +15 },
    daysAgo: 3,
  },
  {
    id: 2,
    date: "2025-01-09",
    type: "tree",
    description: "Community Tree Planting",
    impact: { greenery: +8, carbon: -1.2 },
    daysAgo: 4,
  },
  {
    id: 3,
    date: "2025-01-08",
    type: "volunteer",
    description: "Park Maintenance",
    impact: { cleanliness: +10, greenery: +5 },
    daysAgo: 5,
  },
  {
    id: 4,
    date: "2025-01-05",
    type: "cleanup",
    description: "Street Cleanup Initiative",
    impact: { trash: -1.8, cleanliness: +12 },
    daysAgo: 8,
  },
  {
    id: 5,
    date: "2025-01-03",
    type: "tree",
    description: "Urban Forest Expansion",
    impact: { greenery: +12, carbon: -2.1 },
    daysAgo: 10,
  },
  {
    id: 6,
    date: "2024-12-28",
    type: "volunteer",
    description: "River Restoration",
    impact: { cleanliness: +18, carbon: -0.8 },
    daysAgo: 16,
  },
  {
    id: 7,
    date: "2024-12-20",
    type: "cleanup",
    description: "Highway Cleanup Drive",
    impact: { trash: -3.2, cleanliness: +20 },
    daysAgo: 24,
  },
  {
    id: 8,
    date: "2024-12-15",
    type: "tree",
    description: "Winter Tree Planting",
    impact: { greenery: +6, carbon: -0.9 },
    daysAgo: 29,
  },
  {
    id: 9,
    date: "2024-11-30",
    type: "volunteer",
    description: "Community Garden Setup",
    impact: { greenery: +15, cleanliness: +8 },
    daysAgo: 44,
  },
  {
    id: 10,
    date: "2024-11-20",
    type: "cleanup",
    description: "Fall Cleanup Campaign",
    impact: { trash: -2.1, cleanliness: +14 },
    daysAgo: 54,
  },
  {
    id: 11,
    date: "2024-10-15",
    type: "tree",
    description: "Autumn Reforestation",
    impact: { greenery: +20, carbon: -3.5 },
    daysAgo: 90,
  },
  {
    id: 12,
    date: "2024-09-10",
    type: "volunteer",
    description: "Wetland Conservation",
    impact: { cleanliness: +25, carbon: -1.5 },
    daysAgo: 125,
  },
  {
    id: 13,
    date: "2024-08-05",
    type: "cleanup",
    description: "Summer Beach Cleanup",
    impact: { trash: -4.0, cleanliness: +22 },
    daysAgo: 161,
  },
  {
    id: 14,
    date: "2024-07-20",
    type: "tree",
    description: "Summer Tree Initiative",
    impact: { greenery: +18, carbon: -2.8 },
    daysAgo: 177,
  },
  {
    id: 15,
    date: "2024-06-01",
    type: "volunteer",
    description: "Spring Renewal Project",
    impact: { greenery: +10, cleanliness: +16 },
    daysAgo: 226,
  },
  {
    id: 16,
    date: "2024-04-15",
    type: "cleanup",
    description: "Earth Day Cleanup",
    impact: { trash: -3.5, cleanliness: +28 },
    daysAgo: 273,
  },
  {
    id: 17,
    date: "2024-03-10",
    type: "tree",
    description: "Spring Planting Drive",
    impact: { greenery: +25, carbon: -4.2 },
    daysAgo: 309,
  },
]

export default function EcoSimPage() {
  const [regionMetrics, setRegionMetrics] = useState({
    avgTrash: 0,
    avgCleanliness: 0,
    avgGreenery: 0,
    avgCarbon: 0,
    totalCells: 0,
  })

  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>("live")
  const [isAnalyticsCollapsed, setIsAnalyticsCollapsed] = useState(false)
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("week")
  const [compareSearchQuery, setCompareSearchQuery] = useState("")
  const [isCompareSearching, setIsCompareSearching] = useState(false)
  const [currentBounds, setCurrentBounds] = useState({
    latMin: -90,
    latMax: 90,
    lngMin: -180,
    lngMax: 180,
  })

  useEffect(() => {
    console.log("[v0] Receipt component mounted")
    console.log("[v0] Filtered events count:", filteredEvents.length)
    console.log("[v0] Current time period:", timePeriod)
  }, [])

  // Calculate environmental health score
  const calculateHealthScore = () => {
    const trashScore = Math.max(0, 100 - regionMetrics.avgTrash * 10)
    const cleanScore = regionMetrics.avgCleanliness
    const greenScore = regionMetrics.avgGreenery
    const carbonScore = Math.max(0, 100 - regionMetrics.avgCarbon * 2)
    return Math.round((trashScore + cleanScore + greenScore + carbonScore) / 4)
  }

  const healthScore = calculateHealthScore()

  const getFilteredEvents = () => {
    const periodDays = {
      week: 7,
      month: 30,
      "180days": 180,
      year: 365,
    }
    return mockEvents.filter((event) => event.daysAgo <= periodDays[timePeriod])
  }

  const filteredEvents = getFilteredEvents()

  const calculateTotalImpact = () => {
    return filteredEvents.reduce(
      (acc, event) => {
        if (event.impact.trash) acc.trash += event.impact.trash
        if (event.impact.cleanliness) acc.cleanliness += event.impact.cleanliness
        if (event.impact.greenery) acc.greenery += event.impact.greenery
        if (event.impact.carbon) acc.carbon += event.impact.carbon
        return acc
      },
      { trash: 0, cleanliness: 0, greenery: 0, carbon: 0 },
    )
  }

  const totalImpact = calculateTotalImpact()

  // Function to handle bounds changes from the map
  const handleBoundsChange = useCallback(
    async (bounds: { latMin: number; latMax: number; lngMin: number; lngMax: number }) => {
      setCurrentBounds(bounds)

      try {
        setIsLoading(true)
        const metrics = await getRegionMetrics(bounds)
        if (metrics) setRegionMetrics(metrics)
      } catch (error) {
        console.error("Failed to load region metrics:", error)
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  useEffect(() => {
    async function loadInitialMetrics() {
      try {
        setIsLoading(true)
        const metrics = await getRegionMetrics(currentBounds)
        if (metrics) setRegionMetrics(metrics)
      } catch (error) {
        console.error("Failed to load region metrics:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadInitialMetrics()
  }, [currentBounds])

  // Search functionality for compare mode
  const searchLocationInCompareMode = async (query: string) => {
    if (!query.trim()) return

    setIsCompareSearching(true)
    try {
      // Use browser's built-in fetch to get the Mapbox token from environment
      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
      if (!token) {
        console.error("Mapbox token not available")
        return
      }

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${token}&limit=1`
      )
      const data = await response.json()
      
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center
        // Since we can't directly control the maps, we'll update the center prop
        // This would require modifying the component structure, so for now we'll log the coordinates
        console.log("Location found for compare mode:", { lat, lng, query })
        alert(`Found location: ${data.features[0].place_name}\nCoordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`)
      }
    } catch (error) {
      console.error("Error searching location in compare mode:", error)
    } finally {
      setIsCompareSearching(false)
    }
  }

  const handleCompareSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    searchLocationInCompareMode(compareSearchQuery)
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background:
          "linear-gradient(135deg, rgba(236, 253, 245, 1) 0%, rgba(240, 249, 255, 1) 50%, rgba(240, 253, 250, 1) 100%)",
      }}
    >
      <SideBar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header
          title="EcoSim"
          subtitle="Living Community Ecosystem"
          centerMessage="Watch your community's environmental impact grow in real-time"
        />
        <main
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            padding: "1.5rem 0", // Remove horizontal padding, keep vertical
            paddingBottom: "3rem",
            overflow: "auto",
            position: "relative",
          }}
        >
          {/* Floating background elements */}
          <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
            <div
              style={{
                position: "absolute",
                top: "5rem",
                left: "5rem",
                width: "16rem",
                height: "16rem",
                backgroundColor: "rgba(167, 243, 208, 0.2)",
                borderRadius: "9999px",
                filter: "blur(64px)",
                animation: "float 6s ease-in-out infinite",
              }}
            ></div>
            <div
              style={{
                position: "absolute",
                bottom: "5rem",
                right: "5rem",
                width: "24rem",
                height: "24rem",
                backgroundColor: "rgba(186, 230, 253, 0.2)",
                borderRadius: "9999px",
                filter: "blur(64px)",
                animation: "float 6s ease-in-out infinite 1s",
              }}
            ></div>
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "20rem",
                height: "20rem",
                backgroundColor: "rgba(153, 246, 228, 0.2)",
                borderRadius: "9999px",
                filter: "blur(64px)",
                animation: "float 6s ease-in-out infinite 2s",
              }}
            ></div>
          </div>

          <section
            style={{
              position: "relative",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minHeight: "750px",
              borderRadius: "0",
              overflow: "visible",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              animation: "grow 0.5s ease-out",
              marginBottom: "2rem",
            }}
          >
            {viewMode === "live" ? (
              // Single map view for live mode
              <div style={{ width: "100%", height: "750px", borderRadius: "0", overflow: "hidden" }}>
                <EcoSimMap onBoundsChange={handleBoundsChange} showLocationSearch={true} />
              </div>
            ) : (
              // Side-by-side comparison view
              <div style={{ width: "100%", height: "750px", display: "flex" }}>
                {/* Baseline Map (Left) */}
                <div style={{ width: "50%", height: "100%", position: "relative", borderRight: "2px solid #10b981" }}>
                  <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
                    <EcoSimMap onBoundsChange={handleBoundsChange} showLocationSearch={false} />
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: "1rem",
                      left: "1rem",
                      background: "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(10px)",
                      borderRadius: "0.5rem",
                      padding: "0.5rem 1rem",
                      fontSize: "0.875rem",
                      fontWeight: "bold",
                      color: "#1f2937",
                    }}
                  >
                    📅 Baseline (Before Impact)
                  </div>
                </div>

                {/* Community Impact Map (Right) */}
                <div style={{ width: "50%", height: "100%", position: "relative" }}>
                  <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
                    <EcoSimMap onBoundsChange={handleBoundsChange} showLocationSearch={false} />
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: "1rem",
                      left: "1rem",
                      background: "rgba(16, 185, 129, 0.9)",
                      backdropFilter: "blur(10px)",
                      borderRadius: "0.5rem",
                      padding: "0.5rem 1rem",
                      fontSize: "0.875rem",
                      fontWeight: "bold",
                      color: "#ffffff",
                    }}
                  >
                    🌱 After Community Impact ({timePeriod === "180days" ? "180 Days" : timePeriod})
                  </div>
                </div>
              </div>
            )}

            {/* Time Period Dropdown for Compare Mode */}
            {viewMode === "compare" && (
              <div
                style={{
                  position: "absolute",
                  top: "1.5rem",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "1rem",
                  padding: "0.5rem",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span style={{ fontSize: "0.875rem", fontWeight: "600", color: "#1f2937" }}>Impact Period:</span>
                <select
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(e.target.value as TimePeriod)}
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(0, 0, 0, 0.2)",
                    borderRadius: "0.5rem",
                    padding: "0.25rem 0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#1f2937",
                    cursor: "pointer",
                  }}
                >
                  <option value="week">Past Week</option>
                  <option value="month">Past Month</option>
                  <option value="180days">Past 180 Days</option>
                  <option value="year">Past Year</option>
                </select>
              </div>
            )}

            {/* View Mode Toggle */}
            <div
              style={{
                position: "absolute",
                top: "1.5rem",
                right: "1.5rem",
                background: "rgba(255, 255, 255, 0.4)",
                backdropFilter: "blur(10px)",
                borderRadius: "1rem",
                padding: "0.5rem",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.5)",
                animation: "slideUp 0.5s ease-out 0.2s both",
                zIndex: 100,
              }}
            >
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => {
                    console.log("Live button clicked!")
                    setViewMode("live")
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.75rem",
                    fontWeight: 500,
                    transition: "all 0.3s",
                    backgroundColor: viewMode === "live" ? "#10b981" : "transparent",
                    color: viewMode === "live" ? "#ffffff" : "rgba(31, 41, 55, 0.7)",
                    boxShadow: viewMode === "live" ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)" : "none",
                    transform: viewMode === "live" ? "scale(1.05)" : "scale(1)",
                    border: "none",
                    cursor: "pointer",
                    zIndex: 1000,
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    if (viewMode !== "live") {
                      e.currentTarget.style.color = "#1f2937"
                      e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.5)"
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (viewMode !== "live") {
                      e.currentTarget.style.color = "rgba(31, 41, 55, 0.7)"
                      e.currentTarget.style.backgroundColor = "transparent"
                    }
                  }}
                >
                  <Eye style={{ width: "1rem", height: "1rem" }} />
                  <span style={{ fontSize: "0.875rem" }}>Live View</span>
                </button>
                <button
                  onClick={() => {
                    console.log("Compare button clicked!")
                    setViewMode("compare")
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.75rem",
                    fontWeight: 500,
                    transition: "all 0.3s",
                    backgroundColor: viewMode === "compare" ? "#10b981" : "transparent",
                    color: viewMode === "compare" ? "#ffffff" : "rgba(31, 41, 55, 0.7)",
                    boxShadow: viewMode === "compare" ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)" : "none",
                    transform: viewMode === "compare" ? "scale(1.05)" : "scale(1)",
                    border: "none",
                    cursor: "pointer",
                    zIndex: 1000,
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    if (viewMode !== "compare") {
                      e.currentTarget.style.color = "#1f2937"
                      e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.5)"
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (viewMode !== "compare") {
                      e.currentTarget.style.color = "rgba(31, 41, 55, 0.7)"
                      e.currentTarget.style.backgroundColor = "transparent"
                    }
                  }}
                >
                  <History style={{ width: "1rem", height: "1rem" }} />
                  <span style={{ fontSize: "0.875rem" }}>Compare</span>
                </button>
              </div>
            </div>

            <div
              style={{
                position: "absolute",
                top: "1.5rem",
                left: "1.5rem",
                background: "rgba(255, 255, 255, 1)",
                backdropFilter: "blur(100px)",
                borderRadius: "1.5rem",
                padding: "1.5rem",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                minWidth: "320px",
                maxWidth: "320px",
                border: "1px solid rgba(255, 255, 255, 0.5)",
                animation: "slideUp 0.5s ease-out 0.1s both",
                transition: "all 0.3s ease",
                zIndex: 200,
              }}
            >
              {/* Header with pulse indicator and collapse button */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: isAnalyticsCollapsed ? "0" : "1.5rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        width: "0.75rem",
                        height: "0.75rem",
                        backgroundColor: "#10b981",
                        borderRadius: "9999px",
                        animation: "pulseGlow 2s ease-in-out infinite",
                      }}
                    ></div>
                  </div>
                  <div>
                    <p style={{ fontWeight: "bold", color: "#1f2937", fontSize: "1.125rem" }}>EcoSim Analytics</p>
                    {!isAnalyticsCollapsed && (
                      <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                        {(() => {
                          // Chester County bounds
                          const chesterBounds = {
                            latMin: 39.72,
                            latMax: 40.23,
                            lngMin: -76.01,
                            lngMax: -75.33,
                          };

                          // Check if viewport intersects with Chester County
                          const viewIntersectsChester = !(
                            currentBounds.latMax < chesterBounds.latMin ||
                            currentBounds.latMin > chesterBounds.latMax ||
                            currentBounds.lngMax < chesterBounds.lngMin ||
                            currentBounds.lngMin > chesterBounds.lngMax
                          );

                          // Check if viewport is entirely within Chester County
                          const viewWithinChester = (
                            currentBounds.latMin >= chesterBounds.latMin &&
                            currentBounds.latMax <= chesterBounds.latMax &&
                            currentBounds.lngMin >= chesterBounds.lngMin &&
                            currentBounds.lngMax <= chesterBounds.lngMax
                          );

                          if (viewWithinChester) {
                            return "Chester County, PA";
                          } else if (viewIntersectsChester) {
                            return "Chester County, PA + Region";
                          } else {
                            return "Current Region";
                          }
                        })()}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setIsAnalyticsCollapsed(!isAnalyticsCollapsed)}
                  style={{
                    background: "rgba(255, 255, 255, 0.5)",
                    border: "none",
                    borderRadius: "0.5rem",
                    padding: "0.5rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.8)"
                    e.currentTarget.style.transform = "scale(1.1)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.5)"
                    e.currentTarget.style.transform = "scale(1)"
                  }}
                >
                  {isAnalyticsCollapsed ? (
                    <ChevronDown style={{ width: "1.25rem", height: "1.25rem", color: "#1f2937" }} />
                  ) : (
                    <ChevronUp style={{ width: "1.25rem", height: "1.25rem", color: "#1f2937" }} />
                  )}
                </button>
              </div>

              {/* Collapsible content */}
              {!isAnalyticsCollapsed && (
                <>
                  {/* Health Score */}
                  <div
                    style={{
                      marginBottom: "1.5rem",
                      padding: "1rem",
                      background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(20, 184, 166, 0.1) 100%)",
                      borderRadius: "1rem",
                      border: "1px solid rgba(16, 185, 129, 0.2)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.25rem" }}>
                          Environmental Health
                        </p>
                        <p style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#10b981" }}>{healthScore}%</p>
                      </div>
                      <div style={{ position: "relative" }}>
                        <TrendingUp
                          style={{
                            width: "3rem",
                            height: "3rem",
                            color: "#10b981",
                            animation: "float 3s ease-in-out infinite",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {isLoading ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          style={{
                            height: "4rem",
                            backgroundColor: "rgba(229, 231, 235, 0.3)",
                            borderRadius: "0.75rem",
                            animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                          }}
                        ></div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      {/* Trash Density */}
                      <div
                        style={{
                          padding: "0.75rem",
                          borderRadius: "0.75rem",
                          transition: "all 0.3s",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.5)"
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent"
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: "0.5rem",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <div
                              style={{
                                padding: "0.5rem",
                                backgroundColor: "rgba(254, 226, 226, 1)",
                                borderRadius: "0.5rem",
                                transition: "transform 0.3s",
                              }}
                            >
                              <Sparkles style={{ width: "1rem", height: "1rem", color: "#dc2626" }} />
                            </div>
                            <span style={{ color: "#1f2937", fontWeight: 500, fontSize: "0.875rem" }}>
                              Trash Density
                            </span>
                          </div>
                          <span style={{ fontWeight: "bold", color: "#dc2626", fontSize: "1.125rem" }}>
                            {regionMetrics.avgTrash.toFixed(1)}
                          </span>
                        </div>
                        <div
                          style={{
                            height: "0.5rem",
                            backgroundColor: "#e5e7eb",
                            borderRadius: "9999px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              background: "linear-gradient(90deg, #f87171 0%, #dc2626 100%)",
                              borderRadius: "9999px",
                              transition: "width 0.7s",
                              width: `${Math.min(regionMetrics.avgTrash * 10, 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* Cleanliness */}
                      <div
                        style={{
                          padding: "0.75rem",
                          borderRadius: "0.75rem",
                          transition: "all 0.3s",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.5)"
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent"
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: "0.5rem",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <div
                              style={{
                                padding: "0.5rem",
                                backgroundColor: "rgba(219, 234, 254, 1)",
                                borderRadius: "0.5rem",
                                transition: "transform 0.3s",
                              }}
                            >
                              <Droplets style={{ width: "1rem", height: "1rem", color: "#2563eb" }} />
                            </div>
                            <span style={{ color: "#1f2937", fontWeight: 500, fontSize: "0.875rem" }}>Cleanliness</span>
                          </div>
                          <span style={{ fontWeight: "bold", color: "#2563eb", fontSize: "1.125rem" }}>
                            {regionMetrics.avgCleanliness.toFixed(0)}%
                          </span>
                        </div>
                        <div
                          style={{
                            height: "0.5rem",
                            backgroundColor: "#e5e7eb",
                            borderRadius: "9999px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              background: "linear-gradient(90deg, #60a5fa 0%, #2563eb 100%)",
                              borderRadius: "9999px",
                              transition: "width 0.7s",
                              width: `${regionMetrics.avgCleanliness}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* Greenery */}
                      <div
                        style={{
                          padding: "0.75rem",
                          borderRadius: "0.75rem",
                          transition: "all 0.3s",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.5)"
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent"
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: "0.5rem",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <div
                              style={{
                                padding: "0.5rem",
                                backgroundColor: "rgba(209, 250, 229, 1)",
                                borderRadius: "0.5rem",
                                transition: "transform 0.3s",
                              }}
                            >
                              <Leaf style={{ width: "1rem", height: "1rem", color: "#059669" }} />
                            </div>
                            <span style={{ color: "#1f2937", fontWeight: 500, fontSize: "0.875rem" }}>Greenery</span>
                          </div>
                          <span style={{ fontWeight: "bold", color: "#059669", fontSize: "1.125rem" }}>
                            {regionMetrics.avgGreenery.toFixed(0)}%
                          </span>
                        </div>
                        <div
                          style={{
                            height: "0.5rem",
                            backgroundColor: "#e5e7eb",
                            borderRadius: "9999px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              background: "linear-gradient(90deg, #34d399 0%, #059669 100%)",
                              borderRadius: "9999px",
                              transition: "width 0.7s",
                              width: `${regionMetrics.avgGreenery}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* Carbon */}
                      <div
                        style={{
                          padding: "0.75rem",
                          borderRadius: "0.75rem",
                          transition: "all 0.3s",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.5)"
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent"
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: "0.5rem",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <div
                              style={{
                                padding: "0.5rem",
                                backgroundColor: "rgba(254, 243, 199, 1)",
                                borderRadius: "0.5rem",
                                transition: "transform 0.3s",
                              }}
                            >
                              <Wind style={{ width: "1rem", height: "1rem", color: "#ea580c" }} />
                            </div>
                            <span style={{ color: "#1f2937", fontWeight: 500, fontSize: "0.875rem" }}>Carbon</span>
                          </div>
                          <span style={{ fontWeight: "bold", color: "#ea580c", fontSize: "1.125rem" }}>
                            {regionMetrics.avgCarbon.toFixed(1)}t
                          </span>
                        </div>
                        <div
                          style={{
                            height: "0.5rem",
                            backgroundColor: "#e5e7eb",
                            borderRadius: "9999px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              background: "linear-gradient(90deg, #fb923c 0%, #ea580c 100%)",
                              borderRadius: "9999px",
                              transition: "width 0.7s",
                              width: `${Math.min(regionMetrics.avgCarbon * 2, 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* Total Cells */}
                      <div
                        style={{
                          borderTop: "1px solid rgba(229, 231, 235, 0.5)",
                          paddingTop: "0.75rem",
                          marginTop: "1rem",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ color: "#6b7280", fontSize: "0.875rem", fontWeight: 500 }}>
                            Active Grid Cells
                          </span>
                          <span style={{ fontWeight: "bold", color: "#1f2937", fontSize: "1.125rem" }}>
                            {regionMetrics.totalCells.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Legend */}
            <div
              style={{
                position: "absolute",
                bottom: "1.5rem",
                right: "1.5rem",
                background: "rgba(255, 255, 255, 0.4)",
                backdropFilter: "blur(10px)",
                borderRadius: "1rem",
                padding: "1.25rem",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.5)",
                animation: "slideUp 0.5s ease-out 0.3s both",
              }}
            >
              <p style={{ fontWeight: "bold", color: "#1f2937", marginBottom: "0.75rem", fontSize: "0.875rem" }}>
                Environmental Status
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}
                  onMouseEnter={(e) => {
                    const box = e.currentTarget.querySelector("div") as HTMLElement
                    if (box) box.style.transform = "scale(1.1)"
                  }}
                  onMouseLeave={(e) => {
                    const box = e.currentTarget.querySelector("div") as HTMLElement
                    if (box) box.style.transform = "scale(1)"
                  }}
                >
                  <div
                    style={{
                      width: "1.25rem",
                      height: "1.25rem",
                      background: "linear-gradient(135deg, #34d399 0%, #059669 100%)",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      transition: "transform 0.3s",
                    }}
                  ></div>
                  <span style={{ color: "rgba(31, 41, 55, 0.8)", fontWeight: 500, fontSize: "0.875rem" }}>
                    Thriving
                  </span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}
                  onMouseEnter={(e) => {
                    const box = e.currentTarget.querySelector("div") as HTMLElement
                    if (box) box.style.transform = "scale(1.1)"
                  }}
                  onMouseLeave={(e) => {
                    const box = e.currentTarget.querySelector("div") as HTMLElement
                    if (box) box.style.transform = "scale(1)"
                  }}
                >
                  <div
                    style={{
                      width: "1.25rem",
                      height: "1.25rem",
                      background: "linear-gradient(135deg, #fbbf24 0%, #d97706 100%)",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      transition: "transform 0.3s",
                    }}
                  ></div>
                  <span style={{ color: "rgba(31, 41, 55, 0.8)", fontWeight: 500, fontSize: "0.875rem" }}>
                    Moderate
                  </span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}
                  onMouseEnter={(e) => {
                    const box = e.currentTarget.querySelector("div") as HTMLElement
                    if (box) box.style.transform = "scale(1.1)"
                  }}
                  onMouseLeave={(e) => {
                    const box = e.currentTarget.querySelector("div") as HTMLElement
                    if (box) box.style.transform = "scale(1)"
                  }}
                >
                  <div
                    style={{
                      width: "1.25rem",
                      height: "1.25rem",
                      background: "linear-gradient(135deg, #fb923c 0%, #ea580c 100%)",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      transition: "transform 0.3s",
                    }}
                  ></div>
                  <span style={{ color: "rgba(31, 41, 55, 0.8)", fontWeight: 500, fontSize: "0.875rem" }}>At Risk</span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}
                  onMouseEnter={(e) => {
                    const box = e.currentTarget.querySelector("div") as HTMLElement
                    if (box) box.style.transform = "scale(1.1)"
                  }}
                  onMouseLeave={(e) => {
                    const box = e.currentTarget.querySelector("div") as HTMLElement
                    if (box) box.style.transform = "scale(1)"
                  }}
                >
                  <div
                    style={{
                      width: "1.25rem",
                      height: "1.25rem",
                      background: "linear-gradient(135deg, #f87171 0%, #dc2626 100%)",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      transition: "transform 0.3s",
                    }}
                  ></div>
                  <span style={{ color: "rgba(31, 41, 55, 0.8)", fontWeight: 500, fontSize: "0.875rem" }}>
                    Critical
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section
            style={{
              width: "100%",
              maxWidth: "80rem",
              background: "rgba(255, 255, 255, 0.95)",
              borderRadius: "1rem",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
              border: "2px solid rgba(16, 185, 129, 0.3)",
              marginTop: "2rem",
              marginBottom: "2rem",
              display: "block",
              minHeight: "400px",
            }}
          >
            {/* Receipt Header */}
            <div
              style={{
                background: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
                padding: "1.5rem",
                borderBottom: "2px dashed rgba(0, 0, 0, 0.1)",
                display: "block",
              }}
            >
              <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                <h2
                  style={{
                    fontFamily: "monospace",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#1f2937",
                    marginBottom: "0.25rem",
                    display: "block",
                  }}
                >
                  ECOSIM IMPACT RECEIPT
                </h2>
                <p style={{ fontFamily: "monospace", fontSize: "0.875rem", color: "#6b7280", display: "block" }}>
                  Community Environmental Activity Log
                </p>
              </div>

              {/* Time Period Filter */}
              <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                {(["week", "month", "180days", "year"] as TimePeriod[]).map((period) => (
                  <button
                    key={period}
                    onClick={() => {
                      console.log("[v0] Time period changed to:", period)
                      setTimePeriod(period)
                    }}
                    style={{
                      fontFamily: "monospace",
                      padding: "0.5rem 1rem",
                      borderRadius: "0.5rem",
                      border: "1px solid rgba(0, 0, 0, 0.2)",
                      backgroundColor: timePeriod === period ? "#10b981" : "#ffffff",
                      color: timePeriod === period ? "#ffffff" : "#1f2937",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      cursor: "pointer",
                      transition: "all 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      if (timePeriod !== period) {
                        e.currentTarget.style.backgroundColor = "#f3f4f6"
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (timePeriod !== period) {
                        e.currentTarget.style.backgroundColor = "#ffffff"
                      }
                    }}
                  >
                    {period === "180days" ? "180 DAYS" : period.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Receipt Body - Event List */}
            <div
              style={{
                maxHeight: "500px",
                overflowY: "auto",
                padding: "1.5rem",
                background: "#ffffff",
                display: "block",
              }}
            >
              {filteredEvents.length === 0 ? (
                <div style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
                  <p style={{ fontFamily: "monospace" }}>No events recorded for this period</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {filteredEvents.map((event, index) => (
                    <div
                      key={event.id}
                      style={{
                        borderBottom: index < filteredEvents.length - 1 ? "1px dashed rgba(0, 0, 0, 0.1)" : "none",
                        paddingBottom: "1rem",
                        display: "block",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                        <div style={{ flex: 1 }}>
                          <p
                            style={{
                              fontFamily: "monospace",
                              fontSize: "0.875rem",
                              fontWeight: "bold",
                              color: "#1f2937",
                              marginBottom: "0.25rem",
                            }}
                          >
                            {event.description}
                          </p>
                          <p style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#6b7280" }}>
                            {event.date} ({event.daysAgo} days ago)
                          </p>
                        </div>
                        <div
                          style={{
                            padding: "0.25rem 0.75rem",
                            borderRadius: "0.5rem",
                            backgroundColor:
                              event.type === "cleanup"
                                ? "rgba(239, 68, 68, 0.1)"
                                : event.type === "tree"
                                  ? "rgba(34, 197, 94, 0.1)"
                                  : "rgba(59, 130, 246, 0.1)",
                            border: `1px solid ${event.type === "cleanup" ? "#ef4444" : event.type === "tree" ? "#22c55e" : "#3b82f6"}`,
                          }}
                        >
                          <p
                            style={{
                              fontFamily: "monospace",
                              fontSize: "0.75rem",
                              fontWeight: "bold",
                              color:
                                event.type === "cleanup" ? "#ef4444" : event.type === "tree" ? "#22c55e" : "#3b82f6",
                            }}
                          >
                            {event.type.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "0.75rem",
                          marginTop: "0.5rem",
                          paddingLeft: "1rem",
                        }}
                      >
                        {Object.entries(event.impact).map(([key, value]) => (
                          <div
                            key={key}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                              fontFamily: "monospace",
                              fontSize: "0.75rem",
                            }}
                          >
                            <span style={{ color: "#6b7280" }}>{key}:</span>
                            <span
                              style={{
                                fontWeight: "bold",
                                color: value > 0 ? "#22c55e" : "#ef4444",
                              }}
                            >
                              {value > 0 ? "+" : ""}
                              {value}
                              {key === "carbon" ? "t" : key === "trash" ? "kg" : "%"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Receipt Footer - Total Impact */}
            <div
              style={{
                background: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
                padding: "1.5rem",
                borderTop: "2px dashed rgba(0, 0, 0, 0.1)",
                display: "block",
              }}
            >
              <div style={{ marginBottom: "1rem" }}>
                <p
                  style={{
                    fontFamily: "monospace",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    color: "#1f2937",
                    textAlign: "center",
                    marginBottom: "0.75rem",
                  }}
                >
                  TOTAL IMPACT - {timePeriod === "180days" ? "180 DAYS" : timePeriod.toUpperCase()}
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                    gap: "1rem",
                  }}
                >
                  {totalImpact.trash !== 0 && (
                    <div style={{ textAlign: "center" }}>
                      <p style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#6b7280" }}>Trash Removed</p>
                      <p
                        style={{
                          fontFamily: "monospace",
                          fontSize: "1.25rem",
                          fontWeight: "bold",
                          color: "#ef4444",
                        }}
                      >
                        {totalImpact.trash.toFixed(1)}kg
                      </p>
                    </div>
                  )}
                  {totalImpact.cleanliness !== 0 && (
                    <div style={{ textAlign: "center" }}>
                      <p style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#6b7280" }}>
                        Cleanliness Boost
                      </p>
                      <p
                        style={{
                          fontFamily: "monospace",
                          fontSize: "1.25rem",
                          fontWeight: "bold",
                          color: "#3b82f6",
                        }}
                      >
                        +{totalImpact.cleanliness.toFixed(0)}%
                      </p>
                    </div>
                  )}
                  {totalImpact.greenery !== 0 && (
                    <div style={{ textAlign: "center" }}>
                      <p style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#6b7280" }}>Greenery Added</p>
                      <p
                        style={{
                          fontFamily: "monospace",
                          fontSize: "1.25rem",
                          fontWeight: "bold",
                          color: "#22c55e",
                        }}
                      >
                        +{totalImpact.greenery.toFixed(0)}%
                      </p>
                    </div>
                  )}
                  {totalImpact.carbon !== 0 && (
                    <div style={{ textAlign: "center" }}>
                      <p style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#6b7280" }}>Carbon Offset</p>
                      <p
                        style={{
                          fontFamily: "monospace",
                          fontSize: "1.25rem",
                          fontWeight: "bold",
                          color: "#22c55e",
                        }}
                      >
                        {totalImpact.carbon.toFixed(1)}t
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div style={{ textAlign: "center", paddingTop: "1rem", borderTop: "1px solid rgba(0, 0, 0, 0.1)" }}>
                <p style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#6b7280" }}>
                  {filteredEvents.length} events recorded
                </p>
                <p style={{ fontFamily: "monospace", fontSize: "0.875rem", fontWeight: "bold", color: "#10b981" }}>
                  THANK YOU FOR MAKING A DIFFERENCE
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes grow {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulseGlow {
          0%,
          100% {
            opacity: 1;
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
          }
          50% {
            opacity: 0.8;
            box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
          }
        }
      `}</style>
    </div>
  )
}
