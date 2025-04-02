import React, { useState, useRef } from 'react'; // Added useRef
import { useDrop, useDrag } from 'react-dnd'; // Import useDrop and useDrag
// Import components that can be rendered on the canvas
import { Button } from '@/components/ui/button'; // Assuming path alias works
import { Card } from '@/components/ui/card';     // Assuming path alias works
import { Input } from '@/components/ui/input';   // Assuming path alias works
// Add other component imports as needed

// Potentially import state management hooks (e.g., useSelector, useDispatch)
// Potentially import drag-and-drop library hooks
// Potentially import types for page structure/components

// Define ItemTypes for react-dnd and export it
export const ItemTypes = {
  COMPONENT: 'component', // Represents a draggable component from the palette or canvas
};

// Define types for component data if not imported (consider moving to a types file)
interface ComponentData {
  id: string;
  type: string; // e.g., 'Button', 'Card'
  props: Record<string, any>;
  children?: ComponentData[];
  // Position properties for absolute positioning
  x?: number;
  y?: number;
  // gridRowEnd?: number;
  // gridColumnEnd?: number;
}

interface CanvasProps {
  // Props to receive the page structure/component tree from state
  pageStructure: ComponentData[]; // Example prop
  // Props for selected component ID, etc.
  selectedComponentId: string | null;
  onSelectComponent: (id: string | null) => void;
  // Props for handling component drops
  onDropComponent: (item: any, position: { x: number; y: number }) => void;
  // Props for handling component moves/reordering
  onMoveComponent: (id: string, newPosition: any) => void;
}

