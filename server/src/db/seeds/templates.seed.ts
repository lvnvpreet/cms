// server/src/db/seeds/templates.seed.ts

/**
 * Purpose: Seed data for site templates.
 * Creates default templates for new users and demo templates.
 */

import { dbClient } from '../connection'; // Adjust path if necessary

export async function seed(client: typeof dbClient): Promise<void> {
  console.log('Seeding templates...');

  // TODO: Implement logic to create default templates
  // These templates might be assigned to new users upon registration.
  // Example:
  // await client.query(`
  //   INSERT INTO templates (name, description, structure_json, is_default)
  //   VALUES ($1, $2, $3, $4)
  //   ON CONFLICT (name) DO NOTHING;
  // `, ['Default Starter', 'A basic blank template', '{}', true]);
  console.log('Default templates seeded (placeholder).');

  // TODO: Implement logic to create demo templates
  // These templates can be used for showcasing features or examples.
  // Example:
  // await client.query(`
  //   INSERT INTO templates (name, description, structure_json, is_default)
  //   VALUES ($1, $2, $3, $4)
  //   ON CONFLICT (name) DO NOTHING;
  // `, ['Portfolio Showcase', 'A template for showcasing projects', '{"type": "container", ...}', false]);
  console.log('Demo templates seeded (placeholder).');

  console.log('Template seeding complete.');
}
