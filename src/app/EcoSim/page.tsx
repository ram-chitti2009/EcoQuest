"use client"

import React, { useState, useCallback, useEffect, useMemo } from "react"
import { Calendar, MapPin, BarChart3 } from "lucide-react"

import Header from "../components/Header"
import SideBar from "../components/Sidebar"
import StableEcoSimMap from "./components/StableEcoSimMap"
import PerformanceMonitor from "./components/PerformanceMonitor"
import AnalyticsDashboard from "./components/AnalyticsDashboard"
import SimpleTimeSeriesChart from "./components/SimpleTimeSeriesChart"
import ExportPanel from "./components/ExportPanel"
import SimpleDataVisualization from "./components/SimpleDataVisualization"
import ErrorBoundary from "./components/ErrorBoundary"
// import { MapLoadingState, DataLoadingState, SimulationLoadingState } from "./components/LoadingStates"
import { useRegionMetricsCache, useHistoricalDataCache } from "./hooks/useDataCache"
import { usePerformanceOptimization } from "./hooks/usePerformanceOptimization"

import { getRegionMetrics, compareChesterCountyMetrics, debugHistoricalData, getChesterCountyHistoricalData } from "./lib/functions"

type ViewMode = "live" | "compare"
type TimePeriod = "week" | "month" | "180days" | "year"

// Real time series data from database
const getTimeSeriesData = async (days: number, bounds: { latMin: number; latMax: number; lngMin: number; lngMax: number }) => {
  try {
    // Get historical data for the specified period
    const historicalData = await getChesterCountyHistoricalData(days, {
      north: bounds.latMax,
      south: bounds.latMin,
      east: bounds.lngMax,
      west: bounds.lngMin
    })
    
    if (historicalData.error || !historicalData.data) {
      console.warn('No historical data available, using current data')
      return []
    }
    
    // Process historical data into time series format
    const timeSeriesData = historicalData.data.map((record: {
      recorded_at: string
      trash_density?: number
      cleanliness_score?: number
      greenery_score?: number
      carbon_emissions?: number
    }) => ({
      date: new Date(record.recorded_at).toISOString().split('T')[0],
      trash: record.trash_density || 0,
      cleanliness: record.cleanliness_score || 0,
      greenery: record.greenery_score || 0,
      carbon: record.carbon_emissions || 0
    }))
    
    return timeSeriesData
  } catch (error) {
    console.error('Error fetching time series data:', error)
    return []
  }
}

