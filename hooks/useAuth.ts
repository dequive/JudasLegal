import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";

export interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  refetch: () => void;
}

const API_BASE = process.env.NODE_ENV === 'production' 
  ? `https://${process.env.NEXT_PUBLIC_AUTH_URL || 'judas-auth.vercel.app'}`
  : 'http://localhost:3001';

export function useAuth(): AuthContextType {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: user, isLoading, refetch } = useQuery({
    queryKey: ['/api/auth/user'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/api/auth/user`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        return null;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const login = () => {
    window.location.href = `${API_BASE}/api/login`;
  };

  const logout = () => {
    queryClient.clear();
    window.location.href = `${API_BASE}/api/logout`;
  };

  return {
    user: user || null,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refetch,
  };
}

export function isUnauthorizedError(error: Error): boolean {
  return /^401: .*Unauthorized/.test(error.message) || 
         error.message.includes('Not authenticated') ||
         error.message.includes('Unauthorized');
}