"use client"

import React from "react"
import { TrendingUp, TrendingDown, Leaf, Droplets, Wind, Trash2 } from "lucide-react"

interface AnalyticsDashboardProps {
  regionMetrics: {
    avgTrash: number
    avgCleanliness: number
    avgGreenery: number
    avgCarbon: number
    totalCells: number
  }
  historicalComparison: {
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
  } | null
  healthScore: number
  isLoading: boolean
  isComparingData: boolean
  viewMode: "live" | "compare"
  onToggleCollapse: () => void
  isCollapsed: boolean
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  regionMetrics,
  historicalComparison,
  healthScore,
  isLoading,
  isComparingData,
  viewMode,
  onToggleCollapse,
  isCollapsed
}) => {
  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-500" />
    return <div className="w-4 h-4" />
  }

  const getTrendColor = (change: number, isPositive: boolean = true) => {
    const isGood = isPositive ? change > 0 : change < 0
    return isGood ? "text-green-600" : "text-red-600"
  }

  const formatValue = (value: number, decimals: number = 1) => {
    return value.toFixed(decimals)
  }

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  if (isCollapsed) {
    return (
      <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-4">
        <button
          onClick={onToggleCollapse}
          className="flex items-center justify-between w-full text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"></div>
            <span className="font-semibold text-gray-800">Environmental Analytics</span>
          </div>
          <div className="text-2xl font-bold text-emerald-600">{healthScore}%</div>
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"></div>
          <h2 className="text-xl font-bold text-gray-800">Environmental Analytics</h2>
        </div>
        <button
          onClick={onToggleCollapse}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Health Score */}
      <div className="mb-6 p-4 bg-gradient-to-br from-emerald-50 to-sky-50 rounded-xl border border-emerald-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Overall Health Score</span>
          {isLoading && <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>}
        </div>
        <div className="text-3xl font-bold text-emerald-600">{healthScore}%</div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${healthScore}%` }}
          ></div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Trash Density */}
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <Trash2 className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-red-800">Trash Density</span>
            {viewMode === "compare" && historicalComparison && (
              <div className="flex items-center gap-1">
                {getTrendIcon(historicalComparison.change.trash)}
                <span className={`text-xs ${getTrendColor(historicalComparison.change.trash, false)}`}>
                  {formatPercentage(historicalComparison.change.trash)}
                </span>
              </div>
            )}
          </div>
          <div className="text-2xl font-bold text-red-600">
            {formatValue(regionMetrics.avgTrash)}
          </div>
          <div className="text-xs text-red-600 mt-1">
            {regionMetrics.totalCells} cells analyzed
          </div>
        </div>

        {/* Greenery Score */}
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <Leaf className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">Greenery</span>
            {viewMode === "compare" && historicalComparison && (
              <div className="flex items-center gap-1">
                {getTrendIcon(historicalComparison.change.greenery)}
                <span className={`text-xs ${getTrendColor(historicalComparison.change.greenery)}`}>
                  {formatPercentage(historicalComparison.change.greenery)}
                </span>
              </div>
            )}
          </div>
          <div className="text-2xl font-bold text-green-600">
            {formatValue(regionMetrics.avgGreenery, 0)}%
          </div>
          <div className="text-xs text-green-600 mt-1">
            Vegetation coverage
          </div>
        </div>

        {/* Cleanliness Score */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Cleanliness</span>
            {viewMode === "compare" && historicalComparison && (
              <div className="flex items-center gap-1">
                {getTrendIcon(historicalComparison.change.cleanliness)}
                <span className={`text-xs ${getTrendColor(historicalComparison.change.cleanliness)}`}>
                  {formatPercentage(historicalComparison.change.cleanliness)}
                </span>
              </div>
            )}
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {formatValue(regionMetrics.avgCleanliness, 0)}%
          </div>
          <div className="text-xs text-blue-600 mt-1">
            Environmental cleanliness
          </div>
        </div>

        {/* Carbon Emissions */}
        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <Wind className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-800">Carbon</span>
            {viewMode === "compare" && historicalComparison && (
              <div className="flex items-center gap-1">
                {getTrendIcon(historicalComparison.change.carbon)}
                <span className={`text-xs ${getTrendColor(historicalComparison.change.carbon, false)}`}>
                  {formatPercentage(historicalComparison.change.carbon)}
                </span>
              </div>
            )}
          </div>
          <div className="text-2xl font-bold text-orange-600">
            {formatValue(regionMetrics.avgCarbon, 1)}t
          </div>
          <div className="text-xs text-orange-600 mt-1">
            CO₂ emissions
          </div>
        </div>
      </div>

      {/* Comparison Status */}
      {viewMode === "compare" && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-800">Historical Comparison</span>
          </div>
          {isComparingData ? (
            <div className="text-sm text-blue-600">Loading historical data...</div>
          ) : historicalComparison ? (
            <div className="text-sm text-blue-600">
              Comparing with historical data - showing trends and changes
            </div>
          ) : (
            <div className="text-sm text-orange-600">
              No historical data available for comparison
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AnalyticsDashboard
