import React from 'react';
import { ComponentData } from './Canvas'; // Assuming ComponentData is exported or moved to types

interface LayerNavigatorProps {
  pageStructure: ComponentData[];
  selectedComponentId: string | null;
  onSelectComponent: (id: string | null) => void;
  // TODO: Add props for reordering, nesting, visibility toggling
  // onReorderComponent: (draggedId: string, targetId: string | null, position: 'before' | 'after' | 'inside') => void;
  // onToggleVisibility: (id: string) => void;
}

const LayerNavigator: React.FC<LayerNavigatorProps> = ({
  pageStructure,
  selectedComponentId,
  onSelectComponent,
  // onReorderComponent,
  // onToggleVisibility,
}) => {

  // Recursive function to render each node in the layer tree
  const renderLayerNode = (component: ComponentData, level: number = 0) => {
    const isSelected = selectedComponentId === component.id;

    // TODO: Implement drag source and drop target logic for reordering/nesting
    // const [{ isDragging }, dragRef] = useDrag(...);
    // const [{ isOver, canDrop }, dropRef] = useDrop(...);

    return (
      <div key={component.id} /* ref={nodeRef combining dragRef and dropRef} */ >
        <div
          onClick={() => onSelectComponent(component.id)}
          className={`
            flex items-center p-1 pl-${2 + level * 2} /* Indentation */
            cursor-pointer rounded
            hover:bg-gray-200
            ${isSelected ? 'bg-blue-100' : 'bg-transparent'}
          `}
          // TODO: Add drag handlers (onDragStart, etc.)
        >
          {/* TODO: Add expand/collapse icon for nodes with children */}
          {/* TODO: Add visibility toggle icon */}
          <span className="text-sm ml-1">
            {component.type} {/* Display component type or a custom label */}
            {/* Maybe add component ID for debugging: ({component.id.substring(0, 4)}) */}
          </span>
        </div>
        {/* Render children recursively */}
        {/* TODO: Add logic to handle collapsed state */}
        {component.children && component.children.length > 0 && (
          <div className="layer-children">
            {component.children.map(child => renderLayerNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // TODO: Add keyboard shortcut handling (e.g., using useEffect and event listeners)

  return (
    <div className="p-2 border-r border-gray-300 bg-gray-50 h-full overflow-y-auto">
      <h3 className="text-lg font-semibold mb-2">Layers</h3>
      <div>
        {pageStructure.map(component => renderLayerNode(component))}
      </div>
    </div>
  );
};

export default LayerNavigator;
