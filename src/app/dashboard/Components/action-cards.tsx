import { Card, CardContent } from "./ui/card"

export const ActionCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-gradient-to-br from-emerald-500 to-green-600 text-white hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
        <CardContent className="p-6 text-center">
          <div className="text-4xl mb-3">🧹</div>
          <h3 className="text-lg font-semibold mb-2">Log a Cleanup</h3>
          <p className="text-emerald-100 text-sm">Record your environmental impact</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
        <CardContent className="p-6 text-center">
          <div className="text-4xl mb-3">📸</div>
          <h3 className="text-lg font-semibold mb-2">Scan with Litter Lens</h3>
          <p className="text-teal-100 text-sm">AI-powered litter detection</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-500 to-teal-600 text-white hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
        <CardContent className="p-6 text-center">
          <div className="text-4xl mb-3">🧠</div>
          <h3 className="text-lg font-semibold mb-2">Take an Eco Quiz</h3>
          <p className="text-green-100 text-sm">Test your environmental knowledge</p>
        </CardContent>
      </Card>
    </div>
  )
}
