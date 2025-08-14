"use client"

import { useState } from "react"
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, MapPin, Users } from "./icons"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader } from "./ui/card"

interface CalendarEvent {
  date: number
  title: string
  type: "cleanup" | "workshop" | "planting"
  participants?: number
}

interface QuestCalendarProps {
  events: CalendarEvent[]
}

export const QuestCalendar = ({ events }: QuestCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(7) // August = 7 (0-indexed)
  const [currentYear, setCurrentYear] = useState(2025)
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedDate, setSelectedDate] = useState<number | null>(null)

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
    const event = events.find((e) => e.date === day)
    const isToday = day === 15 && currentMonth === 7 && currentYear === 2025
    const isSelected = selectedDate === day

    return (
      <button
        key={day}
        onClick={() => isCurrentMonth && handleDateClick(day)}
        className={`p-1 sm:p-2 text-center relative rounded-lg transition-all duration-200 hover:bg-emerald-100 border min-h-[2.5rem] sm:min-h-[3rem] flex flex-col items-center justify-center ${
          !isCurrentMonth ? "text-gray-400 cursor-default border-transparent" : "cursor-pointer text-gray-900 border-gray-100 hover:border-emerald-300"
        } ${isSelected ? "bg-emerald-200 ring-2 ring-emerald-500 border-emerald-500" : ""} ${isToday ? "bg-emerald-500 text-white border-emerald-500" : ""}`}
        disabled={!isCurrentMonth}
      >
        <span className={`text-xs sm:text-sm font-medium ${isToday ? "font-bold text-white" : isSelected ? "font-semibold text-gray-900" : "text-gray-900"}`}>{day}</span>
        {event && (
          <div
            className={`mt-0.5 sm:mt-1 px-0.5 sm:px-1 py-0.5 rounded text-[10px] sm:text-xs font-medium text-white truncate max-w-full ${
              event.type === "cleanup" ? "bg-emerald-600" : event.type === "workshop" ? "bg-teal-600" : "bg-green-600"
            }`}
            title={event.title}
          >
            <span className="hidden sm:inline">{event.title}</span>
            <span className="sm:hidden">{event.title.slice(0, 3)}...</span>
          </div>
        )}
      </button>
    )
  }

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear)
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear)

    const calendarDays = []

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

  const monthEvents = events.length
  const totalParticipants = events.reduce((sum, event) => sum + (event.participants || 0), 0)
  const eventsJoined = events.filter((event) => event.date <= 15).length // Assuming today is 15th

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
                  <p className="text-base sm:text-lg font-bold text-gray-900">{monthEvents}</p>
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
                  <p className="text-base sm:text-lg font-bold text-gray-900">{totalParticipants}</p>
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
                  <p className="text-base sm:text-lg font-bold text-gray-900">{eventsJoined}</p>
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
            {events.find((e) => e.date === selectedDate) ? (
              <div className="space-y-1 sm:space-y-2">
                {events
                  .filter((e) => e.date === selectedDate)
                  .map((event, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                          event.type === "cleanup"
                            ? "bg-emerald-600"
                            : event.type === "workshop"
                              ? "bg-teal-600"
                              : "bg-green-600"
                        }`}
                      />
                      <span className="text-xs sm:text-sm font-medium">{event.title}</span>
                      {event.participants && (
                        <span className="text-xs text-gray-500">({event.participants} participants)</span>
                      )}
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-gray-500">No events scheduled for this date</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
