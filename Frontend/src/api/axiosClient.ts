import axios from "axios";

const axiosClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add token to all requests
axiosClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
axiosClient.interceptors.response.use(
  (response) => {
    // Log response for debugging
    console.log('✅ API Response:', response.config.url, response.status, response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.config?.url, error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      sessionStorage.removeItem("token");
      window.location.href = "/login";
    }
    
    // Better error message for JSON parse errors
    if (error.message?.includes('JSON')) {
      console.error('🔴 JSON Parse Error - Response might be text/html instead of JSON:', error.config?.url);
      console.error('Response data:', error.response?.data);
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;
