"use client"

export const dynamic = 'force-dynamic'

// Lazy import to avoid creating Supabase client during module initialization
let supabaseInstance: any = null;
const getSupabaseClient = async () => {
  if (!supabaseInstance) {
    const { createClient } = await import("@/utils/supabase/client");
    supabaseInstance = createClient();
  }
  return supabaseInstance;
};
import { createUnifiedEvent, createUserLitterReport, joinUnifiedEvent } from "@/utils/supabase/functions"
import { AlertTriangle, ArrowLeft, Calendar, CheckCircle, MapPin, Recycle, Trash2, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { Input } from "../community-cleanup/components/ui/input"
import { Modal, ModalContent, ModalHeader } from "../community-cleanup/components/ui/modal"
import { Button } from "../litterLens/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "../litterLens/components/ui/Card"
import { Badge } from "../litterLens/components/ui/badge"
import { Separator } from "../litterLens/components/ui/separator"

interface AnalysisData {
  litterType: string
  confidence: number
  quantity: string
  recyclable: boolean
  hazardLevel: string
  recommendations: string[]
  environmentalImpact: {
    decompositionTime: string
    carbonFootprint: string
    wildlifeRisk: string
  }
}

const getSupabaseToken = async () => {
  const supabase = await getSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession()

  console.log(session)
  return session?.access_token
}

export default function AnalyzePage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageName, setImageName] = useState<string>("")
  const [isAnalyzing, setIsAnalyzing] = useState(true)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const hasProcessedRef = useRef(false)
  
  // Cleanup modal states
  const [isCleanupModalOpen, setIsCleanupModalOpen] = useState(false)
  const [cleanupLocation, setCleanupLocation] = useState({ name: "", address: "", lat: "", lng: "" })
  const [trashName, setTrashName] = useState("")
  const [participantsNeeded, setParticipantsNeeded] = useState("")
  const [showOnMap, setShowOnMap] = useState(true)
  const [isSubmittingCleanup, setIsSubmittingCleanup] = useState(false)
  
  // Geocoding states
  const [isGeocodingAddress, setIsGeocodingAddress] = useState(false)
  const [geocodingError, setGeocodingError] = useState<string | null>(null)
  
  const router = useRouter()

  // Function to call the classify-trash API
  const classifyTrash = async (imageFile: string, fileName: string) => {
    try {
      const token = await getSupabaseToken()
      console.log(token)
      
      // Get user session to extract user_id
      const supabase = await getSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession()
      const userId = session?.user?.id

      const headers: Record<string, string> = {
        
      };

      // Only add Authorization header if token exists
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      // Convert base64 to blob for form data
      const response = await fetch(imageFile)
      const blob = await response.blob()
      
      const formData = new FormData()
      formData.append('file', blob, fileName)

      const apiResponse = await fetch('http://localhost:8000/classify-trash', {
        headers, 
        method: 'POST',
        body: formData,
      })

      if (!apiResponse.ok) {
        throw new Error('Failed to classify trash')
      }

      const result = await apiResponse.json()
      setAnalysisData(result)
      
      // Save the analysis result to the database
      if (userId && result) {
        try {
          const reportData = {
            user_id: userId,
            litter_type: result.litterType,
            confidence: result.confidence,
            quantity: parseFloat(result.quantity.match(/\d+\.?\d*/)?.[0] || '1'),
            recyclable: result.recyclable,
            hazard_level: result.hazardLevel,
            recommendations: result.recommendations,
            environmental_impact: result.environmentalImpact
          };

          const { data: savedReport, error: saveError } = await createUserLitterReport(reportData);
          
          if (saveError) {
            console.error('Error saving litter report:', saveError);
          } else {
            console.log('Litter report saved successfully:', savedReport);
          
          }
        } catch (saveErr) {
          console.error('Error in saving process:', saveErr);
        }
      }
      
      setIsAnalyzing(false)
      setAnalysisComplete(true)
    } catch (err) {
      console.error('Error classifying trash:', err)
      setError('Failed to analyze image. Please try again.')
      setIsAnalyzing(false)
    }
  }

  // Geocoding function to convert address to coordinates (from community cleanup)
  const geocodeAddress = async (address: string): Promise<{lat: number, lng: number} | null> => {
    if (!address.trim()) return null

    setIsGeocodingAddress(true)
    setGeocodingError(null)

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&addressdetails=1`
      )
      
      if (!response.ok) {
        throw new Error('Geocoding request failed')
      }

      const data = await response.json()
      
      if (data.length === 0) {
        setGeocodingError('Address not found. Please check the address and try again.')
        return null
      }

      const result = data[0]
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon)
      }
    } catch (error) {
      console.error('Geocoding error:', error)
      setGeocodingError('Failed to geocode address. Please enter coordinates manually.')
      return null
    } finally {
      setIsGeocodingAddress(false)
    }
  }

  // Function to handle address change and auto-geocode
  const handleAddressChange = async (address: string) => {
    setCleanupLocation(prev => ({ ...prev, address }))
    setGeocodingError(null) // Clear any previous errors
    
    // Auto-geocode only if address is substantial (more than 35 characters) and looks complete
    if (address.trim().length > 35 && (address.includes(',') || address.match(/\d+.*[a-zA-Z].*\d/))) {
      const coordinates = await geocodeAddress(address)
      if (coordinates) {
        setCleanupLocation(prev => ({
          ...prev,
          lat: coordinates.lat.toString(),
          lng: coordinates.lng.toString()
        }))
      }
    }
  }

  // Function to handle cleanup submission
  const handleCleanupSubmission = async () => {
    if (!cleanupLocation.name || !cleanupLocation.address) {
      alert('Please fill in all location details')
      return
    }

    if (!analysisData) {
      alert('No analysis data available')
      return
    }

    setIsSubmittingCleanup(true)
    
    try {
      const supabase = await getSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession()
      const userId = session?.user?.id

      if (!userId) {
        alert('Please sign in to report cleanup')
        return
      }

      if (showOnMap) {
        // Geocode the address if coordinates are not provided
        let lat = parseFloat(cleanupLocation.lat)
        let lng = parseFloat(cleanupLocation.lng)
        
        if (!lat || !lng) {
          const coordinates = await geocodeAddress(cleanupLocation.address)
          if (!coordinates) {
            alert('Could not find coordinates for the address. Please try a different address.')
            return
          }
          lat = coordinates.lat
          lng = coordinates.lng
        }

        // Create a cleanup event using the same structure as community cleanup
        const now = new Date()
        const localDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const eventData = {
          title: trashName || `Cleaned up ${analysisData.litterType}`,
          description: `Cleaned up ${analysisData.quantity} of ${analysisData.litterType}. ${analysisData.recommendations.join(' ')}`,
          date: localDate.toISOString().split('T')[0],
          time: now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
          location: cleanupLocation.name,
          category: 'cleanup' as const,
          max_participants: parseInt(participantsNeeded) || 1,
          user_id: userId,
          duration: '1 hour',
          location_name: cleanupLocation.name,
          location_address: cleanupLocation.address,
          lat,
          lng,
          organizer: 'Self-reported cleanup',
          status: 'completed' as const,
          equipment_provided: [],
          requirements: [],
          expected_trash_collection: parseFloat(analysisData.quantity.match(/\d+\.?\d*/)?.[0] || '1'),
          carbon_offset: analysisData.environmentalImpact.carbonFootprint || '1 kg CO2',
          is_litter_analysis_report: true
        }

        console.log('Creating cleanup event with data:', eventData)

        // Create the event in the database
        const { data: createdEvent, error } = await createUnifiedEvent(eventData)
        
        if (error) {
          console.error('Error creating cleanup event:', error)
          alert(`Failed to create cleanup event: ${error.message || error}`)
          return
        }

        console.log('Cleanup event created successfully:', createdEvent)
        
        // Automatically join the user to the cleanup event they created
        if (createdEvent && createdEvent.id) {
          try {
            const joinResult = await joinUnifiedEvent(createdEvent.id, userId)
            if (joinResult.success) {
              console.log('User automatically joined their cleanup event:', joinResult)
              alert('Cleanup report submitted successfully! You have been automatically joined to this cleanup event. It will appear as a red dot on the Community Cleanup map.')
            } else {
              console.warn('Failed to auto-join user to cleanup event:', joinResult.message)
              alert('Cleanup report submitted successfully! It will appear as a red dot on the Community Cleanup map. Note: You may need to manually join the event if you want to participate.')
            }
          } catch (joinError) {
            console.error('Error auto-joining user to cleanup event:', joinError)
            alert('Cleanup report submitted successfully! It will appear as a red dot on the Community Cleanup map. Note: You may need to manually join the event if you want to participate.')
          }
        } else {
          alert('Cleanup report submitted successfully! It will appear as a red dot on the Community Cleanup map.')
        }
      } else {
        alert('Cleanup marked as completed! No map entry was created since you chose not to show it on the map.')
      }
      
      setIsCleanupModalOpen(false)
      
      // Reset form
      setCleanupLocation({ name: "", address: "", lat: "", lng: "" })
      setTrashName("")
      setParticipantsNeeded("")
      setShowOnMap(true)
      
    } catch (error) {
      console.error('Error submitting cleanup report:', error)
      alert('Failed to submit cleanup report')
    } finally {
      setIsSubmittingCleanup(false)
    }
  }

  useEffect(() => {
    // Get image from sessionStorage
    const storedImage = sessionStorage.getItem("litterImage")
    const storedName = sessionStorage.getItem("litterImageName")

    if (storedImage && !hasProcessedRef.current) {
      setImageUrl(storedImage)
      const fileName = storedName || "uploaded-image.jpg"
      setImageName(fileName)
      hasProcessedRef.current = true

      // Call the API to classify the trash
      classifyTrash(storedImage, fileName)
    } else if (!storedImage && !hasProcessedRef.current) {
      // Redirect back if no image
      router.push("/")
    }
  }, [router])

  // Use analysisData if available, otherwise show loading or error
  const displayData = analysisData || {
    litterType: "Unknown",
    confidence: 0,
    quantity: "Unknown",
    recyclable: false,
    hazardLevel: "Unknown",
    recommendations: [],
    environmentalImpact: {
      decompositionTime: "Unknown",
      carbonFootprint: "Unknown",
      wildlifeRisk: "Unknown"
    }
  }

  if (!imageUrl) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No image found for analysis</p>
          <Button onClick={() => router.push("/")}>Return Home</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/litterLens")} className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Litter Lens</span>
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <h1 className="text-xl font-semibold text-gray-900">AI Analysis Results</h1>
          </div>
          <div className="flex items-center space-x-2">
            {analysisComplete && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                Analysis Complete
              </Badge>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-black">
                  <span>Uploaded Image</span>
                  <Badge variant="outline">{imageName}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt="Litter analysis"
                  className="w-full rounded-lg shadow-sm"
                />
                <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>Location detected</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            {analysisComplete && (
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => setIsCleanupModalOpen(true)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Cleaned Up
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Report to Authorities
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Analysis */}
          <div className="space-y-6">
            {isAnalyzing ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="animate-spin w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <h3 className="text-lg text-black font-semibold mb-2">Analyzing Image...</h3>
                  <p className="text-gray-600">
                    Our AI is identifying the litter type and generating disposal recommendations.
                  </p>
                </CardContent>
              </Card>
            ) : error ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-red-500 mb-4">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-2" />
                    <h3 className="text-lg font-semibold mb-2">Analysis Failed</h3>
                    <p className="text-gray-600">{error}</p>
                  </div>
                  <Button onClick={() => window.location.reload()} className="mt-4">
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Analysis Results */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Trash2 className="w-5 h-5 text-green-600" />
                      <span className="text-black">Litter Identification</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-black">Type:</span>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">{analysisData?.litterType}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-black">Confidence:</span>
                      <span className="text-green-600 font-semibold">{analysisData?.confidence}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-black">Quantity:</span>
                      <span className="text-green-600">{analysisData?.quantity}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-black">Recyclable:</span>
                      <Badge
                        className={
                          displayData.recyclable
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-red-100 text-red-800 border-red-200"
                        }
                      >
                        <Recycle className="w-3 h-3 mr-1" />
                        {displayData.recyclable ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-black">Hazard Level:</span>
                      <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {displayData.hazardLevel}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Disposal Plan */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-black">Disposal Plan</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {displayData.recommendations.map((recommendation: string, index: number) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                            {index + 1}
                          </div>
                          <p className="text-gray-700">{recommendation}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Environmental Impact */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <span>🌍</span>
                      <span className="text-black">Environmental Impact</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-700">Decomposition Time:</span>
                      <p className="text-red-600 font-semibold">
                        {displayData.environmentalImpact.decompositionTime}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Carbon Footprint:</span>
                      <p className="text-gray-900">{displayData.environmentalImpact.carbonFootprint}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Wildlife Risk:</span>
                      <p className="text-orange-600">{displayData.environmentalImpact.wildlifeRisk}</p>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Cleanup Modal */}
      {isCleanupModalOpen && (
        <Modal isOpen={isCleanupModalOpen} onClose={() => setIsCleanupModalOpen(false)}>
          <ModalContent className="max-w-md mx-auto">
            <ModalHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Mark as Cleaned Up</h2>
                <button
                  onClick={() => setIsCleanupModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </ModalHeader>
            
            <div className="p-6 space-y-4">
              {/* Trash Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name of Trash
                </label>
                <Input
                  type="text"
                  value={trashName}
                  onChange={(e) => setTrashName(e.target.value)}
                  placeholder="e.g., Plastic bottle, Food wrapper"
                  className="w-full"
                />
              </div>

              {/* Location Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location Name
                </label>
                <Input
                  type="text"
                  value={cleanupLocation.name}
                  onChange={(e) => setCleanupLocation(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Central Park, Main Street"
                  className="w-full"
                />
              </div>

              {/* Location Address with Auto-Geocoding */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location Address
                </label>
                <Input
                  type="text"
                  value={cleanupLocation.address}
                  onChange={(e) => handleAddressChange(e.target.value)}
                  placeholder="e.g., 123 Main St, City, State 12345"
                  className="w-full"
                />
                {isGeocodingAddress && (
                  <p className="text-xs text-blue-600 mt-1">📍 Finding coordinates...</p>
                )}
                {geocodingError && (
                  <p className="text-xs text-red-600 mt-1">❌ {geocodingError}</p>
                )}
                {cleanupLocation.lat && cleanupLocation.lng && (
                  <p className="text-xs text-green-600 mt-1">
                    ✅ Coordinates found: {parseFloat(cleanupLocation.lat).toFixed(4)}, {parseFloat(cleanupLocation.lng).toFixed(4)}
                  </p>
                )}
              </div>

              {/* Participants Needed */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Participants Needed
                </label>
                <Input
                  type="number"
                  value={participantsNeeded}
                  onChange={(e) => setParticipantsNeeded(e.target.value)}
                  placeholder="e.g., 5"
                  className="w-full"
                  min="1"
                />
              </div>

              {/* Show on Map Toggle */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Show on Community Cleanup Map
                </label>
                <button
                  onClick={() => setShowOnMap(!showOnMap)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    showOnMap ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    showOnMap ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              {showOnMap && (
                <p className="text-xs text-gray-500">
                  🔴 This cleanup will appear as a red dot on the community cleanup map
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsCleanupModalOpen(false)}
                  className="flex-1"
                  disabled={isSubmittingCleanup}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCleanupSubmission}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  disabled={isSubmittingCleanup}
                >
                  {isSubmittingCleanup ? 'Submitting...' : 'Submit Cleanup'}
                </Button>
              </div>
            </div>
          </ModalContent>
        </Modal>
      )}
    </div>
  )
}