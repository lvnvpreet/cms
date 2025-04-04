// server/src/db/seeds/users.seed.ts

/**
 * Purpose: Seed data for users.
 * Creates admin user and test user accounts for development.
 */

import { dbClient } from '../connection'; // Adjust path if necessary
// TODO: Import password hashing utility (e.g., bcrypt)
// import bcrypt from 'bcrypt';

export async function seed(client: typeof dbClient): Promise<void> {
  console.log('Seeding users...');

  // TODO: Implement logic to create an admin user
  // Ensure password hashing is used
  // Example:
  // const adminPasswordHash = await bcrypt.hash('adminpassword', 10);
  // await client.query(`
  //   INSERT INTO users (email, password_hash, role)
  //   VALUES ($1, $2, $3)
  //   ON CONFLICT (email) DO NOTHING;
  // `, ['admin@example.com', adminPasswordHash, 'admin']);
  console.log('Admin user seeded (placeholder).');

  // TODO: Implement logic to create test users for development
  // Example:
  // const testUserPasswordHash = await bcrypt.hash('testpassword', 10);
  // await client.query(`
  //   INSERT INTO users (email, password_hash, role)
  //   VALUES ($1, $2, $3)
  //   ON CONFLICT (email) DO NOTHING;
  // `, ['testuser@example.com', testUserPasswordHash, 'user']);
  console.log('Test users seeded (placeholder).');

  console.log('User seeding complete.');
}
