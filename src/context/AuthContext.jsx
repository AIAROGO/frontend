import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../services/api/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axiosInstance.get('/api/auth/validate-token', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data.user || null);
          setIsAuthenticated(true);
        } catch (err) {
          console.error('Token validation failed:', err.response?.data || err.message);
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setUser(null);
        }
      }
      setLoading(false);
    };
    validateToken();
  }, []);

  const login = async (username, password) => {
    try {
      console.log('Sending login request:', { username, password });
      const response = await axiosInstance.post('/api/auth/login', {
        username,
        password,
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      setIsAuthenticated(true);
      return user;
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ login, logout, isAuthenticated, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);