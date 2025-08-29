"use client"

import { Bike, Plus, Recycle, Trash2, TreePine, X, Zap } from "lucide-react"
import Head from "next/head"
import type React from "react"
import { useState } from "react"

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "outline"
  size?: "sm" | "md" | "lg"
  className?: string
  type?: "button" | "submit" | "reset"
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"

  const variantClasses = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
  }

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  )
}

interface CardProps {
  children: React.ReactNode
  className?: string
}

const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>{children}</div>
)

const CardContent: React.FC<CardProps> = ({ children, className = "" }) => <div className={className}>{children}</div>

interface InputProps {
  type?: string
  placeholder?: string
  value?: string | number
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  required?: boolean
  min?: string | number
  step?: string | number
}

const Input: React.FC<InputProps> = ({ type = "text", placeholder, value, onChange, className = "", ...props }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 ${className}`}
    {...props}
  />
)

interface SelectProps {
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  children: React.ReactNode
  className?: string
  required?: boolean
}

const Select: React.FC<SelectProps> = ({ value, onChange, children, className = "", ...props }) => (
  <select
    value={value}
    onChange={onChange}
    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-gray-900 ${className}`}
    {...props}
  >
    {children}
  </select>
)

interface TabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  children: React.ReactNode
}

const Tabs: React.FC<TabsProps> = ({ children }) => <div className="w-full">{children}</div>

const TabsList: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex bg-gray-100 rounded-lg p-1 mb-4">{children}</div>
)

interface TabsTriggerProps {
  value: string
  activeTab: string
  onTabChange: (tab: string) => void
  children: React.ReactNode
}

const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, activeTab, onTabChange, children }) => (
  <button
    onClick={() => onTabChange(value)}
    className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
      activeTab === value ? "bg-white text-emerald-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
    }`}
  >
    {children}
  </button>
)

interface TabsContentProps {
  value: string
  activeTab: string
  children: React.ReactNode
}

const TabsContent: React.FC<TabsContentProps> = ({ value, activeTab, children }) => (
  <div className={activeTab === value ? "block" : "hidden"}>{children}</div>
)

interface ProgressRingProps {
  value: number
  max: number
  size?: number
}

const ProgressRing: React.FC<ProgressRingProps> = ({ value, max, size = 160 }) => {
  const percentage = Math.min((value / max) * 100, 100)
  const circumference = 2 * Math.PI * 60
  const strokeDashoffset = circumference - (percentage / 100) * circumference
  const gradientId = `progress-gradient-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className="relative hover:scale-105 transition-transform duration-300" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r="60" stroke="#e5e7eb" strokeWidth="12" fill="transparent" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r="60"
          stroke={`url(#${gradientId})`}
          strokeWidth="12"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-in-out"
        />
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="50%" stopColor="#16a34a" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">{Math.round(value)}</div>
          <div className="text-sm text-gray-500">kg CO₂</div>
        </div>
      </div>
    </div>
  )
}

interface StatsCardProps {
  carbonSaved: number
  period: string
}

