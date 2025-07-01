import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // Add user state to store role and other data
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:5000/api/auth/validate-token', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data.user || null); // Assume backend returns user data
          setIsAuthenticated(true);
        } catch (err) {
          console.error('Token validation failed:', err.response?.data || err.message);
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    validateToken();
  }, []);

  const login = async (username, password) => {
    try {
      console.log('Sending login request:', { username, password });
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password,
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user); // Store user object (e.g., { role, ... })
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
    setUser(null); // Clear user on logout
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ login, logout, isAuthenticated, user }}> {/* Add user to context value */}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);