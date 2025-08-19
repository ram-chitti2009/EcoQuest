import { Crown } from "./icons"
import { Badge } from "./ui/badge"

interface ImpactHeaderProps {
  totalCarbonSaved: number
  currentRank: number
}

export const ImpactHeader = ({ totalCarbonSaved, currentRank }: ImpactHeaderProps) => {
  return (
    <div className="mb-6 md:mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-1 md:mb-2">Hello,</h1>
          <h2 className="text-2xl md:text-4xl font-bold text-emerald-600">EcoWarrior</h2>
        </div>
        <div className="text-center md:text-right">
          <div className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">
            {totalCarbonSaved}
          </div>
          <p className="text-base md:text-lg text-gray-600 font-medium">kg CO₂ Saved</p>
          <Badge variant="success" className="mt-1 inline-flex items-center">
            <Crown className="w-3 h-3 mr-1" />
            Rank #{currentRank}
          </Badge>
        </div>
      </div>
    </div>
  )
}
