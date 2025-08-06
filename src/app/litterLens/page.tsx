"use client";

import SidebarWrapper from "../components/SidebarWrapper";
import EcDbClient from "./components/client/litterLensClient";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import LoadingScreen from "@/components/LoadingScreen";

export default function EcDbPage() {
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
        <EcDbClient />
      </main>
    </div>
  );
}

