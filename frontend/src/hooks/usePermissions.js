import { useAuth } from '../context/AuthContext';

export const usePermissions = () => {
  const { hasPermission, permissions, user } = useAuth();

  const checkPermission = (moduleKey, requiredLevel = 'read_only') => {
    return hasPermission(moduleKey, requiredLevel);
  };

  return {
    hasPermission: checkPermission,
    permissions,
    userRole: user?.roleName || user?.roleCode
  };
};

