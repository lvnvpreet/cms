// server/src/db/migrations/migration-template.ts

/**
 * Purpose: Template file for creating new migrations.
 *
 * How to use:
 * 1. Copy this file and rename it using the format YYYYMMDD-description.ts (e.g., 20250405-add-user-roles.ts).
 * 2. Implement the 'up' function to apply the schema changes.
 * 3. Implement the 'down' function to revert the schema changes made in 'up'.
 * 4. Ensure both functions are idempotent (can be run multiple times without unintended side effects).
 * 5. Use the provided 'dbClient' for database operations.
 */

import { dbClient } from '../connection'; // Adjust the path if necessary

export async function up(): Promise<void> {
  console.log('Applying migration: TEMPLATE - UP');
  // TODO: Implement the migration logic to apply changes
  // Example:
  // await dbClient.query(`
  //   ALTER TABLE users ADD COLUMN new_column VARCHAR(255);
  // `);
  console.log('Migration applied successfully: TEMPLATE - UP');
}

export async function down(): Promise<void> {
  console.log('Reverting migration: TEMPLATE - DOWN');
  // TODO: Implement the migration logic to revert changes
  // Example:
  // await dbClient.query(`
  //   ALTER TABLE users DROP COLUMN new_column;
  // `);
  console.log('Migration reverted successfully: TEMPLATE - DOWN');
}
