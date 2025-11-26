"use client";

export const dynamic = 'force-dynamic'

import SidebarWrapper from "../components/SidebarWrapper";
import QuestLogClient from "./components/client/QuestLogClient";

import { useRequireAuth } from "@/hooks/useRequireAuth";
import LoadingScreen from "@/components/LoadingScreen";

export default function CarbonTrackerPage() {
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
        <QuestLogClient />
      </main>
    </div>
  );
}