import dotenv from 'dotenv';
import { CorsOptions } from 'cors'; // Import CorsOptions type if using the 'cors' package

dotenv.config(); // Load environment variables from .env file

// Define allowed origins. Use environment variables for flexibility.
const allowedOriginsEnv = process.env.CORS_ALLOWED_ORIGINS;
const defaultAllowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000']; // Add default development origins

let allowedOrigins: string[] = defaultAllowedOrigins;

if (allowedOriginsEnv) {
  allowedOrigins = allowedOriginsEnv.split(',').map(origin => origin.trim());
  console.log('CORS Allowed Origins loaded from environment:', allowedOrigins);
} else {
  console.warn('WARNING: CORS_ALLOWED_ORIGINS environment variable not set. Using default origins:', allowedOrigins);
  // In production, you should strictly define allowed origins via environment variables.
}

export const corsConfig: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    // or requests from allowed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS: Blocked origin - ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Allowed headers
  credentials: true, // Allow cookies to be sent with requests (if needed)
  optionsSuccessStatus: 200, // Status code for successful OPTIONS requests
};

// Example of a more permissive configuration (use with caution, especially in production)
// export const permissiveCorsConfig: CorsOptions = {
//   origin: '*', // Allow all origins
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// };
