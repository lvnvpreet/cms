import React from 'react';
import { ComponentData } from './Canvas'; // Assuming ComponentData is exported or moved to types

// Define a type for property configuration (could be more complex)
interface PropertyConfig {
  label: string;
  type: 'text' | 'number' | 'select' | 'checkbox' | 'color'; // Add more types as needed
  options?: string[]; // For select type
  section: 'Layout' | 'Styling' | 'Behavior' | 'Content'; // Example sections
}

// Example property schemas for different component types
// In a real app, this might come from a configuration file or API
const componentPropertySchemas: Record<string, Record<string, PropertyConfig>> = {
  Button: {
    children: { label: 'Text', type: 'text', section: 'Content' },
    variant: { label: 'Variant', type: 'select', options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'], section: 'Styling' },
    size: { label: 'Size', type: 'select', options: ['default', 'sm', 'lg', 'icon'], section: 'Styling' },
    // Add more Button props
  },
  Card: {
    // Card might have fewer direct props, maybe layout/styling?
    className: { label: 'Custom Classes', type: 'text', section: 'Styling' },
  },
  Input: {
    placeholder: { label: 'Placeholder', type: 'text', section: 'Content' },
    type: { label: 'Input Type', type: 'select', options: ['text', 'number', 'password', 'email'], section: 'Behavior' },
    // Add more Input props
  },
  // Add schemas for other components
};

interface PropertyPanelProps {
  selectedComponent: ComponentData | null;
  onUpdateProps: (componentId: string, newProps: Record<string, any>) => void;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedComponent,
  onUpdateProps,
}) => {
  if (!selectedComponent) {
    return (
      <div className="p-4 border-l border-gray-300 bg-gray-50 h-full text-gray-500">
        Select a component to edit its properties.
      </div>
    );
  }

  const schema = componentPropertySchemas[selectedComponent.type] || {};
  const properties = Object.entries(schema);

  const handleInputChange = (propName: string, value: any) => {
    const newProps = {
      ...selectedComponent.props,
      [propName]: value,
    };
    onUpdateProps(selectedComponent.id, newProps);
  };

  // Group properties by section
  const groupedProperties = properties.reduce((acc, [propName, config]) => {
    const section = config.section || 'Other';
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push([propName, config]);
    return acc;
  }, {} as Record<string, [string, PropertyConfig][]>);


  const renderFormControl = (propName: string, config: PropertyConfig) => {
    const currentValue = selectedComponent.props[propName] ?? '';

    // TODO: Implement different input types (select, checkbox, color picker, etc.)
    switch (config.type) {
      case 'select':
        return (
          <select
            value={currentValue}
            onChange={(e) => handleInputChange(propName, e.target.value)}
            className="w-full p-1 border border-gray-300 rounded mt-1"
          >
            {config.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      case 'number':
         return (
           <input
             type="number"
             value={currentValue}
             onChange={(e) => handleInputChange(propName, parseFloat(e.target.value) || 0)}
             className="w-full p-1 border border-gray-300 rounded mt-1"
           />
         );
      case 'text':
      default:
        return (
          <input
            type="text"
            value={currentValue}
            onChange={(e) => handleInputChange(propName, e.target.value)}
            className="w-full p-1 border border-gray-300 rounded mt-1"
          />
        );
    }
  };

  return (
    <div className="p-4 border-l border-gray-300 bg-gray-50 h-full overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4">Properties ({selectedComponent.type})</h3>

      {Object.entries(groupedProperties).map(([sectionName, propsInSection]) => (
        <div key={sectionName} className="mb-4">
          <h4 className="text-md font-medium mb-2 border-b border-gray-300">{sectionName}</h4>
          {propsInSection.map(([propName, config]) => (
            <div key={propName} className="mb-2">
              <label className="block text-sm font-medium text-gray-700">{config.label}</label>
              {renderFormControl(propName, config)}
            </div>
          ))}
        </div>
      ))}

    </div>
  );
};

export default PropertyPanel;
