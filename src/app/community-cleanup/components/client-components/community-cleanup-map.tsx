"use client"

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
  participants: Participant[]
  maxParticipants: number
  category: "beach" | "park" | "street" | "forest" | "river"
  status: "upcoming" | "ongoing" | "completed"
  equipmentProvided: string[]
  requirements: string[]
  expectedTrashCollection: string
  carbonOffset: string
}

const sampleEvents: CleanupEvent[] = [
  {
    id: "1",
    title: "Central Park Cleanup",
    description:
      "Join us for a morning cleanup of Central Park. We'll focus on the areas around the lake and walking paths.",
    date: "2025-09-15",
    time: "09:00",
    duration: "3 hours",
    location: {
      name: "Central Park",
      address: "Central Park, New York, NY 10024",
      lat: 40.785091,
      lng: -73.968285,
    },
    organizer: "NYC Parks Department",
    participants: [
      { id: "1", name: "Sarah Johnson", role: "organizer", joinedAt: "2025-09-01" },
      { id: "2", name: "Mike Chen", role: "coordinator", joinedAt: "2025-09-03" },
      { id: "3", name: "Emma Davis", role: "volunteer", joinedAt: "2025-09-05" },
      { id: "4", name: "John Smith", role: "volunteer", joinedAt: "2025-09-07" },
    ],
    maxParticipants: 50,
    category: "park",
    status: "upcoming",
    equipmentProvided: ["Gloves", "Trash bags", "Grabbers", "Safety vests"],
    requirements: ["Comfortable walking shoes", "Water bottle", "Sun protection"],
    expectedTrashCollection: "200 lbs",
    carbonOffset: "50 kg CO2",
  },
  {
    id: "2",
    title: "Brooklyn Bridge Cleanup",
    description:
      "Help keep the iconic Brooklyn Bridge and surrounding areas clean. Perfect for photography enthusiasts!",
    date: "2025-09-18",
    time: "14:00",
    duration: "2 hours",
    location: {
      name: "Brooklyn Bridge",
      address: "Brooklyn Bridge, New York, NY 10038",
      lat: 40.706086,
      lng: -73.996864,
    },
    organizer: "Brooklyn Community Group",
    participants: [
      { id: "5", name: "Alex Rivera", role: "organizer", joinedAt: "2025-08-28" },
      { id: "6", name: "Lisa Wang", role: "volunteer", joinedAt: "2025-09-02" },
    ],
    maxParticipants: 30,
    category: "street",
    status: "upcoming",
    equipmentProvided: ["Gloves", "Trash bags", "First aid kit"],
    requirements: ["Comfortable shoes", "Photo ID for bridge access"],
    expectedTrashCollection: "100 lbs",
    carbonOffset: "25 kg CO2",
  },
  {
    id: "3",
    title: "Hudson River Shore Cleanup",
    description: "Coastal cleanup along the Hudson River. Help protect marine life and enjoy beautiful river views.",
    date: "2025-09-22",
    time: "10:00",
    duration: "4 hours",
    location: {
      name: "Hudson River Park",
      address: "Hudson River Park, New York, NY 10014",
      lat: 40.72903,
      lng: -74.009667,
    },
    organizer: "Hudson River Conservation",
    participants: [
      { id: "7", name: "Maria Gonzalez", role: "organizer", joinedAt: "2025-08-25" },
      { id: "8", name: "David Kim", role: "coordinator", joinedAt: "2025-08-30" },
      { id: "9", name: "Anna Brown", role: "volunteer", joinedAt: "2025-09-01" },
      { id: "10", name: "Tom Wilson", role: "volunteer", joinedAt: "2025-09-04" },
      { id: "11", name: "Rachel Green", role: "volunteer", joinedAt: "2025-09-06" },
    ],
    maxParticipants: 75,
    category: "river",
    status: "upcoming",
    equipmentProvided: ["Gloves", "Trash bags", "Recycling bags", "Data collection sheets", "Refreshments"],
    requirements: ["Closed-toe shoes", "Sun protection", "Water bottle", "Weather-appropriate clothing"],
    expectedTrashCollection: "500 lbs",
    carbonOffset: "125 kg CO2",
  },
]

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

const transformEventForCards = (event: CleanupEvent) => ({
  id: event.id,
  title: event.title,
  date: new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  time: event.time,
  location: event.location.name,
  type: event.category as "beach" | "park" | "street" | "river",
  volunteers: event.participants.length,
  maxVolunteers: event.maxParticipants,
  description: event.description,
  organizer: event.organizer,
  rating: Math.random() > 0.5 ? Number((Math.random() * 2 + 3).toFixed(1)) : undefined,
  difficulty: ["Easy", "Medium", "Hard"][Math.floor(Math.random() * 3)] as "Easy" | "Medium" | "Hard",
  duration: event.duration,
})

