import { findUserByEmail, createUser } from '@/db/queries/user-queries';
import { passwordService } from './password.service';
import { jwtService } from './jwt.service';
import { UserAttributes } from '@/models/user.model';
import { AppError, ConflictError, AuthenticationError } from '@/utils/errors'; // Import specific error types

// Define types for input data (could be refined with validation schemas later)
// Make role optional here as the controller doesn't pass it, relying on the service default.
type RegisterUserData = {
  firstName?: string;
  lastName?: string;
  username: string;
  email: string;
  role?: UserAttributes['role']; // Optional role
  password: string;
};
type LoginUserData = Pick<UserAttributes, 'email'> & { password: string };

/**
 * Registers a new user.
 * @param userData - The user registration data.
 * @returns The newly created user object (excluding password hash).
 * @throws HttpError if email already exists or on database error.
 */
export async function registerUser(userData: RegisterUserData): Promise<Omit<UserAttributes, 'passwordHash'>> {
  // Destructure all expected fields, including the new optional ones
  const { email, username, password, role, firstName, lastName } = userData;

  // 1. Check if user already exists
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new ConflictError('User with this email already exists.'); // Use ConflictError
  }

  // 2. Hash the password
  const passwordHash = await passwordService.hashPassword(password);

  // 3. Create the user in the database
  try {
    // Pass firstName and lastName to createUser
    const newUser = await createUser({
      firstName, // Pass firstName (will be undefined if not provided)
      lastName,  // Pass lastName (will be undefined if not provided)
      username,
      email,
      passwordHash,
      role: role || 'user', // Changed default role to 'user' to match DB constraint
    });

    // 4. Return user data (excluding password hash)
    const { passwordHash: _, ...userToReturn } = newUser;
    return userToReturn;
  } catch (error: any) {
    // Handle potential unique constraint errors from createUser
    if (error.message.includes('already exists')) {
        throw new ConflictError(error.message); // Use ConflictError
    }
    console.error('Error during user registration:', error);
    throw new AppError('Failed to register user due to a server error.', 500); // Use base AppError
  }
}

/**
 * Logs in a user.
 * @param loginData - The user login data (email, password).
 * @returns An object containing the user data (excluding password hash) and JWT token.
 * @throws HttpError if user not found, password invalid, or on server error.
 */
export async function loginUser(loginData: LoginUserData): Promise<{ user: Omit<UserAttributes, 'passwordHash'>; token: string }> {
  const { email, password } = loginData;

  // 1. Find user by email
  const user = await findUserByEmail(email);
  if (!user) {
    throw new AuthenticationError('Invalid email or password.'); // Use AuthenticationError
  }

  // 2. Verify password
  const isPasswordValid = await passwordService.verifyPassword(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new AuthenticationError('Invalid email or password.'); // Use AuthenticationError
  }

  // TODO: Check if user is verified (user.isVerified) if required

  // 3. Generate JWT token
  const payload = { userId: user.id.toString(), role: user.role }; // Ensure userId is string if needed by JwtPayload
  const tokenResponse = jwtService.generateTokens(payload); // Call the correct method
  const token = tokenResponse.accessToken; // Extract the access token

  // 4. Return user data (excluding password hash) and token
  const { passwordHash: _, ...userToReturn } = user;
  return { user: userToReturn, token };
}

// TODO: Implement requestPasswordReset
// export async function requestPasswordReset(email: string): Promise<void> { ... }

// TODO: Implement resetPassword
// export async function resetPassword(token: string, newPassword: string): Promise<void> { ... }

// TODO: Implement verifyEmail
// export async function verifyEmail(token: string): Promise<void> { ... }

// TODO: Implement refreshToken
// export async function refreshToken(refreshToken: string): Promise<{ newToken: string; newRefreshToken?: string }> { ... }

// TODO: Implement logoutUser
// export async function logoutUser(userId: number, token?: string): Promise<void> { ... }

// TODO: Implement OAuth logic if needed
// export async function initiateOAuth(provider: string): Promise<string> { ... }
// export async function handleOAuthCallback(provider: string, code: string): Promise<{ user: Omit<UserAttributes, 'passwordHash'>; token: string; refreshToken?: string }> { ... }
