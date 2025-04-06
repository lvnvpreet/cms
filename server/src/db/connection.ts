// src/db/connection.ts

/**
 * Purpose: Sets up and manages database connections.
 */

// TODO: Implement database connection configuration using environment variables
// Example: const dbConfig = { host: process.env.DB_HOST, ... };

// TODO: Implement connection pool setup for efficient database usage
// Example: const pool = new Pool(dbConfig);

// TODO: Implement health check functions to verify database connectivity
// Example: export async function checkDbConnection() { ... }

// TODO: Implement health check functions to verify database connectivity
// Example: export async function checkDbConnection() { ... }

// Import the configured pool from the config file using a relative path
import pool from '../../config/database'; // Changed from '@config/database'

// Export the actual pool as dbClient for use in queries/migrations
export const dbClient = pool;

export default dbClient; // Also export as default if needed elsewhere
