// Import dependencies (e.g., ORM, types)

// Define interfaces/types for the Component model
interface ComponentAttributes {
  id: number; // Or string
  name: string; // e.g., "Button", "HeroSection"
  type: string; // e.g., "atomic", "molecule", "organism", "custom"
  description?: string;
  propertiesSchema: Record<string, any>; // JSON Schema defining configurable props
  defaultProperties: Record<string, any>; // Default values for props
  renderInfo: { // Information on how to render this component
    library?: string; // e.g., 'react', 'vue', 'web-component'
    importPath?: string; // Path to the component code if applicable
    tagName?: string; // For custom elements or simple HTML
  };
  category?: string; // e.g., "Navigation", "Forms", "Layout"
  tags?: string[];
  usageCount?: number;
  isCustom?: boolean; // Flag for user-created components vs built-in
  version?: string; // Component versioning
  createdAt: Date;
  updatedAt: Date;
}

// Define the Component schema/structure (adapt based on chosen ORM/DB)
const componentSchemaDefinition = {
  id: { type: 'SERIAL', primaryKey: true },
  name: { type: 'VARCHAR(255)', unique: true, allowNull: false }, // Name should likely be unique
  type: { type: 'VARCHAR(100)', allowNull: false },
  description: { type: 'TEXT', allowNull: true },
  propertiesSchema: { type: 'JSONB', defaultValue: {}, allowNull: false },
  defaultProperties: { type: 'JSONB', defaultValue: {}, allowNull: false },
  renderInfo: { type: 'JSONB', allowNull: false },
  category: { type: 'VARCHAR(100)', allowNull: true },
  tags: { type: 'ARRAY(VARCHAR(100))', allowNull: true },
  usageCount: { type: 'INTEGER', defaultValue: 0, allowNull: false },
  isCustom: { type: 'BOOLEAN', defaultValue: false, allowNull: false },
  version: { type: 'VARCHAR(50)', allowNull: true },
  createdAt: { type: 'TIMESTAMP', defaultValue: 'NOW()', allowNull: false },
  updatedAt: { type: 'TIMESTAMP', defaultValue: 'NOW()', allowNull: false },
};

// --- Model Definition (Example structure) ---
class Component /* extends SomeBaseModel */ {
  id!: number;
  name!: string;
  type!: string;
  propertiesSchema!: Record<string, any>;
  defaultProperties!: Record<string, any>;
  renderInfo!: { library?: string; importPath?: string; tagName?: string };
  // ... other properties

  constructor(attributes: Partial<ComponentAttributes>) {
    Object.assign(this, attributes);
  }

  // --- Model Methods ---
  // Add methods like validateProperties, incrementUsage, etc.
  validateProperties(props: Record<string, any>): boolean {
    // Logic to validate provided properties against propertiesSchema
    console.log(`Property validation logic needed for component ${this.id}:`, props);
    // Use a JSON Schema validator library
    return true; // Placeholder
  }
}

// --- Static Functions / Repository Methods ---
const ComponentRepository = {
  async findById(id: number): Promise<Component | null> {
    console.log('DB query needed for Component.findById:', id);
    return null; // Placeholder
  },

  async findByType(type: string): Promise<Component[]> {
    console.log('DB query needed for Component.findByType:', type);
    return []; // Placeholder
  },

  async findByCategory(category: string): Promise<Component[]> {
    console.log('DB query needed for Component.findByCategory:', category);
    return []; // Placeholder
  },

  async create(componentData: Omit<ComponentAttributes, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>): Promise<Component> {
    console.log('DB insert needed for Component.create:', componentData);
    return new Component({
      ...componentData,
      id: Math.floor(Math.random() * 1000), // Fake ID
      usageCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  },
  // Add update, delete...
};

// --- Validation Rules ---
const componentValidationSchema = {
  name: { required: true, minLength: 1, maxLength: 100 },
  type: { required: true },
  propertiesSchema: { required: true, type: 'object' },
  defaultProperties: { required: true, type: 'object' },
  renderInfo: { required: true, type: 'object' },
  // Add validation for renderInfo structure, etc.
};

// --- Relationships ---
// Components might not have direct DB relationships but could be referenced
// within Page or Template content structures (e.g., in JSON).

// --- Hooks / Middleware ---
// Example: Validate propertiesSchema is a valid JSON schema before saving
// Component.beforeSave(async (component) => {
//   validateJsonSchema(component.propertiesSchema);
// });

// --- Export the Model ---
export { Component, ComponentRepository, type ComponentAttributes, componentSchemaDefinition, componentValidationSchema };

// Note: Adapt implementation based on the chosen ORM/DB stack.
