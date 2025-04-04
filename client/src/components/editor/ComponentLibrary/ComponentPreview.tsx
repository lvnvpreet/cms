import React, { useRef } from 'react'; // Import useRef
import { useDrag } from 'react-dnd'; // Import useDrag
import { ItemTypes } from '../../../types'; // Import ItemTypes

// Define a more specific type for component data later
interface ComponentData {
  id: string;
  name: string;
  description: string;
  // Add other relevant properties: preview image/element, properties, etc.
  category?: string;
  type: string; // Example: 'Button', 'Card', etc. Needed for drag data
}

interface ComponentPreviewProps {
  component: ComponentData;
  // Add props for handling selection, drag start, etc.
}

const ComponentPreview: React.FC<ComponentPreviewProps> = ({ component }) => {

  // --- react-dnd Drag Source Setup ---
  const ref = useRef<HTMLDivElement>(null); // Create a ref for the draggable element
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.COMPONENT, // Define the type of the draggable item
    // The item is the data that gets transferred on drop
    item: { type: component.type /* Pass only the type, or the full component data */ },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(), // Check if the item is currently being dragged
    }),
    // Optional: end(item, monitor) can be used to trigger actions when drag ends
  }), [component.type]); // Dependency array includes component type

  // Connect the drag source to the ref *after* the hook definition
  drag(ref);

  // --- Remove native drag handler ---
  // const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => { ... }; // Removed

  return (
  // Attach the regular ref to the main div
  // Apply styles based on dragging state
  <div
    ref={ref} // Attach the useRef here
    className={`component-preview border p-3 rounded bg-white shadow-sm cursor-grab hover:shadow-md transition-shadow ${
      isDragging ? 'opacity-50 ring-2 ring-blue-500' : '' // Style when dragging
    }`}
      // draggable attribute and onDragStart are no longer needed
      title={`Drag to add ${component.name}`} // Tooltip for usability
    >
      {/* Placeholder for visual preview */}
      <div className="preview-visual h-20 bg-gray-200 mb-2 flex items-center justify-center text-gray-500 pointer-events-none"> {/* Prevent preview from interfering with drag */}
        Preview
      </div>
      <h4 className="font-semibold text-sm truncate">{component.name}</h4>
      <p className="text-xs text-gray-600 truncate">{component.description}</p>
      {/* Add more details like properties, variants, actions later */}
    </div>
  );
};

export default ComponentPreview;
