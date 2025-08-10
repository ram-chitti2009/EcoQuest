"use client"

import { Atom, Calendar, User } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { Avatar } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader } from "../ui/card"
import { Clock, Crown, Leaf, Star, Trophy, Users } from "../ui/icons"
import { Progress } from "../ui/progress"
import Header from "@/app/components/Header"

interface LeaderboardEntry {
  id: string
  rank: number
  name: string
  avatar?: string
  carbonSaved: number
  eventsJoined: number
  volunteerHours: number
  isCurrentUser?: boolean
  type: "user" | "team" | "school"
  streak?: number
  level?: number
}

import { useEffect } from "react"

export default function Component() {
  const [selectedMetric, setSelectedMetric] = useState<"carbon" | "events" | "hours">("carbon")
  const [hoveredEntry, setHoveredEntry] = useState<string | null>(null)
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState<Date>(new Date())

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  // Mock data with more colorful variety
  const leaderboardData: LeaderboardEntry[] = [
    {
      id: "1",
      rank: 1,
      name: "Sarah Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      carbonSaved: 156.8,
      eventsJoined: 12,
      volunteerHours: 24,
      type: "user",
      streak: 15,
      level: 8,
    },
    {
      id: "2",
      rank: 2,
      name: "Green Warriors Team",
      avatar: "/placeholder.svg?height=40&width=40",
      carbonSaved: 142.3,
      eventsJoined: 15,
      volunteerHours: 32,
      type: "team",
      streak: 12,
      level: 7,
    },
    {
      id: "3",
      rank: 3,
      name: "Alex Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      carbonSaved: 128.9,
      eventsJoined: 9,
      volunteerHours: 18,
      type: "user",
      streak: 8,
      level: 6,
    },
    {
      id: "4",
      rank: 4,
      name: "Maya Patel",
      carbonSaved: 115.2,
      eventsJoined: 11,
      volunteerHours: 22,
      type: "user",
      streak: 10,
      level: 5,
    },
    {
      id: "5",
      rank: 5,
      name: "EcoClub Central High",
      avatar: "/placeholder.svg?height=40&width=40",
      carbonSaved: 98.7,
      eventsJoined: 8,
      volunteerHours: 16,
      type: "school",
      streak: 6,
      level: 4,
    },
    {
      id: "6",
      rank: 6,
      name: "Jordan Kim",
      carbonSaved: 89.4,
      eventsJoined: 7,
      volunteerHours: 14,
      type: "user",
      streak: 5,
      level: 4,
    },
    {
      id: "7",
      rank: 7,
      name: "You",
      isCurrentUser: true,
      carbonSaved: 82.4,
      eventsJoined: 6,
      volunteerHours: 12,
      type: "user",
      streak: 4,
      level: 3,
    },
    {
      id: "8",
      rank: 8,
      name: "Lisa Thompson",
      carbonSaved: 76.1,
      eventsJoined: 5,
      volunteerHours: 10,
      type: "user",
      streak: 3,
      level: 3,
    },
    {
      id: "9",
      rank: 9,
      name: "Climate Action Club",
      avatar: "/placeholder.svg?height=40&width=40",
      carbonSaved: 71.8,
      eventsJoined: 4,
      volunteerHours: 8,
      type: "team",
      streak: 2,
      level: 2,
    },
    {
      id: "10",
      rank: 10,
      name: "David Park",
      carbonSaved: 65.3,
      eventsJoined: 4,
      volunteerHours: 7,
      type: "user",
      streak: 1,
      level: 2,
    },
  ]

  const getMetricValue = (entry: LeaderboardEntry) => {
    switch (selectedMetric) {
      case "carbon":
        return entry.carbonSaved
      case "events":
        return entry.eventsJoined
      case "hours":
        return entry.volunteerHours
      default:
        return entry.carbonSaved
    }
  }

  const getMetricLabel = (entry: LeaderboardEntry) => {
    switch (selectedMetric) {
      case "carbon":
        return `${entry.carbonSaved} kg CO₂ saved`
      case "events":
        return `${entry.eventsJoined} events joined`
      case "hours":
        return `${entry.volunteerHours} volunteer hours`
      default:
        return `${entry.carbonSaved} kg CO₂ saved`
    }
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-6 w-6 text-yellow-400 drop-shadow-lg" />
    if (rank === 2) return <Crown className="h-6 w-6 text-gray-400 drop-shadow-lg" />
    if (rank === 3) return <Crown className="h-6 w-6 text-amber-600 drop-shadow-lg" />
    return null
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Badge variant="gold">🥇 Champion</Badge>
    if (rank === 2) return <Badge variant="silver">🥈 Runner-up</Badge>
    if (rank === 3) return <Badge variant="bronze">🥉 Third Place</Badge>
    return null
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "user":
        return "green"
      case "team":
        return "blue"
      case "school":
        return "purple"
      default:
        return "green"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "team":
        return <Users className="h-4 w-4" />
      case "school":
        return <Trophy className="h-4 w-4" />
      default:
        return null
    }
  }

  const maxValue = Math.max(...leaderboardData.map(getMetricValue))

  const handleEntryClick = (entryId: string) => {
    setSelectedEntry(selectedEntry === entryId ? null : entryId)
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <Header 
        title="EcoQuest Leaderboard"
        centerMessage="🌍 Top Local Heroes This Month 🌱"
      />

      <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
        <div className="min-h-full grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Leaderboard Section */}
          <div className="lg:col-span-2 h-[760px]">
            <Card className="h-full overflow-hidden">
              <CardContent className="h-full space-y-6 p-6">
                {/* Metric Selection */}
                <div className="flex gap-3 p-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                  <Button
                    onClick={() => setSelectedMetric("carbon")}
                    active={selectedMetric === "carbon"}
                    className="flex-1"
                  >
                    <Atom className="h-5 w-5" />
                    Carbon Impact
                  </Button>
                  <Button
                    onClick={() => setSelectedMetric("events")}
                    active={selectedMetric === "events"}
                    className="flex-1"
                  >
                    <Users className="h-5 w-5" />
                    Events Joined
                  </Button>
                  <Button
                    onClick={() => setSelectedMetric("hours")}
                    active={selectedMetric === "hours"}
                    className="flex-1"
                  >
                    <Clock className="h-5 w-5" />
                    Volunteer Hours
                  </Button>
                </div>

                {/* Top 3 Podium */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {leaderboardData.slice(0, 3).map((entry, index) => (
                    <div
                      key={entry.id}
                      className={`text-center p-4 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                        index === 0
                          ? "bg-gradient-to-br from-yellow-100 to-yellow-200 border-2 border-yellow-300"
                          : index === 1
                            ? "bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300"
                            : "bg-gradient-to-br from-amber-200 to-amber-300 border-2 border-amber-400"
                      }`}
                      onClick={() => handleEntryClick(entry.id)}
                    >
                      <div className="flex justify-center mb-2">{getRankIcon(entry.rank)}</div>
                      <Avatar
                        src={entry.avatar}
                        fallback={entry.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                        size="lg"
                        className="mx-auto mb-2"
                      />
                      <h3 className="font-bold text-gray-800 truncate">{entry.name}</h3>
                      <p className="text-sm text-gray-600">{getMetricLabel(entry)}</p>
                      {getRankBadge(entry.rank)}
                    </div>
                  ))}
                </div>

                {/* Leaderboard List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {leaderboardData.map((entry) => (
                    <div
                      key={entry.id}
                      className={`relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                        entry.isCurrentUser
                          ? "bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-green-300 shadow-lg ring-2 ring-green-200"
                          : selectedEntry === entry.id
                            ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 shadow-lg"
                            : hoveredEntry === entry.id
                              ? "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300 shadow-md transform scale-102"
                              : "bg-white border-gray-200 hover:shadow-md"
                      }`}
                      onMouseEnter={() => setHoveredEntry(entry.id)}
                      onMouseLeave={() => setHoveredEntry(null)}
                      onClick={() => handleEntryClick(entry.id)}
                    >
                      {/* Rank */}
                      <div
                        className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg shadow-md ${
                          entry.rank <= 3
                            ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white"
                            : "bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700"
                        }`}
                      >
                        {getRankIcon(entry.rank) || entry.rank}
                      </div>

                      {/* Avatar */}
                      <Avatar
                        src={entry.avatar}
                        fallback={entry.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                        size="lg"
                      />

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3
                            className={`font-bold text-lg truncate ${
                              entry.isCurrentUser ? "text-green-700" : "text-gray-800"
                            }`}
                          >
                            {entry.name}
                          </h3>
                          {getTypeIcon(entry.type)}
                          {entry.isCurrentUser && <Badge variant="user">✨ You</Badge>}
                          {entry.type === "team" && <Badge variant="team">Team</Badge>}
                        </div>
                        <p className="text-sm font-medium text-gray-600 mb-2">{getMetricLabel(entry)}</p>
                        {/* Progress Bar */}
                        <Progress
                          value={(getMetricValue(entry) / maxValue) * 100}
                          color={getTypeColor(entry.type) as any}
                          className="mb-2"
                        />
                        {/* Additional Stats */}
                        {selectedEntry === entry.id && (
                          <div className="flex gap-4 text-xs text-gray-500 animate-in slide-in-from-top duration-300">
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              Level {entry.level}
                            </span>
                            <span className="flex items-center gap-1">🔥 {entry.streak} day streak</span>
                          </div>
                        )}
                      </div>

                      {/* Rank Badge */}
                      <div className="flex flex-col items-end gap-2">
                        {entry.rank <= 3 && getRankBadge(entry.rank)}
                        {entry.streak && entry.streak >= 5 && (
                          <Badge variant="default" className="bg-orange-100 text-orange-700">
                            🔥 {entry.streak}
                          </Badge>
                        )}
                      </div>

                      {/* Hover Effect Indicator */}
                      {hoveredEntry === entry.id && (
                        <div className="absolute right-2 top-2 text-gray-400">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Community Impact Section */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <h3 className="text-2xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  🌟 Community Impact
                </h3>
                <p className="text-sm text-gray-600 text-center">This Month's Achievements</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-3xl">🌱</div>
                      <div className="text-right">
                        <div className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                          1,247
                        </div>
                        <p className="text-xs text-gray-600 font-medium">kg CO₂ Saved</p>
                      </div>
                    </div>
                    <Progress value={78} color="green" className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">78% of monthly goal</p>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-3xl">👥</div>
                      <div className="text-right">
                        <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                          89
                        </div>
                        <p className="text-xs text-gray-600 font-medium">Active Heroes</p>
                      </div>
                    </div>
                    <Progress value={89} color="blue" className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">+12 new this week</p>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-3xl">⏰</div>
                      <div className="text-right">
                        <div className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
                          156
                        </div>
                        <p className="text-xs text-gray-600 font-medium">Volunteer Hours</p>
                      </div>
                    </div>
                    <Progress value={65} color="purple" className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">65% of monthly target</p>
                  </div>
                </div>

                {/* Additional Stats */}
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-3 text-center">🏆 This Week's Highlights</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 bg-yellow-50 rounded-lg">
                      <div className="text-lg">🎯</div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">Beach Cleanup</p>
                        <p className="text-xs text-gray-600">45 participants</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                      <div className="text-lg">🌳</div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">Tree Planting</p>
                        <p className="text-xs text-gray-600">127 trees planted</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                      <div className="text-lg">♻️</div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">Recycling Drive</p>
                        <p className="text-xs text-gray-600">2.3 tons collected</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-center p-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl text-white">
                    <h4 className="font-bold mb-1">Join the Movement!</h4>
                    <p className="text-sm opacity-90">Next event: Tomorrow 2PM</p>
                    <button className="mt-2 px-4 py-2 bg-white text-green-600 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors">
                      Sign Up Now
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
