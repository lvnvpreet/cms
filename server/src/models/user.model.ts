// Import dependencies (e.g., ORM, validation libraries)
// import { Schema, model } from 'mongoose'; // Example if using Mongoose
// import * as bcrypt from 'bcrypt'; // Example for password hashing

// Define interfaces/types for the User model
interface UserAttributes {
  id: number; // Or string, depending on DB
  username: string;
  email: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  preferences?: Record<string, any>;
  role: 'admin' | 'editor' | 'viewer'; // Example roles
  isVerified: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Define the User schema/structure (adapt based on chosen ORM/DB)
// This is a conceptual representation. Actual implementation depends on the DB layer.
const userSchemaDefinition = {
  id: { type: 'SERIAL', primaryKey: true }, // Example for SQL
  username: { type: 'VARCHAR(255)', unique: true, allowNull: false },
  email: { type: 'VARCHAR(255)', unique: true, allowNull: false },
  passwordHash: { type: 'VARCHAR(255)', allowNull: false },
  firstName: { type: 'VARCHAR(255)', allowNull: true },
  lastName: { type: 'VARCHAR(255)', allowNull: true },
  avatarUrl: { type: 'VARCHAR(255)', allowNull: true },
  preferences: { type: 'JSONB', allowNull: true }, // Example for PostgreSQL JSON support
  role: { type: 'VARCHAR(50)', defaultValue: 'viewer', allowNull: false },
  isVerified: { type: 'BOOLEAN', defaultValue: false, allowNull: false },
  lastLoginAt: { type: 'TIMESTAMP', allowNull: true },
  createdAt: { type: 'TIMESTAMP', defaultValue: 'NOW()', allowNull: false },
  updatedAt: { type: 'TIMESTAMP', defaultValue: 'NOW()', allowNull: false },
};

// --- Model Definition (Example structure) ---
// Replace with actual ORM/DB client model definition
class User /* extends SomeBaseModel */ {
  // Properties based on UserAttributes
  id!: number;
  username!: string;
  email!: string;
  passwordHash!: string;
  firstName?: string;
  lastName?: string;
  // ... other properties

  constructor(attributes: Partial<UserAttributes>) {
    Object.assign(this, attributes);
  }

  // --- Model Methods ---

  /**
   * Validates a given password against the stored hash.
   * @param password The password to validate.
   * @returns True if the password is valid, false otherwise.
   */
  async validatePassword(password: string): Promise<boolean> {
    // Example using bcrypt
    // return bcrypt.compare(password, this.passwordHash);
    console.log('Password validation logic needed for:', password); // Placeholder
    return false; // Placeholder implementation
  }

  // Add other instance methods like updateProfile, etc.
}

// --- Static Functions / Repository Methods ---
// These might live in a separate repository/service file depending on architecture
const UserRepository = {
  async findById(id: number): Promise<User | null> {
    // Database query logic to find user by ID
    console.log('DB query needed for findById:', id);
    return null; // Placeholder
  },

  async findByEmail(email: string): Promise<User | null> {
    // Database query logic to find user by email
    console.log('DB query needed for findByEmail:', email);
    return null; // Placeholder
  },

  async create(userData: Omit<UserAttributes, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    // Logic to hash password and save user to DB
    // const hashedPassword = await bcrypt.hash(userData.passwordHash, 10); // Example hashing
    console.log('DB insert needed for create:', userData);
    // Placeholder: return a new User instance with generated ID and timestamps
    return new User({
      ...userData,
      id: Math.floor(Math.random() * 1000), // Fake ID
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  },
  // Add other static methods like find, update, delete...
};

// --- Validation Rules ---
// Define validation rules (e.g., using Joi, Zod, or ORM built-in validation)
const userValidationSchema = {
  // Example using conceptual validation rules
  username: { required: true, minLength: 3, maxLength: 50 },
  email: { required: true, format: 'email' },
  password: { required: true, minLength: 8 }, // Raw password validation before hashing
  role: { required: true, allowedValues: ['admin', 'editor', 'viewer'] },
};

// --- Relationships ---
// Define relationships to other models (e.g., Sites, Templates)
// Example: A user can own multiple sites.
// User.hasMany(SiteModel, { foreignKey: 'ownerId' });

// --- Hooks / Middleware ---
// Add pre/post save hooks (e.g., hash password before saving)
// Example conceptual hook:
// User.beforeCreate(async (user) => {
//   if (user.password) { // Assuming password is set directly before hashing
//     user.passwordHash = await bcrypt.hash(user.password, 10);
//     delete user.password; // Don't store raw password
//   }
// });

// --- Export the Model ---
// The actual export will depend on how models are consumed (ORM model, repository, etc.)
export { User, UserRepository, type UserAttributes, userSchemaDefinition, userValidationSchema };

// Note: This is a template. The actual implementation needs to be adapted
// based on the specific ORM (e.g., Sequelize, TypeORM, Prisma) or database
// client being used in the project. The schema definition, model class,
// repository methods, relationships, and hooks will vary significantly.
