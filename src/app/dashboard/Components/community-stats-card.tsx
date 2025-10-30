import { Card, CardContent, CardHeader } from "./ui/card"
import { Progress } from "./ui/progress"

interface CommunityStats {
  total_carbon_saved: number
  total_volunteer_hours: number
  total_cleanups: number
  active_users: number
}

interface CommunityStatsCardProps {
  stats: CommunityStats
}

export const CommunityStatsCard = ({ stats }: CommunityStatsCardProps) => {
  // Utility to format numbers for display (max 2 decimal places)
  const formatNumber = (value?: number | null) => {
    if (value == null || Number.isNaN(Number(value))) return '0'
    return Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 })
  }
  // Calculate monthly goals based on total users
  const carbonMonthlyGoal = 300 * stats.active_users
  const volunteerHoursYearlyGoal = 75 * stats.active_users
  
  // Calculate progress percentages
  const carbonProgress = carbonMonthlyGoal > 0 ? Math.min((stats.total_carbon_saved / carbonMonthlyGoal) * 100, 100) : 0
  const volunteerProgress = volunteerHoursYearlyGoal > 0 ? Math.min((stats.total_volunteer_hours / volunteerHoursYearlyGoal) * 100, 100) : 0

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          🌟 Community Impact
        </h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <div className="text-2xl">🌱</div>
            <div className="text-right">
              <div className="text-xl font-bold text-green-600">{formatNumber(stats.total_carbon_saved)}</div>
              <p className="text-xs text-gray-600">kg CO₂ Saved</p>
            </div>
          </div>
          <Progress value={carbonProgress} color="green" className="h-2" />
          <p className="text-xs text-gray-500 mt-1">{Math.round(carbonProgress)}% of yearly goal ({carbonMonthlyGoal} kg)</p>
        </div>

        <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <div className="text-2xl">👥</div>
            <div className="text-right">
              <div className="text-xl font-bold text-blue-600">{stats.active_users}</div>
              <p className="text-xs text-gray-600">Active Heroes</p>
            </div>
          </div>
          <Progress value={100} color="blue" className="h-2" />
        </div>

        <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <div className="text-2xl">⏰</div>
            <div className="text-right">
              <div className="text-xl font-bold text-purple-600">{stats.total_volunteer_hours}</div>
              <p className="text-xs text-gray-600">Volunteer Hours</p>
            </div>
          </div>
          <Progress value={volunteerProgress} color="purple" className="h-2" />
          <p className="text-xs text-gray-500 mt-1">{Math.round(volunteerProgress)}% of yearly goal ({volunteerHoursYearlyGoal} hrs)</p>
        </div>
      </CardContent>
    </Card>
  )
}
