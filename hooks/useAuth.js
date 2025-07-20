import { useQuery } from '@tanstack/react-query';

const apiRequest = async (endpoint) => {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? '' 
    : 'http://localhost:3001';
    
  const response = await fetch(`${baseUrl}${endpoint}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  return response.json();
};

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['/api/auth/user'],
    queryFn: () => apiRequest('/api/auth/user'),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const login = () => {
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? '' 
      : 'http://localhost:3001';
    window.location.href = `${baseUrl}/api/login`;
  };

  const logout = () => {
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? '' 
      : 'http://localhost:3001';
    window.location.href = `${baseUrl}/api/logout`;
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    login,
    logout,
  };
}