import React from 'react';
// import ComponentPalette from './ComponentPalette'; // Remove ComponentPalette
import ComponentLibrary from '../ComponentLibrary'; // Import the new ComponentLibrary
import Canvas, { ComponentData } from './Canvas'; // Assuming Canvas exports ComponentData
import PropertyPanel from './PropertyPanel';
// Import other necessary components if UIEditor orchestrates them directly
// import ComponentInstance from './ComponentInstance';
// import DropZone from './DropZone';
// import ContextMenu from './ContextMenu';

// Define props for the main UIEditor if it needs to receive data/handlers from parent
interface UIEditorProps {
  // Example: Define props needed by UIEditor, potentially passed down to children
  pageStructure: ComponentData[];
  selectedComponentIds: string[];
  onSelectComponent: (id: string | null) => void;
  onDropComponent: (item: { type: string }, position: { x: number; y: number }) => void;
  onMoveComponent: (id: string, position: { x: number; y: number }) => void;
  onUpdateProps: (id: string, props: Record<string, any>) => void;
  // Add other props as needed, e.g., for context menu actions
}

// Main UIEditor component definition
const UIEditor: React.FC<UIEditorProps> = ({
  pageStructure,
  selectedComponentIds,
  onSelectComponent,
  onDropComponent,
  onMoveComponent,
  onUpdateProps,
  // Destructure other props
}) => {
  // Logic for the UIEditor itself, potentially managing state or passing props

  // Find the data for the *first* selected component (for PropertyPanel)
  // This logic might live here or be passed down if EditorInterface handles it
  const findComponentById = (nodes: ComponentData[], id: string): ComponentData | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findComponentById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };
  const firstSelectedComponentData = selectedComponentIds.length > 0
    ? findComponentById(pageStructure, selectedComponentIds[0])
    : null;


  // Example layout - adjust based on actual requirements
  // This assumes EditorInterface passes down the necessary props
  return (
    // Ensure this container takes full height within its parent (TabsContent)
    <div className="flex flex-1 overflow-hidden h-full w-full"> {/* Added h-full w-full */}
      {/* Left Panel: Component Library */}
      {/* Increased width slightly for the library */}
      <div className="w-72 flex-shrink-0 border-r border-border overflow-y-auto bg-muted/40"> {/* Use theme colors */}
        <ComponentLibrary /> {/* Use ComponentLibrary here */}
      </div>

      {/* Center Panel: Canvas */}
      <div className="flex-1 flex flex-col overflow-hidden"> {/* This should grow */}
         <div className="flex-1 relative bg-background"> {/* Canvas container - Use theme color */}
           <Canvas
             pageStructure={pageStructure}
             // Pass only the first ID for now, or update Canvas to handle array
             selectedComponentId={selectedComponentIds[0] ?? null}
             onSelectComponent={onSelectComponent}
             onDropComponent={onDropComponent}
             onMoveComponent={onMoveComponent}
             // Add context menu handler if needed
           />
           {/* ContextMenu might be rendered here based on state */}
         </div>
      </div>

      {/* Right Panel: Properties */}
      <div className="w-72 flex-shrink-0 border-l border-border flex flex-col bg-muted/40"> {/* Use theme colors */}
        <div className="flex-1 overflow-y-auto p-4"> {/* Add padding */}
          <PropertyPanel
            selectedComponent={firstSelectedComponentData}
            onUpdateProps={onUpdateProps}
          />
        </div>
      </div>
    </div>
  );
};

export default UIEditor;

// Re-export types if necessary
export type { ComponentData };
