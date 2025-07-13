import { Calendar, FileText, Microscope, Route, School, Target, Trophy, Users } from "lucide-react";
import ToolButton from "./ToolButton";

export function ToolsCard () {
    const tools = [
        {icon:Route, label:"Roadmap"},
        {icon:FileText, label:"EC List"},
        {icon:School, label:"App Hub"},
        {icon:Trophy, label:"Scholarships"},
        {icon:Target, label:"Test Prep"},
        {icon:Microscope, label:"Research"},
        {icon:Calendar, label:"Calendar"},
        {icon:Users, label:"Community"}
    ]

    return (
       <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-lg font-semibold leading-none tracking-tight text-gray-900 text-center">Your Tools</h3>
      </div>

      {/* Content */}
      <div className="p-6 pt-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {tools.map((tool, index) => (
            <ToolButton key={index} icon={tool.icon} label={tool.label} />
          ))}
        </div>
      </div>
    </div>
    )
}