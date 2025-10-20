"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

interface CacheOptions {
  ttl?: number // Time to live in milliseconds
  maxSize?: number // Maximum number of entries
  persist?: boolean // Whether to persist to localStorage
}

class DataCache<T> {
  private cache = new Map<string, CacheEntry<T>>()
  private options: Required<CacheOptions>

  constructor(options: CacheOptions = {}) {
    this.options = {
      ttl: options.ttl || 5 * 60 * 1000, // 5 minutes default
      maxSize: options.maxSize || 100,
      persist: options.persist || false
    }
  }

  set(key: string, data: T, customTtl?: number): void {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.options.maxSize) {
      const oldestKey = this.cache.keys().next().value
      this.cache.delete(oldestKey)
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: customTtl || this.options.ttl
    }

    this.cache.set(key, entry)

    // Persist to localStorage if enabled
    if (this.options.persist) {
      try {
        localStorage.setItem(`cache_${key}`, JSON.stringify(entry))
      } catch (error) {
        console.warn('Failed to persist cache entry:', error)
      }
    }
  }

  get(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) {
      // Try to load from localStorage if persist is enabled
      if (this.options.persist) {
        try {
          const stored = localStorage.getItem(`cache_${key}`)
          if (stored) {
            const parsedEntry = JSON.parse(stored) as CacheEntry<T>
            if (this.isValid(parsedEntry)) {
              this.cache.set(key, parsedEntry)
              return parsedEntry.data
            } else {
              localStorage.removeItem(`cache_${key}`)
            }
          }
        } catch (error) {
          console.warn('Failed to load from localStorage:', error)
        }
      }
      return null
    }

    if (this.isValid(entry)) {
      return entry.data
    } else {
      this.cache.delete(key)
      if (this.options.persist) {
        localStorage.removeItem(`cache_${key}`)
      }
      return null
    }
  }

  private isValid(entry: CacheEntry<T>): boolean {
    return Date.now() - entry.timestamp < entry.ttl
  }

  has(key: string): boolean {
    return this.get(key) !== null
  }

  delete(key: string): void {
    this.cache.delete(key)
    if (this.options.persist) {
      localStorage.removeItem(`cache_${key}`)
    }
  }

  clear(): void {
    this.cache.clear()
    if (this.options.persist) {
      // Clear all cache entries from localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('cache_')) {
          localStorage.removeItem(key)
        }
      })
    }
  }

  size(): number {
    return this.cache.size
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp >= entry.ttl) {
        this.cache.delete(key)
        if (this.options.persist) {
          localStorage.removeItem(`cache_${key}`)
        }
      }
    }
  }
}

// Global cache instances for different data types
const regionMetricsCache = new DataCache({
  ttl: 10 * 60 * 1000, // 10 minutes
  maxSize: 50,
  persist: true
})

const historicalDataCache = new DataCache({
  ttl: 30 * 60 * 1000, // 30 minutes
  maxSize: 20,
  persist: true
})

const gridCellsCache = new DataCache({
  ttl: 5 * 60 * 1000, // 5 minutes
  maxSize: 100,
  persist: false // Don't persist large grid data
})

// Custom hook for data caching
export function useDataCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const cacheRef = useRef(new DataCache<T>(options))

  const fetchData = useCallback(async () => {
    // Check cache first
    const cachedData = cacheRef.current.get(key)
    if (cachedData) {
      setData(cachedData)
      return cachedData
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await fetcher()
      cacheRef.current.set(key, result)
      setData(result)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [key, fetcher])

  const invalidate = useCallback(() => {
    cacheRef.current.delete(key)
    setData(null)
  }, [key])

  const refresh = useCallback(() => {
    invalidate()
    return fetchData()
  }, [invalidate, fetchData])

  // Auto-fetch on mount
  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
    refresh,
    invalidate
  }
}

// Specialized hooks for different data types
export function useRegionMetricsCache(
  bounds: { latMin: number; latMax: number; lngMin: number; lngMax: number },
  fetcher: () => Promise<any>
) {
  const key = `region_${bounds.latMin}_${bounds.latMax}_${bounds.lngMin}_${bounds.lngMax}`
  return useDataCache(key, fetcher, {
    ttl: 10 * 60 * 1000,
    maxSize: 50,
    persist: true
  })
}

export function useHistoricalDataCache(
  daysAgo: number,
  bounds: { latMin: number; latMax: number; lngMin: number; lngMax: number },
  fetcher: () => Promise<any>
) {
  const key = `historical_${daysAgo}_${bounds.latMin}_${bounds.latMax}_${bounds.lngMin}_${bounds.lngMax}`
  return useDataCache(key, fetcher, {
    ttl: 30 * 60 * 1000,
    maxSize: 20,
    persist: true
  })
}

export function useGridCellsCache(
  bounds: { latMin: number; latMax: number; lngMin: number; lngMax: number },
  fetcher: () => Promise<any>
) {
  const key = `grid_${bounds.latMin}_${bounds.latMax}_${bounds.lngMin}_${bounds.lngMax}`
  return useDataCache(key, fetcher, {
    ttl: 5 * 60 * 1000,
    maxSize: 100,
    persist: false
  })
}

// Cache management utilities
export function clearAllCaches(): void {
  regionMetricsCache.clear()
  historicalDataCache.clear()
  gridCellsCache.clear()
}

export function cleanupExpiredEntries(): void {
  regionMetricsCache.cleanup()
  historicalDataCache.cleanup()
  gridCellsCache.cleanup()
}

export function getCacheStats() {
  return {
    regionMetrics: regionMetricsCache.size(),
    historicalData: historicalDataCache.size(),
    gridCells: gridCellsCache.size()
  }
}

// Auto-cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', cleanupExpiredEntries)
  
  // Cleanup every 5 minutes
  setInterval(cleanupExpiredEntries, 5 * 60 * 1000)
}

export { DataCache }
