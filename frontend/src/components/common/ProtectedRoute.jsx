import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requiredPermission, requiredLevel = 'read_only' }) => {
  const { isAuthenticated, loading, hasPermission } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission, requiredLevel)) {
    return <div>Access Denied. You don't have permission to access this page.</div>;
  }

  return children;
};

export default ProtectedRoute;


