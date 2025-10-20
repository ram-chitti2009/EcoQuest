"use client"

import { getGridCellsInBounds, gridCellsToGeoJSON, subscribeToGridCellUpdates } from "@/utils/supabase/functions"
import { useCallback, useEffect, useRef, useState } from "react"
import { getChesterCountryGridCellsInBounds, isInChesterCounty } from "../lib/functions"
import { createRoot } from "react-dom/client"
import MapPopup from "../components/MapPopup"
import type { Map as MapboxMap, MapboxGeoJSONFeature, LngLatLike, MapMouseEvent } from "mapbox-gl"

// Mapbox GL module loader
let mapboxgl: typeof import("mapbox-gl") | null = null
let mapboxLoadPromise: Promise<typeof import("mapbox-gl")> | null = null

if (typeof window !== "undefined") {
  mapboxLoadPromise = import("mapbox-gl")
    .then((module) => {
      mapboxgl = module.default as unknown as typeof import("mapbox-gl")
      if (mapboxgl) {
        const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
        if (token) {
          ;(mapboxgl as unknown as { accessToken: string }).accessToken = token
        } else {
          console.error("❌ No Mapbox token found!")
        }
      }
      return mapboxgl
    })
    .catch((error) => {
      console.error("❌ Failed to load Mapbox GL:", error)
      throw error
    })
}

interface EcoSimMapProps {
  center?: LngLatLike
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

// Popup renderer
const renderPopup = (map: MapboxMap, e: MapMouseEvent & { features?: MapboxGeoJSONFeature[] }, isHighRes: boolean) => {
  if (!e.features || e.features.length === 0) return
  const props = e.features[0].properties
  if (!props) return

  const clickLat = e.lngLat.lat
  const clickLng = e.lngLat.lng
  const locationText = isInChesterCounty(clickLat, clickLng)
    ? "Chester County, PA"
    : isHighRes
    ? "Current Location"
    : "Global Region"

  const placeholder = document.createElement("div")
  const root = createRoot(placeholder)
  root.render(<MapPopup properties={props} locationText={locationText} isHighRes={isHighRes} />)

  if (!mapboxgl) return

  new mapboxgl.Popup({
    className: "eco-popup",
    closeButton: true,
    closeOnClick: true,
  })
    .setLngLat(e.lngLat)
    .setDOMContent(placeholder)
    .addTo(map)
}

export default function EcoSimMap({
  center = [-75.514, 40.036],
  zoom = 12,
  onBoundsChange,
  showLocationSearch = true,
}: EcoSimMapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<MapboxMap | null>(null)
  const isLoadingCellsRef = useRef<boolean>(false)
  const eventsBoundRef = useRef<boolean>(false)
  const lastChesterActiveRef = useRef<boolean>(false)
  const lastBoundsRef = useRef<string>("")
  const currentDataRef = useRef<GeoJSON.FeatureCollection | null>(null)
  const [mapError, setMapError] = useState<string | null>(null)
  const [isMapLoading, setIsMapLoading] = useState(true)
  const [mapboxLoaded, setMapboxLoaded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  // Constants
  const CHESTER_BOUNDS = {
    latMin: 39.7167,
    latMax: 40.1833,
    lngMin: -76.2417,
    lngMax: -75.325,
  }
  const CHESTER_ZOOM_THRESHOLD = 12

  // Convert Chester cells to GeoJSON
  const chesterCellsToGeoJSON = (cells: ChesterGridCell[]): GeoJSON.FeatureCollection => {
    return {
      type: "FeatureCollection",
      features: cells.map((cell) => {
        // Recalculate ecoScore for normalization (0.0 to 1.0)
        const trashPenalty = Math.min(cell.trash_density * 10, 100)
        const carbonPenalty = Math.min((cell.carbon_emissions || 0) * 2, 50)
        const rawScore =
          (100 - trashPenalty) * 0.3 +
          cell.greenery_score * 0.3 +
          cell.cleanliness_score * 0.3 -
          carbonPenalty * 0.1

        // Normalize to a 0.0 to 1.0 range (Important for consistent Mapbox interpolation)
        const normalizedScore = Math.max(0, Math.min(1, (rawScore + 10) / 110)) // Normalizes roughly -10 to 100 range

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
            ecoScore: normalizedScore,
            gridType: "chester",
          },
        }
      }),
    }
  }

