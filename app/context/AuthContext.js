"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }

        // Get user data from localStorage
        const userEmail = localStorage.getItem('userEmail');
        const userId = localStorage.getItem('userId');
        
        if (userEmail) {
          setUser({ 
            email: userEmail,
            _id: userId || 'unknown' // Set _id to ensure it exists
          });
        } else {
          // If no email stored but token exists, we still consider them logged in
          // but with limited info
          setUser({ 
            email: 'User',
            _id: userId || 'unknown'
          });
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    setUser(null);
    router.push('/login');
  };

  // Login function to update context
  const login = (userData, token) => {
    // Ensure userData has required properties
    if (!userData) {
      console.error('Login error: User data is missing');
      return;
    }
    
    // Store token and user data in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('userEmail', userData.email || '');
    
    // Store user ID if available
    if (userData._id) {
      localStorage.setItem('userId', userData._id);
    }
    
    // Update user state
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext; 