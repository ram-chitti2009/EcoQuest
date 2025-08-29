"use client"
import { Button } from "./Button"
import { Plus } from "lucide-react"

interface FloatingActionButtonProps {
  onClick: () => void
}

export function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Button onClick={onClick} className="rounded-full shadow-lg h-14 w-14 p-0" size="lg">
        <Plus className="w-6 h-6" />
        <span className="sr-only">Log Activity</span>
      </Button>
    </div>
  )
}
