"use client";
import SidebarWrapper from "../components/SidebarWrapper";
import ScholarshipDbClient from "./components/client/ScholarshipDbClient";

import { useRequireAuth } from "@/hooks/useRequireAuth";
import LoadingScreen from "@/components/LoadingScreen";

export default function ScholarshipDBPage() {
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
        <ScholarshipDbClient />
      </main>
    </div>
  );
}