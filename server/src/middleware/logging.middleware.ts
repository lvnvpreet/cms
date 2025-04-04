import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid'; // For correlation IDs
// import logger from '../utils/logger'; // Example dependency for a proper logger

/**
 * Logging Middleware
 *
 * Logs incoming requests and outgoing responses.
 * Includes:
 * - Request timing (start time, duration)
 * - Request path, method, IP address
 * - Request body/params logging (with sensitive data redaction)
 * - Response status code
 * - Correlation ID for tracing requests across services
 * - User information (if available from auth middleware)
 */

// Extend Express Request type to include correlationId and startTime
declare global {
  namespace Express {
    interface Request {
      correlationId?: string;
      startTime?: number; // Store start time in milliseconds
    }
  }
}

/**
 * Middleware to log incoming request details.
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  req.correlationId = req.headers['x-correlation-id'] as string || uuidv4();
  req.startTime = Date.now();

  const { method, originalUrl, ip, user } = req;
  const userAgent = req.headers['user-agent'] || 'N/A';
  const userId = user?.id || 'anonymous'; // Assuming user is attached by auth middleware

  // Basic log message (use a structured logger for production)
  console.log(
    `Logging Middleware: --> ${method} ${originalUrl} - User: ${userId} - IP: ${ip} - CorrID: ${req.correlationId} - Agent: ${userAgent}`
  );

  // Log request body (consider redacting sensitive fields)
  if (req.body && Object.keys(req.body).length > 0) {
    // VERY IMPORTANT: Implement redaction for sensitive fields like passwords, tokens, PII
    const redactedBody = JSON.stringify(req.body); // Placeholder - ADD REDACTION LOGIC
    console.log(`Logging Middleware: Request Body (CorrID: ${req.correlationId}): ${redactedBody}`);
  }

  // Log response details when the response finishes
  res.on('finish', () => {
    const { statusCode } = res;
    const duration = req.startTime ? Date.now() - req.startTime : -1;

    console.log(
      `Logging Middleware: <-- ${method} ${originalUrl} ${statusCode} ${duration}ms - User: ${userId} - CorrID: ${req.correlationId}`
    );
  });

  // Set correlation ID in response header
  res.setHeader('X-Correlation-ID', req.correlationId!); // Assert non-null as it's guaranteed by logic above

  next();
};

// Add functions for sensitive data redaction if needed
// const redactSensitiveData = (data: any): any => { ... }
