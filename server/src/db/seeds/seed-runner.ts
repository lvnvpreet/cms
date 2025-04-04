// server/src/db/seeds/seed-runner.ts

/**
 * Purpose: Entry point for running all seed data scripts.
 * Handles importing and executing seed files, potentially environment-aware.
 */

import fs from 'fs/promises';
import path from 'path';
import { dbClient } from '../connection'; // Adjust path if necessary

// TODO: Define the order in which seed files should run, if necessary
const SEED_ORDER = [
  'users.seed.ts',
  'templates.seed.ts',
  'components.seed.ts',
  // Add other seed files here in the desired order
];

interface SeedModule {
  seed: (client: typeof dbClient) => Promise<void>;
}

// TODO: Implement function to get list of seed files from the directory
async function getSeedFiles(): Promise<string[]> {
  const seedsDir = path.dirname(__filename);
  const files = await fs.readdir(seedsDir);
  const seedFiles = files.filter(file => file.endsWith('.seed.ts') && file !== path.basename(__filename));

  // Sort files based on SEED_ORDER, putting unspecified files at the end
  return seedFiles.sort((a, b) => {
    const indexA = SEED_ORDER.indexOf(a);
    const indexB = SEED_ORDER.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b); // Sort alphabetically if both not in order
    if (indexA === -1) return 1; // a is not in order, put it after b
    if (indexB === -1) return -1; // b is not in order, put it after a
    return indexA - indexB; // Sort based on defined order
  });
}

// TODO: Implement main function to run all seed scripts
export async function runSeeds(): Promise<void> {
  console.log('Starting seeding process...');

  // Determine environment (e.g., development, test, production)
  const environment = process.env.NODE_ENV || 'development';
  console.log(`Running seeds for environment: ${environment}`);

  // Potentially skip seeding in production unless explicitly told to
  if (environment === 'production') {
      const forceSeed = process.env.FORCE_SEED === 'true';
      if (!forceSeed) {
          console.warn('Seeding is disabled in production environment by default. Set FORCE_SEED=true to override.');
          return;
      }
      console.warn('FORCE_SEED=true detected. Running seeds in production.');
  }


  const seedFiles = await getSeedFiles();

  if (seedFiles.length === 0) {
    console.log('No seed files found.');
    return;
  }

  console.log(`Found ${seedFiles.length} seed files to run:`, seedFiles);

  for (const seedFile of seedFiles) {
    console.log(`Running seed file: ${seedFile}`);
    try {
      const seedPath = path.join(path.dirname(__filename), seedFile);
      // Dynamic import needs adjustment based on TS vs JS execution
      const seedModule: SeedModule = await import(seedPath.replace(/\.ts$/, '')); // Assuming compiled JS

      if (typeof seedModule.seed === 'function') {
        // Pass the dbClient to the seed function
        await seedModule.seed(dbClient);
        console.log(`Successfully ran seed file: ${seedFile}`);
      } else {
        console.warn(`Seed file ${seedFile} does not export a 'seed' function.`);
      }
    } catch (error) {
      console.error(`Failed to run seed file ${seedFile}:`, error);
      // Decide if seeding should stop on error or continue
      throw new Error(`Seeding failed on file ${seedFile}.`);
    }
  }

  console.log('Seeding process completed.');
}

// Example usage (potentially called from a script or CLI command)
// runSeeds().catch(console.error);
