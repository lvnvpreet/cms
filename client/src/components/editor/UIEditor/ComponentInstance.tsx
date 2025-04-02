import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '../dndTypes'; // Import common DND types
import { ComponentData } from './Canvas'; // Import ComponentData type (assuming it's exported from Canvas or a types file)

// Import the actual UI components that can be rendered
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
// Add other component imports as needed

// Component Registry: Maps type strings to actual component functions
// Consider moving this to a central utility file if used elsewhere
const componentRegistry: { [key: string]: React.ComponentType<any> } = {
  Button: Button,
  Card: Card,
  Input: Input,
  // Add other components here
};

// Function to get the actual React component based on its type string
const getComponentByType = (type: string): React.ComponentType<any> | null => {
  const Component = componentRegistry[type];
  if (!Component) {
    console.warn(`[ComponentInstance] Component type "${type}" not found in registry.`);
    return (props: any) => <div {...props} className="border border-red-500 p-1 text-red-500 text-xs">Unknown type: {type}</div>;
  }
  return Component;
};

interface ComponentInstanceProps {
  componentData: ComponentData;
  onSelectComponent: (id: string | null) => void;
  // Add isSelected prop if visual indication is needed
  // isSelected: boolean;
}

const ComponentInstance: React.FC<ComponentInstanceProps> = ({
  componentData,
  onSelectComponent,
  // isSelected, // Uncomment if needed
}) => {
  const ActualComponent = getComponentByType(componentData.type);
  const componentRef = useRef<HTMLDivElement>(null); // Ref for the draggable element

  // --- Drag Source Setup ---
  // Hooks are now called consistently within each instance of this component
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.COMPONENT,
    item: { id: componentData.id, type: componentData.type }, // Pass ID and type for moving existing items
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [componentData.id, componentData.type]); // Dependencies for the hook

  // Attach drag ref to the component ref
  drag(componentRef);

  // Recursive rendering function for children *within* this component instance
  // Note: This simple version doesn't make children individually draggable/selectable from here.
  // A more complex editor might render nested ComponentInstance components.
  const renderChildComponent = (child: ComponentData) => {
     const ChildActualComponent = getComponentByType(child.type);
     if (!ChildActualComponent) return <div key={child.id} className="text-red-500">Error: Child type "{child.type}" not found.</div>;
     return (
        <ChildActualComponent key={child.id} {...child.props}>
            {child.children && child.children.length > 0
              ? child.children.map(renderChildComponent)
              : child.props.children}
        </ChildActualComponent>
     );
  };

  // TODO: Add selection border based on isSelected prop
  // const borderStyle = isSelected ? 'border-blue-500' : 'border-transparent';

  return (
    // Attach ref, apply dragging style, and set absolute position
    <div
      ref={componentRef}
      data-component-id={componentData.id}
      // className={`component-wrapper absolute p-1 hover:border-blue-300 cursor-move ${borderStyle}`} // Add selection border
      className="component-wrapper absolute p-1 border border-transparent hover:border-blue-300 cursor-move" // Base style
      style={{
        left: `${componentData.x || 0}px`,
        top: `${componentData.y || 0}px`,
        zIndex: componentData.zIndex || 'auto', // Apply zIndex, default to auto
        opacity: isDragging ? 0.5 : 1, // Reduce opacity when dragging
      }}
      onClick={(e) => {
        e.stopPropagation(); // Prevent click from bubbling up to the canvas (which deselects)
        onSelectComponent(componentData.id);
      }}
    >
      {ActualComponent ? (
        <ActualComponent {...componentData.props}>
          {/* Render children */}
          {componentData.children && componentData.children.length > 0
            ? componentData.children.map(renderChildComponent)
            : componentData.props.children /* Pass through primitive children */}
        </ActualComponent>
      ) : (
        // Fallback if component type not found
        <div className="text-red-500">Error: Component type "{componentData.type}" not found.</div>
      )}
    </div>
  );
};

export default ComponentInstance;
