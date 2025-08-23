"use client"

import Header from "@/app/components/Header"
import { Code, Flame, Leaf, RotateCcw, Share2, Star, Trophy, Users, Zap } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "../ui/Button"
import { Progress } from "../ui/Progress"

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  ecoFact: string
}

const quizQuestions: Question[] = [
  {
    id: 1,
    question: "What percentage of the world's electricity comes from renewable sources?",
    options: ["15%", "28%", "42%", "55%"],
    correctAnswer: 1,
    ecoFact: "Renewable energy now accounts for 28% of global electricity generation!",
  },
  {
    id: 2,
    question: "How much energy does recycling aluminum save compared to producing new aluminum?",
    options: ["50%", "75%", "95%", "99%"],
    correctAnswer: 2,
    ecoFact: "Recycling aluminum saves 95% of the energy compared to producing new aluminum!",
  },
  {
    id: 3,
    question: "What is the most effective way to reduce your carbon footprint?",
    options: ["Recycling more", "Using LED bulbs", "Eating less meat", "Taking shorter showers"],
    correctAnswer: 2,
    ecoFact: "Reducing meat consumption can cut your carbon footprint by up to 73%!",
  },
  {
    id: 4,
    question: "How long does it take for a plastic bottle to decompose?",
    options: ["50 years", "100 years", "450 years", "1000 years"],
    correctAnswer: 2,
    ecoFact: "Plastic bottles take up to 450 years to decompose in landfills!",
  },
  {
    id: 5,
    question: "What percentage of ocean plastic pollution comes from land-based sources?",
    options: ["40%", "60%", "80%", "95%"],
    correctAnswer: 2,
    ecoFact: "About 80% of ocean plastic pollution originates from land-based sources!",
  },
  {
    id: 6,
    question: "Which transportation method has the lowest carbon emissions per mile?",
    options: ["Electric car", "Bus", "Train", "Bicycle"],
    correctAnswer: 3,
    ecoFact: "Bicycles produce zero emissions and are the most eco-friendly transport option!",
  },
  {
    id: 7,
    question: "How much water can a single dripping faucet waste per year?",
    options: ["100 gallons", "500 gallons", "1,000 gallons", "3,000 gallons"],
    correctAnswer: 2,
    ecoFact: "A single dripping faucet can waste over 3,000 gallons of water per year!",
  },
  {
    id: 8,
    question: "What percentage of food produced globally is wasted?",
    options: ["10%", "20%", "33%", "50%"],
    correctAnswer: 2,
    ecoFact: "About one-third of all food produced globally is wasted, contributing to climate change!",
  },
  {
    id: 9,
    question: "Which renewable energy source is growing the fastest worldwide?",
    options: ["Wind", "Solar", "Hydroelectric", "Geothermal"],
    correctAnswer: 1,
    ecoFact: "Solar energy is the fastest-growing renewable energy source globally!",
  },
  {
    id: 10,
    question: "How many trees does it take to offset the CO2 from one car per year?",
    options: ["5 trees", "15 trees", "31 trees", "50 trees"],
    correctAnswer: 2,
    ecoFact: "It takes about 31 trees to offset the CO2 emissions from one car per year!",
  },
]

const mockLeaderboard = [
  { name: "EcoWarrior", score: 10, xp: 1000 },
  { name: "GreenGuru", score: 9, xp: 900 },
  { name: "ClimateChamp", score: 9, xp: 850 },
  { name: "You", score: 0, xp: 0 }, // Will be updated with user's score
  { name: "TreeHugger", score: 8, xp: 800 },
  { name: "SolarSage", score: 7, xp: 700 },
  { name: "WindWizard", score: 7, xp: 650 },
]

const getPerformanceLevel = (score: number, totalQuestions: number) => {
  const percentage = (score / totalQuestions) * 100
  if (percentage >= 90) return { level: "Eco Master", color: "bg-green-500", icon: Trophy }
  if (percentage >= 70) return { level: "Green Guardian", color: "bg-emerald-500", icon: Star }
  if (percentage >= 50) return { level: "Climate Conscious", color: "bg-teal-500", icon: Leaf }
  return { level: "Eco Learner", color: "bg-blue-500", icon: Zap }
}

