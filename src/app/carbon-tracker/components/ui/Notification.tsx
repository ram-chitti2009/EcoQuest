import { Leaf } from "lucide-react"

interface NotificationProps {
  show: boolean
  message: string
}

export function Notification({ show, message }: NotificationProps) {
  if (!show) return null

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
      <div className="bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg border">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Leaf className="w-4 h-4" />
          {message}
        </div>
      </div>
    </div>
  )
}
