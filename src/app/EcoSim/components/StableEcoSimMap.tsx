"use client"
import { getGridCellsInBounds, gridCellsToGeoJSON, subscribeToGridCellUpdates } from "@/utils/supabase/functions"
import { useCallback, useEffect, useRef, useState } from "react"
import { getChesterCountryGridCellsInBounds, isInChesterCounty } from "../lib/functions"

let mapboxgl: any = null
if (typeof window !== "undefined") {
  import("mapbox-gl").then((module) => {
    mapboxgl = module.default
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    if (token && mapboxgl) {
      mapboxgl.accessToken = token
    }
  })
}

interface EcoSimMapProps {
  center?: [number, number]
  zoom?: number
  onBoundsChange?: (bounds: { latMin: number; latMax: number; lngMin: number; lngMax: number }) => void
  showLocationSearch?: boolean
}

interface ChesterGridCell {
  id: string
  lat_min: number
  lat_max: number
  lng_min: number
  lng_max: number
  trash_density: number
  greenery_score: number
  cleanliness_score: number
  carbon_emissions: number | null
}

export default function EcoSimMap({ center = [-75.514, 40.036], zoom = 12, onBoundsChange, showLocationSearch = true }: EcoSimMapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<any>(null)
  const [mapError, setMapError] = useState<string | null>(null)
  const [isMapLoading, setIsMapLoading] = useState(true)
  const [mapboxLoaded, setMapboxLoaded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  
  // Add refs to prevent constant reloading
  const lastBoundsRef = useRef<string>("")
  const isLoadingRef = useRef(false)

  // Location search function using Mapbox Geocoding API
  const searchLocation = async (query: string) => {
    if (!query.trim() || !mapRef.current) return

    setIsSearching(true)
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}&limit=1`
      )
      const data = await response.json()
      
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center
        mapRef.current.flyTo({
          center: [lng, lat],
          zoom: 14,
          duration: 2000
        })
      }
    } catch (error) {
      console.error("Error searching location:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    searchLocation(searchQuery)
  }

  useEffect(() => {
    const checkMapbox = setInterval(() => {
      if (mapboxgl) {
        setMapboxLoaded(true)
        clearInterval(checkMapbox)
      }
    }, 100)

    return () => clearInterval(checkMapbox)
  }, [])

  // Helper function to convert Chester County cells to GeoJSON
  const chesterCellsToGeoJSON = (cells: ChesterGridCell[]) => {
    return {
      type: "FeatureCollection",
      features: cells.map((cell) => {
        const score =
          (100 - Math.min(cell.trash_density * 10, 100)) * 0.3 +
          cell.greenery_score * 0.3 +
          cell.cleanliness_score * 0.3 -
          Math.min((cell.carbon_emissions || 0) * 2, 50) * 0.1

        // Enhanced color scheme with darker, more visible colors
        let color
        if (score > 80) {
          color = "#059669" // darker emerald for excellent
        } else if (score > 60) {
          color = "#16a34a" // darker green for good
        } else if (score > 40) {
          color = "#ca8a04" // darker yellow for moderate
        } else if (score > 20) {
          color = "#dc2626" // darker red for poor
        } else {
          color = "#991b1b" // very dark red for critical
        }

        return {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [cell.lng_min, cell.lat_min],
                [cell.lng_max, cell.lat_min],
                [cell.lng_max, cell.lat_max],
                [cell.lng_min, cell.lat_max],
                [cell.lng_min, cell.lat_min],
              ],
            ],
          },
          properties: {
            id: cell.id,
            trash_density: cell.trash_density,
            greenery_score: cell.greenery_score,
            cleanliness_score: cell.cleanliness_score,
            carbon_emissions: cell.carbon_emissions || 0,
            ecoScore: score,
            color: color,
            gridType: "chester",
          },
        }
      }),
    }
  }

  // Memoize the loadCells function to prevent recreation on every render
  const loadCells = useCallback(
    async (map: any) => {
      if (!map || !map.isStyleLoaded()) return
      
      // Prevent concurrent loads - CRITICAL FIX
      if (isLoadingRef.current) return
      isLoadingRef.current = true

      const bounds = map.getBounds()
      if (!bounds) {
        isLoadingRef.current = false
        return
      }

      const boundsObj = {
        latMin: bounds.getSouth(),
        latMax: bounds.getNorth(),
        lngMin: bounds.getWest(),
        lngMax: bounds.getEast(),
      }
      
      // Check if bounds have actually changed - CRITICAL FIX
      // Use zoom level and bounds to create a cache key
      const currentZoom = map.getZoom()
      const boundsKey = `${boundsObj.latMin.toFixed(2)},${boundsObj.latMax.toFixed(2)},${boundsObj.lngMin.toFixed(2)},${boundsObj.lngMax.toFixed(2)},${currentZoom.toFixed(0)}`
      
      if (lastBoundsRef.current === boundsKey) {
        isLoadingRef.current = false
        return // Don't reload if nothing has changed
      }
      
      lastBoundsRef.current = boundsKey

      if (onBoundsChange) {
        onBoundsChange(boundsObj)
      }

      try {
        const chesterBounds = {
          latMin: 39.7167,
          latMax: 40.1833,
          lngMin: -76.2417,
          lngMax: -75.325,
        }

        const viewIntersectsChester = !(
          boundsObj.latMax < chesterBounds.latMin ||
          boundsObj.latMin > chesterBounds.latMax ||
          boundsObj.lngMax < chesterBounds.lngMin ||
          boundsObj.lngMin > chesterBounds.lngMax
        )

        // Additional check: only load Chester County cells if viewport center is actually in Chester County
        const viewportCenterLat = (boundsObj.latMin + boundsObj.latMax) / 2
        const viewportCenterLng = (boundsObj.lngMin + boundsObj.lngMax) / 2
        const viewportCenterInChester = isInChesterCounty(viewportCenterLat, viewportCenterLng)

        const shouldLoadChesterCells = viewIntersectsChester && viewportCenterInChester

        let globalCells = await getGridCellsInBounds(boundsObj)

        globalCells = globalCells.filter((cell) => {
          const centerLat = (cell.lat_min + cell.lat_max) / 2
          const centerLng = (cell.lng_min + cell.lng_max) / 2
          return !isInChesterCounty(centerLat, centerLng)
        })

        // DON'T use stabilizeGridCells - it causes constant recalculation
        // Just use the cells as-is to prevent sliding
        const globalGeoJSON = gridCellsToGeoJSON(globalCells)

        if (map.getSource("grid-cells")) {
          map.getSource("grid-cells").setData(globalGeoJSON)
        } else {
          map.addSource("grid-cells", { type: "geojson", data: globalGeoJSON })
          map.addLayer({
            id: "grid-cells-layer",
            type: "fill",
            source: "grid-cells",
            paint: { 
              "fill-color": ["get", "color"], 
              "fill-opacity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                8, 0.12,  // Slightly more visible at low zoom
                12, 0.18, // More visible at medium zoom
                16, 0.25  // Better visibility when zoomed in
              ]
            },
          })
          map.addLayer({
            id: "grid-cells-borders",
            type: "line",
            source: "grid-cells",
            paint: { 
              "line-color": "#ffffff", 
              "line-width": [
                "interpolate",
                ["linear"],
                ["zoom"],
                8, 0.1,
                12, 0.15,
                16, 0.2
              ],
              "line-opacity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                8, 0.05,  // Almost invisible at low zoom
                12, 0.08, // Very light at medium zoom
                16, 0.12  // Still very light when zoomed in
              ]
            },
          })

          // Add click handler for global grid cells
          map.on("click", "grid-cells-layer", (e: any) => {
            if (e.features && e.features[0]) {
              const props = e.features[0].properties
              const healthScore = Math.round(props?.ecoScore || 0)
              
              // Determine location based on click coordinates
              const clickLat = e.lngLat.lat
              const clickLng = e.lngLat.lng
              const locationText = isInChesterCounty(clickLat, clickLng) ? "Chester County, PA" : "Global Region"
              
              new mapboxgl.Popup({
                className: "eco-popup",
                closeButton: true,
                closeOnClick: true,
              })
                .setLngLat(e.lngLat)
                .setHTML(`
                  <div class="p-4 min-w-[240px] bg-white/95 backdrop-blur-md rounded-xl">
                    <div class="flex items-center gap-2 mb-3">
                      <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <h3 class="font-bold text-blue-700">${locationText}</h3>
                    </div>
                    <div class="mb-3 p-3 bg-gradient-to-br from-blue-50 to-sky-50 rounded-lg">
                      <p class="text-xs text-gray-600 mb-1">Environmental Health</p>
                      <p class="text-2xl font-bold text-blue-600">${healthScore}%</p>
                    </div>
                    <div class="space-y-2 text-sm">
                      <div class="flex justify-between items-center">
                        <span class="text-gray-600">Trash:</span>
                        <span class="font-semibold text-red-600">${props?.trash_density?.toFixed(1)}</span>
                      </div>
                      <div class="flex justify-between items-center">
                        <span class="text-gray-600">Greenery:</span>
                        <span class="font-semibold text-emerald-600">${props?.greenery_score?.toFixed(0)}%</span>
                      </div>
                      <div class="flex justify-between items-center">
                        <span class="text-gray-600">Cleanliness:</span>
                        <span class="font-semibold text-blue-600">${props?.cleanliness_score?.toFixed(0)}%</span>
                      </div>
                      <div class="flex justify-between items-center">
                        <span class="text-gray-600">Carbon:</span>
                        <span class="font-semibold text-orange-600">${props?.carbon_emissions?.toFixed(1)}t</span>
                      </div>
                    </div>
                    <div class="mt-3 pt-3 border-t border-gray-200">
                      <p class="text-xs text-blue-700 font-medium">Global Grid Data</p>
                    </div>
                  </div>
                `)
                .addTo(map)
            }
          })

          // Add mouse handlers for global grid cells
          map.on("mouseenter", "grid-cells-layer", () => {
            map.getCanvas().style.cursor = "pointer"
          })

          map.on("mouseleave", "grid-cells-layer", () => {
            map.getCanvas().style.cursor = ""
          })
        }

        if (shouldLoadChesterCells) {
          const chesterCells = await getChesterCountryGridCellsInBounds({
            north: boundsObj.latMax,
            south: boundsObj.latMin,
            east: boundsObj.lngMax,
            west: boundsObj.lngMin,
          })

          if (chesterCells && chesterCells.length > 0) {
            const chesterGeoJSON = chesterCellsToGeoJSON(chesterCells)

            if (map.getSource("chester-grid-cells")) {
              map.getSource("chester-grid-cells").setData(chesterGeoJSON)
            } else {
              map.addSource("chester-grid-cells", { type: "geojson", data: chesterGeoJSON })
              map.addLayer({
                id: "chester-grid-cells-layer",
                type: "fill",
                source: "chester-grid-cells",
                paint: {
                  "fill-color": ["get", "color"],
                  "fill-opacity": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    8, 0.15,   // More visible at low zoom
                    12, 0.22,  // Better visibility at medium zoom  
                    16, 0.30   // Good visibility when zoomed in
                  ]
                },
              })
              map.addLayer({
                id: "chester-grid-cells-borders",
                type: "line",
                source: "chester-grid-cells",
                paint: {
                  "line-color": "#ffffff",
                  "line-width": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    8, 0.1,
                    12, 0.15,
                    16, 0.2
                  ],
                  "line-opacity": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    8, 0.03,  // Almost invisible at low zoom
                    12, 0.06, // Very light at medium zoom
                    16, 0.1   // Still very light when zoomed in
                  ]
                },
              })

              map.on("click", "chester-grid-cells-layer", (e: any) => {
                if (e.features && e.features[0]) {
                  const props = e.features[0].properties
                  const healthScore = Math.round(props?.ecoScore || 0)
                  
                  // Determine location based on click coordinates
                  const clickLat = e.lngLat.lat
                  const clickLng = e.lngLat.lng
                  const locationText = isInChesterCounty(clickLat, clickLng) ? "Chester County, PA" : "Current Location"
                  
                  new mapboxgl.Popup({
                    className: "eco-popup",
                    closeButton: true,
                    closeOnClick: true,
                  })
                    .setLngLat(e.lngLat)
                    .setHTML(`
                      <div class="p-4 min-w-[240px] bg-white/95 backdrop-blur-md rounded-xl">
                        <div class="flex items-center gap-2 mb-3">
                          <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                          <h3 class="font-bold text-emerald-700">${locationText}</h3>
                        </div>
                        <div class="mb-3 p-3 bg-gradient-to-br from-emerald-50 to-sky-50 rounded-lg">
                          <p class="text-xs text-gray-600 mb-1">Environmental Health</p>
                          <p class="text-2xl font-bold text-emerald-600">${healthScore}%</p>
                        </div>
                        <div class="space-y-2 text-sm">
                          <div class="flex justify-between items-center">
                            <span class="text-gray-600">Trash:</span>
                            <span class="font-semibold text-red-600">${props?.trash_density?.toFixed(1)}</span>
                          </div>
                          <div class="flex justify-between items-center">
                            <span class="text-gray-600">Greenery:</span>
                            <span class="font-semibold text-emerald-600">${props?.greenery_score?.toFixed(0)}%</span>
                          </div>
                          <div class="flex justify-between items-center">
                            <span class="text-gray-600">Cleanliness:</span>
                            <span class="font-semibold text-blue-600">${props?.cleanliness_score?.toFixed(0)}%</span>
                          </div>
                          <div class="flex justify-between items-center">
                            <span class="text-gray-600">Carbon:</span>
                            <span class="font-semibold text-orange-600">${props?.carbon_emissions?.toFixed(1)}t</span>
                          </div>
                        </div>
                        <div class="mt-3 pt-3 border-t border-gray-200">
                          <p class="text-xs text-emerald-700 font-medium">High-Resolution Data</p>
                        </div>
                      </div>
                    `)
                    .addTo(map)
                }
              })

              map.on("mouseenter", "chester-grid-cells-layer", () => {
                map.getCanvas().style.cursor = "pointer"
              })

              map.on("mouseleave", "chester-grid-cells-layer", () => {
                map.getCanvas().style.cursor = ""
              })
            }
          }
        } else {
          if (map.getSource("chester-grid-cells")) {
            if (map.getLayer("chester-grid-cells-layer")) map.removeLayer("chester-grid-cells-layer")
            if (map.getLayer("chester-grid-cells-borders")) map.removeLayer("chester-grid-cells-borders")
            map.removeSource("chester-grid-cells")
          }
        }
      } catch (error) {
        console.error("Error loading grid cells:", error)
      } finally {
        // CRITICAL: Reset loading flag
        isLoadingRef.current = false
      }
    },
    [onBoundsChange],
  )

  useEffect(() => {
    if (!mapContainer.current || mapRef.current || !mapboxLoaded || !mapboxgl) return

    console.log("Initializing map with token:", !!mapboxgl.accessToken)

    const initializeMap = () => {
      if (!mapboxgl.accessToken) {
        const errorMsg =
          "Mapbox access token is missing. Please set NEXT_PUBLIC_MAPBOX_TOKEN in your environment variables."
        console.error(errorMsg)
        setMapError(errorMsg)
        setIsMapLoading(false)
        return
      }

      try {
        const map = new mapboxgl.Map({
          container: mapContainer.current!,
          style: "mapbox://styles/mapbox/satellite-streets-v12",
          center,
          zoom,
        })
        mapRef.current = map

        map.on("load", () => {
          setIsMapLoading(false)
          setMapError(null)
        })

        map.on("error", (e: any) => {
          console.error("Mapbox error:", e)
          setMapError("Failed to load map. Please check your internet connection.")
          setIsMapLoading(false)
        })

        map.on("load", () => loadCells(map))
        map.on("moveend", () => loadCells(map))

        const unsubscribe = subscribeToGridCellUpdates((updatedCell) => {
          const source = map.getSource("grid-cells")
          if (!source) return
          const data = (source as any)._data
          const feature = data.features.find((f: any) => f.properties.id === updatedCell.id)
          if (feature) {
            feature.properties.color = gridCellsToGeoJSON([updatedCell]).features[0].properties.color
            source.setData(data)
          }
        })

        return () => {
          if (unsubscribe) unsubscribe()
          if (map) map.remove()
          mapRef.current = null
        }
      } catch (error) {
        console.error("Error initializing map:", error)
        setMapError("Failed to initialize map. Please check your configuration.")
        setIsMapLoading(false)
      }
    }

    setTimeout(initializeMap, 100)
  }, [center, zoom, loadCells, mapboxLoaded])

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  return (
    <div
      ref={mapContainer}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "600px",
        background:
          "linear-gradient(135deg, rgba(209, 250, 229, 1) 0%, rgba(224, 242, 254, 1) 50%, rgba(204, 251, 241, 1) 100%)",
        borderRadius: "1rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <link href="https://api.mapbox.com/mapbox-gl-js/v3.1.0/mapbox-gl.css" rel="stylesheet" />

      {/* Location Search Bar */}
      {showLocationSearch && (
        <div
          style={{
            position: "absolute",
            top: "1rem",
            left: "1rem",
            right: "1rem",
            zIndex: 20,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <form onSubmit={handleSearchSubmit} style={{ width: "100%", maxWidth: "400px" }}>
            <div
              style={{
                display: "flex",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                borderRadius: "0.75rem",
                padding: "0.5rem",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a location..."
                style={{
                  flex: 1,
                  padding: "0.5rem 1rem",
                  border: "none",
                  background: "transparent",
                  outline: "none",
                  fontSize: "0.875rem",
                  color: "#374151",
                }}
                disabled={isSearching}
              />
              <button
                type="submit"
                disabled={isSearching || !searchQuery.trim()}
                style={{
                  padding: "0.5rem 1rem",
                  background: isSearching ? "#9ca3af" : "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  cursor: isSearching || !searchQuery.trim() ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                {isSearching ? (
                  <>
                    <div
                      style={{
                        width: "1rem",
                        height: "1rem",
                        border: "2px solid rgba(255, 255, 255, 0.3)",
                        borderTopColor: "#ffffff",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                      }}
                    ></div>
                    Searching...
                  </>
                ) : (
                  <>🔍 Search</>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {isMapLoading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(135deg, rgba(236, 253, 245, 1) 0%, rgba(240, 249, 255, 1) 50%, rgba(240, 253, 250, 1) 100%)",
            borderRadius: "1rem",
            zIndex: 10,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ position: "relative", marginBottom: "1.5rem" }}>
              <div
                style={{
                  animation: "spin 1s linear infinite",
                  borderRadius: "9999px",
                  height: "4rem",
                  width: "4rem",
                  border: "4px solid rgba(16, 185, 129, 0.2)",
                  borderTopColor: "#10b981",
                  margin: "0 auto",
                }}
              ></div>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: "2rem",
                    height: "2rem",
                    backgroundColor: "rgba(16, 185, 129, 0.2)",
                    borderRadius: "9999px",
                    animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                  }}
                ></div>
              </div>
            </div>
            <p style={{ color: "#1f2937", fontWeight: 500, marginBottom: "0.25rem" }}>Loading your ecosystem...</p>
            <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>Preparing environmental data</p>
          </div>
        </div>
      )}
      {mapError && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, rgba(254, 242, 242, 1) 0%, rgba(255, 237, 213, 1) 100%)",
            borderRadius: "1rem",
            zIndex: 10,
          }}
        >
          <div
            style={{
              textAlign: "center",
              padding: "2rem",
              background: "rgba(255, 255, 255, 0.4)",
              backdropFilter: "blur(10px)",
              borderRadius: "1.5rem",
              maxWidth: "28rem",
              border: "1px solid rgba(255, 255, 255, 0.5)",
            }}
          >
            <div style={{ color: "#dc2626", fontSize: "3rem", marginBottom: "1rem" }}>🌍</div>
            <p style={{ color: "#b91c1c", fontWeight: "bold", fontSize: "1.125rem", marginBottom: "0.5rem" }}>
              Unable to Load Map
            </p>
            <p style={{ color: "rgba(185, 28, 28, 0.8)", fontSize: "0.875rem", lineHeight: "1.5" }}>{mapError}</p>
          </div>
        </div>
      )}
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  )
}