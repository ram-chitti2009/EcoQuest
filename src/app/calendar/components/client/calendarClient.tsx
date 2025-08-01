"use client"

import { Calendar, MapPin, Users } from "lucide-react"
import { CompactCalendar } from "../compact-calendar"
import { Header } from "../layout/Header"
import { UpcomingEvents } from "../upcomingEvents"

export default function EcoCalendar() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <Header 
              title="Your Eco Calendar" 
              subtitle="Discover and join eco-friendly events in your community" 
            />
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { label: "Events This Month", value: "12", icon: Calendar, color: "from-green-500 to-emerald-500" },
                { label: "Total Participants", value: "248", icon: Users, color: "from-emerald-500 to-teal-500" },
                { label: "Events Joined", value: "5", icon: MapPin, color: "from-teal-500 to-green-500" },
              ].map((stat, index) => (
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
                <CompactCalendar />
              </div>

              {/* Upcoming Events - On the right */}
              <div className="lg:col-span-1 animate-in slide-in-from-right duration-700 delay-500">
                <UpcomingEvents />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
