export interface EcoEvent {
  id: number
  title: string
  description: string
  date: string
  time: string
  location: string
  category: 'cleanup' | 'workshop' | 'planting' | 'seminar'
  participants: number
  max_participants: number
}

export interface CalendarDay {
  day: number
  month: number
  year: number
  isCurrentMonth: boolean
  isToday: boolean
  hasEvents: boolean
}