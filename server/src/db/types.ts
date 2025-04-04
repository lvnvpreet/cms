// server/src/db/types.ts

/**
 * Purpose: TypeScript types for database entities and related operations.
 * Defines interfaces matching database schema and helper types for queries.
 */

// --- Core Entity Types (Matching Database Schema) ---

// Example User type (adjust based on actual schema)
export interface User {
  id: number;
  email: string;
  password_hash: string; // Usually not exposed directly in APIs
  role: 'admin' | 'user'; // Example roles
  created_at: Date;
  updated_at: Date;
  // Add other fields like name, profile_id, etc.
}

// Example Site type
export interface Site {
  id: number;
  user_id: number;
  name: string;
  subdomain: string; // Or custom domain
  created_at: Date;
  updated_at: Date;
  // Add other fields like published_version_id, status, etc.
}

// Example Template type
export interface Template {
  id: number;
  name: string;
  description?: string;
  structure_json: Record<string, any>; // Or a more specific type for component structure
  is_default: boolean;
  created_at: Date;
  updated_at: Date;
  // Add other fields like preview_image_url, category_id, etc.
}

// Example Component type
export interface Component {
  id: number;
  name: string;
  category_id?: number; // Link to component_categories table
  default_props_json: Record<string, any>; // Default properties
  description?: string;
  created_at: Date;
  updated_at: Date;
}

// --- Helper Types for Queries ---

// Example type for a user query result that includes profile info
export interface UserWithProfile extends User {
  profile_bio?: string;
  profile_avatar_url?: string;
  // Add other joined fields
}

// Example type for site query result including settings and components
export interface SiteWithDetails extends Site {
  settings: Record<string, any>; // From site_configurations table
  components: any[]; // Define a proper type for site components/structure
  active_version?: number;
}

// Example type for search criteria
export interface UserSearchCriteria {
  email?: string;
  role?: 'admin' | 'user';
  minDate?: Date;
  maxDate?: Date;
  limit?: number;
  offset?: number;
}

// Example type for statistics results
export interface SignupStats {
  total_users: number;
  signups_today: number;
  signups_this_week: number;
}

// --- Transaction Types ---
// Potentially define types for transaction functions or contexts if needed

// --- Cache Types ---
// Potentially define types for cache keys or cached data structures

console.log('Database types defined (placeholders). Actual types depend on schema.');
