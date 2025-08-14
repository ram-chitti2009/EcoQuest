"use client"

import Header from "@/app/components/Header"
import { createClient } from "@/utils/supabase/client"
import {
  createUserProfile,
  createUserStatistics,
  fetchAllBadges,
  fetchBadgesByUserId,
  getUserProfileByUserId,
  getUserStatistics,
  updateUserProfile,
  type UserProfileUpdate,
} from "@/utils/supabase/functions"
import { Award, Camera, Clock, Edit3, Leaf, MapPin, Save, TreePine, Users, X } from "lucide-react"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import { AchievementsModal } from "../achievments"
import { ImpactModal } from "../impactModel"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/Input"
import { Textarea } from "../ui/textArea"

// Level system configuration
const LEVEL_SYSTEM = [
  { level: 1, name: "Eco Newbie", minPoints: 0, color: "text-gray-600" },
  { level: 2, name: "Tree Hugger", minPoints: 200, color: "text-green-600" },
  { level: 3, name: "Green Guardian", minPoints: 500, color: "text-green-700" },
  { level: 4, name: "Eco Warrior", minPoints: 1000, color: "text-blue-600" },
  { level: 5, name: "Planet Protector", minPoints: 1800, color: "text-blue-700" },
  { level: 6, name: "Climate Champion", minPoints: 2800, color: "text-purple-600" },
  { level: 7, name: "Earth Hero", minPoints: 3900, color: "text-orange-600" },
  { level: 8, name: "Sustainability Master", minPoints: 5000, color: "text-red-600" },
  { level: 9, name: "Environmental Legend", minPoints: 5800, color: "text-indigo-600" },
  { level: 10, name: "Eco God", minPoints: 7000, color: "text-yellow-600" },
]

// Calculate total eco points from user statistics
const calculateEcoPoints = (stats: { carbonSaved: number; volunteerHours: number; cleanupsParticipated: number }) => {
  return stats.carbonSaved * 2 + stats.volunteerHours * 10 + stats.cleanupsParticipated * 25
}

// Get user level based on eco points
const getUserLevel = (ecoPoints: number) => {
  for (let i = LEVEL_SYSTEM.length - 1; i >= 0; i--) {
    if (ecoPoints >= LEVEL_SYSTEM[i].minPoints) {
      return LEVEL_SYSTEM[i]
    }
  }
  return LEVEL_SYSTEM[0]
}

