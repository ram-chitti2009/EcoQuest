"use client"

import React, { useState, useMemo } from "react"
import { TrendingUp, TrendingDown, Eye, EyeOff, Download, BarChart3, PieChart, Activity } from "lucide-react"

interface SimpleDataVisualizationProps {
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
  isLoading?: boolean
}

const SimpleDataVisualization: React.FC<SimpleDataVisualizationProps> = ({
  regionMetrics,
  historicalComparison,
  healthScore,
  isLoading = false
}) => {
  const [activeTab, setActiveTab] = useState("overview")
  const [showHistorical, setShowHistorical] = useState(true)

  // Prepare data for visualization
  const chartData = useMemo(() => {
    const baseData = [
      { name: "Trash Density", value: regionMetrics.avgTrash, unit: "units", color: "#ef4444", max: 10 },
      { name: "Cleanliness", value: regionMetrics.avgCleanliness, unit: "%", color: "#3b82f6", max: 100 },
      { name: "Greenery", value: regionMetrics.avgGreenery, unit: "%", color: "#10b981", max: 100 },
      { name: "Carbon Emissions", value: regionMetrics.avgCarbon, unit: "tons", color: "#f59e0b", max: 10 }
    ]

    if (historicalComparison && showHistorical) {
      return baseData.map(item => ({
        ...item,
        historical: historicalComparison.historical[item.name.toLowerCase().replace(/\s+/g, '') as keyof typeof historicalComparison.historical] || 0,
        change: historicalComparison.change[item.name.toLowerCase().replace(/\s+/g, '') as keyof typeof historicalComparison.change] || 0
      }))
    }

    return baseData
  }, [regionMetrics, historicalComparison, showHistorical])

  const formatValue = (value: number, unit: string) => {
    if (unit === "%") return `${value.toFixed(0)}%`
    if (unit === "tons") return `${value.toFixed(1)}t`
    return value.toFixed(1)
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-500" />
    return <div className="w-4 h-4" />
  }

  const getChangeColor = (change: number, isPositive: boolean = true) => {
    const isGood = isPositive ? change > 0 : change < 0
    return isGood ? "text-green-600" : "text-red-600"
  }

  if (isLoading) {
    return (
      <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600">Loading visualization data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6 overflow-hidden max-w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Data Visualization</h3>
        </div>
        
        <div className="flex items-center gap-2">
          {historicalComparison && (
            <button
              onClick={() => setShowHistorical(!showHistorical)}
              className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                showHistorical
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {showHistorical ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              Historical
            </button>
          )}
          
          <button className="flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1">
        {[
          { id: "overview", label: "Overview", icon: "📊" },
          { id: "trends", label: "Trends", icon: "📈" },
          { id: "comparison", label: "Comparison", icon: "⚖️" },
          { id: "radar", label: "Radar", icon: "🎯" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === "overview" && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-4">Environmental Metrics Overview</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {chartData.map((item, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800">{item.name}</span>
                    <span className="text-lg font-bold" style={{ color: item.color }}>
                      {formatValue(item.value, item.unit)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ 
                        backgroundColor: item.color,
                        width: `${Math.min(100, (item.value / item.max) * 100)}%`
                      }}
                    />
                  </div>
                  {showHistorical && historicalComparison && (() => {
                    const itemKey = item.name.toLowerCase().replace(/\s+/g, '') as keyof typeof historicalComparison.change;
                    const change = historicalComparison.change[itemKey] || 0;
                    return (
                      <div className="flex items-center gap-2 mt-2">
                        {getChangeIcon(change)}
                        <span className={`text-sm ${getChangeColor(change, item.name !== "Trash Density" && item.name !== "Carbon Emissions")}`}>
                          {change > 0 ? '+' : ''}{change.toFixed(1)}%
                        </span>
                      </div>
                    );
                  })()}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "trends" && (
          <div className="overflow-hidden">
            <h4 className="text-sm font-medium text-gray-700 mb-4">Health Score Breakdown</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-full">
              <div className="space-y-4 min-w-0">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">{healthScore}%</div>
                  <div className="text-sm text-gray-600">Overall Health Score</div>
                </div>
                <div className="space-y-3">
                  {[
                    { name: "Trash Impact", value: Math.max(0, 100 - regionMetrics.avgTrash * 10), color: "#ef4444" },
                    { name: "Cleanliness", value: regionMetrics.avgCleanliness, color: "#3b82f6" },
                    { name: "Greenery", value: regionMetrics.avgGreenery, color: "#10b981" },
                    { name: "Carbon Impact", value: Math.max(0, 100 - regionMetrics.avgCarbon * 2), color: "#f59e0b" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between min-w-0">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div 
                          className="w-3 h-3 rounded-full flex-shrink-0" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-gray-700 truncate">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium flex-shrink-0 ml-2">{item.value.toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-24 h-24 relative">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="#e5e7eb"
                      strokeWidth="6"
                      fill="none"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="#10b981"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={`${(healthScore / 100) * 251.2} 251.2`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-emerald-600">{healthScore}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "comparison" && historicalComparison && (() => {
          const comparisonData = chartData.map(item => {
            const itemKey = item.name.toLowerCase().replace(/\s+/g, '') as keyof typeof historicalComparison.change;
            return {
              ...item,
              historical: historicalComparison.historical[itemKey as keyof typeof historicalComparison.historical] || 0,
              change: historicalComparison.change[itemKey] || 0
            };
          });
          
          return (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-4">Historical Comparison</h4>
              <div className="space-y-4">
                {comparisonData.map((item, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-800">{item.name}</span>
                      <div className="flex items-center gap-2">
                        {getChangeIcon(item.change)}
                        <span className={`text-sm font-medium ${getChangeColor(item.change, item.name !== "Trash Density" && item.name !== "Carbon Emissions")}`}>
                          {item.change > 0 ? '+' : ''}{item.change.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>Current: {formatValue(item.value, item.unit)}</span>
                      <span>Historical: {formatValue(item.historical, item.unit)}</span>
                    </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ 
                        backgroundColor: item.color,
                        width: `${Math.min(100, (item.value / item.max) * 100)}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          );
        })()}

        {activeTab === "radar" && (
          <div className="overflow-hidden">
            <h4 className="text-sm font-medium text-gray-700 mb-4">Environmental Radar</h4>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-full">
              {[
                { name: "Trash", value: Math.min(100, (regionMetrics.avgTrash / 10) * 100), color: "#ef4444" },
                { name: "Cleanliness", value: regionMetrics.avgCleanliness, color: "#3b82f6" },
                { name: "Greenery", value: regionMetrics.avgGreenery, color: "#10b981" },
                { name: "Carbon", value: Math.min(100, (regionMetrics.avgCarbon / 10) * 100), color: "#f59e0b" }
              ].map((item, index) => (
                <div key={index} className="text-center p-3 bg-gray-50 rounded-lg min-w-0">
                  <div className="w-12 h-12 mx-auto mb-2 relative">
                    <svg className="w-12 h-12 transform -rotate-90">
                      <circle
                        cx="24"
                        cy="24"
                        r="18"
                        stroke="#e5e7eb"
                        strokeWidth="3"
                        fill="none"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r="18"
                        stroke={item.color}
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray={`${(item.value / 100) * 113.1} 113.1`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold" style={{ color: item.color }}>
                        {item.value.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <div className="text-xs font-medium text-gray-800 truncate">{item.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 overflow-hidden">
        <div className="text-center p-3 bg-emerald-50 rounded-lg min-w-0">
          <div className="text-xl font-bold text-emerald-600">{healthScore}%</div>
          <div className="text-xs text-emerald-700 truncate">Health Score</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg min-w-0">
          <div className="text-xl font-bold text-blue-600">{regionMetrics.totalCells}</div>
          <div className="text-xs text-blue-700 truncate">Grid Cells</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg min-w-0">
          <div className="text-xl font-bold text-green-600">{regionMetrics.avgGreenery.toFixed(0)}%</div>
          <div className="text-xs text-green-700 truncate">Greenery</div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg min-w-0">
          <div className="text-xl font-bold text-orange-600">{regionMetrics.avgCarbon.toFixed(1)}t</div>
          <div className="text-xs text-orange-700 truncate">Carbon</div>
        </div>
      </div>
    </div>
  )
}

export default SimpleDataVisualization
