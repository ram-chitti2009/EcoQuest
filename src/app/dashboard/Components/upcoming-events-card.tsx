import { parseLocalDate } from "@/utils/dateUtils"
import { getUpcomingUnifiedEvents } from "@/utils/supabase/functions"
import { useEffect, useState } from "react"
import { Calendar } from "./icons"
import { Card, CardContent, CardHeader } from "./ui/card"

interface Event {
  id: number
  title: string
  date: string
  time: string
  category: 'cleanup' | 'workshop' | 'planting' | 'seminar'
  location?: string
}

const getEventIcon = (category: string) => {
  switch (category) {
    case 'cleanup':
      return '🗑️'
    case 'workshop':
      return '☀️'
    case 'planting':
      return '🌳'
    case 'seminar':
      return '📚'
    default:
      return '🌍'
  }
}

const getEventBackground = (category: string) => {
  switch (category) {
    case 'cleanup':
      return 'bg-blue-50'
    case 'workshop':
      return 'bg-yellow-50'
    case 'planting':
      return 'bg-green-50'
    case 'seminar':
      return 'bg-purple-50'
    default:
      return 'bg-emerald-50'
  }
}

const formatEventDateTime = (date: string, time: string) => {
  try {
    // Parse date in local timezone to avoid UTC offset issues
    const eventDate = parseLocalDate(date)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    // Format time to 12-hour format
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    const formattedTime = `${hour12}:${minutes}${ampm}`
    
    if (eventDate.toDateString() === today.toDateString()) {
      return `Today ${formattedTime}`
    } else if (eventDate.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow ${formattedTime}`
    } else {
      const month = eventDate.toLocaleDateString('en-US', { month: 'short' })
      const day = eventDate.getDate()
      return `${month} ${day}, ${formattedTime}`
    }
  } catch {
    return `${date} ${time}`
  }
}

export const UpcomingEventsCard = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const { data, error } = await getUpcomingUnifiedEvents()
        
        if (error) {
          console.error('Error fetching upcoming events:', error)
          return
        }
        
        if (data) {
          const now = new Date()
          
          // Filter and sort events to get the 3 closest upcoming events
          const upcomingEvents = data
            .filter(event => {
              // Create a full datetime for comparison using local date parsing
              const eventDate = parseLocalDate(event.date)
              const [hours, minutes] = event.time.split(':')
              eventDate.setHours(parseInt(hours), parseInt(minutes))
              return eventDate > now
            })
            .sort((a, b) => {
              // Sort by full datetime (date + time) to get truly closest events
              const dateTimeA = parseLocalDate(a.date)
              const [hoursA, minutesA] = a.time.split(':')
              dateTimeA.setHours(parseInt(hoursA), parseInt(minutesA))
              
              const dateTimeB = parseLocalDate(b.date)
              const [hoursB, minutesB] = b.time.split(':')
              dateTimeB.setHours(parseInt(hoursB), parseInt(minutesB))
              return dateTimeA.getTime() - dateTimeB.getTime()
            })
            .slice(0, 3) // Take the 3 closest
            .map(event => ({
              id: event.id,
              title: event.title,
              date: event.date,
              time: event.time,
              category: event.category,
              location: event.location
            }))
          
          setEvents(upcomingEvents)
        }
      } catch (error) {
        console.error('Error fetching upcoming events:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUpcomingEvents()
  }, [])

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold flex items-center gap-2 text-black">
          <Calendar className="w-5 h-5 text-emerald-600" />
          Upcoming Events
        </h3>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-2 bg-gray-100 rounded-lg animate-pulse">
                <div className="w-6 h-6 bg-gray-300 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded mb-1"></div>
                  <div className="h-3 bg-gray-300 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className={`flex items-center gap-3 p-2 ${getEventBackground(event.category)} rounded-lg`}>
              <div className="text-lg">{getEventIcon(event.category)}</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{event.title}</p>
                <p className="text-xs text-gray-600">{formatEventDateTime(event.date, event.time)}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">No upcoming events found</p>
            <p className="text-xs text-gray-400">Check back later for new events!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
