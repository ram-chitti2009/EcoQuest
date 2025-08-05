import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "../../ec-db/components/ui/Button";

import {
  X
 
} from "lucide-react";
import { MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Essay } from "../data";
import { TipTapEditor } from "./TipTapEditor";
import SlateAIDialog from "@/app/components/slate-ai";

interface EssayEditorProps {
  essay: (Essay & { content: string }) | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (content: string) => void;
  onComplete: (content: string) => void;
}

export function EssayEditorDialog({
  essay,
  isOpen,
  onOpenChange,
  onSave,
  onComplete,
}: EssayEditorProps) {
  const [content, setContent] = useState("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  //Intiliz Supabase Client
  
  // Update content when essay changes
  useEffect(() => {
    if (essay) {
      setContent(essay.content);
    }
  }, [essay]);

  const handleSave = () => {
    if (essay) {
      onSave(content);
      setLastSaved(new Date());
    }
  };

  const handleComplete = () => {
    if (essay) {
      onComplete(content);
    }
  };

  // Calculate word count from HTML content
  const wordCount = content
    ? content
        .replace(/<[^>]*>/g, "") // Remove HTML tags
        .replace(/\s+/g, " ") // Normalize spaces
        .trim()
        .split(/\s+/)
        .filter(Boolean).length
    : 0;

  if (!essay) return null;

  
 

  const [slateOpen, setSlateOpen] = useState(false);

  // Pass essay and prompt to SlateAIDialog
  const handleOpenSlate = () => {
    setSlateOpen(true);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed inset-0 w-full h-full z-50 bg-gray-50 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 py-3 px-4 flex justify-between items-center">
            <div>
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                Prompt: {essay.title}
              </Dialog.Title>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {wordCount} / {essay.wordCount} words
              </span>
              <Button variant="outline" size="sm" onClick={handleSave}>
                Save Draft
              </Button>
              <Dialog.Close asChild>
                <Button variant="outline" size="sm">
                  <X size={16} className="mr-1 text-gray-700" /> Close
                </Button>
              </Dialog.Close>
            </div>
          </div>

          {/* Main content area with editor and sidebar */}
          <div className="flex flex-1 overflow-hidden">
            {/* Editor */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Rich Text Editor */}
              <div className="flex-1 overflow-auto p-4 text-gray-900">
                <TipTapEditor content={content} onChange={setContent} />
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-64 bg-white border-l border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                </h3>
              </div>
              <div className="p-4 space-y-3">
                <button
                  onClick={handleOpenSlate}
                  className="w-full flex items-center justify-center gap-2 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-500 text-white py-3 rounded-full shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200"
                  style={{ boxShadow: "0 8px 32px rgba(60, 72, 180, 0.18)" }}
                >
                  <MessageCircle size={20} className="mr-1" /> Ask Slate
                </button>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleComplete}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-md text-sm font-medium"
                  >
                    Complete Essay
                  </button>
                </div>
              </div>
              <SlateAIDialog open={slateOpen} onClose={() => setSlateOpen(false)} essay={content} prompt={essay?.title} />

              <div className="mt-auto border-t border-gray-200">
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Version History
                  </h3>
                  <button className="w-full text-sm text-left text-gray-600 bg-gray-50 hover:bg-gray-100 p-2 rounded-md transition-colors flex items-center justify-between">
                    <span>
                      {lastSaved
                        ? `Last saved: ${lastSaved.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}`
                        : "Not saved yet"}
                    </span>
                    <span>›</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default EssayEditorDialog;
