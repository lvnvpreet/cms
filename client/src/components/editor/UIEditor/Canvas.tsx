import React, { useState, useRef } from 'react'; // Added useRef
import { useDrop, useDrag } from 'react-dnd'; // Import useDrop and useDrag
// Import components that can be rendered on the canvas
// Remove direct UI component imports if ComponentInstance handles them
// import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// Add other component imports as needed
import ComponentInstance from './ComponentInstance'; // Import the new component

// Potentially import state management hooks (e.g., useSelector, useDispatch)
// Potentially import drag-and-drop library hooks
// Potentially import types for page structure/components
import { ItemTypes } from '../../../types'; // Updated import path

// ItemTypes definition removed, now imported from ../../../types

// Define types for component data if not imported (consider moving to a types file)
export interface ComponentData { // Added export
  id: string;
  type: string; // e.g., 'Button', 'Card'
  props: Record<string, any>;
  children?: ComponentData[];
  // Position properties for absolute positioning
  x?: number;
  y?: number;
  // Stacking order
  zIndex?: number;
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
  // console.log('Canvas received pageStructure:', pageStructure); // Remove console log
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
  // Removed internal renderComponent, componentRegistry, getComponentByType
  // Logic is now handled by ComponentInstance

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
        // backgroundImage: 'linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)', // Temporarily removed
        // backgroundSize: '20px 20px', // Example grid size
      }}
      onClick={() => onSelectComponent(null)} // Deselect on canvas click
    >
      {/* --- Component Rendering --- */}
      {/* Render the component tree using ComponentInstance */}
      {pageStructure.map((component) => (
        <ComponentInstance
          key={component.id}
          componentData={component}
          onSelectComponent={onSelectComponent}
          // Pass isSelected prop if needed: isSelected={selectedComponentId === component.id}
        />
      ))}

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
