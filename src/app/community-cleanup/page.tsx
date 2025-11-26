"use client";

export const dynamic = 'force-dynamic'

import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useEffect } from "react";
import dynamicImport from "next/dynamic";
import LoadingScreen from "../components/loading";
import SidebarWrapper from "../components/SidebarWrapper";

const CommunityCleanupMap = dynamicImport(
  () => import("./components/client/community-map"),
  { ssr: false }
);

export default function EcDbPage() {
  const checking = useRequireAuth();
  
  // Force dark mode for community cleanup page
  useEffect(() => {
    // Save current theme if any
    const originalTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    
    // Force dark mode
    document.documentElement.classList.add('dark');
    
    // Cleanup: restore original theme when leaving the page
    return () => {
      if (originalTheme === 'light') {
        document.documentElement.classList.remove('dark');
      }
    };
  }, []);
  
  if (checking) {
    return <LoadingScreen />;
  }
  
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <SidebarWrapper loading={false} />
      <main className="flex-1 overflow-y-auto bg-gray-900" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
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
