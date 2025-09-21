"use client"

import { Award, Calculator, Check, ChevronRight, Globe, Leaf, Recycle, Star, Target, TreePine, Trophy, Users, X } from "lucide-react"
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

const ecoLevels = [
  { level: 1, name: "Eco Newbie", minPoints: 0, maxPoints: 199, color: "text-slate-600", bgColor: "bg-slate-100", gradient: "from-slate-400 to-slate-600" },
  { level: 2, name: "Tree Hugger", minPoints: 200, maxPoints: 499, color: "text-green-600", bgColor: "bg-green-100", gradient: "from-green-400 to-green-600" },
  { level: 3, name: "Green Guardian", minPoints: 500, maxPoints: 999, color: "text-emerald-600", bgColor: "bg-emerald-100", gradient: "from-emerald-400 to-emerald-600" },
  { level: 4, name: "Eco Warrior", minPoints: 1000, maxPoints: 1799, color: "text-teal-600", bgColor: "bg-teal-100", gradient: "from-teal-400 to-teal-600" },
  { level: 5, name: "Planet Protector", minPoints: 1800, maxPoints: 2799, color: "text-blue-600", bgColor: "bg-blue-100", gradient: "from-blue-400 to-blue-600" },
  { level: 6, name: "Climate Champion", minPoints: 2800, maxPoints: 3899, color: "text-indigo-600", bgColor: "bg-indigo-100", gradient: "from-indigo-400 to-indigo-600" },
  { level: 7, name: "Sustainability Sage", minPoints: 3900, maxPoints: 4999, color: "text-purple-600", bgColor: "bg-purple-100", gradient: "from-purple-400 to-purple-600" },
  { level: 8, name: "Environmental Expert", minPoints: 5000, maxPoints: 5799, color: "text-pink-600", bgColor: "bg-pink-100", gradient: "from-pink-400 to-pink-600" },
  { level: 9, name: "Green Guru", minPoints: 5800, maxPoints: 6999, color: "text-orange-600", bgColor: "bg-orange-100", gradient: "from-orange-400 to-orange-600" },
  { level: 10, name: "Eco God", minPoints: 7000, maxPoints: null, color: "text-yellow-600", bgColor: "bg-yellow-100", gradient: "from-yellow-400 to-yellow-600" },
]

