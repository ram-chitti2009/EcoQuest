"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, MapPin, Calendar, Trash2, Recycle, AlertTriangle, CheckCircle } from "lucide-react"
import { Button } from "../litterLens/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "../litterLens/components/ui/Card"
import { Badge } from "../litterLens/components/ui/badge"
import { Separator } from "../litterLens/components/ui/separator"
import { useRouter } from "next/navigation"

export default function AnalyzePage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageName, setImageName] = useState<string>("")
  const [isAnalyzing, setIsAnalyzing] = useState(true)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Get image from sessionStorage
    const storedImage = sessionStorage.getItem("litterImage")
    const storedName = sessionStorage.getItem("litterImageName")

    if (storedImage) {
      setImageUrl(storedImage)
      setImageName(storedName || "uploaded-image.jpg")

      // Simulate AI analysis delay
      setTimeout(() => {
        setIsAnalyzing(false)
        setAnalysisComplete(true)
      }, 3000)
    } else {
      // Redirect back if no image
      router.push("/")
    }
  }, [router])

  const mockAnalysisData = {
    litterType: "Plastic Bottle",
    confidence: 94,
    quantity: "1 item",
    recyclable: true,
    hazardLevel: "Low",
    location: "Detected via GPS",
    recommendations: [
      "Remove the plastic bottle and place it in a recycling bin",
      "Check for recycling symbol (usually #1 PET) on the bottom",
      "Rinse the bottle if it contained sugary drinks before recycling",
      "Consider reporting this location as a frequent littering spot",
    ],
    environmentalImpact: {
      decompositionTime: "450 years",
      carbonFootprint: "82g CO2 equivalent",
      wildlifeRisk: "Medium - can harm marine life if reaches waterways",
    },
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
                <CardTitle className="flex items-center space-x-2">
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
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Cleaned Up
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <MapPin className="w-4 h-4 mr-2" />
                    Add to Cleanup Map
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
                  <h3 className="text-lg font-semibold mb-2">Analyzing Image...</h3>
                  <p className="text-gray-600">
                    Our AI is identifying the litter type and generating disposal recommendations.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Analysis Results */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Trash2 className="w-5 h-5 text-green-600" />
                      <span>Litter Identification</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Type:</span>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">{mockAnalysisData.litterType}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Confidence:</span>
                      <span className="text-green-600 font-semibold">{mockAnalysisData.confidence}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Quantity:</span>
                      <span>{mockAnalysisData.quantity}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Recyclable:</span>
                      <Badge
                        className={
                          mockAnalysisData.recyclable
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-red-100 text-red-800 border-red-200"
                        }
                      >
                        <Recycle className="w-3 h-3 mr-1" />
                        {mockAnalysisData.recyclable ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Hazard Level:</span>
                      <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {mockAnalysisData.hazardLevel}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Disposal Plan */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>Disposal Plan</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockAnalysisData.recommendations.map((recommendation, index) => (
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
                      <span>Environmental Impact</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-700">Decomposition Time:</span>
                      <p className="text-red-600 font-semibold">
                        {mockAnalysisData.environmentalImpact.decompositionTime}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Carbon Footprint:</span>
                      <p className="text-gray-900">{mockAnalysisData.environmentalImpact.carbonFootprint}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Wildlife Risk:</span>
                      <p className="text-orange-600">{mockAnalysisData.environmentalImpact.wildlifeRisk}</p>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

