"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { VideoCard } from "./video-card"
import { VideoControls } from "./video-controls"
import { VideoInfo } from "./video-info"

const videoUrls = [
  "https://www.youtube.com/shorts/xtpTnLmBF0Q", // User's example video
  "https://www.youtube.com/shorts/dQw4w9WgXcQ", // Rick Roll Short
  "https://www.youtube.com/shorts/kJQP7kiw5Fk", // Despacito Short
]

interface VideoData {
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
  duration?: string
}

const extractVideoId = (url: string): string => {
  // Handle YouTube Shorts URLs
  const shortsMatch = url.match(/youtube\.com\/shorts\/([^&\n?#]+)/)
  if (shortsMatch) {
    return shortsMatch[1]
  }

  // Handle regular YouTube URLs
  const regularMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  return regularMatch ? regularMatch[1] : ""
}

const fetchVideoMetadata = async (videoUrl: string): Promise<Partial<VideoData>> => {
  try {
    const videoId = extractVideoId(videoUrl)
    const oEmbedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl)}&format=json`

    const response = await fetch(oEmbedUrl)
    const data = await response.json()

    return {
      id: videoId,
      title: data.title || "Unknown Title",
      creator: data.author_name || "Unknown Creator",
      creatorAvatar: `https://img.youtube.com/vi/${videoId}/default.jpg`,
      videoUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0`,
      description: `${data.title} by ${data.author_name}`,
      likes: Math.floor(Math.random() * 100000) + 1000,
      comments: Math.floor(Math.random() * 1000) + 50,
      shares: Math.floor(Math.random() * 5000) + 100,
      isLiked: false,
      isSaved: false,
    }
  } catch (error) {
    console.error("Error fetching video metadata:", error)
    const videoId = extractVideoId(videoUrl)
    return {
      id: videoId,
      title: "Video Title",
      creator: "Creator Name",
      creatorAvatar: `https://img.youtube.com/vi/${videoId}/default.jpg`,
      videoUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0`,
      description: "Video description",
      likes: 1000,
      comments: 50,
      shares: 100,
      isLiked: false,
      isSaved: false,
    }
  }
}

export function EcoShortsPlayer() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [videos, setVideos] = useState<VideoData[]>([])
  const [loading, setLoading] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [swipeProgress, setSwipeProgress] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState<"up" | "down" | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const startY = useRef<number>(0)
  const currentY = useRef<number>(0)
  const isDragging = useRef<boolean>(false)
  const animationFrameRef = useRef<number>(0)

  useEffect(() => {
    const loadVideos = async () => {
      setLoading(true)
      const videoPromises = videoUrls.map(fetchVideoMetadata)
      const videoData = await Promise.all(videoPromises)
      setVideos(videoData as VideoData[])
      setLoading(false)
    }

    loadVideos()
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault()
        goToPrevVideo()
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        goToNextVideo()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentVideoIndex, videos.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const currentVideo = videos[currentVideoIndex]

  const handleVideoInteraction = (videoId: string, action: "like" | "save" | "share", value: boolean) => {
    setVideos((prev) =>
      prev.map((video) =>
        video.id === videoId
          ? {
              ...video,
              [action === "like" ? "isLiked" : action === "save" ? "isSaved" : "isShared"]: action === "share" ? undefined : value,
              likes: action === "like" ? (value ? video.likes + 1 : video.likes - 1) : video.likes,
              shares: action === "share" ? video.shares + 1 : video.shares,
            }
          : video,
      ),
    )
  }

  const goToNextVideo = () => {
    if (currentVideoIndex < videos.length - 1 && !isTransitioning) {
      setIsTransitioning(true)
      setSwipeDirection("up")

      // Add haptic feedback for mobile
      if (navigator.vibrate) {
        navigator.vibrate(50)
      }

      setTimeout(() => {
        setCurrentVideoIndex((prev) => prev + 1)
        setIsTransitioning(false)
        setSwipeDirection(null)
        setSwipeProgress(0)
      }, 300)
    }
  }

  const goToPrevVideo = () => {
    if (currentVideoIndex > 0 && !isTransitioning) {
      setIsTransitioning(true)
      setSwipeDirection("down")

      // Add haptic feedback for mobile
      if (navigator.vibrate) {
        navigator.vibrate(50)
      }

      setTimeout(() => {
        setCurrentVideoIndex((prev) => prev - 1)
        setIsTransitioning(false)
        setSwipeDirection(null)
        setSwipeProgress(0)
      }, 300)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isTransitioning) return

    startY.current = e.touches[0].clientY
    currentY.current = e.touches[0].clientY
    isDragging.current = true
    setSwipeProgress(0)

    // Cancel any ongoing animations
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || isTransitioning) return

    currentY.current = e.touches[0].clientY
    const deltaY = startY.current - currentY.current
    const maxSwipe = 150
    const progress = Math.min(Math.abs(deltaY) / maxSwipe, 1)

    setSwipeProgress(progress)
    setSwipeDirection(deltaY > 0 ? "up" : "down")

    // Apply real-time transform with elastic resistance
    if (videoContainerRef.current) {
      const resistance = 1 - progress * 0.3 // Add resistance as user swipes further
      const translateY = deltaY * resistance * 0.5
      const scale = 1 - progress * 0.05 // Subtle scale effect
      const opacity = 1 - progress * 0.2

      videoContainerRef.current.style.transform = `translateY(${translateY}px) scale(${scale})`
      videoContainerRef.current.style.opacity = opacity.toString()
    }

    // Add visual feedback to container
    if (containerRef.current) {
      const glowIntensity = progress * 0.3
      const color = deltaY > 0 ? "34, 197, 94" : "59, 130, 246" // Green for up, blue for down
      containerRef.current.style.background = `radial-gradient(circle at center, rgba(${color}, ${glowIntensity}) 0%, rgba(0, 0, 0, 0.9) 70%)`
    }

    e.preventDefault()
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging.current || isTransitioning) return

    const endY = e.changedTouches[0].clientY
    const deltaY = startY.current - endY
    const velocity = Math.abs(deltaY) / 100 // Simple velocity calculation
    const threshold = velocity > 0.5 ? 30 : 80 // Lower threshold for fast swipes

    // Reset visual feedback with smooth transition
    if (containerRef.current) {
      containerRef.current.style.transition = "background 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      containerRef.current.style.background = ""
    }

    if (videoContainerRef.current) {
      videoContainerRef.current.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
    }

    if (Math.abs(deltaY) > threshold) {
      if (deltaY > 0) {
        goToNextVideo()
      } else {
        goToPrevVideo()
      }
    } else {
      // Spring back animation
      if (videoContainerRef.current) {
        videoContainerRef.current.style.transform = "translateY(0px) scale(1)"
        videoContainerRef.current.style.opacity = "1"
      }
      setSwipeProgress(0)
      setSwipeDirection(null)
    }

    // Clean up transitions after animation
    setTimeout(() => {
      if (videoContainerRef.current) {
        videoContainerRef.current.style.transition = ""
      }
      if (containerRef.current) {
        containerRef.current.style.transition = ""
      }
    }, 300)

    isDragging.current = false
  }

  if (loading || !currentVideo) {
    return (
      <div className="relative h-full w-full flex items-center justify-center bg-black">
        <div className="text-white text-lg animate-pulse">Loading videos...</div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full bg-black overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: "pan-y" }}
    >
      {/* Mobile Layout */}
      <div className="md:hidden relative h-full w-full flex items-center justify-center">
        <div
          ref={videoContainerRef}
          className={`relative w-full max-w-lg mx-auto h-full transition-all duration-300 ${
            isTransitioning ? "ease-out" : "ease-in-out"
          }`}
          style={{
            transform: isTransitioning
              ? `translateY(${swipeDirection === "up" ? "-100%" : "100%"}) scale(0.9)`
              : "translateY(0) scale(1)",
            opacity: isTransitioning ? 0 : 1,
          }}
        >
          <VideoCard video={currentVideo} isActive={true} />

          {/* Mobile Video Controls */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20">
            <VideoControls
              video={currentVideo}
              onLike={(liked) => handleVideoInteraction(currentVideo.id, "like", liked)}
              onSave={(saved) => handleVideoInteraction(currentVideo.id, "save", saved)}
              onShare={() => handleVideoInteraction(currentVideo.id, "share", true)}
            />
          </div>

          <div className="absolute bottom-4 left-4 right-16 z-20">
            <VideoInfo video={currentVideo} />
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex h-full w-full items-center justify-center gap-8">
        {/* Desktop Video Controls - Left Side */}
        <div className="flex flex-col justify-center">
          <VideoControls
            video={currentVideo}
            onLike={(liked) => handleVideoInteraction(currentVideo.id, "like", liked)}
            onSave={(saved) => handleVideoInteraction(currentVideo.id, "save", saved)}
            onShare={() => handleVideoInteraction(currentVideo.id, "share", true)}
          />
        </div>

        {/* Desktop Video Container */}
        <div
          className={`relative w-[28rem] lg:w-[32rem] xl:w-[36rem] h-full transition-all duration-300 ${
            isTransitioning ? "ease-out" : "ease-in-out"
          }`}
          style={{
            transform: isTransitioning
              ? `translateY(${swipeDirection === "up" ? "-100%" : "100%"}) scale(0.9)`
              : "translateY(0) scale(1)",
            opacity: isTransitioning ? 0 : 1,
          }}
        >
          <VideoCard video={currentVideo} isActive={true} />

          <div className="absolute bottom-4 left-4 right-4 z-20">
            <VideoInfo video={currentVideo} />
          </div>
        </div>
      </div>

      {/* Swipe Progress Indicator */}
      {swipeProgress > 0.1 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <div
            className={`flex flex-col items-center transition-all duration-200 ${
              swipeDirection === "up" ? "animate-bounce" : ""
            }`}
            style={{
              opacity: swipeProgress,
              transform: `scale(${0.8 + swipeProgress * 0.4})`,
            }}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                swipeDirection === "up" ? "bg-green-500" : "bg-blue-500"
              } shadow-lg`}
            >
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
                style={{
                  transform: swipeDirection === "up" ? "rotate(0deg)" : "rotate(180deg)",
                }}
              >
                <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
              </svg>
            </div>
            <div className="text-white text-sm mt-2 font-medium">{swipeDirection === "up" ? "Next" : "Previous"}</div>
          </div>
        </div>
      )}

      {/* Green Navigation Arrows - Desktop Only */}
      <div className="absolute right-6 top-1/2 transform -translate-y-1/2 hidden md:flex flex-col gap-4 z-20">
        {/* Up Arrow - Previous Video */}
        <button
          onClick={() => !isTransitioning && goToPrevVideo()}
          disabled={currentVideoIndex === 0 || isTransitioning}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
            currentVideoIndex === 0 || isTransitioning
              ? 'bg-gray-500/30 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-400 hover:scale-110 shadow-lg hover:shadow-xl'
          }`}
        >
          <svg 
            className={`w-6 h-6 ${currentVideoIndex === 0 || isTransitioning ? 'text-gray-400' : 'text-white'}`} 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
          </svg>
        </button>

        {/* Down Arrow - Next Video */}
        <button
          onClick={() => !isTransitioning && goToNextVideo()}
          disabled={currentVideoIndex === videos.length - 1 || isTransitioning}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
            currentVideoIndex === videos.length - 1 || isTransitioning
              ? 'bg-gray-500/30 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-400 hover:scale-110 shadow-lg hover:shadow-xl'
          }`}
        >
          <svg 
            className={`w-6 h-6 ${currentVideoIndex === videos.length - 1 || isTransitioning ? 'text-gray-400' : 'text-white'}`} 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/>
          </svg>
        </button>
      </div>

      {/* Mobile Dot Indicator */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 md:hidden z-20">
        <div className="flex gap-1">
          {videos.map((_, index) => (
            <div
              key={index}
              className={`w-6 h-1 rounded-full transition-all duration-300 ${
                index === currentVideoIndex ? "bg-white" : "bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
