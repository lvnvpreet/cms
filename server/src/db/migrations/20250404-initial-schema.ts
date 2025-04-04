// server/src/db/migrations/20250404-initial-schema.ts

/**
 * Purpose: Initial database schema creation.
 * Creates core tables (users, sites, templates, components, etc.),
 * sets up relationships, and establishes indexes.
 */

import { dbClient } from '../connection'; // Adjust path if necessary

export async function up(): Promise<void> {
  console.log('Applying migration: 20250404-initial-schema - UP');
  // TODO: Implement SQL to create core tables (users, sites, templates, components)
  // TODO: Define primary keys, foreign keys, constraints, and indexes
  // Example:
  // await dbClient.query(`
  //   CREATE TABLE users (
  //     id SERIAL PRIMARY KEY,
  //     email VARCHAR(255) UNIQUE NOT NULL,
  //     password_hash VARCHAR(255) NOT NULL,
  //     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  //   );
  // `);
  // await dbClient.query(`CREATE INDEX idx_users_email ON users(email);`);
  console.log('Migration applied successfully: 20250404-initial-schema - UP');
}

export async function down(): Promise<void> {
  console.log('Reverting migration: 20250404-initial-schema - DOWN');
  // TODO: Implement SQL to drop the tables created in the 'up' function
  // Make sure to drop tables in the correct order to respect foreign key constraints
  // Example:
  // await dbClient.query(`DROP TABLE IF EXISTS users CASCADE;`);
  console.log('Migration reverted successfully: 20250404-initial-schema - DOWN');
}
