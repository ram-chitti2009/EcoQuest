"use client"

import React, { useState, useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts"
import { TrendingUp, TrendingDown, Eye, EyeOff, Download, Filter } from "lucide-react"

interface DataVisualizationProps {
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

const DataVisualization: React.FC<DataVisualizationProps> = ({
  regionMetrics,
  historicalComparison,
  healthScore,
  isLoading = false
}) => {
  const [activeTab, setActiveTab] = useState("overview")
  const [showHistorical, setShowHistorical] = useState(true)
  const [selectedMetric, setSelectedMetric] = useState("all")

  // Prepare data for different chart types
  const chartData = useMemo(() => {
    const baseData = [
      { name: "Trash Density", value: regionMetrics.avgTrash, unit: "units", color: "#ef4444" },
      { name: "Cleanliness", value: regionMetrics.avgCleanliness, unit: "%", color: "#3b82f6" },
      { name: "Greenery", value: regionMetrics.avgGreenery, unit: "%", color: "#10b981" },
      { name: "Carbon Emissions", value: regionMetrics.avgCarbon, unit: "tons", color: "#f59e0b" }
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

  // Radar chart data
  const radarData = useMemo(() => {
    const maxValues = {
      trash: 10,
      cleanliness: 100,
      greenery: 100,
      carbon: 10
    }

    return [
      {
        metric: "Trash",
        current: Math.min(100, (regionMetrics.avgTrash / maxValues.trash) * 100),
        historical: historicalComparison ? Math.min(100, (historicalComparison.historical.avgTrash / maxValues.trash) * 100) : 0
      },
      {
        metric: "Cleanliness",
        current: regionMetrics.avgCleanliness,
        historical: historicalComparison ? historicalComparison.historical.avgCleanliness : 0
      },
      {
        metric: "Greenery",
        current: regionMetrics.avgGreenery,
        historical: historicalComparison ? historicalComparison.historical.avgGreenery : 0
      },
      {
        metric: "Carbon",
        current: Math.min(100, (regionMetrics.avgCarbon / maxValues.carbon) * 100),
        historical: historicalComparison ? Math.min(100, (historicalComparison.historical.avgCarbon / maxValues.carbon) * 100) : 0
      }
    ]
  }, [regionMetrics, historicalComparison])

  // Pie chart data for health score breakdown
  const pieData = useMemo(() => {
    const trashScore = Math.max(0, 100 - regionMetrics.avgTrash * 10)
    const cleanScore = regionMetrics.avgCleanliness
    const greenScore = regionMetrics.avgGreenery
    const carbonScore = Math.max(0, 100 - regionMetrics.avgCarbon * 2)
    
    return [
      { name: "Trash Impact", value: trashScore, color: "#ef4444" },
      { name: "Cleanliness", value: cleanScore, color: "#3b82f6" },
      { name: "Greenery", value: greenScore, color: "#10b981" },
      { name: "Carbon Impact", value: carbonScore, color: "#f59e0b" }
    ]
  }, [regionMetrics])

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "trends", label: "Trends", icon: "📈" },
    { id: "comparison", label: "Comparison", icon: "⚖️" },
    { id: "radar", label: "Radar", icon: "🎯" }
  ]

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
    <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">📊</span>
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
        {tabs.map((tab) => (
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
      <div className="h-80">
        {activeTab === "overview" && (
          <div className="h-full">
            <h4 className="text-sm font-medium text-gray-700 mb-4">Environmental Metrics Overview</h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  stroke="#6b7280"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: number, name: string, props: any) => [
                    `${value.toFixed(1)}${props.payload.unit}`,
                    name
                  ]}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                {showHistorical && historicalComparison && (
                  <Bar dataKey="historical" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeTab === "trends" && (
          <div className="h-full">
            <h4 className="text-sm font-medium text-gray-700 mb-4">Health Score Breakdown</h4>
            <div className="grid grid-cols-2 gap-4 h-full">
              <div>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [`${value.toFixed(1)}%`, "Score"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600">{healthScore}%</div>
                  <div className="text-sm text-gray-600">Overall Health Score</div>
                </div>
                <div className="space-y-2">
                  {pieData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-gray-700">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium">{item.value.toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "comparison" && historicalComparison && (
          <div className="h-full">
            <h4 className="text-sm font-medium text-gray-700 mb-4">Historical Comparison</h4>
            <div className="space-y-4">
              {chartData.map((item, index) => (
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
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Current: {formatValue(item.value, item.unit)}</span>
                    <span>Historical: {formatValue(item.historical, item.unit)}</span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ 
                        backgroundColor: item.color,
                        width: `${Math.min(100, (item.value / (item.name === "Trash Density" || item.name === "Carbon Emissions" ? 10 : 100)) * 100)}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "radar" && (
          <div className="h-full">
            <h4 className="text-sm font-medium text-gray-700 mb-4">Environmental Radar</h4>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="metric" stroke="#6b7280" fontSize={12} />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]} 
                  stroke="#6b7280" 
                  fontSize={10}
                />
                <Radar
                  name="Current"
                  dataKey="current"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                {showHistorical && historicalComparison && (
                  <Radar
                    name="Historical"
                    dataKey="historical"
                    stroke="#94a3b8"
                    fill="#94a3b8"
                    fillOpacity={0.2}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                )}
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: number, name: string) => [
                    `${value.toFixed(1)}%`,
                    name
                  ]}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-emerald-50 rounded-lg">
          <div className="text-2xl font-bold text-emerald-600">{healthScore}%</div>
          <div className="text-xs text-emerald-700">Health Score</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{regionMetrics.totalCells}</div>
          <div className="text-xs text-blue-700">Grid Cells</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{regionMetrics.avgGreenery.toFixed(0)}%</div>
          <div className="text-xs text-green-700">Greenery</div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{regionMetrics.avgCarbon.toFixed(1)}t</div>
          <div className="text-xs text-orange-700">Carbon</div>
        </div>
      </div>
    </div>
  )
}

export default DataVisualization
