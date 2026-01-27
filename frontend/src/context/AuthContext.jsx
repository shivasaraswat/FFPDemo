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
  const [selectedRole, setSelectedRole] = useState(null);
  const [language, setLanguage] = useState('en'); // Language state for UI
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
        
        // Set language from user profile, fallback to stored language, then default to 'en'
        const userLanguage = parsedUser.language || localStorage.getItem('language') || 'en';
        setLanguage(userLanguage);
        localStorage.setItem('language', userLanguage);
        
        // Set default selected role for RC/GD users
        if (parsedUser.roles) {
          const rcGdRoles = parsedUser.roles.filter(r => r.code === 'RC' || r.code === 'GD');
          if (rcGdRoles.length > 0) {
            const storedSelectedRole = localStorage.getItem('selectedRole');
            const defaultRole = storedSelectedRole || rcGdRoles[0].code;
            setSelectedRole(defaultRole);
            // Load permissions for selected role
            loadPermissions(defaultRole);
          } else {
            // Load all permissions if no RC/GD roles
            loadPermissions();
          }
        } else {
          // Load all permissions
          loadPermissions();
        }
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('permissions');
        localStorage.removeItem('selectedRole');
        localStorage.removeItem('language');
      }
    } else {
      // No user logged in, use default language
      const storedLanguage = localStorage.getItem('language') || 'en';
      setLanguage(storedLanguage);
    }
    setLoading(false);
  }, []);

  const loadPermissions = async (roleCode = null) => {
    try {
      const perms = await authService.getPermissions(roleCode);
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
        
        // Set language from user profile, fallback to 'en'
        const userLanguage = result.user.language || 'en';
        setLanguage(userLanguage);
        localStorage.setItem('language', userLanguage);
        
        // Set default selected role for RC/GD users
        if (result.user.roles) {
          const rcGdRoles = result.user.roles.filter(r => r.code === 'RC' || r.code === 'GD');
          if (rcGdRoles.length > 0) {
            const defaultRole = rcGdRoles[0].code;
            setSelectedRole(defaultRole);
            localStorage.setItem('selectedRole', defaultRole);
            // Load permissions for selected role
            await loadPermissions(defaultRole);
          } else {
            // Load all permissions if no RC/GD roles
            await loadPermissions();
          }
        } else {
          // Load all permissions
          await loadPermissions();
        }
        
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
    setSelectedRole(null);
    setLanguage('en');
    setIsAuthenticated(false);
    localStorage.removeItem('selectedRole');
    localStorage.removeItem('language');
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const handleRoleChange = async (roleCode) => {
    setSelectedRole(roleCode);
    localStorage.setItem('selectedRole', roleCode);
    // Reload permissions for the selected role
    await loadPermissions(roleCode);
  };

  const hasPermission = (moduleKey, requiredLevel = 'read_only') => {
    return checkPermission(permissions, moduleKey, requiredLevel);
  };

  const value = {
    user,
    permissions,
    selectedRole,
    setSelectedRole: handleRoleChange,
    language,
    setLanguage: handleLanguageChange,
    isAuthenticated,
    loading,
    login,
    logout,
    hasPermission
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
