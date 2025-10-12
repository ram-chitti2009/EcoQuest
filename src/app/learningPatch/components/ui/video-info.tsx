"use client"

import { Plus } from "lucide-react"
import Image from "next/image"

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

interface VideoInfoProps {
  video: Video
}

export function VideoInfo({ video }: VideoInfoProps) {
  return (
    <div className="absolute bottom-4 left-4 right-20 z-10">
      {/* Creator info */}
      <div className="flex items-center gap-3 mb-3">
        <div className="relative">
          <Image
            src={video.creatorAvatar || "/placeholder.svg"}
            alt={video.creator}
            width={40}
            height={40}
            className="rounded-full border-2 border-white"
          />
        </div>
        <div className="flex-1">
          <p className="text-white font-semibold text-sm">{video.creator}</p>
        </div>
        <button className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
          <Plus className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Video description */}
      <div className="space-y-2">
        <p className="text-white text-sm font-medium leading-tight">{video.title}</p>
        <p className="text-white/90 text-sm leading-relaxed">{video.description}</p>
      </div>

      {/* Hashtags and topics */}
      <div className="flex flex-wrap gap-2 mt-2">
        <span className="text-white/80 text-sm">#EcoLearning</span>
        <span className="text-white/80 text-sm">#Sustainability</span>
        <span className="text-white/80 text-sm">#GreenTech</span>
      </div>
    </div>
  )
}
