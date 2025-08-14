import { Card, CardHeader, CardContent } from "./ui/card"
import { Edit } from "./icons"

export const MyQuestsCard = () => {
  return (
    <Card className="bg-emerald-600 text-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <h3 className="text-lg font-semibold text-emerald-500">My Quests</h3>
        <Edit className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <p className="text-emerald-200 text-sm">No active quests found.</p>
      </CardContent>
    </Card>
  )
}
