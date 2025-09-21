"use client";

import { useRequireAuth } from "@/hooks/useRequireAuth";
import LoadingScreen from "../components/loading";
import SidebarWrapper from "../components/SidebarWrapper";
import ProfileClient from "./components/client/profileClient";

export default function EcDbPage() {
  const checking = useRequireAuth();
  if (checking) {
    return <LoadingScreen />;
  }
  return (
    <div className="flex h-screen">
      <SidebarWrapper loading={false} />
      <main className="flex-1 overflow-hidden">
        <div className="h-full">
          <ProfileClient />
        </div>
      </main>
    </div>
  );
}
