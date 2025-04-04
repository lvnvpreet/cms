import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit'; // Dependency: express-rate-limit

/**
 * Rate Limiting Middleware
 *
 * Prevents abuse by limiting the number of requests from a single IP address
 * or user within a specific time window. Uses 'express-rate-limit'.
 *
 * Features:
 * - Request counting per IP (default) or user
 * - Configurable time window and request limit
 * - Custom response handling for rate-limited requests
 * - Option for different limits on different endpoints
 * - Whitelisting trusted sources
 * - Standard headers (RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset)
 * - Storage configuration (memory store default, can use Redis etc. for distributed systems)
 */

// Basic rate limiter configuration (applied globally or per route)
export const basicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { // Custom message when rate limit is exceeded
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
  keyGenerator: (req: Request): string => {
    // Use IP address as the key for rate limiting
    // Consider using req.user.id if authentication is required and you want per-user limits
    return req.ip || 'unknown-ip';
  },
  handler: (req: Request, res: Response, next: NextFunction, options) => {
    console.warn(`Rate Limit Middleware: Exceeded for IP ${req.ip}. Limit: ${options.max}`);
    res.status(options.statusCode).json(options.message);
  },
  // skip: (req: Request, res: Response): boolean => {
  //   // Example: Skip rate limiting for specific IPs or authenticated users
  //   // if (req.ip === 'TRUSTED_IP_ADDRESS') return true;
  //   // if (req.user?.isAdmin) return true;
  //   return false;
  // },
  // store: // Configure a store like RedisStore for distributed environments
});

// Example of a stricter limiter for sensitive endpoints (e.g., login)
export const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 login attempts per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many login attempts from this IP, please try again after an hour.',
  },
  keyGenerator: (req: Request): string => req.ip || 'unknown-ip',
  handler: (req: Request, res: Response, next: NextFunction, options) => {
    console.warn(`Rate Limit Middleware (Login): Exceeded for IP ${req.ip}. Limit: ${options.max}`);
    res.status(options.statusCode).json(options.message);
  },
});

console.log('Rate Limit Middleware: Configuration loaded.');
