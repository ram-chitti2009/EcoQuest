import type React from "react";

interface BadgeProps{
    children : React.ReactNode;
    variant? : "default" | "secondary" | "outline";
    className? : string;
}

export const Badge = ({children, variant = "default", className = ""}: BadgeProps) => {
    const variants = {
        default : "bg-slate-900 text-white hover:bg-slate-800",
        secondary : "bg-slate-100 text-slate-900 hover:bg-slate-200",
        outline : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
    }

    return (
        <span className={`inline-flex items-center rounded-md px-2 py-1 text-sm font-medium ${variants[variant]} ${className}`}>
            {children}
        </span>
    )
}