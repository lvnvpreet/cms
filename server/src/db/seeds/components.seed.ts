// server/src/db/seeds/components.seed.ts

/**
 * Purpose: Seed data for the component library.
 * Creates standard components available to users, along with categories and metadata.
 */

import { dbClient } from '../connection'; // Adjust path if necessary

export async function seed(client: typeof dbClient): Promise<void> {
  console.log('Seeding components...');

  // TODO: Implement logic to create component categories
  // Example:
  // await client.query(`
  //   INSERT INTO component_categories (name, description)
  //   VALUES ($1, $2)
  //   ON CONFLICT (name) DO NOTHING;
  // `, ['Layout', 'Components for structuring pages']);
  // await client.query(`
  //   INSERT INTO component_categories (name, description)
  //   VALUES ($1, $2)
  //   ON CONFLICT (name) DO NOTHING;
  // `, ['Content', 'Components for displaying text and media']);
  console.log('Component categories seeded (placeholder).');


  // TODO: Implement logic to create standard components
  // Link components to categories and define their structure/metadata.
  // Example: (Assuming category IDs are fetched or known)
  // const layoutCategoryId = 1; // Replace with actual fetched ID
  // await client.query(`
  //   INSERT INTO components (name, category_id, default_props_json, description)
  //   VALUES ($1, $2, $3, $4)
  //   ON CONFLICT (name) DO NOTHING;
  // `, ['Container', layoutCategoryId, '{"padding": "10px"}', 'A basic container element']);
  console.log('Standard components seeded (placeholder).');

  console.log('Component seeding complete.');
}
