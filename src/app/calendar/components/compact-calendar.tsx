"use client"

import { createClient } from "@/utils/supabase/client"
import {
  checkUserEventParticipation,
  getEcoEventsByMonth,
  joinEcoEvent,
  leaveEcoEvent
} from "@/utils/supabase/functions"
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Leaf,
  MapPin,
  Sparkles,
  TreePine,
  Users,
  X
} from "lucide-react"
import { useEffect, useState } from "react"
import { CATEGORY_CONFIG, DAY_NAMES, MONTH_NAMES } from "./constants/calendar"
import { CalendarSkeleton, EventCardSkeleton } from "./LoadingSkeleton"
import type { CalendarDay, EcoEvent } from "./types/eco-events"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader } from "./ui/card"

interface CompactCalendarProps {
  onMetricsUpdate?: () => Promise<void>
  onMonthChange?: (date: Date) => void
}

export function CompactCalendar({ onMetricsUpdate, onMonthChange }: CompactCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showEventCard, setShowEventCard] = useState(false)
  const [ecoEvents, setEcoEvents] = useState<EcoEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
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

  // Notify parent about initial month
  useEffect(() => {
    if (onMonthChange) {
      onMonthChange(currentDate)
    }
  }, [onMonthChange, currentDate])

  // Fetch events when component mounts or month changes
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      try {
        console.log(`🌱 Fetching eco events for ${year}-${month + 1}`)
        const { data, error } = await getEcoEventsByMonth(year, month + 1)
        
        if (error) {
          console.error('🚨 Error fetching events:', error)
        } else {
          console.log(`🌿 Found ${data?.length || 0} eco events`)
          setEcoEvents(data || [])
          
          // Load user participation status
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
        console.error('🚨 Error fetching events:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [year, month, currentUser])

  // Handle joining/leaving events
  const handleEventAction = async (eventId: number) => {
    if (!currentUser) {
      alert('🌱 Please sign in to join our eco community!')
      return
    }

    const isJoined = userParticipations[eventId]
    setActionLoading(eventId)
    
    try {
      let result
      if (isJoined) {
        result = await leaveEcoEvent(eventId, currentUser.id)
      } else {
        result = await joinEcoEvent(eventId, currentUser.id)
      }

      if (result.success) {
        // Update local participation state with animation
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

        // Show success message with eco theme
        alert(`🌟 ${result.message}`)
      }
    } catch (error) {
      console.error('🚨 Error with event action:', error)
      alert('🌿 Something went wrong. Please try again!')
    } finally {
      setActionLoading(null)
    }
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(year, direction === 'prev' ? month - 1 : month + 1, 1)
    setCurrentDate(newDate)
    setSelectedDate(null)
    setShowEventCard(false)
    
    // Notify parent about month change
    if (onMonthChange) {
      onMonthChange(newDate)
    }
  }

  const getEventsForDate = (day: number, checkYear: number, checkMonth: number): EcoEvent[] => {
    return ecoEvents.filter((event) => {
      const eventDate = new Date(event.date)
      return eventDate.getDate() === day && 
             eventDate.getMonth() === checkMonth && 
             eventDate.getFullYear() === checkYear
    })
  }

  const hasEvents = (day: number, checkYear: number, checkMonth: number): boolean => {
    return getEventsForDate(day, checkYear, checkMonth).length > 0
  }

  const handleDateClick = (day: number, clickYear: number, clickMonth: number) => {
    const events = getEventsForDate(day, clickYear, clickMonth)

    if (events.length > 0) {
      const dateString = `${clickYear}-${String(clickMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      setSelectedDate(dateString)
      setShowEventCard(true)
    }
  }

  // Generate calendar days
  const generateCalendarDays = (): CalendarDay[] => {
    const calendarDays: CalendarDay[] = []
    
    const firstDayOfMonth = new Date(year, month, 1).getDay()
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate()
    const daysInPrevMonth = new Date(year, month, 0).getDate()
    
    // Previous month days
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
    
    // Current month days
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
    
    // Next month days
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
      })
    }

    return calendarDays
  }

  const calendarDays = generateCalendarDays()

  return (
    <div className="w-full relative">
      {/* Decorative background elements */}
      <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-emerald-200/30 to-green-200/30 rounded-full blur-xl"></div>
      <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-br from-lime-200/30 to-emerald-200/30 rounded-full blur-xl"></div>

      <Card className="shadow-2xl border-emerald-200/50 bg-gradient-to-br from-white via-emerald-50/30 to-green-50/30 backdrop-blur-sm transition-all duration-500 hover:shadow-3xl hover:scale-[1.02]">
        {/* Header */}
        <CardHeader className="pb-4 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600 text-white rounded-t-2xl relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  {MONTH_NAMES[month]} {year}
                  <Sparkles className="h-5 w-5 text-emerald-200" />
                </h2>
                <p className="text-emerald-100 text-sm">Eco Events Calendar</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('prev')}
                className="h-10 w-10 p-0 hover:bg-white/20 text-white transition-all duration-300 hover:scale-110 hover:rotate-6"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('next')}
                className="h-10 w-10 p-0 hover:bg-white/20 text-white transition-all duration-300 hover:scale-110 hover:-rotate-6"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Day names */}
          <div className="grid grid-cols-7 gap-2 mt-6 relative z-10">
            {DAY_NAMES.map((day, index) => (
              <div 
                key={day} 
                className="h-12 flex items-center justify-center text-sm font-semibold text-emerald-100 transition-all duration-300 hover:text-white hover:scale-110"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {day}
              </div>
            ))}
          </div>
        </CardHeader>

        {/* Calendar Grid */}
        <CardContent className="p-6 bg-gradient-to-br from-white/80 to-emerald-50/50"> 
          {loading ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="relative">
                  <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                  <TreePine className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-3 w-3 text-emerald-600" />
                </div>
                <span className="text-emerald-700 font-medium">Loading eco events...</span>
              </div>
              <CalendarSkeleton />
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-3">
              {calendarDays.map((calendarDay, index) => {
                const dateString = `${calendarDay.year}-${String(calendarDay.month + 1).padStart(2, "0")}-${String(calendarDay.day).padStart(2, "0")}`

                return (
                  <button
                    key={index}
                    onClick={() => handleDateClick(calendarDay.day, calendarDay.year, calendarDay.month)}
                    className={`
                      h-14 w-14 flex items-center justify-center text-sm rounded-2xl transition-all duration-300 relative font-medium border-2 group
                      ${
                        !calendarDay.isCurrentMonth
                          ? calendarDay.hasEvents
                            ? "text-emerald-600 bg-emerald-50 border-emerald-200 cursor-pointer hover:bg-emerald-100 hover:border-emerald-300 hover:scale-110 hover:shadow-lg hover:rotate-2"
                            : "text-gray-300 cursor-default bg-transparent border-transparent"
                          : calendarDay.hasEvents
                          ? "text-white bg-gradient-to-br from-emerald-500 to-green-500 border-emerald-400 cursor-pointer hover:from-emerald-600 hover:to-green-600 hover:border-emerald-500 hover:scale-110 hover:shadow-xl hover:-rotate-2 shadow-lg"
                          : calendarDay.isToday
                          ? "text-white bg-gradient-to-br from-blue-500 to-indigo-500 border-blue-400 cursor-pointer hover:from-blue-600 hover:to-indigo-600 hover:border-blue-500 hover:scale-110 hover:shadow-xl hover:rotate-2 shadow-lg"
                          : "text-gray-700 bg-white/80 border-gray-200 cursor-pointer hover:bg-emerald-50 hover:border-emerald-300 hover:scale-105 hover:shadow-md"
                      }
                      ${selectedDate === dateString ? "ring-4 ring-emerald-400 ring-opacity-50 scale-110" : ""}
                    `}
                    disabled={!calendarDay.hasEvents && !calendarDay.isCurrentMonth}
                    style={{ animationDelay: `${index * 10}ms` }}
                  >
                    {calendarDay.day}
                    {calendarDay.hasEvents && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-lime-400 to-emerald-400 rounded-full animate-pulse group-hover:scale-125 transition-transform duration-300"></div>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Event Popup */}
      {showEventCard && selectedDate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 animate-in zoom-in-95 duration-500 border border-emerald-200/50 overflow-hidden">
            {/* Event Card Header */}
            <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600 text-white p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 opacity-20">
                <Leaf className="h-24 w-24 text-white/30" />
              </div>
              
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <h3 className="text-xl font-bold mb-1">
                    {(() => {
                      // Parse selectedDate as local date to avoid timezone issues
                      const [year, month, day] = selectedDate.split('-')
                      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
                      return date.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })
                    })()}
                  </h3>
                  <p className="text-emerald-100 text-sm flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Eco Events Today
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEventCard(false)}
                  className="h-10 w-10 p-0 hover:bg-white/20 text-white transition-all duration-300 hover:scale-110 hover:rotate-90 rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Events List */}
            <div className="p-6 max-h-96 overflow-y-auto bg-gradient-to-br from-white to-emerald-50/30 scrollbar-hide">
              {loading ? (
                <EventCardSkeleton />
              ) : (
                <div className="space-y-4">
                  {(() => {
                    if (!selectedDate) return []
                    const [year, month, day] = selectedDate.split('-').map(Number)
                    return getEventsForDate(day, year, month - 1) // month - 1 because JS months are 0-based
                  })().map((event, index) => {
                    const userJoined = userParticipations[event.id]
                    const isFull = event.participants >= event.max_participants
                    const categoryConfig = CATEGORY_CONFIG[event.category]
                    
                    return (
                      <div
                        key={event.id}
                        className="group p-5 bg-gradient-to-r from-white via-emerald-50/30 to-green-50/30 rounded-2xl border border-emerald-200/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-emerald-300/50 backdrop-blur-sm"
                        style={{ animationDelay: `${index * 150}ms` }}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-emerald-700 transition-colors duration-300">
                              {categoryConfig.icon} {event.title}
                            </h4>
                            <Badge className={`${categoryConfig.color} text-xs font-semibold`}>
                              {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                            </Badge>
                          </div>
                        </div>

                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">{event.description}</p>

                        <div className="space-y-3 mb-4">
                          <div className="flex items-center gap-3 text-sm text-gray-600 hover:text-emerald-600 transition-colors duration-200">
                            <div className="p-1.5 bg-emerald-100 rounded-lg">
                              <Clock className="h-4 w-4 text-emerald-600" />
                            </div>
                            <span className="font-medium">{event.time}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-600 hover:text-emerald-600 transition-colors duration-200">
                            <div className="p-1.5 bg-emerald-100 rounded-lg">
                              <MapPin className="h-4 w-4 text-emerald-600" />
                            </div>
                            <span className="font-medium">{event.location}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <div className="p-1.5 bg-emerald-100 rounded-lg">
                              <Users className="h-4 w-4 text-emerald-600" />
                            </div>
                            <span className="font-medium">
                              {event.participants}/{event.max_participants} eco warriors joined
                            </span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2 ml-2">
                              <div 
                                className="bg-gradient-to-r from-emerald-400 to-green-400 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${(event.participants / event.max_participants) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                            userJoined 
                              ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200' 
                              : isFull 
                              ? 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border border-red-200'
                              : 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200'
                          }`}>
                            {userJoined ? '🌱 You\'re joining!' : isFull ? '🚫 Event full' : '✨ Available'}
                          </div>
                          
                          {currentUser ? (
                            <Button
                              size="sm"
                              onClick={() => handleEventAction(event.id)}
                              disabled={(!userJoined && isFull) || actionLoading === event.id}
                              variant={userJoined ? 'destructive' : isFull ? 'outline' : 'default'}
                              className={`transition-all duration-300 hover:scale-105 min-w-[100px] ${
                                actionLoading === event.id ? 'animate-pulse' : ''
                              }`}
                            >
                              {actionLoading === event.id ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                </div>
                              ) : (
                                userJoined ? 'Leave Event' : isFull ? 'Full' : 'Join Event'
                              )}
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => alert('🌱 Please sign in to join our eco community!')}
                              variant="default"
                              className="transition-all duration-300 hover:scale-105"
                            >
                              🌿 Sign In to Join
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}