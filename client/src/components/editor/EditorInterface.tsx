// client/src/components/editor/EditorInterface.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import UIEditor from './UIEditor'; // Assuming UIEditor handles VisualComponent[] or we cast
import CodeEditor from './CodeEditor';
import { nanoid } from 'nanoid';
import { VisualComponent, GeneratedCode, ComponentProps } from '../../types'; // Use types from centralized file
import { transformUIToCode } from './SyncEngine/UIToCode';

// Example initial page structure using VisualComponent type
const initialPageStructure: VisualComponent[] = [
  {
    id: nanoid(),
    type: 'Card',
    props: { className: 'm-4 p-4 shadow', children: 'Initial Card' }, // Added simple children prop
    children: [
      {
        id: nanoid(),
        type: 'Button',
        props: { children: 'Click Me', variant: 'default' },
        children: [], // Button has no VisualComponent children here
        x: 10,
        y: 10,
        zIndex: 1
      },
    ],
    x: 50,
    y: 50,
    zIndex: 0
  },
];

const EditorInterface: React.FC = () => {
  // State for the visual structure
  const [pageStructure, setPageStructure] = useState<VisualComponent[]>(initialPageStructure);
  // State for selected components
  const [selectedComponentIds, setSelectedComponentIds] = useState<string[]>([]);
  // State for undo/redo history
  const [history, setHistory] = useState<VisualComponent[][]>([initialPageStructure]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // State for the generated code
  const [generatedHtml, setGeneratedHtml] = useState<string>('');
  const [generatedCss, setGeneratedCss] = useState<string>('');
  const [generatedJs, setGeneratedJs] = useState<string>('');

  // --- Core Update Function (triggers code generation) ---
  const updateStructure = useCallback((newStructure: VisualComponent[], updateHistory = true) => {
    if (updateHistory) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newStructure);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
    setPageStructure(newStructure);

    // --- Trigger Code Generation ---
    const rootNode: VisualComponent = {
      id: 'canvas-root',
      type: 'div',
      props: { id: 'main-content-area' },
      children: newStructure,
    };

    try {
      const { html, css, javascript }: GeneratedCode = transformUIToCode(rootNode);
      setGeneratedHtml(html);
      setGeneratedCss(css);
      setGeneratedJs(javascript);
      console.log("Code generated successfully after structure update.");
    } catch (error) {
      console.error("Error during UI to Code transformation:", error);
    }
  }, [history, historyIndex]); // Dependencies for useCallback

  // --- Initial Code Generation ---
  useEffect(() => {
    // Generate code for the initial structure on mount
    updateStructure(initialPageStructure, false); // Don't update history on initial load
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once

  // --- History Handlers ---
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      updateStructure(history[newIndex], false); // Update structure without adding to history
      setSelectedComponentIds([]);
    }
  }, [history, historyIndex, updateStructure]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      updateStructure(history[newIndex], false); // Update structure without adding to history
      setSelectedComponentIds([]);
    }
  }, [history, historyIndex, updateStructure]);

  // --- Component Interaction Handlers ---
  const handleSelectComponent = useCallback((id: string | null) => {
    setSelectedComponentIds(id ? [id] : []);
  }, []);

  // Recursive helper to update props
  const findAndUpdatePropsRecursive = (nodes: VisualComponent[], id: string, newProps: Partial<ComponentProps>): VisualComponent[] => {
    return nodes.map(node => {
      let updatedNode = { ...node };
      if (node.id === id) {
        updatedNode.props = { ...(node.props || {}), ...newProps };
      }
      if (node.children && node.children.length > 0) {
        updatedNode.children = findAndUpdatePropsRecursive(node.children, id, newProps);
      }
      return updatedNode;
    });
  };

  const handleUpdateProps = useCallback((componentId: string, newProps: Partial<ComponentProps>) => {
    const updatedStructure = findAndUpdatePropsRecursive(pageStructure, componentId, newProps);
    updateStructure(updatedStructure);
  }, [pageStructure, updateStructure]);

  // Recursive helper to update position
  const findAndUpdatePositionRecursive = (nodes: VisualComponent[], id: string, newPosition: { x: number; y: number }): VisualComponent[] => {
    return nodes.map(node => {
      if (node.id === id) {
        return { ...node, x: newPosition.x, y: newPosition.y };
      }
      if (node.children && node.children.length > 0) {
        return { ...node, children: findAndUpdatePositionRecursive(node.children, id, newPosition) };
      }
      return node;
    });
  };

   const handleMoveComponent = useCallback((componentId: string, newPosition: { x: number; y: number }) => {
     const updatedStructure = findAndUpdatePositionRecursive(pageStructure, componentId, newPosition);
     updateStructure(updatedStructure);
   }, [pageStructure, updateStructure]);

  const handleDropComponent = useCallback((item: { type: string; id?: string }, position: { x: number; y: number }) => {
    // If item has an ID, it's a move, which should be handled by handleMoveComponent via useDrop in Canvas
    if (item.id) {
        console.log("Drop interpreted as move for:", item.id);
        handleMoveComponent(item.id, position);
        return; // Prevent adding a new component
    }

    // It's a new component drop
    const newComponent: VisualComponent = {
      id: nanoid(),
      type: item.type,
      props: {}, // Start with empty props
      children: [], // Initialize children
      x: Math.round(position.x), // Round position
      y: Math.round(position.y),
      zIndex: (pageStructure.reduce((maxZ, c) => Math.max(maxZ, c.zIndex || 0), 0) + 1),
    };
    const updatedStructure = [...pageStructure, newComponent];
    updateStructure(updatedStructure);
    // Optionally select the newly added component
    // handleSelectComponent(newComponent.id);
  }, [pageStructure, updateStructure, handleMoveComponent]);

  // --- Helper Functions for Finding Components ---
  const findComponentByIdRecursive = (nodes: VisualComponent[], id: string): VisualComponent | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children && node.children.length > 0) {
        const found = findComponentByIdRecursive(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const firstSelectedComponentData = selectedComponentIds.length > 0
    ? findComponentByIdRecursive(pageStructure, selectedComponentIds[0])
    : null;

  // --- Toolbar Action Placeholders ---
  const handleSave = () => console.log('Save action triggered', pageStructure);
  const handlePreview = () => console.log('Preview action triggered');
  const handleCopy = () => console.log('Copy action triggered', selectedComponentIds);
  const handlePaste = () => console.log('Paste action triggered');
  const handleDuplicate = () => console.log('Duplicate action triggered', selectedComponentIds);
  const handleAlign = (type: string) => console.log(`Align ${type} triggered`, selectedComponentIds);
  const handleDistribute = (type: string) => console.log(`Distribute ${type} triggered`, selectedComponentIds);

  // --- Render ---
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* TODO: Add Toolbar component here and pass handlers */}
      {/* <EditorToolbar onUndo={handleUndo} onRedo={handleRedo} ... /> */}

      <Tabs defaultValue="ui" className="flex flex-col flex-grow min-h-0"> {/* Ensure Tabs container can shrink */}
        <TabsList className="shrink-0 border-b">
          <TabsTrigger value="ui">UI Editor</TabsTrigger>
          <TabsTrigger value="code">Code Editor</TabsTrigger>
        </TabsList>

        {/* UI Editor Tab */}
        <TabsContent value="ui" className="flex-grow overflow-auto min-h-0"> {/* Allow content to grow and scroll */}
           <div className="h-full w-full"> {/* Ensure inner div takes full space */}
             <UIEditor
               // Pass pageStructure. UIEditor needs to be compatible with VisualComponent[]
               // or use a cast like 'pageStructure as any' if absolutely necessary temporarily.
               pageStructure={pageStructure}
               selectedComponentIds={selectedComponentIds} // Pass the full array as expected by UIEditor
               onSelectComponent={handleSelectComponent}
               onDropComponent={handleDropComponent} // Passed down to Canvas
               onMoveComponent={handleMoveComponent} // Passed down to Canvas
               onUpdateProps={handleUpdateProps}     // Passed down to PropertyPanel
               // selectedComponentData is handled internally by UIEditor
             />
           </div>
        </TabsContent>

        {/* Code Editor Tab */}
        <TabsContent value="code" className="flex-grow overflow-hidden min-h-0"> {/* Prevent overflow issues */}
           <div className="h-full w-full"> {/* Ensure inner div takes full space */}
             <CodeEditor
                // Pass the generated code strings as new props
                generatedHtml={generatedHtml}
                generatedCss={generatedCss}
                generatedJs={generatedJs}
                // TODO: Add onChange handlers to enable Code-to-UI sync
                // onHtmlChange={handleHtmlChange}
                // onCssChange={handleCssChange}
                // onJsChange={handleJsChange}
             />
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditorInterface;
