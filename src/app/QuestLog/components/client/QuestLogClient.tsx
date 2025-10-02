
// QuestLogClient: Main client component for the QuestLog feature
// Allows users to log volunteer activities, track monthly/yearly progress, and view activity history
"use client"


// Icon imports for activity types and UI
import { Plus, Settings, TreePine, X } from "lucide-react"
import Head from "next/head"
import type React from "react"
import { useEffect, useState } from "react"
// App-wide header component
import { createClient } from "@/utils/supabase/client"
import { UnifiedEvent, VolunteerActivity, getUserVolunteerActivities, createVolunteerActivity } from "@/utils/supabase/functions"
import Header from "../../../components/Header"

// Function to get user's joined events
const getUserJoinedEvents = async (userId: string) => {
  const supabase = createClient()
  
  try {
    // Get event IDs that user has joined
    const { data: participantData, error: participantError } = await supabase
      .from('event_participants')
      .select('event_id')
      .eq('user_id', userId)

    if (participantError) {
      console.error('Error fetching user participants:', participantError)
      return { data: [], error: participantError }
    }

    if (!participantData || participantData.length === 0) {
      return { data: [], error: null }
    }

    const eventIds = participantData.map(p => p.event_id)
    
    // Get the actual event details
    const { data: eventsData, error: eventsError } = await supabase
      .from('eco_events')
      .select('*')
      .in('id', eventIds)
      .order('date', { ascending: false })

    if (eventsError) {
      console.error('Error fetching events:', eventsError)
      return { data: [], error: eventsError }
    }

    return { data: eventsData || [], error: null }
  } catch (error) {
    console.error('Error in getUserJoinedEvents:', error)
    return { data: [], error }
  }
}

