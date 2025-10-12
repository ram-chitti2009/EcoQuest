"use client"

import { parseLocalDate } from "@/utils/dateUtils"
import { createClient } from '@/utils/supabase/client'
import { Calendar, Leaf, MapPin, Search, SlidersHorizontal, Trash2, UserPlus, Users, X } from "lucide-react"
import { useEffect, useState } from "react"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Input } from "../ui/input"
import { Modal, ModalContent, ModalHeader } from "../ui/modal"
import { Select } from "../ui/select"
import EventCardsGrid from "./event-cards-grid"
import MapWrapper from "./map-wrapper"; // Declare the MapWrapper variable
// Add these imports at the top of your file
import {
  checkUserEventParticipation,
  createUnifiedEvent,
  getAllUnifiedEvents,
  joinUnifiedEvent,
  leaveUnifiedEvent,
  type UnifiedEvent
} from '@/utils/supabase/functions'

interface Participant {
  id: string
  name: string
  role: "organizer" | "coordinator" | "volunteer"
  joinedAt: string
}

interface CleanupEvent {
  id: string
  title: string
  description: string
  date: string
  time: string
  duration: string
  location: {
    name: string
    address: string
    lat: number
    lng: number
  }
  organizer: string
  participantCount: number
  participants: Participant[] // Keep for MapWrapper compatibility
  maxParticipants: number
  category: "beach" | "park" | "street" | "forest" | "river"
  status: "upcoming" | "ongoing" | "completed"
  equipmentProvided: string[]
  requirements: string[]
  expectedTrashCollection: string
  carbonOffset: string
  createdBy?: string // User ID of the event creator
  needsVolunteers?: boolean // True for events with <25% capacity
  isLitterAnalysisReport?: boolean // True for events created from litter analysis
}

const categoryColors = {
  beach: "#3B82F6",
  park: "#10B981",
  street: "#F59E0B",
  forest: "#059669",
  river: "#06B6D4",
}

const statusColors = {
  upcoming: "#10B981",
  ongoing: "#F59E0B",
  completed: "#6B7280",
}

// Transform UnifiedEvent to CleanupEvent format
const transformUnifiedToCleanup = (event: UnifiedEvent): CleanupEvent => {
  const participantCount = event.participants || 0
  // Create minimal participants array for MapWrapper compatibility
  const participants = Array.from({ length: participantCount }, (_, i) => ({
    id: `participant-${i}`,
    name: `Participant ${i + 1}`,
    role: 'volunteer' as const,
    joinedAt: new Date().toISOString()
  }))

  return {
    id: event.id.toString(),
    title: event.title,
    description: event.description || '',
    date: event.date,
    time: event.time,
    duration: event.duration || '2 hours',
    location: {
      name: event.location_name || event.location,
      address: event.location_address || event.location,
      lat: event.lat || 40.7589,
      lng: event.lng || -73.9851,
    },
    organizer: event.organizer || 'Unknown',
    participantCount: participantCount,
    participants: participants, // For MapWrapper compatibility
    maxParticipants: event.max_participants,
    category: mapCategoryToCleanup(event.category),
    status: (event.status as "upcoming" | "ongoing" | "completed") || 'upcoming',
    equipmentProvided: event.equipment_provided || [],
    requirements: event.requirements || [],
    expectedTrashCollection: event.expected_trash_collection ? event.expected_trash_collection.toString() + ' lbs' : '50 lbs',
    carbonOffset: event.carbon_offset || '10 kg CO2',
    createdBy: event.user_id || undefined,
    needsVolunteers: false, // Will be set by determineEventStatuses
    isLitterAnalysisReport: event.is_litter_analysis_report || false,
  }
}

// Map unified categories to cleanup categories
const mapCategoryToCleanup = (category: string): CleanupEvent["category"] => {
  const mapping: Record<string, CleanupEvent["category"]> = {
    cleanup: 'park',
    workshop: 'park', 
    planting: 'forest',
    seminar: 'park'
  }
  return mapping[category] || 'park'
}

