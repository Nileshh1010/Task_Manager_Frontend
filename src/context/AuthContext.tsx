import React, { createContext, useContext, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/apiService';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { user: userData, token } = await authService.login(email, password);
      setUser(userData);
      setIsAuthenticated(true);
      toast({
        title: 'Success',
        description: 'Logged in successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Login failed',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      await authService.register(name, email, password);
      toast({
        title: 'Success',
        description: 'Registration successful',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Registration failed',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      toast({
        title: 'Success',
        description: 'Logged out successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Logout failed',
        variant: 'destructive',
      });
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
