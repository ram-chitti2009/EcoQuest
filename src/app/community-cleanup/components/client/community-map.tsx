"use client"

import Header from "../../../components/Header"
import CommunityCleanupMap from "../client-components/community-cleanup-map"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Community Cleanup"
        centerMessage="🌍 Join Local Cleanup Events "
        showTimeDate={true}
        showUserAvatar={true}
      />
      <section className="w-full px-2 sm:px-4 lg:px-0">
        <div className="h-[60vh] sm:h-[65vh] lg:h-[70vh] w-full">
          <CommunityCleanupMap />
        </div>
      </section>
    </div>
  )
}
