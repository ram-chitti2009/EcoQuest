"use client";

export const dynamic = 'force-dynamic'

import dynamicImport from "next/dynamic";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import LoadingScreen from "../components/loading";
import SidebarWrapper from "../components/SidebarWrapper";

const ProfileClient = dynamicImport(
  () => import("./components/client/profileClient"),
  { ssr: false }
);

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
