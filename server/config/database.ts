import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path'; // Import path module

// Explicitly load .env file from the server directory
// When running with ts-node-dev, __dirname is server/src/config, so go up one level.
// When running compiled JS from server/dist/config, __dirname is server/dist/config, so go up two levels.
// For simplicity during development with ts-node-dev, we'll use the path relative to src.
// A more robust solution might check NODE_ENV or use a dedicated config loader.
dotenv.config({ path: path.resolve(__dirname, '../.env') }); // Corrected path for ts-node-dev

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'cms_db',
  password: process.env.DB_PASSWORD, // Remove default fallback
  port: parseInt(process.env.DB_PORT || '5432', 10),
});

pool.on('connect', () => {
  console.log('Connected to the database');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err.stack);
  process.exit(-1); // Exit the process if connection fails
});

export default pool;

// Example usage (optional, can be removed or used for testing)
async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('Database connection test successful!');
    const res = await client.query('SELECT NOW()');
    console.log('Current time from DB:', res.rows[0].now);
    client.release();
  } catch (err) {
    console.error('Error testing database connection:', err);
  } finally {
    // Optional: Close the pool when the application exits
    // await pool.end();
  }
}

// testConnection();
