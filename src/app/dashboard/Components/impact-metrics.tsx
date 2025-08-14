import { Card, CardContent } from "./ui/card"

interface ImpactMetricsProps {
  cleanupEvents: number
  bagsCollected: number
  quizzesCompleted: number
}

export const ImpactMetrics = ({ cleanupEvents, bagsCollected, quizzesCompleted }: ImpactMetricsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="bg-gradient-to-r from-emerald-500 to-green-600 text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{cleanupEvents}</div>
              <p className="text-emerald-100 text-sm">Cleanups Attended</p>
            </div>
            <div className="text-3xl">🧹</div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{bagsCollected}</div>
              <p className="text-teal-100 text-sm">Bags Collected</p>
            </div>
            <div className="text-3xl">🗑️</div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-green-500 to-teal-600 text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{quizzesCompleted}</div>
              <p className="text-green-100 text-sm">Quizzes Completed</p>
            </div>
            <div className="text-3xl">🧠</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
