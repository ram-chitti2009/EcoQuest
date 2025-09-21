"use client"

import Header from "@/app/components/Header"
import SidebarWrapper from "@/app/components/SidebarWrapper"
import LoadingScreen from "@/components/LoadingScreen"
import { useRequireAuth } from "@/hooks/useRequireAuth"
import { Atom } from "lucide-react"
import { useState } from "react"
import { Avatar } from "./components/ui/avatar"
import { Badge } from "./components/ui/badge"
import { Button } from "./components/ui/button"
import { Card, CardContent, CardHeader } from "./components/ui/card"
import { Clock, Crown, Star, Trophy, Users } from "./components/ui/icons"
import { Progress } from "./components/ui/progress"

import { createClient } from "@/utils/supabase/client"
import { getCommunityStats, getLeaderboardWithUserData, Leaderboard } from "@/utils/supabase/functions"
import { useCallback, useEffect } from "react"

// Extended interface for leaderboard with joined data
interface LeaderboardWithStats extends Leaderboard {
  user_statistics?: {
    carbon_saved?: number;
    volunteer_hours?: number;
    cleanups_participated?: number;
    xp?: number;
  };
}

// Function to calculate metric value for ranking
const calculateMetricValue = (entry: LeaderboardWithStats, metric: "carbon" | "events" | "hours" | "points") => {
  switch (metric) {
    case "carbon":
      return entry.user_statistics?.carbon_saved || 0
    case "events":
      return entry.user_statistics?.cleanups_participated || 0
    case "hours":
      return entry.user_statistics?.volunteer_hours || 0
    case "points":
      // Use the pre-calculated XP from the database instead of calculating manually
      console.log("calculateMetricValue for points - entry:", entry.name, "xp:", entry.user_statistics?.xp)
      return entry.user_statistics?.xp || 0
    default:
      return entry.user_statistics?.carbon_saved || 0
  }
}

// Function to rank users by selected metric
const rankUsersByMetric = (users: LeaderboardWithStats[], metric: "carbon" | "events" | "hours" | "points"): LeaderboardWithStats[] => {
  console.log("Ranking users by metric:", metric)
  console.log("Input users:", users)
  
  // Sort users by their metric value (descending order - highest first)
  const sortedUsers = [...users].sort((a, b) => {
    const aValue = calculateMetricValue(a, metric)
    const bValue = calculateMetricValue(b, metric)
    console.log(`${a.name}: ${aValue}, ${b.name}: ${bValue}`)
    return bValue - aValue // Descending order
  })

  console.log("Sorted users:", sortedUsers)

  // Assign ranks based on sorted positions
  const rankedUsers = sortedUsers.map((user, index) => ({
    ...user,
    rank: index + 1
  }))
  
  console.log("Final ranked users:", rankedUsers)
  return rankedUsers
}

