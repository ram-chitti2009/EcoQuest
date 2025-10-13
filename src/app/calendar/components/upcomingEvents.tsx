"use client"

import { parseLocalDate } from "@/utils/dateUtils"
import { getEcoEventsByMonth, type EcoEvent } from "@/utils/supabase/functions"
import { ChevronRight, Clock, MapPin } from "lucide-react"
import { useEffect, useMemo, useState } from 'react'
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader } from "./ui/card"

const categoryColors = {
  cleanup: "bg-emerald-100 text-emerald-700 border-emerald-200",
  workshop: "bg-green-100 text-green-700 border-green-200",
  planting: "bg-lime-100 text-lime-700 border-lime-200",
  seminar: "bg-teal-100 text-teal-700 border-teal-200",
}

interface UpcomingEventsProps {
  currentMonth?: Date
}

export function UpcomingEvents({ currentMonth: propMonth }: UpcomingEventsProps) {
  const [showAll, setShowAll] = useState(false)
  const [allEvents, setAllEvents] = useState<EcoEvent[]>([])
  const [loading, setLoading] = useState(true)
  
  // Use prop month or default to current month
  const currentMonth = useMemo(() => propMonth || new Date(), [propMonth])

  // Fetch events when component mounts or month changes
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      try {
        const year = currentMonth.getFullYear()
        const month = currentMonth.getMonth()
        console.log(`🌱 Fetching upcoming events for ${year}-${month + 1}`)
        const { data, error } = await getEcoEventsByMonth(year, month + 1)
        
        if (error) {
          console.error('Error fetching events:', error)
        } else {
          // Filter for upcoming events (future dates only)
          const now = new Date()
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()) // Start of today
          
          const upcomingEvents = (data || []).filter((event: EcoEvent) => {
            // Parse date in local timezone to avoid UTC offset issues
            const eventDate = parseLocalDate(event.date)
            return eventDate >= today
          })
          setAllEvents(upcomingEvents)
        }
      } catch (err) {
        console.error('Error fetching events:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [currentMonth])

  const displayEvents = showAll ? allEvents : allEvents.slice(0, 4)

  // Helper function to format date
  const formatDate = (dateString: string) => {
    // Parse date in local timezone to avoid UTC offset issues
    const date = parseLocalDate(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  // Helper function to format time
  const formatTime = (timeString: string) => {
    // If time is already formatted, return as is
    if (timeString.includes('AM') || timeString.includes('PM')) {
      return timeString.split(' - ')[0] // Take start time only for the list
    }
    // Otherwise assume it's in 24-hour format and convert
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <Card className="shadow-lg border-green-200 bg-gradient-to-br from-white to-green-50 h-fit">
      <CardHeader className="pb-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
        <h3 className="text-xl font-bold">Upcoming Events</h3>
      </CardHeader>

      <CardContent className="p-4">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
            <span className="ml-2 text-gray-600 text-sm">Loading events...</span>
          </div>
        ) : allEvents.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">No upcoming events found.</p>
          </div>
        ) : (
          <>
            <div className={`space-y-3 ${showAll ? "max-h-96 overflow-y-auto scrollbar-hide" : "max-h-80 overflow-y-auto scrollbar-hide"}`}>
              {displayEvents.map((event, index) => (
                <div
                  key={event.id}
                  className="p-4 bg-white rounded-xl border border-green-100 hover:shadow-md hover:border-green-300 transition-all duration-200 cursor-pointer group animate-in slide-in-from-right"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 text-sm group-hover:text-green-700 transition-colors">
                      {event.title}
                    </h4>
                    <Badge className={`${categoryColors[event.category]} text-xs`}>{event.category}</Badge>
                  </div>

                  <div className="space-y-1 mb-3">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Clock className="h-3 w-3 text-green-600" />
                      {formatDate(event.date)} at {formatTime(event.time)}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <MapPin className="h-3 w-3 text-green-600" />
                      {event.location}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {event.participants}/{event.max_participants} joined
                    </span>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-green-600 transition-colors" />
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full mt-4 text-green-700 border-green-300 hover:bg-green-50 hover:border-green-400 transition-all duration-200 hover:scale-105 bg-transparent"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Show Less" : "View All Events"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