const pointCalculations = [
  { activity: "Carbon Saved", multiplier: 2, unit: "kg CO₂", description: "Every kilogram of CO₂ saved", icon: Leaf, color: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-200" },
  { activity: "Volunteer Hours", multiplier: 10, unit: "hours", description: "Each hour of volunteer work", icon: Users, color: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-200" },
  { activity: "Cleanups Participated", multiplier: 25, unit: "events", description: "Each cleanup event joined", icon: Recycle, color: "text-purple-600", bgColor: "bg-purple-50", borderColor: "border-purple-200" },
]

interface AchievementsModalProps {
  userStats: {
    carbonSaved: number;
    volunteerHours: number;
    cleanupsParticipated: number;
  };
  ecoPoints: number;
}

export function AchievementsModal({ userStats, ecoPoints }: AchievementsModalProps) {
  // userStats can be used for future achievement calculations
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false)
  const [isLevelsOpen, setIsLevelsOpen] = useState(false)
  const earnedCount = allAchievements.filter((achievement) => achievement.earned).length
  const totalCount = allAchievements.length

  const openAchievementsModal = () => setIsAchievementsOpen(true)
  const closeAchievementsModal = () => setIsAchievementsOpen(false)

  const openLevelsModal = () => setIsLevelsOpen(true)
  const closeLevelsModal = () => setIsLevelsOpen(false)

  // Helper function to determine current level and passed levels
  const getCurrentLevel = () => {
    for (let i = ecoLevels.length - 1; i >= 0; i--) {
      if (ecoPoints >= ecoLevels[i].minPoints) {
        return ecoLevels[i].level;
      }
    }
    return 1;
  };

  const isLevelPassed = (level: typeof ecoLevels[0]) => {
    return ecoPoints >= level.minPoints;
  };

  const isCurrentLevel = (level: typeof ecoLevels[0]) => {
    return getCurrentLevel() === level.level;
  };

  return (
    <>
      <div className="flex gap-3">
        <button
          onClick={openAchievementsModal}
          className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          <div className="relative flex items-center gap-2">
            <Award className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">View Achievements</span>
            <span className="sm:hidden">Achievements</span>
            <span className="text-xs sm:text-sm">({earnedCount}/{totalCount})</span>
          </div>
        </button>

        <button
          onClick={openLevelsModal}
          className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          <div className="relative flex items-center gap-2">
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">View Levels</span>
            <span className="sm:hidden">Levels</span>
          </div>
        </button>
      </div>

      {/* Achievements Modal */}
      {isAchievementsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" 
            onClick={closeAchievementsModal} 
          />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl">
                      <Award className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    Your Achievements
                  </h2>
                  <p className="text-green-100 mt-2 text-sm sm:text-base">
                    Track your environmental impact and unlock new milestones
                  </p>
                </div>
                <button
                  onClick={closeAchievementsModal}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors duration-200"
                >
                  <X className="h-5 h-5 sm:h-6 sm:w-6" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-100">Progress</span>
                  <span className="font-semibold">{earnedCount} of {totalCount} earned</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div
                    className="bg-white h-3 rounded-full transition-all duration-500 shadow-lg"
                    style={{ width: `${(earnedCount / totalCount) * 100}%` }}
                  />
                </div>
                <div className="text-right">
                  <span className="text-xl sm:text-2xl font-bold">{Math.round((earnedCount / totalCount) * 100)}%</span>
                  <span className="text-green-100 text-sm ml-1">Complete</span>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto max-h-[calc(85vh-280px)]">
              <div className="grid gap-4">
                {allAchievements.map((achievement, index) => {
                  const IconComponent = achievement.icon
                  return (
                    <div
                      key={achievement.id}
                      className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                        achievement.earned 
                          ? "border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 shadow-md" 
                          : "border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50 hover:border-gray-300"
                      }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {achievement.earned && (
                        <div className="absolute top-0 right-0 w-0 h-0 border-l-[40px] border-l-transparent border-t-[40px] border-t-green-400">
                          <Star className="absolute -top-7 -right-1 w-4 h-4 text-white" />
                        </div>
                      )}
                      
                      <div className="p-4 sm:p-6">
                        <div className="flex items-start gap-4">
                          <div className={`relative p-3 rounded-2xl transition-all duration-300 ${
                            achievement.earned 
                              ? "bg-green-100 text-green-600 shadow-md" 
                              : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"
                          }`}>
                            <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                            {achievement.earned && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              </div>
                            )}
                          </div>

                          <div className="flex-1 space-y-3">
                            <div className="flex items-center justify-between">
                              <h3 className={`text-lg sm:text-xl font-bold ${achievement.earned ? "text-gray-900" : "text-gray-500"}`}>
                                {achievement.name}
                              </h3>
                              {achievement.earned && (
                                <span className="bg-green-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-semibold shadow-md">
                                  ✓ Earned
                                </span>
                              )}
                            </div>

                            <p className={`text-sm sm:text-base leading-relaxed ${achievement.earned ? "text-gray-600" : "text-gray-400"}`}>
                              {achievement.description}
                            </p>

                            <div className="flex items-center justify-between">
                              <span className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-semibold ${
                                achievement.earned 
                                  ? "bg-green-200 text-green-800" 
                                  : "bg-gray-200 text-gray-600"
                              }`}>
                                {achievement.category}
                              </span>
                              <div className="flex items-center gap-2 text-gray-500">
                                <Target className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="text-xs sm:text-sm">{achievement.requirement}</span>
                              </div>
                            </div>
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
      )}

      {/* Levels Modal */}
      {isLevelsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" 
            onClick={closeLevelsModal} 
          />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl">
                      <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    Eco Levels System
                  </h2>
                  <p className="text-blue-100 mt-2 text-sm sm:text-base">
                    Discover how to level up and maximize your environmental impact
                  </p>
                </div>
                <button
                  onClick={closeLevelsModal}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors duration-200"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto max-h-[calc(85vh-200px)]">
              <div className="space-y-8">
                {/* Point Calculation Section */}
                <div className="space-y-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-xl">
                      <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    </div>
                    How Points Are Calculated
                  </h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    {pointCalculations.map((calc, index) => {
                      const IconComponent = calc.icon
                      return (
                        <div key={index} className={`group relative overflow-hidden rounded-2xl border-2 ${calc.borderColor} ${calc.bgColor} p-4 sm:p-6 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1`}>
                          <div className="text-center space-y-4">
                            <div className={`mx-auto w-12 h-12 sm:w-16 sm:h-16 ${calc.bgColor} rounded-2xl flex items-center justify-center border-2 ${calc.borderColor} shadow-md`}>
                              <IconComponent className={`w-6 h-6 sm:w-8 sm:h-8 ${calc.color}`} />
                            </div>
                            <div>
                              <h4 className="font-bold text-base sm:text-lg text-gray-900">{calc.activity}</h4>
                              <p className="text-xs sm:text-sm text-gray-600 mt-1">{calc.description}</p>
                            </div>
                            <div className="bg-white rounded-xl p-3 shadow-sm border">
                              <div className={`text-2xl sm:text-3xl font-bold ${calc.color} mb-1`}>×{calc.multiplier}</div>
                              <div className="text-xs text-gray-500">points per {calc.unit}</div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Levels Section */}
                <div className="space-y-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-xl">
                      <Star className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                    </div>
                    All Available Levels
                  </h3>
                  <div className="grid gap-4">
                    {ecoLevels.map((level, index) => {
                      const levelPassed = isLevelPassed(level);
                      const currentLevelActive = isCurrentLevel(level);
                      
                      return (
                        <div 
                          key={level.level} 
                          className={`group relative overflow-hidden rounded-2xl border-2 p-4 sm:p-6 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                            currentLevelActive 
                              ? 'border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50 shadow-lg ring-2 ring-yellow-300' 
                              : levelPassed 
                                ? 'border-green-300 bg-gradient-to-r from-green-50 to-emerald-50' 
                                : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="flex items-center gap-4 sm:gap-6">
                            <div className="relative">
                              <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${level.gradient} rounded-2xl flex items-center justify-center shadow-lg ${
                                currentLevelActive ? 'ring-2 ring-yellow-400' : ''
                              }`}>
                                <span className="text-white font-bold text-lg sm:text-xl">{level.level}</span>
                              </div>
                              <div className="absolute -top-1 -right-1">
                                {levelPassed ? (
                                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                  </div>
                                ) : (
                                  <Trophy className={`w-5 h-5 sm:w-6 sm:h-6 ${level.color}`} />
                                )}
                              </div>
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className={`text-lg sm:text-xl font-bold ${
                                      currentLevelActive ? 'text-yellow-700' : levelPassed ? 'text-green-700' : 'text-gray-900'
                                    }`}>
                                      {level.name}
                                    </h4>
                                    {currentLevelActive && (
                                      <span className="px-2 py-1 bg-yellow-200 text-yellow-800 text-xs font-semibold rounded-full">
                                        CURRENT
                                      </span>
                                    )}
                                    {levelPassed && !currentLevelActive && (
                                      <span className="px-2 py-1 bg-green-200 text-green-800 text-xs font-semibold rounded-full">
                                        LEVEL PASSED
                                      </span>
                                    )}
                                  </div>
                                  <p className={`text-sm sm:text-base ${
                                    currentLevelActive ? 'text-yellow-600' : levelPassed ? 'text-green-600' : 'text-gray-600'
                                  }`}>
                                    Level {level.level}
                                  </p>
                                </div>
                                <div className={`px-3 py-1 sm:px-4 sm:py-2 rounded-xl font-bold text-xs sm:text-sm shadow-md ${
                                  currentLevelActive 
                                    ? 'bg-yellow-200 text-yellow-800' 
                                    : levelPassed 
                                      ? 'bg-green-200 text-green-800'
                                      : `${level.bgColor} ${level.color}`
                                }`}>
                                  {level.minPoints}{level.maxPoints ? `-${level.maxPoints}` : "+"} pts
                                </div>
                              </div>
                              <div className={`rounded-full h-3 mb-2 ${
                                currentLevelActive ? 'bg-yellow-200' : levelPassed ? 'bg-green-200' : 'bg-gray-100'
                              }`}>
                                <div 
                                  className={`h-3 rounded-full transition-all duration-500 ${
                                    currentLevelActive 
                                      ? 'bg-gradient-to-r from-yellow-400 to-orange-400' 
                                      : levelPassed 
                                        ? 'bg-gradient-to-r from-green-400 to-emerald-400'
                                        : `bg-gradient-to-r ${level.gradient}`
                                  }`} 
                                  style={{
                                    width: levelPassed ? '100%' : currentLevelActive ? '100%' : '0%'
                                  }}
                                ></div>
                              </div>
                              <p className={`text-xs sm:text-sm ${
                                currentLevelActive ? 'text-yellow-700' : levelPassed ? 'text-green-700' : 'text-gray-600'
                              }`}>
                                {currentLevelActive
                                  ? `Your current level - you have ${ecoPoints} eco points`
                                  : levelPassed
                                    ? `Level completed with ${ecoPoints} eco points`
                                    : level.maxPoints
                                      ? `Unlock with ${level.minPoints} to ${level.maxPoints} eco points`
                                      : `Maximum level - requires ${level.minPoints}+ eco points`}
                              </p>
                            </div>
                            
                            <ChevronRight className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${
                              currentLevelActive ? 'text-yellow-600' : levelPassed ? 'text-green-600' : 'text-gray-400 group-hover:text-gray-600'
                            }`} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}