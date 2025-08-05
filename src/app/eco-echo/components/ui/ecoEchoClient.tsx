"use client"

import type React from "react"

import { Droplets, Heart, Leaf, Lightbulb, Recycle, Send, Sparkles, TreePine } from "lucide-react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { Card } from "./card"
import { Input } from "./input"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

const quickStartButtons = [
  {
    label: "Sustainable tips",
    icon: Lightbulb,
    prompt: "Give me 3 practical sustainable living tips I can start today",
    color: "from-amber-400 to-orange-500",
    bgColor: "bg-gradient-to-br from-amber-50 to-orange-50",
  },
  {
    label: "What can I recycle?",
    icon: Recycle,
    prompt: "What items can I recycle in my local area and how should I prepare them?",
    color: "from-blue-400 to-cyan-500",
    bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
  },
  {
    label: "Trash ID Help",
    icon: Sparkles,
    prompt: "Help me identify if an item is recyclable, compostable, or needs special disposal",
    color: "from-purple-400 to-pink-500",
    bgColor: "bg-gradient-to-br from-purple-50 to-pink-50",
  },
  {
    label: "Carbon footprint",
    icon: TreePine,
    prompt: "How can I reduce my carbon footprint at home?",
    color: "from-emerald-400 to-green-500",
    bgColor: "bg-gradient-to-br from-emerald-50 to-green-50",
  },
  {
    label: "Water conservation",
    icon: Droplets,
    prompt: "What are the best ways to conserve water in my daily routine?",
    color: "from-cyan-400 to-blue-500",
    bgColor: "bg-gradient-to-br from-cyan-50 to-blue-50",
  },
  {
    label: "Eco-friendly products",
    icon: Heart,
    prompt: "Recommend eco-friendly alternatives for common household items",
    color: "from-rose-400 to-pink-500",
    bgColor: "bg-gradient-to-br from-rose-50 to-pink-50",
  },
]

// Mock AI responses for demonstration
const mockResponses = [
  "Here are 3 practical sustainable living tips you can implement today:\n\n🌱 **Switch to reusable alternatives**: Replace single-use items like plastic water bottles, shopping bags, and coffee cups with reusable versions. This simple change can significantly reduce your waste footprint.\n\n💡 **Optimize your energy usage**: Unplug electronics when not in use, switch to LED bulbs, and adjust your thermostat by just 2°F to save energy and reduce bills.\n\n🚲 **Choose sustainable transportation**: Walk, bike, or use public transport for short trips. Even replacing one car trip per week can make a meaningful environmental impact!",
  
  "Great question! Here's what you can typically recycle and how to prepare items:\n\n♻️ **Paper & Cardboard**: Remove tape, staples, and food residue. Flatten boxes to save space.\n\n🥤 **Plastic containers**: Rinse clean, remove labels if possible. Check the recycling number - most facilities accept #1-5.\n\n🥫 **Metal cans**: Remove labels, rinse thoroughly. Both aluminum and steel cans are highly recyclable.\n\n📱 **Electronics**: Never put in regular recycling! Take to special e-waste centers or manufacturer take-back programs.\n\nRemember: When in doubt, check your local recycling guidelines as they can vary by location!",
  
  "I'd be happy to help you identify proper disposal methods! Here's a quick guide:\n\n✅ **Recyclable items**: Clean containers, paper, cardboard, most plastics (#1-7), glass bottles, metal cans\n\n🌱 **Compostable items**: Fruit/vegetable scraps, coffee grounds, eggshells, yard waste, paper towels (if not chemically treated)\n\n⚠️ **Special disposal needed**: Batteries, electronics, paint, chemicals, light bulbs, medical waste\n\nFor specific items, describe what you have and I can give you detailed disposal instructions. Taking a photo and describing the item works great too!",
  
  "Excellent question! Here are effective ways to reduce your home carbon footprint:\n\n🏠 **Energy efficiency**: Improve insulation, seal air leaks, and upgrade to energy-efficient appliances. These changes can reduce energy use by 20-30%.\n\n🌡️ **Smart heating/cooling**: Use a programmable thermostat, maintain your HVAC system, and consider renewable energy sources like solar panels.\n\n🍽️ **Sustainable food choices**: Eat more plant-based meals, buy local produce, and reduce food waste by meal planning.\n\n💧 **Water heating**: Lower your water heater temperature to 120°F and take shorter showers to save both energy and water.",
  
  "Water conservation is crucial! Here are the most effective daily strategies:\n\n🚿 **Bathroom savings**: Take shorter showers (aim for 5 minutes), fix leaky faucets immediately, and install low-flow showerheads and faucet aerators.\n\n🏡 **Around the house**: Only run dishwashers and washing machines with full loads, collect rainwater for plants, and choose drought-resistant landscaping.\n\n💡 **Smart habits**: Turn off the tap while brushing teeth or washing dishes, use a broom instead of a hose for outdoor cleaning.\n\nThese simple changes can save thousands of gallons per year while reducing your utility bills!",
  
  "Here are some fantastic eco-friendly alternatives for common household items:\n\n🧽 **Cleaning**: Replace paper towels with microfiber cloths, use vinegar and baking soda for natural cleaning, choose biodegradable soaps.\n\n🛁 **Personal care**: Bamboo toothbrushes, shampoo bars, menstrual cups, safety razors instead of disposables.\n\n🍽️ **Kitchen**: Beeswax wraps instead of plastic wrap, glass containers for storage, compostable dish sponges.\n\n🧺 **Laundry**: Eco-friendly detergents, wool dryer balls instead of fabric softener, air-drying when possible.\n\nThese swaps are often more cost-effective long-term and much better for the environment!"
]

