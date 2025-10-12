
// Carbon Clash Quiz Game - Main Client Component
// This file contains the full logic and UI for the Carbon Clash eco-quiz game, including question state, answer logic, animations, and results/leaderboard.
"use client"


// UI and icon imports
import Header from "@/app/components/Header"
import { Droplets, Flame, Flower, Leaf, RotateCcw, Share2, Star, Trees, Trophy, Users, Zap } from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import { Button } from "../ui/Button"
import { Progress } from "../ui/Progress"

// Supabase imports for leaderboard integration
import { createClient } from "@/utils/supabase/client"
import { getLeaderboardWithActualVolunteerHours, getUserStatistics, Leaderboard, persistQuizReport } from "@/utils/supabase/functions"


// Type for quiz questions
interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number // index of correct option
  ecoFact: string // fun fact shown after answering
}

// Extended interface for leaderboard with joined data
interface LeaderboardWithStats extends Leaderboard {
  user_statistics?: {
    carbon_saved?: number;
    volunteer_hours?: number;
    cleanups_participated?: number;
    quiz_correct_answers?: number;
  };
}

// Mock leaderboard entry type
interface MockLeaderboardEntry {
  name: string;
  score: number;
  xp: number;
}

// Remove top-level useEffect and move it inside the component below
// Mock leaderboard data for results screen
const mockLeaderboard = [
  { name: "EcoWarrior", score: 10, xp: 1000 },
  { name: "GreenGuru", score: 9, xp: 900 },
  { name: "ClimateChamp", score: 9, xp: 850 },
  { name: "You", score: 0, xp: 0 }, // Will be updated with user's score
  { name: "TreeHugger", score: 8, xp: 800 },
  { name: "SolarSage", score: 7, xp: 700 },
  { name: "WindWizard", score: 7, xp: 650 },
]

// Function to calculate eco points from user statistics
const calculateEcoPoints = (entry: LeaderboardWithStats): number => {
  const carbon = entry.user_statistics?.carbon_saved || 0
  const hours = entry.user_statistics?.volunteer_hours || 0
  const cleanups = entry.user_statistics?.cleanups_participated || 0
  const quizAnswers = entry.user_statistics?.quiz_correct_answers || 0
  return (carbon * 0.7) + (hours * 5) + (cleanups * 12) + (quizAnswers * 1)
}

// Function to rank users by eco points
const rankUsersByEcoPoints = (users: LeaderboardWithStats[]): LeaderboardWithStats[] => {
  return users.sort((a, b) => calculateEcoPoints(b) - calculateEcoPoints(a))
}

// Returns a performance level object based on score
const getPerformanceLevel = (score: number, totalQuestions: number) => {
  const percentage = (score / totalQuestions) * 100
  if (percentage >= 90) return { level: "Eco Master", color: "bg-green-500", icon: Trophy }
  if (percentage >= 70) return { level: "Green Guardian", color: "bg-emerald-500", icon: Star }
  if (percentage >= 50) return { level: "Climate Conscious", color: "bg-teal-500", icon: Leaf }
  return { level: "Eco Learner", color: "bg-blue-500", icon: Zap }
}

// Calculate eco points based on score
const calculateXP = (score: number) => {
  // Base points: 1 eco point per correct answer
  return score * 1
}

