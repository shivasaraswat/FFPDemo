import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService';
import { hasPermission as checkPermission } from '../utils/permissions';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        // Fetch permissions
        loadPermissions();
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('permissions');
      }
    }
    setLoading(false);
  }, []);

  const loadPermissions = async () => {
    try {
      const perms = await authService.getPermissions();
      setPermissions(perms);
      localStorage.setItem('permissions', JSON.stringify(perms));
    } catch (error) {
      console.error('Error loading permissions:', error);
      setPermissions([]);
    }
  };

  const login = async (email, password) => {
    try {
      const result = await authService.login(email, password);
      
      if (result.token && result.user) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        setUser(result.user);
        setIsAuthenticated(true);
        
        // Load permissions
        await loadPermissions();
        
        return { success: true };
      }
      
      return { success: false, error: 'Login failed' };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || error.message || 'Login failed' 
      };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setPermissions([]);
    setIsAuthenticated(false);
  };

  const hasPermission = (moduleKey, requiredLevel = 'read_only') => {
    return checkPermission(permissions, moduleKey, requiredLevel);
  };

  const value = {
    user,
    permissions,
    isAuthenticated,
    loading,
    login,
    logout,
    hasPermission
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