// Helper function to map cleanup categories back to unified categories
const mapCleanupToUnified = (category: CleanupEvent["category"]): 'cleanup' | 'workshop' | 'planting' | 'seminar' => {
  const mapping: Record<CleanupEvent["category"], 'cleanup' | 'workshop' | 'planting' | 'seminar'> = {
    park: 'cleanup',
    beach: 'cleanup',
    street: 'cleanup', 
    forest: 'planting',
    river: 'cleanup'
  }
  return mapping[category] || 'cleanup'
}

// Helper function to determine event status for needs volunteers
const determineEventStatuses = (events: CleanupEvent[]): CleanupEvent[] => {
  return events.map(event => {
    const participationRate = event.maxParticipants > 0 ? event.participantCount / event.maxParticipants : 0
    return {
      ...event,
      needsVolunteers: participationRate < 0.25 && event.status === 'upcoming'
    }
  })
}

// Create a stable random seed based on event ID to prevent cards from shuffling
const getStableRandom = (eventId: string, seed: number = 0) => {
  let hash = 0;
  const str = eventId + seed.toString();
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash) / 2147483647; // Normalize to 0-1
}

const transformEventForCards = (event: CleanupEvent) => {
  // Use stable random values based on event ID to prevent shuffling
  const stableRandom1 = getStableRandom(event.id, 1);
  const stableRandom2 = getStableRandom(event.id, 2);
  const stableRandom3 = getStableRandom(event.id, 3);

  return {
    id: event.id,
    title: event.title,
    date: parseLocalDate(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    time: event.time,
    location: event.location.name,
    type: event.category as "beach" | "park" | "street" | "river",
    volunteers: event.participantCount,
    maxVolunteers: event.maxParticipants,
    description: event.description,
    organizer: event.organizer,
    rating: stableRandom1 > 0.5 ? Number((stableRandom2 * 2 + 3).toFixed(1)) : undefined,
    difficulty: ["Easy", "Medium", "Hard"][Math.floor(stableRandom3 * 3)] as "Easy" | "Medium" | "Hard",
    duration: event.duration,
    needsVolunteers: event.needsVolunteers,
    isLitterAnalysisReport: event.isLitterAnalysisReport,
  }
}

export default function CommunityCleanupMap() {
  const [selectedEvent, setSelectedEvent] = useState<CleanupEvent | null>(null)
  const [events, setEvents] = useState<CleanupEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [userParticipations, setUserParticipations] = useState<Record<string, boolean>>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedDistance, setSelectedDistance] = useState<string>("all")
  const [selectedDate, setSelectedDate] = useState<string>("all")
  const [isFilterPanelExpanded, setIsFilterPanelExpanded] = useState(false)
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false)
  const [isGeocodingAddress, setIsGeocodingAddress] = useState(false)
  const [geocodingError, setGeocodingError] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"all" | "my">("all")
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: "",
    locationName: "",
    locationAddress: "",
    lat: "",
    lng: "",
    organizer: "",
    category: "park" as CleanupEvent["category"],
    maxParticipants: 20,
    equipmentProvided: "",
    requirements: "",
    expectedTrashCollection: "",
    carbonOffset: "",
  })

  useEffect(() => {
    const checkMobile = () => {
      setIsFilterPanelExpanded(window.innerWidth >= 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Get current user on component mount
  useEffect(() => {
    const getCurrentUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUserId(user?.id || null)
    }
    getCurrentUser()
  }, [])

  // Fetch events from database
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      try {
        const { data, error } = await getAllUnifiedEvents()
        if (error) {
          console.error('Error fetching events:', error)
        } else {
          console.log(`Fetched ${data?.length || 0} unified events:`, data)
          const transformedEvents = (data || []).map(transformUnifiedToCleanup)
          const eventsWithStatus = determineEventStatuses(transformedEvents)
          setEvents(eventsWithStatus)
          
          // Check user participation for each event
          if (currentUserId && data) {
            const participations: Record<string, boolean> = {}
            for (const event of data) {
              const hasJoined = await checkUserEventParticipation(event.id, currentUserId)
              participations[event.id.toString()] = hasJoined
            }
            setUserParticipations(participations)
          }
        }
      } catch (err) {
        console.error('Error fetching events:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [currentUserId])

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory
    const matchesDate = selectedDate === "all" || event.date === selectedDate
    return matchesSearch && matchesCategory && matchesDate
  })

  // Geocoding function to convert address to coordinates
  const geocodeAddress = async (address: string): Promise<{lat: number, lng: number} | null> => {
    if (!address.trim()) return null

    setIsGeocodingAddress(true)
    setGeocodingError(null)

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&addressdetails=1`
      )
      
      if (!response.ok) {
        throw new Error('Geocoding request failed')
      }

      const data = await response.json()
      
      if (data.length === 0) {
        setGeocodingError('Address not found. Please check the address and try again.')
        return null
      }

      const result = data[0]
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon)
      }
    } catch (error) {
      console.error('Geocoding error:', error)
      setGeocodingError('Failed to geocode address. Please enter coordinates manually.')
      return null
    } finally {
      setIsGeocodingAddress(false)
    }
  }

  // Function to handle address change and auto-geocode
  const handleAddressChange = async (address: string) => {
    setNewEvent((prev) => ({ ...prev, locationAddress: address }))
    setGeocodingError(null) // Clear any previous errors
    
    // Auto-geocode only if address is substantial (more than 35 characters) and looks complete
    if (address.trim().length > 35 && (address.includes(',') || address.match(/\d+.*[a-zA-Z].*\d/))) {
      const coords = await geocodeAddress(address)
      if (coords) {
        setNewEvent((prev) => ({ 
          ...prev, 
          lat: coords.lat.toString(),
          lng: coords.lng.toString()
        }))
      }
    }
  }

  const handleJoinEvent = async (eventId: string) => {
    if (!currentUserId) {
      alert('Please sign in to join events')
      return
    }

    const isJoined = userParticipations[eventId]
    
    // Update UI immediately (optimistic update)
    setUserParticipations(prev => ({
      ...prev,
      [eventId]: !isJoined
    }))

    // Update participant count in events state
    setEvents(prev => prev.map(event => {
      if (event.id === eventId) {
        const newCount = Math.max(0, isJoined ? event.participantCount - 1 : event.participantCount + 1)
        const newParticipants = Array.from({ length: newCount }, (_, i) => ({
          id: `participant-${i}`,
          name: `Participant ${i + 1}`,
          role: 'volunteer' as const,
          joinedAt: new Date().toISOString()
        }))
        return { ...event, participantCount: newCount, participants: newParticipants }
      }
      return event
    }))

    // Update selected event if it's the one being modified
    if (selectedEvent?.id === eventId) {
      setSelectedEvent(prev => {
        if (!prev) return null
        const newCount = Math.max(0, isJoined ? prev.participantCount - 1 : prev.participantCount + 1)
        const newParticipants = Array.from({ length: newCount }, (_, i) => ({
          id: `participant-${i}`,
          name: `Participant ${i + 1}`,
          role: 'volunteer' as const,
          joinedAt: new Date().toISOString()
        }))
        return { ...prev, participantCount: newCount, participants: newParticipants }
      })
    }
    
    try {
      let result
      if (isJoined) {
        result = await leaveUnifiedEvent(Number(eventId), currentUserId)
      } else {
        result = await joinUnifiedEvent(Number(eventId), currentUserId)
      }

      if (!result.success) {
        // Revert all UI changes if the API call failed
        setUserParticipations(prev => ({
          ...prev,
          [eventId]: isJoined
        }))
        
        // Revert events state
        setEvents(prev => prev.map(event => {
          if (event.id === eventId) {
            const revertedCount = Math.max(0, isJoined ? event.participantCount + 1 : event.participantCount - 1)
            const revertedParticipants = Array.from({ length: revertedCount }, (_, i) => ({
              id: `participant-${i}`,
              name: `Participant ${i + 1}`,
              role: 'volunteer' as const,
              joinedAt: new Date().toISOString()
            }))
            return { ...event, participantCount: revertedCount, participants: revertedParticipants }
          }
          return event
        }))

        // Revert selected event
        if (selectedEvent?.id === eventId) {
          setSelectedEvent(prev => {
            if (!prev) return null
            const revertedCount = Math.max(0, isJoined ? prev.participantCount + 1 : prev.participantCount - 1)
            const revertedParticipants = Array.from({ length: revertedCount }, (_, i) => ({
              id: `participant-${i}`,
              name: `Participant ${i + 1}`,
              role: 'volunteer' as const,
              joinedAt: new Date().toISOString()
            }))
            return { ...prev, participantCount: revertedCount, participants: revertedParticipants }
          })
        }
        
        alert(result.message)
      } else {
        // Optionally refresh the events to get actual participant count from DB
        // This ensures UI stays in sync with the database
        const { data: allEvents } = await getAllUnifiedEvents()
        if (allEvents) {
          const transformedEvents = allEvents.map(transformUnifiedToCleanup)
          const eventsWithStatus = determineEventStatuses(transformedEvents)
          setEvents(eventsWithStatus)
          
          // Update selected event if it matches
          const updatedSelectedEvent = eventsWithStatus.find(e => e.id === eventId)
          if (selectedEvent && updatedSelectedEvent) {
            setSelectedEvent(updatedSelectedEvent)
          }
        }
      }
    } catch (error) {
      // Revert all UI changes if there was an error
      setUserParticipations(prev => ({
        ...prev,
        [eventId]: isJoined
      }))
      
      // Revert events state
      setEvents(prev => prev.map(event => {
        if (event.id === eventId) {
          const revertedCount = Math.max(0, isJoined ? event.participantCount + 1 : event.participantCount - 1)
          const revertedParticipants = Array.from({ length: revertedCount }, (_, i) => ({
            id: `participant-${i}`,
            name: `Participant ${i + 1}`,
            role: 'volunteer' as const,
            joinedAt: new Date().toISOString()
          }))
          return { ...event, participantCount: revertedCount, participants: revertedParticipants }
        }
        return event
      }))

      // Revert selected event
      if (selectedEvent?.id === eventId) {
        setSelectedEvent(prev => {
          if (!prev) return null
          const revertedCount = Math.max(0, isJoined ? prev.participantCount + 1 : prev.participantCount - 1)
          const revertedParticipants = Array.from({ length: revertedCount }, (_, i) => ({
            id: `participant-${i}`,
            name: `Participant ${i + 1}`,
            role: 'volunteer' as const,
            joinedAt: new Date().toISOString()
          }))
          return { ...prev, participantCount: revertedCount, participants: revertedParticipants }
        })
      }
      
      console.error('Error with event action:', error)
      alert('An error occurred. Please try again.')
    }
  }

  // Check if current user can delete an event (only creator can delete)
  const canDeleteEvent = (event: CleanupEvent): boolean => {
    return currentUserId === event.createdBy
  }

  // Handle event deletion
  const handleDeleteEvent = async (eventId: string) => {
    if (!currentUserId) {
      alert('Please sign in to delete events')
      return
    }

    const confirmDelete = window.confirm('Are you sure you want to delete this event? This action cannot be undone.')
    if (!confirmDelete) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('eco_events')
        .delete()
        .eq('id', eventId)
        .eq('user_id', currentUserId) // Ensure only creator can delete

      if (error) {
        console.error('Error deleting event:', error)
        alert('Failed to delete event. Please try again.')
        return
      }

      // Remove from local state
      setEvents(prev => prev.filter(event => event.id !== eventId))
      setSelectedEvent(null)
      alert('Event deleted successfully!')
    } catch (error) {
      console.error('Error deleting event:', error)
      alert('An error occurred. Please try again.')
    }
  }

  const handleCreateEvent = async () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time || !newEvent.locationName) {
      alert("Please fill in all required fields")
      return
    }

    if (!currentUserId) {
      alert("You must be logged in to create events")
      return
    }

    // Validate duration is a number
    if (newEvent.duration && (isNaN(Number(newEvent.duration)) || Number(newEvent.duration) <= 0)) {
      alert("Duration must be a positive number")
      return
    }

    const eventData = {
      title: newEvent.title,
      description: newEvent.description,
      date: newEvent.date,
      time: newEvent.time,
      location: newEvent.locationName,
      category: mapCleanupToUnified(newEvent.category),
      max_participants: Number(newEvent.maxParticipants) > 0 ? Number(newEvent.maxParticipants) : 20,
      user_id: currentUserId,
      duration: newEvent.duration ? `${newEvent.duration} hours` : "2 hours",
      location_name: newEvent.locationName,
      location_address: newEvent.locationAddress,
      lat: newEvent.lat ? Number.parseFloat(newEvent.lat) : undefined,
      lng: newEvent.lng ? Number.parseFloat(newEvent.lng) : undefined,
      organizer: newEvent.organizer || "You",
      status: 'upcoming' as const,
      equipment_provided: newEvent.equipmentProvided.split(',').map(s => s.trim()).filter(Boolean),
      requirements: newEvent.requirements.split(',').map(s => s.trim()).filter(Boolean),
      expected_trash_collection: parseFloat(newEvent.expectedTrashCollection.match(/\d+\.?\d*/)?.[0] || '50'),
      carbon_offset: newEvent.carbonOffset || "10 kg CO2"
    }

    try {
      const { data: createdEvent, error } = await createUnifiedEvent(eventData)
      if (error) {
        console.error('Error creating event:', error)
        alert('Failed to create event')
      } else {
        // Automatically join the creator to their own event
        if (createdEvent && currentUserId) {
          const joinResult = await joinUnifiedEvent(createdEvent.id, currentUserId)
          console.log('Auto-join creator result:', joinResult)
        }

        // Refresh events list
        const { data: allEvents } = await getAllUnifiedEvents()
        if (allEvents) {
          const transformedEvents = allEvents.map(transformUnifiedToCleanup)
          const eventsWithStatus = determineEventStatuses(transformedEvents)
          setEvents(eventsWithStatus)
          
          // Update user participation for all events including the new one
          if (currentUserId) {
            const participations: Record<string, boolean> = {}
            for (const event of allEvents) {
              const hasJoined = await checkUserEventParticipation(event.id, currentUserId)
              participations[event.id.toString()] = hasJoined
            }
            setUserParticipations(participations)
          }
        }
        setIsCreateEventModalOpen(false)
        // Reset form
        setNewEvent({
          title: "",
          description: "",
          date: "",
          time: "",
          duration: "",
          locationName: "",
          locationAddress: "",
          lat: "",
          lng: "",
          organizer: "",
          category: "park",
          maxParticipants: 20,
          equipmentProvided: "",
          requirements: "",
          expectedTrashCollection: "",
          carbonOffset: "",
        })
        alert('Event created successfully!')
      }
    } catch (error) {
      console.error('Error creating event:', error)
      alert('Failed to create event')
    }
  }

  // Filter events based on active tab
  const getFilteredEventsByTab = (events: CleanupEvent[]) => {
    if (activeTab === "my") {
      // Only show events user has joined
      return events.filter(event => userParticipations[event.id])
    }
    return events // Show all events
  }

  const tabFilteredEvents = getFilteredEventsByTab(filteredEvents)

  return (
    <div className="h-full bg-stone-50 overflow-y-auto">
      {/* Full-width Hero Map */}
      <div className="h-[70vh] w-full relative">
        <MapWrapper 
          events={filteredEvents.map(event => ({
            ...event,
            participants: event.participants || []
          }))} 
          categoryColors={categoryColors} 
          onEventSelect={(event) => {
            // Convert back to our CleanupEvent format
            setSelectedEvent({
              ...event,
              participantCount: event.participants?.length || 0
            })
          }} 
        />

        <div className="absolute top-4 right-4 z-[1000]">
          {!isFilterPanelExpanded ? (
            // Collapsed State - Small icon button
            <Button
              onClick={() => setIsFilterPanelExpanded(true)}
              size="sm"
              className="bg-green/95 backdrop-blur-sm hover:bg-green/80 text-stone-700 border border-stone-200 shadow-md rounded-full p-2 w-10 h-10"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
          ) : (
            // Expanded State - Full filter panel
            <Card className="bg-white/95 backdrop-blur-sm w-80">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-stone-600" />
                    <h3 className="font-semibold text-stone-800">Filters</h3>
                  </div>
                  <Button
                    onClick={() => setIsFilterPanelExpanded(false)}
                    variant="ghost"
                    size="sm"
                    className="text-stone-600 hover:text-stone-800"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Search Box */}
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <Input
                    type="text"
                    placeholder="Search events or locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 text-black"
                  />
                </div>

                {/* Category Filter */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-stone-700 mb-1">Cleanup Type</label>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                    options={[
                      { value: "all", label: "All Types" },
                      { value: "beach", label: "Beach" },
                      { value: "park", label: "Park" },
                      { value: "street", label: "Street" },
                      { value: "forest", label: "Forest" },
                      { value: "river", label: "River" },
                    ]}
                  />
                </div>

                {/* Distance Filter */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-stone-700 mb-1">Distance</label>
                  <Select
                    value={selectedDistance}
                    onValueChange={setSelectedDistance}
                    options={[
                      { value: "all", label: "Any Distance" },
                      { value: "1", label: "Within 1 mile" },
                      { value: "5", label: "Within 5 miles" },
                      { value: "10", label: "Within 10 miles" },
                      { value: "25", label: "Within 25 miles" },
                    ]}
                  />
                </div>

                {/* Date Filter */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-stone-700 mb-1">Date</label>
                  <Select
                    value={selectedDate}
                    onValueChange={setSelectedDate}
                    options={[
                      { value: "all", label: "Any Date" },
                      { value: "2025-09-15", label: "Sept 15, 2025" },
                      { value: "2025-09-18", label: "Sept 18, 2025" },
                      { value: "2025-09-22", label: "Sept 22, 2025" },
                    ]}
                  />
                </div>

                {/* Legend */}
                <div className="border-t border-stone-200 pt-3">
                  <h4 className="font-medium text-stone-700 mb-2 text-sm">Event Categories</h4>
                  {Object.entries(categoryColors).map(([category, color]) => (
                    <div key={category} className="flex items-center gap-2 mb-1">
                      <div
                        className="w-3 h-3 rounded-full border border-white shadow-sm"
                        style={{ backgroundColor: color }}
                      ></div>
                      <span className="text-xs capitalize text-stone-600">{category}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Event Tabs */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("all")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === "all"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300"
              }`}
            >
              All Events
              <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-green-800 bg-green-100 rounded-full">
                {filteredEvents.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("my")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === "my"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300"
              }`}
            >
              My Events
              <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-blue-800 bg-blue-100 rounded-full">
                {filteredEvents.filter(event => userParticipations[event.id]).length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Sleek Event Type Legend */}
      <div className="bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-1.5">
          <div className="flex items-center justify-end gap-4 text-xs text-stone-500">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full opacity-75"></div>
                <span className="font-light">Community</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-red-400 rounded-full opacity-75"></div>
                <span className="font-light">Reports</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EventCardsGrid 
        events={tabFilteredEvents.map(transformEventForCards)} 
        loading={loading}
        onJoinEvent={handleJoinEvent}
        userParticipations={userParticipations}
        currentUserId={currentUserId}
        createEventButton={
          <Button
            onClick={() => setIsCreateEventModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 px-6 py-3 text-lg font-semibold"
          >
            <UserPlus className="w-5 h-5" />
            Create Event
          </Button>
        }
      />

      {/* Event Details Modal */}
      <Modal isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)}>
        {selectedEvent && (
          <>
            <ModalHeader onClose={() => setSelectedEvent(null)}>
              <div>
                <h2 className="text-2xl font-bold mb-2">{selectedEvent.title}</h2>
                <div className="flex items-center gap-2">
                  <Badge className="text-white" style={{ backgroundColor: categoryColors[selectedEvent.category] }}>
                    {selectedEvent.category}
                  </Badge>
                  <Badge className="text-white" style={{ backgroundColor: statusColors[selectedEvent.status] }}>
                    {selectedEvent.status}
                  </Badge>
                </div>
              </div>
            </ModalHeader>

            <ModalContent>
              <p className="text-stone-700 mb-6">{selectedEvent.description}</p>

              {/* Event Details Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Date & Time */}
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Date & Time
                  </h3>
                  <p className="text-stone-600">Date: {selectedEvent.date}</p>
                  <p className="text-stone-600">Time: {selectedEvent.time}</p>
                  <p className="text-stone-600">Duration: {selectedEvent.duration}</p>
                </div>

                {/* Location */}
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Location
                  </h3>
                  <p className="text-stone-600">{selectedEvent.location.name}</p>
                  <p className="text-stone-600 text-sm">{selectedEvent.location.address}</p>
                </div>

                {/* Organizer */}
                <div>
                  <h3 className="font-semibold mb-2">Organizer</h3>
                  <p className="text-stone-600">{selectedEvent.organizer}</p>
                </div>

                {/* Participants */}
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Participants ({selectedEvent.participantCount}/{selectedEvent.maxParticipants})
                  </h3>
                  <div className="w-full bg-stone-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(selectedEvent.participantCount / selectedEvent.maxParticipants) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex gap-2">
                    {currentUserId ? (
                      <Button
                        onClick={() => handleJoinEvent(selectedEvent.id)}
                        size="sm"
                        className={`flex items-center gap-2 ${
                          userParticipations[selectedEvent.id] 
                            ? 'bg-red-600 hover:bg-red-700' 
                            : 'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        <UserPlus className="w-4 h-4" />
                        {userParticipations[selectedEvent.id] ? 'Leave Event' : 'Join Event'}
                      </Button>
                    ) : (
                      <Button
                        onClick={() => alert('Please sign in to join events')}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Sign In to Join
                      </Button>
                    )}
                    {canDeleteEvent(selectedEvent) && (
                      <Button
                        onClick={() => handleDeleteEvent(selectedEvent.id)}
                        size="sm"
                        variant="destructive"
                        className="flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Event
                      </Button>
                    )}
                  </div>
                </div>

                {/* Impact */}
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Trash2 className="w-5 h-5" />
                    Expected Impact
                  </h3>
                  <p className="text-stone-600">Trash Collection: {selectedEvent.expectedTrashCollection}</p>
                  <p className="text-stone-600 flex items-center gap-1">
                    <Leaf className="w-4 h-4 text-green-500" />
                    Carbon Offset: {selectedEvent.carbonOffset}
                  </p>
                </div>
              </div>

              {/* Equipment & Requirements */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold mb-2">Equipment Provided</h3>
                  <ul className="text-stone-600 text-sm">
                    {selectedEvent.equipmentProvided.map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">What to Bring</h3>
                  <ul className="text-stone-600 text-sm">
                    {selectedEvent.requirements.map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Participants Count */}
              <div>
                <h3 className="font-semibold mb-3">Registered Participants</h3>
                <div className="bg-stone-50 rounded-lg p-4">
                  <p className="text-stone-600 text-center">
                    {selectedEvent.participantCount > 0 
                      ? `${selectedEvent.participantCount} participant${selectedEvent.participantCount !== 1 ? 's' : ''} registered`
                      : 'No participants yet - be the first to join!'
                    }
                  </p>
                </div>
              </div>
            </ModalContent>
          </>
        )}
      </Modal>

      <Modal isOpen={isCreateEventModalOpen} onClose={() => setIsCreateEventModalOpen(false)}>
        <ModalHeader onClose={() => setIsCreateEventModalOpen(false)}>
          <h2 className="text-2xl font-bold">Create New Cleanup Event</h2>
        </ModalHeader>

        <ModalContent>
          <div className="space-y-4">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Event Title *</label>
                <Input
                  value={newEvent.title}
                  onChange={(e) => setNewEvent((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Central Park Cleanup"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Organizer Name</label>
                <Input
                  value={newEvent.organizer}
                  onChange={(e) => setNewEvent((prev) => ({ ...prev, organizer: e.target.value }))}
                  placeholder="Your name or organization"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
              <textarea
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows={3}
                value={newEvent.description}
                onChange={(e) => setNewEvent((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your cleanup event..."
              />
            </div>

            {/* Date & Time */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Date *</label>
                <Input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent((prev) => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Time *</label>
                <Input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent((prev) => ({ ...prev, time: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Duration (hours)</label>
                <Input
                  type="number"
                  min="0.5"
                  max="24"
                  step="0.5"
                  value={newEvent.duration}
                  onChange={(e) => {
                    const value = e.target.value
                    // Only allow numbers and decimal points
                    if (value === '' || /^\d*\.?\d*$/.test(value)) {
                      setNewEvent((prev) => ({ ...prev, duration: value }))
                    }
                  }}
                  placeholder="e.g., 2"
                />
              </div>
            </div>

            {/* Location */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Location Name *</label>
                <Input
                  value={newEvent.locationName}
                  onChange={(e) => setNewEvent((prev) => ({ ...prev, locationName: e.target.value }))}
                  placeholder="e.g., Central Park"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Address 
                  {isGeocodingAddress && <span className="text-green-600 ml-2">(Finding coordinates...)</span>}
                </label>
                <div className="space-y-2">
                  <Input
                    value={newEvent.locationAddress}
                    onChange={(e) => handleAddressChange(e.target.value)}
                    placeholder="Full address (will auto-find coordinates)"
                    disabled={isGeocodingAddress}
                  />
                  {geocodingError && (
                    <p className="text-sm text-red-600">{geocodingError}</p>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      const coords = await geocodeAddress(newEvent.locationAddress)
                      if (coords) {
                        setNewEvent((prev) => ({ 
                          ...prev, 
                          lat: coords.lat.toString(),
                          lng: coords.lng.toString()
                        }))
                      }
                    }}
                    disabled={!newEvent.locationAddress.trim() || isGeocodingAddress}
                    className="w-full"
                  >
                    {isGeocodingAddress ? (
                      <span className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                        Finding Location...
                      </span>
                    ) : (
                      'Find Coordinates from Address'
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Latitude {newEvent.lat && <span className="text-green-600">✓</span>}
                </label>
                <Input
                  type="number"
                  step="any"
                  value={newEvent.lat}
                  onChange={(e) => setNewEvent((prev) => ({ ...prev, lat: e.target.value }))}
                  placeholder="40.7589"
                  className={newEvent.lat ? "border-green-300 bg-green-50" : ""}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Longitude {newEvent.lng && <span className="text-green-600">✓</span>}
                </label>
                <Input
                  type="number"
                  step="any"
                  value={newEvent.lng}
                  onChange={(e) => setNewEvent((prev) => ({ ...prev, lng: e.target.value }))}
                  placeholder="-73.9851"
                  className={newEvent.lng ? "border-green-300 bg-green-50" : ""}
                />
              </div>
            </div>

            {/* Category & Participants */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Category</label>
                <Select
                  value={newEvent.category}
                  onValueChange={(value) =>
                    setNewEvent((prev) => ({ ...prev, category: value as CleanupEvent["category"] }))
                  }
                  options={[
                    { value: "park", label: "Park" },
                    { value: "beach", label: "Beach" },
                    { value: "street", label: "Street" },
                    { value: "forest", label: "Forest" },
                    { value: "river", label: "River" },
                  ]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Max Participants</label>
                <Input
                  type="number"
                  value={newEvent.maxParticipants === 0 ? '' : newEvent.maxParticipants}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow empty string for controlled input, otherwise set as number
                    setNewEvent((prev) => ({
                      ...prev,
                      maxParticipants: value === '' ? 0 : Math.max(1, Number(value))
                    }));
                  }}
                  min="1"
                />
              </div>
            </div>

            {/* Equipment & Requirements */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Equipment Provided</label>
                <Input
                  value={newEvent.equipmentProvided}
                  onChange={(e) => setNewEvent((prev) => ({ ...prev, equipmentProvided: e.target.value }))}
                  placeholder="Gloves, Trash bags, Grabbers (comma separated)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Requirements</label>
                <Input
                  value={newEvent.requirements}
                  onChange={(e) => setNewEvent((prev) => ({ ...prev, requirements: e.target.value }))}
                  placeholder="Comfortable shoes, Water bottle (comma separated)"
                />
              </div>
            </div>

            {/* Impact */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Expected Trash Collection</label>
                <Input
                  value={newEvent.expectedTrashCollection}
                  onChange={(e) => setNewEvent((prev) => ({ ...prev, expectedTrashCollection: e.target.value }))}
                  placeholder="e.g., 100 lbs"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Carbon Offset</label>
                <Input
                  value={newEvent.carbonOffset}
                  onChange={(e) => setNewEvent((prev) => ({ ...prev, carbonOffset: e.target.value }))}
                  placeholder="e.g., 25 kg CO2"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleCreateEvent} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                Create Event
              </Button>
              <Button onClick={() => setIsCreateEventModalOpen(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </div>
  )
}