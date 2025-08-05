import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "../../ec-db/components/ui/Button";
import { Input } from "../../ec-db/components/ui/Input";
import { Search, X, Plus } from "lucide-react";
import { useState } from "react";
import { collegeData } from "../data";

interface College {
  id: number;
  name: string;
}

interface CollegeSearchDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAddCollege: (college: College) => void;
}

export function CollegeSearchDialog({ 
  isOpen, 
  onOpenChange,
  onAddCollege 
}: CollegeSearchDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter colleges based on search term
  const filteredColleges = collegeData.filter(college =>
    college.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAddCollege = (college: College) => {
    onAddCollege(college);
    setSearchTerm("");
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          Add College
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg">
          <Dialog.Title className="text-lg font-bold text-gray-900">
            Search for colleges
          </Dialog.Title>

          <div className="relative mt-4">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <Input
              placeholder="Type to search colleges..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full text-black"
              autoFocus
            />
          </div>

          <div className="mt-3 max-h-60 overflow-y-auto border border-gray-200 rounded-md">
            {filteredColleges.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No colleges found matching your search.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredColleges.map((college) => (
                  <button
                    key={college.id}
                    onClick={() => handleAddCollege(college)}
                    className="w-full text-left px-4 py-3 text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    {college.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-3 text-xs text-gray-500">
            <p>Click on a college to add it to your list</p>
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 inline-flex items-center justify-center rounded-full w-6 h-6 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
