"use client"

import type { LucideIcon } from "lucide-react"

interface ToolButtonProps {
  icon?: LucideIcon
  label: string
  onClick?: () => void
}

export default function ToolButton({ icon: Icon, label, onClick }: ToolButtonProps) {
  return (
    <button onClick={onClick} className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
      {Icon && <Icon className="w-6 h-6 text-teal-600 mb-2" strokeWidth={1.5} />}
      <span className="text-sm font-medium text-gray-800">{label}</span>
    </button>
  )
}
