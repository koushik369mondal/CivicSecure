// import axios from 'axios';

// // Environment-aware API URL configuration
// const getApiBaseUrl = () => {
//     // Check if we're in development (localhost) or production
//     if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
//         return 'http://localhost:5000/api';
//     }
//     // Replace with your production API URL
//     return 'https://your-production-api-url.com/api';
// };

// const API_BASE_URL = getApiBaseUrl();

// // Create axios instance
// const api = axios.create({
//     baseURL: API_BASE_URL,
//     headers: {
//         'Content-Type': 'application/json'
//     },
//     timeout: 10000 // 10 second timeout
// });

// // Add token to requests if available
// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// }, (error) => {
//     return Promise.reject(error);
// });

// // Response interceptor for handling common errors
// api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response?.status === 401) {
//             // Token expired or unauthorized
//             localStorage.removeItem('token');
//             localStorage.removeItem('userProfile');
//             // Optionally redirect to login
//             console.warn('Unauthorized access - token may be expired');
//         }
//         return Promise.reject(error);
//     }
// );

// // Authentication API
// export const authAPI = {
//     register: (aadhaarNumber, phoneNumber) =>
//         api.post('/auth/register', { aadhaarNumber, phoneNumber }),

//     verifyOTP: (phoneNumber, otp) =>
//         api.post('/auth/verify-otp', { phoneNumber, otp }),

//     login: (phoneNumber) =>
//         api.post('/auth/login', { phoneNumber }),

//     verifyLoginOTP: (phoneNumber, otp) =>
//         api.post('/auth/login/verify', { phoneNumber, otp }),

//     getProfile: () =>
//         api.get('/auth/profile'),

//     logout: () => {
//         localStorage.removeItem('token');
//         localStorage.removeItem('userProfile');
//         return Promise.resolve({ success: true });
//     }
// };

// // Complaints API
// export const complaintsAPI = {
//     // Create new complaint
//     create: (complaintData) =>
//         api.post('/complaints', complaintData),

//     // Get all complaints with optional filters
//     getAll: (params = {}) =>
//         api.get('/complaints', { params }),

//     // Get complaint by ID
//     getById: (id) =>
//         api.get(`/complaints/${id}`),

//     // Update complaint
//     update: (id, updateData) =>
//         api.put(`/complaints/${id}`, updateData),

//     // Delete complaint
//     delete: (id) =>
//         api.delete(`/complaints/${id}`),

//     // Get complaint statistics
//     getStats: () =>
//         api.get('/complaints/stats/summary'),

//     // Search complaints
//     search: (query, filters = {}) =>
//         api.get('/complaints', {
//             params: {
//                 search: query,
//                 ...filters
//             }
//         })
// };

// // User/Profile API
// export const userAPI = {
//     // Get user profile
//     getProfile: () =>
//         api.get('/user/profile'),

//     // Update user profile
//     updateProfile: (profileData) =>
//         api.put('/user/profile', profileData),

//     // Get user's complaints
//     getMyComplaints: (params = {}) =>
//         api.get('/user/complaints', { params }),

//     // Update user preferences
//     updatePreferences: (preferences) =>
//         api.put('/user/preferences', preferences)
// };

// // Utility functions
// export const apiUtils = {
//     // Handle API errors consistently
//     handleError: (error) => {
//         if (error.response) {
//             // Server responded with error status
//             const message = error.response.data?.error ||
//                 error.response.data?.message ||
//                 `Server error: ${error.response.status}`;
//             return {
//                 success: false,
//                 error: message,
//                 status: error.response.status
//             };
//         } else if (error.request) {
//             // Request was made but no response received
//             return {
//                 success: false,
//                 error: 'Network error - please check your connection',
//                 status: 0
//             };
//         } else {
//             // Something else happened
//             return {
//                 success: false,
//                 error: error.message || 'An unexpected error occurred',
//                 status: -1
//             };
//         }
//     },

//     // Check if API is reachable
//     healthCheck: async () => {
//         try {
//             const response = await api.get('/health');
//             return {
//                 success: true,
//                 status: response.data
//             };
//         } catch (error) {
//             return apiUtils.handleError(error);
//         }
//     },

//     // Test database connection
//     testConnection: async () => {
//         try {
//             const response = await api.get('/');
//             return {
//                 success: true,
//                 data: response.data
//             };
//         } catch (error) {
//             return apiUtils.handleError(error);
//         }
//     }
// };

// // Enhanced complaint service with error handling
// export const complaintService = {
//     // Create complaint with full error handling
//     async create(complaintData) {
//         try {
//             const response = await complaintsAPI.create(complaintData);
//             return {
//                 success: true,
//                 data: response.data,
//                 complaint: response.data.complaint
//             };
//         } catch (error) {
//             return apiUtils.handleError(error);
//         }
//     },

//     // Get complaint by ID with fallback
//     async getById(id) {
//         try {
//             const response = await complaintsAPI.getById(id);
//             return {
//                 success: true,
//                 data: response.data,
//                 complaint: response.data.complaint
//             };
//         } catch (error) {
//             return apiUtils.handleError(error);
//         }
//     },

//     // Get all complaints with pagination
//     async getAll(page = 1, limit = 10, filters = {}) {
//         try {
//             const params = { page, limit, ...filters };
//             const response = await complaintsAPI.getAll(params);
//             return {
//                 success: true,
//                 data: response.data,
//                 complaints: response.data.complaints,
//                 pagination: {
//                     page: response.data.page,
//                     pages: response.data.pages,
//                     total: response.data.total
//                 }
//             };
//         } catch (error) {
//             return apiUtils.handleError(error);
//         }
//     },

//     // Update complaint status
//     async updateStatus(id, status, remark = '', officer = 'System') {
//         try {
//             const response = await complaintsAPI.update(id, {
//                 status,
//                 remark,
//                 officer
//             });
//             return {
//                 success: true,
//                 data: response.data,
//                 complaint: response.data.complaint
//             };
//         } catch (error) {
//             return apiUtils.handleError(error);
//         }
//     }
// };

// // Export the main api instance as default
// export default api;

// // Export API base URL for external use
// export { API_BASE_URL };

// // Export configuration
// export const apiConfig = {
//     baseURL: API_BASE_URL,
//     timeout: 10000,
//     retries: 3,
//     retryDelay: 1000
// };
