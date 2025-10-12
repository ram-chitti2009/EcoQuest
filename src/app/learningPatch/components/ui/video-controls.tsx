"use client"

import { Bookmark, Check, Copy, ExternalLink, MoreHorizontal, Share } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface Video {
  id: string
  title: string
  description: string
  creator: string
  creatorAvatar: string
  videoUrl: string
  shares: number
  isSaved: boolean
}

interface VideoControlsProps {
  video: Video
  onSave: (saved: boolean) => void
  onShare?: (shared: boolean) => void
}

export function VideoControls({ video, onSave, onShare }: VideoControlsProps) {
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [shareAnimating, setShareAnimating] = useState(false)
  const shareMenuRef = useRef<HTMLDivElement>(null)

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false)
        setCopySuccess(false)
      }
    }

    if (showShareMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showShareMenu])

  const handleSave = () => {
    onSave(!video.isSaved)
  }

  const handleShare = () => {
    setShowShareMenu(!showShareMenu)
  }

  const handleCopyLink = async () => {
    try {
      // Extract original YouTube URL from embed URL
      const embedUrl = video.videoUrl
      const videoIdMatch = embedUrl.match(/\/embed\/([^?]+)/)
      const videoId = videoIdMatch ? videoIdMatch[1] : ''
      
      // Create shareable YouTube URL
      const shareUrl = `https://www.youtube.com/watch?v=${videoId}`
      
      await navigator.clipboard.writeText(shareUrl)
      setCopySuccess(true)
      setShareAnimating(true)
      onShare?.(true) // Update share count
      
      // Hide success message after 2 seconds
      setTimeout(() => {
        setCopySuccess(false)
        setShowShareMenu(false)
        setShareAnimating(false)
      }, 2000)
    } catch (error) {
      console.error('Failed to copy link:', error)
      // Fallback for browsers that don't support clipboard API
      const shareUrl = `https://www.youtube.com/watch?v=${video.id}`
      const textArea = document.createElement('textarea')
      textArea.value = shareUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopySuccess(true)
      setShareAnimating(true)
      onShare?.(true)
      
      setTimeout(() => {
        setCopySuccess(false)
        setShowShareMenu(false)
        setShareAnimating(false)
      }, 2000)
    }
  }

  const handleNativeShare = async () => {
    try {
      // Extract original YouTube URL from embed URL
      const embedUrl = video.videoUrl
      const videoIdMatch = embedUrl.match(/\/embed\/([^?]+)/)
      const videoId = videoIdMatch ? videoIdMatch[1] : ''
      const shareUrl = `https://www.youtube.com/watch?v=${videoId}`

      if (navigator.share) {
        await navigator.share({
          title: video.title,
          text: `Check out this video: ${video.title} by ${video.creator}`,
          url: shareUrl,
        })
        setShareAnimating(true)
        onShare?.(true) // Update share count
        setShowShareMenu(false)
        
        setTimeout(() => {
          setShareAnimating(false)
        }, 1000)
      } else {
        // Fallback: open in new tab or copy link
        window.open(`mailto:?subject=${encodeURIComponent(video.title)}&body=${encodeURIComponent(`Check out this video: ${shareUrl}`)}`, '_blank')
        setShareAnimating(true)
        onShare?.(true)
        setShowShareMenu(false)
        
        setTimeout(() => {
          setShareAnimating(false)
        }, 1000)
      }
    } catch (error) {
      console.error('Failed to share:', error)
      // If native sharing fails, just copy the link
      handleCopyLink()
    }
  }

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Share button */}
      <div className="flex flex-col items-center gap-1 relative">
        <button
          onClick={handleShare}
          className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-colors"
        >
          <Share className="w-6 h-6" />
        </button>
        
        {/* Share menu */}
        {showShareMenu && (
          <div 
            ref={shareMenuRef}
            className="absolute right-14 top-0 bg-black/80 backdrop-blur-sm rounded-lg p-2 min-w-40 z-50"
          >
            {copySuccess ? (
              <div className="flex items-center px-3 py-2 text-green-400 text-sm">
                <Check className="w-4 h-4 mr-2" />
                Link copied!
              </div>
            ) : (
              <>
                <button 
                  onClick={handleCopyLink}
                  className="w-full text-left px-3 py-2 text-white text-sm hover:bg-white/10 rounded flex items-center transition-colors"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy link
                </button>
                <button 
                  onClick={handleNativeShare}
                  className="w-full text-left px-3 py-2 text-white text-sm hover:bg-white/10 rounded flex items-center transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Share to...
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Save button */}
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={handleSave}
          className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm transition-all ${
            video.isSaved ? "bg-yellow-500/20 text-yellow-500" : "bg-black/30 text-white hover:bg-black/50"
          }`}
        >
          <Bookmark className={`w-6 h-6 ${video.isSaved ? "fill-current" : ""}`} />
        </button>
        <span className="text-white text-xs font-medium">Save</span>
      </div>

      {/* More options */}
      <div className="flex flex-col items-center gap-1">
        <button className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-colors">
          <MoreHorizontal className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}