// Main quiz component
export default function CarbonClashQuiz() {
  // State for game flow and quiz logic

  const [userXp, setUserXp] = useState<number | null>(null)
  const [xpLoading, setXpLoading] = useState(false)
  const [gameState, setGameState] = useState<"start" | "quiz" | "results">("start") // Which screen to show
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0) // Which question is active
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null) // User's selected answer
  const [score, setScore] = useState(0) // User's score
  const [userAnswers, setUserAnswers] = useState<number[]>([]) // All user answers
  const [streak, setStreak] = useState(0) // Current correct streak
  const [maxStreak, setMaxStreak] = useState(0) // Max streak for bonus
  const [showStreakBonus, setShowStreakBonus] = useState(false) // Show streak bonus animation
  const [questionTransition, setQuestionTransition] = useState(false) // Animate question change
  const [progressAnimation, setProgressAnimation] = useState(0) // Progress bar animation
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([])
  const [questionsLoading, setQuestionsLoading] = useState(true)
  const [questionsError, setQuestionsError] = useState<string | null>(null)
  const [reportSubmitted, setReportSubmitted] = useState(false) // Prevent duplicate submissions

  // Leaderboard state management
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardWithStats[]>([])
  const [userRank, setUserRank] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)


  // Supabase client for data fetching
  const supabase = createClient()
    const fetchLeaderboardData = useCallback(async () => {
    try {
      setLoading(true)
      const result = await getLeaderboardWithActualVolunteerHours()
      
      if (result.error) {
        console.error("Error fetching leaderboard data:", result.error)
      } else {
        // Sort users by eco points and get current user
        const rankedUsers = rankUsersByEcoPoints(result.data)
        setLeaderboardData(rankedUsers)
        
        // Find current user's rank
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setCurrentUserId(user.id)
          const currentUserIndex = rankedUsers.findIndex(u => u.user_id === user.id)
          setUserRank(currentUserIndex + 1)
        }
      }
    } catch (error) {
      console.error("Error fetching leaderboard data:", error)
    } finally {
      setLoading(false)
    }
  }, [supabase])
  useEffect(() => {
    const fetchQuizQuestions = async () => {
      try {
        setQuestionsLoading(true)
        setQuestionsError(null)
        
        // Get Supabase session token
        const { data: { session } } = await supabase.auth.getSession()
        const token = session?.access_token
        
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        }
        
        // Include authorization header if token exists
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }
        
        const response = await fetch("http://localhost:8000/quiz-bot", {
          method: 'POST',
          headers: headers
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        let text = await response.text()
        
        // Remove code block markers if present (handle both raw and escaped versions)
        text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim()
        
        // Also handle escaped versions that might come from JSON responses
        text = text.replace(/^"```json\\n/, '').replace(/\\n```"$/, '').trim()
        
        // Handle case where the entire response is wrapped in quotes
        if (text.startsWith('"') && text.endsWith('"')) {
          text = text.slice(1, -1)
        }
        
        // Replace escaped newlines with actual newlines for proper JSON parsing
        text = text.replace(/\\n/g, '\n').replace(/\\"/g, '"')
        
        if (!text) {
          throw new Error('Empty response from server')
        }
        
        console.log("Cleaned text:", text)
        const data = JSON.parse(text)
        
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('Invalid or empty questions data')
        }
        
        setQuizQuestions(data)
      } catch (error) {
        console.error("Error fetching quiz questions:", error)
        setQuestionsError(error instanceof Error ? error.message : 'Failed to load questions')
      } finally {
        setQuestionsLoading(false)
      }
    }
    fetchQuizQuestions()
  }, [supabase])
  
  // Animate progress bar when question changes
  useEffect(() => {
    if (gameState === "quiz" && quizQuestions.length > 0) {
      const targetProgress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100
      const timer = setTimeout(() => setProgressAnimation(targetProgress), 100)
      return () => clearTimeout(timer)
    }
  }, [currentQuestionIndex, gameState, quizQuestions.length])

 

  useEffect(() => {
    if (gameState === "results" && !reportSubmitted) {
    const fetchAndCreateReport = async () => {
      try {
        setXpLoading(true)
        setReportSubmitted(true) // Mark as submitted to prevent duplicates
        const { data: { user } } = await supabase.auth.getUser()
        setCurrentUserId(user?.id ?? "")
        console.log("User ID:", user?.id, "Score:", score)
        
        const persistResult = await persistQuizReport(user?.id ?? "", score)
        console.log("Persist result:", persistResult)

        // Fetch XP directly from user statistics after persisting quiz report
        if (user?.id) {
          const { data: userStats, error } = await getUserStatistics(user.id)
          console.log("User stats result:", userStats, "Error:", error)
          if (error) {
            console.error("Error fetching user statistics:", error)
          } else if (userStats) {
            console.log("Setting XP to:", userStats.xp)
            setUserXp(userStats.xp)
          }
        }

        // Refresh leaderboard data to show updated points
        await fetchLeaderboardData()
      } catch (err) {
        console.error("Error creating user quiz report or fetching XP:", err)
      } finally {
        setXpLoading(false)
      }
    }
    fetchAndCreateReport()
    }
  }, [gameState, score, reportSubmitted, supabase.auth, fetchLeaderboardData])

  // Start/restart the quiz
  const startQuiz = () => {
    // Don't start quiz if questions aren't loaded yet
    if (quizQuestions.length === 0) {
      console.log("Quiz questions not loaded yet")
      return
    }
    
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setScore(0)
    setUserAnswers([])
    setStreak(0)
    setMaxStreak(0)
    setShowStreakBonus(false)
    setQuestionTransition(false)
    setProgressAnimation(0)
    setUserXp(null) // Reset XP data for new quiz
    setXpLoading(false)
    setReportSubmitted(false) // Reset report submission flag
    setGameState("quiz")
  }

  // Share functionality for quiz results
  const handleShare = async () => {
    const totalXP = calculateXP(score)
    const performance = getPerformanceLevel(score, quizQuestions.length)
    const percentage = Math.round((score / quizQuestions.length) * 100)

    const shareText = `🌱 I just scored ${score}/${quizQuestions.length} (${percentage}%) on Carbon Clash - EcoQuest's environmental quiz! 🌍\n\nEarned ${totalXP.toFixed(1)} eco points and reached ${performance.level} level! 💚\n\nTest your eco-knowledge too!`
    const shareUrl = window.location.href

    // Try to use native Web Share API (mobile-friendly)
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Carbon Clash - EcoQuest Quiz Results',
          text: shareText,
          url: shareUrl,
        })
      } catch (error) {
        console.log('Share cancelled or failed:', error)
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`)
        
        // Show success feedback
        const button = document.querySelector('[data-share-button]') as HTMLButtonElement
        if (button) {
          const originalText = button.innerHTML
          button.innerHTML = '<svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>COPIED!'
          setTimeout(() => {
            button.innerHTML = originalText
          }, 2000)
        }
      } catch (error) {
        console.error('Failed to copy to clipboard:', error)
        // Fallback: Open share dialog manually
        openShareDialog(shareText, shareUrl)
      }
    }
  }

  // Fallback function to open various social media share options
  const openShareDialog = (text: string, url: string) => {
    const encodedText = encodeURIComponent(text)
    const encodedUrl = encodeURIComponent(url)
    
    // Create share options
    const shareOptions = [
      {
        name: 'Twitter',
        url: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
        color: 'bg-blue-400 hover:bg-blue-500'
      },
      {
        name: 'Facebook',
        url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
        color: 'bg-blue-600 hover:bg-blue-700'
      },
      {
        name: 'WhatsApp',
        url: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
        color: 'bg-green-500 hover:bg-green-600'
      }
    ]

    // Create and show modal
    const modal = document.createElement('div')
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
    modal.innerHTML = `
      <div class="bg-white rounded-3xl p-8 max-w-md mx-4">
        <h3 class="text-2xl font-black text-gray-900 mb-6 text-center">Share Your Results!</h3>
        <div class="space-y-3">
          ${shareOptions.map((option) => `
            <button 
              onclick="window.open('${option.url}', '_blank'); this.closest('.fixed').remove()"
              class="w-full p-4 text-white font-bold rounded-2xl transition-all duration-300 hover:scale-105 ${option.color}"
            >
              ${option.name}
            </button>
          `).join('')}
          <button 
            onclick="navigator.clipboard.writeText('${text}\\n\\n${url}').then(() => alert('Results copied to clipboard!')); this.closest('.fixed').remove()"
            class="w-full p-4 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-2xl transition-all duration-300 hover:scale-105"
          >
            Copy to Clipboard
          </button>
        </div>
        <button onclick="this.closest('.fixed').remove()" class="w-full mt-4 p-3 bg-gray-200 text-gray-800 font-bold rounded-2xl hover:bg-gray-300 transition-all duration-300">
          Cancel
        </button>
      </div>
    `
    
    document.body.appendChild(modal)
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove()
      }
    })
  }
  

  // Fetch real leaderboard data with user statistics


  // Fetch leaderboard data when results screen is reached
  useEffect(() => {
    if (gameState === "results") {
      fetchLeaderboardData()
    }
  }, [gameState, fetchLeaderboardData])


  // Handle when a user selects an answer
  // Shows feedback, updates score/streak, and moves to next question or results
  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return // Prevent double selection
    
    setSelectedAnswer(answerIndex)

    setTimeout(() => {
      const currentQuestion = quizQuestions[currentQuestionIndex]
      if (!currentQuestion) {
        console.error("Current question is undefined")
        return
      }
      
      const newUserAnswers = [...userAnswers, answerIndex]
      setUserAnswers(newUserAnswers)

      const isCorrect = answerIndex === currentQuestion.correctAnswer

      if (isCorrect) {
        setScore(prevScore => prevScore + 1)
        const newStreak = streak + 1
        setStreak(newStreak)
        setMaxStreak(prevMax => Math.max(prevMax, newStreak))

        // Show streak bonus animation if streak >= 3
        if (newStreak >= 3) {
          setShowStreakBonus(true)
          setTimeout(() => setShowStreakBonus(false), 2000)
        }
      } else {
        setStreak(0)
      }

      // Move to next question or show results
      if (currentQuestionIndex < quizQuestions.length - 1) {
        setQuestionTransition(true)
        setTimeout(() => {
          setCurrentQuestionIndex(prevIndex => prevIndex + 1)
          setSelectedAnswer(null)
          setQuestionTransition(false)
        }, 300)
      } else {
        setTimeout(() => {
          setGameState("results")
        }, 1000)
      }
    }, 1500)
  }


  // Get the current question object
  const currentQuestion = quizQuestions[currentQuestionIndex]

  // Show loading state when questions are being fetched
  if (questionsLoading) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <Header 
          title="Carbon Clash"
          centerMessage="🌍 Loading Quiz Questions... 🌱"
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-xl font-bold text-gray-700">Loading your eco-quiz...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error state if no questions loaded
  if (!questionsLoading && (quizQuestions.length === 0 || questionsError)) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <Header 
          title="Carbon Clash"
          centerMessage="🌍 Unable to Load Quiz 🌱"
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl font-bold text-gray-700 mb-4">Unable to load quiz questions.</p>
            <p className="text-lg text-gray-600 mb-2">Please check your connection and try again.</p>
            {questionsError && (
              <p className="text-sm text-red-600 mb-6">Error: {questionsError}</p>
            )}
            <Button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {gameState === "start" && (
        <div className="flex flex-col h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
          <Header 
            title="Carbon Clash"
            centerMessage="🌍 Test Your Eco-Knowledge! 🌱"
          />
          
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="w-full max-w-lg mx-auto animate-in fade-in-50 slide-in-from-bottom-8 duration-700">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-600 rounded-full mb-6 shadow-2xl animate-bounce">
                <Leaf className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-6xl font-black text-gray-900 mb-4 tracking-tight animate-in slide-in-from-top-4 duration-500 delay-200 drop-shadow-sm">
                Carbon Clash
              </h1>
              <p className="text-2xl text-gray-700 font-bold animate-in slide-in-from-top-4 duration-500 delay-300 drop-shadow-sm">
                Test your eco-knowledge!
              </p>
            </div>

            <div className="text-center space-y-8">
              <div className="flex justify-center gap-8 mb-8">
                <div className="flex flex-col items-center gap-3 animate-in slide-in-from-left-4 duration-500 delay-500">
                  <div className="w-16 h-16 bg-emerald-100 border-2 border-emerald-300 rounded-full flex items-center justify-center hover:bg-emerald-200 transition-all duration-200 hover:scale-110 transform">
                    <Zap className="w-8 h-8 text-emerald-700" />
                  </div>
                  <span className="text-lg font-bold text-gray-800">{quizQuestions.length} Questions</span>
                </div>
                <div className="flex flex-col items-center gap-3 animate-in slide-in-from-bottom-4 duration-500 delay-600">
                  <div className="w-16 h-16 bg-emerald-100 border-2 border-emerald-300 rounded-full flex items-center justify-center hover:bg-emerald-200 transition-all duration-200 hover:scale-110 transform">
                    <Trophy className="w-8 h-8 text-emerald-700" />
                  </div>
                  <span className="text-lg font-bold text-gray-800">Earn EcoPoints</span>
                </div>
                <div className="flex flex-col items-center gap-3 animate-in slide-in-from-right-4 duration-500 delay-700">
                  <div className="w-16 h-16 bg-emerald-100 border-2 border-emerald-300 rounded-full flex items-center justify-center hover:bg-emerald-200 transition-all duration-200 hover:scale-110 transform">
                    <Leaf className="w-8 h-8 text-emerald-700" />
                  </div>
                  <span className="text-lg font-bold text-gray-800">Learn Facts</span>
                </div>
              </div>

              <Button
                onClick={startQuiz}
                size="lg"
                className="w-full h-20 text-2xl font-black bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xl hover:shadow-3xl transition-all hover:scale-[1.05] active:scale-[0.95] animate-in slide-in-from-bottom-4 duration-500 delay-800 rounded-2xl"
                disabled={questionsLoading || quizQuestions.length === 0}
              >
                {questionsLoading ? "LOADING..." : "START QUIZ"}
              </Button>

              <p className="text-center text-lg text-gray-600 font-bold animate-in fade-in-50 duration-500 delay-1000">
                Test your eco-knowledge! 🌍
              </p>
            </div>
          </div>
          </div>
        </div>
      )}

      {gameState === "quiz" && currentQuestion && (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex flex-col">
          <div className="p-6 text-center">
            <div className="flex justify-between items-center mb-4 max-w-4xl mx-auto">
              <div className="text-gray-700 font-bold text-lg">
                {currentQuestionIndex + 1} / {quizQuestions.length}
              </div>
              <div className="flex items-center gap-6">
                {streak >= 2 && (
                  <div className="flex items-center gap-2 bg-orange-500 px-4 py-2 rounded-full animate-pulse">
                    <Flame className="w-5 h-5 text-white" />
                    <span className="text-white font-black">{streak} STREAK!</span>
                  </div>
                )}
                <div className="text-gray-900 font-black text-xl">SCORE: {score}</div>
              </div>
            </div>
            <div className="max-w-4xl mx-auto">
              <Progress value={progressAnimation} className="h-3 bg-emerald-200" />
            </div>
          </div>

          {showStreakBonus && (
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 animate-in zoom-in-50 fade-in-0 duration-500">
              <div className="p-8 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-2xl border-0 rounded-3xl">
                <div className="flex items-center gap-4 text-center">
                  <Flame className="w-12 h-12" />
                  <div>
                    <div className="text-3xl font-black">STREAK!</div>
                    <div className="text-xl font-bold">{streak} in a row!</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 flex flex-col justify-center p-6">
            <div className="max-w-6xl mx-auto w-full">
              <div
                className={`text-center mb-12 transition-all duration-300 ${
                  questionTransition ? "opacity-0 scale-95" : "opacity-100 scale-100"
                }`}
              >
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 leading-tight drop-shadow-sm px-4">
                  {currentQuestion?.question || "Loading question..."}
                </h2>
              </div>

              <div
                className={`grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto transition-all duration-300 ${
                  questionTransition ? "opacity-0 scale-95" : "opacity-100 scale-100"
                }`}
              >
                {/* Render answer choices as nature-themed buttons */}
                {currentQuestion && currentQuestion.options && currentQuestion.options.map((option, index) => {
                  const kahootColors = [
                    "bg-red-500 hover:bg-red-600", // Red
                    "bg-blue-500 hover:bg-blue-600", // Blue
                    "bg-yellow-500 hover:bg-yellow-600", // Yellow
                    "bg-green-500 hover:bg-green-600", // Green
                  ]

                  const natureIcons = [
                    { icon: Leaf, color: "text-white" },
                    { icon: Trees, color: "text-white" },
                    { icon: Flower, color: "text-white" },
                    { icon: Droplets, color: "text-white" }
                  ]

                  const IconComponent = natureIcons[index].icon

                  let buttonStyle = `h-32 md:h-40 text-white font-black text-xl md:text-2xl border-4 border-white/20 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl ${kahootColors[index]}`

                  // After an answer is selected, color the buttons:
                  // - Green for correct
                  // - Red for user's wrong selection
                  // - Gray for others
                  if (selectedAnswer !== null && currentQuestion) {
                    if (index === selectedAnswer) {
                      if (selectedAnswer === currentQuestion.correctAnswer) {
                        // User selected correct answer
                        buttonStyle =
                          "h-32 md:h-40 !bg-green-600 border-4 border-white text-white font-black text-xl md:text-2xl rounded-2xl animate-pulse shadow-2xl"
                      } else {
                        // User selected wrong answer
                        buttonStyle =
                          "h-32 md:h-40 !bg-red-600 border-4 border-white text-white font-black text-xl md:text-2xl rounded-2xl animate-pulse shadow-2xl"
                      }
                    } else if (index === currentQuestion.correctAnswer) {
                      // Show correct answer even if not selected
                      buttonStyle =
                        "h-32 md:h-40 !bg-green-600 border-4 border-white text-white font-black text-xl md:text-2xl rounded-2xl animate-pulse shadow-2xl"
                    } else {
                      // Dim all other options
                      buttonStyle =
                        "h-32 md:h-40 !bg-gray-400 border-4 border-gray-300 text-gray-600 font-black text-xl md:text-2xl rounded-2xl opacity-50 shadow-lg"
                    }
                  }

                  return (
                    <Button
                      key={index}
                      onClick={() => selectedAnswer === null && handleAnswerSelect(index)}
                      className={`${buttonStyle} animate-in zoom-in-50 flex flex-col items-center justify-center gap-2 p-6`}
                      style={{ animationDelay: `${index * 150}ms` }}
                      disabled={selectedAnswer !== null}
                    >
                      <IconComponent className="w-8 h-8 mb-2 text-white" />
                      <div className="text-center leading-tight">{option}</div>
                    </Button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Show eco fact after answering */}
          {selectedAnswer !== null && currentQuestion && (
            <div className="p-6">
              <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-8 fade-in-0 duration-500 border border-emerald-200">
                <div className="flex items-start gap-4">
                  <Leaf className="w-8 h-8 text-emerald-600 mt-1 flex-shrink-0 animate-bounce" />
                  <p className="text-lg font-bold text-gray-800 leading-relaxed">{currentQuestion?.ecoFact || "Interesting eco fact!"}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {gameState === "results" && (() => {
        // Calculate XP, performance, and leaderboard for results
        const totalXP = calculateXP(score)
        const performance = getPerformanceLevel(score, quizQuestions.length)
        const percentage = Math.round((score / quizQuestions.length) * 100)

        // Use real leaderboard data or fallback to mock data
        const displayLeaderboard = leaderboardData.length > 0
          ? leaderboardData.map((entry) => {
              if (entry.user_id === currentUserId && userXp !== null) {
                return {
                  ...entry,
                  user_statistics: {
                    ...entry.user_statistics,
                    xp: userXp,
                  },
                };
              }
              return entry;
            })
          : mockLeaderboard
              .map((entry) => (entry.name === "You" ? { ...entry, score, xp: totalXP } : entry))
              .sort((a, b) => b.score - a.score || b.xp - a.xp)

        // Get user's rank from state or fallback calculation
        const displayRank = leaderboardData.length > 0 ? userRank : 
          displayLeaderboard.findIndex((entry) => entry.name === "You") + 1

        // Format leaderboard entries for display
        const formatLeaderboardEntry = (entry: LeaderboardWithStats | MockLeaderboardEntry, index: number, currentUserId: string | null) => {
          // For real leaderboard data
          if ('user_id' in entry) {
            const ecoPoints = calculateEcoPoints(entry as LeaderboardWithStats)
            const isCurrentUser = currentUserId && entry.user_id === currentUserId
            return {
              key: entry.user_id || index,
              name: isCurrentUser ? "You" : (entry.name || "Anonymous"),
              score: ecoPoints.toFixed(1), // Show eco points like main leaderboard
              points: ecoPoints,
              isCurrentUser
            }
          }
          // For mock data
          const mockEntry = entry as MockLeaderboardEntry
          return {
            key: mockEntry.name || index,
            name: mockEntry.name,
            score: mockEntry.score,
            points: mockEntry.xp,
            isCurrentUser: mockEntry.name === "You"
          }
        }

        return (
          <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center py-12 animate-in zoom-in-50 fade-in-0 duration-700">
                <div className="inline-flex items-center justify-center w-32 h-32 mb-8 shadow-2xl animate-bounce overflow-hidden rounded-full">
                  <Image 
                    src="/Screenshot 2025-07-12 172658.png" 
                    alt="EcoQuest Logo" 
                    width={128} 
                    height={128}
                    className="object-cover rounded-full w-full h-full"
                  />
                </div>
                <h1 className="text-6xl font-black text-gray-900 mb-6 animate-in slide-in-from-top-4 duration-500 delay-200 drop-shadow-sm">
                  QUIZ COMPLETE!
                </h1>
                <div className="text-3xl font-black text-gray-700 mb-8 animate-in slide-in-from-top-4 duration-500 delay-300">
                  {performance.level}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-2xl mx-auto">
                  <div className="bg-emerald-100 border-2 border-emerald-300 p-8 rounded-3xl text-center animate-in slide-in-from-left-4 duration-500 delay-400">
                    <div className="text-5xl font-black text-emerald-700 mb-2 animate-pulse">{score}</div>
                    <div className="text-xl font-bold text-gray-700">CORRECT</div>
                  </div>
                  <div className="bg-emerald-100 border-2 border-emerald-300 p-8 rounded-3xl text-center animate-in slide-in-from-bottom-4 duration-500 delay-500">
                    <div className="text-5xl font-black text-emerald-700 mb-2 animate-pulse">{percentage}%</div>
                    <div className="text-xl font-bold text-gray-700">ACCURACY</div>
                  </div>
                  <div className="bg-emerald-100 border-2 border-emerald-300 p-8 rounded-3xl text-center animate-in slide-in-from-right-4 duration-500 delay-600">
                    {xpLoading ? (
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
                        <div className="text-xl font-bold text-gray-700">UPDATING XP...</div>
                      </div>
                    ) : (
                      <>
                        <div className="text-5xl font-black text-emerald-700 mb-2 animate-pulse">
                          +{totalXP.toFixed(1)}
                        </div>
                        <div className="text-xl font-bold text-gray-700">
                          ECOPOINTS GAINED
                        </div>
                        {maxStreak >= 3 && (
                          <div className="text-sm text-orange-600 font-medium mt-1">🔥 {maxStreak}-answer streak!</div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="flex gap-6 justify-center animate-in slide-in-from-bottom-4 duration-500 delay-900">
                  <Button
                    onClick={startQuiz}
                    className="h-16 px-8 text-xl font-black bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-300 hover:scale-105 active:scale-95 rounded-2xl shadow-2xl"
                  >
                    <RotateCcw className="w-6 h-6 mr-3" />
                    PLAY AGAIN
                  </Button>
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    className="h-16 px-8 text-xl font-black bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50 transition-all duration-300 hover:scale-105 active:scale-95 rounded-2xl"
                    data-share-button="true"
                  >
                    <Share2 className="w-6 h-6 mr-3" />
                    SHARE
                  </Button>
                </div>
              </div>

              <div className="bg-white border-2 border-emerald-200 p-8 rounded-3xl shadow-2xl animate-in slide-in-from-left-4 duration-500 delay-300">
                <div className="flex items-center gap-3 mb-6">
                  <Users className="w-8 h-8 text-emerald-600" />
                  <h2 className="text-3xl font-black text-gray-900">LEADERBOARD</h2>
                  <div className="ml-auto bg-emerald-600 text-white px-4 py-2 rounded-full font-black animate-pulse">
                    RANK #{displayRank}
                  </div>
                </div>

                <div className="space-y-3">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                      <span className="ml-3 text-gray-600">Loading leaderboard...</span>
                    </div>
                  ) : (
                    displayLeaderboard.slice(0, 5).map((entry: LeaderboardWithStats | MockLeaderboardEntry, index: number) => {
                      const formatted = formatLeaderboardEntry(entry, index, currentUserId)
                      return (
                        <div
                          key={formatted.key}
                          className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] animate-in slide-in-from-right-4 ${
                            formatted.isCurrentUser
                              ? "bg-emerald-100 border-2 border-emerald-300 shadow-lg"
                              : "bg-gray-100 hover:bg-gray-200"
                          }`}
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-black transition-all duration-200 ${
                                index === 0
                                  ? "bg-yellow-500 text-white animate-pulse"
                                  : index === 1
                                    ? "bg-gray-400 text-white"
                                    : index === 2
                                      ? "bg-amber-600 text-white"
                                      : "bg-gray-300 text-gray-700"
                              }`}
                            >
                              {index + 1}
                            </div>
                            <span
                              className={`text-xl font-black ${formatted.isCurrentUser ? "text-emerald-700" : "text-gray-900"}`}
                            >
                              {formatted.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-6 text-lg font-bold">
                            <span className="text-gray-600">
                              {typeof formatted.score === 'number' ? `${formatted.score}/10` : formatted.score}
                            </span>
                            <span className="text-emerald-600">{formatted.points} {leaderboardData.length > 0 ? 'Eco Points' : 'XP'}</span>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })()}
    </>
  )
}