export default function Component() {
  const [isEditingAbout, setIsEditingAbout] = useState(false)
  const [isEditingLocation, setIsEditingLocation] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [profileImage, setProfileImage] = useState("/placeholder.svg?height=192&width=192")
  const [aboutText, setAboutText] = useState("")
  const [userProfile, setUserProfile] = useState({
    name: "",
    title: "",
  })
  const [tempProfile, setTempProfile] = useState(userProfile)
  const [location, setLocation] = useState({
    city: "",
    country: "",
    memberSince: "",
  })
  const [tempLocation, setTempLocation] = useState(location)
  const [userStats, setUserStats] = useState({
    carbonSaved: 0,
    volunteerHours: 0,
    cleanupsParticipated: 0,
  })
  const [recentBadges, setRecentBadges] = useState<
    { id: number; name: string; icon: React.ComponentType<{ className?: string }>; earned: boolean }[]
  >([])
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Calculate derived values
  const totalEcoPoints = calculateEcoPoints(userStats)
  const userLevel = getUserLevel(totalEcoPoints)

  // Fetch current user and all data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const supabase = createClient()

        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          console.error("No user found")
          return
        }

        setCurrentUserId(user.id)

        // Fetch user profile
        const profileResult = await getUserProfileByUserId(user.id)
        if (profileResult.data) {
          const profile = profileResult.data
          setUserProfile({
            name: profile.name || "",
            title: profile.title || "Environmental Enthusiast",
          })
          setTempProfile({
            name: profile.name || "",
            title: profile.title || "Environmental Enthusiast",
          })
          setAboutText(profile.about || "")
          setLocation({
            city: profile.city || "",
            country: profile.country || "",
            memberSince: profile.member_since
              ? new Date(profile.member_since).toLocaleDateString("en-US", { month: "long", year: "numeric" })
              : "Recently",
          })
          setTempLocation({
            city: profile.city || "",
            country: profile.country || "",
            memberSince: profile.member_since
              ? new Date(profile.member_since).toLocaleDateString("en-US", { month: "long", year: "numeric" })
              : "Recently",
          })
          if (profile.profile_image_url) {
            setProfileImage(profile.profile_image_url)
          }
        } else {
          // Create default profile if none exists
          console.log("No profile found, creating default")
          const defaultProfile = {
            id: user.id,
            name: user.user_metadata?.name || user.email?.split("@")[0] || "User",
            title: "Environmental Enthusiast",
            about: "Passionate about environmental conservation and making a positive impact in my community.",
            city: "",
            country: "",
            member_since: new Date().toISOString(),
          }

          const createResult = await createUserProfile(defaultProfile)
          if (createResult.data) {
            setUserProfile({
              name: defaultProfile.name,
              title: defaultProfile.title,
            })
            setTempProfile({
              name: defaultProfile.name,
              title: defaultProfile.title,
            })
            setAboutText(defaultProfile.about)
            setLocation({
              city: defaultProfile.city,
              country: defaultProfile.country,
              memberSince: "Recently",
            })
            setTempLocation({
              city: defaultProfile.city,
              country: defaultProfile.country,
              memberSince: "Recently",
            })
          }
        }

        // Fetch user statistics
        const statsResult = await getUserStatistics(user.id)
        if (statsResult.data) {
          setUserStats({
            carbonSaved: statsResult.data.carbon_saved || 0,
            volunteerHours: statsResult.data.volunteer_hours || 0,
            cleanupsParticipated: statsResult.data.cleanups_participated || 0,
          })
        } else {
          // Create default stats if none exist
          const defaultStats = {
            user_id: user.id,
            carbon_saved: 0,
            volunteer_hours: 0,
            cleanups_participated: 0,
          }

          await createUserStatistics(defaultStats)
        }

        // Fetch user badges
        try {
          const badgesResult = await fetchBadgesByUserId(user.id)
          const allBadgesResult = await fetchAllBadges()

          if (allBadgesResult.data) {
            const userBadgeIds = badgesResult.data ? [badgesResult.data.badge_id] : []
            const badgesWithStatus = allBadgesResult.data
              .slice(0, 4)
              .map((badge: { id: number; name?: string; title?: string }) => ({
                id: badge.id,
                name: badge.name || badge.title || "Badge",
                icon: Award, // Default icon, you can map specific icons based on badge type
                earned: userBadgeIds.includes(badge.id),
              }))
            setRecentBadges(badgesWithStatus)
          }
        } catch (error) {
          console.error("Error fetching badges:", error)
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, []) // Fixed dependency array - we only want this to run once on mount

  // Update default badges based on user stats
  useEffect(() => {
    if (recentBadges.length === 0 && !loading) {
      // Set default badges if there's an error or no badges loaded
      setRecentBadges([
        { id: 1, name: "First Cleanup", icon: Users, earned: true },
        { id: 2, name: "50 kg CO₂ Saved", icon: Leaf, earned: userStats.carbonSaved >= 50 },
        { id: 3, name: "Eco Warrior", icon: Award, earned: userStats.volunteerHours >= 10 },
        { id: 4, name: "Tree Hugger", icon: TreePine, earned: false },
      ])
    }
  }, [userStats.carbonSaved, userStats.volunteerHours, recentBadges.length, loading])

  // Show loading screen while fetching data
  if (loading) {
    return (
      <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
        <Header title="Profile" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </div>
    )
  }

  const handleSaveAbout = async () => {
    if (!currentUserId) return

    try {
      const updates: UserProfileUpdate = { about: aboutText }
      const result = await updateUserProfile(currentUserId, updates)
      if (result.data) {
        setIsEditingAbout(false)
        console.log("About text saved successfully")
      } else {
        console.error("Failed to save about text:", result.error)
      }
    } catch (error) {
      console.error("Error saving about text:", error)
    }
  }

  const handleCancelAboutEdit = () => {
    setIsEditingAbout(false)
  }

  const handleSaveName = async () => {
    if (!currentUserId) return

    try {
      const updates: UserProfileUpdate = {
        name: tempProfile.name,
        title: tempProfile.title,
      }
      const result = await updateUserProfile(currentUserId, updates)
      if (result.data) {
        setUserProfile(tempProfile)
        setIsEditingName(false)
        console.log("Profile saved successfully")
      } else {
        console.error("Failed to save profile:", result.error)
      }
    } catch (error) {
      console.error("Error saving profile:", error)
    }
  }

  const handleCancelNameEdit = () => {
    setTempProfile(userProfile)
    setIsEditingName(false)
  }

  const handleSaveLocation = async () => {
    if (!currentUserId) return

    try {
      const updates: UserProfileUpdate = {
        city: tempLocation.city,
        country: tempLocation.country,
      }
      const result = await updateUserProfile(currentUserId, updates)
      if (result.data) {
        setLocation(tempLocation)
        setIsEditingLocation(false)
        console.log("Location saved successfully")
      } else {
        console.error("Failed to save location:", result.error)
      }
    } catch (error) {
      console.error("Error saving location:", error)
    }
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
      {/* Header */}
      <Header title="Profile" />
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
                          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
                            {userProfile.name}
                          </h1>
                          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-2">{userProfile.title}</p>
                          <div className="space-y-1">
                            <p className={`text-sm sm:text-base md:text-lg font-semibold ${userLevel.color}`}>
                              Level {userLevel.level} - {userLevel.name}
                            </p>
                            <p className="text-xs sm:text-sm md:text-base text-gray-500 font-medium">
                              {totalEcoPoints.toLocaleString()} Eco Points
                            </p>
                          </div>
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
                      <p className="text-xs sm:text-sm md:text-base text-gray-500">
                        Member since {location.memberSince}
                      </p>
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
                            <p className="text-green-100 text-xs sm:text-sm md:text-base font-medium mb-1 sm:mb-2">
                              Carbon Saved
                            </p>
                            <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1">
                              {userStats.carbonSaved}
                            </p>
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
                            <p className="text-gray-600 text-xs sm:text-sm md:text-base font-medium mb-1 sm:mb-2">
                              Volunteer Hours
                            </p>
                            <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-1">
                              {userStats.volunteerHours}
                            </p>
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
                            <p className="text-gray-600 text-xs sm:text-sm md:text-base font-medium mb-1 sm:mb-2">
                              Cleanups
                            </p>
                            <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-1">
                              {userStats.cleanupsParticipated}
                            </p>
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
                    <AchievementsModal userStats={userStats} ecoPoints={totalEcoPoints} />
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
                          <div
                            className={`p-2 sm:p-3 md:p-4 rounded-full mb-2 sm:mb-3 md:mb-4 ${badge.earned ? "bg-green-100" : "bg-gray-100"}`}
                          >
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
                  <p className="text-xs sm:text-sm md:text-base font-medium text-blue-100 mb-2 sm:mb-3">
                    Keep up the great work!
                  </p>
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3">
                    Every action makes a difference 🌍
                  </p>
                  <p className="text-xs sm:text-sm md:text-base text-blue-100">
                    You are making a real impact on our planet
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