const StatsCard: React.FC<StatsCardProps> = ({ carbonSaved, period }) => (
  <Card className="mb-6">
    <CardContent className="p-6 text-center">
      <div className="text-4xl font-bold text-emerald-600 mb-2">{carbonSaved.toFixed(1)} kg</div>
      <div className="text-gray-600 text-sm mb-4">CO₂ Saved • {period}</div>
      <div className="text-xs text-gray-500">Equivalent to {Math.round(carbonSaved * 2.2)} miles not driven</div>
    </CardContent>
  </Card>
)

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

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  if (activities.length === 0) {
    return (
      <Card className="hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-12 text-center">
          <div className="text-gray-400 mb-4">
            <TreePine className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-3">No activities yet</h3>
          <p className="text-gray-500">Start logging your eco-friendly activities to see your impact!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <Card
          key={activity.id}
          className="hover:shadow-md hover:scale-[1.02] transition-all duration-300 cursor-pointer"
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center text-emerald-600 hover:from-emerald-200 hover:to-emerald-300 transition-colors duration-300">
                  {activity.icon}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-lg">
                    {activity.type}: {activity.quantity}
                  </div>
                  <div className="text-gray-500">{new Date(activity.date).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-emerald-600 text-lg">+{activity.carbonSaved.toFixed(1)} kg</div>
                <div className="text-sm text-gray-500">CO₂ saved</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

interface ActivityModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { type: string; quantity: number; date: string; carbonSaved: number }) => void
}

const ActivityModal: React.FC<ActivityModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [activityType, setActivityType] = useState("")
  const [quantity, setQuantity] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])

  const activityOptions = [
    { value: "Cycling (km)", label: "Cycling (km)", carbonPerUnit: 0.5 },
    { value: "Recycling (kg)", label: "Recycling (kg)", carbonPerUnit: 2.0 },
    { value: "Community cleanup (hours)", label: "Community cleanup (hours)", carbonPerUnit: 1.5 },
    { value: "Solar energy (kWh)", label: "Solar energy (kWh)", carbonPerUnit: 0.4 },
    { value: "Tree planting (trees)", label: "Tree planting (trees)", carbonPerUnit: 22.0 },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activityType || !quantity) return

    const selectedActivity = activityOptions.find((option) => option.value === activityType)
    const carbonSaved = selectedActivity ? selectedActivity.carbonPerUnit * Number.parseFloat(quantity) : 0

    onSubmit({
      type: activityType,
      quantity: Number.parseFloat(quantity),
      date,
      carbonSaved,
    })

    setActivityType("")
    setQuantity("")
    setDate(new Date().toISOString().split("T")[0])
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl transform transition-all duration-300 scale-100">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Log Activity</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Activity Type</label>
            <Select
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
              required
              className="text-base py-3"
            >
              <option value="">Select an activity</option>
              {activityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Quantity</label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
              min="0"
              step="0.1"
              required
              className="text-base py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Date</label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="text-base py-3"
            />
          </div>

          <div className="flex space-x-4 pt-6">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 py-3 text-base bg-transparent">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1 py-3 text-base bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
            >
              Log Activity
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

const activityIcons = {
  "Cycling (km)": <Bike className="w-4 h-4" />,
  "Recycling (kg)": <Recycle className="w-4 h-4" />,
  "Community cleanup (hours)": <Trash2 className="w-4 h-4" />,
  "Solar energy (kWh)": <Zap className="w-4 h-4" />,
  "Tree planting (trees)": <TreePine className="w-4 h-4" />,
}

export default function CarbonTracker() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [activeTab, setActiveTab] = useState("monthly")

  const monthlyTarget = 50 // kg CO₂
  const totalTarget = 600 // kg CO₂ (yearly goal)

  const totalCarbonSaved = activities.reduce((sum, activity) => sum + activity.carbonSaved, 0)

  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const monthlyActivities = activities.filter((activity) => {
    const activityDate = new Date(activity.date)
    return activityDate.getMonth() === currentMonth && activityDate.getFullYear() === currentYear
  })
  const monthlyCarbonSaved = monthlyActivities.reduce((sum, activity) => sum + activity.carbonSaved, 0)

  const handleLogActivity = (activityData: {
    type: string
    quantity: number
    date: string
    carbonSaved: number
  }) => {
    const newActivity: Activity = {
      id: Date.now().toString(),
      type: activityData.type,
      date: activityData.date,
      quantity: activityData.quantity,
      carbonSaved: activityData.carbonSaved,
      icon: activityIcons[activityData.type as keyof typeof activityIcons] || <Bike className="w-4 h-4" />,
    }

    setActivities((prev) => [newActivity, ...prev])

    // Show celebration animation
    setShowCelebration(true)
    setTimeout(() => setShowCelebration(false), 2000)
  }

  return (
    <>
      <Head>
        <title>Carbon Impact Tracker</title>
        <meta name="description" content="Track and measure your environmental contributions" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 antialiased">
        <div className="max-w-7xl mx-auto px-6 py-8 pb-32">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Carbon Impact Tracker
            </h1>
            <p className="text-xl text-gray-600">Track and measure your environmental contributions</p>
          </div>

          <Tabs activeTab={activeTab} onTabChange={setActiveTab}>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
              {/* Left Column - Metrics and Progress */}
              <div className="space-y-8">
                <TabsContent value="monthly" activeTab={activeTab}>
                  <Card className="mb-8 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-emerald-50">
                    <CardContent className="p-10 text-center">
                      <div className="text-6xl font-bold text-emerald-600 mb-4">{monthlyCarbonSaved.toFixed(1)} kg</div>
                      <div className="text-gray-600 text-lg mb-6">CO₂ Saved • This Month</div>
                      <div className="text-gray-500">
                        Equivalent to {Math.round(monthlyCarbonSaved * 2.2)} miles not driven
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-teal-50">
                    <CardContent className="p-10 text-center">
                      <div className="flex flex-col items-center space-y-8">
                        <ProgressRing value={monthlyCarbonSaved} max={monthlyTarget} />
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">Monthly Goal Progress</h3>
                          <p className="text-gray-600 text-lg">
                            {Math.round((monthlyCarbonSaved / monthlyTarget) * 100)}% of your {monthlyTarget} kg target
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="total" activeTab={activeTab}>
                  <Card className="hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-emerald-50 mb-8">
                    <CardContent className="p-10 text-center">
                      <div className="text-6xl font-bold text-emerald-600 mb-4">{totalCarbonSaved.toFixed(1)} kg</div>
                      <div className="text-gray-600 text-lg mb-6">CO₂ Saved • Total</div>
                      <div className="text-gray-500">
                        Equivalent to {Math.round(totalCarbonSaved * 2.2)} miles not driven
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-8 text-center">
                      <div className="flex flex-col items-center space-y-6">
                        <ProgressRing value={totalCarbonSaved} max={totalTarget} />
                        <div className="w-full">
                          <h3 className="font-semibold text-gray-900 mb-2">Total Goal Progress</h3>
                          <p className="text-lg font-bold text-emerald-600 mb-1">
                            {Math.round((totalCarbonSaved / totalTarget) * 100)}% Complete
                          </p>
                          <p className="text-sm text-gray-600 mb-4">
                            {totalCarbonSaved.toFixed(1)} / {totalTarget} kg yearly target
                          </p>
                          
                          {/* Progress Bar */}
                          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                            <div 
                              className="bg-gradient-to-r from-emerald-500 to-green-500 h-3 rounded-full transition-all duration-500 ease-out"
                              style={{ width: `${Math.min((totalCarbonSaved / totalTarget) * 100, 100)}%` }}
                            ></div>
                          </div>

                          {/* Remaining to goal */}
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Started</span>
                            <span className="font-medium">
                              {totalTarget - totalCarbonSaved > 0 
                                ? `${(totalTarget - totalCarbonSaved).toFixed(1)} kg to go!` 
                                : '🎉 Goal Achieved!'
                              }
                            </span>
                            <span>Goal</span>
                          </div>

                          {/* Milestone indicators */}
                          {totalCarbonSaved >= totalTarget && (
                            <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                              <p className="text-emerald-700 font-medium text-sm">
                                🎊 Congratulations! You&apos;ve reached your yearly goal!
                              </p>
                            </div>
                          )}
                          
                          {totalCarbonSaved >= totalTarget * 0.75 && totalCarbonSaved < totalTarget && (
                            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                              <p className="text-amber-700 font-medium text-sm">
                                🔥 You&apos;re in the final stretch! 75% complete!
                              </p>
                            </div>
                          )}
                          
                          {totalCarbonSaved >= totalTarget * 0.5 && totalCarbonSaved < totalTarget * 0.75 && (
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <p className="text-blue-700 font-medium text-sm">
                                💪 Halfway there! Keep up the great work!
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>

              {/* Right Column - Activities List */}
              <div className="space-y-8">
                <TabsList>
                  <TabsTrigger value="monthly" activeTab={activeTab} onTabChange={setActiveTab}>
                    This Month
                  </TabsTrigger>
                  <TabsTrigger value="total" activeTab={activeTab} onTabChange={setActiveTab}>
                    Total
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="monthly" activeTab={activeTab}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">This Month's Activities</h2>
                    <div className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
                      {monthlyActivities.length} activities
                    </div>
                  </div>

                  <ActivityFeed activities={monthlyActivities} />
                </TabsContent>

                <TabsContent value="total" activeTab={activeTab}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">All Activities</h2>
                    <div className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
                      {activities.length} activities
                    </div>
                  </div>

                  <ActivityFeed activities={activities} />
                </TabsContent>
              </div>
            </div>
          </Tabs>

          {showCelebration && (
            <div className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-8 py-4 rounded-xl shadow-2xl z-50 animate-bounce">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🎉</span>
                <span className="font-semibold text-lg">Activity logged successfully!</span>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center z-40 group"
        >
          <Plus className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" />
        </button>

        <ActivityModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleLogActivity} />
      </div>
    </>
  )
}
