"use client";

export const dynamic = 'force-dynamic'

import { LocationPrompt } from "@/components/LocationPrompt";
import SidebarWrapper from "../components/SidebarWrapper";
import DashboardClient from "./Components/client/DashboardClient";

import LoadingScreen from "@/components/LoadingScreen";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export default function DashboardPage() {
  const checking = useRequireAuth();
  if (checking) {
    return (
      <LoadingScreen />
    );
  }

  return (
    <div className="flex">
      <SidebarWrapper loading={false} />
      <main className="flex-1">
        <DashboardClient />
      </main>
      <LocationPrompt />
    </div>
  );
}