"use client";
import SidebarWrapper from "../components/SidebarWrapper";
import DashboardClient from "./Components/client/DashboardClient";

import SurveyGate from "./components/SurveyGate";

import { useRequireAuth } from "@/hooks/useRequireAuth";
import LoadingScreen from "@/components/LoadingScreen";

export default function DashboardPage() {
  const checking = useRequireAuth();
  if (checking) {
    return (
      <LoadingScreen />
    );
  }

  return (
    <SurveyGate>
      <div className="flex">
        <SidebarWrapper loading={false} />
        <main className="flex-1">
          <DashboardClient />
        </main>
      </div>
    </SurveyGate>
  );
}