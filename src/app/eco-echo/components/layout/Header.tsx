"use client"

import { Calendar, Clock, User } from "lucide-react"
import Image from "next/image"
import React, { useState, useEffect } from "react"

interface HeaderProps {
  title?: string
  subtitle?: string
  centerMessage?: string
  showTimeDate?: boolean
  showUserAvatar?: boolean
}

export default function Header({
  title = "EcoQuest",
  subtitle = "",
  centerMessage = "🌍 Your Sustainability Partner 🌱",
  showTimeDate = true,
  showUserAvatar = true,
}: HeaderProps) {
  const [currentTime, setCurrentTime] = useState<Date>(new Date())

  // Update currentTime every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="bg-white border-b border-gray-200 px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 shadow-sm sticky top-0 z-50 flex-shrink-0">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
        {/* Logo and Title Section */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 order-1 sm:order-1">
          <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 relative bg-white rounded-full shadow-lg flex items-center justify-center p-1 transition-transform duration-300 hover:scale-110 flex-shrink-0">
            <Image
              src="/Screenshot 2025-07-12 172658.png"
              alt="EcoQuest Logo"
              fill
              className="rounded-full object-contain"
              priority
            />
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent whitespace-nowrap">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs sm:text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Center Message - Hidden on mobile, shown on larger screens */}
        <div className="hidden lg:flex flex-col items-center order-2 sm:order-2 flex-1">
          <p className="text-sm lg:text-base xl:text-lg text-gray-600 font-medium text-center">
            {centerMessage}
          </p>
        </div>

        {/* Time, Date, and User Section */}
        {(showTimeDate || showUserAvatar) && (
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 xl:gap-4 order-3 sm:order-3 flex-shrink-0">
            {/* Time Display - Responsive */}
            {showTimeDate && (
              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 px-2 sm:px-3 py-1 sm:py-1.5 lg:py-2 rounded-lg border border-gray-200">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
                <span className="hidden md:inline">{currentTime.toLocaleTimeString()}</span>
                <span className="md:hidden">{currentTime.toLocaleTimeString([], { timeStyle: "short" })}</span>
              </div>
            )}

            {/* Date Display - Hidden on very small screens */}
            {showTimeDate && (
              <div className="hidden sm:flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 px-2 sm:px-3 py-1 sm:py-1.5 lg:py-2 rounded-lg border border-gray-200">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                <span className="hidden lg:inline">{currentTime.toLocaleDateString()}</span>
                <span className="lg:hidden">{currentTime.toLocaleDateString([], { dateStyle: "short" })}</span>
              </div>
            )}

            {/* User Avatar */}
            {showUserAvatar && (
              <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer flex-shrink-0">
                <User className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Center Message - Only shown on mobile */}
      <div className="lg:hidden mt-2 text-center order-4">
        <p className="text-xs sm:text-sm text-gray-600 font-medium">{centerMessage}</p>
      </div>
    </header>
  )
}