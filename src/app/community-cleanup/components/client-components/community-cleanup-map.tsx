"use client"

import { Calendar, Filter, Leaf, MapPin, Search, SlidersHorizontal, Trash2, UserPlus, Users, X } from "lucide-react"
import dynamic from "next/dynamic"
import { useState } from "react"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Input } from "../ui/input"
import { Modal, ModalContent, ModalHeader } from "../ui/modal"
import { Select } from "../ui/select"

// Dynamically import the map component to avoid SSR issues
const MapWrapper = dynamic(() => import("./map-wrapper"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-green-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-green-600 font-medium">Loading map...</p>
      </div>
    </div>
  ),
})

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

export default function CommunityCleanupMap() {
  const [selectedEvent, setSelectedEvent] = useState<CleanupEvent | null>(null)
  const [events, setEvents] = useState<CleanupEvent[]>(sampleEvents)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedDistance, setSelectedDistance] = useState<string>("all")
  const [selectedDate, setSelectedDate] = useState<string>("all")
  const [isFilterPanelExpanded, setIsFilterPanelExpanded] = useState(false)

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory
    const matchesDate = selectedDate === "all" || event.date === selectedDate
    return matchesSearch && matchesCategory && matchesDate
  })

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

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Full-width Hero Map */}
      <div className="h-[70vh] w-full relative">
        <MapWrapper events={filteredEvents} categoryColors={categoryColors} onEventSelect={setSelectedEvent} />

        {/* Floating Filter Panel - Top Right - Collapsible */}
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
                      { value: "river", label: "River" }
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
                      { value: "25", label: "Within 25 miles" }
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
                      { value: "2025-09-22", label: "Sept 22, 2025" }
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

      {/* Event Cards Grid Below Map */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-stone-800 mb-2">Upcoming Cleanup Events</h2>
          <p className="text-stone-600">
            Join your community in making a difference. {filteredEvents.length} events available.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: categoryColors[event.category] }}
                    ></div>
                    <Badge variant="secondary" className="text-xs uppercase tracking-wide">
                      {event.category}
                    </Badge>
                  </div>
                  <span className="text-xs text-stone-400">{event.date}</span>
                </div>

                <h3 className="font-semibold text-lg text-stone-800 mb-2 line-clamp-2">{event.title}</h3>
                <p className="text-stone-600 text-sm mb-4 line-clamp-2">{event.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-stone-500">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-stone-500">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {event.time} • {event.duration}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-stone-500">
                    <Users className="w-4 h-4" />
                    <span>
                      {event.participants.length}/{event.maxParticipants} volunteers
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-stone-500">by {event.organizer}</div>
                  <Button onClick={() => setSelectedEvent(event)} size="sm">
                    Join Event
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-stone-400 mb-2">
              <Filter className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-stone-600 mb-1">No events found</h3>
            <p className="text-stone-500">Try adjusting your filters to see more events.</p>
          </div>
        )}
      </div>

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
    </div>
  )
}
