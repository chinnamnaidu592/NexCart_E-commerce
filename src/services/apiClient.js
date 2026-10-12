import axios from 'axios';
import { API_BASE_URL } from '@/constants/config';

/**
 * Shared Axios client with configured baseURL, timeout, and friendly error interceptor.
 * UI components must never call fetch or axios directly; all traffic flows through services.
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let friendlyMessage = 'An unexpected network error occurred. Please check your connection.';

    if (error.response) {
      // Server responded with error status (4xx, 5xx)
      const data = error.response.data;
      friendlyMessage = data?.message || `Request failed with status code ${error.response.status}`;
    } else if (error.request) {
      // No response received (network offline or timeout)
      friendlyMessage = 'Server took too long to respond. Please try again.';
    }

    const enhancedError = new Error(friendlyMessage);
    enhancedError.originalError = error;
    enhancedError.status = error.response?.status;
    return Promise.reject(enhancedError);
  }
);

export default apiClient;
