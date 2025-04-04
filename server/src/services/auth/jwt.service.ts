import jwt from 'jsonwebtoken';
import ms from 'ms'; // Import ms
import { authConfig } from '@config/index'; // Use path alias

// Define the structure of the JWT payload
interface JwtPayload {
  userId: string;
  // Add other relevant claims like roles, permissions, etc.
}

// Define the structure for the generated token response
interface TokenResponse {
  accessToken: string;
  refreshToken?: string; // Optional, depending on your strategy
  expiresIn: number;
}

// Placeholder for a token blacklist/revocation mechanism
const tokenBlacklist = new Set<string>();

/**
 * Service for handling JSON Web Tokens (JWT).
 */
export class JwtService {
  // Access nested config properties correctly
  private readonly secretKey = authConfig.jwt.secret;
  private readonly accessTokenExpiresIn = authConfig.jwt.expiresIn; // e.g., '1h'
  // Provide a default or read from env if added later
  private readonly refreshTokenExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

  constructor() {
    if (!this.secretKey) {
      throw new Error('JWT secret key is not configured.');
    }
  }

  /**
   * Generates an access token and optionally a refresh token.
   * @param payload - The data to include in the token payload.
   * @param includeRefreshToken - Whether to generate a refresh token.
   * @returns An object containing the token(s) and expiration time.
   */
  generateTokens(payload: JwtPayload, includeRefreshToken = false): TokenResponse {
    const accessTokenExpirySeconds = this.parseExpiry(this.accessTokenExpiresIn);
    const accessToken = jwt.sign(payload, this.secretKey, {
      expiresIn: accessTokenExpirySeconds, // Pass expiry in seconds
    });

    let refreshToken: string | undefined;
    if (includeRefreshToken) {
      // Refresh tokens typically have a longer lifespan and might have different payload/claims
      const refreshTokenExpirySeconds = this.parseExpiry(this.refreshTokenExpiresIn);
      refreshToken = jwt.sign({ userId: payload.userId }, this.secretKey, { // Example: only userId in refresh token
        expiresIn: refreshTokenExpirySeconds, // Pass expiry in seconds
      });
    }

    // Use the already calculated expiry for the response
    const expiresInSeconds = accessTokenExpirySeconds;

    return {
      accessToken,
      refreshToken,
      expiresIn: expiresInSeconds,
    };
  }

  /**
   * Verifies a JWT token.
   * @param token - The JWT token to verify.
   * @returns The decoded payload if the token is valid and not blacklisted.
   * @throws Error if the token is invalid, expired, or blacklisted.
   */
  verifyToken(token: string): JwtPayload {
    if (tokenBlacklist.has(token)) {
      throw new Error('Token has been revoked.');
    }

    try {
      const decoded = jwt.verify(token, this.secretKey) as JwtPayload & { iat: number; exp: number };
      // Perform additional checks if needed (e.g., issuer, audience)
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token has expired.');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token.');
      }
      throw error; // Re-throw other unexpected errors
    }
  }

  /**
   * Refreshes an access token using a refresh token.
   * @param refreshToken - The refresh token.
   * @returns A new TokenResponse with a new access token.
   * @throws Error if the refresh token is invalid or expired.
   */
  refreshToken(refreshToken: string): TokenResponse {
    // Verify the refresh token first
    const decodedRefresh = this.verifyToken(refreshToken); // Reuse verify, assuming same secret for simplicity

    // Optional: Check if refresh token is stored and still valid in DB/cache
    // ...

    // Generate new tokens (typically without a new refresh token unless rotating)
    const newPayload: JwtPayload = { userId: decodedRefresh.userId };
    return this.generateTokens(newPayload, false); // Don't issue another refresh token here usually
  }

  /**
   * Adds a token to the blacklist (revocation).
   * Note: This is a simple in-memory blacklist. For production, use a persistent store like Redis.
   * @param token - The token to blacklist.
   */
  revokeToken(token: string): void {
    // You might want to store the token's 'jti' (JWT ID) if available,
    // or the token itself until it expires.
    tokenBlacklist.add(token);
    // Consider adding TTL to blacklist entries based on token expiry
  }

  /**
   * Parses JWT expiry string (e.g., '1h', '7d') into seconds.
   * Relies on the 'ms' library implicitly used by jsonwebtoken.
   * @param expiresIn - The expiry string.
   * @returns Expiry time in seconds, or a default/fallback if parsing fails.
   */
  private parseExpiry(expiresIn: string): number {
    try {
      // jsonwebtoken uses 'ms' library format. We need to convert ms to seconds.
      // Use the imported 'ms' module directly
      // Cast to any as a workaround for potentially over-strict @types/ms definition
      const milliseconds = (ms as any)(expiresIn);
      if (typeof milliseconds === 'number') {
        return Math.floor(milliseconds / 1000);
      }
    } catch (e) {
      console.error(`Failed to parse JWT expiry string: ${expiresIn}`, e);
    }
    // Fallback to a default value (e.g., 1 hour) if parsing fails
    return 3600;
  }
}

// Export an instance or the class depending on DI strategy
export const jwtService = new JwtService();
