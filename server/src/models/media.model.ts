// Import dependencies (e.g., ORM, types)
// import { UserAttributes } from './user.model'; // Example relationship import

// Define interfaces/types for the Media model
interface MediaAttributes {
  id: number; // Or string
  filename: string; // Original filename
  storagePath: string; // Path in the storage system (e.g., S3 key, local path)
  url: string; // Publicly accessible URL
  mimeType: string; // e.g., 'image/jpeg', 'application/pdf'
  sizeBytes: number;
  uploaderId: number; // Foreign key to User model
  siteId?: number; // Optional: Link to a specific site if media is site-specific
  altText?: string; // For accessibility (images)
  caption?: string;
  metadata?: Record<string, any>; // e.g., image dimensions (width, height), video duration
  storageProvider: 'local' | 's3' | 'gcs'; // Example storage providers
  accessControl?: 'public' | 'private'; // Access level
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Define the Media schema/structure (adapt based on chosen ORM/DB)
const mediaSchemaDefinition = {
  id: { type: 'SERIAL', primaryKey: true },
  filename: { type: 'VARCHAR(255)', allowNull: false },
  storagePath: { type: 'TEXT', unique: true, allowNull: false }, // Path within storage must be unique
  url: { type: 'TEXT', allowNull: false }, // Consider making this unique too, or generating it dynamically
  mimeType: { type: 'VARCHAR(100)', allowNull: false },
  sizeBytes: { type: 'BIGINT', allowNull: false },
  uploaderId: { type: 'INTEGER', allowNull: false /*, references: { model: 'Users', key: 'id' } */ },
  siteId: { type: 'INTEGER', allowNull: true /*, references: { model: 'Sites', key: 'id' } */ },
  altText: { type: 'VARCHAR(255)', allowNull: true },
  caption: { type: 'TEXT', allowNull: true },
  metadata: { type: 'JSONB', allowNull: true },
  storageProvider: { type: 'VARCHAR(50)', allowNull: false },
  accessControl: { type: 'VARCHAR(50)', defaultValue: 'public', allowNull: false },
  tags: { type: 'ARRAY(VARCHAR(100))', allowNull: true },
  createdAt: { type: 'TIMESTAMP', defaultValue: 'NOW()', allowNull: false },
  updatedAt: { type: 'TIMESTAMP', defaultValue: 'NOW()', allowNull: false },
  // Add indexes on uploaderId, siteId, mimeType, tags
};

// --- Model Definition (Example structure) ---
class Media /* extends SomeBaseModel */ {
  id!: number;
  filename!: string;
  storagePath!: string;
  url!: string;
  mimeType!: string;
  sizeBytes!: number;
  uploaderId!: number;
  // ... other properties

  constructor(attributes: Partial<MediaAttributes>) {
    Object.assign(this, attributes);
  }

  // --- Model Methods ---
  // Methods might involve interacting with the storage provider
  async deleteFromStorage(): Promise<void> {
    // Logic to delete the actual file from S3, GCS, or local disk
    console.log(`Storage deletion logic needed for path: ${this.storagePath}`);
    // Use storage service/SDK
  }

  async generateSignedUrl(expiresInSeconds: number = 3600): Promise<string> {
    // Logic to generate a temporary signed URL for private assets
    console.log(`Signed URL generation needed for path: ${this.storagePath}`);
    // Use storage service/SDK
    return this.url; // Placeholder for public URLs
  }
}

// --- Static Functions / Repository Methods ---
const MediaRepository = {
  async findById(id: number): Promise<Media | null> {
    console.log('DB query needed for Media.findById:', id);
    return null; // Placeholder
  },

  async findByUploader(uploaderId: number): Promise<Media[]> {
    console.log('DB query needed for Media.findByUploader:', uploaderId);
    return []; // Placeholder
  },

  async findBySite(siteId: number): Promise<Media[]> {
    console.log('DB query needed for Media.findBySite:', siteId);
    return []; // Placeholder
  },

  async create(mediaData: Omit<MediaAttributes, 'id' | 'createdAt' | 'updatedAt'>): Promise<Media> {
    // This would typically happen *after* the file is successfully uploaded to storage
    console.log('DB insert needed for Media.create:', mediaData);
    return new Media({
      ...mediaData,
      id: Math.floor(Math.random() * 1000), // Fake ID
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  },

  async delete(id: number): Promise<boolean> {
    console.log('DB delete needed for Media.delete:', id);
    // Important: Ensure the file is deleted from storage as well (e.g., in a hook or service layer)
    // const media = await this.findById(id);
    // if (media) {
    //   await media.deleteFromStorage();
    //   // DB deletion logic
    //   return true;
    // }
    return false; // Placeholder
  },
  // Add update (e.g., for altText, caption, tags)...
};

// --- Validation Rules ---
const mediaValidationSchema = {
  filename: { required: true },
  storagePath: { required: true },
  url: { required: true, format: 'url' },
  mimeType: { required: true },
  sizeBytes: { required: true, type: 'integer', min: 0 },
  uploaderId: { required: true, type: 'integer' },
  storageProvider: { required: true },
  accessControl: { required: true, allowedValues: ['public', 'private'] },
  // Add validation for metadata structure based on mimeType?
};

// --- Relationships ---
// Media belongsTo User (uploader)
// Media belongsTo Site (optional)
// Media might be referenced in Page content (JSON), but not a direct DB relation typically

// --- Hooks / Middleware ---
// Example: Before deleting a media record from DB, delete the file from storage
// Media.beforeDestroy(async (media) => {
//   await media.deleteFromStorage();
// });
// Example: Generate URL based on storage path and provider config
// Media.afterFind( (media) => { if (media) media.url = generatePublicUrl(media.storagePath, media.storageProvider); });

// --- Export the Model ---
export { Media, MediaRepository, type MediaAttributes, mediaSchemaDefinition, mediaValidationSchema };

// Note: Adapt implementation based on the chosen ORM/DB and storage solution (S3, GCS, local).
// File upload handling logic is typically in controllers/services, not the model itself.
