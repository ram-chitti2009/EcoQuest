"use client"

import { useState } from "react"

interface Video {
  id: string
  title: string
  description: string
  creator: string
  creatorAvatar: string
  videoUrl: string
  likes: number
  comments: number
  shares: number
  isLiked: boolean
  isSaved: boolean
}

interface VideoCardProps {
  video: Video
  isActive: boolean
}

export function VideoCard({ video, isActive }: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(true) // Default to true for autoplay
  const [isMuted, setIsMuted] = useState(true) // Start muted for autoplay compliance

  const getEmbedUrl = (url: string) => {
    if (url.includes("youtube.com/embed/")) {
      // Extract video ID from the embed URL
      const videoId = url.split("/").pop()?.split("?")[0] || ""
      // Construct clean embed URL with proper parameters
      return `https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${videoId}`
    }
    return url
  }

  const handlePlayToggle = () => {
    setIsPlaying(!isPlaying)
  }

  const handleMuteToggle = () => {
    setIsMuted(!isMuted)
  }

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
      <div className="relative w-full h-full">
        <iframe
          src={getEmbedUrl(video.videoUrl)}
          title={video.title}
          className="w-full h-full object-cover"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />

        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Mute/Unmute button - Top left to avoid conflict with controls */}
        <button
          onClick={handleMuteToggle}
          className="absolute top-4 left-4 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm transition-all hover:bg-black/70 z-30"
        >
          {isMuted ? (
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3.63 3.63a.996.996 0 0 0 0 1.41L7.29 8.7 7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18c-.49.37-1.02.68-1.6.91-.36.15-.58.53-.58.92 0 .72.73 1.18 1.39.91.8-.33 1.54-.77 2.22-1.31l4.05 4.05a.996.996 0 1 0 1.41-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-3.83-2.4-7.11-5.78-8.4-.59-.23-1.22.23-1.22.86v.19c0 .38.25.71.61.85C17.18 6.54 19 9.06 19 12zm-8.71-6.29l-.17.17L12 7.76V6.41c0-.89-1.08-1.33-1.71-.7z"/>
            </svg>
          ) : (
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
          )}
        </button>

        {/* Play/Pause button - Center (always visible when paused) */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <button
              onClick={handlePlayToggle}
              className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm transition-all hover:bg-black/70 hover:scale-110"
            >
              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        )}

        {/* Pause button overlay - Only visible when playing and hovering */}
        {isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handlePlayToggle}
              className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm transition-all hover:bg-black/70 hover:scale-110"
            >
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            </button>
          </div>
        )}

        {/* Tap to pause/play - Mobile friendly invisible overlay */}
        <div 
          className="absolute inset-0 z-10 md:hidden"
          onClick={handlePlayToggle}
          style={{ background: 'transparent' }}
        />
      </div>
    </div>
  )
}
