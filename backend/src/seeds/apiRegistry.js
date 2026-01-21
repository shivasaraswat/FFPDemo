const ApiRegistry = require('../models/ApiRegistry');

// Complete API mappings for the system
// These are the initial APIs that need to be registered for RBAC to work
const apiMappings = [
  // Auth APIs
  { method: 'POST', path: '/api/auth/login', moduleKey: 'USER_MANAGEMENT', requiredAccess: 'READ' },
  { method: 'POST', path: '/api/auth/register', moduleKey: 'MANAGE_USERS', requiredAccess: 'FULL' },
  { method: 'GET', path: '/api/auth/me', moduleKey: 'USER_MANAGEMENT', requiredAccess: 'READ' },
  { method: 'GET', path: '/api/auth/me/permissions', moduleKey: 'USER_MANAGEMENT', requiredAccess: 'READ' },

  // Role APIs
  { method: 'GET', path: '/api/roles', moduleKey: 'MANAGE_ROLES', requiredAccess: 'READ' },
  { method: 'GET', path: '/api/roles/:id', moduleKey: 'MANAGE_ROLES', requiredAccess: 'READ' },
  { method: 'POST', path: '/api/roles', moduleKey: 'MANAGE_ROLES', requiredAccess: 'FULL' },
  { method: 'PUT', path: '/api/roles/:id', moduleKey: 'MANAGE_ROLES', requiredAccess: 'FULL' },
  { method: 'DELETE', path: '/api/roles/:id', moduleKey: 'MANAGE_ROLES', requiredAccess: 'FULL' },

  // Module APIs
  { method: 'GET', path: '/api/modules', moduleKey: 'MANAGE_ROLES', requiredAccess: 'READ' },
  { method: 'GET', path: '/api/modules/:key', moduleKey: 'MANAGE_ROLES', requiredAccess: 'READ' },
  { method: 'POST', path: '/api/modules', moduleKey: 'MANAGE_ROLES', requiredAccess: 'FULL' },
  { method: 'PUT', path: '/api/modules/:key', moduleKey: 'MANAGE_ROLES', requiredAccess: 'FULL' },
  { method: 'DELETE', path: '/api/modules/:key', moduleKey: 'MANAGE_ROLES', requiredAccess: 'FULL' },

  // Permission APIs
  { method: 'GET', path: '/api/permissions', moduleKey: 'MANAGE_ROLES', requiredAccess: 'READ' },
  { method: 'GET', path: '/api/permissions/role/:roleId', moduleKey: 'MANAGE_ROLES', requiredAccess: 'READ' },
  { method: 'POST', path: '/api/permissions', moduleKey: 'MANAGE_ROLES', requiredAccess: 'FULL' },
  { method: 'PUT', path: '/api/permissions/:id', moduleKey: 'MANAGE_ROLES', requiredAccess: 'FULL' },

  // User APIs
  { method: 'GET', path: '/api/users', moduleKey: 'MANAGE_USERS', requiredAccess: 'READ' },
  { method: 'GET', path: '/api/users/:id', moduleKey: 'MANAGE_USERS', requiredAccess: 'READ' },
  { method: 'POST', path: '/api/users', moduleKey: 'MANAGE_USERS', requiredAccess: 'FULL' },
  { method: 'PUT', path: '/api/users/:id', moduleKey: 'MANAGE_USERS', requiredAccess: 'FULL' },
  { method: 'PATCH', path: '/api/users/:id/activate', moduleKey: 'DEACTIVATED_USERS', requiredAccess: 'FULL' },
  { method: 'PATCH', path: '/api/users/:id/deactivate', moduleKey: 'DEACTIVATED_USERS', requiredAccess: 'FULL' },
  { method: 'DELETE', path: '/api/users/:id', moduleKey: 'MANAGE_USERS', requiredAccess: 'FULL' },

  // API Registry APIs (CRITICAL - needed to access API Registry screen)
  { method: 'GET', path: '/api/api-registry', moduleKey: 'MANAGE_ROLES', requiredAccess: 'READ' },
  { method: 'GET', path: '/api/api-registry/:id', moduleKey: 'MANAGE_ROLES', requiredAccess: 'READ' },
  { method: 'GET', path: '/api/api-registry/module/:moduleKey', moduleKey: 'MANAGE_ROLES', requiredAccess: 'READ' },
  { method: 'POST', path: '/api/api-registry', moduleKey: 'MANAGE_ROLES', requiredAccess: 'FULL' },
  { method: 'PUT', path: '/api/api-registry/:id', moduleKey: 'MANAGE_ROLES', requiredAccess: 'FULL' },
  { method: 'DELETE', path: '/api/api-registry/:id', moduleKey: 'MANAGE_ROLES', requiredAccess: 'FULL' }
];

async function seedApiRegistry() {
  console.log('🌱 Seeding API registry...');
  
  for (const apiData of apiMappings) {
    try {
      const existing = await ApiRegistry.findByMethodAndPath(apiData.method, apiData.path);
      if (existing) {
        console.log(`  ⏭️  API ${apiData.method} ${apiData.path} already exists, skipping...`);
        continue;
      }

      const api = await ApiRegistry.create(apiData);
      console.log(`  ✅ Registered API: ${api.method} ${api.path} -> ${api.moduleKey}`);
    } catch (error) {
      console.error(`  ❌ Error registering API ${apiData.method} ${apiData.path}:`, error.message);
    }
  }

  console.log('✅ API registry seeding completed!\n');
}

module.exports = seedApiRegistry;

