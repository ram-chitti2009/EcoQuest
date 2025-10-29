
// CarbonTrackerClient: Main client component for the Carbon Tracker feature
// Allows users to log eco-friendly activities, track monthly/yearly progress, and view activity history
"use client"


// Icon imports for activity types and UI
import { Bike, Plus, Recycle, Settings, Trash2, TreePine, X, Zap } from "lucide-react"
import Head from "next/head"
import type React from "react"
import { useEffect, useState } from "react"
// App-wide header component
import { parseLocalDate } from "@/utils/dateUtils"
import { createClient } from "@/utils/supabase/client"
import { createCarbonActivity, deleteCarbonActivity, getUserCarbonActivities, getTotalCarbonSaved, updateUserStatistics } from "@/utils/supabase/functions"
import Header from "../../../components/Header"

// Type definitions
interface DatabaseActivity {
  id: string
  user_id: string
  type: string
  date: string
  quantity: number
  carbon_saved: number
  created_at?: string
  updated_at?: string
}

interface Activity extends DatabaseActivity {
  icon: React.ReactNode
}


// --- UI Utility Components ---

// Button: Reusable button with variants and sizes
interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "outline"
  size?: "sm" | "md" | "lg"
  className?: string
  type?: "button" | "submit" | "reset"
  disabled?: boolean
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  disabled = false,
}) => {
  // Utility for consistent button styling
  const baseClasses =
    "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
  const variantClasses = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 disabled:bg-emerald-300 disabled:cursor-not-allowed",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 disabled:bg-gray-50 disabled:cursor-not-allowed",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500 disabled:bg-gray-50 disabled:cursor-not-allowed",
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
      disabled={disabled}
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

// Card: Container for sections and metrics
const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>{children}</div>
)

// CardContent: Padding and layout for card content
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

// Input: Styled input for forms
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

// Select: Styled select dropdown for forms
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

// Tabs: Container for tabbed content
const Tabs: React.FC<TabsProps> = ({ children }) => <div className="w-full">{children}</div>

// TabsList: Row of tab triggers
const TabsList: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex bg-gray-100 rounded-lg p-1 mb-4">{children}</div>
)

interface TabsTriggerProps {
  value: string
  activeTab: string
  onTabChange: (tab: string) => void
  children: React.ReactNode
}

// TabsTrigger: Button for switching tabs
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

// TabsContent: Shows content for the active tab
const TabsContent: React.FC<TabsContentProps> = ({ value, activeTab, children }) => (
  <div className={activeTab === value ? "block" : "hidden"}>{children}</div>
)

interface ProgressRingProps {
  value: number
  max: number
  size?: number
}

