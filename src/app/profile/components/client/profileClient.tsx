"use client"

import { Award, Calendar, Clock, Edit3, Leaf, MapPin, Save, TreePine, User, Users, X } from "lucide-react"
import { useEffect, useState } from "react"
import { AchievementsModal } from "../achievments"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Textarea } from "../ui/textArea"

export default function Component() {
  const [isEditingAbout, setIsEditingAbout] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [aboutText, setAboutText] = useState(
    "Passionate about environmental conservation and making a positive impact in my community. I love participating in cleanup events and finding new ways to reduce my carbon footprint. Always looking for opportunities to learn and help others on their sustainability journey!",
  )

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])

  const userStats = {
    carbonSaved: 127.5,
    volunteerHours: 24,
    cleanupsParticipated: 8,
  }

  const recentBadges = [
    { id: 1, name: "First Cleanup", icon: Users, earned: true },
    { id: 2, name: "50 kg CO₂ Saved", icon: Leaf, earned: true },
    { id: 3, name: "Eco Warrior", icon: Award, earned: true },
    { id: 4, name: "Tree Hugger", icon: TreePine, earned: false },
  ]

  const handleSaveAbout = () => {
    setIsEditingAbout(false)
    // Here you would typically save to your backend
  }

  const handleCancelEdit = () => {
    setIsEditingAbout(false)
    // Reset to original text if needed
  }

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b-2 border-gray-300 px-6 py-4 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-800">
              Profile
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-100 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <Clock className="w-4 h-4 animate-pulse" />
              <span>{currentTime.toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-100 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <Calendar className="w-4 h-4" />
              <span>{currentTime.toLocaleDateString()}</span>
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex-1 p-2 sm:p-4 md:p-6 overflow-y-auto">
        <div className="w-full max-w-none mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 h-full">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-1 space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8">
              {/* Profile Card */}
              <Card className="border-0 shadow-lg">
                <CardContent className="pt-4 pb-4 sm:pt-6 sm:pb-6 md:pt-8 md:pb-8">
                  <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4 md:space-y-6">
                    <Avatar className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 border-2 sm:border-4 border-green-200">
                      <AvatarImage src="/placeholder.svg?height=192&width=192" />
                      <AvatarFallback className="bg-green-100 text-green-700 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold">AJ</AvatarFallback>
                    </Avatar>
    
                    <div className="space-y-1 sm:space-y-2 md:space-y-3">
                      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">Alex Johnson</h1>
                      <p className="text-base sm:text-lg md:text-xl text-gray-600">Environmental Enthusiast</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
    
              {/* Location Card */}
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-2 sm:pb-3 md:pb-4">
                  <CardTitle className="text-lg sm:text-xl md:text-2xl flex items-center gap-2 sm:gap-3">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-green-600" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4 sm:pb-5 md:pb-6">
                  <div className="space-y-2 sm:space-y-3">
                    <p className="font-medium text-base sm:text-lg md:text-xl text-gray-900">San Francisco, CA</p>
                    <p className="text-sm sm:text-base md:text-lg text-gray-600">United States</p>
                    <p className="text-xs sm:text-sm md:text-base text-gray-500">Member since March 2024</p>
                  </div>
                </CardContent>
              </Card>
    
              {/* About Me Card */}
              <Card className="border-0 shadow-md flex-1">
                <CardHeader className="pb-2 sm:pb-3 md:pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg sm:text-xl md:text-2xl">About Me</CardTitle>
                    {!isEditingAbout && (
                      <Button variant="ghost" size="sm" onClick={() => setIsEditingAbout(true)} className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 p-0">
                        <Edit3 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pb-4 sm:pb-5 md:pb-6">
                  {isEditingAbout ? (
                    <div className="space-y-3 sm:space-y-4">
                      <Textarea
                        value={aboutText}
                        onChange={(e) => setAboutText(e.target.value)}
                        className="min-h-[100px] sm:min-h-[120px] md:min-h-[140px] text-sm sm:text-base resize-none"
                        placeholder="Tell us about yourself..."
                      />
                      <div className="flex gap-2 sm:gap-3">
                        <Button size="sm" onClick={handleSaveAbout} className="flex items-center gap-1 sm:gap-2 sm:px-4 sm:py-2">
                          <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEdit}
                          className="flex items-center gap-1 sm:gap-2 bg-transparent sm:px-4 sm:py-2"
                        >
                          <X className="w-3 h-3 sm:w-4 sm:h-4" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">{aboutText}</p>
                  )}
                </CardContent>
              </Card>
            </div>
                
            {/* Right Column - Impact & Achievements */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8">
              {/* Impact Summary */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-3 sm:pb-4 md:pb-6">
                  <CardTitle className="text-xl sm:text-2xl md:text-3xl text-gray-900">Your Impact</CardTitle>
                </CardHeader>
                <CardContent className="pb-4 sm:pb-6 md:pb-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                    <Card className="border-0 shadow-md bg-gradient-to-r from-green-500 to-green-600 text-white">
                      <CardContent className="p-4 sm:p-6 md:p-8">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-green-100 text-xs sm:text-sm md:text-base font-medium">Carbon Saved</p>
                            <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">{userStats.carbonSaved}</p>
                            <p className="text-green-100 text-xs sm:text-sm">kg CO₂ equivalent</p>
                          </div>
                          <Leaf className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 text-green-200" />
                        </div>
                      </CardContent>
                    </Card>
                
                    <Card className="border-0 shadow-md">
                      <CardContent className="p-4 sm:p-6 md:p-8">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-600 text-xs sm:text-sm md:text-base font-medium">Volunteer Hours</p>
                            <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">{userStats.volunteerHours}</p>
                            <p className="text-gray-500 text-xs sm:text-sm">hours logged</p>
                          </div>
                          <div className="p-2 sm:p-3 md:p-4 bg-blue-100 rounded-lg">
                            <Clock className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-blue-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                
                    <Card className="border-0 shadow-md sm:col-span-2 md:col-span-1">
                      <CardContent className="p-4 sm:p-6 md:p-8">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-600 text-xs sm:text-sm md:text-base font-medium">Cleanups</p>
                            <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">{userStats.cleanupsParticipated}</p>
                            <p className="text-gray-500 text-xs sm:text-sm">events joined</p>
                          </div>
                          <div className="p-2 sm:p-3 md:p-4 bg-orange-100 rounded-lg">
                            <Users className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-orange-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
                
              {/* Achievements Section */}
              <Card className="border-0 shadow-lg flex-1">
                <CardHeader className="pb-3 sm:pb-4 md:pb-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl sm:text-2xl md:text-3xl text-gray-900">Recent Achievements</CardTitle>
                    <AchievementsModal />
                  </div>
                </CardHeader>
                <CardContent className="pb-4 sm:pb-6 md:pb-8">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                    {recentBadges.map((badge) => {
                      const IconComponent = badge.icon
                      return (
                        <div
                          key={badge.id}
                          className={`flex flex-col items-center p-3 sm:p-4 md:p-6 rounded-lg transition-all ${
                            badge.earned
                              ? "bg-white border-2 border-green-200 shadow-sm"
                              : "bg-gray-50 border border-gray-200 opacity-60"
                          }`}
                        >
                          <div className={`p-2 sm:p-3 md:p-4 rounded-full mb-2 sm:mb-3 md:mb-4 ${badge.earned ? "bg-green-100" : "bg-gray-100"}`}>
                            <IconComponent className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 ${badge.earned ? "text-green-600" : "text-gray-400"}`} />
                          </div>
                          <Badge
                            variant="secondary"
                            className={`text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2 ${
                              badge.earned
                                ? "bg-green-100 text-green-800 border-green-200"
                                : "bg-gray-100 text-gray-500 border-gray-200"
                            } border-0`}
                          >
                            {badge.name}
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
                  
              {/* Motivational Card */}
              <Card className="border-0 shadow-md bg-gradient-to-r from-blue-500 to-green-500 text-white">
                <CardContent className="p-4 sm:p-6 md:p-8 text-center">
                  <p className="text-sm sm:text-base font-medium text-blue-100 mb-2 sm:mb-3">Keep up the great work!</p>
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">Every action makes a difference 🌍</p>
                  <p className="text-sm sm:text-base text-blue-100 mt-2 sm:mt-3">You are making a real impact on our planet</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
