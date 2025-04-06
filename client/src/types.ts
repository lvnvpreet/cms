// client/src/types.ts

// --- Drag and Drop Types ---
// Defines constants for react-dnd item types used across the editor
export const ItemTypes = {
  COMPONENT: 'component', // Represents a draggable component from the palette or canvas
  TEMPLATE: 'template',   // Represents a draggable template from the template browser
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
  javascript?: string; // Make optional as it might not always be generated
  eventHandlers?: EventHandlerCollection; // Add mapping for handlers
}

/**
 * Represents a collection of event handlers mapped by unique IDs.
 * The key is the handler ID (e.g., "handler-click-comp123-1"),
 * and the value is the actual function reference.
 */
export type EventHandlerCollection = {
  [handlerId: string]: Function; // Using Function type for now, refine if needed
};

// --- Code File Representation ---
/**
 * Represents a single code file being processed or managed.
 */
export interface CodeFile {
  path: string; // Relative path of the file
  content: string; // The textual content of the file
  language: 'html' | 'css' | 'javascript' | 'typescript'; // Language identifier
}


// --- Template System Types ---

/**
 * Represents a CMS template, including metadata, structure, and display properties.
 */
export interface Template {
  id: string;
  name: string;
  description: string;
  author?: string;
  version?: string;
  category: string; // Main category (e.g., Page, Section, Hero, Footer)
  tags?: string[]; // Additional tags (e.g., industry, style, complexity)
  previewImageUrl?: string; // Thumbnail/preview
  demoContentUrl?: string; // Link to live demo or more detailed preview assets
  // Placeholders for structure - actual implementation might involve complex types or references
  componentDefinitions?: any; // Structure/relationships of components
  styleInfo?: any; // Colors, typography, spacing
  customizationParams?: any; // Options configurable before application
  documentationUrl?: string; // Link to documentation for complex templates

  // Properties used for display and filtering
  complexity: 'low' | 'medium' | 'high'; // Derived or explicit complexity
  estimatedTime: string; // e.g., "5 mins", "1 hour"
  popularity: number; // e.g., number of downloads or uses
  rating: number; // e.g., 1-5 stars
  status?: 'new' | 'popular' | 'updated' | 'featured'; // Visual status indicator

  // Properties related to origin and usage
  source: 'built-in' | 'custom' | 'marketplace'; // Where the template came from
  license?: string; // Licensing information, especially for marketplace templates
}

// --- Site Management Types ---

/**
 * Represents a user's website project within the CMS.
 */
export interface Site {
  id: string; // Unique identifier for the site
  name: string; // User-defined name of the site
  thumbnailUrl?: string; // URL for a preview image
  createdAt: string; // ISO date string when the site was created
  lastModified: string; // ISO date string when the site was last modified
  status: 'draft' | 'published' | 'archived'; // Current status of the site
  // Optional fields based on SiteList.tsx usage
  type?: string; // e.g., 'Portfolio', 'Blog', 'Store'
  visits?: number; // Analytics data
  pages?: number; // Number of pages in the site
  sharedWith?: string[]; // User IDs or emails of collaborators
}


// Add other shared types/interfaces for the client application here

// --- User Authentication Types ---

/**
 * Represents the data required for user registration.
 */
export interface UserRegistrationData {
  firstName?: string; // Added optional firstName
  lastName?: string; // Added optional lastName
  username: string; // Changed from name to username
  email: string;
  password?: string; // Password might be optional if using OAuth, but required for standard registration
  // Add other fields as needed (e.g., username, profile picture URL)
}

/**
 * Represents the data required for user login.
 */
export interface UserLoginData {
  email: string;
  password?: string; // Password might be optional if using OAuth
}

/**
 * Represents a user object, typically returned after login or fetching profile.
 */
export interface User {
  id: string; // Or number, depending on your backend ID type
  name: string;
  email: string;
  role?: string; // e.g., 'admin', 'editor', 'viewer'
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
  // Add other relevant user fields (e.g., profilePictureUrl, preferences)
}

/**
 * Represents the typical response from an authentication endpoint (e.g., login).
 */
export interface AuthResponse {
  user: User;
  token: string; // JWT or session token
  // Add other relevant fields like refreshToken if applicable
}
