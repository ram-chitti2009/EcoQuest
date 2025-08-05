"use client";
import SidebarWrapper from "../components/SidebarWrapper";
import EcoEcho from "./components/client/ecoEchoCoverClient";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import LoadingScreen from "@/components/LoadingScreen";

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