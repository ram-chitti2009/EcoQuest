"use client"

interface SectionTransitionProps {
  variant?: 'wave' | 'diagonal' | 'curve' | 'geometric'
  position?: 'top' | 'bottom'
  color?: 'emerald' | 'blue' | 'gray' | 'white'
  height?: 'sm' | 'md' | 'lg'
}

export function SectionTransition({ 
  variant = 'wave', 
  position = 'bottom',
  color = 'white',
  height = 'md'
}: SectionTransitionProps) {
  const heightClasses = {
    sm: 'h-16',
    md: 'h-24',
    lg: 'h-32'
  }

  const colorClasses = {
    emerald: 'fill-emerald-50 dark:fill-emerald-950/20',
    blue: 'fill-blue-50 dark:fill-blue-950/20',
    gray: 'fill-gray-50 dark:fill-gray-900',
    white: 'fill-white dark:fill-gray-900'
  }

  const getPath = () => {
    switch (variant) {
      case 'wave':
        return position === 'bottom' 
          ? "M0,0 C150,60 350,0 500,60 C650,120 850,60 1000,60 L1000,100 L0,100 Z"
          : "M0,100 C150,40 350,100 500,40 C650,-20 850,40 1000,40 L1000,0 L0,0 Z"
      case 'diagonal':
        return position === 'bottom'
          ? "M0,20 L1000,80 L1000,100 L0,100 Z"
          : "M0,80 L1000,20 L1000,0 L0,0 Z"
      case 'curve':
        return position === 'bottom'
          ? "M0,40 Q500,0 1000,40 L1000,100 L0,100 Z"
          : "M0,60 Q500,100 1000,60 L1000,0 L0,0 Z"
      case 'geometric':
        return position === 'bottom'
          ? "M0,0 L500,80 L1000,0 L1000,100 L0,100 Z"
          : "M0,100 L500,20 L1000,100 L1000,0 L0,0 Z"
      default:
        return "M0,0 C150,60 350,0 500,60 C650,120 850,60 1000,60 L1000,100 L0,100 Z"
    }
  }

  return (
    <div className={`relative ${heightClasses[height]} overflow-hidden`}>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 100"
        preserveAspectRatio="none"
      >
        <path
          d={getPath()}
          className={`${colorClasses[color]} transition-all duration-300`}
        />
      </svg>
    </div>
  )
}