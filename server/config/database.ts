import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'cms_db',
  password: process.env.DB_PASSWORD || 'password',
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
