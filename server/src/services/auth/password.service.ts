import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { authConfig } from '@config/index'; // Use path alias

/**
 * Service for handling password-related operations like hashing and verification.
 */
export class PasswordService {
  private readonly saltRounds = authConfig.password.saltRounds;

  constructor() {
    if (this.saltRounds <= 0) {
      console.warn('Password salt rounds should be a positive number. Using default 10.');
      this.saltRounds = 10;
    }
  }

  /**
   * Hashes a plain text password using bcrypt.
   * @param plaintextPassword - The password to hash.
   * @returns A promise that resolves with the hashed password.
   */
  async hashPassword(plaintextPassword: string): Promise<string> {
    if (!plaintextPassword) {
      throw new Error('Password cannot be empty.');
    }
    // Consider adding password strength validation here before hashing
    // E.g., minimum length, complexity requirements

    try {
      const hashedPassword = await bcrypt.hash(plaintextPassword, this.saltRounds);
      return hashedPassword;
    } catch (error) {
      console.error('Error hashing password:', error);
      throw new Error('Could not hash password.');
    }
  }

  /**
   * Verifies a plain text password against a stored hash.
   * @param plaintextPassword - The password attempt.
   * @param hashedPassword - The stored hash to compare against.
   * @returns A promise that resolves with true if the password matches, false otherwise.
   */
  async verifyPassword(plaintextPassword: string, hashedPassword: string): Promise<boolean> {
    if (!plaintextPassword || !hashedPassword) {
      return false; // Or throw an error if preferred
    }

    try {
      const isMatch = await bcrypt.compare(plaintextPassword, hashedPassword);
      return isMatch;
    } catch (error) {
      console.error('Error verifying password:', error);
      // Avoid leaking specific error details that might help attackers
      return false; // Treat verification errors as a mismatch
    }
  }

  /**
   * Generates a secure random token suitable for password resets or email verification.
   * @param length - The desired length of the token string (default: 40).
   * @returns A secure, URL-safe random token string.
   */
  generateSecureToken(length = 40): string {
    // Generate random bytes and convert to a URL-safe base64 string
    // Length calculation: base64 encodes 3 bytes into 4 characters.
    // So, desired length * 3/4 gives approximate byte length needed.
    const byteLength = Math.ceil(length * 3 / 4);
    const buffer = crypto.randomBytes(byteLength);
    return buffer.toString('base64')
                 .replace(/\+/g, '-') // Replace '+' with '-'
                 .replace(/\//g, '_') // Replace '/' with '_'
                 .replace(/=+$/, ''); // Remove trailing '=' padding
  }

  /**
   * Optional: Validates password strength based on configured rules.
   * @param password - The password to validate.
   * @returns True if the password meets the criteria, false otherwise.
   */
  validatePasswordStrength(password: string): boolean {
    // Example criteria (customize as needed):
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password); // Adjust symbols as needed

    if (password.length < minLength) return false;
    if (!hasUpperCase) return false;
    if (!hasLowerCase) return false;
    if (!hasNumbers) return false;
    // if (!hasSymbols) return false; // Uncomment if symbols are required

    return true;
  }

  // Potential future methods:
  // - needsRehash(hashedPassword: string): boolean - Checks if hash uses outdated settings
  // - migrateHash(plaintextPassword: string, oldHash: string): Promise<string> - Rehashes with current settings
}

// Export an instance or the class depending on DI strategy
export const passwordService = new PasswordService();
