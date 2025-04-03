// client/src/types.ts

// --- Drag and Drop Types ---
// Defines constants for react-dnd item types used across the editor
export const ItemTypes = {
  COMPONENT: 'component', // Represents a draggable component from the palette or canvas
  // Add other item types if needed later (e.g., LAYER, ASSET)
};

// --- Editor Component Structure ---

/**
 * Represents the properties of a visual component.
 * Includes standard HTML attributes, style objects, event handlers,
 * and potentially custom framework-specific props.
 */
export interface ComponentProps {
  // Standard HTML attributes (examples)
  id?: string;
  className?: string;
  style?: React.CSSProperties; // Use React's CSSProperties for better type checking
  children?: React.ReactNode | string | number; // Allow React nodes or simple text

  // Event handlers (examples - use specific event types if possible)
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  // Add other common event handlers as needed: onMouseEnter, onMouseLeave, onSubmit, etc.

  // Custom attributes for the editor or framework
  'data-component-id'?: string; // Used internally by the sync engine

  // Allow any other string-keyed properties (use with caution)
  [key: string]: any;
}

/**
 * Represents a single component instance within the visual editor's tree structure.
 */
export interface VisualComponent {
  id: string; // Unique identifier for this component instance
  type: string; // The type of the component (e.g., 'div', 'Button', 'CustomCard')
                  // Corresponds to HTML tag or React component type name
  props: ComponentProps; // Properties/attributes applied to the component
  children: VisualComponent[]; // Nested child components
  // Optional positioning/layout properties used by the Canvas/UI Editor
  x?: number;
  y?: number;
  zIndex?: number;
  // Optional: Add parentId if needed for easier tree traversal/updates
  // parentId?: string | null;
}

// --- Generated Code Structure ---
// Structure for the output of the UI-to-Code transformation
export interface GeneratedCode {
  html: string;
  css: string;
  javascript: string;
}

// Add other shared types/interfaces for the client application here
