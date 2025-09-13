export interface CleanupEvent {
  id: string
  title: string
  date: string
  time: string
  location: string
  type: "beach" | "park" | "street" | "river"
  volunteers: number
  coordinates: { lat: number; lng: number }
  description?: string
  organizer?: string
}

export const mockCleanupEvents: CleanupEvent[] = [
  {
    id: "1",
    title: "Beach Cleanup Drive",
    date: "Dec 15, 2024",
    time: "9:00 AM",
    location: "Santa Monica Beach",
    type: "beach",
    volunteers: 24,
    coordinates: { lat: 25, lng: 20 },
    description: "Join us for a morning beach cleanup to protect marine life and keep our coastline pristine.",
    organizer: "Ocean Conservation Group",
  },
  {
    id: "2",
    title: "Central Park Restoration",
    date: "Dec 18, 2024",
    time: "10:30 AM",
    location: "Central Park East",
    type: "park",
    volunteers: 18,
    coordinates: { lat: 40, lng: 60 },
    description: "Help restore the natural beauty of Central Park by removing litter and invasive plants.",
    organizer: "Parks & Recreation Dept",
  },
  {
    id: "3",
    title: "River Trail Cleanup",
    date: "Dec 20, 2024",
    time: "8:00 AM",
    location: "Hudson River Trail",
    type: "river",
    volunteers: 12,
    coordinates: { lat: 60, lng: 35 },
    description: "Early morning cleanup along the scenic Hudson River Trail to protect local wildlife habitats.",
    organizer: "River Keepers Alliance",
  },
  {
    id: "4",
    title: "Downtown Street Sweep",
    date: "Dec 22, 2024",
    time: "2:00 PM",
    location: "Main Street District",
    type: "street",
    volunteers: 31,
    coordinates: { lat: 30, lng: 75 },
    description: "Community effort to clean up downtown streets and create a more welcoming urban environment.",
    organizer: "Downtown Business Association",
  },
  {
    id: "5",
    title: "Lakeside Park Cleanup",
    date: "Dec 25, 2024",
    time: "11:00 AM",
    location: "Echo Park Lake",
    type: "park",
    volunteers: 15,
    coordinates: { lat: 70, lng: 45 },
    description: "Holiday cleanup event at the beautiful Echo Park Lake. Families welcome!",
    organizer: "Community Volunteers",
  },
  {
    id: "6",
    title: "Coastal Dune Restoration",
    date: "Dec 28, 2024",
    time: "9:30 AM",
    location: "Malibu State Beach",
    type: "beach",
    volunteers: 8,
    coordinates: { lat: 15, lng: 85 },
    description: "Help restore native vegetation and remove debris from sensitive coastal dune ecosystems.",
    organizer: "Coastal Conservation Society",
  },
  {
    id: "7",
    title: "Urban Forest Care",
    date: "Jan 2, 2025",
    time: "1:00 PM",
    location: "Griffith Park",
    type: "park",
    volunteers: 22,
    coordinates: { lat: 55, lng: 25 },
    description: "New Year cleanup and tree care in one of LA's largest urban parks.",
    organizer: "Urban Forest Initiative",
  },
  {
    id: "8",
    title: "Waterfront Restoration",
    date: "Jan 5, 2025",
    time: "10:00 AM",
    location: "Venice Beach Boardwalk",
    type: "beach",
    volunteers: 35,
    coordinates: { lat: 35, lng: 15 },
    description: "Large-scale cleanup of the iconic Venice Beach boardwalk and surrounding areas.",
    organizer: "Venice Community Coalition",
  },
]

export interface FilterState {
  search: string
  distance: string
  date: string
  type: string
}

export function filterEvents(events: CleanupEvent[], filters: FilterState): CleanupEvent[] {
  let filtered = events

  // Filter by search term
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase()
    filtered = filtered.filter(
      (event) =>
        event.title.toLowerCase().includes(searchTerm) ||
        event.location.toLowerCase().includes(searchTerm) ||
        event.organizer?.toLowerCase().includes(searchTerm) ||
        event.description?.toLowerCase().includes(searchTerm),
    )
  }

  // Filter by type
  if (filters.type && filters.type !== "all") {
    filtered = filtered.filter((event) => event.type === filters.type)
  }

  // Filter by date (simplified for demo)
  if (filters.date) {
    const now = new Date()
    const today = now.toDateString()

    switch (filters.date) {
      case "today":
        filtered = filtered.filter((event) => {
          // For demo purposes, show events from Dec 15 as "today"
          return event.date.includes("Dec 15")
        })
        break
      case "week":
        filtered = filtered.filter((event) => {
          // Show December events as "this week"
          return event.date.includes("Dec")
        })
        break
      case "month":
        // Show all events for demo
        break
      case "upcoming":
      default:
        // Show all events
        break
    }
  }

  return filtered
}
