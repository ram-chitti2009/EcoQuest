"use client"

import { Calendar, Filter, MapPin, Recycle, Search } from "lucide-react"
import { useState } from "react"
import type { FilterState } from "../../lib/cleanup-data"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Input } from "../ui/input"
import { Select } from "../ui/select"

interface FilterPanelProps {
  onFilterChange: (filters: FilterState) => void
}

export default function FilterPanel({ onFilterChange }: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    distance: "",
    date: "",
    type: "",
  })

  const updateFilter = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <Card className="absolute top-4 right-2 sm:right-4 z-20 w-72 sm:w-80 bg-stone-50/95 backdrop-blur-sm border border-stone-200 shadow-xl rounded-xl">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-stone-800 flex items-center gap-2">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            <span className="hidden sm:inline">Filters</span>
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-stone-100"
          >
            <span className={`transform transition-transform text-xs sm:text-sm ${isExpanded ? "rotate-180" : ""}`}>▼</span>
          </Button>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {/* Search Box */}
          <div className="space-y-2">
            <label htmlFor="search" className="text-sm font-medium text-stone-700">
              Search Events
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-400" />
              <Input
                id="search"
                placeholder="Search by location or event name..."
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
                className="pl-10 text-black"
              />
            </div>
          </div>

          {isExpanded && (
            <>
              {/* Distance Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  Distance
                </label>
                <Select
                  value={filters.distance}
                  onValueChange={(value) => updateFilter("distance", value)}
                  placeholder="Select distance"
                  options={[
                    { value: "5", label: "Within 5 miles" },
                    { value: "10", label: "Within 10 miles" },
                    { value: "25", label: "Within 25 miles" },
                    { value: "50", label: "Within 50 miles" },
                    { value: "any", label: "Any distance" },
                  ]}
                />
              </div>

              {/* Date Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Date Range
                </label>
                <Select
                  value={filters.date}
                  onValueChange={(value) => updateFilter("date", value)}
                  placeholder="Select date range"
                  options={[
                    { value: "today", label: "Today" },
                    { value: "week", label: "This week" },
                    { value: "month", label: "This month" },
                    { value: "upcoming", label: "All upcoming" },
                  ]}
                />
              </div>

              {/* Cleanup Type Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700 flex items-center gap-2">
                  <Recycle className="w-4 h-4 text-green-600" />
                  Cleanup Type
                </label>
                <Select
                  value={filters.type}
                  onValueChange={(value) => updateFilter("type", value)}
                  placeholder="Select cleanup type"
                  options={[
                    { value: "beach", label: "Beach cleanup" },
                    { value: "park", label: "Park cleanup" },
                    { value: "street", label: "Street cleanup" },
                    { value: "river", label: "River cleanup" },
                    { value: "all", label: "All types" },
                  ]}
                />
              </div>

              {/* Clear Filters Button */}
              <Button
                variant="outline"
                onClick={() => {
                  const clearedFilters = { search: "", distance: "", date: "", type: "" }
                  setFilters(clearedFilters)
                  onFilterChange(clearedFilters)
                }}
                className="w-full mt-4"
              >
                Clear All Filters
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export type { FilterState }
