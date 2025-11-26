"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface NavItemProps {
  icon: React.ComponentType<{ size?: number } & React.SVGProps<SVGSVGElement>>
  label: string
  href: string
  isCollapsed?: boolean
  onClick?: () => void
}

export const NavItem = ({ icon: Icon, label, href, isCollapsed = false, onClick }: NavItemProps) => {
  const pathname = usePathname()
  const isActive = pathname === href

  const content = (
    <div
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group cursor-pointer",
        isActive
          ? "bg-teal-600 text-white shadow-lg"
          : "text-teal-100 hover:bg-teal-600/50 hover:text-white",
        isCollapsed ? "justify-center px-2" : "justify-start"
      )}
      onClick={onClick}
    >
      <Icon 
        size={20} 
        className={cn(
          "flex-shrink-0 transition-transform duration-200",
          "group-hover:scale-110"
        )} 
      />
      {!isCollapsed && (
        <span className={cn(
          "font-medium transition-all duration-200",
          "group-hover:translate-x-1"
        )}>
          {label}
        </span>
      )}
      
      {/* Tooltip for collapsed state */}
      {isCollapsed && (
        <div className="absolute left-16 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
          {label}
        </div>
      )}
    </div>
  )

  if (onClick) {
    return <div className="relative">{content}</div>
  }

  return (
    <Link href={href} className="relative">
      {content}
    </Link>
  )
}