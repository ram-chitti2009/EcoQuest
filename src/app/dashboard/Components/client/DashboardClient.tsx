"use client"

import { createClient } from '@/utils/supabase/client'
import {
  getCleanupEventsJoinedByUser,
  getCommunityStats,
  getLeaderboardWithUserData,
  getUserProfileByUserId,
  getUserStatistics,
  type Leaderboard
} from '@/utils/supabase/functions'
import { useEffect, useState } from "react"
import { ActionCards } from "../action-cards"
import { CommunityStatsCard } from "../community-stats-card"
import { EcoChatbot } from "../eco-chatbot"
import { ImpactHeader } from "../impact-header"
import { ImpactMetrics } from "../impact-metrics"
import { LeaderboardCard } from "../leaderboard-card"
import { QuestCalendar } from "../quest-calendar"
import { UpcomingEventsCard } from "../upcoming-events-card"

// Extended interface for leaderboard with joined user statistics
interface LeaderboardWithStats extends Leaderboard {
  user_statistics?: {
    carbon_saved?: number;
    volunteer_hours?: number;
    cleanups_participated?: number;
  };
}

// Function to calculate metric value for ranking (same as leaderboard page)
const calculateMetricValue = (entry: LeaderboardWithStats, metric: "carbon" | "events" | "hours" | "points") => {
  switch (metric) {
    case "carbon":
      return entry.user_statistics?.carbon_saved || 0
    case "events":
      return entry.user_statistics?.cleanups_participated || 0
    case "hours":
      return entry.user_statistics?.volunteer_hours || 0
    case "points":
      // Calculate points based on available statistics
      const carbon = entry.user_statistics?.carbon_saved || 0
      const hours = entry.user_statistics?.volunteer_hours || 0
      const cleanups = entry.user_statistics?.cleanups_participated || 0
      const quizAnswers = (entry.user_statistics as any)?.quiz_correct_answers || 0
      return (carbon * 2) + (hours * 10) + (cleanups * 25) + (quizAnswers * 5)
    default:
      return entry.user_statistics?.carbon_saved || 0
  }
}

// Function to rank users by selected metric (same as leaderboard page)
const rankUsersByMetric = (users: LeaderboardWithStats[], metric: "carbon" | "events" | "hours" | "points"): LeaderboardWithStats[] => {
  // Sort users by their metric value (descending order - highest first)
  const sortedUsers = [...users].sort((a, b) => {
    const aValue = calculateMetricValue(a, metric)
    const bValue = calculateMetricValue(b, metric)
    return bValue - aValue // Descending order
  })

  // Assign ranks based on sorted positions
  const rankedUsers = sortedUsers.map((user, index) => ({
    ...user,
    rank: index + 1
  }))
  
  return rankedUsers
}

// Get user rank from leaderboard data using real-time ranking
const getUserRank = (leaderboardData: LeaderboardWithStats[], currentUserId: string) => {
  const rankedUsers = rankUsersByMetric(leaderboardData, "points")
  const userEntry = rankedUsers.find(entry => entry.user_id === currentUserId)
  return userEntry ? userEntry.rank : null
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  
  // User data state
  const [userProfile, setUserProfile] = useState({ name: "User" })
  const [userStats, setUserStats] = useState({
    carbonSaved: 0,
    volunteerHours: 0,
    cleanupsParticipated: 0,
    quizCorrectAnswers: 0,
  })
  const [communityStats, setCommunityStats] = useState({
    total_carbon_saved: 0,
    total_volunteer_hours: 0,
    total_cleanups: 0,
    active_users: 0,
  })
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardWithStats[]>([])

  // Derived values
  const currentRank = getUserRank(leaderboardData, currentUserId || "")

  // Ensure page starts at the top after all components are loaded
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'instant' })
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }
    
    // Immediate scroll
    scrollToTop()
    
    // Delayed scroll to override any other scroll behavior
    const timeoutId = setTimeout(scrollToTop, 100)
    
    return () => clearTimeout(timeoutId)
  }, [])

  // Additional effect to ensure scroll stays at top after loading
  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'instant' })
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
      }, 200)
    }
  }, [loading])

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
        
        // Fetch actual cleanup events joined count from backend
        const cleanupEventsResult = await getCleanupEventsJoinedByUser(user.id)
        const actualCleanupsCount = cleanupEventsResult.count || 0
        
        if (statsResult.data) {
          setUserStats({
            carbonSaved: statsResult.data.carbon_saved || 0,
            volunteerHours: statsResult.data.volunteer_hours || 0,
            cleanupsParticipated: actualCleanupsCount, // Use actual count from events
            quizCorrectAnswers: statsResult.data.quiz_correct_answers || 0,
          })
        }

        // Fetch community stats
        const communityResult = await getCommunityStats()
        if (communityResult.data) {
          setCommunityStats(communityResult.data)
        }

        // Fetch real-time leaderboard data with user statistics
        const leaderboardResult = await getLeaderboardWithUserData()
        if (leaderboardResult.error) {
          console.error("Error fetching leaderboard data:", leaderboardResult.error)
          setLeaderboardData([])
        } else {
          const rawData = leaderboardResult.data as LeaderboardWithStats[]
          console.log("Raw leaderboard data fetched:", rawData)
          // Rank users by points (eco points) for dashboard display
          const rankedData = rankUsersByMetric(rawData, "points")
          console.log("Ranked leaderboard data:", rankedData)
          setLeaderboardData(rankedData)
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  // Generate top users for leaderboard card from real-time data
  const getTopUsers = () => {
    const topThree = leaderboardData
      .slice(0, 3) // Already ranked, so take top 3
      .map((entry, index) => {
        const ecoPoints = calculateMetricValue(entry, "points")
        return {
          name: entry.name || "User",
          carbonSaved: ecoPoints, // Using eco points as the main metric
          rank: index + 1,
          avatar: entry.avatar || null,
          isCurrentUser: entry.user_id === currentUserId
        }
      })

    return topThree
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
    quizzesCompleted: userStats.quizCorrectAnswers, // Actual quiz correct answers from Carbon Clash
    currentRank: currentRank || 999,
    totalUsers: leaderboardData.length,
  }

  const topUsers = getTopUsers()

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <ImpactHeader 
          totalCarbonSaved={impactData.totalCarbonSaved} 
          currentRank={impactData.currentRank} 
          userName={userProfile.name}
        />
        <ImpactMetrics
          cleanupEvents={impactData.cleanupEvents}
          bagsCollected={impactData.bagsCollected}
          quizzesCompleted={impactData.quizzesCompleted}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <UpcomingEventsCard />
            <LeaderboardCard topUsers={topUsers} />
            
          </div>

          {/* Center Column - Chart */}
          <div className="lg:col-span-2">
            <QuestCalendar />
          </div>

          {/* Right Column - Community Stats */}
          <div className="space-y-6">
            <CommunityStatsCard stats={communityStats} />
            <EcoChatbot />
          </div>
        </div>

        <ActionCards />
      </div>
    </div>
  )
}