export default function Component() {
  const checking = useRequireAuth();
  const [selectedMetric, setSelectedMetric] = useState<"carbon" | "events" | "hours" | "points">("carbon")
  const [hoveredEntry, setHoveredEntry] = useState<string | null>(null)
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null)

  const [leaderboardData, setLeaderboardData] = useState<LeaderboardWithStats[]>([])
  const [rawLeaderboardData, setRawLeaderboardData] = useState<LeaderboardWithStats[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [communityStats, setCommunityStats] = useState({
    total_carbon_saved: 1247,
    total_volunteer_hours: 156,
    total_cleanups: 89,
    active_users: 89
  })
  const [loading, setLoading] = useState(true)

  // Function to update rankings when metric changes
  const updateRankingsForMetric = useCallback((metric: "carbon" | "events" | "hours" | "points") => {
    if (rawLeaderboardData.length > 0) {
      const rankedData = rankUsersByMetric(rawLeaderboardData, metric)
      setLeaderboardData(rankedData)
    }
  }, [rawLeaderboardData])

  // Handle metric change
  const handleMetricChange = useCallback((newMetric: "carbon" | "events" | "hours" | "points") => {
    console.log("handleMetricChange called with:", newMetric)
    setSelectedMetric(newMetric)
    console.log("selectedMetric should now be:", newMetric)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Get current user
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        setCurrentUserId(user?.id || null)
        console.log("Current user ID:", user?.id)

        // Fetch leaderboard data
        const leaderboardResult = await getLeaderboardWithUserData()
        if (leaderboardResult.error) {
          console.error("Error fetching leaderboard data:", leaderboardResult.error)
          setLeaderboardData([])
          setRawLeaderboardData([])
        } else {
          // Store raw data and rank users based on the selected metric
          const rawData = leaderboardResult.data as LeaderboardWithStats[]
          console.log("Raw leaderboard data fetched:", rawData)
          setRawLeaderboardData(rawData)
          const rankedData = rankUsersByMetric(rawData, selectedMetric)
          console.log("Ranked data for metric", selectedMetric, ":", rankedData)
          setLeaderboardData(rankedData)
          console.log("Fetched and ranked leaderboard data:", rankedData)
        }

        // Fetch community stats
        const statsResult = await getCommunityStats()
        if (statsResult.error) {
          console.error("Error fetching community stats:", statsResult.error)
        } else {
          setCommunityStats(statsResult.data)
          console.log("Fetched community stats:", statsResult.data)
        }
      } catch (error) {
        console.error("Error in fetchData:", error)
        setLeaderboardData([])
        setRawLeaderboardData([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedMetric]) // Include selectedMetric as we use it in the initial ranking

  // Separate effect to handle metric changes without re-fetching
  useEffect(() => {
    if (rawLeaderboardData.length > 0) {
      updateRankingsForMetric(selectedMetric)
    }
  }, [selectedMetric, rawLeaderboardData, updateRankingsForMetric])

  if (checking) {
    return <LoadingScreen />;
  }

  // Mock data with more colorful variety

  const getMetricValue = (entry: LeaderboardWithStats) => {
    return calculateMetricValue(entry, selectedMetric)
  }

  const getMetricLabel = (entry: LeaderboardWithStats) => {
    console.log("getMetricLabel called - selectedMetric:", selectedMetric, "entry:", entry.name, "user_statistics:", entry.user_statistics)
    switch (selectedMetric) {
      case "carbon":
        return `${entry.user_statistics?.carbon_saved || 0} kg CO₂ saved`
      case "events":
        return `${entry.user_statistics?.cleanups_participated || 0} events joined`
      case "hours":
        return `${entry.user_statistics?.volunteer_hours || 0} volunteer hours`
      case "points":
        console.log("Points case - entry.user_statistics:", entry.user_statistics)
        console.log("XP value:", entry.user_statistics?.xp)
        return `${entry.user_statistics?.xp || 0} eco points`
      default:
        return `${entry.user_statistics?.carbon_saved || 0} kg CO₂ saved`
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

  const maxValue = Math.max(...leaderboardData.map(getMetricValue), 1) // Prevent division by 0

  const handleEntryClick = (entryId: string) => {
    setSelectedEntry(selectedEntry === entryId ? null : entryId)
  }

  if (loading) {
    return (
      <div className="flex">
        <SidebarWrapper loading={false} />
        <main className="flex-1">
          <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
            <Header 
              title="EcoQuest Leaderboard"
              centerMessage="🌍 Loading Community Heroes 🌱"
            />
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading leaderboard data...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (leaderboardData.length === 0) {
    return (
      <div className="flex">
        <SidebarWrapper loading={false} />
        <main className="flex-1">
          <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
            <Header 
              title="EcoQuest Leaderboard"
              centerMessage="🌍 Top Local Heroes This Month 🌱"
            />
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🌱</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">No Heroes Yet!</h2>
                <p className="text-gray-600">Be the first to make an environmental impact!</p>
                <button className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors">
                  Start Your Journey
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex">
      <SidebarWrapper loading={false} />
      <main className="flex-1">
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
                    onClick={() => handleMetricChange("carbon")}
                    active={selectedMetric === "carbon"}
                    className="flex-1"
                  >
                    <Atom className="h-5 w-5" />
                    Carbon Impact
                  </Button>
                  <Button
                    onClick={() => handleMetricChange("events")}
                    active={selectedMetric === "events"}
                    className="flex-1"
                  >
                    <Users className="h-5 w-5" />
                    Events Joined
                  </Button>
                  <Button
                    onClick={() => handleMetricChange("hours")}
                    active={selectedMetric === "hours"}
                    className="flex-1"
                  >
                    <Clock className="h-5 w-5" />
                    Volunteer Hours
                  </Button>
                  <Button
                    onClick={() => handleMetricChange("points")}
                    active={selectedMetric === "points"}
                    className="flex-1"
                  >
                    <Star className="h-5 w-5" />
                    Eco Points
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
                        src={entry.avatar || undefined}
                        fallback={entry.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2) || "??"}
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
                        entry.user_id === currentUserId
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
                        src={entry.avatar || undefined}
                        fallback={entry.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2) || "??"}
                        size="lg"
                      />

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3
                            className={`font-bold text-lg truncate ${
                              entry.user_id === currentUserId ? "text-green-700" : "text-gray-800"
                            }`}
                          >
                            {entry.name}
                          </h3>
                          {getTypeIcon(entry.type || "user")}
                          {entry.user_id === currentUserId && <Badge variant="user">✨ You</Badge>}
                          {entry.type === "team" && <Badge variant="team">Team</Badge>}
                        </div>
                        <p className="text-sm font-medium text-gray-600 mb-2">{getMetricLabel(entry)}</p>
                        {/* Progress Bar */}
                        <Progress
                          value={(getMetricValue(entry) / maxValue) * 100}
                          color={getTypeColor(entry.type || "user")}
                          className="mb-2"
                        />
                        {/* Additional Stats */}
                        {selectedEntry === entry.id && (
                          <div className="flex gap-4 text-xs text-gray-500 animate-in slide-in-from-top duration-300">
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              Level {entry.level || 1}
                            </span>
                            <span className="flex items-center gap-1">🔥 {entry.streak || 0} day streak</span>
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
                <p className="text-sm text-gray-600 text-center">This Month&apos;s Achievements</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-3xl">🌱</div>
                      <div className="text-right">
                        <div className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                          {communityStats.total_carbon_saved}
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
                          {communityStats.active_users}
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
                          {communityStats.total_volunteer_hours}
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
                  <h4 className="font-semibold text-gray-800 mb-3 text-center">🏆 This Week&apos;s Highlights</h4>
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
      </main>
    </div>
  )
}