const calculateXP = (score: number, totalQuestions: number) => {
  const baseXP = score * 100
  const bonusXP = score === totalQuestions ? 200 : 0 // Perfect score bonus
  return baseXP + bonusXP
}

export default function CarbonClashQuiz() {
  const [gameState, setGameState] = useState<"start" | "quiz" | "results">("start")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [userAnswers, setUserAnswers] = useState<number[]>([])
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [showStreakBonus, setShowStreakBonus] = useState(false)
  const [questionTransition, setQuestionTransition] = useState(false)
  const [progressAnimation, setProgressAnimation] = useState(0)

  useEffect(() => {
    if (gameState === "quiz") {
      const targetProgress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100
      const timer = setTimeout(() => setProgressAnimation(targetProgress), 100)
      return () => clearTimeout(timer)
    }
  }, [currentQuestionIndex, gameState])

  const startQuiz = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setScore(0)
    setUserAnswers([])
    setStreak(0)
    setMaxStreak(0)
    setShowStreakBonus(false)
    setQuestionTransition(false)
    setProgressAnimation(0)
    setGameState("quiz")
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)

    setTimeout(() => {
      const currentQuestion = quizQuestions[currentQuestionIndex]
      const newUserAnswers = [...userAnswers, answerIndex]
      setUserAnswers(newUserAnswers)

      const isCorrect = answerIndex === currentQuestion.correctAnswer

      if (isCorrect) {
        setScore(score + 1)
        const newStreak = streak + 1
        setStreak(newStreak)
        setMaxStreak(Math.max(maxStreak, newStreak))

        if (newStreak >= 3) {
          setShowStreakBonus(true)
          setTimeout(() => setShowStreakBonus(false), 2000)
        }
      } else {
        setStreak(0)
      }

      if (currentQuestionIndex < quizQuestions.length - 1) {
        setQuestionTransition(true)
        setTimeout(() => {
          setCurrentQuestionIndex(currentQuestionIndex + 1)
          setSelectedAnswer(null)
          setQuestionTransition(false)
        }, 300)
      } else {
        setGameState("results")
      }
    }, 1500)
  }

  const currentQuestion = quizQuestions[currentQuestionIndex]

  if (gameState === "start") {
    return (
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
                <span className="text-lg font-bold text-gray-800">10 Questions</span>
              </div>
              <div className="flex flex-col items-center gap-3 animate-in slide-in-from-bottom-4 duration-500 delay-600">
                <div className="w-16 h-16 bg-emerald-100 border-2 border-emerald-300 rounded-full flex items-center justify-center hover:bg-emerald-200 transition-all duration-200 hover:scale-110 transform">
                  <Trophy className="w-8 h-8 text-emerald-700" />
                </div>
                <span className="text-lg font-bold text-gray-800">Earn XP</span>
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
              className="w-full h-20 text-2xl font-black bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-[1.05] active:scale-[0.95] animate-in slide-in-from-bottom-4 duration-500 delay-800 rounded-2xl"
            >
              START QUIZ
            </Button>

            <p className="text-center text-lg text-gray-600 font-bold animate-in fade-in-50 duration-500 delay-1000">
              Join the eco revolution! 🌍
            </p>
          </div>
        </div>
        </div>
      </div>
    )
  }

  if (gameState === "quiz") {
    return (
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
                  <div className="text-3xl font-black">STREAK BONUS!</div>
                  <div className="text-xl font-bold">+{streak * 10} XP</div>
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
                {currentQuestion.question}
              </h2>
            </div>

            <div
              className={`grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto transition-all duration-300 ${
                questionTransition ? "opacity-0 scale-95" : "opacity-100 scale-100"
              }`}
            >
              {currentQuestion.options.map((option, index) => {
                const kahootColors = [
                  "bg-red-500 hover:bg-red-600", // Red
                  "bg-blue-500 hover:bg-blue-600", // Blue
                  "bg-yellow-500 hover:bg-yellow-600", // Yellow
                  "bg-green-500 hover:bg-green-600", // Green
                ]

                const shapes = ["▲", "♦", "●", "■"]

                let buttonStyle = `h-32 md:h-40 text-white font-black text-xl md:text-2xl border-4 border-white/20 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl ${kahootColors[index]}`

                if (selectedAnswer !== null) {
                  if (index === currentQuestion.correctAnswer) {
                    buttonStyle =
                      "h-32 md:h-40 bg-green-600 border-4 border-white text-white font-black text-xl md:text-2xl rounded-2xl animate-pulse shadow-2xl"
                  } else if (index === selectedAnswer) {
                    buttonStyle =
                      "h-32 md:h-40 bg-red-600 border-4 border-white text-white font-black text-xl md:text-2xl rounded-2xl animate-pulse shadow-2xl"
                  } else {
                    buttonStyle =
                      "h-32 md:h-40 bg-gray-400 border-4 border-gray-300 text-gray-600 font-black text-xl md:text-2xl rounded-2xl opacity-50 shadow-lg"
                  }
                }

                return (
                  <Button
                    key={index}
                    onClick={() => selectedAnswer === null && handleAnswerSelect(index)}
                    className={`${buttonStyle} animate-in zoom-in-50 duration-300 flex flex-col items-center justify-center gap-2 p-6`}
                    style={{ animationDelay: `${index * 150}ms` }}
                    disabled={selectedAnswer !== null}
                  >
                    <div className="text-4xl mb-2">{shapes[index]}</div>
                    <div className="text-center leading-tight">{option}</div>
                  </Button>
                )
              })}
            </div>
          </div>
        </div>

        {selectedAnswer !== null && (
          <div className="p-6">
            <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-8 fade-in-0 duration-500 border border-emerald-200">
              <div className="flex items-start gap-4">
                <Leaf className="w-8 h-8 text-emerald-600 mt-1 flex-shrink-0 animate-bounce" />
                <p className="text-lg font-bold text-gray-800 leading-relaxed">{currentQuestion.ecoFact}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (gameState === "results") {
    const earnedXP = calculateXP(score, quizQuestions.length)
    const streakBonus = maxStreak >= 3 ? maxStreak * 10 : 0
    const totalXP = earnedXP + streakBonus
    const performance = getPerformanceLevel(score, quizQuestions.length)
    const percentage = Math.round((score / quizQuestions.length) * 100)

    const updatedLeaderboard = mockLeaderboard
      .map((entry) => (entry.name === "You" ? { ...entry, score, xp: totalXP } : entry))
      .sort((a, b) => b.score - a.score || b.xp - a.xp)

    const userRank = updatedLeaderboard.findIndex((entry) => entry.name === "You") + 1

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center py-12 animate-in zoom-in-50 fade-in-0 duration-700">
            <div
              className={`inline-flex items-center justify-center w-32 h-32 bg-emerald-600 rounded-full mb-8 shadow-2xl animate-bounce`}
            >
              <performance.icon className="w-16 h-16 text-white" />
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
                <div className="text-5xl font-black text-emerald-700 mb-2 animate-pulse">+{totalXP}</div>
                <div className="text-xl font-bold text-gray-700">XP EARNED</div>
                {streakBonus > 0 && (
                  <div className="text-lg text-orange-600 font-bold mt-2">+{streakBonus} streak bonus!</div>
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
                variant="outline"
                className="h-16 px-8 text-xl font-black bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50 transition-all duration-300 hover:scale-105 active:scale-95 rounded-2xl"
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
                RANK #{userRank}
              </div>
            </div>

            <div className="space-y-3">
              {updatedLeaderboard.slice(0, 5).map((entry, index) => (
                <div
                  key={entry.name}
                  className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] animate-in slide-in-from-right-4 ${
                    entry.name === "You"
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
                      className={`text-xl font-black ${entry.name === "You" ? "text-emerald-700" : "text-gray-900"}`}
                    >
                      {entry.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-lg font-bold">
                    <span className="text-gray-600">{entry.score}/10</span>
                    <span className="text-emerald-600">{entry.xp} XP</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
