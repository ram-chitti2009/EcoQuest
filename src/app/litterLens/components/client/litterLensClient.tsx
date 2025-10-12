"use client"

import Header from "@/app/components/Header"
import { createClient } from "@/utils/supabase/client"
import { getUserLitterSummaries, getUserProfileByUserId, UserLitterSummary } from "@/utils/supabase/functions"
import { BarChart3, Camera, Leaf, MapPin, Target, Upload, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Button } from "../ui/Button"
import { Card, CardContent } from "../ui/Card"

export default function LitterLensHome() {
  const supabase = createClient();

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [litterSummary, setLitterSummary] = useState<UserLitterSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<{ name: string }>({ name: "User" })
  const [autoAnalyzeAfterCapture, setAutoAnalyzeAfterCapture] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()

  // Fetch user profile and litter summary data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user?.id;
        
        if (userId) {
          // Fetch user profile
          const profileResult = await getUserProfileByUserId(userId);
          if (profileResult.data) {
            setUserProfile({ name: profileResult.data.name || "User" });
          }

          // Fetch litter summary
          const { data, error } = await getUserLitterSummaries(userId);
          if (error) {
            console.error("Error fetching user litter summary:", error);
            // Set default values on error
            setLitterSummary({
              user_id: userId,
              total_items: 0,
              average_accuracy: 0,
              last_updated: null
            });
          } else {
            setLitterSummary((Array.isArray(data) ? data[0] : data) || {
              user_id: userId,
              total_items: 0,
              average_accuracy: 0,
              last_updated: null
            });
          }
        } else {
          // User not logged in, set default values
          setUserProfile({ name: "User" });
          setLitterSummary({
            user_id: "",
            total_items: 0,
            average_accuracy: 0,
            last_updated: null
          });
        }
      } catch (error) {
        console.error("Error in fetchData:", error);
        setUserProfile({ name: "User" });
        setLitterSummary({
          user_id: "",
          total_items: 0,
          average_accuracy: 0,
          last_updated: null
        });
      } finally {
        setIsLoading(false)
      }
    };
    fetchData();
  }, [])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const startNewReport = async () => {
    setAutoAnalyzeAfterCapture(true)
    await startCamera()
  }

  const startCamera = async () => {
    try {
      console.log("Starting camera...")
      setIsCapturing(true)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Use back camera on mobile
      })
      console.log("Camera stream obtained:", stream)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        console.log("Video is playing")
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      setIsCapturing(false)
      alert("Camera access denied or not available. Please allow camera permissions.")
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext("2d")

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      if (context) {
        context.drawImage(video, 0, 0)
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const file = new File([blob], "captured-photo.jpg", { type: "image/jpeg" })
              setSelectedFile(file)
              const url = URL.createObjectURL(file)
              setPreviewUrl(url)
              stopCamera()

              // If this came from "Start New Report", automatically proceed to analysis
              if (autoAnalyzeAfterCapture) {
                setAutoAnalyzeAfterCapture(false)
                // Store the file and navigate to analysis
                const reader = new FileReader()
                reader.onload = () => {
                  sessionStorage.setItem("litterImage", reader.result as string)
                  sessionStorage.setItem("litterImageName", file.name)
                  router.push("/litterAnalysis")
                }
                reader.readAsDataURL(file)
              }
            }
          },
          "image/jpeg",
          0.9,
        )
      }
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    setIsCapturing(false)
  }

  const handleAnalyze = () => {
    if (selectedFile) {
      // Store the file in sessionStorage for the analysis page
      const reader = new FileReader()
      reader.onload = () => {
        sessionStorage.setItem("litterImage", reader.result as string)
        sessionStorage.setItem("litterImageName", selectedFile.name)
        router.push("/litterAnalysis")
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Header */}
      <Header title="Litter Lens" centerMessage="🌍 Help clean our environment 🧹" />
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Title Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {userProfile.name}&apos;s <span className="text-green-600">Litter Lens</span>
          </h2>
          <p className="text-gray-600">
            Identify and report litter through AI-powered image recognition. Help build a cleaner environment.
          </p>
        </div>

        {/* Camera View - Full Width When Active */}
        {isCapturing && (
          <div className="mb-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 text-center">
                  📸 Position your camera to capture litter
                </h3>
                <div className="max-w-2xl mx-auto">
                  <div className="space-y-4">
                    <div className="relative bg-black rounded-lg overflow-hidden">
                      <video
                        ref={videoRef}
                        className="w-full h-96 object-cover rounded-lg"
                        autoPlay
                        playsInline
                        muted
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={capturePhoto} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                        📸 Capture Photo
                      </Button>
                      <Button onClick={stopCamera} variant="outline" className="flex-1 bg-transparent">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 ${isCapturing ? "hidden" : ""}`}>
          {/* Left Column - Main Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card
                className="bg-green-600 text-white border-0 hover:bg-green-700 transition-colors cursor-pointer"
                onClick={startNewReport}
                role="button"
                tabIndex={0}
              >
                <CardContent className="p-8 text-center">
                  <Camera className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Start New Report</h3>
                  <p className="text-green-100">Capture or upload litter photos for AI analysis</p>
                </CardContent>
              </Card>

              <Card
                className="bg-white border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => router.push("/community-cleanup")}
                role="button"
                tabIndex={0}
              >
                <CardContent className="p-8 text-center">
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">View Cleanup Map</h3>
                  <p className="text-gray-600">See all reported litter locations and cleanup progress</p>
                </CardContent>
              </Card>
            </div>

            {/* Impact Metrics */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-6 text-gray-900">Environmental Impact</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { 
                      label: "Items Reported", 
                      value: isLoading ? "..." : (litterSummary?.total_items?.toString() || "0"), 
                      icon: Target 
                    },
                    { 
                      label: "Accuracy Rate", 
                      value: isLoading ? "..." : `${Math.round(litterSummary?.average_accuracy || 0)}%`, 
                      icon: BarChart3 
                    },
                    { label: "Community Reports", value: "0", icon: Users },
                    { label: "Areas Cleaned", value: "0", icon: Leaf },
                  ].map((metric, index) => (
                    <div key={index} className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                        <metric.icon className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
                      <div className="text-sm text-gray-500">{metric.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Progress Chart Placeholder */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Cleanup Progress Over Time</h3>
                <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">
                    {isLoading 
                      ? "Loading progress data..." 
                      : "Chart will show cleanup progress as you make reports"
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Photo Upload */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Upload Photo</h3>

                {!isCapturing && !previewUrl && (
                  <div className="space-y-4">
                    {/* Upload Area */}
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600 mb-2">Upload photo or drag here</p>
                      <p className="text-sm text-gray-400">JPG, PNG up to 10MB</p>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />

                    {/* Camera Button */}
                    <Button onClick={startCamera} className="w-full bg-green-600 hover:bg-green-700 text-white">
                      <Camera className="w-4 h-4 mr-2" />
                      Take Photo
                    </Button>
                  </div>
                )}

                {/* Camera View */}
                {isCapturing && (
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <Camera className="w-8 h-8 mx-auto mb-2 text-green-600" />
                      <p className="text-sm text-green-700">Camera is active above</p>
                    </div>
                  </div>
                )}

                {/* Preview */}
                {previewUrl && (
                  <div className="space-y-4">
                    <img src={previewUrl || "/placeholder.svg"} alt="Selected litter" className="w-full rounded-lg" />
                    <div className="flex space-x-2">
                      <Button onClick={handleAnalyze} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                        Analyze Photo
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedFile(null)
                          setPreviewUrl(null)
                          if (fileInputRef.current) {
                            fileInputRef.current.value = ""
                          }
                        }}
                        variant="outline"
                        className="flex-1"
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                )}

                <canvas ref={canvasRef} className="hidden" />
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">🌱 EcoQuest Insights</h3>
                <p className="text-sm text-gray-600">
                  Start reporting litter to see personalized insights about your environmental impact and community
                  cleanup progress.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}