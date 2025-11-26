"use client";

export const dynamic = 'force-dynamic'

import { useRequireAuth } from "@/hooks/useRequireAuth";
import LoadingScreen from "../components/loading";
import SidebarWrapper from "../components/SidebarWrapper";
import CalendarClient from "./components/client/calendarClient";

export default function CalendarPage() {
  const checking = useRequireAuth();
  if (checking) {
    return <LoadingScreen />;
  }
  return (
    <div className="flex min-h-screen">
      <SidebarWrapper loading={false} />
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-full">
          <CalendarClient />
        </div>
      </main>
    </div>
  );
}
