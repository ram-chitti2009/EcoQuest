"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { getChesterCountryGridCellsInBounds, getChesterCountyHistoricalData } from "../lib/functions"

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
  recorded_at?: string
}

interface SplitScreenMapProps {
  center?: [number, number]
  zoom?: number
  daysAgo: number
  timePeriodLabel: string
  onBoundsChange?: (bounds: { latMin: number; latMax: number; lngMin: number; lngMax: number }) => void
}

export default function SplitScreenMap({ 
  center = [-75.514, 40.036], 
  zoom = 11,
  daysAgo,
  timePeriodLabel,
  onBoundsChange 
}: SplitScreenMapProps) {
  const currentMapContainer = useRef<HTMLDivElement | null>(null)
  const historicalMapContainer = useRef<HTMLDivElement | null>(null)
  const currentMapRef = useRef<any>(null)
  const historicalMapRef = useRef<any>(null)
  
  const [mapboxLoaded, setMapboxLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentCells, setCurrentCells] = useState<ChesterGridCell[]>([])
  const [historicalCells, setHistoricalCells] = useState<ChesterGridCell[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [historicalSnapshotDate, setHistoricalSnapshotDate] = useState<string | null>(null)
  
  const lastBoundsRef = useRef<string>("")
  const isLoadingRef = useRef(false)
  const daysAgoRef = useRef(daysAgo)
  
  // Store event handler references so we can properly remove them
  const clickHandlersRef = useRef<Map<string, any>>(new Map())
  const mouseEnterHandlersRef = useRef<Map<string, any>>(new Map())
  const mouseLeaveHandlersRef = useRef<Map<string, any>>(new Map())

  // Update ref when daysAgo prop changes
  useEffect(() => {
    daysAgoRef.current = daysAgo
  }, [daysAgo])

  // Chester County bounds - memoized to prevent re-creation
  const CHESTER_COUNTY_BOUNDS = useMemo(() => ({
    north: 40.23,
    south: 39.72,
    east: -75.44,
    west: -76.01
  }), [])

  // Check if coordinates are within Chester County
  const isInChesterCounty = useCallback((lat: number, lng: number): boolean => {
    return lat >= CHESTER_COUNTY_BOUNDS.south && 
           lat <= CHESTER_COUNTY_BOUNDS.north && 
           lng >= CHESTER_COUNTY_BOUNDS.west && 
           lng <= CHESTER_COUNTY_BOUNDS.east
  }, [CHESTER_COUNTY_BOUNDS.south, CHESTER_COUNTY_BOUNDS.north, CHESTER_COUNTY_BOUNDS.west, CHESTER_COUNTY_BOUNDS.east])

  // Location search function using Mapbox Geocoding API
  const searchLocation = useCallback(async (query: string) => {
    if (!query.trim() || !mapboxgl || !currentMapRef.current) return

    setIsSearching(true)
    setSearchError(null)

    try {
      // Search within Chester County bounds
      const bbox = `${CHESTER_COUNTY_BOUNDS.west},${CHESTER_COUNTY_BOUNDS.south},${CHESTER_COUNTY_BOUNDS.east},${CHESTER_COUNTY_BOUNDS.north}`
      
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
        `access_token=${mapboxgl.accessToken}&` +
        `bbox=${bbox}&` +
        `limit=5&` +
        `country=us`
      )
      const data = await response.json()
      
      if (data.features && data.features.length > 0) {
        // Filter results to only include those actually in Chester County
        const validFeatures = data.features.filter((feature: any) => {
          const [lng, lat] = feature.center
          return isInChesterCounty(lat, lng)
        })

        if (validFeatures.length > 0) {
          const [lng, lat] = validFeatures[0].center
          
          // Fly both maps to the location
          currentMapRef.current.flyTo({
            center: [lng, lat],
            zoom: 14,
            duration: 2000
          })

          if (historicalMapRef.current) {
            historicalMapRef.current.flyTo({
              center: [lng, lat],
              zoom: 14,
              duration: 2000
            })
          }

          setSearchError(null)
        } else {
          setSearchError("Location not found in Chester County. Please search within Chester County, PA.")
        }
      } else {
        setSearchError("No results found. Try a different search term.")
      }
    } catch (error) {
      console.error("Error searching location:", error)
      setSearchError("Error searching location. Please try again.")
    } finally {
      setIsSearching(false)
    }
  }, [isInChesterCounty, CHESTER_COUNTY_BOUNDS])

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    searchLocation(searchQuery)
  }, [searchQuery, searchLocation])

  // Check if mapbox is loaded
  useEffect(() => {
    const checkMapbox = setInterval(() => {
      if (mapboxgl) {
        setMapboxLoaded(true)
        clearInterval(checkMapbox)
      }
    }, 100)

    return () => clearInterval(checkMapbox)
  }, [])

  // Helper function to convert cells to GeoJSON - memoized to prevent re-creation
  const cellsToGeoJSON = useCallback((cells: ChesterGridCell[], includeTimestamp: boolean = false) => {
    return {
      type: "FeatureCollection",
      features: cells.map((cell) => {
        const score =
          (100 - Math.min(cell.trash_density * 10, 100)) * 0.3 +
          cell.greenery_score * 0.3 +
          cell.cleanliness_score * 0.3 -
          Math.min((cell.carbon_emissions || 0) * 2, 50) * 0.1

        const normalizedScore = Math.max(0, Math.min(100, score))

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
            score: normalizedScore,
            trash: cell.trash_density,
            greenery: cell.greenery_score,
            cleanliness: cell.cleanliness_score,
            carbon: cell.carbon_emissions || 0,
            recorded_at: includeTimestamp && cell.recorded_at ? cell.recorded_at : null,
          },
        }
      }),
    }
  }, [])

  // Get color based on environmental score - memoized to prevent re-creation
  const getScoreColor = useCallback((score: number): string => {
    if (score >= 80) return "#10b981" // Emerald-500 (excellent)
    if (score >= 60) return "#84cc16" // Lime-500 (good)
    if (score >= 40) return "#facc15" // Yellow-400 (fair)
    if (score >= 20) return "#fb923c" // Orange-400 (poor)
    return "#ef4444" // Red-500 (critical)
  }, [])

  // Load data for both maps
  const loadMapData = useCallback(async (bounds: any, forceDaysAgo?: number) => {
    if (isLoadingRef.current) return

    const daysToUse = forceDaysAgo !== undefined ? forceDaysAgo : daysAgoRef.current
    
    const boundsKey = JSON.stringify({
      s: bounds.getSouth(),
      n: bounds.getNorth(),
      w: bounds.getWest(),
      e: bounds.getEast(),
      days: daysToUse
    })
    if (boundsKey === lastBoundsRef.current) return

    isLoadingRef.current = true
    setIsLoading(true)
    lastBoundsRef.current = boundsKey

    try {
      const south = bounds.getSouth()
      const north = bounds.getNorth()
      const west = bounds.getWest()
      const east = bounds.getEast()

      // Load current data
      const currentResult = await getChesterCountryGridCellsInBounds({
        north,
        south,
        east,
        west
      })

      if (currentResult && Array.isArray(currentResult)) {
        console.log('[SplitScreenMap] Loaded', currentResult.length, 'current cells')
        
        // Log sample of current data for debugging
        if (currentResult.length > 0) {
          const sample = currentResult[0]
          console.log(`[SplitScreenMap] Current sample:`, {
            trash: sample.trash_density,
            greenery: sample.greenery_score,
            cleanliness: sample.cleanliness_score
          })
        }
        
        setCurrentCells(currentResult)
      }

      // Load historical data with proper bounds format
      const historicalResult = await getChesterCountyHistoricalData(daysToUse, {
        north,
        south,
        east,
        west
      })

      if (historicalResult && !historicalResult.error && Array.isArray(historicalResult.data)) {
        console.log(`[SplitScreenMap] ===== HISTORICAL DATA LOADED =====`)
        console.log(`[SplitScreenMap] Time period: ${daysToUse} days ago`)
        console.log(`[SplitScreenMap] Total cells: ${historicalResult.data.length}`)
        
        // Log sample of historical data for debugging
        if (historicalResult.data.length > 0) {
          const sample = historicalResult.data[0]
          const avgTrash = historicalResult.data.reduce((sum, c) => sum + c.trash_density, 0) / historicalResult.data.length
          const avgGreenery = historicalResult.data.reduce((sum, c) => sum + c.greenery_score, 0) / historicalResult.data.length
          
          console.log(`[SplitScreenMap] Historical snapshot date: ${sample.recorded_at}`)
          console.log(`[SplitScreenMap] Historical averages - Trash: ${avgTrash.toFixed(2)}, Greenery: ${avgGreenery.toFixed(2)}`)
          console.log(`[SplitScreenMap] Historical sample cell:`, {
            recorded_at: sample.recorded_at,
            trash: sample.trash_density,
            greenery: sample.greenery_score,
            cleanliness: sample.cleanliness_score
          })
          // Store the snapshot date for display
          setHistoricalSnapshotDate(sample.recorded_at)
        }
        
        setHistoricalCells(historicalResult.data)
        console.log(`[SplitScreenMap] ===================================`)
      } else {
        console.warn('[SplitScreenMap] No historical data:', historicalResult?.error)
        setHistoricalCells([])
        setHistoricalSnapshotDate(null)
      }

      if (onBoundsChange) {
        onBoundsChange({
          latMin: south,
          latMax: north,
          lngMin: west,
          lngMax: east,
        })
      }
    } catch (error) {
      console.error("Error loading map data:", error)
    } finally {
      setIsLoading(false)
      isLoadingRef.current = false
    }
  }, [onBoundsChange])

  // Initialize both maps - ONLY once when mapbox loads
  useEffect(() => {
    if (!mapboxLoaded || !mapboxgl) return
    if (currentMapRef.current || historicalMapRef.current) return

    console.log('[SplitScreenMap] Initializing maps...')

    // Initialize current map
    if (currentMapContainer.current) {
      currentMapRef.current = new mapboxgl.Map({
        container: currentMapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: center,
        zoom: zoom,
        pitch: 0,
        bearing: 0,
      })

      currentMapRef.current.on("load", () => {
        console.log('[SplitScreenMap] Current map loaded')
        const bounds = currentMapRef.current.getBounds()
        loadMapData(bounds)
      })

      currentMapRef.current.on("moveend", () => {
        const bounds = currentMapRef.current.getBounds()
        loadMapData(bounds)
        if (historicalMapRef.current) {
          const sourceCenter = currentMapRef.current.getCenter()
          const sourceZoom = currentMapRef.current.getZoom()
          historicalMapRef.current.jumpTo({
            center: sourceCenter,
            zoom: sourceZoom
          })
        }
      })
    }

    // Initialize historical map
    if (historicalMapContainer.current) {
      historicalMapRef.current = new mapboxgl.Map({
        container: historicalMapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: center,
        zoom: zoom,
        pitch: 0,
        bearing: 0,
      })

      historicalMapRef.current.on("load", () => {
        console.log('[SplitScreenMap] Historical map loaded')
      })

      historicalMapRef.current.on("moveend", () => {
        if (currentMapRef.current) {
          const sourceCenter = historicalMapRef.current.getCenter()
          const sourceZoom = historicalMapRef.current.getZoom()
          currentMapRef.current.jumpTo({
            center: sourceCenter,
            zoom: sourceZoom
          })
        }
      })
    }

    return () => {
      console.log('[SplitScreenMap] Cleaning up maps...')
      currentMapRef.current?.remove()
      historicalMapRef.current?.remove()
      currentMapRef.current = null
      historicalMapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapboxLoaded])

  // Helper to update map layers - wrapped in useCallback to prevent re-creation
  const updateMapLayer = useCallback((map: any, cells: ChesterGridCell[], layerId: string) => {
    if (!map || !map.isStyleLoaded()) return
    
    const isHistorical = layerId === "historical"
    console.log('[SplitScreenMap] Updating', layerId, 'layer with', cells.length, 'cells')
    
    const sourceId = `${layerId}-grid-source`
    const fillLayerId = `${layerId}-grid-fill`
    const lineLayerId = `${layerId}-grid-line`

    // Remove old event listeners using stored references
    if (map.getLayer(fillLayerId)) {
      const oldClickHandler = clickHandlersRef.current.get(fillLayerId)
      const oldMouseEnterHandler = mouseEnterHandlersRef.current.get(fillLayerId)
      const oldMouseLeaveHandler = mouseLeaveHandlersRef.current.get(fillLayerId)
      
      if (oldClickHandler) map.off("click", fillLayerId, oldClickHandler)
      if (oldMouseEnterHandler) map.off("mouseenter", fillLayerId, oldMouseEnterHandler)
      if (oldMouseLeaveHandler) map.off("mouseleave", fillLayerId, oldMouseLeaveHandler)
    }

    // Remove existing layers and source
    if (map.getLayer(fillLayerId)) map.removeLayer(fillLayerId)
    if (map.getLayer(lineLayerId)) map.removeLayer(lineLayerId)
    if (map.getSource(sourceId)) map.removeSource(sourceId)

    // Add new source and layers - include timestamp for historical data
    const geojson = cellsToGeoJSON(cells, isHistorical)
    
    map.addSource(sourceId, {
      type: "geojson",
      data: geojson,
    })

    map.addLayer({
      id: fillLayerId,
      type: "fill",
      source: sourceId,
      paint: {
        "fill-color": [
          "interpolate",
          ["linear"],
          ["get", "score"],
          0, "#ef4444",
          20, "#fb923c",
          40, "#facc15",
          60, "#84cc16",
          80, "#10b981"
        ],
        "fill-opacity": 0.6,
      },
    })

    map.addLayer({
      id: lineLayerId,
      type: "line",
      source: sourceId,
      paint: {
        "line-color": "#ffffff",
        "line-width": 0.5,
        "line-opacity": 0.3,
      },
    })

    // Create and store click handler
    const clickHandler = (e: any) => {
      const properties = e.features[0].properties
      
      // Format the recorded_at date if it exists
      const recordedDate = properties.recorded_at 
        ? new Date(properties.recorded_at).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        : null
      
      new mapboxgl.Popup({
        className: 'grid-cell-popup',
        closeButton: true,
        closeOnClick: true,
        closeOnMove: false,
        maxWidth: '300px'
      })
        .setLngLat(e.lngLat)
        .setHTML(`
          <div style="padding: 12px 16px; min-width: 220px; background: white; border-radius: 8px;">
            <h3 style="font-weight: bold; margin-bottom: 10px; color: #111827; font-size: 15px; border-bottom: 2px solid #e5e7eb; padding-bottom: 6px; padding-right: 20px;">
              📊 Cell Details${recordedDate ? ' (Historical)' : ' (Current)'}
            </h3>
            ${recordedDate ? `
            <div style="background: #dbeafe; border-left: 3px solid #3b82f6; padding: 6px 8px; margin-bottom: 8px; border-radius: 4px;">
              <span style="color: #1e40af; font-size: 11px; font-weight: 600;">📅 Snapshot: ${recordedDate}</span>
            </div>
            ` : ''}
            <div style="display: grid; gap: 6px; font-size: 13px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #374151; font-weight: 500;">Score:</span>
                <span style="font-weight: 700; color: ${getScoreColor(properties.score)}; font-size: 14px;">${properties.score.toFixed(1)}/100</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0; border-top: 1px solid #f3f4f6;">
                <span style="color: #111827; font-weight: 500;">🗑️ Trash:</span>
                <span style="font-weight: 600; color: #111827;">${properties.trash.toFixed(1)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0; border-top: 1px solid #f3f4f6;">
                <span style="color: #111827; font-weight: 500;">🌳 Greenery:</span>
                <span style="font-weight: 600; color: #111827;">${properties.greenery.toFixed(1)}%</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0; border-top: 1px solid #f3f4f6;">
                <span style="color: #111827; font-weight: 500;">✨ Clean:</span>
                <span style="font-weight: 600; color: #111827;">${properties.cleanliness.toFixed(1)}%</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0; border-top: 1px solid #f3f4f6;">
                <span style="color: #111827; font-weight: 500;">💨 Carbon:</span>
                <span style="font-weight: 600; color: #111827;">${properties.carbon.toFixed(1)}t</span>
              </div>
            </div>
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb; text-align: center;">
              <span style="color: #9ca3af; font-size: 11px;">Click anywhere to close</span>
            </div>
          </div>
        `)
        .addTo(map)
    }

    // Create and store mouse enter handler
    const mouseEnterHandler = () => {
      map.getCanvas().style.cursor = "pointer"
    }

    // Create and store mouse leave handler
    const mouseLeaveHandler = () => {
      map.getCanvas().style.cursor = ""
    }

    // Store handlers for later removal
    clickHandlersRef.current.set(fillLayerId, clickHandler)
    mouseEnterHandlersRef.current.set(fillLayerId, mouseEnterHandler)
    mouseLeaveHandlersRef.current.set(fillLayerId, mouseLeaveHandler)

    // Add event listeners
    map.on("click", fillLayerId, clickHandler)
    map.on("mouseenter", fillLayerId, mouseEnterHandler)
    map.on("mouseleave", fillLayerId, mouseLeaveHandler)
  }, [cellsToGeoJSON, getScoreColor])

  // Update current map layer
  useEffect(() => {
    if (!currentMapRef.current || currentCells.length === 0) return
    
    const map = currentMapRef.current
    
    if (!map.isStyleLoaded()) {
      map.once("styledata", () => {
        updateMapLayer(map, currentCells, "current")
      })
    } else {
      updateMapLayer(map, currentCells, "current")
    }
  }, [currentCells, updateMapLayer])

  // Update historical map layer
  useEffect(() => {
    if (!historicalMapRef.current || historicalCells.length === 0) return
    
    const map = historicalMapRef.current
    
    if (!map.isStyleLoaded()) {
      map.once("styledata", () => {
        updateMapLayer(map, historicalCells, "historical")
      })
    } else {
      updateMapLayer(map, historicalCells, "historical")
    }
  }, [historicalCells, updateMapLayer])

  // Reload data when daysAgo changes
  useEffect(() => {
    if (!currentMapRef.current) return
    
    console.log('[SplitScreenMap] ========================================')
    console.log('[SplitScreenMap] TIME PERIOD CHANGED!')
    console.log('[SplitScreenMap] New daysAgo value:', daysAgo)
    console.log('[SplitScreenMap] Clearing cached data and reloading...')
    console.log('[SplitScreenMap] ========================================')
    
    // Reset the bounds key to force reload
    lastBoundsRef.current = ""
    isLoadingRef.current = false
    
    // Clear current data to show loading state
    setHistoricalCells([])
    setHistoricalSnapshotDate(null)
    
    // Trigger a reload by getting current bounds and calling loadMapData
    const bounds = currentMapRef.current.getBounds()
    loadMapData(bounds, daysAgo)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [daysAgo])

  return (
    <div className="relative w-full h-full">
      {/* Location Search Bar */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 w-full max-w-md px-4">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search locations in Chester County..."
            className="w-full px-4 py-3 pr-24 rounded-lg shadow-lg border-2 border-gray-200 focus:border-emerald-500 focus:outline-none text-sm font-medium text-gray-900 placeholder-gray-500"
            disabled={isSearching}
          />
          <button
            type="submit"
            disabled={isSearching || !searchQuery.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSearching ? "🔍" : "Search"}
          </button>
        </form>
        {searchError && (
          <div className="mt-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            <p className="text-xs text-red-800 font-medium">{searchError}</p>
          </div>
        )}
      </div>

      {/* Split screen container */}
      <div className="grid grid-cols-2 gap-2 h-full">
        {/* Current map */}
        <div className="relative h-full">
          <div className="absolute top-4 left-4 z-10 bg-white px-4 py-2 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-bold text-gray-900">Today</span>
            </div>
          </div>
          <div ref={currentMapContainer} className="w-full h-full" />
        </div>

        {/* Historical map */}
        <div className="relative h-full">
          <div className="absolute top-4 left-4 z-10 bg-white px-4 py-2 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div>
                <span className="text-sm font-bold text-gray-900">{timePeriodLabel} Ago</span>
                {historicalSnapshotDate && (
                  <p className="text-xs text-gray-500">
                    Snapshot: {new Date(historicalSnapshotDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
          {historicalCells.length === 0 && !isLoading && (
            <div className="absolute top-16 left-4 right-4 z-10 bg-yellow-50 border border-yellow-200 px-4 py-3 rounded-lg shadow-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ No historical data available for this period
              </p>
            </div>
          )}
          <div ref={historicalMapContainer} className="w-full h-full" />
        </div>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-3"></div>
            <p className="text-sm font-medium text-gray-700">Loading comparison data...</p>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-white px-4 py-3 rounded-lg shadow-lg">
        <div className="flex items-center gap-4">
          <span className="text-xs font-medium text-gray-700">Environmental Health:</span>
          <div className="flex items-center gap-2">
            <div className="w-6 h-3 bg-red-500 rounded"></div>
            <span className="text-xs text-gray-600">Poor</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-3 bg-yellow-400 rounded"></div>
            <span className="text-xs text-gray-600">Fair</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-3 bg-emerald-500 rounded"></div>
            <span className="text-xs text-gray-600">Good</span>
          </div>
        </div>
      </div>
    </div>
  )
}
