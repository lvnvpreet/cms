;import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

export const authConfig = {
  jwt: {
    secret: process.env.JWT_SECRET || 'your-default-jwt-secret', // Use a strong, unique secret in production!
    expiresIn: process.env.JWT_EXPIRES_IN || '1h', // Token expiration time (e.g., '1h', '7d')
    issuer: process.env.JWT_ISSUER || 'my-cms-app', // Optional: Issuer identifier
    audience: process.env.JWT_AUDIENCE || 'my-cms-users', // Optional: Audience identifier
  },
  password: {
    saltRounds: parseInt(process.env.PASSWORD_SALT_ROUNDS || '10', 10), // Cost factor for bcrypt hashing
  },
  // Add other auth-related configurations here if needed
  // e.g., OAuth provider credentials, session settings, etc.
};

// Validate essential configurations
if (!authConfig.jwt.secret || authConfig.jwt.secret === 'your-default-jwt-secret') {
  console.warn(
    'WARNING: JWT_SECRET is not set or using the default value. Please set a strong secret in your environment variables for production.'
  );
}
