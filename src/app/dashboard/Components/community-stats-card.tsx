import { Card, CardHeader, CardContent } from "./ui/card"
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
              <div className="text-xl font-bold text-green-600">{stats.total_carbon_saved}</div>
              <p className="text-xs text-gray-600">kg CO₂ Saved</p>
            </div>
          </div>
          <Progress value={78} color="green" className="h-2" />
        </div>

        <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <div className="text-2xl">👥</div>
            <div className="text-right">
              <div className="text-xl font-bold text-blue-600">{stats.active_users}</div>
              <p className="text-xs text-gray-600">Active Heroes</p>
            </div>
          </div>
          <Progress value={89} color="blue" className="h-2" />
        </div>

        <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <div className="text-2xl">⏰</div>
            <div className="text-right">
              <div className="text-xl font-bold text-purple-600">{stats.total_volunteer_hours}</div>
              <p className="text-xs text-gray-600">Volunteer Hours</p>
            </div>
          </div>
          <Progress value={65} color="purple" className="h-2" />
        </div>
      </CardContent>
    </Card>
  )
}
