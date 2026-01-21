import React, { createContext, useState, useCallback, useEffect } from 'react';
import { authService } from '../services';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  // Check if user is logged in on mount
  useEffect(() => {
    if (token) {
      // Restore user from localStorage
      const storedUser = localStorage.getItem('userData');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
    setIsLoading(false);
  }, [token]);

  const login = useCallback(async (username, password) => {
    try {
      setIsLoading(true);
      const response = await authService.login(username, password);

      if (response.requiresOTP) {
        // OTP required, return info for OTP page
        return {
          success: true,
          requiresOTP: true,
          userId: response.userId,
          email: response.email,
        };
      }

      // Direct login without OTP
      const userData = response.user || response;
      localStorage.setItem('token', response.token);
      localStorage.setItem('role', response.role);
      localStorage.setItem('userId', response.userId);
      localStorage.setItem('userData', JSON.stringify(userData));

      setToken(response.token);
      setRole(response.role);
      setUserId(response.userId);
      setUser(userData);

      return { success: true, requiresOTP: false };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyOTP = useCallback(async (userId, otp) => {
    try {
      setIsLoading(true);
      const response = await authService.verifyOTP(userId, otp);

      const userData = response.user || response;
      localStorage.setItem('token', response.token);
      localStorage.setItem('role', response.role);
      localStorage.setItem('userId', response.userId);
      localStorage.setItem('userData', JSON.stringify(userData));

      setToken(response.token);
      setRole(response.role);
      setUserId(response.userId);
      setUser(userData);

      return { success: true };
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
    setToken(null);
    setRole(null);
    setUserId(null);
  }, []);

  const isAuthenticated = !!token && !!user;

  const value = {
    user,
    token,
    role,
    userId,
    isLoading,
    isAuthenticated,
    login,
    verifyOTP,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
