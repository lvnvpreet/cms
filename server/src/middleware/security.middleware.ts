import { Request, Response, NextFunction } from 'express';
import helmet, { HelmetOptions } from 'helmet'; // Dependency: helmet package

/**
 * Security Middleware
 *
 * Implements various security best practices, primarily by setting HTTP headers
 * using the 'helmet' package.
 *
 * Features:
 * - Content Security Policy (CSP) setup
 * - XSS protection headers
 * - Clickjacking protection (X-Frame-Options)
 * - MIME type sniffing prevention (X-Content-Type-Options)
 * - Strict Transport Security (HSTS)
 * - Referrer Policy
 * - And other headers set by Helmet defaults.
 *
 * Also includes placeholders for CSRF protection and request sanitization if needed.
 */

// Configure Helmet options
// Carefully configure CSP directives based on your application's needs.
// This is a restrictive example; you'll likely need to allow specific sources.
// Explicitly type the options to help catch mismatches
const helmetOptions: Readonly<HelmetOptions> = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"], // Only allow resources from the same origin by default
      scriptSrc: ["'self'", "'unsafe-inline'"], // Allow inline scripts (consider removing 'unsafe-inline' with proper script handling)
      styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles (consider removing 'unsafe-inline')
      imgSrc: ["'self'", "data:"], // Allow images from self and data URIs
      connectSrc: ["'self'"], // Limit AJAX, WebSockets, etc. to self
      fontSrc: ["'self'"], // Allow fonts from self
      objectSrc: ["'none'"], // Disallow plugins (Flash, etc.)
      frameAncestors: ["'none'"], // Disallow embedding in iframes
      upgradeInsecureRequests: [], // Automatically upgrade HTTP requests to HTTPS
    },
  },
  crossOriginEmbedderPolicy: false, // Set to true if needed, but can break things
  // Ensure the policy value matches the expected literal types
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" as const },
  crossOriginResourcePolicy: { policy: "same-origin" as const },
  dnsPrefetchControl: { allow: false }, // Disable DNS prefetching
  frameguard: { action: 'deny' }, // Set X-Frame-Options to DENY
  hsts: { // HTTP Strict Transport Security
    maxAge: 31536000, // 1 year in seconds
    includeSubDomains: true, // Apply to subdomains
    preload: true, // Allow submission to HSTS preload list
  },
  ieNoOpen: true, // Set X-Download-Options for IE8+
  noSniff: true, // Set X-Content-Type-Options to nosniff
  originAgentCluster: true, // Enable Origin-Agent-Cluster header
  permittedCrossDomainPolicies: { permittedPolicies: "none" as const }, // Restrict Adobe Flash/PDF cross-domain policies
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' as const }, // Set Referrer-Policy
  // xssFilter is deprecated and removed from default helmet options, removing it here too.
};

/**
 * Applies Helmet middleware with configured options.
 */
export const applySecurityMiddleware = () => {
  console.log('Security Middleware: Applying Helmet configuration.');
  return helmet(helmetOptions);
};

/**
 * Placeholder for CSRF protection middleware (e.g., using csurf package).
 * Requires session middleware to be set up first.
 */
// import csurf from 'csurf';
// export const csrfProtection = csurf({ cookie: true }); // Example configuration

/**
 * Placeholder for request sanitization middleware (e.g., using express-mongo-sanitize).
 */
// import mongoSanitize from 'express-mongo-sanitize';
// export const sanitizeRequest = mongoSanitize();

console.log('Security Middleware: Configuration loaded.');
