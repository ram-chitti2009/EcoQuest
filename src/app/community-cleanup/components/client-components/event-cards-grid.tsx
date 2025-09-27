"use client"

import { ArrowRight, Bookmark, Calendar, Clock, Heart, MapPin, Share2, Star, Users } from "lucide-react"
import { useState } from "react"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader } from "../ui/card"

interface CleanupEvent {
  id: string
  title: string
  date: string
  time: string
  location: string
  type: "beach" | "park" | "street" | "river"
  volunteers: number
  maxVolunteers?: number
  description?: string
  organizer?: string
  rating?: number
  difficulty?: "Easy" | "Medium" | "Hard"
  duration?: string
}

interface EventCardProps {
  event: CleanupEvent
  featured?: boolean
  onJoinEvent?: (eventId: string) => void
  isJoined?: boolean
  currentUserId?: string | null
}

function EventCard({ event, featured = false, onJoinEvent, isJoined = false, currentUserId }: EventCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const getTypeColor = (type: string) => {
    switch (type) {
      case "beach":
        return {
          badge: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
          gradient: "from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950",
        }
      case "park":
        return {
          badge:
            "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
          gradient: "from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950",
        }
      case "river":
        return {
          badge: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-800",
          gradient: "from-cyan-50 to-blue-50 dark:from-cyan-950 dark:to-blue-950",
        }
      case "street":
        return {
          badge:
            "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700",
          gradient: "from-slate-50 to-gray-50 dark:from-slate-900 dark:to-gray-900",
        }
      default:
        return {
          badge: "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700",
          gradient: "from-gray-50 to-slate-50 dark:from-gray-900 dark:to-slate-900",
        }
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

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const typeColors = getTypeColor(event.type)
  const progress = event.maxVolunteers ? (event.volunteers / event.maxVolunteers) * 100 : 0

  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-1 cursor-pointer bg-gradient-to-br ${typeColors.gradient} border-0 ${featured ? "ring-1 ring-primary/20 shadow-md" : ""} flex flex-col h-full`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {featured && (
        <div className="absolute -top-1 -right-1 z-10">
          <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 rounded-bl-md rounded-tr-md px-2 py-0.5 text-xs font-medium">
            ⭐ Featured
          </Badge>
        </div>
      )}

      <div
        className={`absolute top-2 right-2 flex gap-1 z-10 transition-all duration-300 ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"}`}
      >
        <Button
          size="sm"
          variant="ghost"
          className="w-6 h-6 p-0 bg-white/70 hover:bg-white backdrop-blur-sm shadow-sm border border-white/40"
          onClick={(e) => {
            e.stopPropagation()
            setIsLiked(!isLiked)
          }}
        >
          <Heart
            className={`w-3 h-3 transition-all duration-200 ${isLiked ? "text-red-500 fill-current scale-110" : "text-gray-600"}`}
          />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="w-6 h-6 p-0 bg-white/70 hover:bg-white backdrop-blur-sm shadow-sm border border-white/40"
          onClick={(e) => {
            e.stopPropagation()
            setIsBookmarked(!isBookmarked)
          }}
        >
          <Bookmark
            className={`w-3 h-3 transition-all duration-200 ${isBookmarked ? "text-blue-500 fill-current scale-110" : "text-gray-600"}`}
          />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="w-6 h-6 p-0 bg-white/70 hover:bg-white backdrop-blur-sm shadow-sm border border-white/40"
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <Share2 className="w-3 h-3 text-gray-600" />
        </Button>
      </div>

      <CardHeader className="pb-2 relative">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg filter drop-shadow-sm">{getTypeIcon(event.type)}</span>
              <Badge variant="secondary" className={`${typeColors.badge} font-medium px-2 py-0.5 text-xs shadow-sm`}>
                {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
              </Badge>
              {event.difficulty && (
                <Badge className={`${getDifficultyColor(event.difficulty)} text-xs px-1.5 py-0.5`}>
                  {event.difficulty}
                </Badge>
              )}
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-200 leading-tight mb-1">
              {event.title}
            </h3>
            <div className="flex items-center gap-3">
              {event.organizer && (
                <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">By {event.organizer}</p>
              )}
              {event.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{event.rating}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col flex-1 pb-4">
        <div className="space-y-3 flex-1">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 p-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-md border border-white/50 dark:border-gray-700/50">
              <div className="w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center">
                <Calendar className="w-3 h-3 text-primary" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                  {event.date}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-md border border-white/50 dark:border-gray-700/50">
              <div className="w-6 h-6 bg-secondary/10 rounded-md flex items-center justify-center">
                <Clock className="w-3 h-3 text-secondary" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                  {event.time}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-md border border-white/50 dark:border-gray-700/50">
            <div className="w-6 h-6 bg-accent/10 rounded-md flex items-center justify-center">
              <MapPin className="w-3 h-3 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{event.location}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-3 h-3 text-primary" />
                <span className="text-xs font-semibold text-gray-900 dark:text-white">
                  {event.volunteers} {event.maxVolunteers && `/ ${event.maxVolunteers}`} volunteers
                </span>
              </div>
              {event.duration && (
                <Badge
                  variant="outline"
                  className="text-xs bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 px-1.5 py-0.5"
                >
                  {event.duration}
                </Badge>
              )}
            </div>

            {event.maxVolunteers && (
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary to-primary/80 h-1.5 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            )}
          </div>

          {event.description && (
            <div className="p-2 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-md border border-white/50 dark:border-gray-700/50">
              <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-1">{event.description}</p>
            </div>
          )}
        </div>

        <div className="mt-3">
          <Button
            onClick={() => {
              if (!currentUserId) {
                alert('Please sign in to join events')
                return
              }
              if (onJoinEvent) {
                onJoinEvent(event.id)
              }
            }}
            className={`w-full font-medium py-2 rounded-md shadow-md hover:shadow-lg transition-all duration-300 group/btn border-2 border-white ${
              isJoined 
                ? 'bg-gradient-to-r from-red-600 to-red-600/90 hover:from-red-600/90 hover:to-red-600 text-white'
                : 'bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white'
            } ${isHovered ? "scale-[1.01]" : ""}`}
          >
            <span className="flex items-center justify-center gap-2 text-sm">
              {isJoined ? 'Leave Cleanup' : 'Join Cleanup'}
              <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform duration-200" />
            </span>
          </Button>
        </div>
      </CardContent>

      {/* Subtle Overlay for Depth */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
      />
    </Card>
  )
}

function EventCardSkeleton() {
  return (
    <Card className="overflow-hidden animate-pulse bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-0">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full" />
            </div>
            <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        </div>
        <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </CardContent>
    </Card>
  )
}

interface EventCardsGridProps {
  events: CleanupEvent[]
  loading?: boolean
  createEventButton?: React.ReactNode
  onJoinEvent?: (eventId: string) => void
  userParticipations?: Record<string, boolean>
  currentUserId?: string | null
}

export default function EventCardsGrid({ events, loading = false, createEventButton, onJoinEvent, userParticipations, currentUserId }: EventCardsGridProps) {
  // Sort events to show featured ones first
  const sortedEvents = [...events].sort((a, b) => {
    // This is just an example - you'd implement actual featured logic
    const aFeatured = a.rating && a.rating >= 4.5
    const bFeatured = b.rating && b.rating >= 4.5
    if (aFeatured && !bFeatured) return -1
    if (!aFeatured && bFeatured) return 1
    return 0
  })

  if (loading) {
    return (
      <section className="w-full px-4 py-12 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="h-8 w-80 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-4 animate-pulse" />
            <div className="h-6 w-96 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center gap-6 mb-8">
          <div className="relative w-full max-w-6xl">
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4 leading-tight">
                Upcoming Cleanup Events
              </h2>
            </div>
            {createEventButton && (
              <div className="flex justify-center mt-4 md:absolute md:top-0 md:right-12 lg:right-16 xl:right-20 md:mt-0">
                {createEventButton}
              </div>
            )}
          </div>
          <p className="text-lg md:text-xl text-gray-600 font-medium max-w-3xl mx-auto leading-relaxed tracking-wide text-center">
            Join passionate volunteers in cleaning up our communities and protecting nature.
          </p>
        </div>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sortedEvents.map((event, index) => (
              <EventCard 
                key={event.id} 
                event={event} 
                featured={event.rating ? event.rating >= 4.5 : index === 0}
                onJoinEvent={onJoinEvent}
                isJoined={userParticipations?.[event.id] || false}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🌍</span>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">No events found</h3>
            <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
              We couldn&#39;t find any cleanup events matching your criteria. Try adjusting your filters or check back
              later for new opportunities.
            </p>
            <Button className="mt-6 bg-primary hover:bg-primary/90">Browse All Events</Button>
          </div>
        )}
      </div>
    </section>
  )
}
