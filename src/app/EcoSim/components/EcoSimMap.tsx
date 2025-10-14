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

export default function EcoSimMap({ center = [-75.514, 40.036], zoom = 12, onBoundsChange }: EcoSimMapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<any>(null)
  const [mapError, setMapError] = useState<string | null>(null)
  const [isMapLoading, setIsMapLoading] = useState(true)
  const [mapboxLoaded, setMapboxLoaded] = useState(false)

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

        const color = score > 70 ? "#10b981" : score > 50 ? "#eab308" : score > 30 ? "#f97316" : "#ef4444"

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

      const bounds = map.getBounds()
      if (!bounds) return

      const boundsObj = {
        latMin: bounds.getSouth(),
        latMax: bounds.getNorth(),
        lngMin: bounds.getWest(),
        lngMax: bounds.getEast(),
      }

      if (onBoundsChange) {
        onBoundsChange(boundsObj)
      }

      try {
        const chesterBounds = {
          latMin: 39.72,
          latMax: 40.23,
          lngMin: -76.01,
          lngMax: -75.33,
        }

        const viewIntersectsChester = !(
          boundsObj.latMax < chesterBounds.latMin ||
          boundsObj.latMin > chesterBounds.latMax ||
          boundsObj.lngMax < chesterBounds.lngMin ||
          boundsObj.lngMin > chesterBounds.lngMax
        )

        const globalCells = await getGridCellsInBounds(boundsObj)

        const filteredGlobalCells = globalCells.filter((cell) => {
          const centerLat = (cell.lat_min + cell.lat_max) / 2
          const centerLng = (cell.lng_min + cell.lng_max) / 2
          return !isInChesterCounty(centerLat, centerLng)
        })

        const globalGeoJSON = gridCellsToGeoJSON(filteredGlobalCells)

        if (map.getSource("grid-cells")) {
          map.getSource("grid-cells").setData(globalGeoJSON)
        } else {
          map.addSource("grid-cells", { type: "geojson", data: globalGeoJSON })
          map.addLayer({
            id: "grid-cells-layer",
            type: "fill",
            source: "grid-cells",
            paint: { "fill-color": ["get", "color"], "fill-opacity": 0.7 },
          })
          map.addLayer({
            id: "grid-cells-borders",
            type: "line",
            source: "grid-cells",
            paint: { "line-color": "#ffffff", "line-width": 0.5, "line-opacity": 0.3 },
          })
        }

        if (viewIntersectsChester) {
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
                  "fill-opacity": 0.75,
                },
              })
              map.addLayer({
                id: "chester-grid-cells-borders",
                type: "line",
                source: "chester-grid-cells",
                paint: {
                  "line-color": "#ffffff",
                  "line-width": 0.5,
                  "line-opacity": 0.4,
                },
              })

              map.on("click", "chester-grid-cells-layer", (e: any) => {
                if (e.features && e.features[0]) {
                  const props = e.features[0].properties
                  const healthScore = Math.round(props?.ecoScore || 0)
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
                          <h3 class="font-bold text-emerald-700">Chester County, PA</h3>
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
