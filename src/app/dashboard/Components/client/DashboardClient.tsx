"use client"

import { createClient } from '@/utils/supabase/client'
import {
  getAllLeaderboardEntries,
  getCommunityStats,
  getUserProfileByUserId,
  getUserStatistics,
  type Leaderboard
} from '@/utils/supabase/functions'
import { useEffect, useState } from "react"
import { ActionCards } from "../action-cards"
import { CommunityStatsCard } from "../community-stats-card"
import { CompletedQuests } from "../completed-quests"
import { Leaf, Recycle, TreePine } from "../icons"
import { ImpactHeader } from "../impact-header"
import { ImpactMetrics } from "../impact-metrics"
import { LeaderboardCard } from "../leaderboard-card"
import { MyQuestsCard } from "../my-quests-card"
import { QuestCalendar } from "../quest-calendar"
import { UpcomingEventsCard } from "../upcoming-events-card"

// Calculate eco points from user statistics
const calculateEcoPoints = (stats: { carbonSaved: number; volunteerHours: number; cleanupsParticipated: number }) => {
  return stats.carbonSaved * 2 + stats.volunteerHours * 10 + stats.cleanupsParticipated * 25
}

// Get user rank from leaderboard data
const getUserRank = (leaderboardData: Leaderboard[], currentUserId: string) => {
  const sortedByEcoPoints = leaderboardData
    .filter(entry => entry.eco_points !== null)
    .sort((a, b) => (b.eco_points || 0) - (a.eco_points || 0))
  
  const userEntry = sortedByEcoPoints.find(entry => entry.user_id === currentUserId)
  return userEntry ? sortedByEcoPoints.indexOf(userEntry) + 1 : null
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  
  // User data state
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userProfile, setUserProfile] = useState({ name: "User" }) // For future use
  const [userStats, setUserStats] = useState({
    carbonSaved: 0,
    volunteerHours: 0,
    cleanupsParticipated: 0,
  })
  const [communityStats, setCommunityStats] = useState({
    total_carbon_saved: 0,
    total_volunteer_hours: 0,
    total_cleanups: 0,
    active_users: 0,
  })
  const [leaderboardData, setLeaderboardData] = useState<Leaderboard[]>([])

  // Derived values
  const totalEcoPoints = calculateEcoPoints(userStats)
  const currentRank = getUserRank(leaderboardData, currentUserId || "")

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const supabase = createClient()

        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          console.error("No user found")
          setLoading(false)
          return
        }

        setCurrentUserId(user.id)

        // Fetch user profile
        const profileResult = await getUserProfileByUserId(user.id)
        if (profileResult.data) {
          setUserProfile({ name: profileResult.data.name || "User" })
        }

        // Fetch user statistics
        const statsResult = await getUserStatistics(user.id)
        if (statsResult.data) {
          setUserStats({
            carbonSaved: statsResult.data.carbon_saved || 0,
            volunteerHours: statsResult.data.volunteer_hours || 0,
            cleanupsParticipated: statsResult.data.cleanups_participated || 0,
          })
        }

        // Fetch community stats
        const communityResult = await getCommunityStats()
        if (communityResult.data) {
          setCommunityStats(communityResult.data)
        }

        // Fetch leaderboard data
        const leaderboardResult = await getAllLeaderboardEntries()
        if (leaderboardResult.data) {
          setLeaderboardData(leaderboardResult.data)
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  // Generate chart data based on user's actual progress
  const generateChartData = () => {
    const monthlyProgress = userStats.carbonSaved / 8 // Distribute evenly across 8 months
    return [
      { month: "Jan", savings: Math.round(monthlyProgress * 1) },
      { month: "Feb", savings: Math.round(monthlyProgress * 2) },
      { month: "Mar", savings: Math.round(monthlyProgress * 3) },
      { month: "Apr", savings: Math.round(monthlyProgress * 4) },
      { month: "May", savings: Math.round(monthlyProgress * 5) },
      { month: "Jun", savings: Math.round(monthlyProgress * 6) },
      { month: "Jul", savings: Math.round(monthlyProgress * 7) },
      { month: "Aug", savings: userStats.carbonSaved },
    ]
  }

  // Generate top users for leaderboard card from real data
  const getTopUsers = () => {
    const sortedUsers = leaderboardData
      .filter(entry => entry.eco_points !== null)
      .sort((a, b) => (b.eco_points || 0) - (a.eco_points || 0))
      .slice(0, 3)
      .map((entry, index) => ({
        name: entry.name || "User",
        carbonSaved: entry.eco_points || 0,
        rank: index + 1,
        avatar: entry.avatar || null,
        isCurrentUser: entry.user_id === currentUserId
      }))

    return sortedUsers
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  // Real impact data from user stats
  const impactData = {
    totalCarbonSaved: userStats.carbonSaved,
    cleanupEvents: userStats.cleanupsParticipated,
    bagsCollected: Math.round(userStats.cleanupsParticipated * 2.8), // Estimate based on cleanups
    quizzesCompleted: Math.floor(totalEcoPoints / 100), // Estimate based on points
    currentRank: currentRank || 999,
    totalUsers: leaderboardData.length,
  }

  const chartData = generateChartData()
  const topUsers = getTopUsers()

  const completedQuests = [
    {
      title: "PLASTIC-FREE WEEK CHALLENGE",
      date: "Aug 10, 2025",
      description: "Complete 7 days without single-use plastics.",
      icon: <Recycle className="h-4 w-4" />,
    },
    {
      title: "SUBMIT CARBON FOOTPRINT REPORT",
      date: "Aug 15, 2025", 
      description: "Calculate and submit monthly carbon footprint.",
      icon: <Leaf className="h-4 w-4" />,
    },
    {
      title: "COMMUNITY GARDEN PROJECT",
      date: "Aug 20, 2025",
      description: "Plant 10 native species in local garden.",
      icon: <TreePine className="h-4 w-4" />,
    },
  ]

  const calendarEvents = [
    { date: 10, title: "Beach Cleanup", type: "cleanup" as const, participants: 24 },
    { date: 14, title: "Solar Workshop", type: "workshop" as const, participants: 18 },
    { date: 20, title: "Tree Planting", type: "planting" as const, participants: 32 },
    { date: 25, title: "Recycling Drive", type: "cleanup" as const, participants: 15 },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <ImpactHeader totalCarbonSaved={impactData.totalCarbonSaved} currentRank={impactData.currentRank} />
        <ImpactMetrics
          cleanupEvents={impactData.cleanupEvents}
          bagsCollected={impactData.bagsCollected}
          quizzesCompleted={impactData.quizzesCompleted}
        />

        <CompletedQuests quests={completedQuests} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <MyQuestsCard />
            <LeaderboardCard topUsers={topUsers} />
          </div>

          {/* Center Column - Chart */}
          <div className="lg:col-span-2">
            <QuestCalendar events={calendarEvents} />
          </div>

          {/* Right Column - Community Stats */}
          <div className="space-y-6">
            <CommunityStatsCard stats={communityStats} />
            <UpcomingEventsCard />
          </div>
        </div>

        <ActionCards />
      </div>
    </div>
  )
}
