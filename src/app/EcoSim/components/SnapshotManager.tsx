"use client"

import { useState } from "react"
import { createChesterCountySnapshot, debugHistoricalData } from "../lib/functions"

/**
 * Admin Utility Component for Managing Historical Snapshots
 * 
 * This component provides tools to:
 * - Check available historical snapshots
 * - Create new snapshots manually
 * - View snapshot statistics
 * 
 * Usage: Add this component to your EcoSim page during development/testing
 */

export default function SnapshotManager() {
  const [isCreating, setIsCreating] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [snapshotInfo, setSnapshotInfo] = useState<{
    totalCount: number
    uniqueDates: string[]
  } | null>(null)
  const [message, setMessage] = useState<{
    type: "success" | "error" | "info"
    text: string
  } | null>(null)

  const handleCreateSnapshot = async () => {
    setIsCreating(true)
    setMessage(null)
    
    try {
      const result = await createChesterCountySnapshot()
      
      if (result.success) {
        setMessage({
          type: "success",
          text: "✅ Snapshot created successfully! Historical data is now available."
        })
      } else {
        setMessage({
          type: "error",
          text: `❌ Failed to create snapshot: ${result.error}`
        })
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: `❌ Error: ${error}`
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleCheckSnapshots = async () => {
    setIsChecking(true)
    setMessage(null)
    
    try {
      const result = await debugHistoricalData()
      
      if (result && result.totalCount !== null) {
        setSnapshotInfo({
          totalCount: result.totalCount,
          uniqueDates: result.uniqueDates
        })
        setMessage({
          type: "info",
          text: `📊 Found ${result.totalCount} total snapshots across ${result.uniqueDates.length} unique dates`
        })
      } else {
        setMessage({
          type: "error",
          text: "❌ Failed to check snapshots"
        })
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: `❌ Error: ${error}`
      })
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-dashed border-gray-300">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
        <h3 className="text-lg font-bold text-gray-900">
          🛠️ Admin: Snapshot Manager
        </h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        Use these tools to manage historical snapshots for the comparison feature.
        This panel should be hidden in production.
      </p>

      <div className="space-y-3 mb-4">
        <button
          onClick={handleCreateSnapshot}
          disabled={isCreating}
          className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isCreating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Creating Snapshot...
            </>
          ) : (
            <>
              📸 Create New Snapshot
            </>
          )}
        </button>

        <button
          onClick={handleCheckSnapshots}
          disabled={isChecking}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isChecking ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Checking...
            </>
          ) : (
            <>
              🔍 Check Available Snapshots
            </>
          )}
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg border-l-4 ${
            message.type === "success"
              ? "bg-green-50 border-green-500 text-green-800"
              : message.type === "error"
              ? "bg-red-50 border-red-500 text-red-800"
              : "bg-blue-50 border-blue-500 text-blue-800"
          }`}
        >
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      {snapshotInfo && (
        <div className="mt-4 bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-bold text-gray-900 mb-2">
            📊 Snapshot Statistics
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Snapshots:</span>
              <span className="font-semibold text-gray-900">
                {snapshotInfo.totalCount}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Unique Dates:</span>
              <span className="font-semibold text-gray-900">
                {snapshotInfo.uniqueDates.length}
              </span>
            </div>
            {snapshotInfo.uniqueDates.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Most Recent:</p>
                <p className="text-xs font-mono bg-white px-2 py-1 rounded">
                  {new Date(snapshotInfo.uniqueDates[0]).toLocaleString()}
                </p>
              </div>
            )}
            {snapshotInfo.uniqueDates.length > 1 && (
              <div className="mt-2">
                <p className="text-xs text-gray-600 mb-1">Oldest:</p>
                <p className="text-xs font-mono bg-white px-2 py-1 rounded">
                  {new Date(
                    snapshotInfo.uniqueDates[snapshotInfo.uniqueDates.length - 1]
                  ).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 leading-relaxed">
          💡 <strong>Tip:</strong> For production, set up automated daily snapshots using
          Supabase CRON jobs. See HISTORICAL_COMPARISON_GUIDE.md for setup instructions.
        </p>
      </div>
    </div>
  )
}
