"use client"

interface ComparisonMetrics {
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
}

interface DifferenceMapLegendProps {
  timePeriodLabel: string
  comparisonData: ComparisonMetrics | null
}

export default function DifferenceMapLegend({ timePeriodLabel, comparisonData }: DifferenceMapLegendProps) {
  if (!comparisonData) return null

  const getChangeColor = (change: number) => {
    if (change > 5) return "text-green-600"
    if (change > 0) return "text-green-500"
    if (change < -5) return "text-red-600"
    if (change < 0) return "text-red-500"
    return "text-gray-600"
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return "↑"
    if (change < 0) return "↓"
    return "→"
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 border-2 border-gray-200">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        <h3 className="text-sm font-bold text-gray-900">
          📊 Side-by-Side Comparison: Today vs {timePeriodLabel} Ago
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        {/* Trash Density */}
        <div className="space-y-1">
          <p className="text-gray-600 font-medium">🗑️ Trash Density</p>
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-gray-900">{comparisonData.current.avgTrash.toFixed(1)}</span>
            <span className={`text-xs font-semibold ${getChangeColor(comparisonData.change.trash)}`}>
              {getChangeIcon(comparisonData.change.trash)} {Math.abs(comparisonData.change.trash).toFixed(1)}%
            </span>
          </div>
          <p className="text-gray-500 text-xs">was: {comparisonData.historical.avgTrash.toFixed(1)}</p>
        </div>

        {/* Greenery Score */}
        <div className="space-y-1">
          <p className="text-gray-600 font-medium">🌳 Greenery Score</p>
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-gray-900">{comparisonData.current.avgGreenery.toFixed(1)}%</span>
            <span className={`text-xs font-semibold ${getChangeColor(comparisonData.change.greenery)}`}>
              {getChangeIcon(comparisonData.change.greenery)} {Math.abs(comparisonData.change.greenery).toFixed(1)}%
            </span>
          </div>
          <p className="text-gray-500 text-xs">was: {comparisonData.historical.avgGreenery.toFixed(1)}%</p>
        </div>

        {/* Cleanliness Score */}
        <div className="space-y-1">
          <p className="text-gray-600 font-medium">✨ Cleanliness</p>
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-gray-900">{comparisonData.current.avgCleanliness.toFixed(1)}%</span>
            <span className={`text-xs font-semibold ${getChangeColor(comparisonData.change.cleanliness)}`}>
              {getChangeIcon(comparisonData.change.cleanliness)} {Math.abs(comparisonData.change.cleanliness).toFixed(1)}%
            </span>
          </div>
          <p className="text-gray-500 text-xs">was: {comparisonData.historical.avgCleanliness.toFixed(1)}%</p>
        </div>

        {/* Carbon Emissions */}
        <div className="space-y-1">
          <p className="text-gray-600 font-medium">💨 Carbon</p>
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-gray-900">{comparisonData.current.avgCarbon.toFixed(1)}t</span>
            <span className={`text-xs font-semibold ${getChangeColor(-comparisonData.change.carbon)}`}>
              {getChangeIcon(-comparisonData.change.carbon)} {Math.abs(comparisonData.change.carbon).toFixed(1)}%
            </span>
          </div>
          <p className="text-gray-500 text-xs">was: {comparisonData.historical.avgCarbon.toFixed(1)}t</p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-600 text-center">
          💡 <strong>Tip:</strong> Click on any grid cell to see detailed comparison
        </p>
      </div>
    </div>
  )
}
