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
  needsVolunteers?: boolean
  isLitterAnalysisReport?: boolean
}

interface EventCardProps {
  event: CleanupEvent
  onJoinEvent?: (eventId: string) => void
  isJoined?: boolean
  currentUserId?: string | null
}

function EventCard({ event, onJoinEvent, isJoined = false, currentUserId }: EventCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const getTypeColor = (type: string, isLitterReport?: boolean) => {
    // Special styling for litter report events
    if (isLitterReport) {
      return {
        badge: "bg-red-50 text-red-700 border-red-200",
        gradient: "from-red-50 to-orange-50",
      }
    }

    switch (type) {
      case "beach":
        return {
          badge: "bg-blue-50 text-blue-700 border-blue-200",
          gradient: "from-blue-50 to-cyan-50",
        }
      case "park":
        return {
          badge: "bg-green-50 text-green-700 border-green-200",
          gradient: "from-green-50 to-emerald-50",
        }
      case "river":
        return {
          badge: "bg-cyan-50 text-cyan-700 border-cyan-200",
          gradient: "from-cyan-50 to-blue-50",
        }
      case "street":
        return {
          badge: "bg-slate-50 text-slate-700 border-slate-200",
          gradient: "from-slate-50 to-gray-50",
        }
      default:
        return {
          badge: "bg-gray-50 text-gray-700 border-gray-200",
          gradient: "from-gray-50 to-slate-50",
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const typeColors = getTypeColor(event.type, event.isLitterAnalysisReport)
  const progress = event.maxVolunteers ? (event.volunteers / event.maxVolunteers) * 100 : 0

  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-1 cursor-pointer bg-gradient-to-br ${typeColors.gradient} border-0 flex flex-col h-full`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Status badges - positioned at top-right */}
      {event.needsVolunteers && (
        <div className="absolute -top-1 -right-1 z-10">
          <Badge className="bg-gradient-to-r from-red-500 to-pink-600 text-white border-0 rounded-bl-md rounded-tr-md px-2 py-0.5 text-xs font-medium shadow-sm">
            🆘 Needs Volunteers
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
              {/* Subtle Event Source Indicator */}
              <div className="flex items-center">
                <div 
                  className={`w-1.5 h-1.5 rounded-full opacity-60 ${
                    event.isLitterAnalysisReport ? 'bg-red-400' : 'bg-green-400'
                  }`}
                  title={event.isLitterAnalysisReport ? 'Litter Report Event' : 'Community Event'}
                ></div>
              </div>
              {event.difficulty && (
                <Badge className={`${getDifficultyColor(event.difficulty)} text-xs px-1.5 py-0.5`}>
                  {event.difficulty}
                </Badge>
              )}
            </div>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors duration-200 leading-tight mb-1">
              {event.title}
            </h3>
            <div className="flex items-center gap-3">
              {event.organizer && (
                <p className="text-xs text-gray-600 font-medium">By {event.organizer}</p>
              )}
              {event.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span className="text-xs font-semibold text-gray-700">{event.rating}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col flex-1 pb-4">
        <div className="space-y-3 flex-1">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 p-2 bg-white/60 backdrop-blur-sm rounded-md border border-white/50">
              <div className="w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center">
                <Calendar className="w-3 h-3 text-primary" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  {event.date}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-white/60 backdrop-blur-sm rounded-md border border-white/50">
              <div className="w-6 h-6 bg-secondary/10 rounded-md flex items-center justify-center">
                <Clock className="w-3 h-3 text-secondary" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  {event.time}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-white/60 backdrop-blur-sm rounded-md border border-white/50">
            <div className="w-6 h-6 bg-accent/10 rounded-md flex items-center justify-center">
              <MapPin className="w-3 h-3 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate">{event.location}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-3 h-3 text-primary" />
                <span className="text-xs font-semibold text-gray-900">
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
            <div className="p-2 bg-white/40 backdrop-blur-sm rounded-md border border-white/50">
              <p className="text-xs text-gray-700 leading-relaxed line-clamp-1">{event.description}</p>
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
                : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
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
    <Card className="overflow-hidden animate-pulse bg-gradient-to-br from-gray-50 to-gray-100 border-0">
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
  // Sort events to prioritize events needing volunteers
  const sortedEvents = [...events].sort((a, b) => {
    // Prioritize events needing volunteers
    if (a.needsVolunteers && !b.needsVolunteers) return -1
    if (!a.needsVolunteers && b.needsVolunteers) return 1
    
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
            {sortedEvents.map((event) => (
              <EventCard 
                key={event.id} 
                event={event} 
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
            <h3 className="text-2xl font-bold text-black mb-3">No events found</h3>
            <p className="text-black text-lg max-w-md mx-auto leading-relaxed">
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