  // The unified data loading function
  const loadCells = useCallback(
    async (map: MapboxMap) => {
      // CRITICAL: Stop concurrent fetches
      if (isLoadingCellsRef.current || !map.isStyleLoaded()) return

      isLoadingCellsRef.current = true

      try {
        const bounds = map.getBounds()
        if (!bounds) {
          console.error("Bounds are null")
          return
        }

        const boundsObj = {
          latMin: bounds.getSouth(),
          latMax: bounds.getNorth(),
          lngMin: bounds.getWest(),
          lngMax: bounds.getEast(),
        }
        
        const boundsKey = `${boundsObj.latMin.toFixed(6)},${boundsObj.latMax.toFixed(6)},${boundsObj.lngMin.toFixed(6)},${boundsObj.lngMax.toFixed(6)}`
        const currentZoom = map.getZoom()
        const zoomKey = currentZoom < CHESTER_ZOOM_THRESHOLD ? `${Math.floor(currentZoom)}` : `${currentZoom.toFixed(2)}`
        const cacheKey = `${boundsKey}-${zoomKey}`
        
        if (lastBoundsRef.current === cacheKey && currentDataRef.current) {
          isLoadingCellsRef.current = false
          return
        }
        
        lastBoundsRef.current = cacheKey
        onBoundsChange?.(boundsObj)
        
        const viewIntersectsChester =
          boundsObj.latMax >= CHESTER_BOUNDS.latMin &&
          boundsObj.latMin <= CHESTER_BOUNDS.latMax &&
          boundsObj.lngMax >= CHESTER_BOUNDS.lngMin &&
          boundsObj.lngMin <= CHESTER_BOUNDS.lngMax

        const hysteresisOn = CHESTER_ZOOM_THRESHOLD
        const hysteresisOff = CHESTER_ZOOM_THRESHOLD - 1
        const wasActive = lastChesterActiveRef.current
        const passesZoomGate = wasActive ? currentZoom >= hysteresisOff : currentZoom >= hysteresisOn
        const shouldLoadChester = viewIntersectsChester && passesZoomGate
        lastChesterActiveRef.current = shouldLoadChester

        const [globalCells, chesterCells] = await Promise.all([
          getGridCellsInBounds(boundsObj),
          shouldLoadChester
            ? getChesterCountryGridCellsInBounds({
                north: boundsObj.latMax,
                south: boundsObj.latMin,
                east: boundsObj.lngMax,
                west: boundsObj.lngMin,
              })
            : Promise.resolve([]),
        ])

        const validGlobal = globalCells.filter((c) => {
          const isOverlappedByChester =
            shouldLoadChester &&
            c.lat_max >= CHESTER_BOUNDS.latMin &&
            c.lat_min <= CHESTER_BOUNDS.latMax &&
            c.lng_max >= CHESTER_BOUNDS.lngMin &&
            c.lng_min <= CHESTER_BOUNDS.lngMax
          return !isOverlappedByChester
        })

        const validChester = chesterCells.filter(
          (c) => c.lat_min < c.lat_max && c.lng_min < c.lng_max && Number.isFinite(c.lat_min)
        )

        const globalGeoJSON = gridCellsToGeoJSON(validGlobal)
        const chesterGeoJSON = chesterCellsToGeoJSON(validChester)
        
        const unifiedGeoJSON: GeoJSON.FeatureCollection = {
          type: "FeatureCollection",
          features: ([...globalGeoJSON.features, ...chesterGeoJSON.features] as Array<any>).map((f) => ({
            ...f,
            type: "Feature" as const,
          })),
        }
        
        currentDataRef.current = unifiedGeoJSON

        const existingSource = map.getSource("grid-cells")
        if (!existingSource) {
          map.addSource("grid-cells", { type: "geojson", data: unifiedGeoJSON })

          if (!map.getLayer("grid-cells-layer")) {
            map.addLayer({
              id: "grid-cells-layer",
              type: "fill",
              source: "grid-cells",
              layout: { visibility: "visible" },
              paint: {
                "fill-color": [
                  "interpolate",
                  ["linear"],
                  ["get", "ecoScore"],
                  0.0, "#991b1b",
                  0.25, "#dc2626",
                  0.5, "#ca8a04",
                  0.75, "#16a34a",
                  1.0, "#059669",
                ],
                "fill-opacity": 0.75,
                "fill-outline-color": "#ffffff",
              },
              minzoom: 0,
              maxzoom: 24,
            })
            const zeroTransition = { duration: 0, delay: 0 } as { duration: number; delay: number }
            map.setPaintProperty("grid-cells-layer", "fill-color-transition", zeroTransition)
            map.setPaintProperty("grid-cells-layer", "fill-opacity-transition", zeroTransition)
          }

          if (!map.getLayer("grid-cells-borders")) {
            map.addLayer({
              id: "grid-cells-borders",
              type: "line",
              source: "grid-cells",
              paint: {
                "line-color": "#ffffff",
                "line-width": 1,
                "line-opacity": 1.0,
              },
              minzoom: 0,
              maxzoom: 24,
            })
            const zeroTransition = { duration: 0, delay: 0 } as { duration: number; delay: number }
            map.setPaintProperty("grid-cells-borders", "line-color-transition", zeroTransition)
            map.setPaintProperty("grid-cells-borders", "line-opacity-transition", zeroTransition)
          }

          if (!eventsBoundRef.current) {
            map.on("click", "grid-cells-layer", (e) => {
              const isHighRes = e.features?.[0]?.properties?.gridType === "chester"
              renderPopup(map, e as any, isHighRes)
            })
            map.on("mouseenter", "grid-cells-layer", () => (map.getCanvas().style.cursor = "pointer"))
            map.on("mouseleave", "grid-cells-layer", () => (map.getCanvas().style.cursor = ""))
            eventsBoundRef.current = true
          }
        } else if (existingSource.type === "geojson") {
          const geoJsonSource = existingSource as any
          geoJsonSource.setData(unifiedGeoJSON)
          // FORCE IMMEDIATE REPAINT
          map.triggerRepaint()
        }
      } catch (error) {
        console.error("[loadCells] Error:", error)
      } finally {
        isLoadingCellsRef.current = false
      }
    },
    [onBoundsChange, CHESTER_BOUNDS.latMax, CHESTER_BOUNDS.latMin, CHESTER_BOUNDS.lngMax, CHESTER_BOUNDS.lngMin]
  )

