import { Router } from 'express';
// Import controllers and middleware as needed
// import { listSites, createSite, getSite, updateSite, deleteSite, publishSite, cloneSite, listSiteVersions, restoreSiteVersion } from '../controllers/site.controller';
// import { authenticateToken, checkSiteOwnership } from '../middleware/auth.middleware'; // Example auth/permission middleware
// import { validateSiteId, validateCreateSite, validateUpdateSite, validateVersionId } from '../middleware/validation.middleware'; // Example validation middleware

// Import nested route modules
import deployRoutes from './deploy.routes';
import analyticsRoutes from './analytics.routes';

const router = Router();

// Apply authentication middleware to all site routes
// router.use(authenticateToken);

// GET /sites - List user's sites
router.get('/', /* listSites */);

// POST /sites - Create new site
router.post('/', /* validateCreateSite, */ /* createSite */);

// Apply middleware to check site ownership/access for routes with :id
// router.use('/:id', validateSiteId, checkSiteOwnership); // Example: Ensure user owns the site for subsequent routes

// GET /sites/:id - Get site details
router.get('/:id', /* getSite */);

// PUT /sites/:id - Update site
router.put('/:id', /* validateUpdateSite, */ /* updateSite */);

// DELETE /sites/:id - Delete site
router.delete('/:id', /* deleteSite */);

// POST /sites/:id/publish - Publish site
router.post('/:id/publish', /* publishSite */);

// POST /sites/:id/clone - Clone existing site
router.post('/:id/clone', /* cloneSite */);

// GET /sites/:id/versions - List site versions
router.get('/:id/versions', /* listSiteVersions */);

// POST /sites/:id/restore/:versionId - Restore version
router.post('/:id/restore/:versionId', /* validateVersionId, */ /* restoreSiteVersion */);

// Mount nested routes for deployment and analytics under /sites/:id
// These routers use mergeParams: true to access the :id from this router
router.use('/:id/deploy', /* validateSiteId, checkSiteOwnership, */ deployRoutes); // Apply necessary middleware before nested router
router.use('/:id/analytics', /* validateSiteId, checkSiteOwnership, */ analyticsRoutes); // Apply necessary middleware before nested router


export default router;
