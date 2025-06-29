import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';
import PropTypes from 'prop-types';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on app load
    const checkAuth = () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (currentUser && authService.isAuthenticated()) {
          setUser(currentUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setUser(null);
        authService.removeToken(); // Clear invalid token
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const signUp = async (userData) => {
    try {
      const response = await authService.signup(userData);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const signIn = async (credentials) => {
    try {
      const response = await authService.signin(credentials);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authService.signout();
      setUser(null);
    } catch (error) {
      console.error('Signout error:', error);
      // Even if the API call fails, clear local state
      setUser(null);
    }
  };

  const value = {
    signUp,
    signIn,
    signOut,
    user,
    isAuthenticated: authService.isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 