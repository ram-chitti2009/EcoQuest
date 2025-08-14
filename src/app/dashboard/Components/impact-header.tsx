import { Badge } from "./ui/badge"
import { Crown } from "./icons"

interface ImpactHeaderProps {
  totalCarbonSaved: number
  currentRank: number
}

export const ImpactHeader = ({ totalCarbonSaved, currentRank }: ImpactHeaderProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Hello,</h1>
          <h2 className="text-4xl font-bold text-emerald-600">EcoWarrior</h2>
        </div>
        <div className="text-right">
          <div className="text-6xl font-bold bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">
            {totalCarbonSaved}
          </div>
          <p className="text-lg text-gray-600 font-medium">kg CO₂ Saved</p>
          <Badge variant="success" className="mt-1">
            <Crown className="w-3 h-3 mr-1" />
            Rank #{currentRank}
          </Badge>
        </div>
      </div>
    </div>
  )
}
