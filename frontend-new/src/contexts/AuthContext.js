// frontend-new/src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // <--- NEW: Import useNavigate

export const AuthContext = createContext({
  token: null,
  user: null,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  register: async () => {},
});

// AuthProvider no longer needs to accept 'navigate' as a prop
export const AuthProvider = ({ children }) => { // <--- CHANGE: Removed navigate prop
  const [token, setToken] = useState(localStorage.getItem('authToken') || null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // <--- NEW: Initialize useNavigate hook here

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      setUser({ username: 'AuthenticatedUser' }); // Mock user
    }
    setIsLoading(false);
  }, []);

  const login = async (username, password) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const receivedToken = data.token;
        localStorage.setItem('authToken', receivedToken);
        setToken(receivedToken);
        setUser({ username: username });
        console.log('Login successful:', data);
        navigate('/dashboard'); // <--- CHANGE: Use navigate for redirection
        return { success: true };
      } else {
        console.error('Login failed:', data);
        return { success: false, error: data.detail || 'Invalid credentials. Please check your username and password.' };
      }
    } catch (error) {
      console.error('Network error during login:', error);
      return { success: false, error: 'Network error. Could not connect to the server.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    console.log('User logged out.');
    navigate('/login'); // <--- CHANGE: Use navigate for redirection after logout
  };

  const register = async (username, email, password, password2) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, password2 }),
      });

      const data = await response.json();

      if (response.ok) {
        const receivedToken = data.token;
        localStorage.setItem('authToken', receivedToken);
        setToken(receivedToken);
        setUser({ username: username });
        console.log('Registration successful:', data);
        navigate('/dashboard'); // <--- CHANGE: Use navigate for redirection
        return { success: true };
      } else {
        console.error('Registration failed:', data);
        return { success: false, error: data.detail || data.username?.[0] || data.email?.[0] || 'Registration failed.' };
      }
    } catch (error) {
      console.error('Network error during registration:', error);
      return { success: false, error: 'Network error. Could not connect to the server.' };
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue = {
    token,
    user,
    isLoading,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
