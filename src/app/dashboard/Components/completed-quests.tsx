import type React from "react"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { CheckCircle } from "./icons"

interface Quest {
  title: string
  date: string
  description: string
  icon: React.ReactNode
}

interface CompletedQuestsProps {
  quests: Quest[]
}

export const CompletedQuests = ({ quests }: CompletedQuestsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {quests.map((quest, index) => (
        <Card key={index} className="relative">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {quest.icon}
                <Badge variant="secondary" className="text-xs">
                  {quest.date}
                </Badge>
              </div>
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-sm mb-1">{quest.title}</h3>
            <p className="text-xs text-gray-600">{quest.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
