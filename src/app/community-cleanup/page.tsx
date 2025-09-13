"use client";

import { useRequireAuth } from "@/hooks/useRequireAuth";
import LoadingScreen from "../components/loading";
import SidebarWrapper from "../components/SidebarWrapper";
import CommunityCleanupMap from "./components/client/community-map";

export default function EcDbPage() {
  const checking = useRequireAuth();
  if (checking) {
    return <LoadingScreen />;
  }
  return (
    <div className="flex h-screen">
      <SidebarWrapper loading={false} />
      <main className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style jsx>{`
          main::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <div className="min-h-full">
          <CommunityCleanupMap />
        </div>
      </main>
    </div>
  );
}
