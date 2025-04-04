import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, UploadCloud, Eye } from 'lucide-react'; // Using lucide-react for icons

const ActionButtons: React.FC = () => {
  const handleSave = () => {
    console.log('Save action triggered');
    // TODO: Implement save logic using siteService and editor state
  };

  const handlePublish = () => {
    console.log('Publish action triggered');
    // TODO: Implement publish logic using siteService
    // TODO: Add confirmation dialog
  };

  const handlePreview = () => {
    console.log('Preview action triggered');
    // TODO: Implement preview logic (e.g., open preview in new tab or modal)
  };

  return (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" onClick={handlePreview}>
        <Eye className="mr-2 h-4 w-4" />
        Preview
      </Button>
      <Button variant="outline" size="sm" onClick={handleSave}>
        <Save className="mr-2 h-4 w-4" />
        Save
      </Button>
      <Button size="sm" onClick={handlePublish}>
        <UploadCloud className="mr-2 h-4 w-4" />
        Publish
      </Button>
      {/* TODO: Add loading states and disable buttons during operations */}
    </div>
  );
};

// Exporting as named export
export { ActionButtons };

// Add a default export to satisfy the import in index.tsx for now.
// We might refactor imports later to use named imports.
export default ActionButtons;
