"use client"

import { useState, useEffect } from "react"
import { MapPin, X } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import FilterPanel, { type FilterState } from "./filter-panel"
import { type CleanupEvent, mockCleanupEvents, filterEvents } from "../../lib/cleanup-data"

interface MapPinProps {
  event: CleanupEvent
  onClick: () => void
  isSelected: boolean
}

function MapPinComponent({ event, onClick, isSelected }: MapPinProps) {
  const pinColor =
    event.type === "beach"
      ? "bg-secondary"
      : event.type === "park"
        ? "bg-primary"
        : event.type === "river"
          ? "bg-secondary"
          : "bg-accent"

  return (
    <button
      onClick={onClick}
      className={`absolute transform -translate-x-1/2 -translate-y-full transition-all duration-200 hover:scale-110 ${
        isSelected ? "scale-125 z-20" : "z-10"
      }`}
      style={{
        left: `${event.coordinates.lng}%`,
        top: `${event.coordinates.lat}%`,
      }}
    >
      <div
        className={`w-6 h-6 rounded-full ${pinColor} border-2 border-white shadow-lg flex items-center justify-center`}
      >
        <MapPin className="w-3 h-3 text-white" />
      </div>
    </button>
  )
}

interface EventPopupProps {
  event: CleanupEvent
  onClose: () => void
}

function EventPopup({ event, onClose }: EventPopupProps) {
  return (
    <Card
      className="absolute z-30 w-80 shadow-xl border-0 rounded-xl"
      style={{
        left: `${Math.min(event.coordinates.lng, 70)}%`,
        top: `${Math.max(event.coordinates.lat - 10, 5)}%`,
      }}
    >
      <div className="flex items-start justify-between p-4 pb-3">
        <div>
          <div className="text-lg font-semibold text-card-foreground">{event.title}</div>
          <div className="text-sm text-muted-foreground mt-1">
            {event.date} at {event.time}
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 hover:bg-muted">
          <X className="w-4 h-4" />
        </Button>
      </div>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="text-sm text-card-foreground">
            <span className="font-medium">Location:</span> {event.location}
          </div>
          <div className="text-sm text-card-foreground">
            <span className="font-medium">Type:</span> {event.type.charAt(0).toUpperCase() + event.type.slice(1)}{" "}
            cleanup
          </div>
          <div className="text-sm text-card-foreground">
            <span className="font-medium">Volunteers:</span> {event.volunteers} joined
          </div>
          {event.organizer && (
            <div className="text-sm text-card-foreground">
              <span className="font-medium">Organizer:</span> {event.organizer}
            </div>
          )}
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
            Join Cleanup
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

interface InteractiveMapProps {
  onFilteredEventsChange?: (events: CleanupEvent[]) => void
}

export default function InteractiveMap({ onFilteredEventsChange }: InteractiveMapProps) {
  const [selectedEvent, setSelectedEvent] = useState<CleanupEvent | null>(null)
  const [filteredEvents, setFilteredEvents] = useState<CleanupEvent[]>(mockCleanupEvents)

  useEffect(() => {
    onFilteredEventsChange?.(filteredEvents)
  }, [filteredEvents, onFilteredEventsChange])

  const handleFilterChange = (filters: FilterState) => {
    const filtered = filterEvents(mockCleanupEvents, filters)
    setFilteredEvents(filtered)
  }

  return (
    <div className="relative w-full h-[60vh] bg-gradient-to-br from-green-50 to-blue-50 rounded-xl overflow-hidden shadow-lg">
      {/* Map background with subtle pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-[url('/placeholder.svg?key=pw582')] bg-cover bg-center"></div>
      </div>

      <FilterPanel onFilterChange={handleFilterChange} />

      {/* Map pins - using filtered events */}
      {filteredEvents.map((event) => (
        <MapPinComponent
          key={event.id}
          event={event}
          onClick={() => setSelectedEvent(event)}
          isSelected={selectedEvent?.id === event.id}
        />
      ))}

      {/* Event popup */}
      {selectedEvent && <EventPopup event={selectedEvent} onClose={() => setSelectedEvent(null)} />}

      {/* Map overlay for closing popup */}
      {selectedEvent && <div className="absolute inset-0 z-10" onClick={() => setSelectedEvent(null)} />}
    </div>
  )
}
