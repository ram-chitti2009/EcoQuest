"use client"

<<<<<<< HEAD
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, MapPin, Clock, X, Users } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader } from "./ui/card"
import { Badge } from "./ui/badge"
import { 
  getEcoEventsByMonth, 
  joinEcoEvent, 
  leaveEcoEvent, 
  checkUserEventParticipation,
  type EcoEvent 
} from "@/utils/supabase/functions"
import { createClient } from "@/utils/supabase/client"
=======
import { useState } from "react"
import { ChevronLeft, ChevronRight, MapPin, Clock, X } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader } from "./ui/card"
import { Badge } from "./ui/badge"

// Sample eco-events data
const ecoEvents = [
  {
    id: 1,
    date: "2025-01-15",
    title: "Beach Cleanup Drive",
    time: "9:00 AM - 12:00 PM",
    location: "Sunset Beach Park",
    category: "cleanup",
    description: "Join us for a community beach cleanup to protect marine life and keep our coastlines pristine.",
    participants: 24,
    maxParticipants: 50,
  },
  {
    id: 2,
    date: "2025-01-18",
    title: "Recycling Workshop",
    time: "2:00 PM - 4:00 PM",
    location: "Community Center",
    category: "workshop",
    description: "Learn creative ways to upcycle household items and reduce waste.",
    participants: 12,
    maxParticipants: 20,
  },
  {
    id: 3,
    date: "2025-01-22",
    title: "Urban Tree Planting",
    time: "8:00 AM - 11:00 AM",
    location: "Central Park",
    category: "planting",
    description: "Help expand our city's green canopy by planting native trees.",
    participants: 18,
    maxParticipants: 30,
  },
  {
    id: 4,
    date: "2025-01-25",
    title: "Sustainability Seminar",
    time: "6:00 PM - 8:00 PM",
    location: "Green Library",
    category: "seminar",
    description: "Expert-led discussion on reducing your carbon footprint.",
    participants: 35,
    maxParticipants: 100,
  },
  {
    id: 5,
    date: "2025-01-28",
    title: "River Restoration",
    time: "9:00 AM - 3:00 PM",
    location: "Riverside Trail",
    category: "cleanup",
    description: "Hands-on restoration work including invasive species removal.",
    participants: 8,
    maxParticipants: 25,
  },
]
>>>>>>> 648b8e123a0f650d74ce6d16af6d0dcdd832348e

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

<<<<<<< HEAD
const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
=======
const dayNames = ["S", "M", "T", "W", "T", "F", "S"]
>>>>>>> 648b8e123a0f650d74ce6d16af6d0dcdd832348e

const categoryColors = {
  cleanup: "bg-emerald-100 text-emerald-700 border-emerald-200",
  workshop: "bg-green-100 text-green-700 border-green-200",
  planting: "bg-lime-100 text-lime-700 border-lime-200",
  seminar: "bg-teal-100 text-teal-700 border-teal-200",
}

<<<<<<< HEAD
interface CompactCalendarProps {
  onMetricsUpdate?: () => Promise<void>
}

