import { ChevronDown } from "lucide-react"
import { forwardRef, useState } from "react"

interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  options?: SelectOption[]
  className?: string
}

const Select = forwardRef<HTMLDivElement, SelectProps>((props, ref) => {
  const { value, onValueChange, placeholder, options = [], className = "" } = props
  const [isOpen, setIsOpen] = useState(false)

  const selectedOption = options.find((option) => option.value === value)

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        className="w-full px-3 py-2 text-left bg-white border border-stone-200 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>
          {selectedOption ? selectedOption.label : (
            <span className="text-stone-400">{placeholder}</span>
          )}
        </span>
        <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-stone-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {options && options.length > 0 ? options.map((option) => (
            <button
              key={option.value}
              type="button"
              className="w-full px-3 py-2 text-left text-black hover:bg-stone-50 first:rounded-t-lg last:rounded-b-lg"
              onClick={() => {
                onValueChange(option.value)
                setIsOpen(false)
              }}
            >
              {option.label}
            </button>
          )) : (
            <div className="px-3 py-2 text-gray-500">No options available</div>
          )}
        </div>
      )}
    </div>
  )
})

Select.displayName = "Select"

export { Select }

