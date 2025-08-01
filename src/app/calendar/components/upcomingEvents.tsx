"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { MapPin, Clock, ChevronRight } from "lucide-react"

const allEvents = [
  {
    id: 1,
    title: "Beach Cleanup Drive",
    date: "Jan 15",
    time: "9:00 AM",
    location: "Sunset Beach Park",
    category: "cleanup",
    participants: 24,
    maxParticipants: 50,
  },
  {
    id: 2,
    title: "Recycling Workshop",
    date: "Jan 18",
    time: "2:00 PM",
    location: "Community Center",
    category: "workshop",
    participants: 12,
    maxParticipants: 20,
  },
  {
    id: 3,
    title: "Urban Tree Planting",
    date: "Jan 22",
    time: "8:00 AM",
    location: "Central Park",
    category: "planting",
    participants: 18,
    maxParticipants: 30,
  },
  {
    id: 4,
    title: "Sustainability Seminar",
    date: "Jan 25",
    time: "6:00 PM",
    location: "Green Library",
    category: "seminar",
    participants: 35,
    maxParticipants: 100,
  },
  {
    id: 5,
    title: "River Restoration",
    date: "Jan 28",
    time: "9:00 AM",
    location: "Riverside Trail",
    category: "cleanup",
    participants: 8,
    maxParticipants: 25,
  },
  {
    id: 6,
    title: "Solar Panel Workshop",
    date: "Feb 2",
    time: "1:00 PM",
    location: "Tech Center",
    category: "workshop",
    participants: 15,
    maxParticipants: 25,
  },
  {
    id: 7,
    title: "Coastal Cleanup",
    date: "Feb 5",
    time: "7:00 AM",
    location: "Marina Bay",
    category: "cleanup",
    participants: 32,
    maxParticipants: 60,
  },
  {
    id: 8,
    title: "Composting Class",
    date: "Feb 8",
    time: "3:00 PM",
    location: "Garden Center",
    category: "workshop",
    participants: 9,
    maxParticipants: 15,
  },
]

const categoryColors = {
  cleanup: "bg-emerald-100 text-emerald-700 border-emerald-200",
  workshop: "bg-green-100 text-green-700 border-green-200",
  planting: "bg-lime-100 text-lime-700 border-lime-200",
  seminar: "bg-teal-100 text-teal-700 border-teal-200",
}

export function UpcomingEvents() {
  const [showAll, setShowAll] = useState(false)
  const displayEvents = showAll ? allEvents : allEvents.slice(0, 4)

  return (
    <Card className="shadow-lg border-green-200 bg-gradient-to-br from-white to-green-50 h-fit">
      <CardHeader className="pb-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
        <h3 className="text-xl font-bold">Upcoming Events</h3>
      </CardHeader>

      <CardContent className="p-4">
        <div className={`space-y-3 ${showAll ? "max-h-96 overflow-y-auto pr-2" : ""}`}>
          {displayEvents.map((event, index) => (
            <div
              key={event.id}
              className="p-4 bg-white rounded-xl border border-green-100 hover:shadow-md hover:border-green-300 transition-all duration-200 cursor-pointer group animate-in slide-in-from-right duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-900 text-sm group-hover:text-green-700 transition-colors">
                  {event.title}
                </h4>
                <Badge className={`${categoryColors[event.category]} text-xs`}>{event.category}</Badge>
              </div>

              <div className="space-y-1 mb-3">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Clock className="h-3 w-3 text-green-600" />
                  {event.date} at {event.time}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <MapPin className="h-3 w-3 text-green-600" />
                  {event.location}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {event.participants}/{event.maxParticipants} joined
                </span>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-green-600 transition-colors" />
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full mt-4 text-green-700 border-green-300 hover:bg-green-50 hover:border-green-400 transition-all duration-200 hover:scale-105 bg-transparent"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Show Less" : "View All Events"}
        </Button>
      </CardContent>
    </Card>
  )
}
