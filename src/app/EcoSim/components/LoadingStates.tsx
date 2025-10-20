"use client"

import React from "react"
import { Loader2, MapPin, BarChart3, Download, Play } from "lucide-react"

interface LoadingStatesProps {
  type: "map" | "data" | "analysis" | "export" | "simulation"
  message?: string
  progress?: number
}

const LoadingStates: React.FC<LoadingStatesProps> = ({ 
  type, 
  message, 
  progress 
}) => {
  const getIcon = () => {
    switch (type) {
      case "map":
        return <MapPin className="w-6 h-6 text-blue-500" />
      case "data":
        return <BarChart3 className="w-6 h-6 text-green-500" />
      case "analysis":
        return <BarChart3 className="w-6 h-6 text-purple-500" />
      case "export":
        return <Download className="w-6 h-6 text-orange-500" />
      case "simulation":
        return <Play className="w-6 h-6 text-pink-500" />
      default:
        return <Loader2 className="w-6 h-6 text-gray-500" />
    }
  }

  const getDefaultMessage = () => {
    switch (type) {
      case "map":
        return "Loading Chester County ecosystem..."
      case "data":
        return "Fetching environmental data..."
      case "analysis":
        return "Analyzing environmental metrics..."
      case "export":
        return "Preparing data export..."
      case "simulation":
        return "Running environmental simulation..."
      default:
        return "Loading..."
    }
  }

  const getColorScheme = () => {
    switch (type) {
      case "map":
        return {
          primary: "text-blue-600",
          secondary: "text-blue-500",
          bg: "bg-blue-50",
          border: "border-blue-200",
          spinner: "border-blue-500"
        }
      case "data":
        return {
          primary: "text-green-600",
          secondary: "text-green-500",
          bg: "bg-green-50",
          border: "border-green-200",
          spinner: "border-green-500"
        }
      case "analysis":
        return {
          primary: "text-purple-600",
          secondary: "text-purple-500",
          bg: "bg-purple-50",
          border: "border-purple-200",
          spinner: "border-purple-500"
        }
      case "export":
        return {
          primary: "text-orange-600",
          secondary: "text-orange-500",
          bg: "bg-orange-50",
          border: "border-orange-200",
          spinner: "border-orange-500"
        }
      case "simulation":
        return {
          primary: "text-pink-600",
          secondary: "text-pink-500",
          bg: "bg-pink-50",
          border: "border-pink-200",
          spinner: "border-pink-500"
        }
      default:
        return {
          primary: "text-gray-600",
          secondary: "text-gray-500",
          bg: "bg-gray-50",
          border: "border-gray-200",
          spinner: "border-gray-500"
        }
    }
  }

  const colors = getColorScheme()
  const displayMessage = message || getDefaultMessage()

  return (
    <div className={`${colors.bg} ${colors.border} border rounded-xl p-6 text-center`}>
      <div className="flex flex-col items-center space-y-4">
        {/* Animated Icon */}
        <div className="relative">
          <div className="w-16 h-16 flex items-center justify-center">
            {getIcon()}
          </div>
          <div className={`absolute inset-0 w-16 h-16 border-4 ${colors.spinner} border-t-transparent rounded-full animate-spin`}></div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h3 className={`text-lg font-semibold ${colors.primary}`}>
            {displayMessage}
          </h3>
          <p className={`text-sm ${colors.secondary}`}>
            Please wait while we process your request...
          </p>
        </div>

        {/* Progress Bar */}
        {progress !== undefined && (
          <div className="w-full max-w-xs">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${colors.spinner.replace('border-', 'bg-')}`}
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Loading Dots */}
        <div className="flex space-x-1">
          <div className={`w-2 h-2 ${colors.spinner.replace('border-', 'bg-')} rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
          <div className={`w-2 h-2 ${colors.spinner.replace('border-', 'bg-')} rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
          <div className={`w-2 h-2 ${colors.spinner.replace('border-', 'bg-')} rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  )
}

// Specialized loading components for different contexts
export const MapLoadingState: React.FC<{ message?: string }> = ({ message }) => (
  <LoadingStates type="map" message={message} />
)

export const DataLoadingState: React.FC<{ message?: string; progress?: number }> = ({ message, progress }) => (
  <LoadingStates type="data" message={message} progress={progress} />
)

export const AnalysisLoadingState: React.FC<{ message?: string }> = ({ message }) => (
  <LoadingStates type="analysis" message={message} />
)

export const ExportLoadingState: React.FC<{ message?: string; progress?: number }> = ({ message, progress }) => (
  <LoadingStates type="export" message={message} progress={progress} />
)

export const SimulationLoadingState: React.FC<{ message?: string }> = ({ message }) => (
  <LoadingStates type="simulation" message={message} />
)

// Full-screen loading overlay
export const FullScreenLoading: React.FC<{ 
  type: LoadingStatesProps['type']
  message?: string
  progress?: number
}> = ({ type, message, progress }) => (
  <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="max-w-sm w-full mx-4">
      <LoadingStates type={type} message={message} progress={progress} />
    </div>
  </div>
)

// Inline loading spinner
export const InlineSpinner: React.FC<{ 
  size?: "sm" | "md" | "lg"
  color?: "blue" | "green" | "purple" | "orange" | "pink" | "gray"
}> = ({ size = "md", color = "blue" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  }
  
  const colorClasses = {
    blue: "border-blue-500",
    green: "border-green-500",
    purple: "border-purple-500",
    orange: "border-orange-500",
    pink: "border-pink-500",
    gray: "border-gray-500"
  }

  return (
    <div className={`${sizeClasses[size]} border-2 ${colorClasses[color]} border-t-transparent rounded-full animate-spin`}></div>
  )
}

// Skeleton loading components
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`}></div>
)

export const SkeletonText: React.FC<{ 
  lines?: number
  className?: string 
}> = ({ lines = 1, className = "" }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div 
        key={i}
        className="h-4 bg-gray-200 rounded animate-pulse"
        style={{ width: `${100 - (i * 10)}%` }}
      ></div>
    ))}
  </div>
)

export default LoadingStates
