import { Card, CardHeader, CardContent } from "./ui/card"
import { Calendar } from "./icons"

export const UpcomingEventsCard = () => {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold flex items-center gap-2 text-black">
          <Calendar className="w-5 h-5 text-emerald-600" />
          Upcoming Events
        </h3>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3 p-2 bg-emerald-50 rounded-lg">
          <div className="text-lg">🏖️</div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">Beach Cleanup</p>
            <p className="text-xs text-gray-600">Tomorrow 2PM</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-2 bg-yellow-50 rounded-lg">
          <div className="text-lg">☀️</div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">Solar Workshop</p>
            <p className="text-xs text-gray-600">Aug 14, 10AM</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
          <div className="text-lg">🌳</div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">Tree Planting</p>
            <p className="text-xs text-gray-600">Aug 20, 9AM</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
