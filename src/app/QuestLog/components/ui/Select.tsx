"use client"

import type React from "react"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface SelectOption {
  value: string
  label: string
  icon?: React.ReactNode
}

interface SelectProps {
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
}

export function Select({ options, value, onChange, placeholder, label }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedOption = options.find((option) => option.value === value)

  return (
    <div className="relative space-y-2">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <button
        type="button"
        className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center gap-3">
          {selectedOption ? (
            <>
              {selectedOption.icon}
              <span>{selectedOption.label}</span>
            </>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-3 first:rounded-t-lg last:rounded-b-lg"
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
            >
              {option.icon}
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
