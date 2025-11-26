"use client"

import { createClient } from "@/utils/supabase/client"
import { getDashboardMetricsUnified, getUpcomingUnifiedEvents } from "@/utils/supabase/functions"
import { useEffect, useState } from "react"
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, MapPin, Users } from "./icons"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader } from "./ui/card"

interface CalendarEvent {
  id?: number
  title: string
  description?: string
  date: string
  time?: string
  location?: string
  category: string
  max_participants?: number
  participants?: number
  organizer?: string | null
  type?: "cleanup" | "workshop" | "planting"
}

interface QuestCalendarProps {
  onMetricsUpdate?: () => void
}

export const QuestCalendar = ({ onMetricsUpdate }: QuestCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [metrics, setMetrics] = useState({
    eventsThisMonth: 0,
    totalParticipants: 0,
    eventsJoined: 0
  })
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null)
  const [userParticipations, setUserParticipations] = useState<{ [key: number]: boolean }>({})
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const supabase = createClient()

  const months = [
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

  // Check authentication status
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)
    }
    checkUser()
  }, [supabase.auth])

  // Check user participations for events
  useEffect(() => {
    const checkUserParticipations = async () => {
      if (!currentUser || events.length === 0) return

      try {
        const eventIds = events.map(event => event.id).filter(id => id !== undefined)
        
        if (eventIds.length > 0) {
          const { data: participations, error } = await supabase
            .from('community_cleanup_participants')
            .select('event_id')
            .eq('user_id', currentUser.id)
            .in('event_id', eventIds)

          if (!error && participations) {
            const participationMap: { [key: number]: boolean } = {}
            participations.forEach(p => {
              participationMap[p.event_id] = true
            })
            setUserParticipations(participationMap)
          }
        }
      } catch (error) {
        console.error('Error checking user participations:', error)
      }
    }

    checkUserParticipations()
  }, [currentUser, events, supabase])

  // Handle join/leave event
  const handleEventAction = async (eventId: number) => {
    if (!currentUser || !eventId) return

    setActionLoading(eventId)
    
    try {
      const isJoined = userParticipations[eventId]
      
      if (isJoined) {
        // Leave event
        const { error } = await supabase
          .from('community_cleanup_participants')
          .delete()
          .eq('event_id', eventId)
          .eq('user_id', currentUser.id)

        if (!error) {
          setUserParticipations(prev => ({ ...prev, [eventId]: false }))
          onMetricsUpdate?.()
        }
      } else {
        // Join event
        const { error } = await supabase
          .from('community_cleanup_participants')
          .insert({
            event_id: eventId,
            user_id: currentUser.id,
            joined_at: new Date().toISOString()
          })

        if (!error) {
          setUserParticipations(prev => ({ ...prev, [eventId]: true }))
          onMetricsUpdate?.()
        }
      }
    } catch (error) {
      console.error('Error handling event action:', error)
    } finally {
      setActionLoading(null)
    }
  }

  useEffect(() => {
    if (currentUser !== null) {
      // Load dashboard metrics and events
      const loadData = async () => {
        try {
          setLoading(true)
          
          // Load dashboard metrics
          const dashboardData = await getDashboardMetricsUnified(currentUser?.id)
          if (!dashboardData.error) {
            setMetrics({
              eventsThisMonth: dashboardData.eventsThisMonth,
              totalParticipants: dashboardData.totalParticipants,
              eventsJoined: dashboardData.eventsJoined
            })
          } else {
            console.error('Error loading dashboard metrics:', dashboardData.error)
          }

          // Load upcoming events
          const eventsData = await getUpcomingUnifiedEvents()
          if (!eventsData.error && eventsData.data) {
            // Transform events data to match our interface
            const transformedEvents = eventsData.data.map(event => ({
              id: event.id,
              title: event.title,
              description: event.description,
              date: event.date,
              time: event.time,
              location: event.location,
              category: event.category,
              max_participants: event.max_participants,
              participants: event.participants || 0,
              organizer: event.organizer,
              type: event.category?.toLowerCase().includes('cleanup') ? 'cleanup' as const :
                    event.category?.toLowerCase().includes('workshop') ? 'workshop' as const :
                    'planting' as const
            }))
            setEvents(transformedEvents)
          } else {
            console.error('Error loading events:', eventsData.error)
          }
        } catch (error) {
          console.error('Error in loadData:', error)
        } finally {
          setLoading(false)
        }
      }
      
      loadData()
    }
  }, [currentUser, currentMonth, currentYear])

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay()
  }

  const navigateMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (currentMonth === 0) {
        setCurrentMonth(11)
        setCurrentYear(currentYear - 1)
      } else {
        setCurrentMonth(currentMonth - 1)
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0)
        setCurrentYear(currentYear + 1)
      } else {
        setCurrentMonth(currentMonth + 1)
      }
    }
  }

  const handleDateClick = (day: number) => {
    setSelectedDate(selectedDate === day ? null : day)
  }

  const renderCalendarDay = (day: number, isCurrentMonth = true) => {
    // Find events for this specific day
    const dayEvents = events.filter(event => {
      // Parse date in local timezone to avoid UTC offset issues
      const eventDateParts = event.date.split('-')
      const eventDate = new Date(parseInt(eventDateParts[0]), parseInt(eventDateParts[1]) - 1, parseInt(eventDateParts[2]))
      return eventDate.getDate() === day && 
             eventDate.getMonth() === currentMonth && 
             eventDate.getFullYear() === currentYear
    })
    
    const today = new Date()
    const isToday = day === today.getDate() && 
                   currentMonth === today.getMonth() && 
                   currentYear === today.getFullYear()
    const isSelected = selectedDate === day

    return (
      <button
        key={day}
        onClick={() => isCurrentMonth && handleDateClick(day)}
        className={`p-1 sm:p-2 text-center relative rounded-lg transition-all duration-200 hover:bg-emerald-100 border min-h-[2.5rem] sm:min-h-[3rem] flex flex-col items-center justify-center w-full overflow-hidden ${
          !isCurrentMonth ? "text-gray-400 cursor-default border-transparent" : "cursor-pointer text-gray-900 border-gray-100 hover:border-emerald-300"
        } ${isSelected ? "bg-emerald-200 ring-2 ring-emerald-500 border-emerald-500" : ""} ${isToday ? "bg-emerald-500 text-white border-emerald-500" : ""}`}
        disabled={!isCurrentMonth}
      >
        <span className={`text-xs sm:text-sm font-medium ${isToday ? "font-bold text-white" : isSelected ? "font-semibold text-gray-900" : "text-gray-900"}`}>{day}</span>
        {dayEvents.length > 0 && (
          <div className="mt-0.5 sm:mt-1 space-y-0.5 w-full">
            {dayEvents.slice(0, 2).map((event, index) => (
              <div
                key={index}
                className={`px-0.5 sm:px-1 py-0.5 rounded text-[10px] sm:text-xs font-medium text-black w-full overflow-hidden ${
                  event.type === "cleanup" ? "bg-emerald-600" : event.type === "workshop" ? "bg-teal-600" : "bg-green-600"
                }`}
                title={event.title}
                style={{ color: 'black' }}
              >
                <div className="truncate w-full">
                  <span className="hidden sm:inline">{event.title.length > 12 ? event.title.slice(0, 12) + '...' : event.title}</span>
                  <span className="sm:hidden">{event.title.slice(0, 3)}...</span>
                </div>
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-[10px] text-gray-600 text-center">+{dayEvents.length - 2}</div>
            )}
          </div>
        )}
      </button>
    )
  }

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear)
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear)

    const calendarDays: React.ReactElement[] = []

    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(
        <div key={`empty-${i}`} className="p-2 text-center">
          {/* Empty cell */}
        </div>,
      )
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(renderCalendarDay(day, true))
    }

    const totalCells = 42 // 6 rows × 7 days
    const remainingCells = totalCells - calendarDays.length
    for (let i = 0; i < remainingCells; i++) {
      calendarDays.push(
        <div key={`empty-end-${i}`} className="p-2 text-center">
          {/* Empty cell */}
        </div>,
      )
    }

    return calendarDays
  }

  const monthEvents = loading ? 0 : metrics.eventsThisMonth
  const totalParticipants = loading ? 0 : metrics.totalParticipants
  const eventsJoined = loading ? 0 : metrics.eventsJoined

  return (
    <Card className="bg-white shadow-lg border border-gray-200">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 pb-4">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Quest Tracker</h3>
              <p className="text-sm text-gray-600">
                {months[currentMonth]} {currentYear}
              </p>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth("prev")}
                className="hover:bg-emerald-100 h-8 w-8 p-0"
              >
                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth("next")}
                className="hover:bg-emerald-100 h-8 w-8 p-0"
              >
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="ml-1 sm:ml-2 hover:bg-emerald-100 h-8 w-8 p-0"
              >
                {isExpanded ? <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" /> : <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isExpanded && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-white rounded-lg p-2 sm:p-3 shadow-sm border border-emerald-200">
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
                <div>
                  <p className="text-base sm:text-lg font-bold text-gray-900">{loading ? "..." : monthEvents}</p>
                  <p className="text-xs text-gray-600">Events This Month</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-2 sm:p-3 shadow-sm border border-emerald-200">
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
                <div>
                  <p className="text-base sm:text-lg font-bold text-gray-900">{loading ? "..." : totalParticipants}</p>
                  <p className="text-xs text-gray-600">Total Participants</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-2 sm:p-3 shadow-sm border border-emerald-200">
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-teal-500 to-green-500 rounded-lg flex items-center justify-center">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
                <div>
                  <p className="text-base sm:text-lg font-bold text-gray-900">{loading ? "..." : eventsJoined}</p>
                  <p className="text-xs text-gray-600">Events Joined</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-2 sm:mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="p-1 sm:p-2 text-center font-semibold text-xs sm:text-sm text-gray-700 bg-gray-50 rounded">
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day.slice(0, 1)}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0.5 sm:gap-1">{renderCalendarGrid()}</div>

        {selectedDate && (
          <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-white rounded-lg border border-emerald-200">
            <h4 className="font-semibold text-emerald-800 mb-1 sm:mb-2 text-sm sm:text-base">
              {months[currentMonth]} {selectedDate}, {currentYear}
            </h4>
            {(() => {
              const selectedDateEvents = events.filter(event => {
                // Parse date in local timezone to avoid UTC offset issues
                const eventDateParts = event.date.split('-')
                const eventDate = new Date(parseInt(eventDateParts[0]), parseInt(eventDateParts[1]) - 1, parseInt(eventDateParts[2]))
                return eventDate.getDate() === selectedDate &&
                       eventDate.getMonth() === currentMonth &&
                       eventDate.getFullYear() === currentYear
              })
              
              return selectedDateEvents.length > 0 ? (
                <div className="space-y-1 sm:space-y-2">
                  {selectedDateEvents.map((event, index) => {
                    const userJoined = event.id ? userParticipations[event.id] : false
                    const isFull = event.max_participants && event.participants && event.participants >= event.max_participants
                    
                    return (
                      <div key={event.id || index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <div
                          className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                            event.type === "cleanup"
                              ? "bg-emerald-600"
                              : event.type === "workshop"
                                ? "bg-teal-600"
                                : "bg-green-600"
                          }`}
                        />
                        <div className="flex-1">
                          <span className="text-xs sm:text-sm font-medium text-gray-900">{event.title}</span>
                          {event.time && (
                            <span className="text-xs text-gray-500 ml-2">at {event.time}</span>
                          )}
                          {event.location && (
                            <div className="text-xs text-gray-500">{event.location}</div>
                          )}
                          {event.participants && (
                            <span className="text-xs text-gray-500">({event.participants} participants)</span>
                          )}
                        </div>
                        
                        {/* Join/Leave Event Button */}
                        {currentUser && event.id && (
                          <Button
                            size="sm"
                            onClick={() => {
                              if (!(!userJoined && isFull) && actionLoading !== event.id) {
                                handleEventAction(event.id!)
                              }
                            }}
                            variant={isFull ? 'outline' : 'default'}
                            className={`transition-all duration-300 hover:scale-105 min-w-[80px] text-xs ${
                              actionLoading === event.id ? 'animate-pulse' : ''
                            } ${
                              (!userJoined && isFull) || actionLoading === event.id
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300'
                                : userJoined 
                                  ? 'bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700' 
                                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            }`}
                          >
                            {actionLoading === event.id ? (
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              </div>
                            ) : (
                              userJoined ? 'Leave Event' : isFull ? 'Full' : 'Join Event'
                            )}
                          </Button>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-gray-500">No events scheduled for this date</p>
              )
            })()}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
