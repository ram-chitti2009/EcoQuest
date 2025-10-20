"use client"

import { useEffect, useState, useCallback, useRef } from "react"

interface PerformanceMonitorProps {
  onPerformanceUpdate?: (metrics: {
    renderTime: number
    memoryUsage: number
    violationCount: number
  }) => void
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ onPerformanceUpdate }) => {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    memoryUsage: 0,
    violationCount: 0
  })
  
  const violationCountRef = useRef(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Optimized memory check with throttling and change detection
  const checkMemory = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      const memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024) // MB, rounded
      
      setMetrics(prev => {
        // Only update if values actually changed
        if (prev.memoryUsage === memoryUsage && prev.violationCount === violationCountRef.current) {
          return prev
        }
        
        const newMetrics = {
          ...prev,
          memoryUsage,
          violationCount: violationCountRef.current
        }
        
        onPerformanceUpdate?.({
          renderTime: prev.renderTime,
          memoryUsage,
          violationCount: violationCountRef.current
        })
        
        return newMetrics
      })
    }
  }, [onPerformanceUpdate])

  useEffect(() => {
    const startTime = performance.now()
    
    // Monitor performance violations with ref to avoid re-renders
    const originalConsoleWarn = console.warn
    
    console.warn = (...args) => {
      if (args[0]?.includes?.('Violation')) {
        violationCountRef.current++
      }
      originalConsoleWarn(...args)
    }

    // Throttled memory monitoring (every 2 seconds instead of 1)
    intervalRef.current = setInterval(checkMemory, 2000)

    // Calculate render time
    const endTime = performance.now()
    const renderTime = endTime - startTime
    
    setMetrics(prev => ({ ...prev, renderTime }))

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      console.warn = originalConsoleWarn
    }
  }, [checkMemory])

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black/80 text-white text-xs p-2 rounded z-50 backdrop-blur-sm">
      <div className="font-mono">
        <div>Render: {metrics.renderTime.toFixed(1)}ms</div>
        <div>Memory: {metrics.memoryUsage.toFixed(1)}MB</div>
        <div>Violations: {metrics.violationCount}</div>
      </div>
    </div>
  )
}

export default PerformanceMonitor
