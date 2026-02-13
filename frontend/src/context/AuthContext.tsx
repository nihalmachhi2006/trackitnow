import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { UserProfile } from '../types';
import { userApi } from '../services/api';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  setUser: (user: UserProfile) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setTokenState] = useState<string | null>(
    localStorage.getItem('access_token')
  );
  const [isLoading, setIsLoading] = useState(true);

  const setToken = (newToken: string) => {
    localStorage.setItem('access_token', newToken);
    setTokenState(newToken);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setTokenState(null);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const profile = await userApi.getProfile();
      setUser(profile);
    } catch {
      logout();
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const profile = await userApi.getProfile();
          setUser(profile);
        } catch {
          logout();
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, [token]);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading,
      isAuthenticated: !!token && !!user,
      setToken,
      setUser,
      logout,
      refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
