import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors'; // Assuming CORS is needed
import helmet from 'helmet'; // Basic security headers
import morgan from 'morgan'; // HTTP request logger

// Import routes
import authRoutes from './routes/auth.routes';
// Import other routes as needed (e.g., siteRoutes, userRoutes)

// Import error handling utilities
import { AppError, formatErrorResponse } from './utils/errors'; // Use AppError
import logger from './utils/logger'; // Assuming a logger utility exists

// Create Express app
const app: Express = express();

// --- Core Middleware ---

// Enable CORS - configure origins as needed for production
app.use(cors(/* corsOptions */)); // TODO: Configure CORS options

// Set security-related HTTP headers
app.use(helmet());

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies (optional, if needed)
app.use(express.urlencoded({ extended: true }));

// HTTP request logging (consider 'combined' or 'dev' format)
app.use(morgan('dev', { stream: { write: (message: string) => logger.info(message.trim()) } })); // Use logger.info and type message

// --- API Routes ---

// Mount authentication routes
app.use('/api/auth', authRoutes);

// Mount other routes here...
// app.use('/api/sites', siteRoutes);
// app.use('/api/users', userRoutes);

// --- Health Check Endpoint ---
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// --- 404 Handler ---
// Catch-all for routes not handled above
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError('Not Found - The requested resource does not exist', 404)); // Use AppError
});

// --- Central Error Handler ---
// Must be the last piece of middleware added
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // Log the error details, passing extra info as context
  logger.error(`Unhandled Error: ${err.message}`, err, {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    // Add other relevant context if needed, like req.user?.id
  });

  const formattedError = formatErrorResponse(err);

  res.status(formattedError.statusCode).json(formattedError);
});

export default app;