export default function CommunityCleanupMap() {
  const [selectedEvent, setSelectedEvent] = useState<CleanupEvent | null>(null)
  const [events, setEvents] = useState<CleanupEvent[]>(sampleEvents)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedDistance, setSelectedDistance] = useState<string>("all")
  const [selectedDate, setSelectedDate] = useState<string>("all")
  const [isFilterPanelExpanded, setIsFilterPanelExpanded] = useState(false)
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false)
  const [isGeocodingAddress, setIsGeocodingAddress] = useState(false)
  const [geocodingError, setGeocodingError] = useState<string | null>(null)
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

  const handleJoinEvent = (eventId: string) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) => {
        if (event.id === eventId && event.participants.length < event.maxParticipants) {
          const newParticipant: Participant = {
            id: Date.now().toString(),
            name: "You",
            role: "volunteer",
            joinedAt: new Date().toISOString().split("T")[0],
          }
          return {
            ...event,
            participants: [...event.participants, newParticipant],
          }
        }
        return event
      }),
    )

    if (selectedEvent && selectedEvent.id === eventId) {
      const updatedEvent = events.find((e) => e.id === eventId)
      if (updatedEvent) {
        setSelectedEvent({
          ...updatedEvent,
          participants: [
            ...updatedEvent.participants,
            {
              id: Date.now().toString(),
              name: "You",
              role: "volunteer",
              joinedAt: new Date().toISOString().split("T")[0],
            },
          ],
        })
      }
    }
  }

  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time || !newEvent.locationName) {
      alert("Please fill in all required fields")
      return
    }

    const event: CleanupEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      description: newEvent.description,
      date: newEvent.date,
      time: newEvent.time,
      duration: newEvent.duration || "2 hours",
      location: {
        name: newEvent.locationName,
        address: newEvent.locationAddress,
        lat: Number.parseFloat(newEvent.lat) || 40.7589,
        lng: Number.parseFloat(newEvent.lng) || -73.9851,
      },
      organizer: newEvent.organizer || "You",
      participants: [
        {
          id: "creator",
          name: newEvent.organizer || "You",
          role: "organizer",
          joinedAt: new Date().toISOString().split("T")[0],
        },
      ],
      maxParticipants: newEvent.maxParticipants,
      category: newEvent.category,
      status: "upcoming",
      equipmentProvided: newEvent.equipmentProvided
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      requirements: newEvent.requirements
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      expectedTrashCollection: newEvent.expectedTrashCollection || "50 lbs",
      carbonOffset: newEvent.carbonOffset || "10 kg CO2",
    }

    setEvents((prev) => [...prev, event])
    setIsCreateEventModalOpen(false)
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
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Full-width Hero Map */}
      <div className="h-[70vh] w-full relative">
        <MapWrapper events={filteredEvents} categoryColors={categoryColors} onEventSelect={setSelectedEvent} />

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

      <EventCardsGrid 
        events={filteredEvents.map(transformEventForCards)} 
        loading={false}
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
                    Participants ({selectedEvent.participants.length}/{selectedEvent.maxParticipants})
                  </h3>
                  <div className="w-full bg-stone-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(selectedEvent.participants.length / selectedEvent.maxParticipants) * 100}%` }}
                    ></div>
                  </div>
                  {selectedEvent.participants.length < selectedEvent.maxParticipants && (
                    <Button
                      onClick={() => handleJoinEvent(selectedEvent.id)}
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      Join Event
                    </Button>
                  )}
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

              {/* Participants List */}
              <div>
                <h3 className="font-semibold mb-3">Registered Participants</h3>
                <div className="bg-stone-50 rounded-lg p-4 max-h-32 overflow-y-auto">
                  {selectedEvent.participants.map((participant) => (
                    <div key={participant.id} className="flex justify-between items-center py-1">
                      <span className="text-sm">{participant.name}</span>
                      <Badge
                        variant={
                          participant.role === "organizer"
                            ? "default"
                            : participant.role === "coordinator"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {participant.role}
                      </Badge>
                    </div>
                  ))}
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
                <label className="block text-sm font-medium text-stone-700 mb-1">Duration</label>
                <Input
                  value={newEvent.duration}
                  onChange={(e) => setNewEvent((prev) => ({ ...prev, duration: e.target.value }))}
                  placeholder="e.g., 2 hours"
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
                  value={newEvent.maxParticipants}
                  onChange={(e) =>
                    setNewEvent((prev) => ({ ...prev, maxParticipants: Number.parseInt(e.target.value) || 20 }))
                  }
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
