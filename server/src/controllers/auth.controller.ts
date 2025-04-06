// server/src/controllers/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod'; // Import Zod
import { loginUser, registerUser } from '@/services/auth/authService'; // Use path alias
import { BadRequestError } from '@/utils/errors'; // Import error for validation issues

// --- Validation Schemas ---

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }), // Keep password validation minimal here, service layer handles complexity
});

const registerSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }).optional(), // Added optional firstName
  lastName: z.string().min(1, { message: 'Last name is required' }).optional(), // Added optional lastName
  username: z.string().min(3, { message: 'Username must be at least 3 characters long' }).max(50),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
  // Add role validation if applicable and allowed during registration
  // role: z.enum(['user', 'editor']).optional(), // Example: only allow 'user' or 'editor'
});

/**
 * @controller AuthController
 * @description Handles user authentication and authorization processes.
 */
export class AuthController {
  /**
   * @route POST /api/auth/login
   * @description Handles user login requests.
   * @access Public
   */
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // 1. Validate request body
      const validatedData = loginSchema.parse(req.body);

      // 2. Call AuthService to handle login logic
      const { user, token } = await loginUser(validatedData); // Pass validated data

      // 3. Send response with token and user data
      res.status(200).json({ message: 'Login successful', token, user });
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Format Zod errors into a user-friendly message or structure
        // Log the detailed validation errors if needed
        // console.error("Validation Error Details:", error.errors);
        // Pass a generic BadRequestError message
        next(new BadRequestError('Invalid input data. Please check your email and password.'));
      } else {
        next(error); // Pass other errors to the central error handler
      }
    }
  }
  // Removed duplicate closing braces and catch block here

  /**
   * @route POST /api/auth/register
   * @description Handles new user registration.
   * @access Public
   */
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // 1. Validate request body
      const validatedData = registerSchema.parse(req.body);

      // 2. Call AuthService to register the user. The service will apply the default role ('user').
      const newUser = await registerUser({
        ...validatedData,
        // Removed explicit role: 'viewer' here to let the service default apply
      });

      // 3. Send response
      res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Log the detailed validation errors if needed
        // console.error("Validation Error Details:", error.errors);
        // Pass a generic BadRequestError message
        next(new BadRequestError('Invalid registration data. Please check your input.'));
      } else {
        next(error); // Pass other errors to the central error handler
      }
    }
  }
  // Removed duplicate closing braces and catch block here

  /**
   * @route POST /api/auth/request-password-reset
   * @description Initiates the password reset process.
   * @access Public
   */
  static async requestPasswordReset(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // 1. Validate email
      // const { email } = passwordResetRequestSchema.parse(req.body);

      // 2. Call AuthService to handle password reset request
      // await AuthService.requestPasswordReset(email);

      // 3. Send response
      // res.status(200).json({ message: 'Password reset email sent if user exists.' });
       res.status(501).json({ message: 'Request password reset endpoint not implemented' }); // Placeholder
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route POST /api/auth/reset-password/:token
   * @description Resets the user's password using a token.
   * @access Public
   */
  static async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // 1. Validate token and new password
      // const { token } = req.params;
      // const { newPassword } = passwordResetSchema.parse(req.body);

      // 2. Call AuthService to reset the password
      // await AuthService.resetPassword(token, newPassword);

      // 3. Send response
      // res.status(200).json({ message: 'Password reset successfully.' });
       res.status(501).json({ message: 'Reset password endpoint not implemented' }); // Placeholder
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route GET /api/auth/verify-email/:token
   * @description Verifies a user's email address.
   * @access Public
   */
  static async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // 1. Get token from params
      // const { token } = req.params;

      // 2. Call AuthService to verify email
      // await AuthService.verifyEmail(token);

      // 3. Send response or redirect
      // res.status(200).json({ message: 'Email verified successfully.' });
       res.status(501).json({ message: 'Verify email endpoint not implemented' }); // Placeholder
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route POST /api/auth/refresh-token
   * @description Refreshes the authentication token.
   * @access Public (requires refresh token)
   */
  static async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // 1. Get refresh token from body or headers
      // const { refreshToken } = refreshTokenSchema.parse(req.body);

      // 2. Call AuthService to refresh the token
      // const { newToken, newRefreshToken } = await AuthService.refreshToken(refreshToken);

      // 3. Send response
      // res.status(200).json({ token: newToken, refreshToken: newRefreshToken });
       res.status(501).json({ message: 'Refresh token endpoint not implemented' }); // Placeholder
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route POST /api/auth/logout
   * @description Logs the user out.
   * @access Private (requires auth token)
   */
  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // 1. Get token/user info from request (added by auth middleware)
      // const userId = req.user?.id; // Assuming auth middleware adds user to req
      // const token = req.headers.authorization?.split(' ')[1];

      // 2. Call AuthService to handle logout (e.g., invalidate token/session)
      // await AuthService.logoutUser(userId, token);

      // 3. Send response
      // res.status(200).json({ message: 'Logout successful.' });
       res.status(501).json({ message: 'Logout endpoint not implemented' }); // Placeholder
    } catch (error) {
      next(error);
    }
  }

  // --- Optional Endpoints ---

  /**
   * @route GET /api/auth/oauth/:provider
   * @description Initiates OAuth authentication flow.
   * @access Public
   */
  static async oauthInitiate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // const { provider } = req.params;
      // Redirect to provider's auth page
      // const redirectUrl = await AuthService.initiateOAuth(provider);
      // res.redirect(redirectUrl);
       res.status(501).json({ message: 'OAuth initiate endpoint not implemented' }); // Placeholder
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route GET /api/auth/oauth/:provider/callback
   * @description Handles OAuth callback from the provider.
   * @access Public
   */
  static async oauthCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // const { provider } = req.params;
      // const code = req.query.code; // Authorization code from provider
      // Handle callback, exchange code for token, get user profile, login/register user
      // const { user, token, refreshToken } = await AuthService.handleOAuthCallback(provider, code);
      // Redirect user or send token
      // res.status(200).json({ message: 'OAuth successful', token, refreshToken, user });
       res.status(501).json({ message: 'OAuth callback endpoint not implemented' }); // Placeholder
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route POST /api/auth/2fa/setup
   * @description Sets up two-factor authentication for the user.
   * @access Private
   */
  static async setupTwoFactorAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // const userId = req.user?.id;
      // Generate 2FA secret, QR code, etc.
      // const setupData = await AuthService.setup2FA(userId);
      // res.status(200).json(setupData);
       res.status(501).json({ message: '2FA setup endpoint not implemented' }); // Placeholder
    } catch (error) {
      next(error);
    }
  }

   /**
   * @route POST /api/auth/2fa/verify
   * @description Verifies a 2FA code during login or setup.
   * @access Private / Semi-private (during login)
   */
  static async verifyTwoFactorAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // const userId = req.user?.id;
      // const { code } = twoFactorVerifySchema.parse(req.body);
      // Verify the code
      // const isValid = await AuthService.verify2FA(userId, code);
      // if (isValid) {
      //   // Grant full access or complete setup
      //   res.status(200).json({ message: '2FA verified successfully.' });
      // } else {
      //   res.status(401).json({ message: 'Invalid 2FA code.' });
      // }
       res.status(501).json({ message: '2FA verify endpoint not implemented' }); // Placeholder
    } catch (error) {
      next(error);
    }
  }
}
