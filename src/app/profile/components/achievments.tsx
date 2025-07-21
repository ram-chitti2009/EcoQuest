"use client"

import { Award, Globe, Leaf, Recycle, Star, Target, TreePine, Users, X } from "lucide-react"
import { useState } from "react"

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
  const [isOpen, setIsOpen] = useState(false)
  const earnedCount = allAchievements.filter((achievement) => achievement.earned).length
  const totalCount = allAchievements.length

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  return (
    <>
      <button
        onClick={openModal}
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-green-200 bg-transparent hover:bg-green-50 text-green-600 h-9 px-3"
      >
        View All ({earnedCount}/{totalCount})
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/80" onClick={closeModal} />

          {/* Modal */}
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-hidden mx-4">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">
                  <Award className="w-5 h-5 text-green-600" />
                  All Achievements
                </h2>
                <p className="text-sm text-gray-600 mt-1.5">
                  Track your progress and see what achievements you can unlock next.
                </p>
              </div>
              <button
                onClick={closeModal}
                className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 p-1"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
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
                      <div
                        key={achievement.id}
                        className={`rounded-lg border shadow-sm transition-all p-4 ${
                          achievement.earned ? "border-green-200 bg-green-50/50" : "border-gray-200 bg-gray-50/50"
                        }`}
                      >
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
                                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-green-100 text-green-800">
                                  Earned
                                </span>
                              )}
                            </div>

                            <p className={`text-sm ${achievement.earned ? "text-gray-600" : "text-gray-400"}`}>
                              {achievement.description}
                            </p>

                            <div className="flex items-center justify-between">
                              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors text-black">
                                {achievement.category}
                              </span>
                              <p className="text-xs text-gray-500">{achievement.requirement}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
