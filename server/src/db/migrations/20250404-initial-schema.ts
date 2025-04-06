// server/src/db/migrations/20250404-initial-schema.ts

/**
 * Purpose: Initial database schema creation.
 * Creates core tables (users, sites, templates, components, etc.),
 * sets up relationships, and establishes indexes.
 */

import { dbClient } from '../connection'; // Adjust path if necessary

export async function up(): Promise<void> {
  console.log('Applying migration: 20250404-initial-schema - UP');

  await dbClient.query(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      "passwordHash" VARCHAR(255) NOT NULL, -- Use quotes for camelCase
      role VARCHAR(20) DEFAULT 'user' NOT NULL CHECK (role IN ('user', 'admin', 'editor')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Add indexes for frequently queried columns
  await dbClient.query(`CREATE INDEX idx_users_username ON users(username);`);
  await dbClient.query(`CREATE INDEX idx_users_email ON users(email);`);

  // TODO: Add other core tables (sites, templates, components, etc.) here

  console.log('Migration applied successfully: 20250404-initial-schema - UP');
}

export async function down(): Promise<void> {
  console.log('Reverting migration: 20250404-initial-schema - DOWN');

  // Drop tables in reverse order of creation (or handle dependencies)
  await dbClient.query(`DROP TABLE IF EXISTS users CASCADE;`);

  // TODO: Drop other core tables here

  console.log('Migration reverted successfully: 20250404-initial-schema - DOWN');
}
