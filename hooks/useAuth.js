import { useQuery } from '@tanstack/react-query';

const apiRequest = async (endpoint) => {
  // In production, try the deployed auth server first, then fallback to relative URL
  const authUrls = process.env.NODE_ENV === 'production' 
    ? ['/api/auth', 'https://workspace-eight-mocha.vercel.app/api/auth'] 
    : ['http://localhost:3001'];
    
  for (const baseUrl of authUrls) {
    try {
      const response = await fetch(`${baseUrl}${endpoint.replace('/api/auth', '')}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        return response.json();
      } else if (response.status === 401) {
        return null; // Not authenticated
      }
    } catch (error) {
      console.log(`Failed to connect to ${baseUrl}, trying next...`);
      continue;
    }
  }
  
  throw new Error('All authentication endpoints failed');
};

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['/api/auth/user'],
    queryFn: () => apiRequest('/api/auth/user'),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  const login = () => {
    // Redirect to auth page instead of API endpoint
    window.location.href = '/auth';
  };

  const logout = async () => {
    const authUrls = process.env.NODE_ENV === 'production' 
      ? ['/api/auth', 'https://workspace-eight-mocha.vercel.app/api/auth'] 
      : ['http://localhost:3001'];
      
    for (const baseUrl of authUrls) {
      try {
        await fetch(`${baseUrl}/logout`, {
          method: 'POST',
          credentials: 'include',
        });
        break;
      } catch (error) {
        continue;
      }
    }
    
    // Refresh page to clear state
    window.location.href = '/';
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