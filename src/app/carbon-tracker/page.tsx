"use client";

export const dynamic = 'force-dynamic'

import dynamicImport from "next/dynamic";
import SidebarWrapper from "../components/SidebarWrapper";

import { useRequireAuth } from "@/hooks/useRequireAuth";
import LoadingScreen from "@/components/LoadingScreen";

const CarbonTrackerClient = dynamicImport(
  () => import("./components/client/carbonTrackerClient"),
  { ssr: false }
);

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