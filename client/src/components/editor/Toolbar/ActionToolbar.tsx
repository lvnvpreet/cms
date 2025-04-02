import React from 'react';
import { Button } from '@/components/ui/button'; // Assuming path alias works
// TODO: Import icons (e.g., from lucide-react)

interface ActionToolbarProps {
  // History actions
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;

  // Clipboard actions
  canCopy: boolean;
  canPaste: boolean;
  canDuplicate: boolean;
  onCopy: () => void;
  onPaste: () => void;
  onDuplicate: () => void;

  // Alignment/Distribution (might need more specific handlers)
  onAlign?: (type: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  onDistribute?: (type: 'horizontal' | 'vertical') => void;

  // Main actions
  onSave: () => void;
  onPreview: () => void;
  onPublish?: () => void; // Optional publish action
}

const ActionToolbar: React.FC<ActionToolbarProps> = ({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  canCopy,
  canPaste,
  canDuplicate,
  onCopy,
  onPaste,
  onDuplicate,
  onAlign,
  onDistribute,
  onSave,
  onPreview,
  onPublish,
}) => {
  return (
    <div className="flex items-center space-x-2 p-2 bg-gray-100 border-b border-gray-300">
      {/* History */}
      <Button variant="outline" size="sm" onClick={onUndo} disabled={!canUndo}>
        {/* TODO: Replace with Undo icon */} Undo
      </Button>
      <Button variant="outline" size="sm" onClick={onRedo} disabled={!canRedo}>
        {/* TODO: Replace with Redo icon */} Redo
      </Button>

      {/* Separator */}
      <div className="h-6 w-px bg-gray-300 mx-2"></div>

      {/* Clipboard */}
      <Button variant="outline" size="sm" onClick={onCopy} disabled={!canCopy}>
        {/* TODO: Replace with Copy icon */} Copy
      </Button>
      <Button variant="outline" size="sm" onClick={onPaste} disabled={!canPaste}>
        {/* TODO: Replace with Paste icon */} Paste
      </Button>
      <Button variant="outline" size="sm" onClick={onDuplicate} disabled={!canDuplicate}>
        {/* TODO: Replace with Duplicate icon */} Duplicate
      </Button>

      {/* Separator */}
      <div className="h-6 w-px bg-gray-300 mx-2"></div>

      {/* Alignment/Distribution (Placeholder - implement dropdowns or groups later) */}
      {onAlign && (
        <Button variant="outline" size="sm" onClick={() => onAlign('left')}>
          {/* TODO: Replace with Align icon/group */} Align
        </Button>
      )}
       {onDistribute && (
        <Button variant="outline" size="sm" onClick={() => onDistribute('horizontal')}>
          {/* TODO: Replace with Distribute icon/group */} Distribute
        </Button>
      )}

       {/* Separator */}
       {(onAlign || onDistribute) && <div className="h-6 w-px bg-gray-300 mx-2"></div>}


      {/* Main Actions */}
      <div className="flex-grow"></div> {/* Spacer */}
      <Button variant="outline" size="sm" onClick={onPreview}>
        {/* TODO: Replace with Preview icon */} Preview
      </Button>
      <Button variant="default" size="sm" onClick={onSave}>
        {/* TODO: Replace with Save icon */} Save
      </Button>
      {onPublish && (
         <Button variant="secondary" size="sm" onClick={onPublish}>
           {/* TODO: Replace with Publish icon */} Publish
         </Button>
      )}
    </div>
  );
};

export default ActionToolbar;
