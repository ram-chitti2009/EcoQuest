"use client";

import { useRequireAuth } from "@/hooks/useRequireAuth";
import SidebarWrapper from "../components/SidebarWrapper";
import RoadmapBuilderClient from "./components/client/testPrep";
import LoadingScreen from "../components/loading";

export default function EcDbPage() {
  const checking = useRequireAuth();
  if (checking) {
    return <LoadingScreen />;
  }
  return (
    <div className="flex">
      <SidebarWrapper loading={false} />
      <main className="flex-1">
        <RoadmapBuilderClient />
      </main>
    </div>
  );
}