// ProgressRing: Circular progress indicator for goals
const ProgressRing: React.FC<ProgressRingProps> = ({ value, max, size = 160 }) => {
  const percentage = Math.min((value / max) * 100, 100)
  const circumference = 2 * Math.PI * 60
  const strokeDashoffset = circumference - (percentage / 100) * circumference
  const gradientId = `progress-gradient-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className="relative hover:scale-105 transition-transform duration-300" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background ring */}
        <circle cx={size / 2} cy={size / 2} r="60" stroke="#e5e7eb" strokeWidth="12" fill="transparent" />
        {/* Foreground progress ring */}
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
      {/* Center value display */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">{value.toFixed(1)}</div>
          <div className="text-sm text-gray-500">kg CO₂</div>
        </div>
      </div>
    </div>
  )
}

interface Activity {
  user_id: string
  id: string
  type: string
  date: string
  quantity: number
  carbon_saved: number
  icon: React.ReactNode
}

interface ActivityFeedProps {
  activities: Activity[]
  onDelete?: (id: string) => void
}

// ActivityFeed: List of logged activities, grouped by month or total
const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities, onDelete }) => {
  if (activities.length === 0) {
    // Show empty state if no activities
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

  // Render each activity as a card
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
                  <div className="text-gray-500">{parseLocalDate(activity.date).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="text-right flex flex-col items-end gap-2">
                <div className="font-bold text-emerald-600 text-lg">+{activity.carbon_saved.toFixed(1)} kg</div>
                <div className="text-sm text-gray-500">CO₂ saved</div>
                {/* Delete button (shows when onDelete provided) */}
                {onDelete && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (!confirm('Delete this activity? This cannot be undone.')) return
                      onDelete(activity.id)
                    }}
                    className="text-xs mt-1"
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}


interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  monthlyTarget: number
  yearlyTarget: number
  onSave: (monthly: number, yearly: number) => void
}

// SettingsModal: Modal for editing target goals
const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, monthlyTarget, yearlyTarget, onSave }) => {
  const [newMonthlyTarget, setNewMonthlyTarget] = useState(monthlyTarget.toString())
  const [newYearlyTarget, setNewYearlyTarget] = useState(yearlyTarget.toString())

  // Update local state when props change
  useEffect(() => {
    setNewMonthlyTarget(monthlyTarget.toString())
    setNewYearlyTarget(yearlyTarget.toString())
  }, [monthlyTarget, yearlyTarget])

  const handleSave = () => {
    const monthly = parseFloat(newMonthlyTarget) || 50
    const yearly = parseFloat(newYearlyTarget) || 600
    onSave(monthly, yearly)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Goal Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 rounded-full p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Target (kg CO₂)
            </label>
            <Input
              type="number"
              value={newMonthlyTarget}
              onChange={(e) => setNewMonthlyTarget(e.target.value)}
              min="1"
              step="1"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Yearly Target (kg CO₂)
            </label>
            <Input
              type="number"
              value={newYearlyTarget}
              onChange={(e) => setNewYearlyTarget(e.target.value)}
              min="1"
              step="1"
              className="w-full"
            />
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}

interface ActivityModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { type: string; quantity: number; date: string; carbonSaved: number }) => void
}

// ActivityModal: Modal dialog for logging a new activity
const ActivityModal: React.FC<ActivityModalProps> = ({ isOpen, onClose, onSubmit }) => {
  // Form state
  const [activityType, setActivityType] = useState("")
  const [quantity, setQuantity] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [recycleMaterial, setRecycleMaterial] = useState("plastic") // default to 'plastic'

  // Available activity types and their carbon savings per unit
  // Constants updated per product requirements / references
  // Cycling: ≈ 0.193 kg CO₂ saved per km cycled (U.S. average car vs typical bike) — EPA
  // Recycling (per 1 kg): aluminum ≈ 11.7, paper ≈ 0.88, plastic ≈ 1.5 (typical), glass ≈ 0.31, steel ≈ 1.5 — Climate Action Accelerator
  const activityOptions = [
    { value: "Cycling (km)", label: "Cycling (km)", carbonPerUnit: 0.193 },
    // Recycling will use a per-material factor selected in the modal (see recycleMaterials)
    { value: "Recycling (kg)", label: "Recycling (kg)", carbonPerUnit: null as number | null },
    { value: "Community cleanup (hours)", label: "Community cleanup (hours)", carbonPerUnit: 1.5 },
    { value: "Solar energy (kWh)", label: "Solar energy (kWh)", carbonPerUnit: 0.4 },
    { value: "Tree planting (trees)", label: "Tree planting (trees)", carbonPerUnit: 22.0 },
  ]

  // Recycling materials and per-kg CO₂ savings
  const recycleMaterials: { value: string; label: string; perKg: number }[] = [
    { value: "aluminum", label: "Aluminum (per kg)", perKg: 11.7 },
    { value: "paper", label: "Paper (per kg)", perKg: 0.88 },
    { value: "plastic", label: "Plastic (per kg)", perKg: 1.5 },
    { value: "glass", label: "Glass (per kg)", perKg: 0.31 },
    { value: "steel", label: "Steel (per kg)", perKg: 1.5 },
  ]

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activityType || !quantity) return

    const selectedActivity = activityOptions.find((option) => option.value === activityType)
    let carbonSaved = 0
    if (selectedActivity) {
      if (selectedActivity.value === "Recycling (kg)") {
        const material = recycleMaterials.find((m) => m.value === recycleMaterial)
        const perKg = material?.perKg ?? 1.5
        carbonSaved = perKg * Number.parseFloat(quantity)
      } else {
        // selectedActivity.carbonPerUnit may be null for recycling; guard with 0
        carbonSaved = (selectedActivity.carbonPerUnit ?? 0) * Number.parseFloat(quantity)
      }
    }

    onSubmit({
      type: activityType,
      quantity: Number.parseFloat(quantity),
      date,
      carbonSaved,
    })

    // Reset form and close modal
    setActivityType("")
    setQuantity("")
    setDate(new Date().toISOString().split("T")[0])
    onClose()
  }

  if (!isOpen) return null

  // Modal UI
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
          {/* Activity type dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Activity Type</label>
            <Select
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
              required
              className="text-base py-3"
            >
              {!activityType && <option value="" disabled hidden>Select an activity</option>}
              {activityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          {/* Quantity input */}
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

          {/* Recycling material selector — shown only for Recycling activities */}
          {activityType === "Recycling (kg)" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Material</label>
              <Select
                value={recycleMaterial}
                onChange={(e) => setRecycleMaterial(e.target.value)}
                required
                className="text-base py-3"
              >
                {recycleMaterials.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </Select>
              <p className="text-xs text-gray-500 mt-2">
                Typical CO₂ saved per kg: {recycleMaterials.find((m) => m.value === recycleMaterial)?.perKg ?? 1.5} kg
              </p>
            </div>
          )}

          {/* Date input */}
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

          {/* Action buttons */}
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


// Mapping of activity types to icons
const activityIcons = {
  "Cycling (km)": <Bike className="w-4 h-4" />,
  "Recycling (kg)": <Recycle className="w-4 h-4" />,
  "Community cleanup (hours)": <Trash2 className="w-4 h-4" />,
  "Solar energy (kWh)": <Zap className="w-4 h-4" />,
  "Tree planting (trees)": <TreePine className="w-4 h-4" />,
}


// --- Main Carbon Tracker Component ---
export default function CarbonTracker() {
  // State for activities, modal, celebration animation, and active tab
  const supabase = createClient()
  const [activities, setActivities] = useState<Activity[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [activeTab, setActiveTab] = useState("monthly")
  
  // Target settings state
  const [monthlyTarget, setMonthlyTarget] = useState(50) // kg CO₂
  const [yearlyTarget, setYearlyTarget] = useState(600) // kg CO₂

  useEffect(() => {
    // Fetch existing activities from Supabase on mount
    const fetchActivities = async () => {
      // get user_id from supabase
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      getUserCarbonActivities(user.id).then((result) => {
        // Check for error and map only if data is present
        if (result.error || !result.data) {
          setActivities([])
          return
        }
        const mappedActivities = result.data.map((activity: DatabaseActivity) => ({
          ...activity,
          icon: activityIcons[activity.type as keyof typeof activityIcons] || <Bike className="w-4 h-4" />,
        }))
        setActivities(mappedActivities)
      })
    }

    fetchActivities()
  }, [supabase.auth])

  // Handle target updates
  const handleTargetUpdate = (monthly: number, yearly: number) => {
    setMonthlyTarget(monthly)
    setYearlyTarget(yearly)
    // Save to localStorage
    localStorage.setItem('carbon-tracker-monthly-target', monthly.toString())
    localStorage.setItem('carbon-tracker-yearly-target', yearly.toString())
  }

  // Load targets from localStorage on mount
  useEffect(() => {
    const savedMonthly = localStorage.getItem('carbon-tracker-monthly-target')
    const savedYearly = localStorage.getItem('carbon-tracker-yearly-target')
    
    if (savedMonthly) setMonthlyTarget(parseInt(savedMonthly))
    if (savedYearly) setYearlyTarget(parseInt(savedYearly))
  }, [])

  // Calculate total carbon saved
  const totalCarbonSaved = activities.reduce((sum, activity) => sum + activity.carbon_saved, 0)

  // Filter activities for the current month
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const monthlyActivities = activities.filter((activity) => {
    const activityDate = parseLocalDate(activity.date)
    return activityDate.getMonth() === currentMonth && activityDate.getFullYear() === currentYear
  })
  const monthlyCarbonSaved = monthlyActivities.reduce((sum, activity) => sum + activity.carbon_saved, 0)

  // Handle logging a new activity
  const handleLogActivity = async (activityData: {
    type: string
    quantity: number
    date: string
    carbonSaved: number // Note: this comes from the modal calculation
  }) => {
    // Get User
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Data for database (no icon field) - map carbonSaved to carbon_saved
    const dbActivity = {
      user_id: user.id,
      type: activityData.type,
      date: activityData.date,
      quantity: activityData.quantity,
      carbon_saved: activityData.carbonSaved, // Use the calculated value from the modal
    }

    // Save to backend
    const result = await createCarbonActivity(dbActivity)
    
    if (result.error) {
      console.error('Error creating activity:', result.error)
      return
    }

    // Create activity with icon for frontend state
    const newActivity: Activity = {
      ...result.data!,
      icon: activityIcons[activityData.type as keyof typeof activityIcons] || <Bike className="w-4 h-4" />,
    }

    setActivities((prev) => [newActivity, ...prev])
    

    // Show celebration animation
    setShowCelebration(true)
    setTimeout(() => setShowCelebration(false), 2000)
    // Recompute total carbon for the user and update user_statistics so leaderboard/backend stay in sync
    try {
      const { data } = await supabase.auth.getUser()
      const user = data?.user
      const userId = user?.id
      if (userId) {
        const totalRes = await getTotalCarbonSaved(userId)
        const total = totalRes.data || 0
        await updateUserStatistics(userId, { carbon_saved: total })
      }
    } catch (err) {
      console.error('Error recalculating/updating user statistics after create:', err)
    }
  }

  // Delete an activity by id
  const handleDeleteActivity = async (id: string) => {
    try {
      const confirmed = confirm('Are you sure you want to delete this activity?')
      if (!confirmed) return

      const result = await deleteCarbonActivity(id)
      if (result.error) {
        console.error('Error deleting activity:', result.error)
        return
      }

      // Remove from local state
      setActivities((prev) => prev.filter((a) => a.id !== id))
      // Recompute total carbon for the user and update user_statistics so leaderboard/backend stay in sync
      try {
        const { data } = await supabase.auth.getUser()
        const user = data?.user
        const userId = user?.id
        if (userId) {
          const totalRes = await getTotalCarbonSaved(userId)
          const total = totalRes.data || 0
          await updateUserStatistics(userId, { carbon_saved: total })
        }
      } catch (err) {
        console.error('Error recalculating/updating user statistics after delete:', err)
      }
    } catch (error) {
      console.error('Error deleting activity:', error)
    }
  }

  return (
    <>
      <Head>
        <title>Carbon Tracker</title>
        <meta name="description" content="Track and measure your environmental contributions" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 antialiased">
        <Header 
          title="Carbon Tracker"
          centerMessage="Track Your Carbon Footprint!"
          showTimeDate={true}
          showUserAvatar={true}
        />
        
        <div className="max-w-7xl mx-auto px-6 py-8 pb-32">
          <Tabs activeTab={activeTab} onTabChange={setActiveTab}>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
              {/* Left Column - Metrics and Progress */}
              <div className="space-y-8">
                <TabsContent value="monthly" activeTab={activeTab}>
                  <Card className="mb-8 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-teal-50">
                    <CardContent className="p-10 text-center">
                      <div className="text-6xl font-bold text-emerald-600 mb-4">{monthlyCarbonSaved.toFixed(1)} kg</div>
                      <div className="text-gray-600 text-lg mb-6">CO₂ Saved • This Month</div>
                      <div className="text-gray-500">
                        Equivalent to {Math.round(monthlyCarbonSaved * 2.2)} miles not driven
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-teal-50">
                    <CardContent className="p-8 text-center">
                      <div className="flex flex-col items-center space-y-6">
                        <ProgressRing value={monthlyCarbonSaved} max={monthlyTarget} />
                        <div className="w-full">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">Monthly Goal Progress</h3>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setIsSettingsOpen(true)}
                              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2"
                            >
                              <Settings className="w-4 h-4" />
                            </Button>
                          </div>
                          <p className="text-lg font-bold text-emerald-600 mb-1">
                            {Math.round((monthlyCarbonSaved / monthlyTarget) * 100)}% Complete
                          </p>
                          <p className="text-sm text-gray-600 mb-4">
                            {monthlyCarbonSaved.toFixed(1)} / {monthlyTarget} kg monthly target
                          </p>
                          
                          {/* Progress Bar */}
                          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                            <div 
                              className="bg-gradient-to-r from-emerald-500 to-green-500 h-3 rounded-full transition-all duration-500 ease-out"
                              style={{ width: `${Math.min((monthlyCarbonSaved / monthlyTarget) * 100, 100)}%` }}
                            ></div>
                          </div>

                          {/* Remaining to goal */}
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Started</span>
                            <span className="font-medium">
                              {monthlyTarget - monthlyCarbonSaved > 0 
                                ? `${(monthlyTarget - monthlyCarbonSaved).toFixed(1)} kg to go!` 
                                : '🎉 Goal Achieved!'
                              }
                            </span>
                            <span>Goal</span>
                          </div>

                          {/* Milestone indicators */}
                          {monthlyCarbonSaved >= monthlyTarget && (
                            <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                              <p className="text-emerald-700 font-medium text-sm">
                                🎊 Congratulations! You&apos;ve reached your monthly goal!
                              </p>
                            </div>
                          )}
                          
                          {monthlyCarbonSaved >= monthlyTarget * 0.75 && monthlyCarbonSaved < monthlyTarget && (
                            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                              <p className="text-amber-700 font-medium text-sm">
                                🔥 You&apos;re in the final stretch! 75% complete!
                              </p>
                            </div>
                          )}
                          
                          {monthlyCarbonSaved >= monthlyTarget * 0.5 && monthlyCarbonSaved < monthlyTarget * 0.75 && (
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

                <TabsContent value="total" activeTab={activeTab}>
                  <Card className="hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-teal-50 mb-8 -mt-8">
                    <CardContent className="p-10 text-center">
                      <div className="text-6xl font-bold text-emerald-600 mb-4">{totalCarbonSaved.toFixed(1)} kg</div>
                      <div className="text-gray-600 text-lg mb-6">CO₂ Saved • Total</div>
                      <div className="text-gray-500">
                        Equivalent to {Math.round(totalCarbonSaved * 2.2)} miles not driven
                      </div>
                    </CardContent>
                  </Card>

                  {/* Progress Ring */}
                  <Card className="hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-teal-50">
                    <CardContent className="p-8 text-center">
                      <div className="flex flex-col items-center space-y-6">
                        <ProgressRing value={totalCarbonSaved} max={yearlyTarget} />
                        <div className="w-full">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">Total Goal Progress</h3>
                            <button
                              onClick={() => setIsSettingsOpen(true)}
                              className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                            >
                              <Settings className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-lg font-bold text-emerald-600 mb-1">
                            {Math.round((totalCarbonSaved / yearlyTarget) * 100)}% Complete
                          </p>
                          <p className="text-sm text-gray-600 mb-4">
                            {totalCarbonSaved.toFixed(1)} / {yearlyTarget} kg yearly target
                          </p>
                          
                          {/* Progress Bar */}
                          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                            <div 
                              className="bg-gradient-to-r from-emerald-500 to-green-500 h-3 rounded-full transition-all duration-500 ease-out"
                              style={{ width: `${Math.min((totalCarbonSaved / yearlyTarget) * 100, 100)}%` }}
                            ></div>
                          </div>

                          {/* Remaining to goal */}
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Started</span>
                            <span className="font-medium">
                              {yearlyTarget - totalCarbonSaved > 0 
                                ? `${(yearlyTarget - totalCarbonSaved).toFixed(1)} kg to go!` 
                                : '🎉 Goal Achieved!'
                              }
                            </span>
                            <span>Goal</span>
                          </div>

                          {/* Milestone indicators */}
                          {totalCarbonSaved >= yearlyTarget && (
                            <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                              <p className="text-emerald-700 font-medium text-sm">
                                🎊 Congratulations! You&apos;ve reached your yearly goal!
                              </p>
                            </div>
                          )}
                          
                          {totalCarbonSaved >= yearlyTarget * 0.75 && totalCarbonSaved < yearlyTarget && (
                            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                              <p className="text-amber-700 font-medium text-sm">
                                🔥 You&apos;re in the final stretch! 75% complete!
                              </p>
                            </div>
                          )}
                          
                          {totalCarbonSaved >= yearlyTarget * 0.5 && totalCarbonSaved < yearlyTarget * 0.75 && (
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
                    <h2 className="text-2xl font-bold text-gray-900">This Month&#39;s Activities</h2>
                    <div className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
                      {monthlyActivities.length} activities
                    </div>
                  </div>

                  <ActivityFeed activities={monthlyActivities} onDelete={handleDeleteActivity} />
                </TabsContent>

                <TabsContent value="total" activeTab={activeTab}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">All Activities</h2>
                    <div className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
                      {activities.length} activities
                    </div>
                  </div>

                  <ActivityFeed activities={activities} onDelete={handleDeleteActivity} />
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
        
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          monthlyTarget={monthlyTarget}
          yearlyTarget={yearlyTarget}
          onSave={handleTargetUpdate}
        />
      </div>
    </>
  )
}
