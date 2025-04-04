// Import dependencies (e.g., ORM, types)
// import { UserAttributes } from './user.model'; // Example relationship import

// Define interfaces/types for the Template model
interface TemplateAttributes {
  id: number; // Or string
  name: string;
  description?: string;
  previewImageUrl?: string;
  categories?: string[];
  tags?: string[];
  contentStructure: Record<string, any>; // Defines the layout and default components
  defaultComponents?: string[]; // List of component IDs or names
  compatibilityInfo?: string; // e.g., "Requires Premium Plan"
  usageCount?: number;
  creatorId?: number; // Optional: Link to the user who created it
  visibility: 'public' | 'private' | 'organization';
  averageRating?: number;
  ratingCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Template schema/structure (adapt based on chosen ORM/DB)
const templateSchemaDefinition = {
  id: { type: 'SERIAL', primaryKey: true },
  name: { type: 'VARCHAR(255)', allowNull: false },
  description: { type: 'TEXT', allowNull: true },
  previewImageUrl: { type: 'VARCHAR(255)', allowNull: true },
  categories: { type: 'ARRAY(VARCHAR(100))', allowNull: true }, // Example for PostgreSQL Array
  tags: { type: 'ARRAY(VARCHAR(100))', allowNull: true },
  contentStructure: { type: 'JSONB', allowNull: false },
  defaultComponents: { type: 'ARRAY(VARCHAR(255))', allowNull: true },
  compatibilityInfo: { type: 'VARCHAR(255)', allowNull: true },
  usageCount: { type: 'INTEGER', defaultValue: 0, allowNull: false },
  creatorId: { type: 'INTEGER', allowNull: true /*, references: { model: 'Users', key: 'id' } */ },
  visibility: { type: 'VARCHAR(50)', defaultValue: 'private', allowNull: false },
  averageRating: { type: 'FLOAT', defaultValue: 0, allowNull: true },
  ratingCount: { type: 'INTEGER', defaultValue: 0, allowNull: true },
  createdAt: { type: 'TIMESTAMP', defaultValue: 'NOW()', allowNull: false },
  updatedAt: { type: 'TIMESTAMP', defaultValue: 'NOW()', allowNull: false },
};

// --- Model Definition (Example structure) ---
class Template /* extends SomeBaseModel */ {
  id!: number;
  name!: string;
  description?: string;
  previewImageUrl?: string;
  categories?: string[];
  tags?: string[];
  contentStructure!: Record<string, any>;
  // ... other properties

  constructor(attributes: Partial<TemplateAttributes>) {
    Object.assign(this, attributes);
  }

  // --- Model Methods ---
  // Add methods like incrementUsage, addRating, etc.
  async addRating(rating: number): Promise<void> {
    // Logic to update averageRating and ratingCount
    console.log(`Rating logic needed for template ${this.id}: ${rating}`);
    // Update in DB
  }
}

// --- Static Functions / Repository Methods ---
const TemplateRepository = {
  async findById(id: number): Promise<Template | null> {
    console.log('DB query needed for Template.findById:', id);
    return null; // Placeholder
  },

  async findPublic(): Promise<Template[]> {
    console.log('DB query needed for Template.findPublic');
    return []; // Placeholder
  },

  async findByCategory(category: string): Promise<Template[]> {
    console.log('DB query needed for Template.findByCategory:', category);
    return []; // Placeholder
  },

  async create(templateData: Omit<TemplateAttributes, 'id' | 'createdAt' | 'updatedAt' | 'usageCount' | 'averageRating' | 'ratingCount'>): Promise<Template> {
    console.log('DB insert needed for Template.create:', templateData);
    return new Template({
      ...templateData,
      id: Math.floor(Math.random() * 1000), // Fake ID
      usageCount: 0,
      averageRating: 0,
      ratingCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  },
  // Add update, delete...
};

// --- Validation Rules ---
const templateValidationSchema = {
  name: { required: true, minLength: 1, maxLength: 100 },
  contentStructure: { required: true, type: 'object' },
  visibility: { required: true, allowedValues: ['public', 'private', 'organization'] },
  // Add validation for categories, tags, URLs etc.
};

// --- Relationships ---
// Example: A template might be created by a user.
// Template.belongsTo(UserModel, { foreignKey: 'creatorId', as: 'creator' });

// --- Hooks / Middleware ---
// Example: Validate contentStructure schema before saving
// Template.beforeSave(async (template) => {
//   validateTemplateStructure(template.contentStructure);
// });

// --- Export the Model ---
export { Template, TemplateRepository, type TemplateAttributes, templateSchemaDefinition, templateValidationSchema };

// Note: Adapt implementation based on the chosen ORM/DB stack.
