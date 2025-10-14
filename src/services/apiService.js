import axios from 'axios';

// API base URL configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production'
    ? 'https://api.evconnects.com' 
    : 'http://localhost:3000/api');

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Station related API calls
export const stationService = {
  getAllStations: () => api.get('/stations'),
  getStationById: (id) => api.get(`/stations/${id}`),
  getNearbyStations: (lat, lng, radius = 10) => 
    api.get(`/stations/nearby?lat=${lat}&lng=${lng}&radius=${radius}`),
};

// Payment related API calls
export const paymentService = {
  createPaymentIntent: (amount) => api.post('/create-payment-intent', { amount }),
  getPaymentHistory: () => api.get('/payments/history'),
};

// User related API calls
export const userService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/user/profile'),
  updateProfile: (userData) => api.put('/user/profile', userData),
};

export default api;