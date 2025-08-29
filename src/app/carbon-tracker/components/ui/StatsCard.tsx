import { Card, CardContent } from "./Card"
import { BarChart3 } from "lucide-react"

interface StatsCardProps {
  carbonSaved: number
  period: string
}

export function StatsCard({ carbonSaved, period }: StatsCardProps) {
  return (
    <Card className="mb-6">
      <CardContent className="p-8 text-center">
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-600">
            <BarChart3 className="w-4 h-4" />
            {period}
          </div>
          <div className="space-y-1">
            <div className="text-5xl font-bold text-gray-900">{carbonSaved.toFixed(1)}</div>
            <div className="text-lg text-gray-600 font-medium">kg CO₂ saved</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
