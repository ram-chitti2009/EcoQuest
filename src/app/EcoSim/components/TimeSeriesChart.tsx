"use client"

import React, { useMemo } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface TimeSeriesChartProps {
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

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  data,
  isLoading = false,
  selectedMetric = "all",
  onMetricSelect
}) => {
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
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Data Available</h3>
            <p className="text-gray-600">No time series data found for the selected period.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
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

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%" minHeight={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              fontSize={12}
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
              formatter={(value: number, name: string) => [
                formatValue(value, name),
                metrics.find(m => m.key === name)?.label || name
              ]}
            />
            <Legend />
            {selectedMetric === 'all' ? (
              metrics.map(metric => (
                <Line
                  key={metric.key}
                  type="monotone"
                  dataKey={metric.key}
                  stroke={metric.color}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))
            ) : (
              <Line
                type="monotone"
                dataKey={selectedMetric}
                stroke={metrics.find(m => m.key === selectedMetric)?.color || '#3b82f6'}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        Data points: {data.length} | Last updated: {data[data.length - 1]?.date}
      </div>
    </div>
  )
}

export default TimeSeriesChart
