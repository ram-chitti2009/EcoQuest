"use client";

export const dynamic = 'force-dynamic'

import SidebarWrapper from "../components/SidebarWrapper";
import CarbonClashClient from "./components/client/carbonClashClient";

import { useRequireAuth } from "@/hooks/useRequireAuth";
import LoadingScreen from "@/components/LoadingScreen";

export default function CarbonClashPage() {
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
        <CarbonClashClient />
      </main>
    </div>
  );
}