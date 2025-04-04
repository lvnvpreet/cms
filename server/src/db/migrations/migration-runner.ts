// server/src/db/migrations/migration-runner.ts

/**
 * Purpose: Utility to run migrations in sequence.
 * Handles detection, execution, and tracking of migrations.
 */

import fs from 'fs/promises';
import path from 'path';
import { dbClient } from '../connection'; // Adjust path if necessary

// TODO: Implement a table to track executed migrations (e.g., 'schema_migrations')
const MIGRATIONS_TABLE = 'schema_migrations';

interface MigrationModule {
  up: () => Promise<void>;
  down: () => Promise<void>;
}

// TODO: Implement function to get list of migration files from the directory
async function getMigrationFiles(): Promise<string[]> {
  const migrationsDir = path.dirname(__filename);
  const files = await fs.readdir(migrationsDir);
  return files
    .filter(file => file.endsWith('.ts') && file !== 'migration-template.ts' && file !== path.basename(__filename))
    .sort(); // Sort files chronologically based on filename (YYYYMMDD)
}

// TODO: Implement function to get executed migrations from the database
async function getExecutedMigrations(): Promise<string[]> {
  try {
    // Ensure migrations table exists
    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    const result = await dbClient.query(`SELECT name FROM ${MIGRATIONS_TABLE} ORDER BY name ASC`);
    return result.rows.map((row: { name: string }) => row.name);
  } catch (error) {
    console.error('Error fetching executed migrations:', error);
    throw error;
  }
}

// TODO: Implement function to mark a migration as executed
async function recordMigration(migrationName: string): Promise<void> {
  try {
    await dbClient.query(`INSERT INTO ${MIGRATIONS_TABLE} (name) VALUES ($1)`, [migrationName]);
    console.log(`Recorded migration: ${migrationName}`);
  } catch (error) {
    console.error(`Error recording migration ${migrationName}:`, error);
    throw error;
  }
}

// TODO: Implement function to remove a migration record (for rollbacks)
async function removeMigrationRecord(migrationName: string): Promise<void> {
  try {
    await dbClient.query(`DELETE FROM ${MIGRATIONS_TABLE} WHERE name = $1`, [migrationName]);
    console.log(`Removed migration record: ${migrationName}`);
  } catch (error) {
    console.error(`Error removing migration record ${migrationName}:`, error);
    throw error;
  }
}

// TODO: Implement main function to run pending migrations
export async function runMigrations(): Promise<void> {
  console.log('Starting migration process...');
  const allMigrationFiles = await getMigrationFiles();
  const executedMigrations = await getExecutedMigrations();
  const pendingMigrations = allMigrationFiles.filter(file => !executedMigrations.includes(file));

  if (pendingMigrations.length === 0) {
    console.log('No pending migrations to run.');
    return;
  }

  console.log(`Found ${pendingMigrations.length} pending migrations:`, pendingMigrations);

  for (const migrationFile of pendingMigrations) {
    console.log(`Running migration: ${migrationFile}`);
    try {
      const migrationPath = path.join(path.dirname(__filename), migrationFile);
      // Need to handle .ts files - potentially use ts-node or compile first
      // This dynamic import might need adjustment based on the execution environment (TS vs JS)
      const migration: MigrationModule = await import(migrationPath.replace(/\.ts$/, '')); // Assuming compiled JS

      // TODO: Add transaction handling for safety
      await migration.up();
      await recordMigration(migrationFile);
      console.log(`Successfully ran migration: ${migrationFile}`);
    } catch (error) {
      console.error(`Failed to run migration ${migrationFile}:`, error);
      // TODO: Implement rollback strategy on failure?
      throw new Error(`Migration ${migrationFile} failed.`);
    }
  }

  console.log('Migration process completed.');
}

// TODO: Implement function to rollback the last migration (or specific migration)
export async function rollbackLastMigration(): Promise<void> {
  console.log('Starting rollback process...');
  const executedMigrations = await getExecutedMigrations();

  if (executedMigrations.length === 0) {
    console.log('No migrations to roll back.');
    return;
  }

  const lastMigrationFile = executedMigrations[executedMigrations.length - 1];
  console.log(`Rolling back migration: ${lastMigrationFile}`);

  try {
    const migrationPath = path.join(path.dirname(__filename), lastMigrationFile);
    const migration: MigrationModule = await import(migrationPath.replace(/\.ts$/, '')); // Assuming compiled JS

    // TODO: Add transaction handling
    await migration.down();
    await removeMigrationRecord(lastMigrationFile);
    console.log(`Successfully rolled back migration: ${lastMigrationFile}`);
  } catch (error) {
    console.error(`Failed to roll back migration ${lastMigrationFile}:`, error);
    throw new Error(`Rollback of ${lastMigrationFile} failed.`);
  }

  console.log('Rollback process completed.');
}

// Example usage (potentially called from a script or CLI command)
// runMigrations().catch(console.error);
// rollbackLastMigration().catch(console.error);