const Canvas: React.FC<CanvasProps> = ({
  pageStructure,
  selectedComponentId,
  onSelectComponent,
  onDropComponent,
  onMoveComponent,
}) => {
  // State for managing canvas interactions (e.g., zoom, pan - if needed)
  const [zoomLevel, setZoomLevel] = useState(1);
  const canvasRef = useRef<HTMLDivElement>(null); // Ref for the canvas element

  // --- Drag and Drop Setup (Drop Target) ---
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.COMPONENT, // Accept items of type 'component'
    drop: (item: any, monitor) => { // item is the dragged data (e.g., { type: 'Button' })
      const delta = monitor.getClientOffset(); // Drop position relative to viewport
      if (delta && canvasRef.current) {
        const canvasRect = canvasRef.current.getBoundingClientRect();
        // Calculate drop position relative to the canvas, accounting for scroll and zoom
        // This calculation might need refinement based on exact layout/styling
        const dropPosition = {
          x: (delta.x - canvasRect.left + canvasRef.current.scrollLeft) / zoomLevel,
            y: (delta.y - canvasRect.top + canvasRef.current.scrollTop) / zoomLevel,
          };

          if (item.id) {
            // If the dragged item has an ID, it's an existing component being moved
            console.log('Moving component:', item.id, 'to position:', dropPosition);
            onMoveComponent(item.id, dropPosition); // Call the move handler
          } else {
            // Otherwise, it's a new component being dropped from the palette
            console.log('Dropping new component:', item.type, 'at position:', dropPosition);
            onDropComponent(item, dropPosition); // Call the drop handler
          }
        }
      },
      collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }), [zoomLevel, onDropComponent]); // Dependencies for the drop hook

  // Attach drop ref to the canvas ref
  drop(canvasRef);

  // --- Component Rendering Logic ---

  // Component Registry: Maps type strings to actual component functions
  const componentRegistry: { [key: string]: React.ComponentType<any> } = {
    Button: Button,
    Card: Card,
    Input: Input,
    // Add other components here as they are imported
    // Example: 'Checkbox': Checkbox,
  };

  // Function to get the actual React component based on its type string
  const getComponentByType = (type: string): React.ComponentType<any> | null => {
    const Component = componentRegistry[type];
    if (!Component) {
      console.warn(`Component type "${type}" not found in registry.`);
      // Return a placeholder for unknown types
      return (props: any) => <div {...props} className="border border-red-500 p-1 text-red-500 text-xs">Unknown type: {type}</div>;
    }
    return Component;
  };

  const renderComponent = (component: ComponentData) => {
    const ActualComponent = getComponentByType(component.type);
    const componentRef = useRef<HTMLDivElement>(null); // Ref for the draggable element

    // --- Drag Source Setup ---
    const [{ isDragging }, drag] = useDrag(() => ({
      type: ItemTypes.COMPONENT,
      item: { id: component.id, type: component.type /* Add original position/index if needed for move */ }, // Data transferred on drag
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      // Optional: end drag handler (e.g., if moving existing items)
      // end: (item, monitor) => {
      //   const didDrop = monitor.didDrop();
      //   if (!didDrop) {
      //     // Handle drop outside a valid target (e.g., revert position)
      //   }
      // },
    }), [component.id, component.type]);

    // Attach drag ref to the component ref
    drag(componentRef);

    // TODO: Wrap this in ComponentInstance later to handle selection, drag handles, etc.
    // <ComponentInstance key={component.id} componentData={component} ... >
    return (
      // Attach ref, apply dragging style, and set absolute position
      <div
        ref={componentRef}
        key={component.id}
        data-component-id={component.id}
        className="component-wrapper absolute p-1 border border-transparent hover:border-blue-300 cursor-move" // Use absolute positioning
        style={{
          left: `${component.x || 0}px`, // Use x coordinate, default to 0
          top: `${component.y || 0}px`,   // Use y coordinate, default to 0
          opacity: isDragging ? 0.5 : 1, // Reduce opacity when dragging
        }}
        // TODO: Add onClick handler for selection here if not using ComponentInstance
        // onClick={(e) => { e.stopPropagation(); onSelectComponent(component.id); }}
      >
        {ActualComponent ? (
          <ActualComponent {...component.props}>
            {/* Recursively render children */}
            {component.children && component.children.length > 0
              ? component.children.map(renderComponent)
              : component.props.children /* Pass through primitive children like text */}
          </ActualComponent>
        ) : (
          <div className="text-red-500">Error: Component type "{component.type}" not found.</div>
        )}
      </div>
    );
    // </ComponentInstance> // Closing tag for the eventual ComponentInstance wrapper
  };

  // --- Grid System ---
  // Apply grid classes to the main canvas div
  // The specific grid implementation (CSS Grid, absolute positioning) depends on requirements

  // Determine background color based on drop state
  const getBackgroundColor = () => {
    if (isOver && canDrop) {
      return 'bg-blue-100'; // Highlight when a valid component is dragged over
    }
    if (canDrop) {
      return 'bg-gray-200'; // Slightly different bg if draggable is present but not over
    }
    return 'bg-gray-100'; // Default background
  };

  return (
    <div
      ref={canvasRef} // Attach the ref here
      className={`relative h-full w-full overflow-auto border border-gray-300 ${getBackgroundColor()}`} // Use dynamic background
      // Remove grid container classes if previously added, ensure parent is relative
      style={{
        // Potentially add dynamic styles for zoom/pan
        transform: `scale(${zoomLevel})`,
        // Add background grid pattern if desired
        backgroundImage: 'linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)',
        backgroundSize: '20px 20px', // Example grid size
      }}
      onClick={() => onSelectComponent(null)} // Deselect on canvas click
    >
      {/* --- Component Rendering --- */}
      {/* Render the component tree */}
      {pageStructure.map(renderComponent)}

      {/* --- Drop Zones (Optional) --- */}
      {/* May need explicit DropZone components depending on DND implementation */}

      {/* --- Selection Highlight --- */}
      {/* Visual indication for selected component (could be handled within ComponentInstance) */}

      {/* Visual indication (optional overlay) */}
      {isOver && canDrop && (
         <div className="absolute inset-0 bg-blue-500 opacity-20 pointer-events-none z-10 flex items-center justify-center text-blue-800 font-bold">
           Drop Here
         </div>
       )}
    </div>
  );
};

export default Canvas;
