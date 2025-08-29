"use client";
import SidebarWrapper from "../components/SidebarWrapper";
import CarbonTrackerClient from "./components/client/carbonTrackerClient";

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
        <CarbonTrackerClient />
      </main>
    </div>
  );
}