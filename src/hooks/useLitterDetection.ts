"use client"

import { useEffect, useState, type RefObject } from "react"
import * as cocoSsd from "@tensorflow-models/coco-ssd"
import "@tensorflow/tfjs"

interface Detection {
  label: string
  confidence: number
  box: { x: number; y: number; width: number; height: number }
}

const LITTER_CATEGORIES = [
  "bottle",
  "cup",
  "bowl",
  "banana",
  "apple",
  "sandwich",
  "orange",
  "broccoli",
  "carrot",
  "hot dog",
  "pizza",
  "donut",
  "cake",
]

export function useLitterDetection(videoRef: RefObject<HTMLVideoElement>, canvasRef: RefObject<HTMLCanvasElement>) {
  const [detections, setDetections] = useState<Detection[]>([])
  const [isModelLoaded, setIsModelLoaded] = useState(false)

  useEffect(() => {
    let model: cocoSsd.ObjectDetection | null = null
    let animationFrameId: number

    async function loadModel() {
      try {
        console.log("[v0] Loading COCO-SSD model...")
        model = await cocoSsd.load()
        setIsModelLoaded(true)
        console.log("[v0] Model loaded successfully")
        detectFrame()
      } catch (error) {
        console.error("[v0] Error loading model:", error)
      }
    }

    async function detectFrame() {
      if (!model || !videoRef.current || !canvasRef.current) {
        animationFrameId = requestAnimationFrame(detectFrame)
        return
      }

      const video = videoRef.current
      const canvas = canvasRef.current

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        const predictions = await model.detect(video)

        // Filter for litter-related objects
        const litterPredictions = predictions.filter(
          (pred) => LITTER_CATEGORIES.includes(pred.class) && pred.score > 0.5,
        )

        // Convert to percentage-based coordinates
        const videoWidth = video.videoWidth
        const videoHeight = video.videoHeight

        const detectionData: Detection[] = litterPredictions.map((pred) => ({
          label: formatLabel(pred.class),
          confidence: pred.score,
          box: {
            x: (pred.bbox[0] / videoWidth) * 100,
            y: (pred.bbox[1] / videoHeight) * 100,
            width: (pred.bbox[2] / videoWidth) * 100,
            height: (pred.bbox[3] / videoHeight) * 100,
          },
        }))

        setDetections(detectionData)
      }

      animationFrameId = requestAnimationFrame(detectFrame)
    }

    loadModel()

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [videoRef, canvasRef])

  return { detections, isModelLoaded }
}

function formatLabel(label: string): string {
  return label
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
