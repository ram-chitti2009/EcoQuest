"use client"

import { Bike, Recycle, Trash2, TreePine, Zap } from "lucide-react"
import React from "react"
import { Button } from "./Button"
import { Input } from "./Input"
import { Modal } from "./Modal"
import { Select } from "./Select"

const activityTypes = [
  { value: "biking", label: "Cycling (km)", icon: <Bike className="w-4 h-4" />, carbonPerUnit: 0.21 },
  { value: "recycling", label: "Recycling (kg)", icon: <Recycle className="w-4 h-4" />, carbonPerUnit: 0.5 },
  { value: "cleanup", label: "Community cleanup (hours)", icon: <Trash2 className="w-4 h-4" />, carbonPerUnit: 2.5 },
  { value: "solar", label: "Solar energy (kWh)", icon: <Zap className="w-4 h-4" />, carbonPerUnit: 0.4 },
  { value: "plant", label: "Tree planting (trees)", icon: <TreePine className="w-4 h-4" />, carbonPerUnit: 22.0 },
]

interface ActivityModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (activity: {
    type: string
    quantity: number
    date: string
    carbonSaved: number
  }) => void
}

export function ActivityModal({ isOpen, onClose, onSubmit }: ActivityModalProps) {
  const [selectedActivity, setSelectedActivity] = React.useState("")
  const [quantity, setQuantity] = React.useState("")
  const [date, setDate] = React.useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString().split("T")[0]
  })

  const handleSubmit = () => {
    if (!selectedActivity || !quantity) return

    const activityType = activityTypes.find((type) => type.value === selectedActivity)
    if (!activityType) return

    const carbonSaved = Number.parseFloat(quantity) * activityType.carbonPerUnit

    onSubmit({
      type: activityType.label,
      quantity: Number.parseFloat(quantity),
      date,
      carbonSaved,
    })

    // Reset form
    setSelectedActivity("")
    setQuantity("")
    const now = new Date()
    setDate(new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString().split("T")[0])
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Activity">
      <div className="space-y-6">
        <Select
          label="Activity Type"
          options={activityTypes}
          value={selectedActivity}
          onChange={setSelectedActivity}
          placeholder="Select an activity"
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Quantity"
            type="number"
            placeholder="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

          <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <Button onClick={handleSubmit} disabled={!selectedActivity || !quantity} className="w-full">
          Log Activity
        </Button>
      </div>
    </Modal>
  )
}
