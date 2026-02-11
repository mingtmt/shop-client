import axios from 'axios';
import { authUtils } from '../utils/auth';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api', 
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

axiosInstance.interceptors.request.use((config) => {
  const token = authUtils.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;