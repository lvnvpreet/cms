import React, { useState, useRef } from 'react';
import { useDrop, DropTargetMonitor } from 'react-dnd';
import ComponentInstance from './ComponentInstance';
import { ItemTypes, VisualComponent } from '../../../types'; // Import VisualComponent type

// Define types for component data if not imported
// Using VisualComponent from types.ts now
export type ComponentData = VisualComponent;

interface CanvasProps {
  pageStructure: ComponentData[];
  selectedComponentId: string | null;
  onSelectComponent: (id: string | null) => void;
  onDropComponent: (item: { type: string; id?: string }, position: { x: number; y: number }) => void; // Updated item type
  onMoveComponent: (id: string, newPosition: { x: number; y: number }) => void; // Updated position type
}

const Canvas: React.FC<CanvasProps> = ({
  pageStructure,
  selectedComponentId,
  onSelectComponent,
  onDropComponent,
  onMoveComponent,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const canvasRef = useRef<HTMLDivElement>(null);

  // --- Drag and Drop Setup (Drop Target) ---
  const [{ canDrop, isOver }, drop] = useDrop( // Hook call starts here
    () => ({ // Factory function returning the spec object
      accept: ItemTypes.COMPONENT, // Define what item types are accepted
      drop: (item: { type: string; id?: string }, monitor: DropTargetMonitor) => { // Function called when a valid item is dropped
        console.log('[Canvas drop] Fired. Item:', JSON.stringify(item));
        const delta = monitor.getClientOffset(); // Get drop position relative to viewport
        if (!delta) {
          console.error('[Canvas drop] Could not get client offset.');
          return;
        }
        if (!canvasRef.current) {
          console.error('[Canvas drop] Canvas ref is not available.');
          return;
        }

        const canvasRect = canvasRef.current.getBoundingClientRect();
        console.log('[Canvas drop] Viewport Drop Coords (delta):', delta);
        console.log('[Canvas drop] Canvas Rect:', canvasRect);
        console.log('[Canvas drop] Canvas Scroll:', { left: canvasRef.current.scrollLeft, top: canvasRef.current.scrollTop });
        console.log('[Canvas drop] Zoom Level:', zoomLevel);

        // Calculate drop position relative to the canvas, accounting for scroll and zoom
        const dropPosition = {
          x: (delta.x - canvasRect.left + canvasRef.current.scrollLeft) / zoomLevel,
          y: (delta.y - canvasRect.top + canvasRef.current.scrollTop) / zoomLevel,
        };
        console.log('[Canvas drop] Calculated Drop Position (relative to canvas):', dropPosition);

        // Check if position is valid numbers
        if (isNaN(dropPosition.x) || isNaN(dropPosition.y)) {
          console.error('[Canvas drop] Invalid drop position calculated:', dropPosition);
          return;
        }

        if (item.id) {
          // If the dragged item has an ID, it's an existing component being moved
          console.log('[Canvas drop] Moving component:', item.id, 'to position:', dropPosition);
          onMoveComponent(item.id, dropPosition); // Call the move handler
        } else {
          // Otherwise, it's a new component being dropped from the palette
          console.log('[Canvas drop] Dropping new component:', item.type, 'at position:', dropPosition);
          onDropComponent(item, dropPosition); // Call the drop handler passed via props
        }
      }, // End of the drop function definition in the spec object
      collect: (monitor: DropTargetMonitor) => ({ // Function to collect props from the monitor state
        isOver: !!monitor.isOver(), // Is an item currently dragged over this target?
        canDrop: !!monitor.canDrop(), // Can this target accept the dragged item?
      }), // End of the collect function definition in the spec object
    }), // End of the spec object returned by the factory function
    [zoomLevel, onDropComponent, onMoveComponent] // Dependencies for the useDrop hook
  ); // End of the useDrop hook call

  // Attach drop ref to the canvas ref
  drop(canvasRef);

  // Determine background color based on drop state
  const getBackgroundColor = () => {
    if (isOver && canDrop) {
      return 'bg-blue-100'; // Highlight when a valid component is dragged over
    }
    // Removed the intermediate gray state for simplicity
    // if (canDrop) {
    //   return 'bg-gray-200';
    // }
    return 'bg-gray-100'; // Default background
  };

  return (
    <div
      ref={canvasRef} // Attach the ref here
      className={`relative h-full w-full overflow-auto border border-gray-300 ${getBackgroundColor()}`} // Use dynamic background
      style={{
        transform: `scale(${zoomLevel})`,
        // backgroundSize: '20px 20px', // Example grid size
        // backgroundImage: 'linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)',
      }}
      onClick={() => onSelectComponent(null)} // Deselect on canvas click
    >
      {/* Render the component tree using ComponentInstance */}
      {pageStructure.map((component) => (
        <ComponentInstance
          key={component.id}
          componentData={component} // Pass the full VisualComponent data
          onSelectComponent={onSelectComponent}
          // Pass isSelected prop if needed: isSelected={selectedComponentId === component.id}
        />
      ))}

      {/* Visual indication overlay */}
      {isOver && canDrop && (
         <div className="absolute inset-0 bg-blue-500 opacity-20 pointer-events-none z-10 flex items-center justify-center text-blue-800 font-bold">
           Drop Here
         </div>
       )}
    </div>
  );
};

export default Canvas;
