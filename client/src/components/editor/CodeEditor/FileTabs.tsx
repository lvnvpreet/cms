import React from 'react'; // Removed useState as local state is not needed here
import { Button } from '@/components/ui/button';
import { XIcon, CircleIcon, PlusIcon } from 'lucide-react';
import { cn } from '@/lib/utils'; // Import cn for conditional classes

// Keep the FileTab interface
export interface FileTab { // Add export here
  id: string;
  name: string; // e.g., 'Component.tsx', 'styles.css', 'template.html'
  type: 'typescript' | 'css' | 'html' | 'javascript' | string; // Or more specific types (allow string for flexibility)
  language: string; // Language identifier (e.g., 'typescript', 'css', 'html', 'javascript') - Added
  isModified?: boolean;
  hasErrors?: boolean;
  // Add other relevant properties like path, content reference, etc.
}

interface FileTabsProps {
  files: FileTab[];
  activeFileId: string | null;
  onSelectTab: (fileId: string) => void;
  onCloseTab: (fileId: string) => void;
  // onReorderTabs?: (reorderedFiles: FileTab[]) => void; // DND not implemented yet
  onCreateFile?: () => void;
}

const FileTabs: React.FC<FileTabsProps> = ({
  files,
  activeFileId,
  onSelectTab,
  onCloseTab,
  // onReorderTabs,
  onCreateFile,
}) => {

  const handleClose = (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation(); // Prevent tab selection when closing
    onCloseTab(fileId);
  };

  return (
    <div className="flex items-center border-b border-border bg-muted/40 h-10 shrink-0"> {/* Set fixed height, prevent shrinking */}
      {/* Scrollable container for file tabs */}
      <div className="flex-grow overflow-x-auto whitespace-nowrap h-full">
        {files.map((file) => (
          <button
            key={file.id}
            onClick={() => onSelectTab(file.id)}
            // Apply styles similar to TabsTrigger using cn for conditional active state
            className={cn(
              "relative inline-flex items-center justify-center whitespace-nowrap h-full px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-r border-border", // Base styles
              activeFileId === file.id
                ? "bg-background text-foreground shadow-sm border-b-2 border-b-primary" // Active styles
                : "text-muted-foreground hover:bg-muted" // Inactive styles
            )}
            // Add DND props here if implementing drag-and-drop later
          >
            <span className="mr-2">{file.name}</span>
            {/* Visual Indicators */}
            {file.isModified && !file.hasErrors && (
              <CircleIcon className="h-2 w-2 fill-blue-500 text-blue-500 ml-1 flex-shrink-0" />
            )}
            {file.hasErrors && (
               <CircleIcon className="h-2 w-2 fill-red-500 text-red-500 ml-1 flex-shrink-0" />
            )}
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 ml-2 opacity-50 hover:opacity-100 hover:bg-muted-foreground/20 rounded-sm"
              onClick={(e) => handleClose(e, file.id)}
            >
              <XIcon className="h-3 w-3" />
            </Button>
          </button>
        ))}
      </div>

      {/* Add New File Button */}
      {onCreateFile && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 ml-2 mr-1 flex-shrink-0" // Prevent button from shrinking
          onClick={onCreateFile}
          title="Create new file"
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default FileTabs;
