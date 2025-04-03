import React, { useState, useCallback } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'; // Use shadcn Tabs
import UIEditor, { ComponentData } from './UIEditor';
import CodeEditor from './CodeEditor';
import { nanoid } from 'nanoid';

// Example initial page structure (remains relevant for UIEditor)
const initialPageStructure: ComponentData[] = [
  { id: nanoid(), type: 'Card', props: { className: 'm-4 p-4 shadow' }, children: [
    { id: nanoid(), type: 'Button', props: { children: 'Click Me', variant: 'default' }, x: 10, y: 10, zIndex: 1 },
  ], x: 50, y: 50, zIndex: 0 },
];

const EditorInterface: React.FC = () => {
  const [pageStructure, setPageStructure] = useState<ComponentData[]>(initialPageStructure);
  const [selectedComponentIds, setSelectedComponentIds] = useState<string[]>([]); // Changed state
  // TODO: Implement proper history state for undo/redo
  const [history, setHistory] = useState<ComponentData[][]>([initialPageStructure]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const updateStructure = (newStructure: ComponentData[]) => {
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newStructure);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setPageStructure(newStructure);
  };

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setPageStructure(history[newIndex]);
      setSelectedComponentIds([]); // Deselect on undo/redo
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setPageStructure(history[newIndex]);
      setSelectedComponentIds([]); // Deselect on undo/redo
    }
  }, [history, historyIndex]);


  // Simplified selection handler (no multi-select UI yet)
  const handleSelectComponent = useCallback((id: string | null) => {
    setSelectedComponentIds(id ? [id] : []); // Select only the clicked one, or deselect all
    // TODO: Implement multi-select logic (e.g., check for Shift key)
  }, []);

  // Recursive function to find and update a component's props
  const findAndUpdateProps = (nodes: ComponentData[], id: string, newProps: Record<string, any>): ComponentData[] => {
    return nodes.map(node => {
      if (node.id === id) {
        return { ...node, props: newProps };
      }
      if (node.children) {
        return { ...node, children: findAndUpdateProps(node.children, id, newProps) };
      }
      return node;
    });
  };

  const handleUpdateProps = useCallback((componentId: string, newProps: Record<string, any>) => {
    const updatedStructure = findAndUpdateProps(pageStructure, componentId, newProps);
    updateStructure(updatedStructure);
  }, [pageStructure, history, historyIndex]); // Include history dependencies

  // Recursive function to find and update a component's position
   const findAndUpdatePosition = (nodes: ComponentData[], id: string, newPosition: { x: number; y: number }): ComponentData[] => {
     return nodes.map(node => {
       if (node.id === id) {
         return { ...node, x: newPosition.x, y: newPosition.y };
       }
       // Note: This simple version doesn't handle moving components *between* parents
       if (node.children) {
         return { ...node, children: findAndUpdatePosition(node.children, id, newPosition) };
       }
       return node;
     });
   };

  const handleMoveComponent = useCallback((componentId: string, newPosition: { x: number; y: number }) => {
     const updatedStructure = findAndUpdatePosition(pageStructure, componentId, newPosition);
     updateStructure(updatedStructure);
  }, [pageStructure, history, historyIndex]); // Include history dependencies

  const handleDropComponent = useCallback((item: { type: string }, position: { x: number; y: number }) => {
    const newComponent: ComponentData = {
      id: nanoid(),
      type: item.type,
      props: {}, // Default props - could be smarter
      x: position.x,
      y: position.y,
      zIndex: (pageStructure.length || 0), // Basic zIndex handling
    };
    // Add the new component to the top level for now
    // TODO: Implement dropping *into* containers
    const updatedStructure = [...pageStructure, newComponent];
    updateStructure(updatedStructure);
  }, [pageStructure, history, historyIndex]); // Include history dependencies

  // Find the data for the *first* selected component (for PropertyPanel)
  // Recursive function to find a component by ID
  const findComponentById = (nodes: ComponentData[], id: string): ComponentData | null => {
    // Removed null check for id, assuming we only call this if selectedComponentIds is not empty
    for (const node of nodes) {
      if (node.id === id) {
        return node;
      }
      if (node.children) {
        const foundInChildren = findComponentById(node.children, id);
        if (foundInChildren) return foundInChildren;
      }
    }
    return null;
  };
  // Get data only for the first selected component to show in PropertyPanel
  const firstSelectedComponentData = selectedComponentIds.length > 0
    ? findComponentById(pageStructure, selectedComponentIds[0])
    : null;

  // Placeholder handlers for other toolbar actions
  const handleSave = () => console.log('Save action triggered', pageStructure);
  const handlePreview = () => console.log('Preview action triggered');
  // TODO: Implement actual copy/paste/duplicate logic using selectedComponentIds
  const handleCopy = () => console.log('Copy action triggered', selectedComponentIds);
  const handlePaste = () => console.log('Paste action triggered');
  const handleDuplicate = () => console.log('Duplicate action triggered', selectedComponentIds);

  // Helper function to find multiple components by IDs
  const findComponentsByIds = (nodes: ComponentData[], ids: string[]): ComponentData[] => {
    let found: ComponentData[] = [];
    for (const node of nodes) {
      if (ids.includes(node.id)) {
        found.push(node);
      }
      if (node.children && node.children.length > 0) {
        found = found.concat(findComponentsByIds(node.children, ids));
      }
      // Stop early if all found? Optional optimization
      // if (found.length === ids.length) break;
    }
    return found;
  };

  // Recursive function to update multiple components
  const findAndUpdateMultiple = (
    nodes: ComponentData[],
    updates: Map<string, Partial<ComponentData>> // Map<id, { x?, y? }>
  ): ComponentData[] => {
    return nodes.map(node => {
      let updatedNode = { ...node };
      if (updates.has(node.id)) {
        updatedNode = { ...updatedNode, ...updates.get(node.id) };
      }
      if (updatedNode.children) {
        updatedNode.children = findAndUpdateMultiple(updatedNode.children, updates);
      }
      return updatedNode;
    });
  };


  // Alignment Handler
  const handleAlign = (type: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    if (selectedComponentIds.length < 2) {
      console.warn('Alignment requires at least two selected components.');
      return;
    }

    const selectedComponents = findComponentsByIds(pageStructure, selectedComponentIds);
    if (selectedComponents.length !== selectedComponentIds.length) {
        console.error('Could not find all selected components for alignment.');
        return;
    }

    const updates = new Map<string, Partial<ComponentData>>();
    let targetValue: number | undefined;

    switch (type) {
      case 'left':
        targetValue = Math.min(...selectedComponents.map(c => c.x || 0));
        selectedComponentIds.forEach(id => updates.set(id, { x: targetValue }));
        break;
      case 'top':
        targetValue = Math.min(...selectedComponents.map(c => c.y || 0));
        selectedComponentIds.forEach(id => updates.set(id, { y: targetValue }));
        break;
      // TODO: Implement other alignment types (require component dimensions)
      case 'center':
      case 'right':
      case 'middle':
      case 'bottom':
      default:
        console.warn(`Alignment type "${type}" not implemented yet (requires dimensions).`);
        return; // Don't proceed if type is not implemented
    }

    if (updates.size > 0) {
      const newStructure = findAndUpdateMultiple(pageStructure, updates);
      updateStructure(newStructure);
    }
  };

  // Distribution Handler (Placeholder - requires dimensions)
  const handleDistribute = (type: 'horizontal' | 'vertical') => {
     if (selectedComponentIds.length < 3) {
       console.warn('Distribution requires at least three selected components.');
       return;
     }

     const selectedComponents = findComponentsByIds(pageStructure, selectedComponentIds);
     if (selectedComponents.length !== selectedComponentIds.length) {
         console.error('Could not find all selected components for distribution.');
         return;
     }

     console.log(`Distribute action: ${type}`, selectedComponentIds);
     console.warn(`Distribution logic for type "${type}" not implemented yet (requires component dimensions).`);

     // TODO: Implement distribution logic
     // 1. Get dimensions for all selected components (requires tracking dimensions)
     // 2. Sort components based on position (x for horizontal, y for vertical)
     // 3. Calculate total span and total size of components
     // 4. Calculate spacing between components
     // 5. Determine new x or y positions based on spacing
     // 6. Create updates map
     // 7. const newStructure = findAndUpdateMultiple(pageStructure, updates);
     // 8. updateStructure(newStructure);
  };

  // TODO: Initialize and manage SyncEngine instance here
  // TODO: Pass relevant state (e.g., pageStructure, activeFileContent) and update handlers
  //       between UIEditor, CodeEditor, and SyncEngine.

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* TODO: Re-integrate or replace the Toolbar component */}
      {/* <ActionToolbar ... /> */}

      {/* Main editor area using Tabs */}
      <Tabs defaultValue="ui" className="flex flex-col flex-grow h-full"> {/* Added h-full back */}
        <TabsList className="shrink-0 border-b"> {/* Prevent list from shrinking */}
          <TabsTrigger value="ui">UI Editor</TabsTrigger>
          <TabsTrigger value="code">Code Editor</TabsTrigger>
        </TabsList>

        {/* UI Editor Tab */}
        {/* Revert to flex-grow */}
        <TabsContent value="ui" className="flex-grow overflow-auto min-h-0">
           {/* Add h-full to wrapper */}
           <div className="h-full">
             <UIEditor
               pageStructure={pageStructure}
               selectedComponentIds={selectedComponentIds}
               onSelectComponent={handleSelectComponent}
               onDropComponent={handleDropComponent}
               onMoveComponent={handleMoveComponent}
               onUpdateProps={handleUpdateProps}
               // Pass any other necessary props down to UIEditor
             />
           </div>
        </TabsContent>

        {/* Code Editor Tab */}
        {/* Revert to flex-grow */}
        <TabsContent value="code" className="flex-grow p-0 m-0 overflow-hidden min-h-0">
           {/* Add h-full to wrapper */}
           <div className="h-full">
             <CodeEditor />
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditorInterface; // Ensure only one default export
