import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken'; // Example dependency
// import { User } from '../models/user.model'; // Example dependency
// import config from '../../config'; // Example dependency for secrets

/**
 * Authentication Middleware
 *
 * Handles various authentication strategies:
 * - JWT token validation
 * - User session verification
 * - Role-based access control (RBAC)
 * - Permission checking
 * - API key validation
 * - OAuth token validation
 *
 * Attaches user data to the request object upon successful authentication.
 */

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any; // Define a more specific type based on your User model
    }
  }
}

/**
 * Middleware to verify JWT token.
 */
export const verifyJwtToken = (req: Request, res: Response, next: NextFunction) => {
  console.log('Auth Middleware: Verifying JWT Token');
  const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Authentication required: No token provided.' });
  }

  try {
    // Verify token using secret key (replace with actual verification logic)
    // const decoded = jwt.verify(token, config.auth.jwtSecret);
    // req.user = decoded; // Attach decoded payload (user info) to request
    console.log('Token received:', token); // Placeholder
    // Placeholder: Assume token is valid for now
    req.user = { id: 'placeholder-user-id', roles: ['user'] }; // Example user data
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error);
    return res.status(401).json({ message: 'Authentication failed: Invalid token.' });
  }
};

/**
 * Middleware to check for specific roles.
 * Example: checkRole(['admin'])
 */
export const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log(`Auth Middleware: Checking Roles - Required: ${roles.join(', ')}`);
    if (!req.user || !req.user.roles || !roles.some(role => req.user.roles.includes(role))) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions.' });
    }
    next();
  };
};

/**
 * Middleware to verify API Key.
 */
export const verifyApiKey = (req: Request, res: Response, next: NextFunction) => {
  console.log('Auth Middleware: Verifying API Key');
  const apiKey = req.headers['x-api-key'];

  if (!apiKey /* || !isValidApiKey(apiKey) */) { // Add actual API key validation logic
    // return res.status(401).json({ message: 'Authentication required: Invalid API Key.' });
    console.log('No API Key provided or validation skipped (placeholder).');
  } else {
    console.log('API Key received:', apiKey);
    // Potentially attach client/app info based on API key
    // req.client = getClientInfo(apiKey);
  }
  next(); // Allow request even if no API key for now, adjust as needed
};

// Add other authentication functions as needed (session, OAuth, permissions, etc.)
