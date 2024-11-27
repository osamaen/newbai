import axios from 'axios';

const baseURL = import.meta.env.VITE_APP_API_URL;

// Create axios instance with custom config
const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('user_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor (optional but recommended)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle token expiration
    if (error.response?.status === 401) {
      localStorage.removeItem('user_token');
      // Redirect to login or handle token expiration
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;