export function CompactCalendar({ onMetricsUpdate }: CompactCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showEventCard, setShowEventCard] = useState(false)
  const [ecoEvents, setEcoEvents] = useState<EcoEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null)
  const [userParticipations, setUserParticipations] = useState<Record<number, boolean>>({})

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const supabase = createClient()

  // Check authentication status
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)
    }
    checkUser()
  }, [supabase.auth])

  // Fetch events when component mounts or month changes
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      try {
        console.log(`Fetching events for ${year}-${month + 1}`) // Debug log
        const { data, error } = await getEcoEventsByMonth(year, month + 1) // month is 0-indexed, but our function expects 1-indexed
        if (error) {
          console.error('Error fetching events:', error)
          console.error('Error details:', error.message, error.code) // More detailed error
        } else {
          console.log(`Fetched ${data?.length || 0} events:`, data) // Debug log
          setEcoEvents(data || [])
          
          // Load user participation status for each event
          if (currentUser && data) {
            const participationStatus: Record<number, boolean> = {}
            for (const event of data) {
              const hasJoined = await checkUserEventParticipation(event.id, currentUser.id)
              participationStatus[event.id] = hasJoined
            }
            setUserParticipations(participationStatus)
          }
        }
      } catch (err) {
        console.error('Error fetching events:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [year, month, currentUser])

  // Handle joining/leaving events
  const handleEventAction = async (eventId: number) => {
    if (!currentUser) {
      alert('Please sign in to join events')
      return
    }

    const isJoined = userParticipations[eventId]
    
    try {
      let result
      if (isJoined) {
        result = await leaveEcoEvent(eventId, currentUser.id)
      } else {
        result = await joinEcoEvent(eventId, currentUser.id)
      }

      if (result.success) {
        // Update local participation state
        setUserParticipations(prev => ({
          ...prev,
          [eventId]: !isJoined
        }))

        // Refresh events to get updated participant count
        const { data } = await getEcoEventsByMonth(year, month + 1)
        if (data) {
          setEcoEvents(data)
        }

        // Call parent component to refresh dashboard metrics
        if (onMetricsUpdate) {
          await onMetricsUpdate()
        }
      }

      alert(result.message)
    } catch (error) {
      console.error('Error with event action:', error)
      alert('An error occurred. Please try again.')
    }
  }
=======
export function CompactCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1))
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showEventCard, setShowEventCard] = useState(false)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()
>>>>>>> 648b8e123a0f650d74ce6d16af6d0dcdd832348e

  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
    setSelectedDate(null)
    setShowEventCard(false)
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
    setSelectedDate(null)
    setShowEventCard(false)
  }

  const getEventsForDate = (date: string) => {
<<<<<<< HEAD
    return ecoEvents.filter((event) => {
      // Handle the date comparison properly
      const eventDateString = event.date.toString().split('T')[0] // Remove time if present
      return eventDateString === date
    })
  }

  const hasEvents = (day: number, checkYear: number, checkMonth: number) => {
    const dateString = `${checkYear}-${String(checkMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    const events = getEventsForDate(dateString)
    return events.length > 0
  }

  const handleDateClick = (day: number, clickYear: number, clickMonth: number) => {
    const dateString = `${clickYear}-${String(clickMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
=======
    return ecoEvents.filter((event) => event.date === date)
  }

  const hasEvents = (day: number) => {
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return getEventsForDate(dateString).length > 0
  }

  const handleDateClick = (day: number) => {
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
>>>>>>> 648b8e123a0f650d74ce6d16af6d0dcdd832348e
    const events = getEventsForDate(dateString)

    if (events.length > 0) {
      setSelectedDate(dateString)
      setShowEventCard(true)
    }
  }

  // Generate calendar days
  const calendarDays = []
<<<<<<< HEAD
  
  // Get the first day of the month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInCurrentMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()
  
  // Add previous month's days (grayed out) - CAN have events
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const prevMonthDay = daysInPrevMonth - i
    const prevMonth = month - 1
    const prevYear = month === 0 ? year - 1 : year
    const adjustedPrevMonth = month === 0 ? 11 : prevMonth
    
    calendarDays.push({
      day: prevMonthDay,
      month: adjustedPrevMonth,
      year: prevYear,
      isCurrentMonth: false,
      isToday: false,
      hasEvents: hasEvents(prevMonthDay, prevYear, adjustedPrevMonth),
    })
  }
  
  // Add current month's days - CAN have events
  const today = new Date()
  for (let day = 1; day <= daysInCurrentMonth; day++) {
    const isToday = today.getFullYear() === year && 
                   today.getMonth() === month && 
                   today.getDate() === day
    
    calendarDays.push({
      day,
      month,
      year,
      isCurrentMonth: true,
      isToday,
      hasEvents: hasEvents(day, year, month),
    })
  }
  
  // Add next month's days to fill the grid - CAN have events
  const remainingDays = 42 - calendarDays.length
  const nextMonth = month + 1
  const nextYear = month === 11 ? year + 1 : year
  const adjustedNextMonth = month === 11 ? 0 : nextMonth
  
  for (let day = 1; day <= remainingDays; day++) {
    calendarDays.push({
      day,
      month: adjustedNextMonth,
      year: nextYear,
      isCurrentMonth: false,
      isToday: false,
      hasEvents: hasEvents(day, nextYear, adjustedNextMonth),
=======

  for (let i = firstDay - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      isToday: false,
    })
  }

  const today = new Date()
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day

    calendarDays.push({
      day,
      isCurrentMonth: true,
      isToday,
      hasEvents: hasEvents(day),
    })
  }

  const remainingDays = 42 - calendarDays.length
  for (let day = 1; day <= remainingDays; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: false,
      isToday: false,
>>>>>>> 648b8e123a0f650d74ce6d16af6d0dcdd832348e
    })
  }

  return (
    <div className="w-full relative">
      <Card className="shadow-lg border-green-200 bg-gradient-to-br from-white to-green-50 transition-all duration-300 hover:shadow-xl">
        <CardHeader className="pb-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {monthNames[month]} {year}
            </h2>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={goToPrevMonth}
                className="h-10 w-10 p-0 hover:bg-white/20 text-white transition-all duration-200 hover:scale-110"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={goToNextMonth}
                className="h-10 w-10 p-0 hover:bg-white/20 text-white transition-all duration-200 hover:scale-110"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mt-6">
            {dayNames.map((day) => (
              <div key={day} className="h-12 flex items-center justify-center text-sm font-semibold text-green-100">
                {day}
              </div>
            ))}
          </div>
        </CardHeader>

<<<<<<< HEAD
        <CardContent className="p-6"> 
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <span className="ml-2 text-gray-600">Loading events...</span>
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((calendarDay, index) => {
                const dateString = `${calendarDay.year}-${String(calendarDay.month + 1).padStart(2, "0")}-${String(calendarDay.day).padStart(2, "0")}`

                return (
                  <button
                    key={index}
                    onClick={() => handleDateClick(calendarDay.day, calendarDay.year, calendarDay.month)}
                    className={`
                      h-14 w-14 flex items-center justify-center text-sm rounded-xl transition-all duration-200 relative font-medium border-2
                      ${
                        !calendarDay.isCurrentMonth
                          ? calendarDay.hasEvents
                            ? "text-gray-500 bg-gray-50 border-gray-200 cursor-pointer hover:bg-gray-100 hover:border-gray-300 hover:scale-105 hover:shadow-md"
                            : "text-gray-300 cursor-default bg-transparent border-transparent"
                          : calendarDay.hasEvents
                          ? "text-white bg-green-500 border-green-500 cursor-pointer hover:bg-green-600 hover:border-green-600 hover:scale-105 hover:shadow-md"
                          : calendarDay.isToday
                          ? "text-white bg-blue-500 border-blue-500 cursor-pointer hover:bg-blue-600 hover:border-blue-600 hover:scale-105 hover:shadow-md"
                          : "text-gray-700 bg-white border-gray-200 cursor-pointer hover:bg-gray-100 hover:border-gray-300 hover:scale-105 hover:shadow-md"
                      }
                      ${selectedDate === dateString ? "ring-2 ring-green-400" : ""}
                    `}
                    disabled={!calendarDay.hasEvents && !calendarDay.isCurrentMonth}
                  >
                    {calendarDay.day}
                  </button>
                )
              })}
            </div>
          )}
