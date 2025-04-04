import { Request, Response, NextFunction } from 'express';
// import NodeCache from 'node-cache'; // Example dependency for in-memory cache
// import redisClient from '../db/cache'; // Example dependency for Redis cache

/**
 * Cache Middleware
 *
 * Implements response caching strategies to improve performance.
 * Can use in-memory cache or external stores like Redis.
 *
 * Features:
 * - Cache headers configuration (e.g., Cache-Control)
 * - Response caching logic based on request properties
 * - Cache key generation
 * - Cache invalidation strategies (though often handled elsewhere)
 * - Conditional caching
 * - Configurable cache duration
 */

// Example: Using node-cache for simple in-memory caching
// const memoryCache = new NodeCache({ stdTTL: 60 }); // Cache for 60 seconds by default

/**
 * Generates a cache key based on the request URL and potentially other factors.
 */
const generateCacheKey = (req: Request): string => {
  // Basic key based on the original URL
  // Consider adding user roles, query params, etc., if content varies
  return `cache:${req.originalUrl}`;
};

/**
 * Middleware to serve responses from cache if available.
 */
export const serveFromCache = (/* options: { duration?: number } = {} */) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests by default
    if (req.method !== 'GET') {
      console.log('Cache Middleware: Skipping cache for non-GET request.');
      return next();
    }

    const cacheKey = generateCacheKey(req);
    console.log(`Cache Middleware: Checking cache for key: ${cacheKey}`);

    try {
      // Check cache (replace with your cache implementation)
      // const cachedResponse = memoryCache.get(cacheKey);
      const cachedResponse = null; // Placeholder

      if (cachedResponse) {
        console.log(`Cache Middleware: Cache hit for key: ${cacheKey}`);
        // Send cached response (assuming it's stored as JSON)
        // Make sure to set appropriate headers if they were cached too
        res.setHeader('X-Cache', 'HIT');
        return res.status(200).json(cachedResponse);
      } else {
        console.log(`Cache Middleware: Cache miss for key: ${cacheKey}`);
        res.setHeader('X-Cache', 'MISS');

        // Monkey-patch res.send to cache the response before sending
        const originalSend = res.send;
        res.send = (body: any): Response<any> => {
          try {
            // Try to parse body as JSON to cache structured data
            const dataToCache = JSON.parse(body);
            // Cache the response (replace with your cache implementation)
            // const ttl = options.duration || 60; // Use provided duration or default
            // memoryCache.set(cacheKey, dataToCache, ttl);
            console.log(`Cache Middleware: Caching response for key: ${cacheKey}`);
          } catch (e) {
            // If body is not JSON, maybe cache as string or skip caching
            console.log('Cache Middleware: Response body is not JSON, skipping caching.');
          }
          // Call the original send method
          return originalSend.call(res, body);
        };

        next(); // Proceed to the route handler
      }
    } catch (error) {
      console.error('Cache Middleware: Error accessing cache:', error);
      next(); // Proceed without caching on error
    }
  };
};

/**
 * Middleware to set Cache-Control headers.
 */
export const setCacheHeaders = (options: { maxAge?: number; sMaxAge?: number; private?: boolean }) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { maxAge = 60, sMaxAge, private: isPrivate = true } = options; // Default maxAge 60s
    let cacheControl = `${isPrivate ? 'private' : 'public'}, max-age=${maxAge}`;
    if (sMaxAge) {
      cacheControl += `, s-maxage=${sMaxAge}`; // For CDNs
    }
    console.log(`Cache Middleware: Setting Cache-Control header: ${cacheControl}`);
    res.setHeader('Cache-Control', cacheControl);
    next();
  };
};

console.log('Cache Middleware: Configuration loaded.');
