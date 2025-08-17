import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthResponse, LoginRequest, RegisterRequest } from '../types/user';
import { apiPost } from '../api/client';

interface AuthContextType {
  token: string | null;
  username: string | null;
  role: string | null;
  isAuthenticated: boolean;
  login: (request: LoginRequest) => Promise<{ success: boolean; error?: string }>;
  register: (request: RegisterRequest) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // Load auth from localStorage on startup
    const stored = localStorage.getItem('auth');
    if (stored) {
      try {
        const auth = JSON.parse(stored);
        setToken(auth.token);
        setUsername(auth.username);
        setRole(auth.role);
      } catch (error) {
        console.error('Failed to parse stored auth:', error);
        localStorage.removeItem('auth');
      }
    }
  }, []);

  const login = async (request: LoginRequest) => {
    const result = await apiPost<AuthResponse>('/auth/login', request);
    if (result.data) {
      const auth = result.data;
      setToken(auth.token);
      setUsername(auth.username);
      setRole(auth.role);
      localStorage.setItem('auth', JSON.stringify(auth));
      return { success: true };
    } else {
      return { success: false, error: result.error || 'Login failed' };
    }
  };

  const register = async (request: RegisterRequest) => {
    const result = await apiPost<AuthResponse>('/auth/register', request);
    if (result.data) {
      const auth = result.data;
      setToken(auth.token);
      setUsername(auth.username);
      setRole(auth.role);
      localStorage.setItem('auth', JSON.stringify(auth));
      return { success: true };
    } else {
      return { success: false, error: result.error || 'Registration failed' };
    }
  };

  const logout = () => {
    setToken(null);
    setUsername(null);
    setRole(null);
    localStorage.removeItem('auth');
  };

  const value: AuthContextType = {
    token,
    username,
    role,
    isAuthenticated: !!token,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
