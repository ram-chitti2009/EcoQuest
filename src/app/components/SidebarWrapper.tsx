"use client";
import { usePathname } from "next/navigation";
import SideBar from "./Sidebar";

const sidebarRoutes = [
  "/dashboard",
  "/profile",
  "/litterLens",
  "/scholarship-db",
  "/eco-echo",
  "/community",
  "/interview-ai",
  "/research-hub",
  "/community-cleanup",
  "/test-prep",
  "/leaderboard",
  "/calendar",
];

export default function SidebarWrapper({ loading }: { loading: boolean }) {
  const pathname = usePathname();

  if (loading) return null; // Don't even evaluate pathname while loading

  const showSidebar = sidebarRoutes.some((route) => pathname.startsWith(route));

  return showSidebar ? <SideBar /> : null;
}