  const searchLocation = async (query: string) => {
    if (!query.trim() || !mapRef.current || !mapboxgl) return
    setIsSearching(true)
    try {
      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
      if (!token) {
        console.error("Mapbox token not found")
        return
      }
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${token}&limit=1`
      )
      const data = await response.json()
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center
        mapRef.current.flyTo({ center: [lng, lat], zoom: 14, duration: 2000 })
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
    mapboxLoadPromise
      ?.then(() => setMapboxLoaded(true))
      .catch((error) => {
        console.error("❌ Mapbox GL failed to load:", error)
        setMapError("Failed to load map library. Please refresh the page.")
        setIsMapLoading(false)
      })
  }, [])

  useEffect(() => {
    if (!mapContainer.current || mapRef.current || !mapboxLoaded || !mapboxgl) return

    const initializeMap = () => {
      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
      if (!token) {
        const errorMsg = "Mapbox access token is missing."
        console.error(errorMsg)
        setMapError(errorMsg)
        setIsMapLoading(false)
        return
      }

      try {
        if (!mapboxgl) return
        const map = new mapboxgl.Map({
          container: mapContainer.current!,
          style: "mapbox://styles/mapbox/satellite-streets-v12",
          center,
          zoom,
          renderWorldCopies: false,
          maxZoom: 18,
          minZoom: 3,
          pitch: 0,
          bearing: 0,
          pitchWithRotate: false,
          attributionControl: false,
          logoPosition: "bottom-right",
          refreshExpiredTiles: false,

          // --- FIXES APPLIED HERE ---
          fadeDuration: 0,              // ✅ Key Fix: Disables all map cross-fading animations.
          preserveDrawingBuffer: false, // 💡 CHANGED: Improves rendering performance by allowing GPU to optimize.
          antialias: true,              // 💡 CHANGED: Creates smoother polygon edges for better visual quality.
        })
        mapRef.current = map
        
        try {
          map.dragRotate.disable()
          map.touchZoomRotate.disableRotation()
        } catch {}

        const handleLoad = () => {
          setIsMapLoading(false)
          setMapError(null)
          loadCells(map)
        }

        const handleError = (e: { error?: Error }) => {
          console.error("Mapbox error:", e.error)
          setMapError("Failed to load map. Please check your internet connection.")
          setIsMapLoading(false)
        }

        const handleMoveEnd = () => {
          loadCells(map)
        }

        map.on("load", handleLoad)
        map.on("error", handleError)
        map.on("moveend", handleMoveEnd)
        
        const unsubscribe = subscribeToGridCellUpdates((updatedCell) => {
          if (isLoadingCellsRef.current) {
            console.warn("🚫 Blocking real-time update during mass data load.")
            return
          }
          
          const source = map.getSource("grid-cells")
          if (!source || source.type !== "geojson") return

          const geoJsonSource = source as any
          const currentData = geoJsonSource._data as GeoJSON.FeatureCollection
          if (!currentData) return

          const newFeature = gridCellsToGeoJSON([updatedCell]).features[0] as any
          const newFeatures = [...currentData.features]
          
          const featureIndex = newFeatures.findIndex((f) => (f as any)?.properties?.id === updatedCell.id)

          if (featureIndex !== -1) {
            newFeatures[featureIndex] = newFeature
          } else {
            newFeatures.push(newFeature)
          }

          const newGridData: GeoJSON.FeatureCollection = { ...currentData, features: newFeatures }
          geoJsonSource.setData(newGridData)
          map.triggerRepaint()
        })

        return () => {
          unsubscribe?.()
          map.remove()
          mapRef.current = null
        }
      } catch (error) {
        console.error("Error initializing map:", error)
        setMapError("Failed to initialize map.")
        setIsMapLoading(false)
      }
    }

    initializeMap()
  }, [center, zoom, mapboxLoaded, loadCells])

  return (
    <div
      ref={mapContainer}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "600px",
        background: "linear-gradient(135deg, #d1fae5, #e0f2fe, #ccfbf1)",
        borderRadius: "1rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <link href="https://api.mapbox.com/mapbox-gl-js/v3.1.0/mapbox-gl.css" rel="stylesheet" />

      {showLocationSearch && (
        <div className="absolute left-4 right-4 top-4 z-20 flex justify-center">
          <form onSubmit={handleSearchSubmit} className="w-full max-w-md">
            <div className="flex rounded-xl border border-white/20 bg-white/90 p-2 shadow-lg backdrop-blur-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a location..."
                className="flex-1 bg-transparent px-4 py-2 text-sm text-gray-700 outline-none"
                disabled={isSearching}
              />
              <button
                type="submit"
                disabled={isSearching || !searchQuery.trim()}
                className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors enabled:hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {isSearching ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                    Searching...
                  </>
                ) : (
                  "🔍 Search"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Legend overlay */}
      <div
        style={{
          position: "absolute",
          bottom: "1.25rem",
          right: "1.25rem",
          background: "rgba(255,255,255,0.85)",
          borderRadius: "0.75rem",
          padding: "0.75rem 1rem",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          zIndex: 10,
          minWidth: 180,
        }}
      >
        <div style={{ fontWeight: 600, color: "#111827", marginBottom: 8 }}>Eco Health</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 16, height: 8, background: "#991b1b", borderRadius: 2 }} />
          <span style={{ fontSize: 12, color: "#374151" }}>Critical (0 - 25%)</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
          <div style={{ width: 16, height: 8, background: "#dc2626", borderRadius: 2 }} />
          <span style={{ fontSize: 12, color: "#374151" }}>Poor (25% - 50%)</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
          <div style={{ width: 16, height: 8, background: "#ca8a04", borderRadius: 2 }} />
          <span style={{ fontSize: 12, color: "#374151" }}>Moderate (50% - 75%)</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
          <div style={{ width: 16, height: 8, background: "#16a34a", borderRadius: 2 }} />
          <span style={{ fontSize: 12, color: "#374151" }}>Good (75% - 100%)</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
          <div style={{ width: 16, height: 8, background: "#059669", borderRadius: 2 }} />
          <span style={{ fontSize: 12, color: "#374151" }}>Excellent (100%)</span>
        </div>
      </div>

      {isMapLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-lg bg-gradient-to-br from-emerald-50 via-sky-50 to-teal-50">
          <div className="relative mb-6">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-emerald-500/20 border-t-emerald-500"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 animate-pulse rounded-full bg-emerald-500/20"></div>
            </div>
          </div>
          <p className="mb-1 font-medium text-gray-800">Loading your ecosystem...</p>
          <p className="text-sm text-gray-500">Preparing environmental data</p>
        </div>
      )}
      {mapError && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-red-50 to-orange-50">
          <div className="max-w-sm rounded-3xl border border-white/50 bg-white/40 p-8 text-center backdrop-blur-xl">
            <div className="mb-4 text-5xl">🌍</div>
            <p className="mb-2 text-xl font-bold text-red-700">Unable to Load Map</p>
            <p className="text-sm leading-relaxed text-red-800/80">{mapError}</p>
          </div>
        </div>
      )}
    </div>
  )
}