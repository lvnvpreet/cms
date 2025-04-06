import { Router } from 'express';
// Import other route modules here as they are created
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import siteRoutes from './site.routes';
import templateRoutes from './template.routes';
import componentRoutes from './component.routes';
import deployRoutes from './deploy.routes';
import mediaRoutes from './media.routes';
import analyticsRoutes from './analytics.routes';

const router = Router();

// Register middleware applicable to all routes (if any)
// router.use(someGlobalMiddleware);

// Configure base paths for each route group
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/sites', siteRoutes); // Site routes handle /sites and nested /sites/:id/...
router.use('/templates', templateRoutes);
router.use('/components', componentRoutes);
// Note: deployRoutes and analyticsRoutes are designed with mergeParams: true
// They should be mounted *within* site.routes.ts for paths like /sites/:siteId/deploy
// Or, if intended as top-level (less RESTful), adjust here. Assuming nested for now.
// router.use('/deploy', deployRoutes); // This would be incorrect if nested under sites
router.use('/media', mediaRoutes);
// router.use('/analytics', analyticsRoutes); // This would be incorrect if nested under sites


// Error handling for routes not found (usually handled in app.ts after all routes)
// router.use((req, res, next) => {
//   const error = new Error('Not Found');
//   (error as any).status = 404; // Add status property for Express error handling
//   next(error);
// });

export default router;
