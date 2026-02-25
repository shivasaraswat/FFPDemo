const RolePermission = require('../models/RolePermission');
const Role = require('../models/Role');
const Module = require('../models/Module');
const permissionCache = require('../utils/cache');

class PermissionService {
  async getMatrix() {
    // Get all roles and modules
    const roles = await Role.findAll();
    const modules = await Module.findAll();

    // Get all permissions
    const permissions = await RolePermission.getMatrix();
    const permissionMap = new Map();
    
    permissions.forEach(perm => {
      const key = `${perm.roleId}-${perm.moduleKey}`;
      permissionMap.set(key, perm.access);
    });

    // Build matrix: roles × modules
    const matrix = [];

    for (const role of roles) {
      for (const module of modules) {
        const key = `${role.id}-${module.key}`;
        const access = permissionMap.get(key) || 'NONE';
        
        matrix.push({
          id: `${role.id}-${module.key}`, // Composite key for frontend
          roleId: role.id,
          roleName: role.name,
          roleCode: role.code,
          moduleKey: module.key,
          moduleName: module.name,
          access: access
        });
      }
    }

    return matrix;
  }

  async getByRole(roleId) {
    const role = await Role.findById(roleId);
    if (!role) {
      throw new Error('Role not found');
    }

    const permissions = await RolePermission.findByRole(roleId);
    const modules = await Module.findAll();

    const permissionMap = new Map();
    permissions.forEach(perm => {
      permissionMap.set(perm.moduleKey, perm.access);
    });

    return modules.map(module => ({
      moduleKey: module.key,
      moduleName: module.name,
      access: permissionMap.get(module.key) || 'NONE'
    }));
  }

  async bulkUpdate(permissions) {
    if (!permissions || !Array.isArray(permissions) || permissions.length === 0) {
      throw new Error('Permissions array is required');
    }

    // Validate all permissions before updating
    const roles = await Role.findAll();
    const modules = await Module.findAll();
    const roleMap = new Map(roles.map(r => [r.id, r]));
    const moduleMap = new Map(modules.map(m => [m.key, m]));

    for (const perm of permissions) {
      if (!roleMap.has(perm.roleId)) {
        throw new Error(`Role with id ${perm.roleId} not found`);
      }
      if (!moduleMap.has(perm.moduleKey)) {
        throw new Error(`Module with key ${perm.moduleKey} not found`);
      }
      if (!['FULL', 'READ', 'NONE'].includes(perm.access)) {
        throw new Error(`Invalid access value: ${perm.access}. Must be FULL, READ, or NONE`);
      }
    }

    // Build a map of module key to module for quick parent lookup
    const moduleKeyToModule = new Map(modules.map(m => [m.key, m]));

    // Create a map to track permissions by roleId and moduleKey
    // This helps us determine the highest permission level when multiple updates affect the same parent
    const permissionUpdates = new Map();
    
    // Add original permissions to the map
    permissions.forEach(perm => {
      const key = `${perm.roleId}-${perm.moduleKey}`;
      permissionUpdates.set(key, perm);
    });

    // For each permission being updated, check if it's a child module
    // If it is and has access (READ or FULL), automatically grant parent access
    for (const perm of permissions) {
      // Only process if access is being granted (READ or FULL)
      if (perm.access === 'READ' || perm.access === 'FULL') {
        const module = moduleKeyToModule.get(perm.moduleKey);
        
        // If this module has a parent, grant parent access
        if (module && module.parentKey) {
          const parentKey = `${perm.roleId}-${module.parentKey}`;
          
          // Check if parent permission is already in the update list
          const existingParentPerm = permissionUpdates.get(parentKey);
          
          if (existingParentPerm) {
            // Use the highest permission level (FULL > READ > NONE)
            if (perm.access === 'FULL' || existingParentPerm.access === 'FULL') {
              existingParentPerm.access = 'FULL';
            } else if (perm.access === 'READ' || existingParentPerm.access === 'READ') {
              existingParentPerm.access = 'READ';
            }
          } else {
            // Add parent permission with at least READ access (or FULL if child is FULL)
            permissionUpdates.set(parentKey, {
              roleId: perm.roleId,
              moduleKey: module.parentKey,
              access: perm.access // Use same access level as child (FULL or READ)
            });
          }
        }
      }
    }

    // Convert map back to array for bulk update
    const allPermissions = Array.from(permissionUpdates.values());

    // Update permissions (including automatically added parent permissions)
    await RolePermission.bulkUpdate(allPermissions);

    // Invalidate cache for affected roles and modules
    const affectedRoles = new Set(allPermissions.map(p => p.roleId));
    const affectedModules = new Set(allPermissions.map(p => p.moduleKey));

    affectedRoles.forEach(roleId => {
      affectedModules.forEach(moduleKey => {
        permissionCache.invalidate(roleId, moduleKey);
      });
    });

    return this.getMatrix();
  }

  async update(id, access) {
    if (!['FULL', 'READ', 'NONE'].includes(access)) {
      throw new Error('Invalid access value. Must be FULL, READ, or NONE');
    }

    const permission = await RolePermission.update(id, access);
    if (!permission) {
      throw new Error('Permission not found');
    }

    // If access is being granted (READ or FULL), automatically grant parent access
    if (access === 'READ' || access === 'FULL') {
      const modules = await Module.findAll();
      const moduleMap = new Map(modules.map(m => [m.key, m]));
      const module = moduleMap.get(permission.moduleKey);
      
      // If this module has a parent, grant parent access
      if (module && module.parentKey) {
        // Get existing parent permission to determine current access
        const existingParentPerm = await RolePermission.findByRoleAndModule(
          permission.roleId,
          module.parentKey
        );
        
        // Determine the access level for parent
        // Use FULL if child is FULL, or if parent already has FULL
        // Use READ if child is READ and parent doesn't have FULL
        let parentAccess = access; // Default to same as child
        
        if (existingParentPerm) {
          // Use highest permission level (FULL > READ > NONE)
          if (existingParentPerm.access === 'FULL' || access === 'FULL') {
            parentAccess = 'FULL';
          } else if (existingParentPerm.access === 'READ' || access === 'READ') {
            parentAccess = 'READ';
          }
        }
        
        // Update parent permission
        await RolePermission.bulkUpdate([{
          roleId: permission.roleId,
          moduleKey: module.parentKey,
          access: parentAccess
        }]);
        
        // Invalidate cache for parent
        permissionCache.invalidate(permission.roleId, module.parentKey);
      }
    }

    // Invalidate cache
    permissionCache.invalidate(permission.roleId, permission.moduleKey);

    return permission;
  }
}

module.exports = new PermissionService();




