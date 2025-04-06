// server/src/db/queries/user-queries.ts

/**
 * Purpose: Complex user-related database queries.
 * Includes retrieval, creation, search, filtering, and statistics queries for users.
 */

import pool from '@config/database'; // Use the path alias defined in tsconfig.json
import { UserAttributes } from '@/models/user.model'; // Correct path alias for src directory

/**
 * Finds a user by their email address.
 * @param email - The email address to search for.
 * @returns A promise that resolves with the UserAttributes or null if not found.
 */
export async function findUserByEmail(email: string): Promise<UserAttributes | null> {
  // Ensure all expected columns from UserAttributes are selected
  const query = `
    SELECT id, username, email, "passwordHash", "firstName", "lastName", "avatarUrl", preferences, role, "isVerified", "lastLoginAt", "created_at", "updated_at"
    FROM users
    WHERE email = $1;
  `;
  try {
    const result = await pool.query(query, [email]);
    if (result.rows.length === 0) {
      return null;
    }
    // Map database row (snake_case) to UserAttributes (camelCase) if necessary,
    // but assuming column names match or ORM handles it.
    // For direct pg, ensure column names in SELECT match UserAttributes keys or map manually.
    // Here, we assume direct mapping works for simplicity, but double-check DB schema.
    // Explicit mapping example:
    // const row = result.rows[0];
    // return {
    //   id: row.id,
    //   username: row.username,
    //   email: row.email,
    //   passwordHash: row.passwordHash, // Ensure DB column name matches
    //   firstName: row.firstName,
    //   lastName: row.lastName,
    //   avatarUrl: row.avatarUrl,
    //   preferences: row.preferences,
    //   role: row.role,
    //   isVerified: row.isVerified,
    //   lastLoginAt: row.lastLoginAt,
    //   createdAt: row.createdAt,
    //   updatedAt: row.updatedAt,
    // };
    return result.rows[0] as UserAttributes; // Cast might be needed depending on pg typings
  } catch (error) {
    console.error(`Error fetching user by email ${email}:`, error);
    throw new Error('Database error while fetching user.'); // Throw a generic error
  }
}

/**
 * Creates a new user in the database.
 * @param userData - Object containing user data (username, email, passwordHash, role, firstName?, lastName?).
 * @returns A promise that resolves with the newly created UserAttributes.
 */
// Update parameter type to include optional firstName and lastName
export async function createUser(userData: Pick<UserAttributes, 'username' | 'email' | 'passwordHash' | 'role' | 'firstName' | 'lastName'>): Promise<UserAttributes> {
  // Destructure new fields
  const { username, email, passwordHash, role, firstName, lastName } = userData;
  // Update INSERT query to include new columns and values
  // Ensure all expected columns are returned, including avatarUrl
  const query = `
    INSERT INTO users (username, email, "passwordHash", role, "firstName", "lastName")
    VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, username, email, "passwordHash", "firstName", "lastName", "avatarUrl", preferences, role, "isVerified", "lastLoginAt", "created_at", "updated_at";
   `;
   try {
+    console.log(`[createUser] Attempting insert for email: ${email}, username: ${username}`); // Log before query
     // Pass new values to the query
     const result = await pool.query(query, [username, email, passwordHash, role, firstName, lastName]);
+    console.log(`[createUser] Query executed. Rows returned: ${result.rowCount}`); // Log after query
     if (result.rows.length === 0) {
         throw new Error('User creation failed, no data returned.');
    }
     return result.rows[0] as UserAttributes;
   } catch (error) {
+    console.error(`[createUser] Error during database insertion for ${email}:`, error); // Enhanced error log
     // Check for specific errors like unique constraint violation (e.g., duplicate email/username)
     if ((error as any).code === '23505') { // PostgreSQL unique violation error code
        throw new Error('Username or email already exists.');
    }
    throw new Error('Database error during user creation.');
  }
}

// TODO: Implement findUserById
// export async function findUserById(id: number): Promise<UserAttributes | null> { ... }

// TODO: Implement updateUser
// export async function updateUser(id: number, data: Partial<UserAttributes>): Promise<UserAttributes | null> { ... }

// TODO: Implement deleteUser
// export async function deleteUser(id: number): Promise<boolean> { ... }

// TODO: Implement user search and filtering functions
// export async function searchUsers(criteria: UserSearchCriteria): Promise<User[]> { ... }

// TODO: Implement user statistics queries
// export async function getUserSignupStats(): Promise<SignupStats> { ... }
