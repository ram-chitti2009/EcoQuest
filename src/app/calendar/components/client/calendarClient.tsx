"use client"

import Header from "@/app/components/Header"
import { createClient } from "@/utils/supabase/client"
import { getDashboardMetrics } from "@/utils/supabase/functions"
import { Calendar, MapPin, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { CompactCalendar } from "../compact-calendar"
import { UpcomingEvents } from "../upcomingEvents"

export default function EcoCalendar() {
  const [metrics, setMetrics] = useState({
    eventsThisMonth: 0,
    totalParticipants: 0,
    eventsJoined: 0
  })
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const supabase = createClient()

  // Check authentication status
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)
    }
    checkUser()
  }, [supabase.auth])

  // Load dashboard metrics
  const loadMetrics = async () => {
    try {
      setLoading(true)
      const dashboardData = await getDashboardMetrics(currentUser?.id)
      
      if (!dashboardData.error) {
        setMetrics({
          eventsThisMonth: dashboardData.eventsThisMonth,
          totalParticipants: dashboardData.totalParticipants,
          eventsJoined: dashboardData.eventsJoined
        })
      } else {
        console.error('Error loading dashboard metrics:', dashboardData.error)
      }
    } catch (error) {
      console.error('Error in loadMetrics:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (currentUser !== null) {
      loadMetrics()
    }
  }, [currentUser])

  // Refresh metrics function to pass to child components
  const refreshMetrics = async () => {
    await loadMetrics()
  }

  // Handle month change from calendar
  const handleMonthChange = (newMonth: Date) => {
    setCurrentMonth(newMonth)
  }

  const statsConfig = [
    { 
      label: "Events This Month", 
      value: loading ? "..." : metrics.eventsThisMonth.toString(), 
      icon: Calendar, 
      color: "from-green-500 to-emerald-500" 
    },
    { 
      label: "Total Participants", 
      value: loading ? "..." : metrics.totalParticipants.toString(), 
      icon: Users, 
      color: "from-emerald-500 to-teal-500" 
    },
    { 
      label: "Events Joined", 
      value: loading ? "..." : metrics.eventsJoined.toString(), 
      icon: MapPin, 
      color: "from-teal-500 to-green-500" 
    },
  ]
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <Header 
        title="Eco Calendar" 
      />
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {statsConfig.map((stat, index) => (
                <div
                  key={stat.label}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 hover:scale-105 animate-in slide-in-from-bottom duration-500"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-4`}
                  >
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Calendar and Events Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Calendar - Takes more space */}
              <div className="lg:col-span-3 animate-in slide-in-from-left duration-700 delay-300">
                <CompactCalendar 
                  onMetricsUpdate={refreshMetrics} 
                  onMonthChange={handleMonthChange}
                />
              </div>

              {/* Upcoming Events - On the right */}
              <div className="lg:col-span-1 animate-in slide-in-from-right duration-700 delay-500">
                <UpcomingEvents currentMonth={currentMonth} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
