import { Card, CardHeader, CardContent, CardTitle } from "./Card"
import { Badge } from "./Badge"
import { ProgressBar } from "./ProgressBar"
import { Target } from "lucide-react"

interface ProgressCardProps {
  monthlyCarbonSaved: number
  monthlyTarget: number
}

export function ProgressCard({ monthlyCarbonSaved, monthlyTarget }: ProgressCardProps) {
  const progressPercentage = Math.min((monthlyCarbonSaved / monthlyTarget) * 100, 100)

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-emerald-600" />
          Monthly Goal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Progress to {monthlyTarget} kg</span>
          <Badge variant={progressPercentage >= 100 ? "success" : "secondary"}>{progressPercentage.toFixed(0)}%</Badge>
        </div>
        <ProgressBar value={progressPercentage} />
        {monthlyCarbonSaved < monthlyTarget && (
          <p className="text-sm text-gray-600">{(monthlyTarget - monthlyCarbonSaved).toFixed(1)} kg remaining</p>
        )}
      </CardContent>
    </Card>
  )
}
