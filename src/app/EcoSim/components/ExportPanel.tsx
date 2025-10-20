"use client"

import React, { useState } from "react"
import { Download, FileText, Image, Database, Share2 } from "lucide-react"

interface ExportPanelProps {
  regionMetrics: {
    avgTrash: number
    avgCleanliness: number
    avgGreenery: number
    avgCarbon: number
    totalCells: number
  }
  historicalComparison: any
  healthScore: number
  onExport: (format: string, data: any) => void
}

const ExportPanel: React.FC<ExportPanelProps> = ({
  regionMetrics,
  historicalComparison,
  healthScore,
  onExport
}) => {
  const [isExporting, setIsExporting] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState("")

  const exportFormats = [
    {
      id: "pdf",
      name: "PDF Report",
      description: "Comprehensive environmental report",
      icon: FileText,
      color: "text-red-600"
    },
    {
      id: "csv",
      name: "CSV Data",
      description: "Raw data for analysis",
      icon: Database,
      color: "text-green-600"
    },
    {
      id: "image",
      name: "Map Image",
      description: "High-resolution map screenshot",
      icon: Image,
      color: "text-blue-600"
    },
    {
      id: "json",
      name: "JSON Data",
      description: "Structured data export",
      icon: Database,
      color: "text-purple-600"
    }
  ]

  const handleExport = async (format: string) => {
    setIsExporting(true)
    setSelectedFormat(format)
    
    try {
      const exportData = {
        timestamp: new Date().toISOString(),
        regionMetrics,
        historicalComparison,
        healthScore,
        metadata: {
          version: "1.0",
          source: "EcoSim Chester County",
          generatedBy: "Environmental Analytics Platform"
        }
      }
      
      await onExport(format, exportData)
    } catch (error) {
      console.error("Export failed:", error)
    } finally {
      setIsExporting(false)
      setSelectedFormat("")
    }
  }

  const generateCSV = (data: any) => {
    const headers = [
      "Metric",
      "Current Value",
      "Historical Value",
      "Change (%)",
      "Units"
    ]
    
    const rows = [
      ["Trash Density", data.regionMetrics.avgTrash, historicalComparison?.historical?.avgTrash || "N/A", historicalComparison?.change?.trash || "N/A", "units"],
      ["Cleanliness Score", data.regionMetrics.avgCleanliness, historicalComparison?.historical?.avgCleanliness || "N/A", historicalComparison?.change?.cleanliness || "N/A", "%"],
      ["Greenery Score", data.regionMetrics.avgGreenery, historicalComparison?.historical?.avgGreenery || "N/A", historicalComparison?.change?.greenery || "N/A", "%"],
      ["Carbon Emissions", data.regionMetrics.avgCarbon, historicalComparison?.historical?.avgCarbon || "N/A", historicalComparison?.change?.carbon || "N/A", "tons"],
      ["Health Score", data.healthScore, "N/A", "N/A", "%"],
      ["Total Cells", data.regionMetrics.totalCells, historicalComparison?.historical?.totalCells || "N/A", "N/A", "count"]
    ]
    
    return [headers, ...rows].map(row => row.join(",")).join("\n")
  }

  const generateJSON = (data: any) => {
    return JSON.stringify(data, null, 2)
  }

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleFormatExport = async (format: string) => {
    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `chester-county-environmental-data-${timestamp}`
    
    switch (format) {
      case "csv":
        const csvContent = generateCSV({ regionMetrics, healthScore })
        downloadFile(csvContent, `${filename}.csv`, "text/csv")
        break
        
      case "json":
        const jsonContent = generateJSON({ regionMetrics, historicalComparison, healthScore })
        downloadFile(jsonContent, `${filename}.json`, "application/json")
        break
        
      case "pdf":
        // For PDF, we'd typically use a library like jsPDF or generate server-side
        // For now, we'll create a simple text-based report
        const pdfContent = `
CHESTER COUNTY ENVIRONMENTAL REPORT
Generated: ${new Date().toLocaleDateString()}

ENVIRONMENTAL HEALTH SCORE: ${healthScore}%

CURRENT METRICS:
- Trash Density: ${regionMetrics.avgTrash.toFixed(2)}
- Cleanliness Score: ${regionMetrics.avgCleanliness.toFixed(1)}%
- Greenery Score: ${regionMetrics.avgGreenery.toFixed(1)}%
- Carbon Emissions: ${regionMetrics.avgCarbon.toFixed(2)} tons
- Total Cells Analyzed: ${regionMetrics.totalCells}

${historicalComparison ? `
HISTORICAL COMPARISON:
- Trash Change: ${historicalComparison.change?.trash?.toFixed(1) || 'N/A'}%
- Cleanliness Change: ${historicalComparison.change?.cleanliness?.toFixed(1) || 'N/A'}%
- Greenery Change: ${historicalComparison.change?.greenery?.toFixed(1) || 'N/A'}%
- Carbon Change: ${historicalComparison.change?.carbon?.toFixed(1) || 'N/A'}%
` : ''}

Report generated by EcoSim Environmental Analytics Platform
        `.trim()
        
        downloadFile(pdfContent, `${filename}.txt`, "text/plain")
        break
        
      case "image":
        // For image export, we'd typically capture the map canvas
        // This would require integration with the map component
        alert("Image export feature requires map integration")
        break
    }
  }

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
          <Download className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Export Data</h3>
      </div>

      <div className="space-y-3">
        {exportFormats.map((format) => {
          const Icon = format.icon
          const isCurrentlyExporting = isExporting && selectedFormat === format.id
          
          return (
            <button
              key={format.id}
              onClick={() => handleFormatExport(format.id)}
              disabled={isExporting}
              className="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 disabled:bg-gray-100 disabled:opacity-50 rounded-lg border border-gray-200 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${format.color}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-800">{format.name}</h4>
                    {isCurrentlyExporting && (
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{format.description}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <Share2 className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">Share Report</span>
        </div>
        <p className="text-xs text-blue-700 mb-3">
          Generate a shareable link for your environmental analysis
        </p>
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Generate Share Link
        </button>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p>Export includes current metrics, historical comparison (if available), and metadata.</p>
        <p>Data is generated in real-time from Chester County environmental monitoring systems.</p>
      </div>
    </div>
  )
}

export default ExportPanel
