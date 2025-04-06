import { Router } from 'express';
// Import controllers and middleware as needed
// import { listTemplates, getTemplate, createTemplate, updateTemplate, deleteTemplate, listTemplateCategories, applyTemplateToSite } from '../controllers/template.controller';
// import { authenticateToken, checkAdminOrTemplateOwner } from '../middleware/auth.middleware'; // Example auth/permission middleware
// import { validateTemplateId, validateCreateTemplate, validateUpdateTemplate, validateSiteId } from '../middleware/validation.middleware'; // Example validation middleware

const router = Router();

// Apply authentication middleware (adjust permissions as needed)
// router.use(authenticateToken);

// GET /templates - List available templates (public or user-specific)
router.get('/', /* listTemplates */);

// GET /templates/categories - List template categories
router.get('/categories', /* listTemplateCategories */);

// GET /templates/:id - Get template details
router.get('/:id', /* validateTemplateId, */ /* getTemplate */);

// POST /templates - Create custom template (requires auth, maybe specific permissions)
router.post('/', /* validateCreateTemplate, */ /* createTemplate */);

// PUT /templates/:id - Update template (requires ownership or admin)
router.put('/:id', /* validateTemplateId, checkAdminOrTemplateOwner, validateUpdateTemplate, */ /* updateTemplate */);

// DELETE /templates/:id - Delete custom template (requires ownership or admin)
router.delete('/:id', /* validateTemplateId, checkAdminOrTemplateOwner, */ /* deleteTemplate */);

// POST /sites/:siteId/apply-template/:templateId - Apply template to site
// This might live in site.routes.ts or here, depending on preference. Let's assume it's here for now.
// Needs validation for both siteId and templateId, and permission checks.
router.post('/apply/:templateId/to/:siteId', /* validateTemplateId, validateSiteId, checkSiteOwnership, */ /* applyTemplateToSite */); // Example route structure

export default router;
