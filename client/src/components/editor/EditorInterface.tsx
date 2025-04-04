// client/src/components/editor/EditorInterface.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Removed TabsContent
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
// Import the specific UI components instead of the wrapper
import ComponentLibrary from './ComponentLibrary';
import Canvas from './UIEditor/Canvas'; // Assuming path is correct
import PropertyPanel from './UIEditor/PropertyPanel'; // Assuming path is correct
import CodeEditor from './CodeEditor';
import TemplatesInterface from './Templates';
import Toolbar from './Toolbar';
// Import Preview Components
import { LivePreview, DevicePreview } from '../preview';
import { nanoid } from 'nanoid';
import { VisualComponent, ComponentProps } from '../../types';
// Import eventBus (assuming SyncEngine/index.ts exports it or we import directly)
import { eventBus } from './SyncEngine/EventBus';
// Keep transformUIToCode for initial/direct generation if needed, but sync handles updates
import { transformUIToCode } from './SyncEngine/UIToCode';

// Define props for the EditorInterface
interface EditorInterfaceProps {
  siteId?: string; // Optional: ID of the site being edited
  initialData?: any; // Optional: Initial data to load (replace 'any' with a specific type later)
}

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

// Update component signature to accept props
const EditorInterface: React.FC<EditorInterfaceProps> = ({ siteId, initialData }) => {
  // Log the received siteId (useful for debugging)
  console.log('[EditorInterface] Received siteId prop:', siteId);
  console.log('[EditorInterface] Received initialData prop:', initialData ? 'Data provided' : 'No initial data');

  // State for the visual structure (potentially initialized from initialData later)
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

  // --- Core Update Function (now primarily updates state, event triggers sync) ---
  const updateStructure = useCallback((newStructure: VisualComponent[], updateHistory = true, source: 'internal' | 'sync' = 'internal') => {
    // Prevent updates originating from sync from re-triggering sync
    const isInternalChange = source === 'internal';

    if (updateHistory && isInternalChange) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newStructure);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
    setPageStructure(newStructure);

    // Code generation is now handled by SyncEngine triggered by the 'ui:change' event
    // We remove the direct call to transformUIToCode here.

    // If the change was internal (user action), publish the event
    // if (isInternalChange) {
    //   // Publishing moved to useEffect hook below to ensure state is updated first
    // }

  }, [history, historyIndex]); // Dependencies for useCallback

  // --- Publish UI Changes via Event Bus ---
  useEffect(() => {
    // This effect runs whenever pageStructure changes *after* the initial render
    // We check if it's not the initial structure to avoid publishing on mount
    if (pageStructure !== initialPageStructure) {
        console.log('[EditorInterface] Publishing ui:change event');
        eventBus.publish('ui:change', { componentTree: pageStructure });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageStructure]); // Triggered by pageStructure changes

  // --- Subscribe to Sync Engine Updates & Initial Code Gen ---
  useEffect(() => {
    // Generate code for the initial structure on mount (using direct call)
    const rootNode: VisualComponent = {
      id: 'canvas-root-initial', type: 'div', props: {}, children: initialPageStructure
    };
    try {
       // Destructure, providing default for optional javascript
       const { html, css, javascript, eventHandlers } = transformUIToCode(rootNode);
       setGeneratedHtml(html);
       setGeneratedCss(css);
       setGeneratedJs(javascript || ''); // Provide default empty string
       // TODO: Store or handle eventHandlers if needed by the editor/preview
       console.log("Initial code generated. Handlers:", eventHandlers ? Object.keys(eventHandlers).length : 0);
     } catch (error) {
       console.error("Error during initial UI to Code transformation:", error);
    }

    // Subscribe to updates from SyncEngine
    console.log('[EditorInterface] Subscribing to sync engine events');
    const unsubscribeUiUpdated = eventBus.subscribe('ui:updated', (payload: any) => {
      console.log('[EditorInterface] Received ui:updated event', payload);
      if (payload && payload.componentTree) {
        // Update structure without adding to history and mark as from 'sync'
        updateStructure(payload.componentTree, false, 'sync');
        setSelectedComponentIds([]); // Clear selection on external update
      }
    });

    const unsubscribeCodeUpdated = eventBus.subscribe('code:updated', (payload: any) => {
        console.log('[EditorInterface] Received code:updated event', payload);
        if (payload && typeof payload.code === 'string') {
            // Assuming payload.code contains the HTML for now
            // TODO: Handle CSS and JS updates if SyncEngine provides them separately
            setGeneratedHtml(payload.code);
            // Potentially clear CSS/JS or handle them based on SyncEngine output
            // setGeneratedCss('');
            // setGeneratedJs('');
        }
    });

    // Cleanup function
    return () => {
      console.log('[EditorInterface] Unsubscribing from sync engine events');
      unsubscribeUiUpdated();
      unsubscribeCodeUpdated();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateStructure]); // Include updateStructure in dependency array

  // --- History Handlers ---
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      // Update structure without adding to history and mark as internal (undo/redo are user actions)
      updateStructure(history[newIndex], false, 'internal');
      setSelectedComponentIds([]);
    }
  }, [history, historyIndex, updateStructure]);

  // Determine if undo/redo is possible
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

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
    updateStructure(updatedStructure, true, 'internal'); // Mark as internal change
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
     updateStructure(updatedStructure, true, 'internal'); // Mark as internal change
   }, [pageStructure, updateStructure]);

  const handleDropComponent = useCallback((item: { type: string; id?: string }, position: { x: number; y: number }) => {
    console.log('[EditorInterface handleDropComponent] Fired.');
    console.log('[EditorInterface handleDropComponent] Received item:', JSON.stringify(item));
    console.log('[EditorInterface handleDropComponent] Received position:', position);

    // Validate position
    if (position === null || typeof position.x !== 'number' || typeof position.y !== 'number' || isNaN(position.x) || isNaN(position.y)) {
      console.error('[EditorInterface handleDropComponent] Invalid or null position received:', position);
      return; // Prevent proceeding with invalid position
    }

    // Validate item type
    if (!item || typeof item.type !== 'string') {
      console.error('[EditorInterface handleDropComponent] Invalid or missing item type:', item);
      return; // Prevent proceeding with invalid item
    }


    // If item has an ID, it's a move, which should be handled by handleMoveComponent via useDrop in Canvas
    if (item.id) {
        console.log("Drop interpreted as move for:", item.id);
        handleMoveComponent(item.id, position);
        return; // Prevent adding a new component
    }

    // It's a new component drop
    // Define default props based on component type
    let defaultProps: ComponentProps = {};
    switch (item.type) {
      case 'Button':
        defaultProps = { children: 'New Button', variant: 'default', className: 'm-1' };
        break;
      case 'Card':
        defaultProps = { children: 'New Card Content', className: 'p-4 shadow' };
        break;
      case 'Input':
        defaultProps = { placeholder: 'New Input', className: 'm-1 border p-1' }; // Added border/padding
        break;
      case 'Checkbox':
        defaultProps = { 'aria-label': 'New Checkbox', className: 'm-1' }; // Added margin
        break;
      case 'Container':
        // Containers need explicit size or content to be visible
        defaultProps = { className: 'p-4 border border-dashed border-gray-400 min-h-[50px] min-w-[50px]', children: `New Container (${item.type})` }; // Added border, size, and text
        break;
      case 'Heading':
        defaultProps = { children: 'New Heading', className: 'text-xl font-bold m-1' }; // Added text and margin
        break;
      default:
        // Default for unknown types (though ComponentInstance has a fallback)
        defaultProps = { children: `New ${item.type}` };
    }

    const newComponent: VisualComponent = {
      id: nanoid(),
      type: item.type,
      props: defaultProps, // Use default props
      children: [], // Initialize children
      x: Math.round(position.x), // Round position
      y: Math.round(position.y),
      // Explicitly type accumulator and current value in reduce
      zIndex: (pageStructure.reduce((maxZ: number, c: VisualComponent) => Math.max(maxZ, c.zIndex || 0), 0) + 1),
    };
    const updatedStructure = [...pageStructure, newComponent];
    updateStructure(updatedStructure, true, 'internal'); // Mark as internal change
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

  // --- Code Change Handlers (Placeholders) ---
  const handleHtmlChange = useCallback((newHtml: string) => {
    console.log('[EditorInterface] HTML changed (placeholder)');
    setGeneratedHtml(newHtml); // Update local state immediately for responsiveness
    // TODO: Debounce this call
    eventBus.publish('code:change', { code: newHtml, language: 'html' }); // Publish change
  }, []);

  const handleCssChange = useCallback((newCss: string) => {
    console.log('[EditorInterface] CSS changed (placeholder)');
    setGeneratedCss(newCss);
    // TODO: Debounce this call
    eventBus.publish('code:change', { code: newCss, language: 'css' }); // Publish change
  }, []);

  const handleJsChange = useCallback((newJs: string) => {
    console.log('[EditorInterface] JS changed (placeholder)');
    setGeneratedJs(newJs);
    // TODO: Debounce this call
    eventBus.publish('code:change', { code: newJs, language: 'javascript' }); // Publish change
  }, []);

  // --- Toolbar Action Placeholders ---
  // TODO: Implement actual save/preview logic
  const handleSave = () => console.log('Save action triggered', pageStructure);
  const handlePreview = () => console.log('Preview action triggered');
  const handleCopy = () => console.log('Copy action triggered', selectedComponentIds);
  const handlePaste = () => console.log('Paste action triggered');
  const handleDuplicate = () => console.log('Duplicate action triggered', selectedComponentIds);
  const handleAlign = (type: string) => console.log(`Align ${type} triggered`, selectedComponentIds);
  const handleDistribute = (type: string) => console.log(`Distribute ${type} triggered`, selectedComponentIds);

  // State for the active view in the main panel (UI Canvas, Code, Templates, Preview)
  const [activeMainView, setActiveMainView] = useState<'ui' | 'code' | 'templates' | 'preview'>('ui');

  // --- Render ---
  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden"> {/* Prevent body scroll */}
      {/* Integrate the Toolbar */}
      {/* TODO: Update Toolbar component to accept necessary props (onUndo, onRedo, etc.) */}
      <Toolbar
        // onUndo={handleUndo} // Temporarily removed - Toolbar needs update
        // onRedo={handleRedo} // Temporarily removed - Toolbar needs update
        // canUndo={canUndo}   // Temporarily removed - Toolbar needs update
        // canRedo={canRedo}   // Temporarily removed - Toolbar needs update
        // onSave={handleSave} // Temporarily removed - Toolbar needs update
        // onPreview={handlePreview} // Temporarily removed - Toolbar needs update
      />

      {/* Main Editor Layout using Resizable Panels */}
      <PanelGroup direction="horizontal" className="flex-grow min-h-0"> {/* PanelGroup takes remaining space */}

        {/* Left Panel (Component Library) */}
        <Panel defaultSize={15} minSize={10} maxSize={25} className="bg-muted/40 overflow-y-auto">
           {/* Render ComponentLibrary directly */}
           <ComponentLibrary />
        </Panel>

        <PanelResizeHandle className="w-1 bg-border hover:bg-primary transition-colors flex items-center justify-center">
          <div className="w-1 h-8 bg-muted-foreground/50 rounded-full" /> {/* Handle visual indicator */}
        </PanelResizeHandle>

        {/* Center Panel (Canvas / Code / Templates / Preview) */}
        <Panel defaultSize={60} minSize={30}> {/* Adjusted size */}
          <PanelGroup direction="vertical" className="h-full">
            {/* Top section of Center Panel (Tabs for switching views) */}
            <Panel defaultSize={5} minSize={5} maxSize={10} className="border-b">
              <Tabs value={activeMainView} onValueChange={(value) => setActiveMainView(value as any)} className="h-full flex flex-col">
                <TabsList className="shrink-0 rounded-none border-none px-2 pt-1">
                  <TabsTrigger value="ui">UI Canvas</TabsTrigger>
                  <TabsTrigger value="code">Code Editor</TabsTrigger>
                  <TabsTrigger value="templates">Templates</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
              </Tabs>
            </Panel>

            {/* Bottom section of Center Panel (Actual Content based on activeMainView) */}
            {/* Use Panel directly for content area */}
            <Panel defaultSize={95} minSize={50} className="overflow-hidden relative bg-background"> {/* Use overflow-hidden if children manage scroll */}
              {activeMainView === 'ui' && (
                 <Canvas
                   pageStructure={pageStructure}
                   // Pass only the first ID for now, or update Canvas to handle array
                   selectedComponentId={selectedComponentIds[0] ?? null}
                   onSelectComponent={handleSelectComponent}
                   onDropComponent={handleDropComponent}
                   onMoveComponent={handleMoveComponent}
                   // Add context menu handler if needed
                 />
              )}
              {activeMainView === 'code' && (
                // Ensure CodeEditor takes full height/width
                <div className="h-full w-full">
                  <CodeEditor
                    generatedHtml={generatedHtml}
                    generatedCss={generatedCss}
                    generatedJs={generatedJs}
                    onHtmlChange={handleHtmlChange}
                    onCssChange={handleCssChange}
                    onJsChange={handleJsChange}
                  />
                </div>
              )}
              {activeMainView === 'templates' && (
                 <div className="h-full w-full p-4 overflow-y-auto"> {/* Allow scrolling for templates */}
                   <TemplatesInterface />
                 </div>
              )}
              {activeMainView === 'preview' && (
                // Ensure Preview takes full height/width and handles its own scrolling
                /* Render DevicePreview wrapping LivePreview */
                /* DevicePreview handles its own background and padding */
                <DevicePreview>
                   {/* LivePreview will eventually get content from SyncEngine/PreviewFrame */}
                   <LivePreview />
                </DevicePreview>
              )}
            </Panel>
          </PanelGroup>
        </Panel>

        <PanelResizeHandle className="w-1 bg-border hover:bg-primary transition-colors flex items-center justify-center">
           <div className="w-1 h-8 bg-muted-foreground/50 rounded-full" /> {/* Handle visual indicator */}
        </PanelResizeHandle>

        {/* Right Panel (Property Panel) - Conditionally render or adjust based on view */}
        <Panel defaultSize={25} minSize={15} maxSize={35} className="bg-muted/40 overflow-y-auto"> {/* Adjusted size */}
           {/* Render PropertyPanel directly, passing selected data and handler */}
           {/* Only show content if in UI mode and a component is selected */}
           {activeMainView === 'ui' && (
             <div className="p-4"> {/* Add padding */}
               <PropertyPanel
                 selectedComponent={firstSelectedComponentData}
                 onUpdateProps={handleUpdateProps}
               />
             </div>
           )}
           {/* Optionally show a placeholder if not in UI mode or nothing selected */}
           {activeMainView !== 'ui' && (
              <div className="p-4 text-sm text-muted-foreground">
                Properties available in UI Canvas mode.
              </div>
           )}
           {activeMainView === 'ui' && !firstSelectedComponentData && (
              <div className="p-4 text-sm text-muted-foreground">
                Select a component on the canvas to see its properties.
              </div>
           )}
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default EditorInterface;
