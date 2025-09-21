export const Progress = ({
  value,
  className = "",
  color = "emerald",
}: {
  value: number
  className?: string
  color?: string
}) => {
  const colorClasses = {
    emerald: "bg-emerald-500",
    green: "bg-green-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
  }

  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div
        className={`h-2 rounded-full transition-all duration-500 ${colorClasses[color as keyof typeof colorClasses] || colorClasses.emerald}`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}
