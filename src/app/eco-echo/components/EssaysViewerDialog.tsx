import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "../../ec-db/components/ui/Button";
import { X } from "lucide-react";
import { collegeData, Essay } from "../data";

interface EssaysViewerDialogProps {
  collegeId: number | null;
  onClose: () => void;
  essays: Essay[];
  collegeName: string | undefined;
  userEssays: Record<string, string>;
  essayProgress: Record<string, "not-started" | "in-progress" | "completed">;
  onWriteEssay: (essay: Essay) => void;
};

export function EssaysViewerDialog({
  collegeId,
  onClose,
  essays,
  collegeName,
  userEssays,
  essayProgress,
  onWriteEssay,
}: EssaysViewerDialogProps) {
  return (
    <Dialog.Root open={collegeId !== null} onOpenChange={() => onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg">
          {collegeId !== null && (
            <>
              <Dialog.Title className="text-lg font-bold text-gray-900">
                Essays for {collegeName}
              </Dialog.Title>
              <div className="mt-4 space-y-4">
                {essays.length > 0 ? (
                  essays.map((essay) => {
                    const status = essayProgress[essay.id] || "not-started";
                    return (
                      <div
                        key={essay.id}
                        className="border border-gray-200 rounded-md p-4"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium text-gray-900">
                            {essay.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">
                              {essay.wordCount} words
                            </span>
                            {status === "not-started" && (
                              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                Not Started
                              </span>
                            )}
                            {status === "in-progress" && (
                              <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs">
                                In Progress
                              </span>
                            )}
                            {status === "completed" && (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                Completed
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          className="w-full mt-2"
                          onClick={() => onWriteEssay(essay)}
                        >
                          {status === "completed"
                            ? "Review Essay"
                            : userEssays[essay.id]
                            ? "Continue Essay"
                            : "Start Essay"}
                        </Button>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No supplemental essays required for this college.</p>
                  </div>
                )}
              </div>

              <Dialog.Close asChild>
                <button
                  className="absolute top-4 right-4 inline-flex items-center justify-center rounded-full w-6 h-6 text-gray-500 hover:text-gray-700"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </Dialog.Close>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
