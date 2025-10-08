import axios from 'axios';

// ✅ Configure base URL to match your backend server
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000', // Must match your backend port
  timeout: 10000, // 10 seconds timeout
});

// ✅ Attach authorization token (if available)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Axios Request →', config.method?.toUpperCase(), config.url);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Axios request error:', error.message);
    return Promise.reject(error);
  }
);

// ✅ Handle responses and errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Axios Response ←', response.status, response.config.url);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(
        `Axios Error [${error.response.status}]:`,
        error.response.data
      );
    } else {
      console.error('Axios network error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
