"use client"

import { useCallback, useEffect, useRef, useState } from "react"

interface PerformanceMetrics {
  renderTime: number
  dataLoadTime: number
  memoryUsage: number
  cacheHitRate: number
}

interface OptimizationOptions {
  debounceMs?: number
  throttleMs?: number
  maxRetries?: number
  retryDelay?: number
  enableVirtualization?: boolean
  enableLazyLoading?: boolean
}

export function usePerformanceOptimization(options: OptimizationOptions = {}) {
  const {
    debounceMs = 300,
    throttleMs = 100,
    maxRetries = 3,
    retryDelay = 1000,
    enableVirtualization = true,
    enableLazyLoading = true
  } = options

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    dataLoadTime: 0,
    memoryUsage: 0,
    cacheHitRate: 0
  })

  const renderStartTime = useRef<number>(0)
  const dataLoadStartTime = useRef<number>(0)
  const retryCount = useRef<number>(0)

  // Debounced function
  const useDebounce = useCallback(<T extends (...args: any[]) => any>(
    func: T,
    delay: number = debounceMs
  ): T => {
    const timeoutRef = useRef<NodeJS.Timeout>()
    
    return ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      timeoutRef.current = setTimeout(() => {
        func(...args)
      }, delay)
    }) as T
  }, [debounceMs])

  // Throttled function
  const useThrottle = useCallback(<T extends (...args: any[]) => any>(
    func: T,
    delay: number = throttleMs
  ): T => {
    const lastCallTime = useRef<number>(0)
    
    return ((...args: Parameters<T>) => {
      const now = Date.now()
      
      if (now - lastCallTime.current >= delay) {
        lastCallTime.current = now
        func(...args)
      }
    }) as T
  }, [throttleMs])

  // Retry mechanism with exponential backoff
  const useRetry = useCallback(async <T>(
    operation: () => Promise<T>,
    maxRetries: number = maxRetries,
    baseDelay: number = retryDelay
  ): Promise<T> => {
    let lastError: Error | null = null
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error')
        
        if (attempt === maxRetries) {
          throw lastError
        }
        
        // Exponential backoff
        const delay = baseDelay * Math.pow(2, attempt)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
    
    throw lastError
  }, [maxRetries, retryDelay])

  // Performance monitoring
  const startRenderTimer = useCallback(() => {
    renderStartTime.current = performance.now()
  }, [])

  const endRenderTimer = useCallback(() => {
    const renderTime = performance.now() - renderStartTime.current
    setMetrics(prev => ({ ...prev, renderTime }))
  }, [])

  const startDataLoadTimer = useCallback(() => {
    dataLoadStartTime.current = performance.now()
  }, [])

  const endDataLoadTimer = useCallback(() => {
    const dataLoadTime = performance.now() - dataLoadStartTime.current
    setMetrics(prev => ({ ...prev, dataLoadTime }))
  }, [])

  // Memory usage monitoring
  const updateMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      setMetrics(prev => ({
        ...prev,
        memoryUsage: memory.usedJSHeapSize / 1024 / 1024 // MB
      }))
    }
  }, [])

  // Intersection Observer for lazy loading
  const useIntersectionObserver = useCallback((
    callback: (entries: IntersectionObserverEntry[]) => void,
    options: IntersectionObserverInit = {}
  ) => {
    const observerRef = useRef<IntersectionObserver>()
    const elementRef = useRef<HTMLElement>()

    useEffect(() => {
      if (!enableLazyLoading) return

      observerRef.current = new IntersectionObserver(callback, {
        rootMargin: '50px',
        threshold: 0.1,
        ...options
      })

      if (elementRef.current) {
        observerRef.current.observe(elementRef.current)
      }

      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect()
        }
      }
    }, [callback, options])

    return elementRef
  }, [enableLazyLoading])

  // Virtual scrolling hook
  const useVirtualScrolling = useCallback((
    itemCount: number,
    itemHeight: number,
    containerHeight: number
  ) => {
    const [scrollTop, setScrollTop] = useState(0)
    
    const visibleStart = Math.floor(scrollTop / itemHeight)
    const visibleEnd = Math.min(
      itemCount - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight)
    )
    
    const visibleItems = Array.from(
      { length: visibleEnd - visibleStart + 1 },
      (_, i) => visibleStart + i
    )

    const totalHeight = itemCount * itemHeight
    const offsetY = visibleStart * itemHeight

    return {
      visibleItems,
      totalHeight,
      offsetY,
      setScrollTop
    }
  }, [])

  // Batch updates
  const useBatchedUpdates = useCallback(() => {
    const updateQueue = useRef<(() => void)[]>([])
    const isProcessing = useRef(false)

    const batchUpdate = useCallback((update: () => void) => {
      updateQueue.current.push(update)
      
      if (!isProcessing.current) {
        isProcessing.current = true
        requestAnimationFrame(() => {
          updateQueue.current.forEach(update => update())
          updateQueue.current = []
          isProcessing.current = false
        })
      }
    }, [])

    return batchUpdate
  }, [])

  // Resource preloading
  const preloadResource = useCallback((url: string, type: 'image' | 'script' | 'style' = 'image') => {
    return new Promise((resolve, reject) => {
      let element: HTMLElement

      switch (type) {
        case 'image':
          element = new Image()
          break
        case 'script':
          element = document.createElement('script')
          element.setAttribute('src', url)
          break
        case 'style':
          element = document.createElement('link')
          element.setAttribute('rel', 'stylesheet')
          element.setAttribute('href', url)
          break
        default:
          reject(new Error('Unsupported resource type'))
          return
      }

      element.onload = () => resolve(element)
      element.onerror = () => reject(new Error(`Failed to load ${url}`))
      
      if (type === 'script' || type === 'style') {
        document.head.appendChild(element)
      }
    })
  }, [])

  // Performance optimization for large datasets
  const useDataOptimization = useCallback(<T>(
    data: T[],
    options: {
      maxItems?: number
      sortBy?: keyof T
      filterBy?: (item: T) => boolean
    } = {}
  ) => {
    const { maxItems = 1000, sortBy, filterBy } = options

    return useMemo(() => {
      let optimizedData = [...data]

      // Filter first (most efficient)
      if (filterBy) {
        optimizedData = optimizedData.filter(filterBy)
      }

      // Sort if needed
      if (sortBy) {
        optimizedData.sort((a, b) => {
          const aVal = a[sortBy]
          const bVal = b[sortBy]
          if (aVal < bVal) return -1
          if (aVal > bVal) return 1
          return 0
        })
      }

      // Limit items
      if (optimizedData.length > maxItems) {
        optimizedData = optimizedData.slice(0, maxItems)
      }

      return optimizedData
    }, [data, maxItems, sortBy, filterBy])
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cleanup any pending operations
      if (renderStartTime.current) {
        endRenderTimer()
      }
      if (dataLoadStartTime.current) {
        endDataLoadTimer()
      }
    }
  }, [endRenderTimer, endDataLoadTimer])

  // Update memory usage periodically
  useEffect(() => {
    const interval = setInterval(updateMemoryUsage, 5000)
    return () => clearInterval(interval)
  }, [updateMemoryUsage])

  return {
    metrics,
    useDebounce,
    useThrottle,
    useRetry,
    startRenderTimer,
    endRenderTimer,
    startDataLoadTimer,
    endDataLoadTimer,
    useIntersectionObserver,
    useVirtualScrolling,
    useBatchedUpdates,
    preloadResource,
    useDataOptimization
  }
}

// Import useMemo for the data optimization hook
import { useMemo } from "react"
