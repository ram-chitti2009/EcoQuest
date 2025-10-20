"use client"

import React, { useState, useMemo } from "react"
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react"

interface SimpleTimeSeriesChartProps {
  data: Array<{
    date: string
    trash: number
    cleanliness: number
    greenery: number
    carbon: number
  }>
  isLoading?: boolean
  selectedMetric?: string
  onMetricSelect?: (metric: string) => void
}

const SimpleTimeSeriesChart: React.FC<SimpleTimeSeriesChartProps> = ({
  data,
  isLoading = false,
  selectedMetric = "all",
  onMetricSelect
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)

  const chartData = useMemo(() => {
    return data.map(item => ({
      ...item,
      date: new Date(item.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    }))
  }, [data])

  const metrics = [
    { key: 'trash', label: 'Trash Density', color: '#ef4444' },
    { key: 'cleanliness', label: 'Cleanliness', color: '#3b82f6' },
    { key: 'greenery', label: 'Greenery', color: '#10b981' },
    { key: 'carbon', label: 'Carbon Emissions', color: '#f59e0b' }
  ]

  const formatValue = (value: number, metric: string) => {
    if (metric === 'carbon') return `${value.toFixed(1)}t`
    if (metric === 'trash') return value.toFixed(1)
    return `${value.toFixed(0)}%`
  }

  const getMaxValue = (metric: string) => {
    if (metric === 'trash' || metric === 'carbon') return 10
    return 100
  }

  const getBarHeight = (value: number, metric: string) => {
    const max = getMaxValue(metric)
    return Math.min(100, (value / max) * 100)
  }

  if (isLoading) {
    return (
      <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600">Loading time series data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Data Available</h3>
            <p className="text-gray-600">No time series data found for the selected period.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6 overflow-hidden max-w-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Environmental Trends</h3>
        <div className="flex gap-2">
          {metrics.map(metric => (
            <button
              key={metric.key}
              onClick={() => onMetricSelect?.(metric.key)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedMetric === metric.key || selectedMetric === 'all'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {metric.label}
            </button>
          ))}
        </div>
      </div>

      {/* Simple Bar Chart */}
      <div className="h-64 w-full overflow-hidden">
        <div className="h-full flex items-end justify-between gap-1 min-w-0">
          {chartData.map((item, index) => (
            <div
              key={index}
              className="flex-1 flex flex-col items-center group cursor-pointer"
              onMouseEnter={() => setHoveredPoint(index)}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              <div className="w-full flex flex-col items-center space-y-1">
                {selectedMetric === 'all' ? (
                  metrics.map(metric => (
                    <div
                      key={metric.key}
                      className="w-full relative"
                      style={{ height: '20px' }}
                    >
                      <div
                        className="w-full rounded-t transition-all duration-300 hover:opacity-80"
                        style={{
                          backgroundColor: metric.color,
                          height: `${getBarHeight(item[metric.key as keyof typeof item] as number, metric.key)}%`,
                          minHeight: '2px'
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <div
                    className="w-full rounded-t transition-all duration-300 hover:opacity-80"
                    style={{
                      backgroundColor: metrics.find(m => m.key === selectedMetric)?.color || '#3b82f6',
                      height: `${getBarHeight(item[selectedMetric as keyof typeof item] as number, selectedMetric)}%`,
                      minHeight: '4px'
                    }}
                  />
                )}
              </div>
              
              {/* Tooltip */}
              {hoveredPoint === index && (
                <div className="absolute bottom-full mb-2 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                  <div className="font-semibold">{item.date}</div>
                  {selectedMetric === 'all' ? (
                    metrics.map(metric => (
                      <div key={metric.key} className="flex items-center gap-1">
                        <div 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: metric.color }}
                        />
                        <span>{formatValue(item[metric.key as keyof typeof item] as number, metric.key)}</span>
                      </div>
                    ))
                  ) : (
                    <div>
                      {formatValue(item[selectedMetric as keyof typeof item] as number, selectedMetric)}
                    </div>
                  )}
                </div>
              )}
              
              <div className="text-xs text-gray-500 mt-1 transform -rotate-45 origin-left">
                {item.date}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      {selectedMetric === 'all' && (
        <div className="mt-4 flex flex-wrap gap-4 justify-center">
          {metrics.map(metric => (
            <div key={metric.key} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: metric.color }}
              />
              <span className="text-sm text-gray-600">{metric.label}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500 text-center">
        Data points: {data.length} | Last updated: {data[data.length - 1]?.date}
      </div>
    </div>
  )
}

export default SimpleTimeSeriesChart
