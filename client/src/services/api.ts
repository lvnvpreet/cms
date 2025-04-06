import axios from 'axios';

// Determine the base URL for the API
// Use environment variable if available, otherwise default to localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials: true, // Uncomment if you need to send cookies with requests
});

// Optional: Add interceptors for request/response handling (e.g., adding auth tokens)
// apiClient.interceptors.request.use(config => {
//   const token = localStorage.getItem('authToken'); // Example: Get token from storage
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// apiClient.interceptors.response.use(
//   response => response,
//   error => {
//     // Handle errors globally (e.g., redirect on 401 Unauthorized)
//     console.error('API Error:', error.response || error.message);
//     return Promise.reject(error);
//   }
// );

export default apiClient;
