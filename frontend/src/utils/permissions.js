/**
 * Check if user has required permission level
 * @param {Array} permissions - User's permissions array (from /auth/me/permissions)
 * @param {string} moduleKey - Module key (e.g., 'DASHBOARD', 'FIELD_FIX')
 * @param {string} requiredLevel - 'read_only' or 'full_access'
 * @returns {boolean}
 */
export const hasPermission = (permissions, moduleKey, requiredLevel = 'read_only') => {
  if (!permissions || !Array.isArray(permissions)) {
    return false;
  }

  const permission = permissions.find(p => p.moduleKey === moduleKey);
  if (!permission || !permission.access) {
    return false;
  }

  const access = permission.access;

  if (requiredLevel === 'full_access') {
    return access === 'FULL';
  }

  // For read_only, check if access is READ or FULL
  return access === 'READ' || access === 'FULL';
};

/**
 * Get permission level for a module
 * @param {Array} permissions - User's permissions array
 * @param {string} moduleKey - Module key
 * @returns {string|null} - 'FULL', 'READ', 'NONE', or null
 */
export const getPermissionLevel = (permissions, moduleKey) => {
  if (!permissions || !Array.isArray(permissions)) {
    return null;
  }

  const permission = permissions.find(p => p.moduleKey === moduleKey);
  if (!permission) {
    return null;
  }

  return permission.access || null;
};

