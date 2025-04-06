import { Router } from 'express';
// Import controllers and middleware as needed
// import { listUsers, getUser, updateUser, deleteUser, getUserProfile, updateUserProfile, uploadAvatar, getCurrentUser } from '../controllers/user.controller';
// import { authenticateToken, isAdmin } from '../middleware/auth.middleware'; // Example auth/permission middleware
// import { validateUserId, validateUpdateUser, validateUpdateProfile } from '../middleware/validation.middleware'; // Example validation middleware
// import { upload } from '../middleware/upload.middleware'; // Example upload middleware for avatar

const router = Router();

// Apply authentication middleware to all user routes
// router.use(authenticateToken);

// GET /users - List users (admin only)
router.get('/', /* isAdmin, */ /* listUsers */);

// GET /users/me - Get current user details
router.get('/me', /* getCurrentUser */); // Usually doesn't need ID validation

// GET /users/:id - Get specific user
router.get('/:id', /* validateUserId, */ /* getUser */);

// PUT /users/:id - Update user details
router.put('/:id', /* validateUserId, validateUpdateUser, */ /* updateUser */);

// DELETE /users/:id - Delete user
router.delete('/:id', /* validateUserId, isAdmin, */ /* deleteUser */); // Often restricted to admins

// GET /users/:id/profile - Get user profile
router.get('/:id/profile', /* validateUserId, */ /* getUserProfile */);

// PUT /users/:id/profile - Update profile
router.put('/:id/profile', /* validateUserId, validateUpdateProfile, */ /* updateUserProfile */);

// POST /users/:id/avatar - Upload profile image
// Assuming 'avatar' is the field name in the form-data
router.post('/:id/avatar', /* validateUserId, upload.single('avatar'), */ /* uploadAvatar */);

export default router;
