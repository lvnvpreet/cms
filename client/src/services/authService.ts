import apiClient from './api';
import { UserRegistrationData, User } from '@/types'; // Assuming types are defined here

/**
 * Registers a new user.
 * @param userData - The user registration data (name, email, password).
 * @returns A promise that resolves with the created user data (or relevant response).
 */
export const registerUser = async (userData: UserRegistrationData): Promise<User> => {
  try {
    // Make a POST request to the backend registration endpoint
    // Adjust '/auth/register' if your backend route is different
    const response = await apiClient.post<User>('/auth/register', userData);
    return response.data; // Return the data from the response (e.g., the created user object)
  } catch (error: any) {
    // Log the error and re-throw it or handle it more specifically
    console.error('Registration API error:', error.response?.data || error.message);
    // Throw a more specific error message if available from the backend response
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

// Add other auth-related functions here (login, logout, forgotPassword, etc.)
// Example login function:
/*
export const loginUser = async (credentials: UserLoginData): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    // Handle storing the token (e.g., in localStorage)
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response.data;
  } catch (error: any) {
    console.error('Login API error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};
*/

// Example logout function:
/*
export const logoutUser = async (): Promise<void> => {
  try {
    // Optional: Call a backend endpoint to invalidate the session/token
    // await apiClient.post('/auth/logout');

    // Clear local storage or state
    localStorage.removeItem('authToken');
    // Potentially redirect or update UI state
  } catch (error: any) {
    console.error('Logout API error:', error.response?.data || error.message);
    // Even if backend call fails, attempt to clear local token
    localStorage.removeItem('authToken');
    throw new Error(error.response?.data?.message || 'Logout failed');
  }
};
*/
