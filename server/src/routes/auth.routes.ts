import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller'; // Use named import
// Import middleware as needed
// import { validateLogin, validateRegister, validateForgotPassword, validateResetPassword, validateVerifyEmail } from '../middleware/validation.middleware'; // Example validation middleware
// import { authenticateToken } from '../middleware/auth.middleware'; // Example auth middleware

const router = Router();

// POST /auth/login - User login
router.post('/login', /* validateLogin, */ AuthController.login); // Use controller method

// POST /auth/register - New user registration
router.post('/register', /* validateRegister, */ AuthController.register); // Use controller method

// POST /auth/logout - User logout (Requires authentication)
router.post('/logout', /* authenticateToken, */ AuthController.logout);

// POST /auth/refresh-token - JWT token refresh
router.post('/refresh-token', AuthController.refreshToken);

// POST /auth/forgot-password - Password reset request
router.post('/forgot-password', /* validateForgotPassword, */ AuthController.requestPasswordReset);

// POST /auth/reset-password - Password reset with token
router.post('/reset-password', /* validateResetPassword, */ AuthController.resetPassword);

// GET /auth/verify-email/:token - Email verification
router.get('/verify-email/:token', /* validateVerifyEmail, */ AuthController.verifyEmail);

// POST /auth/oauth/:provider - Social login connections
router.post('/oauth/:provider', AuthController.oauthInitiate); // Might need specific middleware per provider

export default router;
