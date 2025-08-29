import type React from "react"
import { Card, CardHeader, CardContent, CardTitle } from "./Card"
import { Calendar, Leaf } from "lucide-react"

interface Activity {
  id: string
  type: string
  date: string
  quantity: number
  carbonSaved: number
  icon: React.ReactNode
}

interface ActivityFeedProps {
  activities: Activity[]
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Leaf className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">No activities yet</h3>
            <p className="text-sm text-gray-600">Start logging your eco-friendly actions to see your impact</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.slice(0, 6).map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 mb-1">{activity.type}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-3 h-3" />
                    {new Date(activity.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                    <span>•</span>
                    <span>{activity.quantity} units</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{activity.carbonSaved.toFixed(1)} kg</p>
                  <p className="text-xs text-gray-600">CO₂ saved</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
