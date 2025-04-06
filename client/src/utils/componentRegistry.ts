/**
 * @fileoverview Manages available UI components for the builder.
 *
 * Registers available components with their properties.
 * Defines component default values and constraints.
 * Provides metadata about components (categories, descriptions).
 * Serves as a central registry for all available components.
 */

// TODO: Define the structure for component definitions.
interface ComponentProperty {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'color' | 'style'; // Example types
  defaultValue?: any;
  options?: string[]; // For 'select' type
  label?: string;
  description?: string;
}

interface ComponentDefinition {
  type: string; // Unique identifier (e.g., 'core/button', 'layout/container')
  name: string; // Human-readable name (e.g., 'Button', 'Container')
  category: string; // e.g., 'Core', 'Layout', 'Typography'
  icon?: string; // Icon representation in the library
  description?: string;
  properties: ComponentProperty[];
  defaultProps?: { [key: string]: any };
  constraints?: {
    // e.g., allowed parent types, disallowed child types
    canBeChildOf?: string[];
    cannotHaveChildren?: boolean;
  };
  // Reference to the actual React component for rendering previews?
  // component?: React.ComponentType<any>;
}

// TODO: Implement the registry logic.
// - Use a Map or Object to store component definitions.
// - Provide functions to register, unregister, and retrieve components.

const componentRegistry = new Map<string, ComponentDefinition>();

/**
 * Registers a new component definition.
 * @param definition The component definition object.
 */
export const registerComponent = (definition: ComponentDefinition): void => {
  if (componentRegistry.has(definition.type)) {
    console.warn(`Component type "${definition.type}" is already registered. Overwriting.`);
  }
  componentRegistry.set(definition.type, definition);
};

/**
 * Retrieves a component definition by its type.
 * @param type The unique type identifier of the component.
 * @returns The component definition or undefined if not found.
 */
export const getComponentDefinition = (type: string): ComponentDefinition | undefined => {
  return componentRegistry.get(type);
};

/**
 * Retrieves all registered component definitions.
 * @returns An array of all component definitions.
 */
export const getAllComponentDefinitions = (): ComponentDefinition[] => {
  return Array.from(componentRegistry.values());
};

/**
 * Retrieves component definitions grouped by category.
 * @returns An object where keys are categories and values are arrays of definitions.
 */
export const getComponentsByCategory = (): { [category: string]: ComponentDefinition[] } => {
    const grouped: { [category: string]: ComponentDefinition[] } = {};
    for (const definition of componentRegistry.values()) {
        if (!grouped[definition.category]) {
            grouped[definition.category] = [];
        }
        grouped[definition.category].push(definition);
    }
    // Optional: Sort categories or components within categories
    return grouped;
}

// TODO: Populate the registry with actual component definitions
// Example registration (should likely happen elsewhere, e.g., in component files themselves or an init script):
/*
registerComponent({
  type: 'core/button',
  name: 'Button',
  category: 'Core',
  description: 'A clickable button element.',
  properties: [
    { name: 'text', type: 'string', defaultValue: 'Click Me', label: 'Button Text' },
    { name: 'variant', type: 'select', options: ['primary', 'secondary', 'danger'], defaultValue: 'primary', label: 'Variant' },
    // Add style properties like padding, margin, color etc.
  ],
  defaultProps: { text: 'Click Me', variant: 'primary' },
});
*/
