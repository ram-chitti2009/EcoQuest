"use client"

import { Badge } from "./badge"
import { Button } from "./button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog"
import { Card, CardContent } from "./card"
import { Award, Leaf, Users, TreePine, Recycle, Target, Globe, Star } from "lucide-react"

const allAchievements = [
  {
    id: 1,
    name: "First Cleanup",
    description: "Participate in your first community cleanup event",
    icon: Users,
    earned: true,
    category: "Participation",
    requirement: "Join 1 cleanup event",
  },
  {
    id: 2,
    name: "50 kg CO₂ Saved",
    description: "Save 50 kg of CO₂ through your eco-friendly actions",
    icon: Leaf,
    earned: true,
    category: "Environmental Impact",
    requirement: "Accumulate 50 kg CO₂ savings",
  },
  {
    id: 3,
    name: "Eco Warrior",
    description: "Complete 5 different types of environmental activities",
    icon: Award,
    earned: true,
    category: "Dedication",
    requirement: "Complete 5 activity types",
  },
  {
    id: 4,
    name: "Tree Hugger",
    description: "Plant or help maintain 10 trees",
    icon: TreePine,
    earned: false,
    category: "Conservation",
    requirement: "Plant/maintain 10 trees",
  },
  {
    id: 5,
    name: "100 kg CO₂ Saved",
    description: "Save 100 kg of CO₂ through your eco-friendly actions",
    icon: Recycle,
    earned: false,
    category: "Environmental Impact",
    requirement: "Accumulate 100 kg CO₂ savings",
  },
  {
    id: 6,
    name: "Community Leader",
    description: "Organize and lead 3 community cleanup events",
    icon: Target,
    earned: false,
    category: "Leadership",
    requirement: "Organize 3 cleanup events",
  },
  {
    id: 7,
    name: "Global Impact",
    description: "Contribute to environmental causes in 5 different locations",
    icon: Globe,
    earned: false,
    category: "Reach",
    requirement: "Participate in 5 different locations",
  },
  {
    id: 8,
    name: "Sustainability Star",
    description: "Maintain consistent eco-friendly habits for 30 days",
    icon: Star,
    earned: false,
    category: "Consistency",
    requirement: "30 consecutive days of activity",
  },
]

export function AchievementsModal() {
  const earnedCount = allAchievements.filter((achievement) => achievement.earned).length
  const totalCount = allAchievements.length

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-green-600 border-green-200 hover:bg-green-50 bg-transparent"
        >
          View All ({earnedCount}/{totalCount})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-green-600" />
            All Achievements
          </DialogTitle>
          <DialogDescription>Track your progress and see what achievements you can unlock next.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Progress: {earnedCount} of {totalCount} achievements earned
            </p>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(earnedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>

          <div className="grid gap-3">
            {allAchievements.map((achievement) => {
              const IconComponent = achievement.icon
              return (
                <Card
                  key={achievement.id}
                  className={`transition-all ${
                    achievement.earned ? "border-green-200 bg-green-50/50" : "border-gray-200 bg-gray-50/50"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          achievement.earned ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-semibold ${achievement.earned ? "text-gray-900" : "text-gray-500"}`}>
                            {achievement.name}
                          </h3>
                          {achievement.earned && (
                            <Badge className="bg-green-100 text-green-800 border-green-200">Earned</Badge>
                          )}
                        </div>

                        <p className={`text-sm ${achievement.earned ? "text-gray-600" : "text-gray-400"}`}>
                          {achievement.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {achievement.category}
                          </Badge>
                          <p className="text-xs text-gray-500">{achievement.requirement}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
