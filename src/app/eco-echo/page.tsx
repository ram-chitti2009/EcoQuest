"use client";

export const dynamic = 'force-dynamic'

import dynamicImport from "next/dynamic";
import SidebarWrapper from "../components/SidebarWrapper";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import LoadingScreen from "@/components/LoadingScreen";

const EcoEcho = dynamicImport(
  () => import("./components/client/ecoEchoCoverClient"),
  { ssr: false }
);

export default function ApplicationHub() {
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
        <EcoEcho />
      </main>
    </div>
  );
}