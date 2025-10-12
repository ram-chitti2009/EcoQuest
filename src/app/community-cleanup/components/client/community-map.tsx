"use client"

import Header from "../../../components/Header"
import CommunityCleanupMap from "../client-components/community-cleanup-map"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col">
      {/* Fixed Header in First Viewport */}
      <div className="shrink-0">
        <Header 
          title="Community Cleanup"
          centerMessage="🌍 Join Local Cleanup Events "
          showTimeDate={true}
          showUserAvatar={true}
        />
      </div>
      
      {/* Scrollable Content Area */}
      <section className="flex-1 overflow-hidden">
        <div className="h-full w-full">
          <CommunityCleanupMap />
        </div>
      </section>
    </div>
  )
}
