"use client"

import type React from "react"

interface TabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  children: React.ReactNode
}

export function Tabs({ activeTab, onTabChange, children }: TabsProps) {
  return <div className="space-y-6">{children}</div>
}

interface TabsListProps {
  children: React.ReactNode
}

export function TabsList({ children }: TabsListProps) {
  return <div className="grid grid-cols-2 bg-gray-100 rounded-lg p-1">{children}</div>
}

interface TabsTriggerProps {
  value: string
  activeTab: string
  onTabChange: (tab: string) => void
  children: React.ReactNode
}

export function TabsTrigger({ value, activeTab, onTabChange, children }: TabsTriggerProps) {
  const isActive = activeTab === value

  return (
    <button
      type="button"
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        isActive ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
      }`}
      onClick={() => onTabChange(value)}
    >
      {children}
    </button>
  )
}

interface TabsContentProps {
  value: string
  activeTab: string
  children: React.ReactNode
}

export function TabsContent({ value, activeTab, children }: TabsContentProps) {
  if (activeTab !== value) return null

  return <div>{children}</div>
}
