"use client"

import { createClient } from "@/utils/supabase/client"
import { Send } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import Image from "next/image"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

const supabase = createClient()

const getSupabaseToken = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token
}

// Quick suggestions for the mini version
const quickSuggestions = [
  "Sustainable tips for today",
  "What can I recycle?",
  "Reduce carbon footprint",
  "Water conservation tips"
]

export function EcoChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi! 🌱 I'm EcoEcho Mini, your sustainability companion. Ask me anything about eco-living!",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

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
            prev.map((msg) => (msg.id === assistantMessage.id ? { ...msg, content: currentText } : msg)),
          )

          currentWordIndex++
          setTimeout(typeNextWord, Math.random() * 50 + 30) // Faster typing for mini version
        } else {
          setIsTyping(false)
          resolve()
        }
      }

      setTimeout(typeNextWord, 300)
    })
  }

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

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
      // Get the token from Supabase
      const token = await getSupabaseToken()
      
      // Get user session to extract user_id
      const { data: { session } } = await supabase.auth.getSession()
      const userId = session?.user?.id

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      }

      // Only add Authorization header if token exists
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }

      const response = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers,
        body: JSON.stringify({ 
          query: content,
          user_id: userId
        }),
      })

      const data = await response.json()
      await typeMessage(data.answer)
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble responding. Please try again! 🌱",
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

  const handleQuickSuggestion = (suggestion: string) => {
    sendMessage(suggestion)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const showSuggestions = messages.length === 1

  return (
    <Card className="h-64">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Image
            src="/Screenshot 2025-07-12 172658.png"
            alt="EcoQuest Logo"
            width={32}
            height={32}
            className="object-contain w-6 h-6 sm:w-8 sm:h-8"
          />
          EcoEcho Mini
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="flex flex-col h-44">
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto mb-2 space-y-1.5 pr-2 scrollbar-hide">
            <style jsx>{`
              .scrollbar-hide {
                -ms-overflow-style: none;  /* IE and Edge */
                scrollbar-width: none;  /* Firefox */
              }
              .scrollbar-hide::-webkit-scrollbar {
                display: none;  /* Chrome, Safari and Opera */
              }
            `}</style>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-1.5 rounded-lg text-xs ${
                    message.role === 'user'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {/* Quick suggestions for first-time users */}
            {showSuggestions && (
              <div className="space-y-1 mt-1">
                <p className="text-xs text-gray-500 mb-1">Try asking:</p>
                {quickSuggestions.slice(0, 2).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickSuggestion(suggestion)}
                    className="block w-full text-left text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 p-1.5 rounded-md transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {/* Loading/Typing indicator */}
            {(isLoading || isTyping) && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-2 py-1.5 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                    <span className="text-gray-600 ml-1">
                      {isTyping ? "Typing..." : "Thinking..."}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
          
          {/* Input area */}
          <form onSubmit={handleSubmit} className="flex gap-1.5">
            <input
              ref={inputRef}
              placeholder="Ask about sustainability..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              className="flex-1 text-xs px-2 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-black"
            />
            <Button 
              onClick={() => {
                if (!isLoading && input.trim()) {
                  sendMessage(input)
                }
              }}
              size="sm"
              className={`px-2 py-1.5 ${
                isLoading || !input.trim() 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-emerald-500 hover:bg-emerald-600'
              } text-white`}
            >
              <Send className="w-3 h-3" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
