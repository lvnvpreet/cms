import { Request, Response, NextFunction } from 'express';
import cors, { CorsOptions } from 'cors'; // Dependency: cors package
// import config from '../../config'; // Example dependency for configuration

/**
 * CORS Middleware
 *
 * Configures Cross-Origin Resource Sharing (CORS) settings for the application.
 * Uses the 'cors' package.
 *
 * Features:
 * - Configurable origin allowlist
 * - Allowed HTTP methods configuration
 * - Allowed headers configuration
 * - Credentials handling (e.g., for cookies)
 * - Preflight request handling (OPTIONS)
 * - Environment-specific settings
 */

// Define allowed origins based on environment
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [
      'https://your-production-frontend.com', // Replace with your actual frontend domain
      // Add other allowed production origins if needed
    ]
  : [
      'http://localhost:5173', // Default Vite dev server port for client
      'http://localhost:3000', // Common alternative dev port
      // Add other allowed development origins
    ];

// Configure CORS options
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    // or requests from allowed origins
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`CORS Middleware: Blocked origin - ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
  allowedHeaders: [ // Headers allowed in requests
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization', // For JWT tokens
    'X-Correlation-ID', // For request tracing
    'X-API-Key', // For API key auth
    // Add other custom headers if needed
  ],
  credentials: true, // Allow cookies to be sent with requests (if applicable)
  optionsSuccessStatus: 204, // Return 204 for successful OPTIONS preflight requests
  maxAge: 86400, // Cache preflight response for 1 day (in seconds)
};

/**
 * CORS middleware instance configured with the options.
 */
export const configureCors = () => {
  console.log('CORS Middleware: Applying CORS configuration');
  console.log('CORS Allowed Origins:', allowedOrigins);
  return cors(corsOptions);
};
