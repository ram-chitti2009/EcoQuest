// Button import removed as it's not used directly in this component
import { DecisionSelect } from "../components/DecisionSelect"
import { useState } from "react";
import { CollegeSearchDialog } from "./CollegeSearchDialog";

// Define the College type based on the data structure
interface College {
  id: number;
  name: string;
  decisionType: string;
}

interface CollegesSectionProps {
  colleges: College[];
  onAddCollege: (college: { id: number; name: string }) => void;
  onUpdateDecision: (index: number, value: string) => void;
}

export function CollegesSection({ 
  colleges, 
  onAddCollege, 
  onUpdateDecision 
}: CollegesSectionProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const handleAddCollege = (college: { id: number; name: string }) => {
    onAddCollege(college);
    setIsSearchOpen(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Colleges</h2>
        <CollegeSearchDialog
          isOpen={isSearchOpen}
          onOpenChange={setIsSearchOpen}
          onAddCollege={handleAddCollege}
        />
      </div>

      <p className="text-gray-500 text-sm mb-4">
        {colleges.length} Colleges on List
      </p>

      {colleges.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No colleges added yet.</p>
          <p className="mt-1">
            Click &quot;Add College&quot; to start building your list.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {colleges.map((college, index) => (
            <div
              key={college.id}
              className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-md shadow-sm hover:border-gray-300 transition-colors"
            >
              <div>
                <div className="text-gray-900 font-medium text-base">
                  {college.name}
                </div>
                <div className="mt-2">
                  <DecisionSelect
                    value={college.decisionType}
                    onChange={(val) => onUpdateDecision(index, val)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}