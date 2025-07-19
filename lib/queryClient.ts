import { QueryClient } from '@tanstack/react-query';
import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: typeof window !== 'undefined' 
    ? (process.env.NODE_ENV === 'production' 
        ? window.location.origin 
        : 'http://localhost:3001')
    : 'http://localhost:3001',
  withCredentials: true,
  timeout: 10000,
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized errors
      throw new Error(`401: ${error.response.data.message || 'Unauthorized'}`);
    }
    throw error;
  }
);

// Query function for React Query
export const apiRequest = async ({ queryKey }: { queryKey: string[] }) => {
  const [url] = queryKey;
  const { data } = await api.get(url);
  return data;
};

// Create query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: apiRequest,
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error) => {
        // Don't retry on 401 errors
        if (error.message.includes('401')) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

export default api;