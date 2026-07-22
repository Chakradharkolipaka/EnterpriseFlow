import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
axiosClient.interceptors.request.use(
  (config) => {
    const token = window.authToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and 401
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // Handle 401 - clear auth and redirect to login
      if (error.response.status === 401) {
        window.authToken = null;
        // Dispatch custom event for AuthContext to pick up
        window.dispatchEvent(new Event('unauthorized'));
        window.location.href = '/login';
      }
      // Server responded with error
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Request made but no response
      return Promise.reject({ message: 'No response from server' });
    } else {
      // Something else happened
      return Promise.reject({ message: error.message });
    }
  }
);

export default axiosClient;
