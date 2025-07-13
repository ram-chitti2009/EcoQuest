"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
interface NavItemProps {
    icon: LucideIcon;
    label: string;
    href: string;
    active?: boolean;
    onClick?: () => void;
}

export const NavItem = ({ icon: Icon, label, href, active = false, onClick }: NavItemProps) => {
    return (
        <Link
            href={href}
            className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${active ? "bg-teal-600 text-white" : "text-teal-100 hover:bg-teal-700 hover:text-white"}`}
        >
            <button
                onClick={onClick}
                className="flex items-center w-full"
            >
                <Icon className="w-4 h-4 mr-3" />
                <span className="text-sm font-medium">{label}</span>
            </button>
        </Link>
    );
}
// This component can be used in the Sidebar to create navigation items
