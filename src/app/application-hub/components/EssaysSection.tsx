import { Button } from "../../ec-db/components/ui/Button";
import { decisionTypes, Essay } from "../data";
import { useState } from "react";
import { EssaysViewerDialog } from "../components/EssaysViewerDialog";
import { EssayEditorDialog } from "../components/EssayEditorDialog";

interface College {
  id: number;
  name: string;
  decisionType: string;
}

interface EssaysSectionProps {
  colleges: College[];
  essaysData: Record<number, Essay[]>;
}

export function EssaysSection({ colleges, essaysData }: EssaysSectionProps) {
  // State for essay management
  const [viewingEssaysForCollege, setViewingEssaysForCollege] = useState<number | null>(null);
  const [editingEssay, setEditingEssay] = useState<Essay & { content: string } | null>(null);
  const [userEssays, setUserEssays] = useState<Record<string, string>>({});
  const [essayProgress, setEssayProgress] = useState<Record<string, "not-started" | "in-progress" | "completed">>({});

  // Get essays for a specific college ID
  const getEssaysForCollege = (collegeId: number) => {
    return essaysData[collegeId] || [];
  };

  // Handler for opening essays for a specific college
  const handleOpenEssays = (collegeId: number) => {
    setViewingEssaysForCollege(collegeId);
  };

  // Handler for closing the essays viewer
  const handleCloseEssaysViewer = () => {
    setViewingEssaysForCollege(null);
  };

  // Handler for writing/editing an essay
  const handleWriteEssay = (essay: Essay) => {
    setEditingEssay({ ...essay, content: userEssays[essay.id] || "" });
  };

  // Handler for saving essay draft
  const handleSaveEssay = (content: string) => {
    if (!editingEssay) return;
    
    setUserEssays(prev => ({
      ...prev,
      [editingEssay.id]: content
    }));
    
    setEssayProgress(prev => ({
      ...prev,
      [editingEssay.id]: content ? "in-progress" : "not-started"
    }));
    
  };

  // Handler for completing an essay
  const handleCompleteEssay = (content: string) => {
    if (!editingEssay) return;
    
    setUserEssays(prev => ({
      ...prev,
      [editingEssay.id]: content
    }));
    
    setEssayProgress(prev => ({
      ...prev,
      [editingEssay.id]: "completed"
    }));
    
    setEditingEssay(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Supplemental Essays
      </h2>

      {colleges.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No essays to display.</p>
          <p className="mt-1">
            Add colleges to see their required essays.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {colleges.map((college) => {
            const essays = getEssaysForCollege(college.id);

            return (
              <div
                key={college.id}
                className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-md shadow-sm hover:border-gray-300 transition-colors"
              >
                <div>
                  <span className="text-gray-900 font-medium">
                    {college.name}
                  </span>
                  <span className="block text-xs text-gray-500 mt-1">
                    {decisionTypes.find(
                      (d) => d.value === college.decisionType
                    )?.label || "Regular Decision"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {essays.length} {essays.length === 1 ? 'Essay' : 'Essays'}
                  </span>
                  {essays.length > 0 ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEssays(college.id)}
                    >
                      Open
                    </Button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Essays Viewer Dialog */}
      {viewingEssaysForCollege !== null && (
        <EssaysViewerDialog
          collegeId={viewingEssaysForCollege}
          onClose={handleCloseEssaysViewer}
          essays={getEssaysForCollege(viewingEssaysForCollege)}
          collegeName={colleges.find(c => c.id === viewingEssaysForCollege)?.name}
          userEssays={userEssays}
          essayProgress={essayProgress}
          onWriteEssay={handleWriteEssay}
        />
      )}

      {/* Essay Editor Dialog */}
      {editingEssay && (
        <EssayEditorDialog
          essay={editingEssay}
          isOpen={editingEssay !== null}
          onOpenChange={(isOpen) => !isOpen && setEditingEssay(null)}
          onSave={handleSaveEssay}
          onComplete={handleCompleteEssay}
        />
      )}
    </div>
  );
}