function EcoSimPageContent() {
  // State management
  const [regionMetrics, setRegionMetrics] = useState({
    avgTrash: 0,
    avgCleanliness: 0,
    avgGreenery: 0,
    avgCarbon: 0,
    totalCells: 0,
  })

  const [historicalComparison, setHistoricalComparison] = useState<{
    current: {
      avgTrash: number
      avgCleanliness: number
      avgGreenery: number
      avgCarbon: number
      totalCells: number
    }
    historical: {
      avgTrash: number
      avgCleanliness: number
      avgGreenery: number
      avgCarbon: number
      totalCells: number
    }
    change: {
      trash: number
      cleanliness: number
      greenery: number
      carbon: number
    }
  } | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [isComparingData, setIsComparingData] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>("live")
  const [isAnalyticsCollapsed, setIsAnalyticsCollapsed] = useState(false)
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("week")
  const [currentBounds, setCurrentBounds] = useState({
    latMin: -90,
    latMax: 90,
    lngMin: -180,
    lngMax: 180,
  })
  const [selectedMetric, setSelectedMetric] = useState("all")
  const [timeSeriesData, setTimeSeriesData] = useState<Array<{
    date: string
      trash: number
      cleanliness: number
      greenery: number
      carbon: number
  }>>([])
  const [isLoadingTimeSeries, setIsLoadingTimeSeries] = useState(false)

  // Performance optimization
  const {
    useDebounce,
    startDataLoadTimer,
    endDataLoadTimer
  } = usePerformanceOptimization({
    debounceMs: 500,
    throttleMs: 200,
    enableVirtualization: true,
    enableLazyLoading: true
  })

  // Calculate environmental health score - memoized for performance
  const healthScore = useMemo(() => {
    const trashScore = Math.max(0, 100 - regionMetrics.avgTrash * 10)
    const cleanScore = regionMetrics.avgCleanliness
    const greenScore = regionMetrics.avgGreenery
    const carbonScore = Math.max(0, 100 - regionMetrics.avgCarbon * 2)
    return Math.round((trashScore + cleanScore + greenScore + carbonScore) / 4)
  }, [regionMetrics.avgTrash, regionMetrics.avgCleanliness, regionMetrics.avgGreenery, regionMetrics.avgCarbon])


  // Memoized time series data loading with better caching
  const timeSeriesKey = useMemo(() => 
    `timeseries_${timePeriod}_${currentBounds.latMin}_${currentBounds.latMax}_${currentBounds.lngMin}_${currentBounds.lngMax}`,
    [timePeriod, currentBounds]
  )

  // Load real time series data from database with caching
  useEffect(() => {
    const loadTimeSeriesData = async () => {
      // Check if we already have data for this key
      const cachedData = sessionStorage.getItem(timeSeriesKey)
      if (cachedData) {
        try {
          setTimeSeriesData(JSON.parse(cachedData))
          return
        } catch (error) {
          console.warn('Failed to parse cached time series data:', error)
        }
      }

      setIsLoadingTimeSeries(true)
      try {
        const days = timePeriod === "week" ? 7 : 
                   timePeriod === "month" ? 30 : 
                   timePeriod === "180days" ? 180 : 365
        
        const data = await getTimeSeriesData(days, currentBounds)
        setTimeSeriesData(data)
        
        // Cache the data
        try {
          sessionStorage.setItem(timeSeriesKey, JSON.stringify(data))
        } catch (error) {
          console.warn('Failed to cache time series data:', error)
        }
      } catch (error) {
        console.error('Error loading time series data:', error)
        setTimeSeriesData([])
      } finally {
        setIsLoadingTimeSeries(false)
      }
    }

    loadTimeSeriesData()
  }, [timePeriod, currentBounds, timeSeriesKey])


  // Use cached data loading for better performance
  const { data: cachedRegionMetrics, isLoading: isCachedLoading, refetch: refetchRegionMetrics } = useRegionMetricsCache(
    currentBounds,
    () => getRegionMetrics(currentBounds)
  )

  // Memoized loading state to prevent unnecessary re-renders
  const isLoadingData = useMemo(() => 
    isLoading || isCachedLoading || isComparingData || isLoadingTimeSeries,
    [isLoading, isCachedLoading, isComparingData, isLoadingTimeSeries]
  )

  // Handle bounds changes from the map with performance optimization
  const debouncedBoundsChange = useDebounce(async (bounds: { latMin: number; latMax: number; lngMin: number; lngMax: number }) => {
    setCurrentBounds(bounds)
    try {
      startDataLoadTimer()
      setIsLoading(true)
      const metrics = await getRegionMetrics(bounds)
      if (metrics) setRegionMetrics(metrics)
    } catch (error) {
      console.error("Failed to load region metrics:", error)
    } finally {
      endDataLoadTimer()
      setIsLoading(false)
    }
  }, 200) // Faster debounce for more responsive UX

  const handleBoundsChange = useCallback(debouncedBoundsChange, [debouncedBoundsChange])

  // Load initial metrics with caching
  useEffect(() => {
    if (cachedRegionMetrics) {
      setRegionMetrics(cachedRegionMetrics)
      setIsLoading(false)
    } else if (!isCachedLoading) {
      // Only fetch if not already loading from cache
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
    }
  }, [cachedRegionMetrics, isCachedLoading, currentBounds])

  // Use cached historical data for better performance
  const periodDays = {
    week: 7,
    month: 30,
    "180days": 180,
    year: 365,
  }
  const daysAgo = periodDays[timePeriod]
  
  const { data: cachedHistoricalData, isLoading: isHistoricalLoading, refetch: refetchHistoricalData } = useHistoricalDataCache(
    daysAgo,
    currentBounds,
    () => compareChesterCountyMetrics(daysAgo, {
      north: currentBounds.latMax,
      south: currentBounds.latMin,
      east: currentBounds.lngMax,
      west: currentBounds.lngMin,
    }).then(result => result.data)
  )

  // Load historical comparison data when in compare mode
  useEffect(() => {
    if (viewMode !== "compare") {
      setHistoricalComparison(null)
      return
    }

    if (cachedHistoricalData) {
      setHistoricalComparison(cachedHistoricalData)
      setIsComparingData(false)
    } else if (!isHistoricalLoading) {
      async function loadHistoricalComparison() {
      try {
        setIsComparingData(true)
        
        // Debug: Check what historical data is available
        console.log('=== RUNNING DEBUG CHECK ===')
        await debugHistoricalData()
        
        console.log(`Attempting to compare with ${daysAgo} days ago (${timePeriod})`)
        
        const comparison = await compareChesterCountyMetrics(daysAgo, {
          north: currentBounds.latMax,
          south: currentBounds.latMin,
          east: currentBounds.lngMax,
          west: currentBounds.lngMin,
        })
        
        if (comparison.data) {
          setHistoricalComparison(comparison.data)
          console.log('Historical comparison loaded:', comparison.data)
        } else {
          console.log('No historical data available:', comparison.error)
          setHistoricalComparison(null)
        }
      } catch (error) {
        console.error("Failed to load historical comparison:", error)
        setHistoricalComparison(null)
      } finally {
        setIsComparingData(false)
      }
    }
    
    loadHistoricalComparison()
    }
  }, [viewMode, timePeriod, currentBounds, cachedHistoricalData, isHistoricalLoading, daysAgo])


  // Handle export
  const handleExport = async (format: string, data: {
    timestamp: string
    regionMetrics: typeof regionMetrics
    historicalComparison: typeof historicalComparison
    healthScore: number
    metadata: {
      version: string
      source: string
      generatedBy: string
    }
  }) => {
    console.log(`Exporting ${format}:`, data)
    // Export logic would be implemented here
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-sky-50 to-teal-50">
        <Header />
        <div className="flex">
          <SideBar />
          
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Chester County EcoSim</h1>
                  <p className="text-gray-600">Environmental Impact Simulation & Analytics</p>
                </div>
              </div>
              
              {/* Controls */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">View Mode:</span>
                </div>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("live")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === "live"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Live Data
                  </button>
                  <button
                    onClick={() => setViewMode("compare")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === "compare"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Historical Compare
                  </button>
                </div>
                
                {viewMode === "compare" && (
                  <>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Period:</span>
                    </div>
                    <select
                      value={timePeriod}
                      onChange={(e) => setTimePeriod(e.target.value as TimePeriod)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="week">Last Week</option>
                      <option value="month">Last Month</option>
                      <option value="180days">Last 6 Months</option>
                      <option value="year">Last Year</option>
                    </select>
                  </>
                )}
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
              {/* Left Column - Map */}
              <div className="lg:col-span-2">
                <div className="h-[600px] max-h-[800px] rounded-xl overflow-hidden shadow-lg relative">
                  <StableEcoSimMap
                    center={[-75.514, 40.036]}
                    zoom={12}
                    onBoundsChange={handleBoundsChange}
                    showLocationSearch={true}
                  />
                </div>
                
                {/* Time Series Chart */}
                <div className="mt-6">
                  <SimpleTimeSeriesChart
                    data={timeSeriesData}
                    selectedMetric={selectedMetric}
                    onMetricSelect={setSelectedMetric}
                    isLoading={isLoadingTimeSeries}
                  />
                </div>

                {/* Data Visualization */}
                <div className="mt-6">
                  <SimpleDataVisualization
                    regionMetrics={regionMetrics}
                    historicalComparison={historicalComparison}
                    healthScore={healthScore}
                    isLoading={isLoading}
                  />
                </div>
              </div>

              {/* Right Column - Analytics & Tools */}
              <div className="space-y-6">
                {/* Analytics Dashboard */}
                <AnalyticsDashboard
                  regionMetrics={regionMetrics}
                  historicalComparison={historicalComparison}
                  healthScore={healthScore}
                  isLoading={isLoading}
                  isComparingData={isComparingData}
                  viewMode={viewMode}
                  onToggleCollapse={() => setIsAnalyticsCollapsed(!isAnalyticsCollapsed)}
                  isCollapsed={isAnalyticsCollapsed}
                />

                {/* Export Panel */}
                <ExportPanel
                  regionMetrics={regionMetrics}
                  historicalComparison={historicalComparison}
                  healthScore={healthScore}
                  onExport={handleExport}
                />
              </div>
            </div>

          </div>
        </main>
        </div>
      </div>
      
      {/* Performance Monitor - Development Only */}
      <PerformanceMonitor />
    </ErrorBoundary>
  )
}

export default function EcoSimPage() {
  return <EcoSimPageContent />
}