=======
        <CardContent className="p-6">
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((calendarDay, index) => {
              const dateString = calendarDay.isCurrentMonth
                ? `${year}-${String(month + 1).padStart(2, "0")}-${String(calendarDay.day).padStart(2, "0")}`
                : null

              return (
                <button
                  key={index}
                  onClick={() => calendarDay.isCurrentMonth && handleDateClick(calendarDay.day)}
                  className={`
                    h-14 w-14 flex items-center justify-center text-sm rounded-xl transition-all duration-200 relative font-medium
                    ${
                      !calendarDay.isCurrentMonth
                        ? "text-gray-300 cursor-default"
                        : "text-gray-700 hover:bg-green-100 cursor-pointer hover:scale-105 hover:shadow-md"
                    }
                    ${calendarDay.isToday ? "bg-green-500 text-white hover:bg-green-600 shadow-lg" : ""}
                    ${selectedDate === dateString ? "bg-green-200 text-green-800 ring-2 ring-green-400" : ""}
                  `}
                  disabled={!calendarDay.isCurrentMonth}
                >
                  {calendarDay.day}
                  {calendarDay.hasEvents && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  )}
                </button>
              )
            })}
          </div>
>>>>>>> 648b8e123a0f650d74ce6d16af6d0dcdd832348e
        </CardContent>
      </Card>

      {/* Event Card Popup */}
      {showEventCard && selectedDate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-in zoom-in-95 duration-300">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">
                  {new Date(selectedDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEventCard(false)}
                  className="h-8 w-8 p-0 hover:bg-white/20 text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-4">
<<<<<<< HEAD
                {getEventsForDate(selectedDate).map((event, index) => {
                  const userJoined = userParticipations[event.id]
                  const isFull = event.participants >= event.max_participants
                  
                  return (
                    <div
                      key={event.id}
                      className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-md transition-all duration-200 animate-in slide-in-from-bottom"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-gray-900 text-lg">{event.title}</h4>
                        <Badge className={`${categoryColors[event.category]} text-xs`}>{event.category}</Badge>
                      </div>

                      <p className="text-gray-600 text-sm mb-3">{event.description}</p>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4 text-green-600" />
                          {event.time}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4 text-green-600" />
                          {event.location}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="h-4 w-4 text-green-600" />
                          {event.participants}/{event.max_participants} participants
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <span className={`text-xs px-2 py-1 rounded ${
                          userJoined 
                            ? 'bg-green-100 text-green-700' 
                            : isFull 
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {userJoined ? 'You joined' : isFull ? 'Event full' : 'Available'}
                        </span>
                        
                        {currentUser ? (
                          <Button
                            size="sm"
                            onClick={() => handleEventAction(event.id)}
                            disabled={!userJoined && isFull}
                            className={`transition-all duration-200 hover:scale-105 ${
                              userJoined 
                                ? 'bg-red-600 hover:bg-red-700 text-white' 
                                : isFull
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700 text-white'
                            } disabled:bg-gray-400 disabled:cursor-not-allowed`}
                          >
                            {userJoined ? 'Leave Event' : isFull ? 'Full' : 'Join Event'}
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => alert('Please sign in to join events')}
                            className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 hover:scale-105"
                          >
                            Sign In to Join
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
=======
                {getEventsForDate(selectedDate).map((event, index) => (
                  <div
                    key={event.id}
                    className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-md transition-all duration-200 animate-in slide-in-from-bottom duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-gray-900 text-lg">{event.title}</h4>
                      <Badge className={`${categoryColors[event.category]} text-xs`}>{event.category}</Badge>
                    </div>

                    <p className="text-gray-600 text-sm mb-3">{event.description}</p>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4 text-green-600" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 text-green-600" />
                        {event.location}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {event.participants}/{event.maxParticipants} participants
                      </span>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white transition-all duration-200 hover:scale-105"
                      >
                        Join Event
                      </Button>
                    </div>
                  </div>
                ))}
>>>>>>> 648b8e123a0f650d74ce6d16af6d0dcdd832348e
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
