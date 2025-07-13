"use client"

import {
  BookOpen,
  Check,
  Clock,
  Edit,
  MoreVertical,
  Plus,
  Send,
  Target,
  Trash2,
  TrendingUp,
  Trophy,
  User
} from "lucide-react"
import { useState } from "react"
import { Badge } from "../ui/Badge"
import { Button } from "../ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Input } from "../ui/Input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/Select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Textarea } from "../ui/Textarea"

type YearType = "Freshman" | "Sophomore" | "Junior" | "Senior"
type CourseType = "Regular" | "Honors" | "AP" | "IB" | "Dual Enrollment"

interface Course {
  id: string
  name: string
  credits: number
  examDate: string
  description: string
  year: YearType
  grade?: string
  courseType: CourseType
}

interface ExtracurricularActivity {
  id: string
  name: string
  role: string
  hours: number
  description: string
  year: YearType
}

interface TestScore {
  id: string
  testName: string
  score: string
  date: string
  target: string
  year: YearType
}

export default function Component() {
  const [selectedYear, setSelectedYear] = useState<YearType>("Freshman")
  const [courses, setCourses] = useState<Course[]>([
    {
      id: "1",
      name: "AP Biology",
      credits: 3,
      examDate: "5/18/25",
      description: "Brief 1-2 sentence description of the course curriculum",
      year: "Junior",
      grade: "A",
      courseType: "AP",
    },
    {
      id: "2",
      name: "AP Macroeconomics",
      credits: 3,
      examDate: "5/8/25",
      description: "Study of economic principles and market behavior",
      year: "Junior",
      grade: "B+",
      courseType: "AP",
    },
    {
      id: "3",
      name: "Honors English",
      credits: 4,
      examDate: "6/1/24",
      description: "Literature and composition with advanced writing techniques",
      year: "Sophomore",
      grade: "A-",
      courseType: "Honors",
    },
    {
      id: "4",
      name: "Regular Math",
      credits: 4,
      examDate: "6/1/24",
      description: "Standard mathematics curriculum",
      year: "Freshman",
      grade: "B+",
      courseType: "Regular",
    },
  ])

  const [activities, setActivities] = useState<ExtracurricularActivity[]>([
    {
      id: "1",
      name: "Student Council",
      role: "Vice President",
      hours: 120,
      description: "Leadership and event planning for school activities",
      year: "Junior",
    },
    {
      id: "2",
      name: "Debate Team",
      role: "Member",
      hours: 80,
      description: "Public speaking and research skills development",
      year: "Sophomore",
    },
    {
      id: "3",
      name: "Math Club",
      role: "Treasurer",
      hours: 60,
      description: "Mathematics competitions and peer tutoring",
      year: "Freshman",
    },
  ])

  const [testScores, setTestScores] = useState<TestScore[]>([
    {
      id: "1",
      testName: "SAT",
      score: "1450",
      date: "10/15/24",
      target: "1500",
      year: "Junior",
    },
    {
      id: "2",
      testName: "PSAT",
      score: "1380",
      date: "10/15/23",
      target: "1400",
      year: "Sophomore",
    },
  ])

  const [newCourse, setNewCourse] = useState({
    name: "",
    credits: 3,
    examDate: "",
    description: "",
    grade: "",
    courseType: "Regular" as CourseType,
  })

  const [newActivity, setNewActivity] = useState({
    name: "",
    role: "",
    hours: 0,
    description: "",
  })

  const [newTest, setNewTest] = useState({
    testName: "",
    score: "",
    date: "",
    target: "",
  })

  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [editingActivity, setEditingActivity] = useState<ExtracurricularActivity | null>(null)
  const [editingTest, setEditingTest] = useState<TestScore | null>(null)
  const [isEditCourseDialogOpen, setIsEditCourseDialogOpen] = useState(false)
  const [isEditActivityDialogOpen, setIsEditActivityDialogOpen] = useState(false)
  const [isEditTestDialogOpen, setIsEditTestDialogOpen] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isActivityDialogOpen, setIsActivityDialogOpen] = useState(false)
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false)
  const [aiInput, setAiInput] = useState("")
  const [aiMessages, setAiMessages] = useState([
    {
      id: "1",
      text: "Hi! I'm Slate. Ask me anything about course planning, college prep, or academic strategies. I'm here to help you succeed!",
      isAi: true,
    },
  ])
  const [gpaType, setGpaType] = useState<"weighted" | "unweighted">("unweighted")
  const [targetGPA, setTargetGPA] = useState(4.0)
  const [currentGPA, setCurrentGPA] = useState(3.5)
  const [weightedGpaScale, setWeightedGpaScale] = useState(5.0)

  // Enhanced GPA calculation functions
  const gradeToPoints = (grade: string): number => {
    const basePoints: { [key: string]: number } = {
      "A+": 4.0,
      A: 4.0,
      "A-": 3.7,
      "B+": 3.3,
      B: 3.0,
      "B-": 2.7,
      "C+": 2.3,
      C: 2.0,
      "C-": 1.7,
      "D+": 1.3,
      D: 1.0,
      "D-": 0.7,
      F: 0.0,
    }
    return basePoints[grade] || 0
  }

  const getCourseWeight = (courseType: CourseType): number => {
    const weights: { [key in CourseType]: number } = {
      Regular: 0.0,
      Honors: 0.5,
      AP: 1.0,
      IB: 1.0,
      "Dual Enrollment": 1.0,
    }
    return weights[courseType]
  }

  const calculateGPA = (courses: Course[], weighted = false, yearFilter?: YearType): number => {
    let filteredCourses = courses.filter((course) => course.grade)
    if (yearFilter) {
      filteredCourses = filteredCourses.filter((course) => course.year === yearFilter)
    }

    if (filteredCourses.length === 0) return 0

    let totalPoints = 0
    let totalCredits = 0

    filteredCourses.forEach((course) => {
      const basePoints = gradeToPoints(course.grade!)
      let finalPoints = basePoints

      if (weighted && basePoints > 0) {
        const weight = getCourseWeight(course.courseType)
        finalPoints = Math.min(basePoints + weight, weightedGpaScale)
      }

      totalPoints += finalPoints * course.credits
      totalCredits += course.credits
    })

    return totalCredits > 0 ? totalPoints / totalCredits : 0
  }

  // Calculate current year GPA
  const currentYearGPA = calculateGPA(courses, gpaType === "weighted", selectedYear)
  // Calculate cumulative GPA (all years)
  const cumulativeGPA = calculateGPA(courses, gpaType === "weighted")

  // Filter data by selected year
  const filteredCourses = courses.filter((course) => course.year === selectedYear)
  const filteredActivities = activities.filter((activity) => activity.year === selectedYear)
  const filteredTests = testScores.filter((test) => test.year === selectedYear)

  // Check if a year has at least one academic class (for checkmark logic)
  const hasAcademicClass = (year: YearType) => {
    return courses.some((c) => c.year === year)
  }

  // Check if a year has any content (for current/future logic, not for checkmark)
  const hasContent = (year: YearType) => {
    return (
      (courses.some((c) => c.year === year) || activities.some((a) => a.year === year)) &&
      testScores.some((t) => t.year === year)
    )
  }

  // Get year completion status
  const getYearStatus = (year: YearType) => {
    const yearOrder: YearType[] = ["Freshman", "Sophomore", "Junior", "Senior"]
    const currentIndex = yearOrder.indexOf(selectedYear)
    const yearIndex = yearOrder.indexOf(year)

    if (hasContent(year)) {
      return "completed"
    } else if (yearIndex <= currentIndex) {
      return "current"
    } else {
      return "future"
    }
  }

  const addCourse = () => {
    if (newCourse.name.trim()) {
      const course: Course = {
        id: Date.now().toString(),
        name: newCourse.name,
        credits: newCourse.credits,
        examDate: newCourse.examDate,
        description: newCourse.description || "Brief course description",
        year: selectedYear,
        grade: newCourse.grade,
        courseType: newCourse.courseType,
      }
      setCourses([...courses, course])
      setNewCourse({ name: "", credits: 3, examDate: "", description: "", grade: "", courseType: "Regular" })
      setIsDialogOpen(false)
    }
  }

  const addActivity = () => {
    if (newActivity.name.trim()) {
      const activity: ExtracurricularActivity = {
        id: Date.now().toString(),
        name: newActivity.name,
        role: newActivity.role,
        hours: newActivity.hours,
        description: newActivity.description,
        year: selectedYear,
      }
      setActivities([...activities, activity])
      setNewActivity({ name: "", role: "", hours: 0, description: "" })
      setIsActivityDialogOpen(false)
    }
  }

  const addTest = () => {
    if (newTest.testName.trim()) {
      const test: TestScore = {
        id: Date.now().toString(),
        testName: newTest.testName,
        score: newTest.score,
        date: newTest.date,
        target: newTest.target,
        year: selectedYear,
      }
      setTestScores([...testScores, test])
      setNewTest({ testName: "", score: "", date: "", target: "" })
      setIsTestDialogOpen(false)
    }
  }

  const editCourse = () => {
    if (editingCourse && newCourse.name.trim()) {
      const updatedCourses = courses.map((course) =>
        course.id === editingCourse.id
          ? {
              ...course,
              name: newCourse.name,
              credits: newCourse.credits,
              examDate: newCourse.examDate,
              description: newCourse.description || "Brief course description",
              grade: newCourse.grade,
              courseType: newCourse.courseType,
            }
          : course,
      )
      setCourses(updatedCourses)
      setNewCourse({ name: "", credits: 3, examDate: "", description: "", grade: "", courseType: "Regular" })
      setEditingCourse(null)
      setIsEditCourseDialogOpen(false)
    }
  }

  const editActivity = () => {
    if (editingActivity && newActivity.name.trim()) {
      const updatedActivities = activities.map((activity) =>
        activity.id === editingActivity.id
          ? {
              ...activity,
              name: newActivity.name,
              role: newActivity.role,
              hours: newActivity.hours,
              description: newActivity.description,
            }
          : activity,
      )
      setActivities(updatedActivities)
      setNewActivity({ name: "", role: "", hours: 0, description: "" })
      setEditingActivity(null)
      setIsEditActivityDialogOpen(false)
    }
  }

  const editTest = () => {
    if (editingTest && newTest.testName.trim()) {
      const updatedTests = testScores.map((test) =>
        test.id === editingTest.id
          ? { ...test, testName: newTest.testName, score: newTest.score, date: newTest.date, target: newTest.target }
          : test,
      )
      setTestScores(updatedTests)
      setNewTest({ testName: "", score: "", date: "", target: "" })
      setEditingTest(null)
      setIsEditTestDialogOpen(false)
    }
  }

  const startEditCourse = (course: Course) => {
    setEditingCourse(course)
    setNewCourse({
      name: course.name,
      credits: course.credits,
      examDate: course.examDate,
      description: course.description,
      grade: course.grade || "",
      courseType: course.courseType,
    })
    setIsEditCourseDialogOpen(true)
  }

  const startEditActivity = (activity: ExtracurricularActivity) => {
    setEditingActivity(activity)
    setNewActivity({
      name: activity.name,
      role: activity.role,
      hours: activity.hours,
      description: activity.description,
    })
    setIsEditActivityDialogOpen(true)
  }

  const startEditTest = (test: TestScore) => {
    setEditingTest(test)
    setNewTest({
      testName: test.testName,
      score: test.score,
      date: test.date,
      target: test.target,
    })
    setIsEditTestDialogOpen(true)
  }

  const removeCourse = (id: string) => {
    setCourses(courses.filter((course) => course.id !== id))
  }

  const removeActivity = (id: string) => {
    setActivities(activities.filter((activity) => activity.id !== id))
  }

  const removeTest = (id: string) => {
    setTestScores(testScores.filter((test) => test.id !== id))
  }

  const handleAiSubmit = () => {
    if (aiInput.trim()) {
      // Add user message
      const userMessage = {
        id: Date.now().toString(),
        text: aiInput,
        isAi: false,
      }

      // Generate AI response
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        text: `You asked: "${aiInput}"\n\nBased on your current academic profile with a cumulative GPA of ${cumulativeGPA.toFixed(2)}, here are some personalized recommendations:\n\n• Consider adding more ${gpaType === "weighted" ? "AP/Honors" : "challenging"} courses to boost your GPA\n• Focus on improving grades in high-credit courses for maximum impact\n• Your ${selectedYear} year shows great potential - keep up the excellent work!\n\nWould you like specific course recommendations or study strategies?`,
        isAi: true,
      }

      setAiMessages([...aiMessages, userMessage, aiResponse])
      setAiInput("")
    }
  }

  const years: YearType[] = ["Freshman", "Sophomore", "Junior", "Senior"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Highschool Roadmap</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Time</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Date</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Academic Dashboard in Blue Container */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-b from-[#4790B480] to-[#2DA9E880] rounded-3xl p-6 shadow-xl">
              {/* Interactive Path Overview */}
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg mb-6">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-800">Select Academic Year</CardTitle>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      Currently Planning: {selectedYear}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between relative">
                    {/* Progress Line */}
                    <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200">
                      <div
                        className="h-full bg-teal-500 transition-all duration-300"
                        style={{
                          width: `${(years.indexOf(selectedYear) / (years.length - 1)) * 100}%`,
                        }}
                      ></div>
                    </div>
                    {/* Interactive Year Steps */}
                    <div className="flex justify-between w-full relative z-10">
                      {years.map((year) => {
                        const status = getYearStatus(year)
                        const isSelected = selectedYear === year
                        const isCompleted = hasAcademicClass(year)
                        return (
                          <div key={year} className="flex flex-col items-center">
                            <button
                              onClick={() => setSelectedYear(year)}
                              className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-200 hover:scale-110 ${
                                isSelected
                                  ? "bg-blue-500 ring-4 ring-blue-200"
                                  : isCompleted
                                    ? "bg-teal-500 hover:bg-teal-600"
                                    : "bg-gray-200 hover:bg-gray-300"
                              }`}
                            >
                              {isCompleted ? (
                                <Check className="w-6 h-6 text-white" />
                              ) : (
                                <div
                                  className={`w-3 h-3 rounded-full ${isSelected ? "bg-white" : "bg-gray-400"}`}
                                ></div>
                              )}
                            </button>
                            <span
                              className={`text-sm font-medium transition-colors ${
                                isSelected ? "text-blue-700 font-bold" : isCompleted ? "text-gray-700" : "text-gray-500"
                              }`}
                            >
                              {year}
                            </span>
                            {isSelected && (
                              <div className="mt-1 px-2 py-1 bg-blue-100 rounded-full">
                                <span className="text-xs text-blue-700 font-medium">Active</span>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  {/* Year Summary */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-teal-600">{filteredCourses.length}</div>
                        <div className="text-xs text-gray-600">Courses</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-purple-600">{filteredActivities.length}</div>
                        <div className="text-xs text-gray-600">Activities</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-orange-600">{filteredTests.length}</div>
                        <div className="text-xs text-gray-600">Tests</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tabbed Sections */}
              <Tabs defaultValue="academics" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-white/20 backdrop-blur-sm">
                  <TabsTrigger
                    value="academics"
                    className="text-white data-[state=active]:bg-white/30 data-[state=active]:text-white"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Academics ({filteredCourses.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="extracurriculars"
                    className="text-white data-[state=active]:bg-white/30 data-[state=active]:text-white"
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    Extracurriculars ({filteredActivities.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="testing"
                    className="text-white data-[state=active]:bg-white/30 data-[state=active]:text-white"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Testing ({filteredTests.length})
                  </TabsTrigger>
                </TabsList>

                {/* Academics Tab */}
                <TabsContent value="academics" className="space-y-4 mt-6">
                  <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        {/* Left side - GPA Target and AI suggestions */}
                        <div className="flex-1 max-w-md">
                          <div className="flex items-center gap-3 mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">GPA Target</h3>
                            <Select
                              value={gpaType}
                              onValueChange={(value: "weighted" | "unweighted") => setGpaType(value)}
                            >
                              <SelectTrigger className="w-32 h-8 bg-teal-600 text-white border-0 text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-white border shadow-lg">
                                <SelectItem value="unweighted" className="text-gray-900 hover:bg-gray-100">
                                  Unweighted
                                </SelectItem>
                                <SelectItem value="weighted" className="text-gray-900 hover:bg-gray-100">
                                  Weighted
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          {/* Target GPA Input */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                step="0.1"
                                min="0"
                                max={gpaType === "weighted" ? weightedGpaScale : 4.0}
                                value={targetGPA}
                                onChange={(e) => setTargetGPA(Number.parseFloat(e.target.value) || 0)}
                                className="w-16 h-10 text-center text-lg font-semibold text-black"
                              />
                              <span className="text-gray-600">out of</span>
                              {gpaType === "weighted" ? (
                                <Input
                                  type="number"
                                  step="0.1"
                                  min="4.0"
                                  max="10.0"
                                  value={weightedGpaScale}
                                  onChange={(e) => setWeightedGpaScale(Number.parseFloat(e.target.value) || 5.0)}
                                  className="w-16 h-10 text-center text-lg font-semibold text-black"
                                />
                              ) : (
                                <span className="text-lg font-semibold text-gray-800">4.0</span>
                              )}
                            </div>
                            {gpaType === "weighted" && (
                              <p className="text-xs text-gray-500">Adjust the weighted GPA scale (typically 5.0-6.0)</p>
                            )}
                          </div>
                          {/* AI Suggestions Textarea */}
                          <div className="mt-4">
                            <Textarea
                              placeholder="AI recommendations will appear here based on your current GPA and target..."
                              className="min-h-[120px] resize-none text-sm text-gray-600 bg-gray-50 border-gray-200"
                              readOnly
                              value={`Based on your current courses and grades, consider adding more ${gpaType === "weighted" ? "AP/Honors" : "challenging"} classes to ${gpaType === "weighted" ? "boost your weighted GPA" : "improve your unweighted GPA"}. Focus on improving grades in high-credit courses for maximum impact.

Current breakdown:
- Regular courses: +0.0 weight
- Honors courses: +0.5 weight  
- AP/IB/Dual Enrollment: +1.0 weight

Your ${selectedYear} GPA: ${currentYearGPA.toFixed(2)}
Cumulative GPA: ${cumulativeGPA.toFixed(2)}`}
                            />
                          </div>
                        </div>
                        {/* Right side - GPA Circles */}
                        <div className="flex gap-6 items-center">
                          {/* Current Year GPA Circle */}
                          <div className="flex flex-col items-center">
                            <div className="relative w-24 h-24 mb-2">
                              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                                <path
                                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                  fill="none"
                                  stroke="#e5e7eb"
                                  strokeWidth="3"
                                />
                                <path
                                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                  fill="none"
                                  stroke="#3b82f6"
                                  strokeWidth="3"
                                  strokeDasharray={`${(currentYearGPA / (gpaType === "weighted" ? weightedGpaScale : 4)) * 100}, 100`}
                                />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-xl font-bold text-gray-800">{currentYearGPA.toFixed(2)}</span>
                                <span className="text-xs text-gray-500">{selectedYear}</span>
                              </div>
                            </div>
                            <div className="text-sm font-medium text-gray-700">{selectedYear} GPA</div>
                          </div>
                          {/* Cumulative GPA Circle */}
                          <div className="flex flex-col items-center">
                            <div className="relative w-24 h-24 mb-2">
                              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                                <path
                                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                  fill="none"
                                  stroke="#e5e7eb"
                                  strokeWidth="3"
                                />
                                <path
                                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                  fill="none"
                                  stroke="#10b981"
                                  strokeWidth="3"
                                  strokeDasharray={`${(cumulativeGPA / (gpaType === "weighted" ? weightedGpaScale : 4)) * 100}, 100`}
                                />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-xl font-bold text-gray-800">{cumulativeGPA.toFixed(2)}</span>
                                <span className="text-xs text-gray-500">
                                  <TrendingUp className="w-3 h-3 inline mr-1" />
                                  All Years
                                </span>
                              </div>
                            </div>
                            <div className="text-sm font-medium text-gray-700">Cumulative GPA</div>
                          </div>
                          {/* Target GPA Circle */}
                          <div className="flex flex-col items-center">
                            <div className="relative w-24 h-24 mb-2">
                              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                                <path
                                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                  fill="none"
                                  stroke="#e5e7eb"
                                  strokeWidth="3"
                                />
                                <path
                                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                  fill="none"
                                  stroke="#f59e0b"
                                  strokeWidth="3"
                                  strokeDasharray={`${(targetGPA / (gpaType === "weighted" ? weightedGpaScale : 4)) * 100}, 100`}
                                />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-xl font-bold text-gray-800">{targetGPA.toFixed(2)}</span>
                                <span className="text-xs text-gray-500">Target</span>
                              </div>
                            </div>
                            <div className="text-sm font-medium text-gray-700">Target GPA</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                      <CardTitle className="text-lg font-semibold text-gray-800">Courses - {selectedYear}</CardTitle>
                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="bg-teal-500 hover:bg-teal-600 text-white">
                            <Plus className="w-4 h-4 mr-1" />
                            Add Course
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md bg-white text-gray-900 border shadow-lg">
                          <DialogHeader>
                            <DialogTitle>Add New Course for {selectedYear}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="courseName" className="text-gray-700 font-medium">
                                Course Name
                              </Label>
                              <Input
                                id="courseName"
                                placeholder="e.g., AP Chemistry"
                                value={newCourse.name}
                                onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="courseType" className="text-gray-700 font-medium">
                                Course Type
                              </Label>
                              <Select
                                value={newCourse.courseType}
                                onValueChange={(value: CourseType) => setNewCourse({ ...newCourse, courseType: value })}
                              >
                                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                                  <SelectValue placeholder="Select course type" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border shadow-lg">
                                  <SelectItem value="Regular" className="text-gray-900 hover:bg-gray-100">
                                    Regular (+0.0)
                                  </SelectItem>
                                  <SelectItem value="Honors" className="text-gray-900 hover:bg-gray-100">
                                    Honors (+0.5)
                                  </SelectItem>
                                  <SelectItem value="AP" className="text-gray-900 hover:bg-gray-100">
                                    AP (+1.0)
                                  </SelectItem>
                                  <SelectItem value="IB" className="text-gray-900 hover:bg-gray-100">
                                    IB (+1.0)
                                  </SelectItem>
                                  <SelectItem value="Dual Enrollment" className="text-gray-900 hover:bg-gray-100">
                                    Dual Enrollment (+1.0)
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="credits" className="text-gray-700 font-medium">
                                Credits
                              </Label>
                              <Input
                                id="credits"
                                type="number"
                                step="0.5"
                                min="0"
                                max="10"
                                placeholder="e.g., 3.5"
                                value={newCourse.credits}
                                onChange={(e) =>
                                  setNewCourse({ ...newCourse, credits: Number.parseFloat(e.target.value) || 0 })
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="examDate" className="text-gray-700 font-medium">
                                Exam Date
                              </Label>
                              <Input
                                id="examDate"
                                placeholder="e.g., 5/15/25"
                                value={newCourse.examDate}
                                onChange={(e) => setNewCourse({ ...newCourse, examDate: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="description" className="text-gray-700 font-medium">
                                Description
                              </Label>
                              <Input
                                id="description"
                                placeholder="Course description"
                                value={newCourse.description}
                                onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="grade" className="text-gray-700 font-medium">
                                Grade (Optional)
                              </Label>
                              <Select
                                value={newCourse.grade}
                                onValueChange={(value) => setNewCourse({ ...newCourse, grade: value })}
                              >
                                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                                  <SelectValue placeholder="Select grade" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border shadow-lg">
                                  <SelectItem value="A+" className="text-gray-900 hover:bg-gray-100">
                                    A+ (4.0)
                                  </SelectItem>
                                  <SelectItem value="A" className="text-gray-900 hover:bg-gray-100">
                                    A (4.0)
                                  </SelectItem>
                                  <SelectItem value="A-" className="text-gray-900 hover:bg-gray-100">
                                    A- (3.7)
                                  </SelectItem>
                                  <SelectItem value="B+" className="text-gray-900 hover:bg-gray-100">
                                    B+ (3.3)
                                  </SelectItem>
                                  <SelectItem value="B" className="text-gray-900 hover:bg-gray-100">
                                    B (3.0)
                                  </SelectItem>
                                  <SelectItem value="B-" className="text-gray-900 hover:bg-gray-100">
                                    B- (2.7)
                                  </SelectItem>
                                  <SelectItem value="C+" className="text-gray-900 hover:bg-gray-100">
                                    C+ (2.3)
                                  </SelectItem>
                                  <SelectItem value="C" className="text-gray-900 hover:bg-gray-100">
                                    C (2.0)
                                  </SelectItem>
                                  <SelectItem value="C-" className="text-gray-900 hover:bg-gray-100">
                                    C- (1.7)
                                  </SelectItem>
                                  <SelectItem value="D+" className="text-gray-900 hover:bg-gray-100">
                                    D+ (1.3)
                                  </SelectItem>
                                  <SelectItem value="D" className="text-gray-900 hover:bg-gray-100">
                                    D (1.0)
                                  </SelectItem>
                                  <SelectItem value="D-" className="text-gray-900 hover:bg-gray-100">
                                    D- (0.7)
                                  </SelectItem>
                                  <SelectItem value="F" className="text-gray-900 hover:bg-gray-100">
                                    F (0.0)
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Button onClick={addCourse} className="w-full bg-teal-500 hover:bg-teal-600">
                              Add Course to {selectedYear}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardHeader>
                    <CardContent>
                      {filteredCourses.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No courses added for {selectedYear} yet.</p>
                          <p className="text-sm">Click Add Course to get started!</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <div className="flex gap-4 pb-4" style={{ minWidth: "max-content" }}>
                            {filteredCourses.map((course) => (
                              <Card
                                key={course.id}
                                className="bg-white border shadow-sm overflow-hidden flex-shrink-0 w-64"
                              >
                                {/* Header with course name and menu */}
                                <div className="bg-teal-600 text-white px-4 py-3 flex items-center justify-between">
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-sm truncate">{course.name}</h3>
                                    <Badge variant="secondary" className="mt-1 text-xs bg-white/20 text-white border-0">
                                      {course.courseType}
                                    </Badge>
                                  </div>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 text-white hover:bg-white/20 flex-shrink-0 ml-2"
                                      >
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-white">
                                      <DropdownMenuItem
                                        className="text-gray-700 hover:bg-gray-100"
                                        onClick={() => startEditCourse(course)}
                                      >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        className="text-red-600 hover:bg-red-50"
                                        onClick={() => removeCourse(course.id)}
                                      >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Remove
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                                {/* Body with description and details */}
                                <CardContent className="p-4">
                                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>
                                  <div className="space-y-1">
                                    <p className="text-gray-800 text-sm">
                                      <span className="font-semibold">Credits:</span> {course.credits}
                                    </p>
                                    {course.grade && (
                                      <p className="text-gray-800 text-sm">
                                        <span className="font-semibold">Grade:</span> {course.grade}
                                        {gpaType === "weighted" && (
                                          <span className="text-xs text-gray-500 ml-1">
                                            (
                                            {(gradeToPoints(course.grade) + getCourseWeight(course.courseType)).toFixed(
                                              1,
                                            )}{" "}
                                            pts)
                                          </span>
                                        )}
                                      </p>
                                    )}
                                    {course.examDate && (
                                      <p className="text-gray-800 text-sm">
                                        <span className="font-semibold">Exam Date:</span> {course.examDate}
                                      </p>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Edit Course Dialog */}
                  <Dialog open={isEditCourseDialogOpen} onOpenChange={setIsEditCourseDialogOpen}>
                    <DialogContent className="sm:max-w-md bg-white text-gray-900 border shadow-lg">
                      <DialogHeader>
                        <DialogTitle>Edit Course for {selectedYear}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="editCourseName" className="text-gray-700 font-medium">
                            Course Name
                          </Label>
                          <Input
                            id="editCourseName"
                            placeholder="e.g., AP Chemistry"
                            value={newCourse.name}
                            onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="editCourseType" className="text-gray-700 font-medium">
                            Course Type
                          </Label>
                          <Select
                            value={newCourse.courseType}
                            onValueChange={(value: CourseType) => setNewCourse({ ...newCourse, courseType: value })}
                          >
                            <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                              <SelectValue placeholder="Select course type" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border shadow-lg">
                              <SelectItem value="Regular" className="text-gray-900 hover:bg-gray-100">
                                Regular (+0.0)
                              </SelectItem>
                              <SelectItem value="Honors" className="text-gray-900 hover:bg-gray-100">
                                Honors (+0.5)
                              </SelectItem>
                              <SelectItem value="AP" className="text-gray-900 hover:bg-gray-100">
                                AP (+1.0)
                              </SelectItem>
                              <SelectItem value="IB" className="text-gray-900 hover:bg-gray-100">
                                IB (+1.0)
                              </SelectItem>
                              <SelectItem value="Dual Enrollment" className="text-gray-900 hover:bg-gray-100">
                                Dual Enrollment (+1.0)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="editCredits" className="text-gray-700 font-medium">
                            Credits
                          </Label>
                          <Input
                            id="editCredits"
                            type="number"
                            step="0.5"
                            min="0"
                            max="10"
                            placeholder="e.g., 3.5"
                            value={newCourse.credits}
                            onChange={(e) =>
                              setNewCourse({ ...newCourse, credits: Number.parseFloat(e.target.value) || 0 })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="editExamDate" className="text-gray-700 font-medium">
                            Exam Date
                          </Label>
                          <Input
                            id="editExamDate"
                            placeholder="e.g., 5/15/25"
                            value={newCourse.examDate}
                            onChange={(e) => setNewCourse({ ...newCourse, examDate: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="editDescription" className="text-gray-700 font-medium">
                            Description
                          </Label>
                          <Input
                            id="editDescription"
                            placeholder="Course description"
                            value={newCourse.description}
                            onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="editGrade" className="text-gray-700 font-medium">
                            Grade (Optional)
                          </Label>
                          <Select
                            value={newCourse.grade}
                            onValueChange={(value) => setNewCourse({ ...newCourse, grade: value })}
                          >
                            <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                              <SelectValue placeholder="Select grade" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border shadow-lg">
                              <SelectItem value="A+" className="text-gray-900 hover:bg-gray-100">
                                A+ (4.0)
                              </SelectItem>
                              <SelectItem value="A" className="text-gray-900 hover:bg-gray-100">
                                A (4.0)
                              </SelectItem>
                              <SelectItem value="A-" className="text-gray-900 hover:bg-gray-100">
                                A- (3.7)
                              </SelectItem>
                              <SelectItem value="B+" className="text-gray-900 hover:bg-gray-100">
                                B+ (3.3)
                              </SelectItem>
                              <SelectItem value="B" className="text-gray-900 hover:bg-gray-100">
                                B (3.0)
                              </SelectItem>
                              <SelectItem value="B-" className="text-gray-900 hover:bg-gray-100">
                                B- (2.7)
                              </SelectItem>
                              <SelectItem value="C+" className="text-gray-900 hover:bg-gray-100">
                                C+ (2.3)
                              </SelectItem>
                              <SelectItem value="C" className="text-gray-900 hover:bg-gray-100">
                                C (2.0)
                              </SelectItem>
                              <SelectItem value="C-" className="text-gray-900 hover:bg-gray-100">
                                C- (1.7)
                              </SelectItem>
                              <SelectItem value="D+" className="text-gray-900 hover:bg-gray-100">
                                D+ (1.3)
                              </SelectItem>
                              <SelectItem value="D" className="text-gray-900 hover:bg-gray-100">
                                D (1.0)
                              </SelectItem>
                              <SelectItem value="D-" className="text-gray-900 hover:bg-gray-100">
                                D- (0.7)
                              </SelectItem>
                              <SelectItem value="F" className="text-gray-900 hover:bg-gray-100">
                                F (0.0)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button onClick={editCourse} className="w-full bg-teal-500 hover:bg-teal-600">
                          Update Course
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TabsContent>

                {/* Extracurriculars Tab */}
                <TabsContent value="extracurriculars" className="space-y-4 mt-6">
                  <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                      <CardTitle className="text-lg font-semibold text-gray-800">
                        Activities & Leadership - {selectedYear}
                      </CardTitle>
                      <Dialog open={isActivityDialogOpen} onOpenChange={setIsActivityDialogOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="bg-purple-500 hover:bg-purple-600 text-white">
                            <Plus className="w-4 h-4 mr-1" />
                            Add Activity
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md bg-white text-gray-900 border shadow-lg">
                          <DialogHeader>
                            <DialogTitle>Add New Activity for {selectedYear}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="activityName" className="text-gray-700 font-medium">
                                Activity Name
                              </Label>
                              <Input
                                id="activityName"
                                placeholder="e.g., Student Council"
                                value={newActivity.name}
                                onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="role" className="text-gray-700 font-medium">
                                Role
                              </Label>
                              <Input
                                id="role"
                                placeholder="e.g., President"
                                value={newActivity.role}
                                onChange={(e) => setNewActivity({ ...newActivity, role: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="hours" className="text-gray-700 font-medium">
                                Hours per Year
                              </Label>
                              <Input
                                id="hours"
                                type="number"
                                placeholder="e.g., 120"
                                value={newActivity.hours}
                                onChange={(e) =>
                                  setNewActivity({ ...newActivity, hours: Number.parseInt(e.target.value) || 0 })
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="activityDescription" className="text-gray-700 font-medium">
                                Description
                              </Label>
                              <Input
                                id="activityDescription"
                                placeholder="Brief description"
                                value={newActivity.description}
                                onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                              />
                            </div>
                            <Button onClick={addActivity} className="w-full bg-purple-500 hover:bg-purple-600">
                              Add Activity to {selectedYear}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardHeader>
                    <CardContent>
                      {filteredActivities.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No activities added for {selectedYear} yet.</p>
                          <p className="text-sm">Click Add Activity to get started!</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {filteredActivities.map((activity) => (
                            <Card key={activity.id} className="bg-white border shadow-sm overflow-hidden">
                              {/* Header with activity name and menu */}
                              <div className="bg-purple-600 text-white px-4 py-3 flex items-center justify-between">
                                <h3 className="font-medium text-sm">{activity.name}</h3>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 text-white hover:bg-white/20"
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="bg-white">
                                    <DropdownMenuItem
                                      className="text-gray-700 hover:bg-gray-100"
                                      onClick={() => startEditActivity(activity)}
                                    >
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="text-red-600 hover:bg-red-50"
                                      onClick={() => removeActivity(activity.id)}
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Remove
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                              {/* Body with details */}
                              <CardContent className="p-4">
                                <p className="text-gray-600 text-sm mb-3">{activity.description}</p>
                                <div className="space-y-1">
                                  <p className="text-gray-800 text-sm">
                                    <span className="font-semibold">Role:</span> {activity.role}
                                  </p>
                                  <p className="text-gray-800 text-sm">
                                    <span className="font-semibold">Hours/Year:</span> {activity.hours}
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Edit Activity Dialog */}
                  <Dialog open={isEditActivityDialogOpen} onOpenChange={setIsEditActivityDialogOpen}>
                    <DialogContent className="sm:max-w-md bg-white text-gray-900 border shadow-lg">
                      <DialogHeader>
                        <DialogTitle>Edit Activity for {selectedYear}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="editActivityName" className="text-gray-700 font-medium">
                            Activity Name
                          </Label>
                          <Input
                            id="editActivityName"
                            placeholder="e.g., Student Council"
                            value={newActivity.name}
                            onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="editRole" className="text-gray-700 font-medium">
                            Role
                          </Label>
                          <Input
                            id="editRole"
                            placeholder="e.g., President"
                            value={newActivity.role}
                            onChange={(e) => setNewActivity({ ...newActivity, role: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="editHours" className="text-gray-700 font-medium">
                            Hours per Year
                          </Label>
                          <Input
                            id="editHours"
                            type="number"
                            placeholder="e.g., 120"
                            value={newActivity.hours}
                            onChange={(e) =>
                              setNewActivity({ ...newActivity, hours: Number.parseInt(e.target.value) || 0 })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="editActivityDescription" className="text-gray-700 font-medium">
                            Description
                          </Label>
                          <Input
                            id="editActivityDescription"
                            placeholder="Brief description"
                            value={newActivity.description}
                            onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                          />
                        </div>
                        <Button onClick={editActivity} className="w-full bg-purple-500 hover:bg-purple-600">
                          Update Activity
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TabsContent>

                {/* Testing Tab */}
                <TabsContent value="testing" className="space-y-4 mt-6">
                  <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                      <CardTitle className="text-lg font-semibold text-gray-800">
                        Test Scores & Goals - {selectedYear}
                      </CardTitle>
                      <Dialog open={isTestDialogOpen} onOpenChange={setIsTestDialogOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                            <Plus className="w-4 h-4 mr-1" />
                            Add Test
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md bg-white text-gray-900 border shadow-lg">
                          <DialogHeader>
                            <DialogTitle>Add Test Score for {selectedYear}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="testName" className="text-gray-700 font-medium">
                                Test Name
                              </Label>
                              <Select
                                value={newTest.testName}
                                onValueChange={(value) => setNewTest({ ...newTest, testName: value })}
                              >
                                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                                  <SelectValue placeholder="Select test" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border shadow-lg">
                                  <SelectItem value="SAT" className="text-gray-900 hover:bg-gray-100">
                                    SAT
                                  </SelectItem>
                                  <SelectItem value="ACT" className="text-gray-900 hover:bg-gray-100">
                                    ACT
                                  </SelectItem>
                                  <SelectItem value="PSAT" className="text-gray-900 hover:bg-gray-100">
                                    PSAT
                                  </SelectItem>
                                  <SelectItem value="AP Exam" className="text-gray-900 hover:bg-gray-100">
                                    AP Exam
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="score" className="text-gray-700 font-medium">
                                Score
                              </Label>
                              <Input
                                id="score"
                                placeholder="e.g., 1450"
                                value={newTest.score}
                                onChange={(e) => setNewTest({ ...newTest, score: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="testDate" className="text-gray-700 font-medium">
                                Date
                              </Label>
                              <Input
                                id="testDate"
                                placeholder="e.g., 10/15/24"
                                value={newTest.date}
                                onChange={(e) => setNewTest({ ...newTest, date: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="target" className="text-gray-700 font-medium">
                                Target Score
                              </Label>
                              <Input
                                id="target"
                                placeholder="e.g., 1500"
                                value={newTest.target}
                                onChange={(e) => setNewTest({ ...newTest, target: e.target.value })}
                              />
                            </div>
                            <Button onClick={addTest} className="w-full bg-orange-500 hover:bg-orange-600">
                              Add Test to {selectedYear}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardHeader>
                    <CardContent>
                      {filteredTests.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No test scores added for {selectedYear} yet.</p>
                          <p className="text-sm">Click Add Test to get started!</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {filteredTests.map((test) => (
                            <Card key={test.id} className="bg-white border shadow-sm overflow-hidden">
                              {/* Header with test name and menu */}
                              <div className="bg-orange-600 text-white px-4 py-3 flex items-center justify-between">
                                <h3 className="font-medium text-sm">{test.testName}</h3>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 text-white hover:bg-white/20"
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="bg-white">
                                    <DropdownMenuItem
                                      className="text-gray-700 hover:bg-gray-100"
                                      onClick={() => startEditTest(test)}
                                    >
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="text-red-600 hover:bg-red-50"
                                      onClick={() => removeTest(test.id)}
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Remove
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                              {/* Body with test details */}
                              <CardContent className="p-4">
                                <div className="space-y-1">
                                  <p className="text-gray-800 text-sm">
                                    <span className="font-semibold">Score:</span> {test.score}
                                  </p>
                                  <p className="text-gray-800 text-sm">
                                    <span className="font-semibold">Target:</span> {test.target}
                                  </p>
                                  <p className="text-gray-800 text-sm">
                                    <span className="font-semibold">Date:</span> {test.date}
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Edit Test Dialog */}
                  <Dialog open={isEditTestDialogOpen} onOpenChange={setIsEditTestDialogOpen}>
                    <DialogContent className="sm:max-w-md bg-white text-gray-900 border shadow-lg">
                      <DialogHeader>
                        <DialogTitle>Edit Test Score for {selectedYear}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="editTestName" className="text-gray-700 font-medium">
                            Test Name
                          </Label>
                          <Select
                            value={newTest.testName}
                            onValueChange={(value) => setNewTest({ ...newTest, testName: value })}
                          >
                            <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                              <SelectValue placeholder="Select test" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border shadow-lg">
                              <SelectItem value="SAT" className="text-gray-900 hover:bg-gray-100">
                                SAT
                              </SelectItem>
                              <SelectItem value="ACT" className="text-gray-900 hover:bg-gray-100">
                                ACT
                              </SelectItem>
                              <SelectItem value="PSAT" className="text-gray-900 hover:bg-gray-100">
                                PSAT
                              </SelectItem>
                              <SelectItem value="AP Exam" className="text-gray-900 hover:bg-gray-100">
                                AP Exam
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="editScore" className="text-gray-700 font-medium">
                            Score
                          </Label>
                          <Input
                            id="editScore"
                            placeholder="e.g., 1450"
                            value={newTest.score}
                            onChange={(e) => setNewTest({ ...newTest, score: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="editTestDate" className="text-gray-700 font-medium">
                            Date
                          </Label>
                          <Input
                            id="editTestDate"
                            placeholder="e.g., 10/15/24"
                            value={newTest.date}
                            onChange={(e) => setNewTest({ ...newTest, date: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="editTarget" className="text-gray-700 font-medium">
                            Target Score
                          </Label>
                          <Input
                            id="editTarget"
                            placeholder="e.g., 1500"
                            value={newTest.target}
                            onChange={(e) => setNewTest({ ...newTest, target: e.target.value })}
                          />
                        </div>
                        <Button onClick={editTest} className="w-full bg-orange-500 hover:bg-orange-600">
                          Update Test Score
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right Column - AI Chat Interface */}
          <div className="space-y-6 flex flex-col items-stretch">
            <Card className="bg-white border-0 shadow-lg flex flex-col self-start w-full max-w-xl" style={{ minHeight: 0 }}>
              {/* Header */}
              <CardHeader className="text-center py-6 border-b border-gray-100">
                <div className="flex flex-row items-center justify-center gap-4">
                  <img
                    src="/Transparent_Logo_White.png"
                    alt="SlateAI Logo"
                    className="w-12 h-12 rounded-full bg-white shadow border"
                    style={{ objectFit: 'contain', backgroundColor: '#fff' }}
                  />
                  <CardTitle className="text-lg font-medium text-gray-800 leading-tight text-left">
                    Ask Slate to Build Your
                    <br />
                    College Success Roadmap
                    <br />
                    Based Off Your Profile
                  </CardTitle>
                </div>
              </CardHeader>

              {/* Chat Content Area */}
              <CardContent className="flex flex-col flex-1 p-0">
                {/* Messages Area */}
                <div className="flex-1 p-6 min-h-[400px] max-h-[500px] overflow-y-auto">
                  <div className="space-y-4">
                    {aiMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`${message.isAi ? "bg-gray-50 rounded-lg p-4" : "bg-blue-50 rounded-lg p-4 ml-8"}`}
                      >
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{message.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Input Area */}
                <div className="p-6 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    {/* Logo next to input */}
                    <img
                      src="/Transparent_Logo_White.png"
                      alt="StudyAI Logo"
                      className="w-8 h-8 rounded-full bg-white shadow border mr-2"
                      style={{ objectFit: 'contain', backgroundColor: '#fff' }}
                    />
                    <div className="flex-1 relative">
                      <Input
                        value={aiInput}
                        onChange={(e) => setAiInput(e.target.value)}
                        placeholder="Ask Slate"
                        className="w-full h-12 px-4 rounded-full border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleAiSubmit()
                          }
                        }}
                      />
                    </div>
                    <Button
                      onClick={handleAiSubmit}
                      className="w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-700 text-white p-0 flex items-center justify-center"
                      disabled={!aiInput.trim()}
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
