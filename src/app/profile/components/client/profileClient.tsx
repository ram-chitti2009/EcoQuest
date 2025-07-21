"use client"

import { Award, Calendar, Camera, Clock, Edit3, Leaf, MapPin, Save, TreePine, User, Users, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { AchievementsModal } from "../achievments"
import { ImpactModal } from "../impactModel"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/Input"
import { Textarea } from "../ui/textArea"

export default function Component() {
  const [isEditingAbout, setIsEditingAbout] = useState(false)
  const [isEditingLocation, setIsEditingLocation] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [profileImage, setProfileImage] = useState("/placeholder.svg?height=192&width=192")
  const [aboutText, setAboutText] = useState(
    "Passionate about environmental conservation and making a positive impact in my community. I love participating in cleanup events and finding new ways to reduce my carbon footprint. Always looking for opportunities to learn and help others on their sustainability journey!",
  )
  const [userProfile, setUserProfile] = useState({
    name: "Alex Johnson",
    title: "Environmental Enthusiast",
  })
  const [tempProfile, setTempProfile] = useState(userProfile)
  const [location, setLocation] = useState({
    city: "San Francisco, CA",
    country: "United States",
    memberSince: "March 2024",
  })
  const [tempLocation, setTempLocation] = useState(location)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    console.log("Saving about text:", aboutText)
  }

  const handleCancelAboutEdit = () => {
    setIsEditingAbout(false)
  }

  const handleSaveName = () => {
    setUserProfile(tempProfile)
    setIsEditingName(false)
    console.log("Saving profile:", tempProfile)
  }

  const handleCancelNameEdit = () => {
    setTempProfile(userProfile)
    setIsEditingName(false)
  }

  const handleSaveLocation = () => {
    setLocation(tempLocation)
    setIsEditingLocation(false)
    console.log("Saving location:", tempLocation)
  }

  const handleCancelLocationEdit = () => {
    setTempLocation(location)
    setIsEditingLocation(false)
  }

  const handleProfileImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file")
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB")
        return
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setProfileImage(result)
        console.log("Saving profile image:", file.name)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header - Fully responsive */}
      <header className="bg-white border-b border-gray-200 px-3 sm:px-4 md:px-6 py-3 sm:py-4 shadow-sm sticky top-0 z-50 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Profile</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg border border-gray-200">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
              <span className="hidden md:inline">{currentTime.toLocaleTimeString()}</span>
              <span className="md:hidden">{currentTime.toLocaleTimeString([], { timeStyle: 'short' })}</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg border border-gray-200">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
              <span className="hidden lg:inline">{currentTime.toLocaleDateString()}</span>
              <span className="lg:hidden">{currentTime.toLocaleDateString([], { dateStyle: 'short' })}</span>
            </div>
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-1 space-y-4 sm:space-y-5 md:space-y-6">
              {/* Profile Card */}
              <Card className="shadow-lg border-0 bg-white">
                <CardContent className="pt-4 pb-4 sm:pt-6 sm:pb-6 md:pt-8 md:pb-8">
                  <div className="flex flex-col items-center text-center space-y-4 sm:space-y-5 md:space-y-6">
                    <div className="relative group">
                      <Avatar className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 border-2 sm:border-3 md:border-4 border-green-200 cursor-pointer transition-all duration-300 group-hover:border-green-300 group-hover:shadow-lg">
                        <AvatarImage src={profileImage || "/placeholder.svg"} alt="Profile picture" />
                        <AvatarFallback className="bg-green-100 text-green-700 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold">
                          {userProfile.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                        onClick={handleProfileImageClick}
                      >
                        <Camera className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>

                    <div className="space-y-2 sm:space-y-3 w-full">
                      {isEditingName ? (
                        <div className="space-y-3 sm:space-y-4 w-full">
                          <div className="space-y-2 sm:space-y-3">
                            {/* Name and Title */}
                            <Input
                              value={tempProfile.name}
                              onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                              className="text-center text-base sm:text-lg font-bold border-2 focus:border-blue-500 text-black"
                              placeholder="Enter your name"
                            />
                            <Input
                              value={tempProfile.title}
                              onChange={(e) => setTempProfile({ ...tempProfile, title: e.target.value })}
                              className="text-center text-sm sm:text-base border-2 focus:border-blue-500 text-black"
                              placeholder="Enter your title"
                            />
                          </div>
                          <div className="flex gap-2 sm:gap-3 justify-center">
                            <Button
                              size="sm"
                              onClick={handleSaveName}
                              className="flex items-center gap-1 sm:gap-2 bg-green-600 hover:bg-green-700 px-3 sm:px-4"
                            >
                              <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="text-xs sm:text-sm">Save</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelNameEdit}
                              className="flex items-center gap-1 sm:gap-2 border-2 bg-transparent px-3 sm:px-4"
                            >
                      <X className="w-3 h-3 sm:w-4 sm:h-4 text-black" />
                              <span className="text-xs sm:text-sm text-black">Cancel</span>
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="relative group w-full">
                          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">{userProfile.name}</h1>
                          <p className="text-base sm:text-lg md:text-xl text-gray-600">{userProfile.title}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditingName(true)}
                            className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 h-6 w-6 sm:h-8 sm:w-8 p-0 bg-white border border-gray-200 shadow-sm hover:shadow-md hover:bg-gray-50 opacity-0 group-hover:opacity-100 transition-all duration-200"
                          >
                            <Edit3 className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location Card */}
              <Card className="shadow-md border-0 bg-white">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg sm:text-xl md:text-2xl flex items-center gap-2 sm:gap-3">
                      <MapPin className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-green-600" />
                      <span className="text-black">Location</span>
                    </CardTitle>
                    {!isEditingLocation && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditingLocation(true)}
                        className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 p-0 bg-white border border-gray-200 shadow-sm hover:shadow-md hover:bg-gray-50"
                      >
                        <Edit3 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pb-4 sm:pb-5 md:pb-6">
                  {isEditingLocation ? (
                    <div className="space-y-3 sm:space-y-4">
                      <div className="space-y-1 sm:space-y-2">
                        <label className="text-xs sm:text-sm font-medium text-gray-700">City</label>
                        <Input
                          value={tempLocation.city}
                          onChange={(e) => setTempLocation({ ...tempLocation, city: e.target.value })}
                          className="border-2 focus:border-blue-500 text-sm sm:text-base text-black"
                          placeholder="Enter your city"
                        />
                      </div>
                      <div className="space-y-1 sm:space-y-2">
                        <label className="text-xs sm:text-sm font-medium text-gray-700">Country</label>
                        <Input
                          value={tempLocation.country}
                          onChange={(e) => setTempLocation({ ...tempLocation, country: e.target.value })}
                          className="border-2 focus:border-blue-500 text-sm sm:text-base text-black"
                          placeholder="Enter your country"
                        />
                      </div>
                      <div className="flex gap-2 sm:gap-3">
                        <Button
                          size="sm"
                          onClick={handleSaveLocation}
                          className="flex items-center gap-1 sm:gap-2 bg-green-600 hover:bg-green-700 px-3 sm:px-4"
                        >
                          <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="text-xs sm:text-sm">Save</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelLocationEdit}
                          className="flex items-center gap-1 sm:gap-2 border-2 bg-transparent px-3 sm:px-4"
                        >
                      <X className="w-3 h-3 sm:w-4 sm:h-4 text-black" />
                          <span className="text-xs sm:text-sm text-black">Cancel</span>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 sm:space-y-3">
                      <p className="font-medium text-base sm:text-lg md:text-xl text-gray-900">{location.city}</p>
                      <p className="text-sm sm:text-base md:text-lg text-gray-600">{location.country}</p>
                      <p className="text-xs sm:text-sm md:text-base text-gray-500">Member since {location.memberSince}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* About Me Card */}
              <Card className="shadow-md border-0 bg-white flex-1">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg sm:text-xl md:text-2xl text-black">About Me</CardTitle>
                    {!isEditingAbout && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditingAbout(true)}
                        className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 p-0 bg-white border border-gray-200 shadow-sm hover:shadow-md hover:bg-gray-50"
                      >
                        <Edit3 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
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
                        className="min-h-[100px] sm:min-h-[120px] md:min-h-[140px] resize-none border-2 focus:border-blue-500 text-sm sm:text-base text-black"
                        placeholder="Tell us about yourself..."
                      />
                      <div className="flex gap-2 sm:gap-3">
                        <Button
                          size="sm"
                          onClick={handleSaveAbout}
                          className="flex items-center gap-1 sm:gap-2 bg-green-600 hover:bg-green-700 px-3 sm:px-4"
                        >
                          <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="text-xs sm:text-sm">Save</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelAboutEdit}
                          className="flex items-center gap-1 sm:gap-2 border-2 bg-transparent px-3 sm:px-4"
                        >
                      <X className="w-3 h-3 sm:w-4 sm:h-4 text-black" />
                          <span className="text-xs sm:text-sm text-black">Cancel</span>
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
            <div className="lg:col-span-2 space-y-4 sm:space-y-6 md:space-y-8">
              {/* Impact Summary */}
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader className="pb-4 sm:pb-5 md:pb-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl sm:text-2xl md:text-3xl text-gray-900">Your Impact</CardTitle>
                    <ImpactModal userStats={userStats} />
                  </div>
                </CardHeader>
                <CardContent className="pb-4 sm:pb-6 md:pb-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                    <Card className="shadow-md bg-gradient-to-r from-green-500 to-green-600 text-white border-0 sm:col-span-2 md:col-span-1">
                      <CardContent className="p-4 sm:p-6 md:p-8">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-green-100 text-xs sm:text-sm md:text-base font-medium mb-1 sm:mb-2">Carbon Saved</p>
                            <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1">{userStats.carbonSaved}</p>
                            <p className="text-green-100 text-xs sm:text-sm">kg CO₂ equivalent</p>
                          </div>
                          <Leaf className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 text-green-200" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="shadow-md border-0 bg-white">
                      <CardContent className="p-4 sm:p-6 md:p-8">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-600 text-xs sm:text-sm md:text-base font-medium mb-1 sm:mb-2">Volunteer Hours</p>
                            <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-1">{userStats.volunteerHours}</p>
                            <p className="text-gray-500 text-xs sm:text-sm">hours logged</p>
                          </div>
                          <div className="p-2 sm:p-3 md:p-4 bg-blue-100 rounded-lg">
                            <Clock className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-blue-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="shadow-md border-0 bg-white">
                      <CardContent className="p-4 sm:p-6 md:p-8">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-600 text-xs sm:text-sm md:text-base font-medium mb-1 sm:mb-2">Cleanups</p>
                            <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-1">{userStats.cleanupsParticipated}</p>
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
              <Card className="shadow-lg border-0 bg-white flex-1">
                <CardHeader className="pb-4 sm:pb-5 md:pb-6">
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
                          className={`flex flex-col items-center p-3 sm:p-4 md:p-6 rounded-lg transition-all duration-300 hover:scale-105 ${
                            badge.earned
                              ? "bg-white border-2 border-green-200 shadow-md hover:shadow-lg"
                              : "bg-gray-50 border border-gray-200 opacity-60"
                          }`}
                        >
                          <div className={`p-2 sm:p-3 md:p-4 rounded-full mb-2 sm:mb-3 md:mb-4 ${badge.earned ? "bg-green-100" : "bg-gray-100"}`}>
                            <IconComponent
                              className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 ${badge.earned ? "text-green-600" : "text-gray-400"}`}
                            />
                          </div>
                          <Badge
                            variant="secondary"
                            className={`text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2 text-center ${
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
              <Card className="shadow-md bg-gradient-to-r from-blue-500 to-green-500 text-white border-0">
                <CardContent className="p-4 sm:p-6 md:p-8 text-center">
                  <p className="text-xs sm:text-sm md:text-base font-medium text-blue-100 mb-2 sm:mb-3">Keep up the great work!</p>
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3">Every action makes a difference 🌍</p>
                  <p className="text-xs sm:text-sm md:text-base text-blue-100">You are making a real impact on our planet</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
