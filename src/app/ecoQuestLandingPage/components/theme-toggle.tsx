"use client"

import { useTheme } from "../../../contexts/ThemeContext"

export function ThemeToggle() {
  const { theme, toggleTheme, resetToAutoTheme, isAutoMode, mounted } = useTheme()

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="p-2 w-9 h-9 rounded-lg bg-transparent border-none cursor-pointer flex items-center justify-center">
        <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 animate-pulse rounded"></div>
      </div>
    )
  }

  const getTooltipText = () => {
    if (isAutoMode) {
      return "Auto mode: Click to manually override (expires in 4h)"
    } else {
      return "Manual mode: Double-click to reset to auto mode"
    }
  }

  return (
    <div className="relative">
      <button
        onClick={toggleTheme}
        onDoubleClick={resetToAutoTheme}
        className="p-2 rounded-lg bg-transparent border-none cursor-pointer flex items-center justify-center transition-all duration-300 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
        aria-label={isAutoMode ? "Toggle theme (Auto mode)" : "Toggle theme (Manual mode)"}
        title={getTooltipText()}
      >
        {theme === "light" ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        )}
      </button>
      {isAutoMode && (
        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full" 
             title="Auto mode active" />
      )}
    </div>
  )
}
