import React from 'react';

interface DropZoneProps {
  // Define props here
  onDrop: (componentType: string) => void; // Example prop
}

const DropZone: React.FC<DropZoneProps> = ({ onDrop }) => {
  // Component logic for handling drag and drop
  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const componentType = event.dataTransfer.getData('componentType');
    if (componentType) {
      onDrop(componentType);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault(); // Necessary to allow dropping
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{ border: '2px dashed gray', minHeight: '50px', padding: '10px' }}
    >
      Drop Component Here
    </div>
  );
};

export default DropZone;
