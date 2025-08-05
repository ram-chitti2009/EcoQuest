"use client";

import { useState } from "react";
import { Header } from "../../../ec-db/components/layout/Header";
import { CollegesSection } from "../CollegesSection";
import { EssaysSection } from "../EssaysSection";
import { supplementalEssayData, CollegeWithDecision } from "../../data";

/**
 * The ApplicationHubPage component provides an interface for managing college applications,
 * allowing users to add colleges, select decision types, and view supplemental essay requirements.
 */
export default function ApplicationHubPage() {
  // State for managing colleges with their decision types
  const [colleges, setColleges] = useState<CollegeWithDecision[]>([]);

  // Add college to the list with a default decision type
  const handleAddCollege = (college: { id: number; name: string }) => {
    if (!colleges.some((c) => c.id === college.id)) {
      setColleges((prev) => [...prev, { ...college, decisionType: "regular" }]);
    }
  };

  // Update decision type for a college
  const handleUpdateDecision = (index: number, value: string) => {
    setColleges((prev) =>
      prev.map((college, i) =>
        i === index ? { ...college, decisionType: value } : college
      )
    );
  };

  return (
    <>
      <div className="bg-white min-h-screen w-full">
        <div className="max-w-[1400px] w-full mx-auto px-4 py-6 flex flex-col space-y-6">
          <Header
            title="Application Hub"
            subtitle="Manage your college applications in one place."
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Colleges Section */}
            <CollegesSection
              colleges={colleges}
              onAddCollege={handleAddCollege}
              onUpdateDecision={handleUpdateDecision}
            />

            {/* Essays Section */}
            <EssaysSection colleges={colleges} essaysData={supplementalEssayData} />
          </div>
        </div>
      </div>
</>
  );
}
