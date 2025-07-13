import type * as React from "react"

interface TodoListProps {
  className?: string
}

const TodoList: React.FC<TodoListProps> = ({ className = "" }) => {
  const todoItems = ["item", "item", "item", "item"]

  return (
    <div className={`max-w-sm rounded-xl border border-gray-200 bg-white shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-lg font-semibold leading-none tracking-tight text-gray-900">To-Do List</h3>
      </div>

      {/* Content */}
      <div className="p-6 pt-0">
        <ul className="space-y-2 list-disc list-inside">
          {todoItems.map((item, index) => (
            <li key={index} className="text-gray-700">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default TodoList