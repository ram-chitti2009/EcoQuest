import { Card, CardHeader, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Crown } from "./icons"

interface User {
  name: string
  carbonSaved: number
  rank: number
  avatar: string | null
  isCurrentUser?: boolean
}

interface LeaderboardCardProps {
  topUsers: User[]
}

export const LeaderboardCard = ({ topUsers }: LeaderboardCardProps) => {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold flex items-center gap-2 text-yellow-500">
          <Crown className="w-5 h-5 text-yellow-500" />
          Leaderboard
        </h3>
      </CardHeader>
      <CardContent className="space-y-3">
        {topUsers.map((user, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 p-2 rounded-lg ${
              user.isCurrentUser ? "bg-emerald-50 border border-emerald-200" : "bg-gray-50"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                user.rank === 1
                  ? "bg-yellow-400 text-white"
                  : user.rank === 2
                    ? "bg-gray-400 text-white"
                    : "bg-amber-600 text-white"
              }`}
            >
              {user.rank}
            </div>
            <div className="flex-1">
              <p className={`font-medium text-sm ${user.isCurrentUser ? "text-emerald-700" : "text-gray-800"}`}>
                {user.name}
              </p>
              <p className="text-xs text-gray-600">{user.carbonSaved} kg CO₂</p>
            </div>
          </div>
        ))}
        <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
          View Full Leaderboard
        </Button>
      </CardContent>
    </Card>
  )
}
