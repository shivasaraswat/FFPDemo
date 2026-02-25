import React, { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * SmartRedirect component that redirects to the first available tab
 * based on user permissions instead of hardcoding a specific tab
 */
const SmartRedirect = ({ basePath, tabs }) => {
  const { hasPermission } = useAuth();

  // Find the first tab the user has permission for
  const firstAvailableTab = useMemo(() => {
    for (const tab of tabs) {
      if (hasPermission(tab.accessObjectName, 'read_only')) {
        return tab.key;
      }
    }
    return null;
  }, [tabs, hasPermission]);

  // If no tabs available, redirect to dashboard
  if (!firstAvailableTab) {
    return <Navigate to="/dashboard" replace />;
  }

  // Redirect to the first available tab
  return <Navigate to={`${basePath}/${firstAvailableTab}`} replace />;
};

export default SmartRedirect;

