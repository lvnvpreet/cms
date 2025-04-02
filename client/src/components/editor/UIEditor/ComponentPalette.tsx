import React, { useRef } from 'react'; // Import useRef
import { useDrag } from 'react-dnd';
import { ItemTypes } from './Canvas'; // Import ItemTypes from Canvas

// Define the structure for palette items if needed (could be more complex later)
interface PaletteItem {
  type: string; // e.g., 'Button', 'Card'
  label: string; // Display name in the palette
  // Add preview component or thumbnail URL later
}

// List of components available in the palette
const availableComponents: PaletteItem[] = [
  { type: 'Button', label: 'Button' },
  { type: 'Card', label: 'Card' },
  { type: 'Input', label: 'Input' },
  // Add more components here
];

// Draggable item component within the palette
const DraggablePaletteItem: React.FC<{ item: PaletteItem }> = ({ item }) => {
  const itemRef = useRef<HTMLDivElement>(null); // Create a ref for the div
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.COMPONENT,
    // Item data transferred on drag: ONLY the type for new components
    item: { type: item.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  // Connect the drag source to the ref
  drag(itemRef);

  return (
    <div
      ref={itemRef} // Assign the explicit ref here
      className="p-2 m-1 border border-gray-300 bg-white rounded cursor-move hover:bg-gray-100"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {/* TODO: Add component preview thumbnail here */}
      <span>{item.label}</span>
    </div>
  );
};

// The main palette component
const ComponentPalette: React.FC = () => {
  // TODO: Add state and handler for search functionality
  // const [searchTerm, setSearchTerm] = useState('');
  // const filteredComponents = availableComponents.filter(...)

  return (
    <div className="p-2 border-l border-gray-300 bg-gray-50 h-full overflow-y-auto">
      <h3 className="text-lg font-semibold mb-2">Components</h3>

      {/* TODO: Add Search Input */}
      {/* <input
        type="text"
        placeholder="Search components..."
        className="w-full p-1 border border-gray-300 rounded mb-2"
        // value={searchTerm}
        // onChange={(e) => setSearchTerm(e.target.value)}
      /> */}

      {/* TODO: Add categorization logic later */}
      <div>
        {availableComponents.map((item) => (
          <DraggablePaletteItem key={item.type} item={item} />
        ))}
      </div>
    </div>
  );
};

export default ComponentPalette;
