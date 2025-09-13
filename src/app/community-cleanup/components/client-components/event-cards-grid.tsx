"use client"

import { CardHeader } from "@/components/ui/card"

import { Calendar, MapPin, Users, Clock } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"

interface CleanupEvent {
  id: string
  title: string
  date: string
  time: string
  location: string
  type: "beach" | "park" | "street" | "river"
  volunteers: number
  description?: string
  organizer?: string
}

interface EventCardProps {
  event: CleanupEvent
}

function EventCard({ event }: EventCardProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "beach":
        return "bg-secondary/10 text-secondary border-secondary/20"
      case "park":
        return "bg-primary/10 text-primary border-primary/20"
      case "river":
        return "bg-secondary/10 text-secondary border-secondary/20"
      case "street":
        return "bg-accent/10 text-accent border-accent/20"
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "beach":
        return "🏖️"
      case "park":
        return "🌳"
      case "river":
        return "🌊"
      case "street":
        return "🏙️"
      default:
        return "🌍"
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border bg-card rounded-xl overflow-hidden">
      {/* CardHeader remains unchanged */}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{getTypeIcon(event.type)}</span>
              <Badge variant="secondary" className={getTypeColor(event.type)}>
                {event.type.charAt(0).toUpperCase() + event.type.slice(1)} Cleanup
              </Badge>
            </div>
            <div className="text-xl font-semibold text-card-foreground group-hover:text-primary transition-colors">
              {event.title}
            </div>
            <div className="text-muted-foreground mt-1">{event.organizer && `Organized by ${event.organizer}`}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Event Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-card-foreground">
            <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="font-medium">{event.date}</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-card-foreground">
            <Clock className="w-4 h-4 text-secondary flex-shrink-0" />
            <span>{event.time}</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-card-foreground">
            <MapPin className="w-4 h-4 text-accent flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-card-foreground">
            <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span>
              <span className="font-semibold text-primary">{event.volunteers}</span> volunteers joined
            </span>
          </div>
        </div>

        {/* Description */}
        {event.description && <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>}

        {/* Action Button */}
        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium group-hover:scale-[1.02] transition-transform">
          Join This Cleanup
        </Button>
      </CardContent>
    </Card>
  )
}

interface EventCardsGridProps {
  events: CleanupEvent[]
}

export default function EventCardsGrid({ events }: EventCardsGridProps) {
  return (
    <section className="w-full px-4 py-12 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-3xl font-bold text-foreground mb-4">Upcoming Cleanup Events</div>
          <div className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse all available cleanup events in your area and join the community effort to protect our environment.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌍</div>
            <div className="text-xl font-semibold text-foreground mb-2">No events found</div>
            <div className="text-muted-foreground">Try adjusting your filters to find cleanup events in your area.</div>
          </div>
        )}
      </div>
    </section>
  )
}
