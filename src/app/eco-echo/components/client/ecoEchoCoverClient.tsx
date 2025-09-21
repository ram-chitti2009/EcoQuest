import Header from "@/app/components/Header"
import { EcoEchoChat } from "../ui/ecoEchoClient"

export default function Component() {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <Header 
        title="EcoEcho"
        centerMessage="🌍 Your Sustainability Partner 🌱"
      />

      <div className="flex-1 overflow-hidden">
        <EcoEchoChat />
      </div>
    </div>
  )
}