export function EcoEchoChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hi there! 🌱 I'm EcoEcho, your personal sustainability companion. I'm here to help you make eco-friendly choices, learn about recycling, reduce waste, and live more sustainably. Whether you're just starting your green journey or looking to level up your environmental impact, I've got you covered! What would you like to explore today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const typeMessage = async (content: string): Promise<void> => {
    return new Promise((resolve) => {
      setIsTyping(true)
      let currentText = ""
      const words = content.split(" ")
      let currentWordIndex = 0

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "",
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      const typeNextWord = () => {
        if (currentWordIndex < words.length) {
          currentText += (currentWordIndex > 0 ? " " : "") + words[currentWordIndex]
          
          setMessages((prev) => 
            prev.map((msg) => 
              msg.id === assistantMessage.id 
                ? { ...msg, content: currentText }
                : msg
            )
          )
          
          currentWordIndex++
          setTimeout(typeNextWord, Math.random() * 100 + 50)
        } else {
          setIsTyping(false)
          resolve()
        }
      }

      setTimeout(typeNextWord, 500)
    })
  }

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Simulate API call with random response
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)]
      await typeMessage(randomResponse)
      
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment. 🌱",
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleQuickStart = (prompt: string) => {
    sendMessage(prompt)
  }

  const showQuickStart = messages.length === 1

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="flex-shrink-0 bg-white/80 backdrop-blur-sm border-b border-green-100 p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              EcoEcho
            </h1>
            <p className="text-sm text-gray-600">Your Sustainability Companion</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-green-700">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message, index) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] group ${
                  message.role === "user"
                    ? "order-2"
                    : "order-1"
                }`}
              >
                <div
                  className={`rounded-2xl px-5 py-4 shadow-sm transition-all duration-300 hover:shadow-md ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white"
                      : "bg-white text-gray-900 border border-gray-100"
                  }`}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animation: "slideIn 0.5s ease-out forwards"
                  }}
                >
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </div>
                  <p className={`text-xs mt-3 ${message.role === "user" ? "text-green-100" : "text-gray-500"}`}>
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Quick Start Buttons */}
          {showQuickStart && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center space-y-2">
                <p className="text-lg font-semibold text-gray-800">🌱 Let's make a difference together!</p>
                <p className="text-sm text-gray-600">Choose a topic to get started on your sustainability journey:</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickStartButtons.map((button, index) => (
                  <Card
                    key={button.label}
                    className={`p-5 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-0 ${button.bgColor} group`}
                    onClick={() => handleQuickStart(button.prompt)}
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      animation: "slideUp 0.6s ease-out forwards"
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${button.color} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                        <button.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                          {button.label}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {button.prompt}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {(isLoading || isTyping) && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl px-5 py-4 shadow-sm border border-gray-100 animate-slideIn">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">
                    {isTyping ? "EcoEcho is typing..." : "EcoEcho is thinking..."}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 bg-white/80 backdrop-blur-sm border-t border-green-100 p-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-center bg-white border-2 border-gray-200 rounded-2xl px-4 py-3 focus-within:border-green-400 focus-within:ring-4 focus-within:ring-green-100 transition-all duration-300 shadow-lg hover:shadow-xl">
              {/* EcoQuest Logo */}
              <button
                type="button"
                className="flex-shrink-0 w-10 h-10 hover:scale-110 transition-all duration-300 mr-3"
                onClick={() => inputRef.current?.focus()}
              >
                <Image 
                  src="/Screenshot 2025-07-12 172658.png" 
                  alt="EcoQuest Logo" 
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </button>

              {/* Input Field */}
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about sustainability, recycling, or eco-tips..."
                disabled={isLoading}
                className="flex-1 text-base text-gray-800 px-4 py-3 placeholder-gray-500 border-none outline-none focus:ring-0 focus:border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ml-2 transition-all duration-300 transform ${
                  input.trim() && !isLoading
                    ? "bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl hover:scale-105"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>

          <div className="flex items-center justify-center gap-4 mt-4">
            <p className="text-xs text-gray-500">
              EcoEcho can make mistakes. Always verify important environmental information.
            </p>
            <div className="flex items-center gap-2 text-xs text-green-600">
              <Heart className="w-3 h-3" />
              <span>Made with care for our planet</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slideIn {
          animation: slideIn 0.5s ease-out forwards;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out forwards;
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}