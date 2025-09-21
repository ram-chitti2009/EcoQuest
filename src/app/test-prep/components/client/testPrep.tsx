"use client"

import { useState } from "react"
import Image from "next/image"
import { Header } from "../layout/Header"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Label } from "../ui/label"
import { Upload, ExternalLink, Calendar, Settings, Plus, Trash2 } from "lucide-react"

type TestType = "SAT" | "ACT" | "AP Tests"

interface SATScore {
  id: string
  date: string
  reading: number
  math: number
  total: number
}

interface ACTScore {
  id: string
  date: string
  english: number
  math: number
  reading: number
  science: number
  composite: number
}

interface APScore {
  id: string
  subject: string
  score: number
  date: string
}

export default function TestPrepDashboard() {
  const [selectedTest, setSelectedTest] = useState<TestType>("SAT")
  const [expandedChart, setExpandedChart] = useState<string | null>(null)
  const [expandedCircle, setExpandedCircle] = useState<string | null>(null)
  const [hoveredResource, setHoveredResource] = useState<number | null>(null)

  // SAT Scores State
  const [satScores, setSatScores] = useState<SATScore[]>([
    { id: "1", date: "2024-01-15", reading: 650, math: 700, total: 1350 },
    { id: "2", date: "2024-03-20", reading: 680, math: 720, total: 1400 },
    { id: "3", date: "2024-05-18", reading: 700, math: 750, total: 1450 },
  ])

  // ACT Scores State
  const [actScores, setActScores] = useState<ACTScore[]>([
    { id: "1", date: "2024-02-10", english: 28, math: 30, reading: 26, science: 29, composite: 28 },
    { id: "2", date: "2024-04-12", english: 30, math: 32, reading: 28, science: 31, composite: 30 },
    { id: "3", date: "2024-06-14", english: 32, math: 34, reading: 30, science: 33, composite: 32 },
  ])

  // AP Scores State
  const [apScores, setApScores] = useState<APScore[]>([
    { id: "1", subject: "AP Biology", score: 4, date: "2023-05-15" },
    { id: "2", subject: "AP Calculus AB", score: 5, date: "2023-05-16" },
    { id: "3", subject: "AP English Literature", score: 3, date: "2024-05-14" },
    { id: "4", subject: "AP US History", score: 4, date: "2024-05-15" },
    { id: "5", subject: "AP Chemistry", score: 5, date: "2024-05-16" },
  ])

  // New score input states
  const [newSATScore, setNewSATScore] = useState({ date: "", reading: "", math: "" })
  const [newACTScore, setNewACTScore] = useState({ date: "", english: "", math: "", reading: "", science: "" })
  const [newAPScore, setNewAPScore] = useState({ subject: "", score: "", date: "" })

  const nextTestDate = "March 9, 2024"

  const resources = [
    { name: "Khan Academy", type: "Free Practice", icon: "📚" },
    { name: "College Board SAT Question Bank", type: "Official Questions", icon: "🎯" },
    { name: "Blue Method SAT Prep", type: "Prep Course", icon: "📖" },
  ]

  // Add new score functions with animations
  const addSATScore = () => {
    if (newSATScore.date && newSATScore.reading && newSATScore.math) {
      const reading = Number.parseInt(newSATScore.reading)
      const math = Number.parseInt(newSATScore.math)
      const total = reading + math
      const newScore: SATScore = {
        id: Date.now().toString(),
        date: newSATScore.date,
        reading,
        math,
        total,
      }
      setSatScores([...satScores, newScore])
      setNewSATScore({ date: "", reading: "", math: "" })

      // Trigger chart expansion animation
      setExpandedChart("sat-chart")
      setTimeout(() => setExpandedChart(null), 1000)
    }
  }

  const addACTScore = () => {
    if (newACTScore.date && newACTScore.english && newACTScore.math && newACTScore.reading && newACTScore.science) {
      const english = Number.parseInt(newACTScore.english)
      const math = Number.parseInt(newACTScore.math)
      const reading = Number.parseInt(newACTScore.reading)
      const science = Number.parseInt(newACTScore.science)
      const composite = Math.round((english + math + reading + science) / 4)
      const newScore: ACTScore = {
        id: Date.now().toString(),
        date: newACTScore.date,
        english,
        math,
        reading,
        science,
        composite,
      }
      setActScores([...actScores, newScore])
      setNewACTScore({ date: "", english: "", math: "", reading: "", science: "" })

      // Trigger chart expansion animation
      setExpandedChart("act-chart")
      setTimeout(() => setExpandedChart(null), 1000)
    }
  }

  const addAPScore = () => {
    if (newAPScore.subject && newAPScore.score && newAPScore.date) {
      const newScore: APScore = {
        id: Date.now().toString(),
        subject: newAPScore.subject,
        score: Number.parseInt(newAPScore.score),
        date: newAPScore.date,
      }
      setApScores([...apScores, newScore])
      setNewAPScore({ subject: "", score: "", date: "" })

      // Trigger chart expansion animation
      setExpandedChart("ap-chart")
      setTimeout(() => setExpandedChart(null), 1000)
    }
  }

  // Delete score functions
  const deleteSATScore = (id: string) => {
    setSatScores(satScores.filter((score) => score.id !== id))
  }

  const deleteACTScore = (id: string) => {
    setActScores(actScores.filter((score) => score.id !== id))
  }

  const deleteAPScore = (id: string) => {
    setApScores(apScores.filter((score) => score.id !== id))
  }

  // Get latest scores for circle graphs
  const latestSATScore = satScores[satScores.length - 1]
  const latestACTScore = actScores[actScores.length - 1]

  const renderScoreChart = (scores: any[], maxScore: number, minScore: number, scoreKey: string, chartId: string) => {
    const chartWidth = 500
    const chartHeight = 250
    const padding = 50
    const isExpanded = expandedChart === chartId

    return (
      <div
        className={`relative mb-6 bg-white rounded-lg border p-6 cursor-pointer transition-all duration-500 ease-out ${
          isExpanded ? "h-96 scale-105 shadow-2xl" : "h-80 hover:shadow-lg"
        }`}
        onClick={() => {
          setExpandedChart(expandedChart === chartId ? null : chartId)
          setTimeout(() => {
            if (expandedChart !== chartId) setExpandedChart(null)
          }, 3000)
        }}
      >
        {/* Custom Chart Background Image */}
        <div className="absolute inset-0 rounded-lg overflow-hidden opacity-5">
          <Image src="/placeholder.svg?height=300&width=500" alt="Chart background" fill className="object-cover" />
        </div>
        <svg
          className={`relative z-10 w-full h-full transition-all duration-500 ${isExpanded ? "scale-110" : ""}`}
          viewBox={`0 0 ${chartWidth} ${chartHeight + 60}`}
        >
          {/* Y-axis labels and grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
            const y = chartHeight - ratio * (chartHeight - padding * 2) - padding
            const scoreValue = Math.round(minScore + (maxScore - minScore) * ratio)
            return (
              <g key={index}>
                <line
                  x1={padding}
                  y1={y}
                  x2={chartWidth - padding}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  className="transition-all duration-300"
                />
                <text x={padding - 15} y={y + 4} textAnchor="end" className="text-sm fill-gray-500">
                  {scoreValue}
                </text>
              </g>
            )
          })}

          {/* Score line with animation */}
          {scores.length > 1 && (
            <polyline
              fill="none"
              stroke="#14b8a6"
              strokeWidth={isExpanded ? "4" : "3"}
              className="transition-all duration-500"
              points={scores
                .map((point, index) => {
                  const x = padding + (index * (chartWidth - padding * 2)) / (scores.length - 1)
                  const scoreValue = scoreKey === "total" ? point.total : point.composite
                  const y =
                    chartHeight -
                    padding -
                    ((scoreValue - minScore) / (maxScore - minScore)) * (chartHeight - padding * 2)
                  return `${x},${y}`
                })
                .join(" ")}
            />
          )}

          {/* Data points with hover effects */}
          {scores.map((point, index) => {
            const x = padding + (index * (chartWidth - padding * 2)) / Math.max(scores.length - 1, 1)
            const scoreValue = scoreKey === "total" ? point.total : point.composite
            const y =
              chartHeight - padding - ((scoreValue - minScore) / (maxScore - minScore)) * (chartHeight - padding * 2)
            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r={isExpanded ? "7" : "5"}
                  fill="#14b8a6"
                  className="transition-all duration-300 hover:r-8 cursor-pointer"
                />
                <text x={x} y={chartHeight + 25} textAnchor="middle" className="text-xs fill-gray-500">
                  {point.date}
                </text>
              </g>
            )
          })}

          {/* X-axis labels */}
          <text x={padding} y={chartHeight + 45} textAnchor="middle" className="text-sm fill-gray-500">
            Initial
          </text>
          <text x={chartWidth - padding} y={chartHeight + 45} textAnchor="middle" className="text-sm fill-gray-500">
            Latest
          </text>

          {/* Settings icon with hover effect */}
          <g transform={`translate(${chartWidth - 35}, ${chartHeight - 15})`} className="cursor-pointer">
            <rect
              width="25"
              height="25"
              rx="6"
              fill="#f3f4f6"
              className="hover:fill-gray-300 transition-colors duration-200"
            />
            <Settings className="w-4 h-4" x="12.5" y="12.5" />
          </g>
        </svg>

        {/* Expansion indicator */}
        {isExpanded && (
          <div className="absolute top-4 right-4 bg-teal-500 text-white px-2 py-1 rounded text-xs animate-pulse">
            Expanded View
          </div>
        )}
      </div>
    )
  }

  const renderCircleGraph = (score: number, maxScore: number, label: string, color = "#10d9c4", circleId: string) => {
    const percentage = (score / maxScore) * 100
    const isExpanded = expandedCircle === circleId

    return (
      <div
        className={`flex flex-col items-center cursor-pointer transition-all duration-300 ${
          isExpanded ? "scale-125" : "hover:scale-110"
        }`}
        onClick={() => {
          setExpandedCircle(expandedCircle === circleId ? null : circleId)
          setTimeout(() => setExpandedCircle(null), 2000)
        }}
      >
        <div className={`relative mb-3 transition-all duration-300 ${isExpanded ? "w-36 h-36" : "w-28 h-28"}`}>
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="3"
              className="transition-all duration-300"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke={color}
              strokeWidth={isExpanded ? "4" : "3"}
              strokeDasharray={`${percentage}, 100`}
              className="transition-all duration-500"
              style={{
                strokeDashoffset: isExpanded ? "0" : "25",
                animation: isExpanded ? "dash 1s ease-in-out" : "none",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={`font-bold text-gray-800 transition-all duration-300 ${isExpanded ? "text-3xl" : "text-xl"}`}
            >
              {score}
            </span>
          </div>
        </div>
        <div className="text-center">
          <div
            className={`font-medium text-gray-700 transition-all duration-300 ${isExpanded ? "text-base" : "text-sm"}`}
          >
            {label}
          </div>
          <div className="text-xs text-gray-500">out of {maxScore}</div>
        </div>

        {/* Pulse effect when expanded */}
        {isExpanded && (
          <div className="absolute inset-0 rounded-full border-2 border-teal-400 animate-ping opacity-30"></div>
        )}
      </div>
    )
  }

  const renderAPBarChart = () => {
    return (
      <div className="space-y-4">
        {apScores.map((ap, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-102 hover:shadow-md"
          >
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">{ap.subject}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">{ap.score}/5</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteAPScore(ap.id)}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:scale-110 transition-all duration-200"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-teal-400 to-teal-600 h-3 rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${(ap.score / 5) * 100}%`,
                    animation: "slideIn 0.8s ease-out",
                  }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">{ap.date}</div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderUploadSection = (testType: string) => {
    return (
      <Card className="bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-102">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-800">Upload Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-teal-400 transition-all duration-300 hover:bg-teal-50/30">
            {/* Custom AI Robot Image with animation */}
            <div className="w-16 h-16 mx-auto mb-4 relative hover:scale-110 transition-transform duration-300">
              <Image
                src="/7af5f81692dac3589195d75e0f337f9c427252c1.png?height=64&width=64"
                alt="AI Assistant Robot"
                width={64}
                height={64}
                className="rounded-full bg-gray-100 p-2 animate-pulse"
              />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-bounce"></div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-teal-700 transition-colors duration-200">
              Let AI analyze weak points
            </h3>
            <p className="text-sm text-gray-600 mb-6 max-w-sm mx-auto leading-relaxed">
              Based on your practice test results and errors, get a personalized study plan to improve your score
            </p>
            <Button
              variant="outline"
              size="sm"
              className="border-teal-500 text-teal-600 hover:bg-teal-50 bg-transparent px-6 hover:scale-105 transition-all duration-200"
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose File
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Get current test info for header
  const getTestInfo = () => {
    switch (selectedTest) {
      case "SAT":
        return {
          title: "SAT Test Preparation",
          subtitle: `Track your SAT progress • ${satScores.length} tests recorded • Latest score: ${latestSATScore?.total || "N/A"}`,
        }
      case "ACT":
        return {
          title: "ACT Test Preparation",
          subtitle: `Track your ACT progress • ${actScores.length} tests recorded • Latest composite: ${latestACTScore?.composite || "N/A"}`,
        }
      case "AP Tests":
        return {
          title: "AP Test Preparation",
          subtitle: `Track your AP scores • ${apScores.length} tests recorded • Average score: ${apScores.length > 0 ? (apScores.reduce((sum, ap) => sum + ap.score, 0) / apScores.length).toFixed(1) : "N/A"}`,
        }
      default:
        return { title: "Test Preparation Dashboard", subtitle: "Track your standardized test progress" }
    }
  }

  const testInfo = getTestInfo()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes slideIn {
          from { width: 0%; }
          to { width: var(--final-width); }
        }
        
        @keyframes dash {
          from { stroke-dashoffset: 25; }
          to { stroke-dashoffset: 0; }
        }
        
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>

      {/* Main Content Area */}
      <div className="flex flex-col">
        {/* Header */}
        <Header title={testInfo.title} subtitle={testInfo.subtitle}>
          {/* Custom Tab Navigation in Header */}
          <div className="flex gap-1 bg-teal-100 p-1 rounded-lg w-fit">
            {(["SAT", "ACT", "AP Tests"] as TestType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTest(tab)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:scale-105 ${
                  selectedTest === tab
                    ? "bg-white text-teal-700 shadow-sm scale-105"
                    : "text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </Header>

        {/* Scrollable Content */}
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            {/* SAT Content */}
            {selectedTest === "SAT" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Add New SAT Score */}
                  <Card className="bg-white shadow-sm hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-800">Add SAT Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <Label htmlFor="sat-date" className="text-gray-700 font-medium">
                            Test Date
                          </Label>
                          <Input
                            id="sat-date"
                            type="date"
                            value={newSATScore.date}
                            onChange={(e) => setNewSATScore({ ...newSATScore, date: e.target.value })}
                            className="text-gray-900 bg-white border-gray-300 focus:border-teal-500 transition-colors duration-200"
                          />
                        </div>
                        <div>
                          <Label htmlFor="sat-reading" className="text-gray-700 font-medium">
                            Reading (400-800)
                          </Label>
                          <Input
                            id="sat-reading"
                            type="number"
                            min="400"
                            max="800"
                            value={newSATScore.reading}
                            onChange={(e) => setNewSATScore({ ...newSATScore, reading: e.target.value })}
                            className="text-gray-900 bg-white border-gray-300 focus:border-teal-500 transition-colors duration-200"
                          />
                        </div>
                        <div>
                          <Label htmlFor="sat-math" className="text-gray-700 font-medium">
                            Math (400-800)
                          </Label>
                          <Input
                            id="sat-math"
                            type="number"
                            min="400"
                            max="800"
                            value={newSATScore.math}
                            onChange={(e) => setNewSATScore({ ...newSATScore, math: e.target.value })}
                            className="text-gray-900 bg-white border-gray-300 focus:border-teal-500 transition-colors duration-200"
                          />
                        </div>
                        <div className="flex items-end">
                          <Button
                            onClick={addSATScore}
                            className="bg-teal-500 hover:bg-teal-600 text-white w-full hover:scale-105 transition-all duration-200"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Score
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Test Score Metrics */}
                  <Card className="bg-white shadow-sm hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-800">SAT Score Progress</CardTitle>
                      <p className="text-sm text-gray-500">Your SAT score improvement over time</p>
                    </CardHeader>
                    <CardContent>
                      {renderScoreChart(satScores, 1600, 800, "total", "sat-chart")}

                      {/* SAT Section Circles */}
                      <div className="flex justify-center gap-8">
                        {latestSATScore && (
                          <>
                            {renderCircleGraph(
                              latestSATScore.reading,
                              800,
                              "Reading & Writing",
                              "#3b82f6",
                              "sat-reading",
                            )}
                            {renderCircleGraph(latestSATScore.math, 800, "Math", "#10d9c4", "sat-math")}
                            {renderCircleGraph(latestSATScore.total, 1600, "Total Score", "#8b5cf6", "sat-total")}
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* SAT Score History */}
                  <Card className="bg-white shadow-sm hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-800">Score History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {satScores.map((score, index) => (
                          <div
                            key={score.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-102"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-black">{score.date}</span>
                              <span className="text-sm text-black">Reading: {score.reading}</span>
                              <span className="text-sm text-black">Math: {score.math}</span>
                              <span className="text-sm font-semibold text-black">Total: {score.total}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteSATScore(score.id)}
                              className="text-red-500 hover:text-red-700 hover:scale-110 transition-all duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Next Test and Resources */}
                <div className="space-y-4">
                  {/* Next Test Header */}
                  <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-lg transition-all duration-300 hover:scale-102">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800">Next Test</h3>
                        <div className="flex items-center gap-2 text-gray-600 mt-1">
                          <Calendar className="w-3 h-3" />
                          <span className="text-xs">{nextTestDate}</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-teal-500 hover:bg-teal-600 text-white text-xs px-3 py-1 hover:scale-105 transition-all duration-200"
                      >
                        Book now
                      </Button>
                    </div>
                  </div>

                  {/* Resources Card */}
                  <Card className="bg-white shadow-sm hover:shadow-lg transition-all duration-300">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-800">Resources</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {resources.map((resource, index) => (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg transition-all duration-300 cursor-pointer ${
                            hoveredResource === index ? "bg-teal-50 scale-102 shadow-md" : "hover:bg-gray-100"
                          }`}
                          onMouseEnter={() => setHoveredResource(index)}
                          onMouseLeave={() => setHoveredResource(null)}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`text-lg transition-transform duration-200 ${
                                hoveredResource === index ? "scale-125" : ""
                              }`}
                            >
                              {resource.icon}
                            </span>
                            <div>
                              <div className="font-medium text-gray-800 text-sm">{resource.name}</div>
                              <div className="text-xs text-gray-500">{resource.type}</div>
                            </div>
                          </div>
                          <ExternalLink
                            className={`w-4 h-4 text-gray-400 transition-all duration-200 ${
                              hoveredResource === index ? "text-teal-500 scale-110" : ""
                            }`}
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Upload Test Card */}
                  {renderUploadSection("SAT")}
                </div>
              </div>
            )}

            {/* ACT Content */}
            {selectedTest === "ACT" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Add New ACT Score */}
                  <Card className="bg-white shadow-sm hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-800">Add ACT Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                        <div>
                          <Label htmlFor="act-date" className="text-gray-700 font-medium">
                            Test Date
                          </Label>
                          <Input
                            id="act-date"
                            type="date"
                            value={newACTScore.date}
                            onChange={(e) => setNewACTScore({ ...newACTScore, date: e.target.value })}
                            className="text-gray-900 bg-white border-gray-300 focus:border-teal-500 transition-colors duration-200"
                          />
                        </div>
                        <div>
                          <Label htmlFor="act-english" className="text-gray-700 font-medium">
                            English (1-36)
                          </Label>
                          <Input
                            id="act-english"
                            type="number"
                            min="1"
                            max="36"
                            value={newACTScore.english}
                            onChange={(e) => setNewACTScore({ ...newACTScore, english: e.target.value })}
                            className="text-gray-900 bg-white border-gray-300 focus:border-teal-500 transition-colors duration-200"
                          />
                        </div>
                        <div>
                          <Label htmlFor="act-math" className="text-gray-700 font-medium">
                            Math (1-36)
                          </Label>
                          <Input
                            id="act-math"
                            type="number"
                            min="1"
                            max="36"
                            value={newACTScore.math}
                            onChange={(e) => setNewACTScore({ ...newACTScore, math: e.target.value })}
                            className="text-gray-900 bg-white border-gray-300 focus:border-teal-500 transition-colors duration-200"
                          />
                        </div>
                        <div>
                          <Label htmlFor="act-reading" className="text-gray-700 font-medium">
                            Reading (1-36)
                          </Label>
                          <Input
                            id="act-reading"
                            type="number"
                            min="1"
                            max="36"
                            value={newACTScore.reading}
                            onChange={(e) => setNewACTScore({ ...newACTScore, reading: e.target.value })}
                            className="text-gray-900 bg-white border-gray-300 focus:border-teal-500 transition-colors duration-200"
                          />
                        </div>
                        <div>
                          <Label htmlFor="act-science" className="text-gray-700 font-medium">
                            Science (1-36)
                          </Label>
                          <Input
                            id="act-science"
                            type="number"
                            min="1"
                            max="36"
                            value={newACTScore.science}
                            onChange={(e) => setNewACTScore({ ...newACTScore, science: e.target.value })}
                            className="text-gray-900 bg-white border-gray-300 focus:border-teal-500 transition-colors duration-200"
                          />
                        </div>
                        <div className="flex items-end">
                          <Button
                            onClick={addACTScore}
                            className="bg-teal-500 hover:bg-teal-600 text-white w-full hover:scale-105 transition-all duration-200"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Test Score Metrics */}
                  <Card className="bg-white shadow-sm hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-800">ACT Score Progress</CardTitle>
                      <p className="text-sm text-gray-500">Your ACT score improvement over time</p>
                    </CardHeader>
                    <CardContent>
                      {renderScoreChart(actScores, 36, 10, "composite", "act-chart")}

                      {/* ACT Section Circles */}
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 justify-items-center">
                        {latestACTScore && (
                          <>
                            {renderCircleGraph(latestACTScore.english, 36, "English", "#3b82f6", "act-english")}
                            {renderCircleGraph(latestACTScore.math, 36, "Math", "#10d9c4", "act-math")}
                            {renderCircleGraph(latestACTScore.reading, 36, "Reading", "#f59e0b", "act-reading")}
                            {renderCircleGraph(latestACTScore.science, 36, "Science", "#ef4444", "act-science")}
                            {renderCircleGraph(latestACTScore.composite, 36, "Composite", "#8b5cf6", "act-composite")}
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* ACT Score History */}
                  <Card className="bg-white shadow-sm hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-800">Score History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {actScores.map((score, index) => (
                          <div
                            key={score.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-102"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <div className="flex items-center gap-4 flex-wrap">
                              <span className="text-sm text-black">{score.date}</span>
                              <span className="text-sm text-black">E: {score.english}</span>
                              <span className="text-sm text-black">M: {score.math}</span>
                              <span className="text-sm text-black">R: {score.reading}</span>
                              <span className="text-sm text-black">S: {score.science}</span>
                              <span className="text-sm font-semibold text-black">Composite: {score.composite}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteACTScore(score.id)}
                              className="text-red-500 hover:text-red-700 hover:scale-110 transition-all duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Next Test and Resources */}
                <div className="space-y-4">
                  {/* Next Test Header */}
                  <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-lg transition-all duration-300 hover:scale-102">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800">Next Test</h3>
                        <div className="flex items-center gap-2 text-gray-600 mt-1">
                          <Calendar className="w-3 h-3" />
                          <span className="text-xs">{nextTestDate}</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-teal-500 hover:bg-teal-600 text-white text-xs px-3 py-1 hover:scale-105 transition-all duration-200"
                      >
                        Book now
                      </Button>
                    </div>
                  </div>

                  {/* Resources Card */}
                  <Card className="bg-white shadow-sm hover:shadow-lg transition-all duration-300">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-800">Resources</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {resources.map((resource, index) => (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg transition-all duration-300 cursor-pointer ${
                            hoveredResource === index ? "bg-teal-50 scale-102 shadow-md" : "hover:bg-gray-100"
                          }`}
                          onMouseEnter={() => setHoveredResource(index)}
                          onMouseLeave={() => setHoveredResource(null)}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`text-lg transition-transform duration-200 ${
                                hoveredResource === index ? "scale-125" : ""
                              }`}
                            >
                              {resource.icon}
                            </span>
                            <div>
                              <div className="font-medium text-gray-800 text-sm">{resource.name}</div>
                              <div className="text-xs text-gray-500">{resource.type}</div>
                            </div>
                          </div>
                          <ExternalLink
                            className={`w-4 h-4 text-gray-400 transition-all duration-200 ${
                              hoveredResource === index ? "text-teal-500 scale-110" : ""
                            }`}
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Upload Test Card */}
                  {renderUploadSection("ACT")}
                </div>
              </div>
            )}

            {/* AP Tests Content */}
            {selectedTest === "AP Tests" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Add New AP Score */}
                  <Card className="bg-white shadow-sm hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-800">Add AP Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <Label htmlFor="ap-subject" className="text-gray-700 font-medium">
                            Subject
                          </Label>
                          <Input
                            id="ap-subject"
                            placeholder="e.g., AP Biology"
                            value={newAPScore.subject}
                            onChange={(e) => setNewAPScore({ ...newAPScore, subject: e.target.value })}
                            className="text-gray-900 bg-white border-gray-300 focus:border-teal-500 transition-colors duration-200"
                          />
                        </div>
                        <div>
                          <Label htmlFor="ap-score" className="text-gray-700 font-medium">
                            Score (1-5)
                          </Label>
                          <Input
                            id="ap-score"
                            type="number"
                            min="1"
                            max="5"
                            value={newAPScore.score}
                            onChange={(e) => setNewAPScore({ ...newAPScore, score: e.target.value })}
                            className="text-gray-900 bg-white border-gray-300 focus:border-teal-500 transition-colors duration-200"
                          />
                        </div>
                        <div>
                          <Label htmlFor="ap-date" className="text-gray-700 font-medium">
                            Test Date
                          </Label>
                          <Input
                            id="ap-date"
                            type="date"
                            value={newAPScore.date}
                            onChange={(e) => setNewAPScore({ ...newAPScore, date: e.target.value })}
                            className="text-gray-900 bg-white border-gray-300 focus:border-teal-500 transition-colors duration-200"
                          />
                        </div>
                        <div className="flex items-end">
                          <Button
                            onClick={addAPScore}
                            className="bg-teal-500 hover:bg-teal-600 text-white w-full hover:scale-105 transition-all duration-200"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Score
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* AP Test Scores */}
                  <Card className="bg-white shadow-sm hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-800">AP Test Scores</CardTitle>
                      <p className="text-sm text-gray-500">Your AP exam results by subject</p>
                    </CardHeader>
                    <CardContent>{renderAPBarChart()}</CardContent>
                  </Card>

                  {/* AP Score Summary */}
                  <Card className="bg-white shadow-sm hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-800">Score Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-5 gap-4 text-center">
                        {[1, 2, 3, 4, 5].map((score) => {
                          const count = apScores.filter((ap) => ap.score === score).length
                          return (
                            <div
                              key={score}
                              className="p-4 bg-gray-50 rounded-lg hover:bg-teal-50 hover:scale-105 transition-all duration-300 cursor-pointer"
                            >
                              <div className="text-2xl font-bold text-gray-800">{count}</div>
                              <div className="text-sm text-gray-600">Score {score}</div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Next Test and Resources */}
                <div className="space-y-4">
                  {/* Next Test Header */}
                  <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-lg transition-all duration-300 hover:scale-102">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800">Next Test</h3>
                        <div className="flex items-center gap-2 text-gray-600 mt-1">
                          <Calendar className="w-3 h-3" />
                          <span className="text-xs">May 6-17, 2024</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-teal-500 hover:bg-teal-600 text-white text-xs px-3 py-1 hover:scale-105 transition-all duration-200"
                      >
                        Register
                      </Button>
                    </div>
                  </div>

                  {/* Resources Card */}
                  <Card className="bg-white shadow-sm hover:shadow-lg transition-all duration-300">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-800">Resources</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        { name: "AP Classroom", type: "Official Resources", icon: "🎓" },
                        { name: "College Board AP Practice", type: "Practice Exams", icon: "📝" },
                        { name: "AP Study Guides", type: "Review Materials", icon: "📚" },
                      ].map((resource, index) => (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg transition-all duration-300 cursor-pointer ${
                            hoveredResource === index ? "bg-teal-50 scale-102 shadow-md" : "hover:bg-gray-100"
                          }`}
                          onMouseEnter={() => setHoveredResource(index)}
                          onMouseLeave={() => setHoveredResource(null)}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`text-lg transition-transform duration-200 ${
                                hoveredResource === index ? "scale-125" : ""
                              }`}
                            >
                              {resource.icon}
                            </span>
                            <div>
                              <div className="font-medium text-gray-800 text-sm">{resource.name}</div>
                              <div className="text-xs text-gray-500">{resource.type}</div>
                            </div>
                          </div>
                          <ExternalLink
                            className={`w-4 h-4 text-gray-400 transition-all duration-200 ${
                              hoveredResource === index ? "text-teal-500 scale-110" : ""
                            }`}
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Upload Test Card */}
                  {renderUploadSection("AP")}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
