const ApiRegistry = require('../models/ApiRegistry');
const RolePermission = require('../models/RolePermission');
const Module = require('../models/Module');
const permissionCache = require('../utils/cache');

// Public endpoints that don't require authorization
const publicEndpoints = [
  { method: 'POST', path: '/api/auth/login' },
  { method: 'GET', path: '/health' }
];

const isPublicEndpoint = (method, path) => {
  return publicEndpoints.some(
    endpoint => endpoint.method === method && endpoint.path === path
  );
};

const rbac = async (req, res, next) => {
  try {
    const method = req.method;
    // Get the full path - req.path is relative to mount point, so we need to combine baseUrl + path
    // For routes mounted at /api/modules, req.path will be "/" but we need "/api/modules"
    let path = req.originalUrl ? req.originalUrl.split('?')[0] : req.path;
    
    // If originalUrl doesn't exist or doesn't start with /api, construct from baseUrl + path
    if (!path.startsWith('/api')) {
      const basePath = req.baseUrl || '';
      const relativePath = req.path || '/';
      path = (basePath + relativePath).split('?')[0];
    }

    // Debug logging (remove in production)
    if (process.env.NODE_ENV === 'development') {
      console.log(`[RBAC] ${method} ${path} | baseUrl: ${req.baseUrl} | req.path: ${req.path} | originalUrl: ${req.originalUrl}`);
    }

    // Skip RBAC for public endpoints
    if (isPublicEndpoint(method, path)) {
      return next();
    }

    // User must be authenticated (should be set by auth middleware)
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Look up API in registry
    const apiRegistry = await ApiRegistry.matchApi(method, path);

    if (!apiRegistry) {
      // API not registered - deny by default (secure by default)
      return res.status(403).json({ 
        error: 'Access denied. API endpoint not registered.' 
      });
    }

    const { moduleKey, requiredAccess } = apiRegistry;
    const roleId = req.user.roleId;

    // Check permission with caching
    const hasAccess = await checkPermission(roleId, moduleKey, requiredAccess);

    if (!hasAccess) {
      return res.status(403).json({ 
        error: 'Access denied. Insufficient permissions.' 
      });
    }

    // Permission granted
    next();
  } catch (error) {
    console.error('RBAC middleware error:', error);
    return res.status(500).json({ error: 'Authorization error' });
  }
};

async function checkPermission(roleId, moduleKey, requiredAccess) {
  // Check cache first
  const cacheKey = `${roleId}:${moduleKey}`;
  const cached = permissionCache.get(roleId, moduleKey);
  
  if (cached !== null) {
    return hasRequiredAccess(cached, requiredAccess);
  }

  // Get module to check parent
  const module = await Module.findByKey(moduleKey);
  if (!module) {
    return false;
  }

  // Check parent permission first (if exists)
  if (module.parentKey) {
    const parentPermission = await getPermissionFromDB(roleId, module.parentKey);
    
    // If parent is NONE, deny access immediately
    if (!parentPermission || parentPermission.access === 'NONE') {
      permissionCache.set(roleId, moduleKey, 'NONE');
      return false;
    }
  }

  // Check child module permission
  const permission = await getPermissionFromDB(roleId, moduleKey);
  const access = permission ? permission.access : 'NONE';

  // Cache the result
  permissionCache.set(roleId, moduleKey, access);

  return hasRequiredAccess(access, requiredAccess);
}

async function getPermissionFromDB(roleId, moduleKey) {
  return await RolePermission.findByRoleAndModule(roleId, moduleKey);
}

function hasRequiredAccess(userAccess, requiredAccess) {
  // If user has NONE, deny
  if (userAccess === 'NONE') {
    return false;
  }

  // If required is READ, both READ and FULL are sufficient
  if (requiredAccess === 'READ') {
    return userAccess === 'READ' || userAccess === 'FULL';
  }

  // If required is FULL, only FULL is sufficient
  if (requiredAccess === 'FULL') {
    return userAccess === 'FULL';
  }

  return false;
}

module.exports = rbac;

