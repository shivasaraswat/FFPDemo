import React from 'react';
import { useAuth } from '../../context/AuthContext';

const PermissionGate = ({ 
  children, 
  moduleKey, 
  requiredLevel = 'read_only',
  fallback = null 
}) => {
  const { hasPermission } = useAuth();

  if (!hasPermission(moduleKey, requiredLevel)) {
    return fallback;
  }

  return children;
};

export default PermissionGate;

