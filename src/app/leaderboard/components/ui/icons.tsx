"use client"

export function Crown({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M5 16L3 7l5.5 5L12 4l3.5 8L21 7l-2 9H5zm2.7-2h8.6l.9-5.4-2.1 1.8L12 8l-3.1 2.4-2.1-1.8L7.7 14z" />
    </svg>
  )
}

export function Leaf({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22.45C8.66,16.7 11.14,12.07 17,10.09C20.25,9.09 21.77,8.5 22,8.5C22,8.5 21.74,6.15 19,4.09C16.26,2.03 13.5,2 13.5,2L14,3.5C14,3.5 16.33,3.91 17,8Z" />
    </svg>
  )
}

export function Users({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2 1l-3 4v2l3-3v8h2zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm1.5 2h-2C3.57 8 2.5 9.57 2.5 11.5V22h2v-6h2v6h2v-6.5c0-1.93-1.07-3.5-2.5-3.5z" />
    </svg>
  )
}

export function Clock({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.7L16.2,16.2Z" />
    </svg>
  )
}

export function Trophy({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15H17C17,17.21 14.76,19 12,19C9.24,19 7,17.21 7,15M12,3C7.58,3 4,4.79 4,7C4,9.21 7.58,11 12,11C16.42,11 20,9.21 20,7C20,4.79 16.42,3 12,3M4,9V12C4,13.1 4.9,14 6,14H7.5C7.5,14 7.5,13.9 7.5,13.79C7.5,13.4 7.61,13.04 7.77,12.72C7.32,12.25 7,11.74 7,11.2V9.85C5.77,9.35 5,8.74 5,8.06V9H4M20,9V12C20,13.1 19.1,14 18,14H16.5C16.5,14 16.5,13.9 16.5,13.79C16.5,13.4 16.39,13.04 16.23,12.72C16.68,12.25 17,11.74 17,11.2V9.85C18.23,9.35 19,8.74 19,8.06V9H20Z" />
    </svg>
  )
}

export function Star({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z" />
    </svg>
  )
}
