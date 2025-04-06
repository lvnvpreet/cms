import { Router } from 'express';
// Import controllers and middleware as needed
// import { listComponents, getComponent, listComponentCategories, createComponent, updateComponent, deleteComponent } from '../controllers/component.controller';
// import { authenticateToken, checkAdminOrComponentOwner } from '../middleware/auth.middleware'; // Example auth/permission middleware
// import { validateComponentId, validateCreateComponent, validateUpdateComponent } from '../middleware/validation.middleware'; // Example validation middleware

const router = Router();

// Apply authentication middleware (adjust permissions as needed)
// router.use(authenticateToken);

// GET /components - List available components (public or user-specific)
router.get('/', /* listComponents */);

// GET /components/categories - List component categories
router.get('/categories', /* listComponentCategories */);

// GET /components/:id - Get component details
router.get('/:id', /* validateComponentId, */ /* getComponent */);

// POST /components - Create custom component (requires auth, maybe specific permissions)
router.post('/', /* validateCreateComponent, */ /* createComponent */);

// PUT /components/:id - Update component (requires ownership or admin)
router.put('/:id', /* validateComponentId, checkAdminOrComponentOwner, validateUpdateComponent, */ /* updateComponent */);

// DELETE /components/:id - Delete custom component (requires ownership or admin)
router.delete('/:id', /* validateComponentId, checkAdminOrComponentOwner, */ /* deleteComponent */);

export default router;