// Real database functions are imported from @/utils/supabase/functions


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
const Input: React.FC<InputProps> = ({ className = "", ...props }) => (
  <input
    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
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
    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 ${className}`}
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
          <div className="text-3xl font-bold text-gray-900">{Math.round(value)}</div>
          <div className="text-sm text-gray-500">hours</div>
        </div>
      </div>
    </div>
  )
}

interface Activity extends VolunteerActivity {
  icon: React.ReactNode
}

interface ActivityFeedProps {
  activities: Activity[]
}

// ActivityFeed: List of logged activities, grouped by month or total
const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  if (activities.length === 0) {
    // Show empty state if no activities
    return (
      <Card className="hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-12 text-center">
          <div className="text-gray-400 mb-4">
            <TreePine className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-3">No activities yet</h3>
          <p className="text-gray-500">Start logging your volunteering hours to measure your impact!</p>
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
                  <div className="text-gray-500">{new Date(activity.date).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-blue-600 text-lg">+{activity.hours_logged.toFixed(1)} hrs</div>
                <div className="text-sm text-gray-500">Hours logged</div>
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
  userJoinedEvents: UnifiedEvent[]
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
    const monthly = parseFloat(newMonthlyTarget) || 20
    const yearly = parseFloat(newYearlyTarget) || 240
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
              Monthly Target (hours)
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
              Yearly Target (hours)
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

// ActivityModal: Modal dialog for logging volunteer hours from joined events
const ActivityModal: React.FC<ActivityModalProps> = ({ isOpen, onClose, onSubmit, userJoinedEvents }) => {
  // Form state
  const [selectedEvent, setSelectedEvent] = useState<UnifiedEvent | null>(null)
  const [hours, setHours] = useState("")

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEvent || !hours) return

    // Use the event's actual date for when the volunteering happened
    onSubmit({
      type: selectedEvent.title,
      quantity: Number.parseFloat(hours),
      date: selectedEvent.date, // Use the event's actual date
      carbonSaved: Number.parseFloat(hours), // Use hours as the value
    })

    // Reset form and close modal
    setSelectedEvent(null)
    setHours("")
    onClose()
  }

  if (!isOpen) return null

  // Modal UI
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl transform transition-all duration-300 scale-100">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Log Volunteer Hours</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {userJoinedEvents.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">You haven&apos;t joined any events yet.</p>
            <p className="text-sm text-gray-400">Join events in the Community Cleanup section to start logging volunteer hours!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event selection dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Select Event</label>
              <Select
                value={selectedEvent?.id.toString() || ""}
                onChange={(e) => {
                  const event = userJoinedEvents.find(ev => ev.id.toString() === e.target.value)
                  setSelectedEvent(event || null)
                }}
                required
                className="text-base py-3"
              >
                {!selectedEvent && <option value="" disabled hidden>Choose an event you joined</option>}
                {userJoinedEvents.map((event) => (
                  <option key={event.id} value={event.id.toString()}>
                    {event.title} - {new Date(event.date).toLocaleDateString()}
                  </option>
                ))}
              </Select>
            </div>

            {/* Hours input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Hours Volunteered</label>
              <Input
                type="number"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="Enter hours (e.g., 2.5)"
                min="0"
                step="0.1"
                required
                className="text-base py-3"
              />
            </div>

            {/* Event details display */}
            {selectedEvent && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">{selectedEvent.title}</h4>
                <p className="text-sm text-blue-700 mb-1">
                  <strong>Date:</strong> {new Date(selectedEvent.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-blue-700 mb-1">
                  <strong>Location:</strong> {selectedEvent.location}
                </p>
                {selectedEvent.description && (
                  <p className="text-sm text-blue-600 mt-2">{selectedEvent.description}</p>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex space-x-4 pt-6">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 py-3 text-base bg-transparent">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1 py-3 text-base bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                disabled={!selectedEvent || !hours}
              >
                Log Hours
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}


// Define volunteer activity types and their icons
const activityIcons = {
  "Community Cleanup": <TreePine className="w-4 h-4" />,
  "Food Bank": <TreePine className="w-4 h-4" />,
  "Environmental Cleanup": <TreePine className="w-4 h-4" />,
  "Tutoring": <TreePine className="w-4 h-4" />,
  "Animal Shelter": <TreePine className="w-4 h-4" />,
}
// --- Main Carbon Tracker Component ---
export default function CarbonTracker() {
  // State for activities, modal, celebration animation, and active tab
  const supabase = createClient()
  const [activities, setActivities] = useState<Activity[]>([])
  const [userJoinedEvents, setUserJoinedEvents] = useState<UnifiedEvent[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [activeTab, setActiveTab] = useState("monthly")
  
  // Target settings state
  const [monthlyTarget, setMonthlyTarget] = useState(20) // hours
  const [yearlyTarget, setYearlyTarget] = useState(240) // hours

  // Handle target updates
  const handleTargetUpdate = (monthly: number, yearly: number) => {
    setMonthlyTarget(monthly)
    setYearlyTarget(yearly)
    // Here you could also save to localStorage or database
    localStorage.setItem('questlog-monthly-target', monthly.toString())
    localStorage.setItem('questlog-yearly-target', yearly.toString())
  }

  // Load targets from localStorage on mount
  useEffect(() => {
    const savedMonthly = localStorage.getItem('questlog-monthly-target')
    const savedYearly = localStorage.getItem('questlog-yearly-target')
    
    if (savedMonthly) setMonthlyTarget(parseInt(savedMonthly))
    if (savedYearly) setYearlyTarget(parseInt(savedYearly))
  }, [])

  useEffect(() => {
    // Fetch existing activities and user's joined events from Supabase on mount
    const fetchData = async () => {
      // get user_id from supabase
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch volunteer activities
      getUserVolunteerActivities(user.id).then((result) => {
        // Check for error and map only if data is present
        if (result.error || !result.data) {
          setActivities([])
          return
        }
        const mappedActivities = result.data.map((activity: VolunteerActivity) => ({
          ...activity,
          icon: activityIcons[activity.type as keyof typeof activityIcons] || <TreePine className="w-4 h-4" />,
        }))
        setActivities(mappedActivities)
      })

      // Fetch user's joined events
      getUserJoinedEvents(user.id).then((result) => {
        if (result.error || !result.data) {
          setUserJoinedEvents([])
          return
        }
        setUserJoinedEvents(result.data)
      })
    }

    fetchData()
  }, [supabase.auth])

  // Calculate total hours logged
  const totalHoursLogged = activities.reduce((sum, activity) => sum + activity.hours_logged, 0)

  // Filter activities for the current month
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const monthlyActivities = activities.filter((activity) => {
    const activityDate = new Date(activity.date)
    return activityDate.getMonth() === currentMonth && activityDate.getFullYear() === currentYear
  })
  const monthlyHoursLogged = monthlyActivities.reduce((sum, activity) => sum + activity.hours_logged, 0)

  // Handle logging a new activity
  const handleLogActivity = async (activityData: {
    type: string
    quantity: number
    date: string
    carbonSaved: number // Note: this comes from the modal calculation as hours
  }) => {
    // Get User
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Find the event_id if this activity is from a joined event
    const relatedEvent = userJoinedEvents.find(event => 
      event.title === activityData.type && event.date === activityData.date
    )

    // Data for database (no icon field) - map hours to hours_logged
    const dbActivity = {
      user_id: user.id,
      event_id: relatedEvent?.id || null,
      type: activityData.type,
      date: activityData.date,
      quantity: 1, // Default quantity to 1 (representing 1 volunteer session)
      hours_logged: parseFloat(activityData.carbonSaved.toString()), // The actual hours volunteered
    }

    // Save to backend
    console.log('Attempting to create volunteer activity:', dbActivity)
    const result = await createVolunteerActivity(dbActivity)
    
    if (result.error) {
      console.error('Error creating activity:', result.error)
      alert(`Error creating activity: ${JSON.stringify(result.error)}`)
      return
    }

    console.log('Activity created successfully:', result.data)

    // Refetch activities from database to ensure consistency
    console.log('Refetching activities from database...')
    const updatedActivities = await getUserVolunteerActivities(user.id)
    console.log('Updated activities result:', updatedActivities)
    
    if (updatedActivities.data && !updatedActivities.error) {
      const mappedActivities = updatedActivities.data.map((activity: VolunteerActivity) => ({
        ...activity,
        icon: activityIcons[activity.type as keyof typeof activityIcons] || <TreePine className="w-4 h-4" />,
      }))
      console.log('Setting mapped activities:', mappedActivities)
      setActivities(mappedActivities)
    } else {
      console.error('Error fetching updated activities:', updatedActivities.error)
    }

    // Show celebration animation
    setShowCelebration(true)
    setTimeout(() => setShowCelebration(false), 2000)
  }

  return (
    <>
      <Head>
        <title>Quest Log</title>
        <meta name="description" content="Track Your Volunteer Hours!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 antialiased">
        <Header 
          title="Quest Log"
          centerMessage="Track Your Volunteer Hours!"
          showTimeDate={true}
          showUserAvatar={true}
        />
        
        <div className="max-w-7xl mx-auto px-6 py-8 pb-32">
          <Tabs activeTab={activeTab} onTabChange={setActiveTab}>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
              {/* Left Column - Metrics and Progress */}
              <div className="space-y-8">
                <TabsContent value="monthly" activeTab={activeTab}>
                  <Card className="mb-8 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-emerald-50">
                    <CardContent className="p-10 text-center">
                      <div className="text-6xl font-bold text-emerald-600 mb-4">{monthlyHoursLogged.toFixed(1)} hrs</div>
                      <div className="text-gray-600 text-lg mb-6">Volunteer Hours • This Month</div>
                      <div className="text-gray-500">
                        Making a positive impact in your community
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-emerald-50">
                    <CardContent className="p-8 text-center">
                      <div className="flex flex-col items-center space-y-6">
                        <ProgressRing value={monthlyHoursLogged} max={monthlyTarget} />
                        <div className="w-full">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">Monthly Goal Progress</h3>
                            <button
                              onClick={() => setIsSettingsOpen(true)}
                              className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                              title="Edit monthly target"
                            >
                              <Settings className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-lg font-bold text-emerald-600 mb-1">
                            {Math.round((monthlyHoursLogged / monthlyTarget) * 100)}% Complete
                          </p>
                          <p className="text-sm text-gray-600 mb-4">
                            {monthlyHoursLogged.toFixed(1)} / {monthlyTarget} hrs monthly target
                          </p>
                          
                          {/* Progress Bar */}
                          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                              style={{ width: `${Math.min((monthlyHoursLogged / monthlyTarget) * 100, 100)}%` }}
                            ></div>
                          </div>

                          {/* Remaining to goal */}
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Started</span>
                            <span className="font-medium">
                              {monthlyTarget - monthlyHoursLogged > 0 
                                ? `${(monthlyTarget - monthlyHoursLogged).toFixed(1)} hrs to go!` 
                                : '🎉 Goal Achieved!'
                              }
                            </span>
                            <span>Goal</span>
                          </div>

                          {/* Milestone indicators */}
                          {monthlyHoursLogged >= monthlyTarget && (
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <p className="text-blue-700 font-medium text-sm">
                                🎊 Congratulations! You&apos;ve reached your monthly goal!
                              </p>
                            </div>
                          )}
                          
                          {monthlyHoursLogged >= monthlyTarget * 0.75 && monthlyHoursLogged < monthlyTarget && (
                            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                              <p className="text-amber-700 font-medium text-sm">
                                🔥 You&apos;re in the final stretch! 75% complete!
                              </p>
                            </div>
                          )}
                          
                          {monthlyHoursLogged >= monthlyTarget * 0.5 && monthlyHoursLogged < monthlyTarget * 0.75 && (
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
                  <Card className="hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-emerald-50 mb-8 -mt-8">
                    <CardContent className="p-10 text-center">
                      <div className="text-6xl font-bold text-emerald-600 mb-4">{totalHoursLogged.toFixed(1)} hrs</div>
                      <div className="text-gray-600 text-lg mb-6">Volunteer Hours • Total</div>
                      <div className="text-gray-500">
                        Making a lasting impact in your community
                      </div>
                    </CardContent>
                  </Card>

                  {/* Progress Ring */}
                  <Card className="hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-emerald-50">
                    <CardContent className="p-8 text-center">
                      <div className="flex flex-col items-center space-y-6">
                        <ProgressRing value={totalHoursLogged} max={yearlyTarget} />
                        <div className="w-full">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">Total Goal Progress</h3>
                            <button
                              onClick={() => setIsSettingsOpen(true)}
                              className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                              title="Edit yearly target"
                            >
                              <Settings className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-lg font-bold text-emerald-600 mb-1">
                            {Math.round((totalHoursLogged / yearlyTarget) * 100)}% Complete
                          </p>
                          <p className="text-sm text-gray-600 mb-4">
                            {totalHoursLogged.toFixed(1)} / {yearlyTarget} hrs yearly target
                          </p>
                          
                          {/* Progress Bar */}
                          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                              style={{ width: `${Math.min((totalHoursLogged / yearlyTarget) * 100, 100)}%` }}
                            ></div>
                          </div>

                          {/* Remaining to goal */}
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Started</span>
                            <span className="font-medium">
                              {yearlyTarget - totalHoursLogged > 0 
                                ? `${(yearlyTarget - totalHoursLogged).toFixed(1)} hrs to go!` 
                                : '🎉 Goal Achieved!'
                              }
                            </span>
                            <span>Goal</span>
                          </div>

                          {/* Milestone indicators */}
                          {totalHoursLogged >= yearlyTarget && (
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <p className="text-blue-700 font-medium text-sm">
                                🎊 Congratulations! You&apos;ve reached your yearly goal!
                              </p>
                            </div>
                          )}
                          
                          {totalHoursLogged >= yearlyTarget * 0.75 && totalHoursLogged < yearlyTarget && (
                            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                              <p className="text-amber-700 font-medium text-sm">
                                🔥 You&apos;re in the final stretch! 75% complete!
                              </p>
                            </div>
                          )}
                          
                          {totalHoursLogged >= yearlyTarget * 0.5 && totalHoursLogged < yearlyTarget * 0.75 && (
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

        <ActivityModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSubmit={handleLogActivity}
          userJoinedEvents={userJoinedEvents}
        />
        
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
